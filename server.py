from flask import Flask, request, jsonify, send_file, render_template, url_for, send_from_directory
from flask_cors import CORS
import os
import tensorflow as tf
import glob
import datetime
import shutil
from config import Config
from convert import StyleFrame
from PIL import Image
import io
from base64 import encodebytes

from pymongo import MongoClient
client= MongoClient("mongo",27017)
db = client["neuralvids"]
col=db["vids"]

app=Flask(__name__,static_folder="frontend/build/static",template_folder="frontend/build")
CORS(app)

#Helper function to convert image to to base64
def get_response_image(image_path):
    pil_img = Image.open(image_path, mode='r')
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format='PNG')
    encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') 
    return encoded_img
 
@app.route('/')
def start():
   return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),'fav.ico', mimetype='image/vnd.microsoft.icon')

#Saves the initial video
@app.route("/video",methods=['GET','POST'])
def savevid():
   data=request.files['video/mp4']
   data.save(Config.INPUT_VIDEO_PATH)
   return jsonify("ok")
 
#Saves the images and performs neural style transfer
@app.route("/imagess",methods=['GET','POST'])
def styler(): 
   data=request.files.getlist('fil')
   n=len(data)
   style_seq=[i for i in range(n)]
   if(n<2):
      style_seq.append(0)
   Config.STYLE_SEQUENCE=style_seq
   for i,img in enumerate(data):
      img.save(f"{Config.STYLE_REF_DIRECTORY}/{i}.jpg")
   StyleFrame(Config).run()
   filelist=[f for f in os.listdir(Config.STYLE_REF_DIRECTORY)]
   for f in filelist:
      os.remove(os.path.join(Config.STYLE_REF_DIRECTORY, f))
   return send_file(Config.OUTPUT_VIDEO_PATH,mimetype="video/mp4")

#Saves the video and a thumbnail to mongodb
@app.route("/cloud",methods=['GET','POST'])
def savedb():
   s=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
   v_id=col.insert_one({"time":s}).inserted_id
   s_img= f'{Config.ARCHIVE_DIRECTORY}/{str(v_id)}.png'
   s_vid= f'{Config.ARCHIVE_DIRECTORY}/{str(v_id)}.mp4'
   shutil.copyfile(f"{Config.OUTPUT_FRAME_DIRECTORY}/0000_frame.png",s_img)
   shutil.copyfile(f"{Config.OUTPUT_VIDEO_PATH}",s_vid)
   tnail = Image.open(s_img)
   tnail = tnail.resize((160,90))
   tnail.save(s_img, optimize=True, quality=75)
   return jsonify("ok")

#Returns the requested video for collections
@app.route("/currentvid",methods=['GET','POST'])
def retvid():
   file=request.get_json()
   if file=="random":
      file=str(col.find_one()['_id'])
   route= f'{Config.ARCHIVE_DIRECTORY}/{file}.mp4'
   return send_file(route,mimetype="video/mp4")

#Returns the thumbnails according to order
@app.route("/thumbnail",methods=['GET','POST'])
def retthumbnail():
   order=request.args.get('order')
   l=col.find({}).sort({'time': int(order)})
   encoded=[]
   ids=[]
   timestamps=[]
   for imgdict in l:
      ipath=f"{Config.ARCHIVE_DIRECTORY}/{str(imgdict['_id'])}.png"
      encoded.append(get_response_image(ipath))
      ids.append(str(imgdict['_id']))
      timestamps.append(imgdict['time'])
   return jsonify({'result': encoded,"id":ids,"time":timestamps})

def check_file_structure():
   dirs = [ 
      "./data/",
      Config.INPUT_FRAME_DIRECTORY,
      Config.OUTPUT_FRAME_DIRECTORY,
      Config.STYLE_REF_DIRECTORY,
      Config.ARCHIVE_DIRECTORY
   ]
   for dir in dirs:
      if not os.path.exists(dir):
         print("Creating dir: ", dir)
         os.mkdir(dir)

if __name__ == '__main__':
   check_file_structure()
   app.run(host='0.0.0.0')
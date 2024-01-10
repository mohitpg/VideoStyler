from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import os
import tensorflow as tf
import glob
import cv2
import datetime
import shutil
import zipfile
from config import Config
from convert import StyleFrame
from PIL import Image
import io
from base64 import encodebytes

from pymongo import MongoClient
client= MongoClient("localhost",27017)
db = client["neuralvids"]
col=db["vids"]

app = Flask(__name__)
CORS(app)

def get_response_image(image_path):
    pil_img = Image.open(image_path, mode='r') # reads the PIL image
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format='PNG') # convert the PIL image to byte array
    encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
    return encoded_img
 
@app.route('/')
def start():
   s=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
   v_id=col.insert_one({"time":s}).inserted_id
   s_img=".././videos/"+str(v_id)+".png"
   s_vid=".././videos/"+str(v_id)+".mp4"
   shutil.copy("./output_frames/0000_frame.png",s_img)
   shutil.copy("./output_video.mp4",s_vid)
   return 'ok'

@app.route("/video",methods=['GET','POST'])
def savevid():
   data=request.files['video/mp4']
   data.save("./input_video.mp4")
   return jsonify("ok")
 
@app.route("/imagess",methods=['GET','POST'])
def styler(): 
   data=request.files.getlist('fil')
   n=len(data)
   style_seq=[i for i in range(n)]
   if(n<2):
      style_seq.append(0)
   Config.STYLE_SEQUENCE=style_seq
   for i,img in enumerate(data):
      img.save(f"./style_ref/{i}.jpg")
   StyleFrame(Config).run()
   filelist=[f for f in os.listdir("./style_ref")]
   for f in filelist:
      os.remove(os.path.join("./style_ref", f))
   return send_file("./output_video.mp4",mimetype="video/mp4")

@app.route("/cloud",methods=['GET','POST'])
def savedb():
   s=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
   v_id=col.insert_one({"time":s}).inserted_id
   s_img="./vids/"+str(v_id)+".png"
   s_vid="./vids/"+str(v_id)+".mp4"
   shutil.copyfile("./output_frames/0000_frame.png",s_img)
   shutil.copyfile("./output_video.mp4",s_vid)
   return jsonify("ok")

@app.route("/currentvid",methods=['GET','POST'])
def retvid():
   file=request.get_json()
   if file=="random":
      file="659d57e9603b5f2e6f33e1a6"
   route="./vids/"+file+".mp4"
   return send_file(route,mimetype="video/mp4")

@app.route("/thumbnail",methods=['GET','POST'])
def retthumbnail():
   order=request.args.get('order')
   l=col.find({}).sort({'time': int(order)})
   encoded=[]
   for imgdict in l:
      ipath="./vids/"+str(imgdict['_id'])+".png"
      encoded.append(get_response_image(ipath))
   return jsonify({'result': encoded})

if __name__ == '__main__':
   app.run(debug=True)
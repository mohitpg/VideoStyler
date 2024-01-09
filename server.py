from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import os
import tensorflow as tf
import glob
import cv2
import datetime
import shutil
from config import Config
from convert import StyleFrame

from pymongo import MongoClient
client= MongoClient("localhost",27017)
db = client["neuralvids"]
col=db["vids"]

app = Flask(__name__)
CORS(app)
 
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
      style_seq.append(None)
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
def ret():
   file=request.get_json()
   route="./vids/"+file+".mp4"
   return send_file(route,mimetype="video/mp4")
if __name__ == '__main__':
   app.run(debug=True)
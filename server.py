from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import os
import tensorflow as tf
import glob
import cv2
from config import Config
from convert import StyleFrame
app = Flask(__name__)
CORS(app)
 
@app.route('/')
def start():
   return 'ok'

@app.route("/video",methods=['GET','POST'])
def savevid():
   data=request.files['video/mp4']
   data.save("./input_video.mp4")
   return jsonify("ok")
 
@app.route("/imagess",methods=['GET','POST'])
def saveimg(): 
   data=request.files.getlist('fil')
   n=len(data)
   style_seq=[i for i in range(n)]
   Config.STYLE_SEQUENCE=style_seq
   for i,img in enumerate(data):
      img.save(f"./style_ref/{i}.jpg")
   StyleFrame(Config).run()
   filelist=[f for f in os.listdir("./style_ref")]
   for f in filelist:
      os.remove(os.path.join("./style_ref", f))
   return send_file("./output_video.mp4",mimetype="video/mp4")

if __name__ == '__main__':
   app.run(debug=True)
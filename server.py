from flask import Flask, request, jsonify
from flask_cors import CORS
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
   print("hello")
   data=request.files.getlist('fil')
   for i,img in enumerate(data):
      img.save(f"./{i}.jpg")
   print(data)
   return jsonify("ok")

if __name__ == '__main__':
   app.run(debug=True)
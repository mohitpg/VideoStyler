ARG OPENCV_VERSION="4.8.0"

FROM node:alpine

WORKDIR /app/frontend

ADD ./frontend/package.json ./package.json

RUN npm install

ADD ./frontend/public ./public
ADD ./frontend/src ./src

RUN npm run build

FROM python:3.11.7

RUN apt-get clean && \
    apt-get update && \
    apt-get install -y \
    ffmpeg

WORKDIR /app

ADD ./requirements.txt ./requirements.txt

RUN pip install -r requirements.txt

COPY --from=0 /app/frontend ./frontend

ADD ./*.py .

CMD [ "python", "-u", "server.py"]

FROM node:alpine

WORKDIR /app

COPY . .

WORKDIR /app/frontend

RUN npm install

RUN npm run build

WORKDIR /app

FROM python:3.11.7

WORKDIR /app

COPY --from=0 /app .

RUN pip install -r requirements.txt

CMD [ "python", "server.py"]



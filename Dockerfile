FROM node:11-alpine

WORKDIR /usr/src/app

COPY app ./

RUN npm install

CMD npm start
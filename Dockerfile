FROM node:11-alpine

WORKDIR /usr/src/app

COPY app ./

RUN npm install -g serve yarn && yarn install

RUN yarn build

WORKDIR /usr/src/app/dist

CMD serve -l 1234
FROM node:11-alpine AS builder
WORKDIR /usr/src/app
COPY app ./
RUN npm install -g yarn && yarn install
RUN yarn build

FROM node:11-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist .
RUN npm install -g serve
WORKDIR /usr/src/app
CMD serve -l 1234
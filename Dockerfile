FROM node:22-alpine

ENV MONGODB_URI=mongodb://root:example@mongo:27017/todos?authSource=admin

RUN mkdir -p /home/app

COPY . /home/app

CMD ["node", "/home/app/app.js"]
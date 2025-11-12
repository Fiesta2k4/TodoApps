FROM node:22-alpine

RUN apk add --no-cache docker-cli bash
ENV DOCKER_HOST=tcp://host.docker.internal:2375
WORKDIR /workspace

ENV MONGODB_URI=mongodb://root:example@mongo:27017/todos?authSource=admin

RUN mkdir -p /home/app

COPY . /home/app

CMD ["node", "/home/app/app.js"]
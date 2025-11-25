FROM node:22-alpine

RUN apk add --no-cache docker-cli bash
ENV DOCKER_HOST=tcp://host.docker.internal:2375

WORKDIR /home/app

COPY package*.json ./
RUN npm install

COPY . .

ENV MONGODB_URI=mongodb://root:example@mongo:27017/todos?authSource=admin

CMD ["node", "app.js"]
EXPOSE 3001
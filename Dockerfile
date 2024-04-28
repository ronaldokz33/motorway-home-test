FROM node:18.12.1-alpine

WORKDIR /home/node/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm i

COPY ./src ./src

RUN npm run build
CMD ["npm", "run", "start"]
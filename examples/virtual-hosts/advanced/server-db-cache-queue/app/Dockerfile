FROM node:latest

RUN npm i pm2 --global --ignore-scripts --omit=dev

WORKDIR /usr/app

CMD ["pm2-runtime", "/usr/app/index.js"]

FROM node:18

ENV PORT=3001

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

USER node
CMD npm run dev
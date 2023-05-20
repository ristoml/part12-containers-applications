FROM node:18

ENV PORT=3001

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

RUN npm run lint

RUN CI=true npm test
  
USER node

CMD npm start
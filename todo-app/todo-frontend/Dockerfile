FROM node:16.20.0
WORKDIR /usr/src/app

ENV REACT_APP_BACKEND_URL=/api

COPY  . .

RUN npm ci

RUN CI=true npm test

RUN npm run build

RUN npm install -g serve
CMD ["serve", "build"]


FROM node:16.20.0
ENV PORT=3001  
WORKDIR /usr/src/app

COPY --chown=node:node . .
RUN npm ci 
  
USER node
CMD npm start
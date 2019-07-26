#####################
### builder image ###
FROM node:12-alpine as builder

ENV PATH=$PATH:/usr/app/node_modules/.bin
ENV NODE_ENV=production

# A wildcard is used to ensure both package.json AND package-lock.json are
# copied where available (npm@5+)
COPY --chown=node:node package*.json /usr/app/

RUN npm install -g --only=production /usr/app

COPY --chown=node:node config /usr/app/config
COPY --chown=node:node ./src /usr/app/src

WORKDIR /usr/app

EXPOSE 8009

##########################
#### production image ###
FROM builder as production

USER node

CMD [ "node", "src/index.js" ]

##########################
#### production image ###
FROM builder as development

ENV NODE_ENV=development

COPY --chown=node:node .eslintrc /usr/app/.eslintrc
RUN npm install -D /usr/app/

USER node

CMD [ "nodemon", "src/index.js" ]

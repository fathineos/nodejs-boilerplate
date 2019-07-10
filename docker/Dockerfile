#####################
### builder image ###
#####################

FROM node:14.4-alpine3.10 as builder

ARG USER_ID
ARG GROUP_ID

RUN deluser node && \
    addgroup -g ${GROUP_ID} node && \
    adduser -u ${USER_ID} -D node -G node

COPY --chown=node:node package.json package-lock.json /usr/app/

USER node
WORKDIR /usr/app

ENTRYPOINT ["npm"]

EXPOSE 8080 9090


########################
### production image ###
########################

FROM builder as production

ENV NODE_ENV=production

# Install packages from package-lock.json to avoid deploying unexpected
# package versions. Then, remove all not production packages.
RUN npm ci --only=prod

COPY --chown=node:node config /usr/app/config
COPY --chown=node:node ./src /usr/app/src

CMD ["run", "start-worker"]


#########################
### development image ###
#########################

FROM builder as devel

ENV NODE_ENV=development

RUN npm ci

COPY --chown=node:node config /usr/app/config
COPY --chown=node:node ./src /usr/app/src

CMD ["run", "start-worker-dev"]

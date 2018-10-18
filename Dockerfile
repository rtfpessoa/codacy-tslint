FROM node:8-alpine AS build

LABEL maintainer="Rodrigo Fernandes <rodrigo@codacy.com>"

ENV NODE_PATH /usr/lib/node_modules

COPY . /workdir

WORKDIR /workdir

RUN \
  yarn && \
  yarn run build && \
  yarn run docs:gen

FROM node:8-alpine

LABEL maintainer="Rodrigo Fernandes <rodrigo@codacy.com>"

ENV NODE_PATH /app/node_modules
ENV PATH /app/node_modules/.bin:$PATH

RUN adduser -u 2004 -D docker

COPY --from=build --chown=docker:docker /workdir/build/main /app/build/main
COPY --from=build --chown=docker:docker /workdir/package.json /app/package.json
COPY --from=build --chown=docker:docker /workdir/yarn.lock /app/yarn.lock
COPY --from=build --chown=docker:docker /workdir/docs /docs
COPY --from=build --chown=docker:docker /workdir/docs-tests /docs/tests

WORKDIR /app

RUN \
  yarn install --production --cache-folder /tmp/yarn-cache && \
  yarn link && \
  chmod +x /app/build/main/index.js && \
  rm -rf /tmp/yarn-cache /root/.yarn

WORKDIR /src

USER docker

ENTRYPOINT ["codacy-tslint"]
CMD []  

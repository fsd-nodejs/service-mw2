FROM node:14.17.3-buster-slim AS BUILD_IMAGE

WORKDIR /home

COPY . .

RUN npm install --registry=https://registry.npm.taobao.org && \
    npm run build && \
    npm prune --production

FROM node:14.17.3-alpine3.14

WORKDIR /home

COPY --from=BUILD_IMAGE /home /home

EXPOSE 9000

ENTRYPOINT ["node", "bootstrap.js"]
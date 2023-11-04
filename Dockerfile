FROM node:16.10.0-alpine

RUN apk add --no-cache --virtual .gyp g++

# Optional argument that can be passed in
WORKDIR /app

# Load npm dependencies
COPY package.json /app
COPY yarn.lock /app
RUN yarn install

ENV NODE_OPTIONS=--max_old_space_size=4096

COPY . /app
RUN chmod +x ./src/app.ts
RUN yarn build && apk del .gyp

CMD ["./dist/src/app.js"]

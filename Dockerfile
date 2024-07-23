FROM node:20 as setup

WORKDIR /app/protocol_docs
COPY protocol_docs/package*.json ./
RUN npm ci --ignore-scripts

WORKDIR /app
COPY ./package*.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json /app
COPY gulpfile.js /app
COPY protocol_docs/ /app/protocol_docs
COPY src /app/src
RUN npm run docs

FROM nginx:alpine

COPY --from=setup ./app/protocol_docs/build/ ./usr/share/nginx/html
EXPOSE 80


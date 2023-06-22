FROM node:lts as base

FROM base as build

RUN npm i -g pnpm

WORKDIR /build

COPY package*.json ./
COPY pnpm-lock.yaml ./
ENV NODE_ENV=production
RUN pnpm i

COPY mongodb-connection-string-url.d.ts ./mongodb-connection-string-url.d.ts
COPY next.config.js ./next.config.js
COPY app ./app
COPY public ./public
COPY tsconfig.json ./tsconfig.json

RUN pnpm build

EXPOSE 80
ENV PORT=80
CMD pnpm start
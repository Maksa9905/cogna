# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /contracts
COPY ./contracts .
RUN npm install
RUN npm run generate
RUN npx -p typescript tsc

WORKDIR /corn
COPY ./corn .
RUN npm install
RUN npx -p typescript tsc


WORKDIR /app
COPY ./api-gateway/package*.json .
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY ./api-gateway .
#RUN npx prisma generate
RUN npm run build

CMD ["node", "dist/main.js"]

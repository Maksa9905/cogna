# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /contracts
COPY ./contracts .
RUN npm install
RUN npm run generate
RUN npx tsc -p .

WORKDIR /app
COPY ./ai-service/package*.json .
RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps
COPY ./ai-service .

RUN npm run build

CMD ["sh", "-c", "node dist/main.js"]

# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /contracts
COPY ./contracts .
RUN npm install
RUN npm run generate
RUN npx tsc -p .

WORKDIR /app
COPY ./assessment-ai-service/package*.json .
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY ./assessment-ai-service .

RUN npm run build

CMD ["sh", "-c", "node dist/main.js"]

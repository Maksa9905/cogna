# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /contracts
COPY ./contracts .
RUN npm install
RUN npm run generate
RUN npx tsc -p .

# @cogna-edu/corn: file:../corn → каталог /corn
WORKDIR /corn
COPY ./corn/package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY ./corn ./
RUN npm run build

WORKDIR /app
COPY ./content-service/package*.json .
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY ./content-service .
ENV DATABASE_URL="postgresql://cogna:cogna_dev_password@postgres:5432/content_db"
RUN npx prisma generate
RUN npm run build

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]

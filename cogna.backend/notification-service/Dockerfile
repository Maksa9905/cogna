FROM node:20-alpine

WORKDIR /contracts
COPY ./contracts .
RUN npm install
RUN npm run generate

WORKDIR /app
COPY ./notification-service/package*.json .
RUN npm ci
COPY ./notification-service .
RUN npm run build

CMD ["node", "dist/main.js"]

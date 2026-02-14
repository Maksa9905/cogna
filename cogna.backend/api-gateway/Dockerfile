FROM node:20-alpine

WORKDIR /contracts
COPY ./contracts .
RUN npm install
RUN npm run generate

WORKDIR /app
COPY ./api-gateway/package*.json .
RUN npm ci
COPY ./api-gateway .
#RUN npx prisma generate
RUN npm run build

CMD ["node", "dist/main.js"]

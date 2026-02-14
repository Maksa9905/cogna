FROM node:20-alpine

WORKDIR /contracts
COPY ./contracts .
RUN npm install
RUN npm run generate

WORKDIR /app
COPY ./auth-service/package*.json .
RUN npm ci
COPY ./auth-service .
ENV DATABASE_URL="postgresql://cogna:cogna_dev_password@postgres:5432/auth_db"
RUN npx prisma generate
RUN npm run build

CMD ["node", "dist/src/main.js"]

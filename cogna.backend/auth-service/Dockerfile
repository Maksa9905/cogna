FROM node:20-alpine

WORKDIR /contracts
COPY ./contracts .
RUN npm install
RUN npm run generate
RUN npx -p typescript tsc

WORKDIR /app
COPY ./auth-service/package*.json .
#RUN npm ci раньше это использовал
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY ./auth-service .
ENV DATABASE_URL="postgresql://cogna:cogna_dev_password@postgres:5432/auth_db"
RUN npx prisma generate
RUN npm run build

COPY ./auth-service/migrate.sh .
RUN chmod +x migrate.sh

CMD ./migrate.sh && node dist/src/main.js

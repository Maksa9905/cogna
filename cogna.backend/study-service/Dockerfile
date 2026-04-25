FROM node:20-alpine

WORKDIR /contracts
COPY ./contracts .
RUN npm install
RUN npm run generate
RUN npx -p typescript tsc

# @cogna-edu/corn: file:../corn от study-service/package.json → каталог /corn
WORKDIR /corn
COPY ./corn/package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY ./corn ./
RUN npm run build

WORKDIR /app
COPY ./study-service/package*.json .
#RUN npm ci раньше это использовал
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY ./study-service .
ENV DATABASE_URL="postgresql://cogna:cogna_dev_password@postgres:5432/study_db"
RUN npx prisma generate
RUN npm run build

COPY ./study-service/migrate.sh .
RUN chmod +x migrate.sh

CMD ./migrate.sh && node dist/src/main.js

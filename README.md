# Cogna

Платформа для обучения

### CI Passing

![GitHub Actions Workflow Status](https://github.com/Maksa9905/cogna.training/actions/workflows/training-ci.yml/badge.svg)
![GitHub Actions Workflow Status](https://github.com/Maksa9905/cogna/actions/workflows/backend-ci.yml/badge.svg)

## Быстрый старт

### Разработка с Docker

Самый простой способ запустить проект локально - использовать Docker Compose:

```bash
docker-compose up --build
```

### Разработка без Docker

#### Frontend (cogna.training)
```bash
cd cogna.training
pnpm install
pnpm run dev
```

#### Backend (cogna.backend)
```bash
cd cogna.backend
pnpm install
pnpm run start:dev
```

## Структура проекта

- `cogna.training/` - Frontend (React + Vite)
- `cogna.backend/` - Backend (NestJS)
- `nginx/` - Конфигурация Nginx
- `docker-compose.yml` - Docker Compose для локальной разработки

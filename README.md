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

После запуска доступны:
- **Frontend**: http://localhost/ или http://dev.cogna.localhost/
- **Backend API**: http://localhost/api/
- **pgAdmin**: http://localhost/pgadmin/ (логин: `admin@cogna.ru`, пароль: `admin`)

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

## База данных

### Подключение к PostgreSQL через pgAdmin

1. Откройте http://localhost/pgadmin/
2. Логин: `admin@cogna.ru`, пароль: `admin`
3. Добавьте новый сервер:
   - **General > Name**: Cogna DB
   - **Connection > Host**: `postgres`
   - **Connection > Port**: `5432`
   - **Connection > Database**: `cogna`
   - **Connection > Username**: `cogna`
   - **Connection > Password**: `cogna_dev_password`

### Прямое подключение к PostgreSQL

Также можно подключиться напрямую через порт 5432:
```bash
psql -h localhost -p 5432 -U cogna -d cogna
# Пароль: cogna_dev_password
```

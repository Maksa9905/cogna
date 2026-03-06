# Cogna E2E

E2E-тесты на Playwright. Запускаются против локального стенда (docker-compose).

## Запуск локально

1. Поднять стенд:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.e2e.yml up -d
   ```

2. Дождаться готовности (nginx на порту 80), затем запустить тесты:
   ```bash
   cd cogna.e2e && pnpm test
   ```

## Скрипты

- `pnpm test` — запуск тестов
- `pnpm test:ui` — интерактивный режим
- `pnpm test:headed` — с видимым браузером
- `pnpm test:debug` — отладка
- `pnpm report` — просмотр отчёта после прогона

## CI

В GitHub Actions workflow `e2e-ci.yml`:
1. Поднимаются контейнеры (`docker compose -f docker-compose.yml -f docker-compose.e2e.yml up -d`)
2. Ожидается готовность сервисов (polling http://localhost)
3. Устанавливаются зависимости и браузеры Playwright
4. Запускаются тесты (только Chromium для скорости)
5. При падении загружается HTML-отчёт как артефакт

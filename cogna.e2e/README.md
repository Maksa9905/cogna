# Cogna E2E

E2E-тесты на Playwright. Запускаются против локального стенда (docker-compose) по HTTPS.

## Запуск локально

1. Сертификаты (если ещё не сделано): см. `nginx/certs/README.md`
2. Поднять стенд: `docker compose -f docker-compose.yml -f docker-compose.e2e.yml up -d`
3. Запустить тесты: `cd cogna.e2e && pnpm test`

## Скрипты

- `pnpm test` — запуск тестов
- `pnpm test:ui` — интерактивный режим
- `pnpm test:headed` — с видимым браузером
- `pnpm test:debug` — отладка
- `pnpm report` — просмотр отчёта после прогона

## CI

В CI генерируются самоподписанные сертификаты (openssl), тесты идут по HTTPS. Playwright использует `ignoreHTTPSErrors: true` для самоподписанных сертов.

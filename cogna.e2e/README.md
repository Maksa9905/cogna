# Cogna E2E

E2E-тесты на Playwright. Запускаются против локального стенда (docker-compose) по HTTPS.

## Запуск локально

### Требования

- Docker и Docker Compose
- pnpm
- Node.js 20+

### Шаги

1. **Сертификаты** — сгенерировать самоподписанные серты для localhost:
   ```bash
   ./nginx/certs/generate-e2e-certificates.sh
   ```

2. **Поднять стенд** — из корня репозитория:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.e2e.yml up -d
   ```

3. **Дождаться готовности** — приложение доступно по `https://localhost` (можно проверить в браузере или `curl -sk https://localhost/en/auth/login`).

4. **Установить зависимости** (если ещё не сделано):
   ```bash
   cd cogna.e2e && pnpm install
   ```

5. **Установить браузеры Playwright** (при первом запуске):
   ```bash
   cd cogna.e2e && pnpm exec playwright install chromium
   ```

6. **Запустить тесты**:
   ```bash
   cd cogna.e2e && pnpm test
   ```

### Полезные команды

- Запуск только chromium: `pnpm test --project=chromium`
- Конкретный файл: `pnpm test tests/auth.spec.ts`
- С видимым браузером: `pnpm test:headed`
- Интерактивный UI: `pnpm test:ui`
- Отладка: `pnpm test:debug`
- Просмотр отчёта после прогона: `pnpm report`

## Скрипты

- `pnpm test` — запуск тестов
- `pnpm test:ui` — интерактивный режим
- `pnpm test:headed` — с видимым браузером
- `pnpm test:debug` — отладка
- `pnpm report` — просмотр отчёта после прогона

## CI

В CI генерируются самоподписанные сертификаты (openssl), тесты идут по HTTPS. Playwright использует `ignoreHTTPSErrors: true` для самоподписанных сертов.

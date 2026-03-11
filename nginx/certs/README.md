# SSL-сертификаты для nginx

## Локальная разработка

Используются **реальные сертификаты** (www.cogna.ru). См. основной README — секреты `SSL_CERT` и `SSL_CERT_KEY` в GitHub.

## E2E-тестирование

Сертификаты генерируются через **openssl** (самоподписанные для localhost).

- **В CI** — workflow генерирует их перед запуском контейнеров.
- **Локально** — перед `docker compose -f docker-compose.yml -f docker-compose.e2e.yml up -d`:

```bash
./nginx/certs/generate-e2e-certificates.sh
```

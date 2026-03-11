#!/usr/bin/env bash
# Генерация самоподписанных сертификатов для E2E-тестов.
# Использует openssl (без mkcert).

set -e
cd "$(dirname "$0")"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:dev.cogna.localhost,IP:127.0.0.1"

echo "Сертификаты созданы: cert.pem, key.pem"

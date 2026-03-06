#!/bin/sh
set -e

echo "Checking migration status..."

# Попытка пометить failed миграцию как rolled-back
npx prisma migrate resolve --rolled-back 20260220143913_init 2>/dev/null || echo "No failed migration to resolve"

# Применение миграций
echo "Applying migrations..."
npx prisma migrate deploy

echo "Migrations completed successfully"

#!/bin/sh
set -e
# Создаёт auth_db если не существует (для случаев когда initdb уже выполнялся)
psql -h postgres -U cogna -d cogna -tAc "SELECT 1 FROM pg_database WHERE datname='auth_db'" | grep -q 1 || \
  psql -h postgres -U cogna -d cogna -c "CREATE DATABASE auth_db"

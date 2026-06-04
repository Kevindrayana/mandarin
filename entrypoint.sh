#!/bin/sh
set -e

echo "==> Seeding DB..."
python backend/scripts/seed_db.py

echo "==> Starting gunicorn..."
exec gunicorn \
  --chdir /app/backend \
  --bind "0.0.0.0:${PORT:-5000}" \
  --workers 1 \
  --timeout 120 \
  "app:create_app()"

#!/bin/sh

if [ ! -f .env ] && [ -f .env.example ]; then
    cp .env.example .env
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Fail fast on errors
set -e

echo "Aggregating static assets..."
python manage.py collectstatic --noinput

echo "Applying migrations..."
python manage.py migrate

exec "$@"
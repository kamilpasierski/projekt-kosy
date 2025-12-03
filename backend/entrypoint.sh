#!/bin/sh

if [ ! -f .env ] && [ -f .env.example ]; then
    cp .env.example .env
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"
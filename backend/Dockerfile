# Użyj oficjalnego obrazu Python
FROM python:3.10-slim

# Ustaw, aby Python nie zapisywał plików .pyc i działał bez buforowania
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj i zainstaluj zależności
# Kopiujemy ten plik jako pierwszy, aby Docker mógł go przechować w cache
COPY requirements.txt .
RUN pip install -r requirements.txt

# Skopiuj resztę kodu backendu
COPY . .

# Wystaw port 8000 (standardowy dla Django)
EXPOSE 8000

# Polecenie uruchamiające serwer deweloperski Django
# Będzie on dostępny dla innych kontenerów w sieci
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
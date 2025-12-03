# --- ETAP 1: Budowanie aplikacji React ---

FROM node:18-alpine AS build

WORKDIR /app

# Kopiowanie plików zależności
# POPRAWKA: Używamy "./" zamiast "client/"
COPY package*.json ./
RUN npm install

# Kopiowanie reszty kodu i budowanie aplikacji
# POPRAWKA: Używamy "." zamiast "client/"
COPY . .
RUN npm run build

# --- ETAP 2: Serwowanie plików statycznych przez Nginx ---

FROM nginx:stable-alpine

# Kopiuj zbudowaną aplikację
COPY --from=build /app/dist /usr/share/nginx/html

# Usuń domyślną konfigurację Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Skopiuj naszą własną konfigurację
# POPRAWKA: Używamy "nginx.conf" zamiast "client/nginx.conf"
COPY nginx.conf /etc/nginx/conf.d/

# Wystaw port 80
EXPOSE 80

# Uruchom Nginx
CMD ["nginx", "-g", "daemon off;"]
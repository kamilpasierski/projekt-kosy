// src/utils/config.ts

// 1. Definiujemy API URL
// Jeśli zmienna środowiskowa istnieje (produkcja), użyj jej.
// W przeciwnym razie (lokalnie) użyj localhost.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Definiujemy Media URL
// Często jest to to samo co API, chyba że masz pliki na S3.
export const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || API_BASE_URL;
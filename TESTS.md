

Plik testowy 


#  Raport testowy Projekt Kosy

##  Cel
Sprawdzenie poprawności uruchamiania środowiska Docker oraz komunikacji frontend-backend.

---

##  Backend (Django)
**Wynik:** Buduje się poprawnie  
**Błąd:** `exec /app/entrypoint.sh: no such file or directory`  



##  Frontend (React + Nginx)
**Wynik:** Buduje się poprawnie  
**Błąd:** `host not found in upstream "backend" in /etc/nginx/conf.d/nginx.conf:15`  


---

##  Sieć Docker
**Wynik:** Sieć `kosy-net` utworzona poprawnie  


---

##  Podsumowanie
Środowisko Docker działa częściowo.  
Frontend i backend budują się, lecz komunikacja proxy (Nginx → Django) wymaga korekty.  


--
# 

# 

# 

# `Projektna naloga`

# `HealthIT`

`PLAN PROJEKTA`  
**`Main Web`**

***`Čelni del:`***  
`Strežnik: Express + Node.js + PostgreSQL`   
`Mikrostoritve:`  
`1) Storitev obvestil (Golang)`  
`2) Pridobivanje podatkov: (Golang)`  
`3) Zaznavanje rastlin (Python)`  
`Komunikacija med mikrostoritvami: RabbitMQ`  
***`Frontend:`***   
`Mobilne naprave: React Native`  
`Splet: React`

**`Sensors`**  
`Uporabljamo senzorje priklopljene na ESP32-C6, ki se ob zagonu (ce nima shranjenih podatkov za povezavo v omrežje) ali pritisku na reset gumb nastavi na bluetooth način, in potem pridobi podatke za povezavo v omrežje preko bluetooth-a in aplikacije na telefonu. Ko je ESP povezan se podatki pošiljajo na strežnik.`  
`Pridobivanje podatkov iz senzorjev:`

- `senzor svetlobe`  
- `senzor za temperaturo`  
- `senzor za vlago v zemlji` 

# 

# 

# **`Plant-detection`**

`Kot del modula ORV naš sistem izvaja funkcionalnost samodejne identifikacije rastlinskih vrst na podlagi analize slik. Za zagotovitev visoke natančnosti in skalabilnosti smo to funkcionalnost integrirali v ločeno storitev (ki temelji na Pythonu).`

# 

# **`Infrastructure`**

`Implementiramo arhitekturo mikroservisov, odporno na napake, v celoti kontejnerizirano z uporabo Dockerja, kjer se uvajanje celotnega sistema izvede z enim samim ukazom prek docker-compose. Celoten razvojni cikel se upravlja prek cevovoda GitHub Actions CI/CD, ki samodejno izvaja enotne teste in gradi slike za Docker Hub z vsako zahtevo za prevzem (pull request), kar zagotavlja strog nadzor kakovosti in usklajenost težav. Napredek vodimo v orodju Jira z dejanskim napredkom videnem v repozitoriju.`
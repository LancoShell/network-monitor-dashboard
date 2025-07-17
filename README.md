## Advanced Network Monitoring Dashboard

Questa applicazione web fornisce un cruscotto in tempo reale per il monitoraggio del traffico di rete e il rilevamento automatico di anomalie sui dati raccolti.
Utilizza Python Flask per il backend, Flask-SocketIO per la comunicazione WebSocket in tempo reale, e Chart.js per la visualizzazione frontend. 

## Funzionalità principali
Monitoraggio del traffico di rete in ingresso e uscita (bytes e pacchetti) 

Monitoraggio degli errori di rete in ingresso e uscita

Rilevamento semplice di anomalie basato su soglie dinamiche (media + 2 deviazioni standard)

Visualizzazione in tempo reale con grafici interattivi

Alert visivi immediati su anomalie rilevate

Architettura scalabile per futuri miglioramenti (es. ML, DB)

---

## Tecnologie usate
-Python 3.x 

-Flask

-Flask-SocketIO

-psutil (per stats rete)

-eventlet (per WebSocket asincroni)

-numpy (per statistiche)

-Chart.js (grafici frontend)

-JavaScript, HTML, CSS

---

## Installazione:

1) Clona la repository:
```bash
git clone https://github.com/LancoShell/network-monitor-dashboard.git
cd network_monitor_dashboard
```

2) Crea e attiva un ambiente virtuale (opzionale ma consigliato):
 ```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```
3) Installa le dipendenze:
 ```bash
pip install -r requirements.txt
```

## Uso
Avvia il server Flask con:
 ```bash
python app.py
```

## Apri il browser e visita:
 ```bash
http://localhost:5000/
```
--- 
## Vedrai una dashboard con tre grafici che mostrano:

-Bytes inviati e ricevuti al secondo

-Pacchetti inviati e ricevuti al secondo

-Errori di rete in ingresso e uscita

-Sotto ogni grafico appariranno alert colorati se viene rilevata un’anomalia.

---

Autore: https://lancohacker.com | info@lancohacker.com


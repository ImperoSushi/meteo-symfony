# Weather App - Spiegazione del Progetto

## Cos'è questo progetto?

Questo è un'applicazione web per controllare il meteo delle città. È fatta con Symfony (un framework PHP) e permette di:

1. **Cercare il meteo di una città** - Basta scrivere il nome della città e l'app ti mostra temperatura, condizioni atmosferiche e coordinate
2. **Salvare le città preferite** - Puoi aggiungere le città che ti interessano ai preferiti e vedere il meteo aggiornato
3. **Esportare i preferiti in Excel** - Puoi scaricare un file Excel con tutte le tue città preferite
4. **Vedere la posizione sulla mappa** - Quando cerchi una città, appare una mappa con la posizione esatta

## Come è organizzato il progetto?

### Cartelle principali

- **`src/`** - Qui dentro c'è tutto il codice PHP
  - **`Controller/`** - Le "centraline di comando" che gestiscono le richieste degli utenti
  - **`Entity/`** - Le "tabelle del database" (User per gli utenti, FavoriteCity per le città preferite)
  - **`Service/`** - Funzioni ausiliarie (ManageExcel per creare i file Excel)
  - **`Repository/`** - Funzioni per parlare con il database

- **`templates/`** - I file HTML (fatti con Twig, un linguaggio per creare pagine web)
  - **`prove/weather/meteo.html.twig`** - La pagina principale dell'app meteo

- **`public/`** - I file statici (CSS, JavaScript, immagini)
  - **`weather/meteo.js`** - JavaScript per cercare il meteo
  - **`weather/favorites.js`** - JavaScript per gestire i preferiti
  - **`weather/map.js`** - JavaScript per mostrare la mappa
  - **`weather/meteo.css`** - Stile della pagina

### Database

Il progetto usa un database per salvare:
- **Utenti** (email, password, se hanno verificato l'email)
- **Città preferite** (nome città, paese, coordinate, temperatura, descrizione, a quale utente appartengono)

## Come funziona?

### 1. Cercare il meteo

1. L'utente scrive una città nel campo di ricerca
2. Il JavaScript manda una richiesta al server (WeatherController)
3. Il server chiede informazioni a due API esterne:
   - **Geocoding API** - Per trovare latitudine e longitudine della città
   - **Meteo API** - Per ottenere temperatura e condizioni atmosferiche
4. Il server risponde con i dati e il JavaScript mostra il risultato

### 2. Salvare i preferiti

1. Quando l'utente clicca sulla stella ⭐, il JavaScript manda i dati al server
2. Il server salva la città nei preferiti del database
3. Quando l'utente apre la lista dei preferiti, il server recupera tutte le città salvate
4. Per ogni città, il server aggiorna la temperatura chiedendo di nuovo all'API meteo

### 3. Esportare in Excel

1. L'utente clicca su "Scarica Excel"
2. Il server recupera i preferiti dell'utente
3. Usa la libreria PHPSpreadsheet per creare un file Excel
4. Il server invia il file all'utente per il download

### 4. Sistema di login

- Gli utenti possono registrarsi con email e password
- Solo gli utenti registrati possono salvare i preferiti

## Tecnologie usate

### Backend (PHP/Symfony)
- **Symfony 7.4** - Framework principale
- **Doctrine** - Per gestire il database
- **Twig** - Per creare le pagine HTML
- **PHPSpreadsheet** - Per creare file Excel

### Frontend (JavaScript/CSS)
- **JavaScript puro** - Per la logica della pagina
- **Leaflet.js** - Per mostrare la mappa interattiva
- **CSS** - Per lo stile della pagina

### API esterne
- **Open-Meteo** - Per ottenere i dati meteo 
- **OpenStreetMap** - Per le mappe

## Come si avvia il progetto?

1. **Installare i requisiti**:
   ```bash
   composer install
   ```

2. **Configurare il database**:
   ```bash
   php bin/console doctrine:migrations:migrate
   ```

3. **Avviare il server**:
   - Se usi Symfony CLI: 
      ```bash
      symfony server:start
      ```
   - Se usi XAMPP: avvia Apache e MySQL da XAMPP Control Panel oppure se usi linux:
      ```bash
      sudo /opt/lampp/lampp start
      ```

4. **Aprire il browser** su `http://localhost:8000/meteo` oppure `http://symfony.local/meteo` (se hai configurato il virtual host)


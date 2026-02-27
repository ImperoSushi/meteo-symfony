const el = {
    form: document.getElementById('form'),
    cityInput: document.getElementById('city'),
    error: document.getElementById('error'),
    result: document.getElementById('weather-result'),
    city: document.getElementById('city-name'),
    country: document.getElementById('country'),
    temp: document.getElementById('temp'),
    desc: document.getElementById('desc'),
    lat: document.getElementById('lat'),
    lon: document.getElementById('lon'),
    favoriteStar: document.getElementById('favorite-star'),
    suggestions: document.getElementById('suggestions')
};

// --- AUTOCOMPLETE ---

let suggestionTimeout = null;

el.cityInput.addEventListener("input", () => {
    el.cityInput.dataset.lat = "";
    el.cityInput.dataset.lon = "";
    el.cityInput.dataset.country = "";

    const query = el.cityInput.value.trim();

    if (query.length < 2) {
        el.suggestions.style.display = "none";
    } else {
        clearTimeout(suggestionTimeout);
        suggestionTimeout = setTimeout(() => {
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&language=it&count=10`)
                .then(async res => {
                    const text = await res.text();

                    if (!text.startsWith("{")) {                
                        el.suggestions.style.display = "none";          

                        return { results: [] };
                    }

                    return JSON.parse(text);
                })
                .then(data => {

                    if (!data.results) {
                        el.suggestions.style.display = "none";

                        return;
                    }

                    // --- FILTRI IMPORTANTI ---
                    const validTypes = ["PPL", "PPLA", "PPLA2", "PPLC"];
                    /*
                        Codice                   Significato                                    Cosa Indica                
                        PPL	  | Populated Place	                               | Una città o paese normale
                        PPLA  |	Seat of a first‑order administrative division  | Capoluogo di regione / provincia
                        PPLA2 |	Seat of a second‑order division	               | Capoluogo di una provincia più piccola
                        PPLA3 |	Seat of a third‑order division	               | Capoluogo di distretto
                        PPLC  |	Capital of a country	                       | Capitale nazionale (Roma, Parigi, Tokyo…)
                        PPLX  |	Section of a populated place	               | Quartiere o frazione
                        PPLF  |	Farm village	                               | Villaggio rurale
                        PPLG  |	Seat of government	                           | Sede del governo
                        PPLH  |	Historical place	                           | Città storica non più abitata
                    */

                    let results = data.results.filter(city =>
                        validTypes.includes(city.feature_code) &&
                        (city.population ?? 0) > 100 &&
                        city.country && city.country.trim() !== ""   
                    );

                    results.sort((a, b) => (b.population ?? 0) - (a.population ?? 0));

                    results = results.slice(0, 4);

                    if (results.length === 0) {
                        el.suggestions.style.display = "none";
                    } else {
                        el.suggestions.innerHTML = "";
                        el.suggestions.style.display = "block";

                        results.forEach(city => {
                            const item = document.createElement("div");
                            item.classList.add("suggestion-item");

                            item.textContent = `${city.name}, ${city.country}`;

                            item.addEventListener("click", () => {
                                el.cityInput.value = city.name;
                                el.cityInput.dataset.lat = city.latitude;
                                el.cityInput.dataset.lon = city.longitude;
                                el.cityInput.dataset.country = city.country;

                                el.suggestions.style.display = "none";

                                el.cityInput.blur(); 
                                el.cityInput.focus();
                            });

                            el.suggestions.appendChild(item);
                        });
                    }
            });
        }, 250);
    }
});


// --- FORM SUBMIT ---

el.form.addEventListener('submit', function(e) {
    el.suggestions.style.display = "none";
    weatherFun(e);
});
el.form.addEventListener('reset', function(e) {
    e.preventDefault();
    clearForm();
    hideError();
    el.cityInput.value = "";
    document.getElementById("map").style.display = "none";
});

// --- FUNZIONE PRINCIPALE ---

function weatherFun(e) {
    e.preventDefault();

    const city = el.cityInput.value.trim();
    if (!city) {
        alert("Inserisci una città");

        return;
    }

    fetch('/meteo/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            city,
            lat: el.cityInput.dataset.lat,
            lon: el.cityInput.dataset.lon,
            country: el.cityInput.dataset.country
        })
    })
    .then(async res => {
        const text = await res.text();

        // Se la risposta NON è JSON
        if (!text.startsWith("{")) {
            console.error("Risposta non JSON:", text);
            showError("Errore temporaneo del servizio meteo. Riprova tra qualche secondo.");

            return { error: "Servizio non disponibile" };
        }

        return JSON.parse(text);
    })
    .then(data => {
        if (data.error) {
            clearForm();
            showError(data.error);
        } else {
            hideError();
            fillForm(data);
        }

        el.result.scrollIntoView({ behavior: "smooth", block: "start"});
    })
    .catch(err => console.error("Errore: ", err));
}

// --- FUNZIONI DI UTILITÀ ---

function clearForm() {
    el.city.textContent = "";
    el.country.textContent = "";
    el.temp.textContent = "";
    el.desc.textContent = "";
    el.lat.textContent = "";
    el.lon.textContent = "";
    document.getElementById("map").style.display = "none";
    el.favoriteStar.style.display = "none";
}

function fillForm(data) {
    el.result.style.display = "block";
    el.city.textContent = data.city;
    el.country.textContent = data.country;
    el.temp.textContent = data.temperature + "°C";
    el.desc.textContent = data.description;
    el.lat.textContent = data.latitude;
    el.lon.textContent = data.longitude;

    updateMap(data.latitude, data.longitude);

    el.favoriteStar.style.display = "inline-block";
    el.favoriteStar.onclick = () => {
        addFavorite(
            data.city,
            data.country,
            data.latitude,
            data.longitude,
            data.temperature,
            data.description
        );
    };
}

function showError(msg) {
    el.result.style.display = "block";
    el.error.textContent = msg;
}

function hideError() {
    el.result.style.display = "none";
    el.error.textContent = "";
}

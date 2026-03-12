
// ELEMENTS

const elsObject = {
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
    suggestions: document.getElementById('suggestions'),
    map: document.getElementById("map")
};

const GEO_API = 'https://geocoding-api.open-meteo.com/v1';

let suggestionTimeout = null;


// ADD EVENT LISTENERS

function addEventListeners() {
    elsObject.cityInput.addEventListener("input", onCityInput);
    elsObject.form.addEventListener("submit", onFormSubmit);
    elsObject.form.addEventListener("reset", onFormReset);
}

addEventListeners();

function onCityInput(ev) {
    const input = ev.target;

    // reset dataset
    input.dataset.lat = "";
    input.dataset.lon = "";
    input.dataset.country = "";

    const query = input.value.trim();

    if (query.length < 2) {
        elsObject.suggestions.style.display = "none";

        return;
    }

    clearTimeout(suggestionTimeout);
    suggestionTimeout = setTimeout(() => fetchSuggestions(query), 250);
}


// FETCH SUGGESTIONS

async function fetchSuggestions(query) {
    const url = `${GEO_API}/search?name=${encodeURIComponent(query)}&language=it&count=10`;

    const res = await fetch(url);
    const text = await res.text();

    // risposta non JSON
    if (!text.startsWith("{")) {
        elsObject.suggestions.style.display = "none";

        return;
    }

    const data = JSON.parse(text);

    if (!data.results) {
        elsObject.suggestions.style.display = "none";

        return;
    }

    // filtri
    const validTypes = ["PPL", "PPLA", "PPLA2", "PPLC"];
    let results = data.results.filter(city =>
        validTypes.includes(city.feature_code) && (city.population ?? 0) > 100 && city.country.trim() !== ""
    );

    results.sort((cityA, cityB) => (cityB.population ?? 0) - (cityA.population ?? 0));
    results = results.slice(0, 3);

    if (results.length === 0) {
        elsObject.suggestions.style.display = "none";

        return;
    }

    renderSuggestions(results);
}


// FORMATTING FUNCTION

function formatSuggestion(city) {
    return `${city.name}, ${city.country}`;
}


// DOM CREATION FUNCTION

function createSuggestionItem(city) {
    const item = document.createElement("div");
    item.classList.add("suggestion-item");
    item.textContent = formatSuggestion(city);

    item.addEventListener("click", () => {
        elsObject.cityInput.value = city.name;
        elsObject.cityInput.dataset.lat = city.latitude;
        elsObject.cityInput.dataset.lon = city.longitude;
        elsObject.cityInput.dataset.country = city.country;

        elsObject.suggestions.style.display = "none";

        elsObject.cityInput.blur();
        elsObject.cityInput.focus();
    });

    return item;
}


// RENDER SUGGESTIONS

function renderSuggestions(results) {
    elsObject.suggestions.innerHTML = "";
    elsObject.suggestions.style.display = "block";

    results.forEach(city => {
        const item = createSuggestionItem(city);
        elsObject.suggestions.appendChild(item);
    });
}


// FORM SUBMIT

function onFormSubmit(ev) {
    ev.preventDefault();
    elsObject.suggestions.style.display = "none";

    const cityName = elsObject.cityInput.value.trim();
    weatherFun(cityName);
}

function onFormReset(ev) {
    ev.preventDefault();
    clearForm();
    hideError();
    elsObject.cityInput.value = "";
    elsObject.map.style.display = "none";
}


// MAIN WEATHER FUNCTION

async function weatherFun(cityName) {
    if (!cityName) {
        alert("Inserisci una città");

        return;
    }

    const res = await fetch('/meteo/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            city: cityName,
            lat: elsObject.cityInput.dataset.lat,
            lon: elsObject.cityInput.dataset.lon,
            country: elsObject.cityInput.dataset.country
        })
    });

    const text = await res.text();

    if (!text.startsWith("{")) {
        showError("Errore temporaneo del servizio meteo. Riprova tra qualche secondo.");

        return;
    }

    const data = JSON.parse(text);

    if (data.error) {
        clearForm();
        showError(data.error);
    } else {
        hideError();
        fillForm(data);
    }

    elsObject.result.scrollIntoView({ behavior: "smooth", block: "start" });
}


// UTILITY FUNCTIONS

function clearForm() {
    elsObject.city.textContent = "";
    elsObject.country.textContent = "";
    elsObject.temp.textContent = "";
    elsObject.desc.textContent = "";
    elsObject.lat.textContent = "";
    elsObject.lon.textContent = "";
    elsObject.map.style.display = "none";
    elsObject.favoriteStar.style.display = "none";
    elsObject.suggestions.style.display = "none";
}

function fillForm(data) {
    elsObject.result.style.display = "block";
    elsObject.city.textContent = data.city;
    elsObject.country.textContent = data.country;
    elsObject.temp.textContent = data.temperature + "°C";
    elsObject.desc.textContent = data.description;
    elsObject.lat.textContent = data.latitude;
    elsObject.lon.textContent = data.longitude;

    updateMap(data.latitude, data.longitude);

    elsObject.favoriteStar.style.display = "inline-block";
    elsObject.favoriteStar.onclick = () => {
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
    elsObject.result.style.display = "block";
    elsObject.error.textContent = msg;
}

function hideError() {
    elsObject.result.style.display = "none";
    elsObject.error.textContent = "";
}

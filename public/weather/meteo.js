
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
    // ⭐
    favoriteStar: document.getElementById('favorite-star')   
};


el.form.addEventListener('submit', weatherFun);
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
            'Content-Type': 'application/json', // Formato che invio al server
            'Accept': 'application/json'        // Formato che voglio il server mi invii
        },
        body: JSON.stringify({ city })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            clearForm();
            showError(data.error);
        } else {
            hideError();
            fillForm(data);
        }
        
        // Scroll automatico verso il risultato
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
    // ⭐
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

    // ⭐ 
    el.favoriteStar.style.display = "inline-block";
    el.favoriteStar.onclick = () => {
        addFavorite(
            data.city,
            data.country,
            data.latitude,
            data.longitude
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



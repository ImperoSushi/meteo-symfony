function loadFavorites() {
    fetch('/favorites/list')
        .then(res => res.json())
        .then(favorites => {
            const list = document.getElementById('favorites-list');
            list.innerHTML = '';

            favorites.forEach(fav => {
                const li = document.createElement('li');

                li.innerHTML = `
                    <span class="fav-city"><strong>${fav.city} (${fav.country})</strong></span>
                    <span class="fav-temp">${fav.temperature ?? '--'}°C</span>
                    <button class="delete-fav" data-id="${fav.id}">X</button>
                `;

                const tempSpan = li.querySelector('.fav-temp');

                fetch('/meteo/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ city: fav.city })
                })
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {

                        tempSpan.textContent = data.temperature + "°C";

                        fav.temperature = data.temperature;
                        fav.description = data.description;

                        updateFavorite(fav.id, fav.temperature, fav.description);
                    }
                });


                li.addEventListener('click', () => {
                    hideError();

                    fillForm({
                        city: fav.city,
                        country: fav.country,
                        temperature: fav.temperature,
                        description: fav.description,
                        latitude: fav.latitude,
                        longitude: fav.longitude
                    });

                    updateMap(fav.latitude, fav.longitude);
                    document.getElementById("weather-result").style.display = "block";

                    // Scroll automatico verso il risultato
                    document.getElementById("weather-result").scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });

                li.querySelector('.delete-fav').addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteFavorite(fav.id);
                });

                list.appendChild(li);
            });
        });
}

function addFavorite(city, country, lat, lon) {

    const temperature = document.getElementById("temp").textContent.replace("°C", "");
    const description = document.getElementById("desc").textContent;

    fetch('/favorites/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            city,
            country,
            latitude: lat,
            longitude: lon,
            temperature,
            description
        })
    }).then(() => loadFavorites());
}

function updateFavorite(id, temperature, description) {
    fetch('/favorites/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id,
            temperature,
            description
        })
    });
}

function deleteFavorite(id) {
    fetch(`/favorites/delete/${id}`, { method: 'DELETE' })
        .then(() => loadFavorites());
}

/* ⭐ MOSTRA/NASCONDI PREFERITI */
document.addEventListener("DOMContentLoaded", () => {
    loadFavorites();

    const toggle = document.getElementById("toggle-favorites");
    const box = document.getElementById("favorites-box");

    toggle.addEventListener("click", () => {
        if (box.style.display === "none" || box.style.display === "") {
            box.style.display = "block";
            toggle.textContent = "⭐ Nascondi Preferiti";
        } else {
            box.style.display = "none";
            toggle.textContent = "⭐ Mostra Preferiti";
        }
    });
});

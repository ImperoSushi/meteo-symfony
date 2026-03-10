// Leaflet 
const MAP_TILE_API = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

let map = null;
let marker = null;

document.addEventListener("DOMContentLoaded", () => {

    function updateMap(lat, lon) {
        const position = [parseFloat(lat), parseFloat(lon)];

        const mapDiv = document.getElementById("map");
        if (!mapDiv) { return };

        mapDiv.style.display = "block";

        if (!map) {
            map = L.map('map').setView(position, 10);

            L.tileLayer(MAP_TILE_API, { maxZoom: 19 }).addTo(map);

            marker = L.marker(position).addTo(map);
        } else {
            map.setView(position, 10);
            marker.setLatLng(position);
        }

        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    }

    // Rendi disponibile la funzione globalmente
    window.updateMap = updateMap;
});

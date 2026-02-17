
// Leaflet 
let map = null;
let marker = null;

function updateMap(lat, lon) {
    const position = [parseFloat(lat), parseFloat(lon)];

    const mapDiv = document.getElementById("map");
    mapDiv.style.display = "block";

    if (!map) {
        map = L.map('map').setView(position, 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);

        marker = L.marker(position).addTo(map);
    } else {
        map.setView(position, 10);
        marker.setLatLng(position);
    }

    setTimeout(() => {
        map.invalidateSize();
    }, 200);
}
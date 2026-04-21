// app.js
const map = L.map('map').setView([42.6, -8.9], 8);

// Mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Batimetría (EMODnet WMS)
L.tileLayer.wms("https://ows.emodnet-bathymetry.eu/wms", {
  layers: 'emodnet:mean_atlas_land',
  format: 'image/png',
  transparent: true,
  opacity: 0.5
}).addTo(map);

let marker;
let windLayer;

async function getMarineData(lat, lon) {
  const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=windSpeed,windDirection,waveHeight,waterTemperature,airTemperature,pressure&source=noaa`;

  const res = await fetch(url, {
    headers: {
      'Authorization': CONFIG.STORMGLASS_KEY
    }
  });

  const data = await res.json();
  const current = data.hours[0];

  document.getElementById("data").innerHTML = `
    🌡 Aire: ${current.airTemperature.noaa} °C<br>
    🌊 Agua: ${current.waterTemperature.noaa} °C<br>
    🌊 Oleaje: ${current.waveHeight.noaa} m<br>
    💨 Viento: ${current.windSpeed.noaa} m/s<br>
    🧭 Dirección: ${current.windDirection.noaa}°<br>
    📊 Presión: ${current.pressure.noaa} hPa
  `;

  drawWind(lat, lon, current.windDirection.noaa);
}

function drawWind(lat, lon, deg) {
  if (windLayer) map.removeLayer(windLayer);

  const len = 0.2;
  const rad = deg * Math.PI / 180;

  const lat2 = lat + len * Math.cos(rad);
  const lon2 = lon + len * Math.sin(rad);

  windLayer = L.polyline([[lat, lon], [lat2, lon2]], {
    color: 'cyan',
    weight: 3
  }).addTo(map);
}

map.on('click', (e) => {
  const { lat, lng } = e.latlng;

  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lng]).addTo(map);

  getMarineData(lat, lng);
});

// Zonas de pesca
fetch('spots.json')
  .then(res => res.json())
  .then(spots => {
    spots.forEach(spot => {
      const m = L.marker([spot.lat, spot.lon]).addTo(map);
      m.bindPopup(`<b>${spot.name}</b><br>🐟 ${spot.species.join(', ')}`);
    });
  });

// Geolocalización
navigator.geolocation.getCurrentPosition(pos => {
  const { latitude, longitude } = pos.coords;
  map.setView([latitude, longitude], 10);

  L.marker([latitude, longitude]).addTo(map)
    .bindPopup("📍 Tu posición").openPopup();
});

// config.js
const CONFIG = {
  STORMGLASS_KEY: af77a478-3dbd-11f1-a882-0242ac120004-af77a4e6-3dbd-11f1-a882-0242ac120004
};

// spots.json
[
  {
    "name": "Ría de Arousa",
    "lat": 42.6,
    "lon": -8.9,
    "species": ["Lubina", "Dorada", "Sargo"]
  },
  {
    "name": "Costa da Morte",
    "lat": 43.0,
    "lon": -9.2,
    "species": ["Pulpo", "Merluza", "Congrio"]
  }
]

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
});

const STORMGLASS_KEY = af77a478-3dbd-11f1-a882-0242ac120004-af77a4e6-3dbd-11f1-a882-0242ac120004;

const map = L.map('map').setView([42.6, -8.9], 8);

// Mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Batimetría (EMODnet)
L.tileLayer.wms("https://ows.emodnet-bathymetry.eu/wms", {
  layers: 'emodnet:mean_atlas_land',
  format: 'image/png',
  transparent: true,
  opacity: 0.5
}).addTo(map);

let marker, windLayer;

// =====================
// DATOS MARINOS
// =====================
async function getMarineData(lat, lon) {
  try {
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=windSpeed,windDirection,waveHeight,waterTemperature,airTemperature,pressure&source=noaa`;

    const res = await fetch(url, {
      headers: { 'Authorization': STORMGLASS_KEY }
    });

    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    const hours = data.hours;
    const current = hours[0];

    // Condiciones actuales
    document.getElementById("data").innerHTML = `
      🌡 Aire: ${current.airTemperature.noaa} °C<br>
      🌊 Agua: ${current.waterTemperature.noaa} °C<br>
      🌊 Oleaje: ${current.waveHeight.noaa} m<br>
      💨 Viento: ${current.windSpeed.noaa} m/s<br>
      🧭 Dirección: ${current.windDirection.noaa}°<br>
      📊 Presión: ${current.pressure.noaa} hPa
    `;

    drawWind(lat, lon, current.windDirection.noaa);

    // =====================
    // FORECAST 12 HORAS
    // =====================
    let forecastHTML = "";
    hours.slice(0, 12).forEach(h => {
      forecastHTML += `
        🕒 ${h.time.slice(11,16)} | 🌊 ${h.waveHeight.noaa}m | 💨 ${h.windSpeed.noaa}m/s<br>
      `;
    });

    document.getElementById("forecast").innerHTML = forecastHTML;

    // =====================
    // LÓGICA DE PESCA
    // =====================
    evaluateFishing(current);

  } catch (err) {
    console.error(err);
    document.getElementById("data").innerHTML = "❌ Error cargando datos";
  }
}

// =====================
// SISTEMA DE PESCA
// =====================
function evaluateFishing(d) {
  let score = 0;

  if (d.waveHeight.noaa < 1.5) score++;
  if (d.windSpeed.noaa < 6) score++;
  if (d.pressure.noaa > 1010) score++;

  let result = "";

  if (score >= 3) result = "🔥 Muy buenas condiciones";
  else if (score === 2) result = "👍 Condiciones decentes";
  else result = "⚠️ Malas condiciones";

  document.getElementById("fishing").innerHTML = result;
}

// =====================
// DIBUJAR VIENTO
// =====================
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

// =====================
// CLICK EN MAPA
// =====================
map.on('click', (e) => {
  const { lat, lng } = e.latlng;

  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lng]).addTo(map);

  getMarineData(lat, lng);
});

// =====================
// ZONAS DE PESCA
// =====================
fetch('./spots.json')
  .then(res => res.json())
  .then(spots => {
    spots.forEach(s => {
      L.marker([s.lat, s.lon]).addTo(map)
        .bindPopup(`<b>${s.name}</b><br>🐟 ${s.species.join(', ')}`);
    });
  })
  .catch(() => console.log("Error cargando spots"));

// =====================
// GEOLOCALIZACIÓN
// =====================
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;

    map.setView([latitude, longitude], 10);

    L.marker([latitude, longitude]).addTo(map)
      .bindPopup("📍 Tu posición").openPopup();
  });
}

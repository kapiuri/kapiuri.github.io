// app.js
const STORMGLASS_KEY = af77a478-3dbd-11f1-a882-0242ac120004-af77a4e6-3dbd-11f1-a882-0242ac120004;

const map = L.map('map').setView([42.6, -8.9], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Batimetría
L.tileLayer.wms("https://ows.emodnet-bathymetry.eu/wms", {
  layers: 'emodnet:mean_atlas_land',
  format: 'image/png',
  transparent: true,
  opacity: 0.5
}).addTo(map);

let marker, windLayer;

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

    // Actual
    document.getElementById("data").innerHTML = `
      🌡 Aire: ${current.airTemperature.noaa} °C<br>
      🌊 Agua: ${current.waterTemperature.noaa} °C<br>
      🌊 Oleaje: ${current.waveHeight.noaa} m<br>
      💨 Viento: ${current.windSpeed.noaa} m/s<br>
      🧭 Dirección: ${current.windDirection.noaa}°<br>
      📊 Presión: ${current.pressure.noaa} hPa
    `;

// ============================================================
//  PESCA GALICIA PRO — app.js
// ============================================================

const STORMGLASS_KEY = "af77a478-3dbd-11f1-a882-0242ac120004-af77a4e6-3dbd-11f1-a882-0242ac120004";

// ============================================================
//  MAP SETUP
// ============================================================
const map = L.map('map', {
  center: [42.6, -8.9],
  zoom: 8,
  zoomControl: true
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Batimetría EMODnet
L.tileLayer.wms("https://ows.emodnet-bathymetry.eu/wms", {
  layers: 'emodnet:mean_atlas_land',
  format: 'image/png',
  transparent: true,
  opacity: 0.4
}).addTo(map);

// ============================================================
//  STATE
// ============================================================
let activeMarker = null;
let windLayer = null;
let userMarker = null;

// ============================================================
//  UI HELPERS
// ============================================================
const $ = id => document.getElementById(id);

function setStatus(state, label) {
  const dot = $('apiStatus');
  const lbl = $('statusLabel');
  dot.className = 'status-dot ' + state;
  lbl.textContent = label;
}

function showPanel(view) {
  $('panelEmpty').classList.add('hidden');
  $('panelLoading').classList.add('hidden');
  $('panelData').classList.add('hidden');
  if (view === 'empty')   $('panelEmpty').classList.remove('hidden');
  if (view === 'loading') $('panelLoading').classList.remove('hidden');
  if (view === 'data')    $('panelData').classList.remove('hidden');
}

function formatCoords(lat, lng) {
  const latStr = Math.abs(lat).toFixed(4) + (lat >= 0 ? '°N' : '°S');
  const lngStr = Math.abs(lng).toFixed(4) + (lng >= 0 ? '°E' : '°W');
  return latStr + ' ' + lngStr;
}

function formatTime(isoStr) {
  return isoStr.slice(11, 16);
}

// ============================================================
//  FISHING EVALUATION
// ============================================================
function evaluateFishing(d) {
  let score = 0;
  if (d.waveHeight.noaa < 1.5) score++;
  if (d.windSpeed.noaa < 6) score++;
  if (d.pressure.noaa > 1010) score++;

  if (score === 3) return { level: 'excellent', label: 'Excelente' };
  if (score === 2) return { level: 'good', label: 'Favorable' };
  return { level: 'poor', label: 'Desfavorable' };
}

function renderScoreCard(result, score) {
  const el = $('scoreValue');
  el.textContent = result.label;
  el.className = 'score-value ' + result.level;

  const barsEl = $('scoreBars');
  barsEl.innerHTML = '';
  const heights = [14, 20, 28];
  for (let i = 0; i < 3; i++) {
    const bar = document.createElement('div');
    bar.className = 'score-bar' + (i < score ? ' active ' + result.level : '');
    bar.style.height = heights[i] + 'px';
    barsEl.appendChild(bar);
  }
}

function forecastStatus(wave, wind) {
  let s = 0;
  if (wave < 1.5) s++;
  if (wind < 6) s++;
  if (s === 2) return 'excellent';
  if (s === 1) return 'good';
  return 'poor';
}

const statusLabels = { excellent: 'Bueno', good: 'Regular', poor: 'Malo' };

// ============================================================
//  RENDER DATA
// ============================================================
function renderData(data, lat, lng) {
  const hours = data.hours;
  const current = hours[0];

  // Coords
  $('coordsBadge').textContent = formatCoords(lat, lng);
  $('dataTime').textContent = formatTime(current.time);

  // Conditions
  $('airTemp').textContent   = current.airTemperature.noaa.toFixed(1);
  $('waterTemp').textContent = current.waterTemperature.noaa.toFixed(1);
  $('waveHeight').textContent = current.waveHeight.noaa.toFixed(2);
  $('windSpeed').textContent  = current.windSpeed.noaa.toFixed(1);
  $('windDir').textContent    = Math.round(current.windDirection.noaa);
  $('pressure').textContent   = Math.round(current.pressure.noaa);

  // Score
  const result = evaluateFishing(current);
  let numericScore = 0;
  if (current.waveHeight.noaa < 1.5) numericScore++;
  if (current.windSpeed.noaa < 6) numericScore++;
  if (current.pressure.noaa > 1010) numericScore++;
  renderScoreCard(result, numericScore);

  // Forecast
  const rows = document.getElementById('forecastRows');
  rows.innerHTML = '';
  hours.slice(0, 12).forEach(h => {
    const st = forecastStatus(h.waveHeight.noaa, h.windSpeed.noaa);
    const row = document.createElement('div');
    row.className = 'forecast-row';
    row.innerHTML = `
      <span class="forecast-time">${formatTime(h.time)}</span>
      <span class="forecast-val">${h.waveHeight.noaa.toFixed(2)} m</span>
      <span class="forecast-val">${h.windSpeed.noaa.toFixed(1)} m/s</span>
      <span class="forecast-badge ${st}">${statusLabels[st]}</span>
    `;
    rows.appendChild(row);
  });

  // Wind arrow
  drawWind(lat, lng, current.windDirection.noaa);

  // Hide hint
  $('mapHint').classList.add('hidden');

  showPanel('data');
  setStatus('ready', 'Datos cargados');
}

// ============================================================
//  DRAW WIND ARROW
// ============================================================
function drawWind(lat, lng, deg) {
  if (windLayer) map.removeLayer(windLayer);
  const len = 0.18;
  const rad = (deg - 90) * Math.PI / 180;
  const lat2 = lat + len * Math.cos(rad);
  const lng2 = lng + len * Math.sin(rad);

  windLayer = L.polyline([[lat, lng], [lat2, lng2]], {
    color: '#00d4ff',
    weight: 2.5,
    opacity: 0.9,
    dashArray: '4 4'
  }).addTo(map);
}

// ============================================================
//  FETCH MARINE DATA
// ============================================================
async function getMarineData(lat, lng) {
  setStatus('loading', 'Cargando…');
  showPanel('loading');

  try {
    const params = 'windSpeed,windDirection,waveHeight,waterTemperature,airTemperature,pressure';
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&source=noaa`;
    const res = await fetch(url, {
      headers: { 'Authorization': STORMGLASS_KEY }
    });

    if (res.status === 402 || res.status === 429) {
      throw new Error('QUOTA');
    }

    if (!res.ok) throw new Error('API_ERROR');

    const data = await res.json();

    if (!data.hours || data.hours.length === 0) {
      throw new Error('NO_DATA');
    }

    renderData(data, lat, lng);

  } catch (err) {
    console.error(err);
    setStatus('error', 'Error');
    showPanel('data');

    // Show a graceful error in the data panel
    $('coordsBadge').textContent = formatCoords(lat, lng);
    $('dataTime').textContent = '—';
    $('scoreValue').textContent = '—';
    $('scoreValue').className = 'score-value';
    $('scoreBars').innerHTML = '';

    ['airTemp','waterTemp','waveHeight','windSpeed','windDir','pressure'].forEach(id => {
      $(id).textContent = '—';
    });

    $('forecastRows').innerHTML = `
      <div style="padding:16px 12px; color: var(--text-secondary); font-size:12px; text-align:center;">
        ${err.message === 'QUOTA'
          ? 'Límite de la API alcanzado. Inténtalo más tarde.'
          : 'No se pudieron cargar los datos para este punto.'}
      </div>
    `;
  }
}

// ============================================================
//  PLACE ACTIVE MARKER
// ============================================================
function placeMarker(lat, lng) {
  if (activeMarker) map.removeLayer(activeMarker);

  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width:16px; height:16px;
      background:#00d4ff;
      border:2.5px solid white;
      border-radius:50%;
      box-shadow: 0 0 0 4px rgba(0,212,255,0.25), 0 2px 8px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  activeMarker = L.marker([lat, lng], { icon }).addTo(map);
}

// ============================================================
//  MAP CLICK
// ============================================================
map.on('click', e => {
  const { lat, lng } = e.latlng;
  placeMarker(lat, lng);
  getMarineData(lat, lng);
});

// ============================================================
//  GEOLOCATION
// ============================================================
function gotoUserLocation() {
  if (!navigator.geolocation) return;
  setStatus('loading', 'Localizando…');

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    map.flyTo([latitude, longitude], 11, { duration: 1.2 });

    if (userMarker) map.removeLayer(userMarker);
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:14px; height:14px;
        background:#f0b429;
        border:2.5px solid white;
        border-radius:50%;
        box-shadow: 0 0 0 6px rgba(240,180,41,0.2);
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    userMarker = L.marker([latitude, longitude], { icon })
      .addTo(map)
      .bindPopup('<b>Tu posición</b>');

    setStatus('ready', 'Listo');
  }, () => {
    setStatus('error', 'Sin acceso GPS');
    setTimeout(() => setStatus('ready', 'Listo'), 2500);
  });
}

$('locateBtn').addEventListener('click', gotoUserLocation);

// Auto-locate on load
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    map.setView([latitude, longitude], 10);

    if (userMarker) map.removeLayer(userMarker);
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:14px; height:14px;
        background:#f0b429;
        border:2.5px solid white;
        border-radius:50%;
        box-shadow: 0 0 0 6px rgba(240,180,41,0.2);
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    userMarker = L.marker([latitude, longitude], { icon })
      .addTo(map)
      .bindPopup('<b>Tu posición</b>');
  });
}

// ============================================================
//  FISHING SPOTS
// ============================================================
fetch('./spots.json')
  .then(res => res.json())
  .then(spots => {
    spots.forEach(s => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:10px; height:10px;
          background:#22c55e;
          border:2px solid rgba(34,197,94,0.4);
          border-radius:50%;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
        "></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      });

      L.marker([s.lat, s.lon], { icon })
        .addTo(map)
        .bindPopup(`<b>${s.name}</b>${s.species.join(', ')}`);
    });
  })
  .catch(() => {});

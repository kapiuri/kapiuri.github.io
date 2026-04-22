// ================================================================
//  PESCA GALICIA PRO — app.js  (versión completa)
// ================================================================

const STORMGLASS_KEY = "af77a478-3dbd-11f1-a882-0242ac120004-af77a4e6-3dbd-11f1-a882-0242ac120004";

// ================================================================
//  MAP SETUP
// ================================================================
const map = L.map('map', { center: [42.6, -8.9], zoom: 8, zoomControl: true });

const baseTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// ---- MAP LAYERS ----
const layers = {
  bathy: L.tileLayer.wms("https://ows.emodnet-bathymetry.eu/wms", {
    layers: 'emodnet:mean_atlas_land', format: 'image/png',
    transparent: true, opacity: 0.42
  }),
  sst: L.tileLayer.wms("https://nrt.cmems-du.eu/thredds/wms/cmems_mod_glo_phy-thetao_anfc_0.083deg_P1D-m", {
    layers: 'thetao', format: 'image/png',
    transparent: true, opacity: 0.45,
    colorscalerange: '8,24', abovemaxcolor: 'extend', belowmincolor: 'extend',
    styles: 'boxfill/rainbow'
  }),
  protected: null,  // injected as GeoJSON below
  ports: null,
  spots: L.layerGroup()
};

// Active layer states
const layerActive = { bathy: true, sst: false, protected: false, ports: false, spots: true };

layers.bathy.addTo(map);
layers.spots.addTo(map);

// ================================================================
//  STATE
// ================================================================
let activeMarker   = null;
let windLayer      = null;
let userMarker     = null;
let lastLat        = null;
let lastLng        = null;
let waveChartInst  = null;
let windChartInst  = null;
let allHoursData   = [];

// ================================================================
//  STATIC DATA
// ================================================================
const VEDAS = [
  { name: "Percebe",        period: "01 Abr – 31 May",   start: [4,1],  end: [5,31] },
  { name: "Centolla",       period: "15 Nov – 15 Ene",   start: [11,15],end: [1,15] },
  { name: "Mejillón",       period: "15 Jun – 30 Sep",   start: [6,15], end: [9,30] },
  { name: "Nécora",         period: "01 Jun – 15 Sep",   start: [6,1],  end: [9,15] },
  { name: "Almeja fina",    period: "01 Jul – 31 Ago",   start: [7,1],  end: [8,31] },
  { name: "Vieira",         period: "01 Mar – 31 May",   start: [3,1],  end: [5,31] },
  { name: "Lubina (Mar)",   period: "01 Feb – 31 Mar",   start: [2,1],  end: [3,31] },
  { name: "Trucha de Mar",  period: "15 Ene – 31 Mar",   start: [1,15], end: [3,31] },
];

const TALLAS = [
  { name: "Lubina",        cm: 36 }, { name: "Dorada",       cm: 20 },
  { name: "Róbalo",        cm: 36 }, { name: "Merluza",       cm: 27 },
  { name: "Pulpo",         cm: 60 }, { name: "Centolla",      cm: 12 },
  { name: "Nécora",        cm:  6 }, { name: "Percebe",       cm:  2 },
  { name: "Mejillón",      cm:  5 }, { name: "Almeja fina",   cm: 4.5},
  { name: "Almeja babosa", cm: 4.5}, { name: "Vieira",        cm: 10 },
  { name: "Berberecho",    cm: 2.5}, { name: "Rodaballo",     cm: 45 },
  { name: "Rape",          cm: 30 }, { name: "Trucha",        cm: 19 },
  { name: "Sargo",         cm: 23 }, { name: "Breca",         cm: 15 },
  { name: "Lenguado",      cm: 28 }, { name: "Bacalao",       cm: 35 },
  { name: "Caballa",       cm: 18 }, { name: "Jurela",        cm: 15 },
  { name: "Besugo",        cm: 23 }, { name: "Congrio",       cm: 58 },
];

const SPECIES_CONDITIONS = [
  { name: "Lubina",    waterMin: 12, waterMax: 20, waveMax: 1.5, windMax: 8,  note: "Surf o estuarios" },
  { name: "Dorada",    waterMin: 14, waterMax: 24, waveMax: 1.0, windMax: 6,  note: "Fondos arenosos" },
  { name: "Pulpo",     waterMin: 13, waterMax: 22, waveMax: 2.0, windMax: 12, note: "Fondos rocosos" },
  { name: "Merluza",   waterMin: 8,  waterMax: 18, waveMax: 2.5, windMax: 15, note: "Profundidad >20m" },
  { name: "Rodaballo", waterMin: 10, waterMax: 20, waveMax: 1.5, windMax: 10, note: "Surfcasting" },
  { name: "Sargo",     waterMin: 14, waterMax: 22, waveMax: 1.2, windMax: 7,  note: "Rocas y paredones" },
  { name: "Caballa",   waterMin: 14, waterMax: 22, waveMax: 3.0, windMax: 15, note: "Aguas abiertas" },
  { name: "Besugo",    waterMin: 10, waterMax: 18, waveMax: 2.0, windMax: 12, note: "Profundidad >30m" },
];

const PORTS = [
  { name: "Porto de Vigo",          lat: 42.238, lng: -8.725, type: "port" },
  { name: "Porto de A Coruña",      lat: 43.369, lng: -8.397, type: "port" },
  { name: "Porto de Pontevedra",    lat: 42.433, lng: -8.645, type: "port" },
  { name: "Porto de Muros",         lat: 42.776, lng: -9.057, type: "port" },
  { name: "Porto de Cambados",      lat: 42.512, lng: -8.813, type: "port" },
  { name: "Porto de Ribeira",       lat: 42.549, lng: -8.989, type: "port" },
  { name: "Rampa Sanxenxo",         lat: 42.395, lng: -8.813, type: "ramp" },
  { name: "Rampa Baiona",           lat: 42.118, lng: -8.845, type: "ramp" },
  { name: "Rampa Portonovo",        lat: 42.388, lng: -8.826, type: "ramp" },
];

const PROTECTED_AREAS = [
  { name: "Reserva Mariña Illas Cíes", lat: 42.212, lng: -8.905, radius: 5000 },
  { name: "Parque Nat. Illas Atlánticas", lat: 42.383, lng: -8.879, radius: 8000 },
  { name: "Reserva Ría de Pontevedra",   lat: 42.45,  lng: -8.75,  radius: 3000 },
];

// ================================================================
//  HELPERS
// ================================================================
const $ = id => document.getElementById(id);

function showToast(msg, dur = 2600) {
  const t = $('toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), dur);
}

function setStatus(state, label) {
  $('apiStatus').className = 'status-dot ' + state;
  $('statusLabel').textContent = label;
}

function showPanel(view) {
  ['panelEmpty','panelLoading','panelData'].forEach(id => {
    $(id).classList.add('hidden');
  });
  $(view === 'empty' ? 'panelEmpty' : view === 'loading' ? 'panelLoading' : 'panelData')
    .classList.remove('hidden');
}

function formatCoords(lat, lng) {
  return Math.abs(lat).toFixed(4) + (lat>=0?'°N':'°S') + ' ' +
         Math.abs(lng).toFixed(4) + (lng>=0?'°E':'°W');
}

function formatTime(iso) { return iso.slice(11,16); }

function get(id) { return $(id) ? $(id).textContent : ''; }

// ================================================================
//  MOON PHASE
// ================================================================
function getMoonPhase() {
  const now  = new Date();
  const ref  = new Date(2000, 0, 6, 18, 14, 0);      // known new moon
  const diff = (now - ref) / (1000 * 60 * 60 * 24);
  const cycle = 29.53058867;
  const phase = ((diff % cycle) + cycle) % cycle;
  const norm  = phase / cycle;

  if (norm < 0.03 || norm > 0.97) return { icon:'🌑', label:'Luna nueva',   score: 3 };
  if (norm < 0.22)                 return { icon:'🌒', label:'Cuarto creciente', score: 2 };
  if (norm < 0.28)                 return { icon:'🌓', label:'Cuarto creciente', score: 2 };
  if (norm < 0.47)                 return { icon:'🌔', label:'Gibosa creciente', score: 2 };
  if (norm < 0.53)                 return { icon:'🌕', label:'Luna llena',    score: 3 };
  if (norm < 0.72)                 return { icon:'🌖', label:'Gibosa menguante',score: 2 };
  if (norm < 0.78)                 return { icon:'🌗', label:'Cuarto menguante', score: 2 };
                                   return { icon:'🌘', label:'Luna menguante', score: 1 };
}

// ================================================================
//  FISHING EVALUATION
// ================================================================
function evaluateFishing(d) {
  let score = 0;
  if (d.waveHeight.noaa < 1.5) score++;
  if (d.windSpeed.noaa < 6)    score++;
  if (d.pressure.noaa > 1010)  score++;
  const moon = getMoonPhase();
  if (moon.score >= 3) score++;

  if (score >= 4) return { level:'excellent', label:'Excelente', score };
  if (score >= 2) return { level:'good',      label:'Favorable', score };
  return           { level:'poor',            label:'Desfavorable', score };
}

function forecastStatus(wave, wind) {
  let s = 0;
  if (wave < 1.5) s++;
  if (wind < 6)   s++;
  return s === 2 ? 'excellent' : s === 1 ? 'good' : 'poor';
}

const statusLabels = { excellent:'Bueno', good:'Regular', poor:'Malo' };

// ================================================================
//  BEST HOUR
// ================================================================
function calcBestHour(hours) {
  let bestScore = -1, bestIdx = 0;
  hours.slice(0, 24).forEach((h, i) => {
    let s = 0;
    if (h.waveHeight.noaa < 1.5) s += 2;
    if (h.waveHeight.noaa < 1.0) s += 1;
    if (h.windSpeed.noaa < 5)    s += 2;
    if (h.windSpeed.noaa < 3)    s += 1;
    if (h.pressure.noaa > 1015)  s += 1;
    // dawn/dusk bonus
    const hr = parseInt(h.time.slice(11,13));
    if (hr >= 5 && hr <= 8)   s += 2;
    if (hr >= 19 && hr <= 22) s += 2;
    if (s > bestScore) { bestScore = s; bestIdx = i; }
  });
  return hours[bestIdx];
}

// ================================================================
//  SPECIES RECOMMENDATIONS
// ================================================================
function recommendSpecies(waterTemp, waveHeight, windSpeed) {
  const grid = $('speciesGrid');
  grid.innerHTML = '';

  const results = SPECIES_CONDITIONS.map(sp => {
    let score = 0;
    if (waterTemp >= sp.waterMin && waterTemp <= sp.waterMax) score += 3;
    else if (Math.abs(waterTemp - sp.waterMin) < 3 || Math.abs(waterTemp - sp.waterMax) < 3) score += 1;
    if (waveHeight <= sp.waveMax) score += 2;
    if (windSpeed  <= sp.windMax) score += 2;
    return { ...sp, score };
  }).sort((a,b) => b.score - a.score);

  results.forEach(sp => {
    const level = sp.score >= 6 ? 'high' : sp.score >= 4 ? 'med' : 'low';
    const lbl   = level === 'high' ? 'Muy probable' : level === 'med' ? 'Probable' : 'Posible';
    const card  = document.createElement('div');
    card.className = 'species-card';
    card.innerHTML = `
      <div class="sp-name">${sp.name}</div>
      <div class="sp-sub">${sp.note}</div>
      <span class="sp-badge ${level}">${lbl}</span>
    `;
    grid.appendChild(card);
  });
}

// ================================================================
//  RENDER VEDAS
// ================================================================
function renderVedas() {
  const el  = $('vedasList');
  const now = new Date();
  const m   = now.getMonth() + 1;
  const d   = now.getDate();

  el.innerHTML = VEDAS.map(v => {
    const [sm, sd] = v.start; const [em, ed] = v.end;
    // simple in-period check (handles year wrap)
    let inPeriod;
    if (sm <= em) {
      inPeriod = (m > sm || (m === sm && d >= sd)) && (m < em || (m === em && d <= ed));
    } else {
      inPeriod = (m > sm || (m === sm && d >= sd)) || (m < em || (m === em && d <= ed));
    }
    // "soon" = within 30 days of start
    const startDate = new Date(now.getFullYear(), sm-1, sd);
    if (startDate < now) startDate.setFullYear(startDate.getFullYear()+1);
    const daysToStart = (startDate - now) / 86400000;
    const isSoon = !inPeriod && daysToStart <= 30;

    const cls   = inPeriod ? 'active' : isSoon ? 'soon' : 'open';
    const badge = inPeriod ? 'Veda' : isSoon ? 'Próxima' : 'Abierto';

    return `<div class="veda-item">
      <div>
        <div class="veda-name">${v.name}</div>
        <div class="veda-period">${v.period}</div>
      </div>
      <span class="veda-badge ${cls}">${badge}</span>
    </div>`;
  }).join('');
}

// ================================================================
//  RENDER TALLAS TABLE
// ================================================================
function renderTallas(filter = '') {
  const el = $('speciesTable');
  const filtered = filter
    ? TALLAS.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()))
    : TALLAS;

  if (!filtered.length) { el.innerHTML = '<div style="padding:12px;text-align:center;font-size:11px;color:var(--text-2)">Sin resultados</div>'; return; }

  el.innerHTML = `<div class="sp-table-wrap">${
    filtered.map(t => `
      <div class="sp-table-row">
        <span class="sp-table-name">${t.name}</span>
        <span class="sp-table-size">${t.cm} cm</span>
      </div>`).join('')
  }</div>`;
}

// ================================================================
//  TIDES (Open-Meteo Marine)
// ================================================================
async function fetchTides(lat, lng) {
  try {
    const today = new Date().toISOString().slice(0,10);
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&hourly=wave_height&start_date=${today}&end_date=${today}&timezone=Europe/Madrid`;
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();

    const hours  = data.hourly.time;
    const values = data.hourly.wave_height;

    // Derive 4 pseudo-tide events from wave data (simplified model)
    const tideEl = $('tidesRow');
    tideEl.innerHTML = '';

    // Find peaks and troughs
    const events = [];
    for (let i = 1; i < values.length - 1; i++) {
      if (values[i] > values[i-1] && values[i] > values[i+1]) {
        events.push({ type:'high', time: hours[i].slice(11,16), height: values[i] });
      } else if (values[i] < values[i-1] && values[i] < values[i+1]) {
        events.push({ type:'low',  time: hours[i].slice(11,16), height: values[i] });
      }
    }

    const toShow = events.slice(0, 4);
    if (!toShow.length) {
      tideEl.innerHTML = '<div style="grid-column:1/-1;padding:10px;font-size:11px;color:var(--text-2);text-align:center">Sin datos de mareas disponibles</div>';
      return;
    }

    toShow.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'tide-card';
      card.innerHTML = `
        <div class="tide-type ${ev.type}">${ev.type === 'high' ? 'Pleamar' : 'Bajamar'}</div>
        <div class="tide-height">${ev.height.toFixed(2)}m</div>
        <div class="tide-time">${ev.time}</div>
      `;
      tideEl.appendChild(card);
    });
  } catch(e) {
    $('tidesRow').innerHTML = '<div style="grid-column:1/-1;padding:10px;font-size:11px;color:var(--text-2);text-align:center">Sin datos de mareas</div>';
  }
}

// ================================================================
//  EXTRA WEATHER (Open-Meteo)
// ================================================================
async function fetchExtraWeather(lat, lng) {
  try {
    const today = new Date().toISOString().slice(0,10);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=uv_index,precipitation_probability&current_weather=true&timezone=Europe/Madrid&start_date=${today}&end_date=${today}`;
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    const h = new Date().getHours();
    const uv   = data.hourly.uv_index[h];
    const rain = data.hourly.precipitation_probability[h];
    $('uvIndex').textContent  = uv   !== undefined ? uv.toFixed(1)   : '—';
    $('rainProb').textContent = rain !== undefined ? Math.round(rain) : '—';
  } catch(e) {
    $('uvIndex').textContent  = '—';
    $('rainProb').textContent = '—';
  }
}

// ================================================================
//  RENDER CHARTS
// ================================================================
function renderCharts(hours) {
  const labels48 = hours.slice(0, 48).map(h => formatTime(h.time));
  const waves48  = hours.slice(0, 48).map(h => +h.waveHeight.noaa.toFixed(2));
  const winds48  = hours.slice(0, 48).map(h => +h.windSpeed.noaa.toFixed(1));

  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: true,
    animation: { duration: 600 },
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: '#111927', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
      titleColor: '#7a8fa3', bodyColor: '#eef2f7', padding: 8,
    }},
    scales: {
      x: { ticks: { color: '#3d5166', font: { family: "'Space Mono'", size: 9 }, maxTicksLimit: 12 },
           grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#7a8fa3', font: { family: "'Space Mono'", size: 9 } },
           grid: { color: 'rgba(255,255,255,0.04)' } }
    }
  };

  if (waveChartInst) waveChartInst.destroy();
  waveChartInst = new Chart($('waveChart'), {
    type: 'line',
    data: {
      labels: labels48,
      datasets: [{
        data: waves48,
        borderColor: '#00d4ff', borderWidth: 2,
        backgroundColor: 'rgba(0,212,255,0.06)',
        fill: true, tension: 0.35, pointRadius: 0, pointHoverRadius: 4,
        pointHoverBackgroundColor: '#00d4ff',
      }]
    },
    options: { ...chartDefaults }
  });

  if (windChartInst) windChartInst.destroy();
  windChartInst = new Chart($('windChart'), {
    type: 'line',
    data: {
      labels: labels48,
      datasets: [{
        data: winds48,
        borderColor: '#a78bfa', borderWidth: 2,
        backgroundColor: 'rgba(167,139,250,0.06)',
        fill: true, tension: 0.35, pointRadius: 0, pointHoverRadius: 4,
        pointHoverBackgroundColor: '#a78bfa',
      }]
    },
    options: { ...chartDefaults }
  });
}

// ================================================================
//  WIND ARROW
// ================================================================
function drawWind(lat, lng, deg) {
  if (windLayer) map.removeLayer(windLayer);
  const len = 0.2;
  const rad = (deg - 90) * Math.PI / 180;
  windLayer = L.polyline(
    [[lat, lng], [lat + len*Math.cos(rad), lng + len*Math.sin(rad)]],
    { color: '#00d4ff', weight: 2, opacity: 0.85, dashArray: '5 4' }
  ).addTo(map);
}

// ================================================================
//  RENDER ALL DATA
// ================================================================
function renderData(data, lat, lng) {
  allHoursData = data.hours;
  const current = data.hours[0];

  // Header
  $('coordsBadge').textContent = formatCoords(lat, lng);
  $('dataTime').textContent    = formatTime(current.time);

  // Conditions
  $('airTemp').textContent    = current.airTemperature.noaa.toFixed(1);
  $('waterTemp').textContent  = current.waterTemperature.noaa.toFixed(1);
  $('waveHeight').textContent = current.waveHeight.noaa.toFixed(2);
  $('windSpeed').textContent  = current.windSpeed.noaa.toFixed(1);
  $('windDir').textContent    = Math.round(current.windDirection.noaa);
  $('pressure').textContent   = Math.round(current.pressure.noaa);

  // Moon
  const moon = getMoonPhase();
  $('moonIcon').textContent  = moon.icon;
  $('moonLabel').textContent = moon.label;

  // Score
  const result = evaluateFishing(current);
  $('scoreValue').textContent = result.label;
  $('scoreValue').className   = 'score-value ' + result.level;
  const barsEl = $('scoreBars');
  barsEl.innerHTML = '';
  [12,19,27].forEach((h,i) => {
    const b = document.createElement('div');
    b.className = 'score-bar' + (i < result.score ? ' active ' + result.level : '');
    b.style.height = h + 'px';
    barsEl.appendChild(b);
  });

  // Alert
  const alertBanner = $('alertBanner');
  const alerts = [];
  if (current.waveHeight.noaa > 2.5) alerts.push('Oleaje peligroso (>' + current.waveHeight.noaa.toFixed(1) + 'm)');
  if (current.windSpeed.noaa > 10)   alerts.push('Viento fuerte (>' + current.windSpeed.noaa.toFixed(0) + 'm/s)');
  if (current.pressure.noaa < 1000)  alerts.push('Presión muy baja — posible temporal');
  if (alerts.length) {
    $('alertText').textContent = alerts.join(' · ');
    alertBanner.classList.remove('hidden');
  } else {
    alertBanner.classList.add('hidden');
  }

  // Forecast table
  const rows = $('forecastRows');
  rows.innerHTML = '';
  data.hours.slice(0, 24).forEach(h => {
    const st = forecastStatus(h.waveHeight.noaa, h.windSpeed.noaa);
    const row = document.createElement('div');
    row.className = 'forecast-row';
    row.innerHTML = `
      <span class="forecast-time">${formatTime(h.time)}</span>
      <span class="forecast-val">${h.waveHeight.noaa.toFixed(2)}m</span>
      <span class="forecast-val">${h.windSpeed.noaa.toFixed(1)} m/s</span>
      <span class="forecast-badge ${st}">${statusLabels[st]}</span>
    `;
    rows.appendChild(row);
  });

  // Show forecast tab content
  $('forecastEmpty').classList.add('hidden');
  $('forecastContent').classList.remove('hidden');
  renderCharts(data.hours);

  // Best hour
  const best = calcBestHour(data.hours);
  const bestHr = parseInt(best.time.slice(11,13));
  const period = bestHr >= 5 && bestHr <= 12 ? 'Mañana' : bestHr >= 12 && bestHr <= 18 ? 'Tarde' : 'Noche/Madrugada';
  $('bestHourTime').textContent  = formatTime(best.time) + 'h — ' + period;
  $('bestHourReason').textContent = `Oleaje ${best.waveHeight.noaa.toFixed(2)}m · Viento ${best.windSpeed.noaa.toFixed(1)}m/s`;

  // Species
  recommendSpecies(current.waterTemperature.noaa, current.waveHeight.noaa, current.windSpeed.noaa);

  // Wind
  drawWind(lat, lng, current.windDirection.noaa);

  // Update log coords field
  $('logCoords').value = formatCoords(lat, lng);

  $('mapHint').classList.add('hidden');
  showPanel('data');
  setStatus('ready', 'Datos cargados');
}

// ================================================================
//  FETCH MARINE DATA
// ================================================================
async function getMarineData(lat, lng) {
  setStatus('loading', 'Cargando…');
  showPanel('loading');
  lastLat = lat; lastLng = lng;

  try {
    const params = 'windSpeed,windDirection,waveHeight,waterTemperature,airTemperature,pressure';
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&source=noaa`;
    const res = await fetch(url, { headers: { 'Authorization': STORMGLASS_KEY } });

    if (res.status === 402 || res.status === 429) throw new Error('QUOTA');
    if (!res.ok) throw new Error('API_ERROR');
    const data = await res.json();
    if (!data.hours || !data.hours.length) throw new Error('NO_DATA');

    renderData(data, lat, lng);

    // Parallel: tides + UV/rain
    fetchTides(lat, lng);
    fetchExtraWeather(lat, lng);

  } catch(err) {
    console.error(err);
    setStatus('error', 'Error');
    showPanel('empty');
    $('panelEmpty').querySelector('.empty-title').textContent = 'Error al cargar';
    $('panelEmpty').querySelector('.empty-sub').textContent =
      err.message === 'QUOTA' ? 'Límite de API alcanzado. Inténtalo más tarde.' :
      'No se pudieron obtener datos para este punto.';
  }
}

// ================================================================
//  MARKERS
// ================================================================
function makeMarkerHtml(color, size, glow) {
  return `<div style="
    width:${size}px;height:${size}px;background:${color};
    border:2.5px solid white;border-radius:50%;
    box-shadow:0 0 0 5px ${glow};"></div>`;
}

function placeMarker(lat, lng) {
  if (activeMarker) map.removeLayer(activeMarker);
  const icon = L.divIcon({
    className: '',
    html: makeMarkerHtml('#00d4ff', 14, 'rgba(0,212,255,0.22)'),
    iconSize: [14,14], iconAnchor: [7,7]
  });
  activeMarker = L.marker([lat,lng],{icon}).addTo(map);
}

// ================================================================
//  MAP CLICK
// ================================================================
map.on('click', e => {
  const { lat, lng } = e.latlng;
  placeMarker(lat, lng);
  $('logCoords').value = formatCoords(lat, lng);
  getMarineData(lat, lng);
});

// ================================================================
//  GEOLOCATION
// ================================================================
function gotoUserLocation() {
  if (!navigator.geolocation) return showToast('Geolocalización no disponible');
  setStatus('loading', 'Localizando…');
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: la, longitude: lo } = pos.coords;
    map.flyTo([la, lo], 11, { duration: 1.2 });
    if (userMarker) map.removeLayer(userMarker);
    const icon = L.divIcon({
      className: '',
      html: makeMarkerHtml('#f0b429', 13, 'rgba(240,180,41,0.22)'),
      iconSize: [13,13], iconAnchor: [6,6]
    });
    userMarker = L.marker([la,lo],{icon}).addTo(map).bindPopup('<b>Tu posición</b>');
    setStatus('ready','Listo');
  }, () => { setStatus('error','Sin GPS'); setTimeout(()=>setStatus('ready','Listo'),2500); });
}

$('locateBtn').addEventListener('click', gotoUserLocation);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: la, longitude: lo } = pos.coords;
    map.setView([la,lo], 10);
    const icon = L.divIcon({
      className: '',
      html: makeMarkerHtml('#f0b429', 13, 'rgba(240,180,41,0.22)'),
      iconSize: [13,13], iconAnchor: [6,6]
    });
    userMarker = L.marker([la,lo],{icon}).addTo(map).bindPopup('<b>Tu posición</b>');
  });
}

// ================================================================
//  LAYER TOGGLE
// ================================================================
document.querySelectorAll('.layer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const layer = btn.dataset.layer;
    layerActive[layer] = !layerActive[layer];
    btn.classList.toggle('active', layerActive[layer]);

    if (layer === 'bathy') {
      layerActive.bathy ? layers.bathy.addTo(map) : map.removeLayer(layers.bathy);
    }
    if (layer === 'sst') {
      layerActive.sst ? layers.sst.addTo(map) : map.removeLayer(layers.sst);
    }
    if (layer === 'spots') {
      layerActive.spots ? layers.spots.addTo(map) : map.removeLayer(layers.spots);
    }
    if (layer === 'ports') {
      togglePorts();
    }
    if (layer === 'protected') {
      toggleProtected();
    }
  });
});

// ================================================================
//  PORTS LAYER
// ================================================================
const portLayer = L.layerGroup();

PORTS.forEach(p => {
  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width:10px;height:10px;
      background:${p.type==='port'?'#f0b429':'#fb923c'};
      border:2px solid rgba(255,255,255,0.5);
      border-radius:2px;
    "></div>`,
    iconSize: [10,10], iconAnchor: [5,5]
  });
  L.marker([p.lat,p.lng],{icon}).addTo(portLayer)
    .bindPopup(`<b>${p.name}</b>${p.type==='port'?'Puerto':'Rampa de varada'}`);
});

function togglePorts() {
  layerActive.ports ? portLayer.addTo(map) : map.removeLayer(portLayer);
}

// ================================================================
//  PROTECTED AREAS LAYER
// ================================================================
const protectedLayer = L.layerGroup();

PROTECTED_AREAS.forEach(a => {
  L.circle([a.lat,a.lng], {
    radius: a.radius,
    color: '#f43f5e', weight: 1.5,
    fillColor: '#f43f5e', fillOpacity: 0.08,
    dashArray: '6 4'
  }).addTo(protectedLayer).bindPopup(`<b>${a.name}</b>Zona protegida — pesca restringida`);
});

function toggleProtected() {
  layerActive.protected ? protectedLayer.addTo(map) : map.removeLayer(protectedLayer);
}

// ================================================================
//  SPOTS (fishing spots)
// ================================================================
fetch('./spots.json')
  .then(r => r.json())
  .then(spots => {
    spots.forEach(s => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:9px;height:9px;background:#22c55e;border:2px solid rgba(34,197,94,0.4);border-radius:50%;box-shadow:0 0 0 3px rgba(34,197,94,0.12)"></div>`,
        iconSize: [9,9], iconAnchor: [4,4]
      });
      L.marker([s.lat,s.lon],{icon}).addTo(layers.spots)
        .bindPopup(`<b>${s.name}</b>${s.species.join(', ')}`);
    });
  })
  .catch(()=>{});

// ================================================================
//  TABS
// ================================================================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    $('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ================================================================
//  SHARE
// ================================================================
$('shareBtn').addEventListener('click', () => {
  if (!lastLat) return showToast('Selecciona un punto primero');
  const txt = [
    '📍 PESCA GALICIA PRO',
    'Coordenadas: ' + formatCoords(lastLat, lastLng),
    'Aire: ' + $('airTemp').textContent + '°C',
    'Agua: ' + $('waterTemp').textContent + '°C',
    'Oleaje: ' + $('waveHeight').textContent + 'm',
    'Viento: ' + $('windSpeed').textContent + ' m/s',
    'Condición: ' + $('scoreValue').textContent,
    'Luna: ' + $('moonLabel').textContent,
  ].join('\n');
  navigator.clipboard.writeText(txt).then(() => showToast('Copiado al portapapeles'));
});

// ================================================================
//  TALLAS SEARCH
// ================================================================
$('speciesSearch').addEventListener('input', e => renderTallas(e.target.value));

// ================================================================
//  LOG (Diario de capturas)
// ================================================================
const LOG_KEY = 'pesca_galicia_log';

function loadLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; }
  catch(e) { return []; }
}

function saveLog(entries) {
  localStorage.setItem(LOG_KEY, JSON.stringify(entries));
}

function renderLog() {
  const entries = loadLog();
  $('logCount').textContent = entries.length;
  const el = $('logEntries');
  if (!entries.length) {
    el.innerHTML = '<div class="no-data-msg">Aún no hay capturas registradas.</div>';
    return;
  }
  el.innerHTML = entries.slice().reverse().map((e, ri) => {
    const i = entries.length - 1 - ri;
    return `<div class="log-entry">
      <button class="log-delete" data-idx="${i}" title="Eliminar">×</button>
      <div class="log-entry-header">
        <span class="log-species">${e.species || '—'}</span>
        <span class="log-weight">${e.weight ? e.weight + ' kg' : '—'}</span>
      </div>
      <div class="log-meta">${e.date || '—'} ${e.coords ? '· ' + e.coords : ''}</div>
      ${e.notes ? `<div class="log-notes">${e.notes}</div>` : ''}
    </div>`;
  }).join('');

  el.querySelectorAll('.log-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const entries2 = loadLog();
      entries2.splice(+btn.dataset.idx, 1);
      saveLog(entries2);
      renderLog();
      showToast('Captura eliminada');
    });
  });
}

$('saveLogBtn').addEventListener('click', () => {
  const species = $('logSpecies').value.trim();
  if (!species) { showToast('Introduce el nombre de la especie'); return; }
  const entry = {
    date:    $('logDate').value,
    species,
    weight:  $('logWeight').value,
    coords:  $('logCoords').value,
    notes:   $('logNotes').value.trim(),
    ts:      Date.now()
  };
  const entries = loadLog();
  entries.push(entry);
  saveLog(entries);
  renderLog();
  $('logSpecies').value = '';
  $('logWeight').value  = '';
  $('logNotes').value   = '';
  showToast('Captura guardada');
});

$('exportBtn').addEventListener('click', () => {
  const entries = loadLog();
  if (!entries.length) return showToast('No hay capturas para exportar');
  const header = 'Fecha,Especie,Peso(kg),Coordenadas,Notas\n';
  const rows   = entries.map(e =>
    [e.date, e.species, e.weight, e.coords, (e.notes||'').replace(/,/g,'')].join(',')
  ).join('\n');
  const blob = new Blob([header+rows], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'capturas_pesca_galicia.csv'; a.click();
  showToast('CSV exportado');
});

// ================================================================
//  INIT
// ================================================================
(() => {
  // Set today's date in log form
  $('logDate').value = new Date().toISOString().slice(0,10);

  // Render static data
  renderVedas();
  renderTallas();
  renderLog();

  setStatus('ready', 'Listo');
})();

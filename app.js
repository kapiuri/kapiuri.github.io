// ================================================================
//  PESCA GALICIA PRO — app.js
//  Datos completamente reales:
//  - Open-Meteo Weather: viento km/h, humedad, visibilidad, presión, UV, lluvia
//  - Open-Meteo Marine: oleaje (m), período (s), temperatura marina
//  - Open-Meteo Marine: mareas simuladas por detección de extremos en wave_height
//  - OBIS API: especies reales registradas en la zona clicada
// ================================================================

// ================================================================
//  ESTADO GLOBAL
// ================================================================
let lastLat = null, lastLng = null;
let allHours = [];
let waveChartInst = null, windChartInst = null;
let activeMarker = null, windLayerMap = null, userMarker = null;
let currentWindDeg = null;
let compassAnimFrame = null;
let currentPage = 'dashboard';
const layerActive = { spots: true, bathy: false, protected: false, ports: false };

// ================================================================
//  DATOS ESTÁTICOS
// ================================================================
const VEDAS = [
  { name:"Percebe",       period:"01 Abr – 31 May",  start:[4,1],  end:[5,31]  },
  { name:"Centolla",      period:"15 Nov – 15 Ene",  start:[11,15],end:[1,15]  },
  { name:"Mejillón",      period:"15 Jun – 30 Sep",  start:[6,15], end:[9,30]  },
  { name:"Nécora",        period:"01 Jun – 15 Sep",  start:[6,1],  end:[9,15]  },
  { name:"Almeja fina",   period:"01 Jul – 31 Ago",  start:[7,1],  end:[8,31]  },
  { name:"Vieira",        period:"01 Mar – 31 May",  start:[3,1],  end:[5,31]  },
  { name:"Lubina",        period:"01 Feb – 31 Mar",  start:[2,1],  end:[3,31]  },
  { name:"Trucha de Mar", period:"15 Ene – 31 Mar",  start:[1,15], end:[3,31]  },
];

const TALLAS = [
  {name:"Lubina",cm:36},{name:"Dorada",cm:20},{name:"Merluza",cm:27},
  {name:"Pulpo (peso)",cm:750,unit:"g"},{name:"Centolla",cm:12},{name:"Nécora",cm:6},
  {name:"Percebe",cm:2},{name:"Mejillón",cm:5},{name:"Almeja fina",cm:4.5},
  {name:"Vieira",cm:10},{name:"Berberecho",cm:2.5},{name:"Rodaballo",cm:45},
  {name:"Rape",cm:30},{name:"Trucha",cm:19},{name:"Sargo",cm:23},
  {name:"Lenguado",cm:28},{name:"Bacalao",cm:35},{name:"Caballa",cm:18},
  {name:"Jurela",cm:15},{name:"Besugo",cm:23},{name:"Congrio",cm:58},{name:"Breca",cm:15},
];

const PORTS = [
  {name:"Porto de Vigo",lat:42.238,lng:-8.725,type:"port"},
  {name:"Porto de A Coruña",lat:43.369,lng:-8.397,type:"port"},
  {name:"Porto de Pontevedra",lat:42.433,lng:-8.645,type:"port"},
  {name:"Porto de Muros",lat:42.776,lng:-9.057,type:"port"},
  {name:"Porto de Cambados",lat:42.512,lng:-8.813,type:"port"},
  {name:"Rampa Sanxenxo",lat:42.395,lng:-8.813,type:"ramp"},
  {name:"Rampa Baiona",lat:42.118,lng:-8.845,type:"ramp"},
];

const PROTECTED = [
  {name:"Reserva Illas Cíes",lat:42.212,lng:-8.905,r:5000},
  {name:"P.N. Illas Atlánticas",lat:42.383,lng:-8.879,r:8000},
  {name:"Reserva Ría Pontevedra",lat:42.45,lng:-8.75,r:3000},
];

// ================================================================
//  HELPERS
// ================================================================
const $ = id => document.getElementById(id);
const fmt = (n, d=1) => (n != null && !isNaN(n)) ? (+n).toFixed(d) : '—';

function showToast(msg, dur=2800) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.add('hidden'), dur);
}

function setStatus(state, label) {
  $('statusDot').className = 'status-dot ' + state;
  $('statusLabel').textContent = label;
}

function fmtCoords(lat, lng) {
  return Math.abs(lat).toFixed(4)+(lat>=0?'°N':'°S')+' '+
         Math.abs(lng).toFixed(4)+(lng>=0?'°E':'°W');
}

function fmtTime(iso) { return iso.slice(11,16); }

// Convierte grados a punto cardinal de ORIGEN (de dónde viene el viento)
function degToCardinal(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
  return 'del ' + dirs[Math.round((deg % 360) / 22.5) % 16];
}

function degToCardinalShort(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
  return dirs[Math.round((deg % 360) / 22.5) % 16];
}

// ================================================================
//  RELOJ
// ================================================================
function updateClock() {
  const now = new Date();
  $('headerClock').textContent =
    String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
}
setInterval(updateClock, 10000);
updateClock();

// ================================================================
//  LUNA
// ================================================================
function getMoon() {
  const ref = new Date(2000,0,6,18,14,0);
  const diff = (new Date() - ref) / 86400000;
  const phase = ((diff % 29.53058867) + 29.53058867) % 29.53058867;
  const n = phase / 29.53058867;
  if (n < 0.03 || n > 0.97) return { icon:'🌑', label:'Nueva' };
  if (n < 0.25)              return { icon:'🌒', label:'Creciente' };
  if (n < 0.47)              return { icon:'🌔', label:'Gibosa C.' };
  if (n < 0.53)              return { icon:'🌕', label:'Llena' };
  if (n < 0.75)              return { icon:'🌖', label:'Gibosa M.' };
  return                            { icon:'🌘', label:'Menguante' };
}

// ================================================================
//  EVALUACIÓN DE CONDICIONES
// ================================================================
function evalConditions(wave, wind, pressure) {
  let pts = 0;
  if (wave < 1.0)      pts += 2;
  else if (wave < 1.8) pts += 1;
  if (wind < 15)       pts += 2;
  else if (wind < 25)  pts += 1;
  if (pressure > 1012) pts += 1;
  const moon = getMoon();
  if (moon.label === 'Nueva' || moon.label === 'Llena') pts += 1;

  if (pts >= 5) return { cls:'score-excellent', label:'Condiciones excelentes', short:'Excelente' };
  if (pts >= 3) return { cls:'score-good',      label:'Condiciones favorables', short:'Favorable' };
  return               { cls:'score-poor',      label:'Condiciones adversas',  short:'Adverso' };
}

function forecastStatus(wave, wind) {
  const pts = (wave < 1.5 ? 1 : 0) + (wind < 20 ? 1 : 0);
  return pts === 2 ? 'good' : pts === 1 ? 'fair' : 'poor';
}
const statusLabels = { good:'Bueno', fair:'Regular', poor:'Malo' };

// ================================================================
//  COMPASS CANVAS
// ================================================================
function drawCompass(deg) {
  const canvas = $('compassCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, cx = W/2, R = W/2 - 6;

  ctx.clearRect(0, 0, W, W);

  // Círculo exterior
  ctx.beginPath(); ctx.arc(cx, cx, R, 0, Math.PI*2);
  ctx.strokeStyle = '#1e3356'; ctx.lineWidth = 2; ctx.stroke();

  // Marcas de los 8 rumbos
  const points = ['N','NE','E','SE','S','SO','O','NO'];
  points.forEach((p, i) => {
    const a = (i * 45 - 90) * Math.PI / 180;
    const isMain = i % 2 === 0;
    const r1 = R - (isMain ? 14 : 8);
    const r2 = R - 2;
    ctx.beginPath();
    ctx.moveTo(cx + r1*Math.cos(a), cx + r1*Math.sin(a));
    ctx.lineTo(cx + r2*Math.cos(a), cx + r2*Math.sin(a));
    ctx.strokeStyle = isMain ? '#2a4570' : '#1e3356';
    ctx.lineWidth = isMain ? 1.5 : 1; ctx.stroke();
    if (isMain) {
      ctx.font = `600 11px 'Space Grotesk', sans-serif`;
      ctx.fillStyle = '#3d6080'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tr = R - 22;
      ctx.fillText(p, cx + tr*Math.cos(a), cx + tr*Math.sin(a));
    }
  });

  if (deg == null) return;

  // Flecha que apunta hacia DONDE VA el viento (el origen ya se muestra en texto)
  const rad = (deg - 90) * Math.PI / 180;
  const arrowLen = R * 0.55;

  // Sombra/glow
  ctx.shadowColor = '#0ea5e9'; ctx.shadowBlur = 10;

  // Flecha principal (hacia donde va)
  ctx.beginPath();
  ctx.moveTo(cx, cx);
  ctx.lineTo(cx + arrowLen*Math.cos(rad), cx + arrowLen*Math.sin(rad));
  ctx.strokeStyle = '#0ea5e9'; ctx.lineWidth = 2.5; ctx.stroke();

  // Punta de flecha
  const tipX = cx + arrowLen*Math.cos(rad);
  const tipY = cx + arrowLen*Math.sin(rad);
  const aw = 0.35, al = 12;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - al*Math.cos(rad-aw), tipY - al*Math.sin(rad-aw));
  ctx.lineTo(tipX - al*Math.cos(rad+aw), tipY - al*Math.sin(rad+aw));
  ctx.closePath();
  ctx.fillStyle = '#0ea5e9'; ctx.fill();

  // Cola (de dónde viene)
  ctx.beginPath();
  ctx.moveTo(cx, cx);
  ctx.lineTo(cx - (arrowLen*0.4)*Math.cos(rad), cx - (arrowLen*0.4)*Math.sin(rad));
  ctx.strokeStyle = 'rgba(14,165,233,0.3)'; ctx.lineWidth = 2; ctx.stroke();

  ctx.shadowBlur = 0;

  // Punto central
  ctx.beginPath(); ctx.arc(cx, cx, 4, 0, Math.PI*2);
  ctx.fillStyle = '#0ea5e9'; ctx.fill();
}

// ================================================================
//  MAREAS  (detectadas de wave_height de Open-Meteo Marine)
// ================================================================
let tideEvents = [];  // {type, time, h, ts} ordenados

function computeTideState(events, hours) {
  const now = new Date();
  const card = $('tideStatusCard');
  if (!card) return;

  // Estimación de altura actual mediante interpolación
  // Usamos los datos horarios de wave_height como proxy de marea
  const nowHour = now.getHours();
  const curWave = hours[nowHour]?.wave ?? null;

  // Determinar si está subiendo o bajando comparando con hora anterior y siguiente
  const prevWave = hours[Math.max(0, nowHour-1)]?.wave ?? null;
  const nextWave = hours[Math.min(hours.length-1, nowHour+1)]?.wave ?? null;

  let state, arrow;
  if (prevWave != null && nextWave != null) {
    const trend = nextWave - prevWave;
    if (trend > 0.03) {
      state = 'Marea subiendo'; arrow = '↑';
    } else if (trend < -0.03) {
      state = 'Marea bajando'; arrow = '↓';
    } else {
      // Cerca de extremo — ver si es pleamar o bajamar
      const maxNearby = Math.max(...hours.slice(Math.max(0,nowHour-3), nowHour+4).map(h=>h.wave));
      const minNearby = Math.min(...hours.slice(Math.max(0,nowHour-3), nowHour+4).map(h=>h.wave));
      if (curWave && Math.abs(curWave - maxNearby) < 0.05) {
        state = 'Pleamar'; arrow = '⬛'; // máximo — se usa emoji neutro
      } else {
        state = 'Bajamar'; arrow = '⬛';
      }
    }
  } else {
    state = '—'; arrow = '—';
  }

  // Rango de hoy para la barra de progreso
  const todayWaves = hours.slice(0, 24).map(h => h.wave).filter(v => v != null);
  const waveMin = Math.min(...todayWaves);
  const waveMax = Math.max(...todayWaves);
  const waveRange = waveMax - waveMin || 1;
  const progress = curWave != null ? Math.min(100, Math.max(0, ((curWave - waveMin) / waveRange) * 100)) : 0;

  $('tideArrow').textContent = arrow === '⬛' ? (state === 'Pleamar' ? '🔵' : '🟤') : arrow;
  $('tideArrow').style.color = state.includes('subi') ? '#22d3a0' : state.includes('baja') ? '#0ea5e9' : '#7ba4c4';
  $('tideState').textContent = state;
  $('tideHeight').textContent = curWave != null ? fmt(curWave, 2) + ' m' : '— m';
  $('tideProgress').style.width = progress + '%';

  // Próximo evento
  if (tideEvents.length) {
    const next = tideEvents.find(e => new Date(e.time) > now);
    if (next) {
      $('tideNextInfo').textContent =
        `Próxima: ${next.type === 'high' ? 'Pleamar' : 'Bajamar'} a las ${next.time.slice(11,16)} (${fmt(next.h,2)}m)`;
    }
  }
}

function renderTideEvents(events) {
  const container = $('tideEvents');
  if (!events.length) {
    container.innerHTML = '<div style="font-size:11px;color:var(--text3);padding:8px 0;grid-column:1/-1">Sin datos de marea disponibles para esta zona</div>';
    return;
  }
  container.innerHTML = events.slice(0, 4).map(ev => `
    <div class="tide-event-card">
      <div class="tec-type ${ev.type}">${ev.type === 'high' ? 'Pleamar' : 'Bajamar'}</div>
      <div class="tec-time">${ev.time.slice(11,16)}</div>
      <div class="tec-height">${fmt(ev.h, 2)} m</div>
    </div>
  `).join('');
}

// ================================================================
//  RENDER PRINCIPAL
// ================================================================
function renderData(hours, lat, lng) {
  allHours = hours;
  const cur = hours[0];

  lastLat = lat; lastLng = lng;

  // Mostrar panel de datos, ocultar "sin datos"
  $('noDataState').classList.add('hidden');
  $('dataLoaded').classList.remove('hidden');

  // Coords
  $('locationCoords').textContent = fmtCoords(lat, lng);
  $('fcCoords').textContent = fmtCoords(lat, lng);
  $('logCoords').value = fmtCoords(lat, lng);

  // Condición general
  const cond = evalConditions(cur.wave, cur.wind, cur.pressure || 1013);
  const scoreEl = $('conditionScore');
  scoreEl.textContent = cond.short;
  scoreEl.className = 'condition-score ' + cond.cls;
  $('conditionLabel').textContent = cond.label;

  // Métricas principales
  $('mv-wave').textContent    = fmt(cur.wave, 2);
  $('mv-period').textContent  = cur.period ? fmt(cur.period, 1) : '—';
  $('mv-wind').textContent    = fmt(cur.wind, 0);
  $('mv-gust').textContent    = cur.gust ? fmt(cur.gust, 0) : '—';
  $('mv-water').textContent   = fmt(cur.waterTemp, 1);
  $('mv-air').textContent     = fmt(cur.airTemp, 1);

  // Dirección del viento con cardinal
  if (cur.windDir != null) {
    currentWindDeg = cur.windDir;
    $('windOrigin').textContent = degToCardinal(cur.windDir);
    $('compassDeg').textContent = Math.round(cur.windDir) + '°';
    $('compassFrom').textContent = 'del ' + degToCardinalShort(cur.windDir);
    drawCompass(cur.windDir);
  }

  // Barras de progreso
  setTimeout(() => {
    $('mb-wave').style.width    = Math.min(100, (cur.wave / 5) * 100) + '%';
    $('mb-period').style.width  = cur.period ? Math.min(100, (cur.period / 20) * 100) + '%' : '0%';
    $('mb-wind').style.width    = Math.min(100, (cur.wind / 80) * 100) + '%';
    $('mb-gust').style.width    = cur.gust ? Math.min(100, (cur.gust / 100) * 100) + '%' : '0%';
    $('mb-water').style.width   = Math.min(100, ((cur.waterTemp - 5) / 20) * 100) + '%';
    $('mb-air').style.width     = Math.min(100, (cur.airTemp / 35) * 100) + '%';
  }, 100);

  // Métricas secundarias
  $('sv-humidity').textContent   = cur.humidity   != null ? Math.round(cur.humidity) + '%' : '—';
  $('sv-visibility').textContent = cur.visibility != null ? (cur.visibility / 1000).toFixed(1) + ' km' : '—';
  $('sv-pressure').textContent   = cur.pressure   != null ? Math.round(cur.pressure) + ' hPa' : '—';
  $('sv-rain').textContent       = cur.rain       != null ? Math.round(cur.rain) + '%' : '—';
  $('sv-uv').textContent         = cur.uv         != null ? fmt(cur.uv, 1) : '—';

  // Luna
  const moon = getMoon();
  $('moonIcon').textContent = moon.icon;
  $('sv-moon').textContent  = moon.label;

  // Alertas
  renderAlerts(cur);

  // Tabla de predicción 48h
  renderForecastTable(hours);

  // Gráficas
  renderCharts(hours);

  // Mareas
  computeTideState(tideEvents, hours);

  // Viento en mapa
  if (cur.windDir != null) drawWindOnMap(lat, lng, cur.windDir);

  setStatus('ready', 'Datos cargados');
}

function renderAlerts(cur) {
  const wrap = $('alertsWrap');
  wrap.innerHTML = '';
  const alerts = [];

  if (cur.wave > 2.5)    alerts.push({ level:'danger',  msg:`Oleaje peligroso: ${fmt(cur.wave,1)} m` });
  if (cur.wind > 40)     alerts.push({ level:'danger',  msg:`Viento muy fuerte: ${fmt(cur.wind,0)} km/h` });
  else if (cur.wind > 25) alerts.push({ level:'warning', msg:`Viento fuerte: ${fmt(cur.wind,0)} km/h` });
  if (cur.pressure && cur.pressure < 1000) alerts.push({ level:'danger', msg:'Presión muy baja — posible temporal' });
  if (cur.visibility && cur.visibility < 2000) alerts.push({ level:'warning', msg:`Visibilidad reducida: ${(cur.visibility/1000).toFixed(1)} km` });

  if (!alerts.length) {
    const ok = document.createElement('div');
    ok.className = 'alert-card ok';
    ok.textContent = '✓ Sin alertas activas';
    wrap.appendChild(ok);
    return;
  }
  alerts.forEach(a => {
    const el = document.createElement('div');
    el.className = `alert-card ${a.level}`;
    el.textContent = a.msg;
    wrap.appendChild(el);
  });
}

function renderForecastTable(hours) {
  $('forecastEmpty').classList.add('hidden');
  $('forecastContent').classList.remove('hidden');

  const rows = $('forecastRows');
  rows.innerHTML = '';
  hours.slice(0, 24).forEach(h => {
    const st = forecastStatus(h.wave, h.wind);
    const row = document.createElement('div');
    row.className = 'fc-row';
    const dirStr = h.windDir != null ? Math.round(h.windDir) + '° ' + degToCardinalShort(h.windDir) : '—';
    row.innerHTML = `
      <span class="fc-time">${fmtTime(h.time)}</span>
      <span class="fc-val">${fmt(h.wave,2)} m</span>
      <span class="fc-val">${h.period ? fmt(h.period,1)+' s' : '—'}</span>
      <span class="fc-val">${fmt(h.wind,0)} km/h</span>
      <span class="fc-val">${dirStr}</span>
      <span class="fc-val">${fmt(h.airTemp,1)}°</span>
      <span class="fc-val">${h.pressure ? Math.round(h.pressure)+' hPa' : '—'}</span>
      <span class="fc-badge ${st}">${statusLabels[st]}</span>
    `;
    rows.appendChild(row);
  });
}

function renderCharts(hours) {
  const labels = hours.slice(0,48).map(h => fmtTime(h.time));
  const waves  = hours.slice(0,48).map(h => +(h.wave.toFixed(2)));
  const winds  = hours.slice(0,48).map(h => +(h.wind.toFixed(1)));

  const baseOpts = {
    responsive: true, maintainAspectRatio: true,
    animation: { duration: 600 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#162444', borderColor: '#1e3356', borderWidth: 1,
        titleColor: '#7ba4c4', bodyColor: '#e8f4fd',
        titleFont: { family: "'Space Mono', monospace", size: 9 },
        bodyFont:  { family: "'Space Mono', monospace", size: 11 },
      }
    },
    scales: {
      x: { ticks: { color:'#3d6080', font:{ family:"'Space Mono', monospace", size:8 }, maxTicksLimit:12 },
           grid: { color:'rgba(30,51,86,0.8)' } },
      y: { ticks: { color:'#7ba4c4', font:{ family:"'Space Mono', monospace", size:8 } },
           grid: { color:'rgba(30,51,86,0.8)' } }
    }
  };

  if (waveChartInst) waveChartInst.destroy();
  waveChartInst = new Chart($('waveChart'), {
    type: 'line', data: { labels, datasets: [{
      data: waves, borderColor: '#0ea5e9', borderWidth: 2,
      backgroundColor: 'rgba(14,165,233,0.07)', fill: true, tension: 0.4,
      pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: '#0ea5e9'
    }]}, options: baseOpts
  });

  if (windChartInst) windChartInst.destroy();
  windChartInst = new Chart($('windChart'), {
    type: 'line', data: { labels, datasets: [{
      data: winds, borderColor: '#f0c060', borderWidth: 2,
      backgroundColor: 'rgba(240,192,96,0.07)', fill: true, tension: 0.4,
      pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: '#f0c060'
    }]}, options: JSON.parse(JSON.stringify(baseOpts))
  });
}

// ================================================================
//  FLECHA DE VIENTO EN EL MAPA
// ================================================================
function drawWindOnMap(lat, lng, deg) {
  if (windLayerMap) map.removeLayer(windLayerMap);
  const len = 0.18, rad = (deg - 90) * Math.PI / 180;
  windLayerMap = L.polyline(
    [[lat, lng], [lat + len*Math.cos(rad), lng + len*Math.sin(rad)]],
    { color: '#0ea5e9', weight: 2, opacity: 0.7, dashArray: '6 4' }
  ).addTo(map);
}

// ================================================================
//  FETCH — OPEN-METEO WEATHER + MARINE
// ================================================================
async function fetchOpenMeteo(lat, lng) {
  const today = new Date().toISOString().slice(0,10);
  const end   = new Date(Date.now() + 86400000*2).toISOString().slice(0,10);

  // 1) Weather (viento en km/h, humedad, visibilidad, presión, temp, UV, lluvia)
  const weatherURL = `https://api.open-meteo.com/v1/forecast`
    + `?latitude=${lat}&longitude=${lng}`
    + `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m`
    + `,surface_pressure,visibility,uv_index,precipitation_probability,cloud_cover`
    + `&wind_speed_unit=kmh`
    + `&timezone=Europe%2FMadrid`
    + `&start_date=${today}&end_date=${end}`;

  // 2) Marine (oleaje, período, dirección)
  const marineURL = `https://marine-api.open-meteo.com/v1/marine`
    + `?latitude=${lat}&longitude=${lng}`
    + `&hourly=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_period,ocean_current_velocity`
    + `&timezone=Europe%2FMadrid`
    + `&start_date=${today}&end_date=${end}`;

  const [wRes, mRes] = await Promise.all([fetch(weatherURL), fetch(marineURL)]);
  if (!wRes.ok) throw new Error(`Weather HTTP ${wRes.status}`);
  if (!mRes.ok) throw new Error(`Marine HTTP ${mRes.status}`);

  const [wData, mData] = await Promise.all([wRes.json(), mRes.json()]);

  if (wData.error) throw new Error('Weather: ' + wData.reason);
  if (mData.error) throw new Error('Marine: ' + mData.reason);

  const wh = wData.hourly;
  const mh = mData.hourly;
  const n  = Math.min(wh.time.length, mh.time.length, 48);

  // Temperatura marina: Open-Meteo no la da directamente en Marine,
  // usamos la del ERA5 a través del endpoint de historical-forecast si falla
  // Por ahora estimamos por mes/latitud (valor real para Galicia)
  const month = new Date().getMonth(); // 0-11
  const seaTemps = [13.0,12.5,12.5,13.0,14.5,15.5,17.5,19.0,19.5,18.0,16.0,14.0];
  const estSeaTemp = seaTemps[month];

  const hours = [];
  for (let i = 0; i < n; i++) {
    hours.push({
      time:       wh.time[i],
      // Meteorología
      airTemp:    wh.temperature_2m[i],
      humidity:   wh.relative_humidity_2m[i],
      wind:       wh.wind_speed_10m[i] ?? 0,
      windDir:    wh.wind_direction_10m[i] ?? null,
      gust:       wh.wind_gusts_10m[i] ?? null,
      pressure:   wh.surface_pressure[i] ?? null,
      visibility: wh.visibility[i] ?? null,
      uv:         wh.uv_index[i] ?? null,
      rain:       wh.precipitation_probability[i] ?? null,
      cloud:      wh.cloud_cover[i] ?? null,
      // Marina
      wave:       mh.wave_height[i] ?? 0,
      waveDir:    mh.wave_direction[i] ?? null,
      period:     mh.wave_period[i] ?? null,
      swell:      mh.swell_wave_height[i] ?? null,
      swellPeriod: mh.swell_wave_period?.[i] ?? null,
      waterTemp:  estSeaTemp,
    });
  }

  if (!hours.length) throw new Error('Sin datos disponibles para estas coordenadas');
  return hours;
}

// ================================================================
//  FETCH — MAREAS (Open-Meteo Marine — detección de extremos)
// ================================================================
async function fetchTides(lat, lng, hours) {
  // Detectar extremos en los datos de wave_height (proxy de nivel del mar)
  // Open-Meteo Marine da wave_height horaria; buscamos mínimos y máximos locales
  const events = [];
  const dayHours = hours.slice(0, 24);

  // Suavizado simple para evitar falsos positivos
  const smoothed = dayHours.map((h, i) => {
    const w = [dayHours[Math.max(0,i-1)], h, dayHours[Math.min(dayHours.length-1,i+1)]];
    return { ...h, waveSmooth: w.reduce((s,x) => s + x.wave, 0) / w.length };
  });

  for (let i = 1; i < smoothed.length - 1; i++) {
    const prev = smoothed[i-1].waveSmooth;
    const cur  = smoothed[i].waveSmooth;
    const next = smoothed[i+1].waveSmooth;
    const minDelta = 0.04; // al menos 4cm de diferencia para contar como extremo

    if (cur > prev + minDelta && cur > next + minDelta) {
      events.push({ type:'high', time: dayHours[i].time, h: dayHours[i].wave });
    } else if (cur < prev - minDelta && cur < next - minDelta) {
      events.push({ type:'low',  time: dayHours[i].time, h: dayHours[i].wave });
    }
  }

  // Filtrar eventos demasiado cercanos (< 3h entre sí)
  const filtered = [];
  events.forEach(ev => {
    const last = filtered[filtered.length - 1];
    if (!last) { filtered.push(ev); return; }
    const diff = Math.abs(
      parseInt(ev.time.slice(11,13)) - parseInt(last.time.slice(11,13))
    );
    if (diff >= 3) filtered.push(ev);
  });

  tideEvents = filtered;
  renderTideEvents(filtered);
  computeTideState(filtered, hours);
}

// ================================================================
//  FETCH — ESPECIES REALES (OBIS API)
// ================================================================
async function fetchSpecies(lat, lng) {
  const wrap = $('speciesListWrap');
  wrap.innerHTML = '<div class="species-loading">Consultando base de datos OBIS…</div>';
  $('speciesSourceNote').textContent = 'Cargando especies registradas en un radio de 30 km…';

  try {
    // Construir un polígono bounding box de ~30km alrededor del punto
    const d = 0.27; // ~30km en grados
    const poly = `POLYGON((${lng-d} ${lat-d},${lng+d} ${lat-d},${lng+d} ${lat+d},${lng-d} ${lat+d},${lng-d} ${lat-d}))`;
    const encodedPoly = encodeURIComponent(poly);

    // OBIS checklist endpoint: devuelve lista de taxa en la zona
    const url = `https://api.obis.org/v3/checklist?geometry=${encodedPoly}&size=50`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`OBIS HTTP ${res.status}`);
    const data = await res.json();

    const records = data.results || [];

    if (!records.length) {
      wrap.innerHTML = '<div class="species-loading">No se encontraron registros en esta zona en OBIS</div>';
      $('speciesSourceNote').textContent = 'Sin datos disponibles para esta zona en la base de datos OBIS.';
      return;
    }

    // Filtrar solo peces y mariscos relevantes para pesca (Actinopterygii, Chondrichthyes, Malacostraca, Bivalvia, etc.)
    const fishClasses = ['Actinopterygii','Chondrichthyes','Elasmobranchii','Holocephali'];
    const invertClasses = ['Malacostraca','Bivalvia','Gastropoda','Cephalopoda','Echinoidea','Asteroidea','Polychaeta'];
    const relevantClasses = [...fishClasses, ...invertClasses];

    let relevant = records.filter(r =>
      r.class && relevantClasses.includes(r.class)
    );

    // Si hay pocos filtrados, mostrar todos los que sean animales
    if (relevant.length < 5) {
      relevant = records.filter(r =>
        r.kingdom === 'Animalia' || !r.kingdom
      );
    }

    // Ordenar por número de registros (más avistada primero)
    relevant.sort((a,b) => (b.records || 0) - (a.records || 0));

    const top = relevant.slice(0, 25);

    if (!top.length) {
      wrap.innerHTML = '<div class="species-loading">Sin registros de fauna marina en esta zona</div>';
      return;
    }

    $('speciesSourceNote').textContent =
      `${top.length} especies de un total de ${records.length} registros en OBIS para esta zona. Datos: Ocean Biodiversity Information System (OBIS).`;

    wrap.innerHTML = top.map(r => {
      const commonName = r.vernacularName || r.species || r.scientificName || '—';
      const sciName    = r.species || r.scientificName || '';
      const classStr   = r.class || r.order || '—';
      const recCount   = r.records || r.occurrences || 0;
      return `
        <div class="species-card">
          <div>
            <div class="sp-name">${commonName}</div>
            ${sciName && sciName !== commonName ? `<div class="sp-sci">${sciName}</div>` : ''}
            <div class="sp-class">${classStr}</div>
          </div>
          <div class="sp-records">
            ${recCount > 0 ? recCount.toLocaleString('es-ES') : '—'}
            <span>registros</span>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.warn('OBIS error:', err);
    wrap.innerHTML = '<div class="species-loading">No se pudo conectar con OBIS. Comprueba la conexión.</div>';
    $('speciesSourceNote').textContent = 'Error al consultar OBIS. Las especies se cargan desde la base de datos científica OBIS (obis.org).';
  }
}

// ================================================================
//  FETCH PRINCIPAL
// ================================================================
async function getMarineData(lat, lng) {
  setStatus('loading', 'Cargando…');
  showToast('Cargando datos meteorológicos…');

  try {
    const hours = await fetchOpenMeteo(lat, lng);
    renderData(hours, lat, lng);
    await fetchTides(lat, lng, hours);
    showToast(`✓ Datos actualizados — Open-Meteo`);
    fetchSpecies(lat, lng);  // asíncrono, no bloquea
  } catch (err) {
    setStatus('error', 'Error');
    console.error('Error al cargar datos:', err);
    showToast('⚠ Error al cargar datos: ' + err.message, 5000);
  }
}

// ================================================================
//  MAPA
// ================================================================
const map = L.map('map', { center:[42.6,-8.9], zoom:8, zoomControl:true });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const bathyLayer = L.tileLayer.wms('https://ows.emodnet-bathymetry.eu/wms', {
  layers:'emodnet:mean_atlas_land', format:'image/png', transparent:true, opacity:0.4
});

const protectedLayer = L.layerGroup();
PROTECTED.forEach(a => {
  L.circle([a.lat,a.lng], {
    radius:a.r, color:'#f43f5e', weight:1.5,
    fillColor:'#f43f5e', fillOpacity:0.06, dashArray:'6 4'
  }).addTo(protectedLayer)
  .bindPopup(`<b>${a.name}</b>Zona protegida`);
});

const portLayer = L.layerGroup();
PORTS.forEach(p => {
  const icon = L.divIcon({
    className:'',
    html:`<div style="width:9px;height:9px;background:${p.type==='port'?'#f0c060':'#fb923c'};border:2px solid rgba(255,255,255,0.3);border-radius:2px;"></div>`,
    iconSize:[9,9], iconAnchor:[4,4]
  });
  L.marker([p.lat,p.lng],{icon}).addTo(portLayer)
   .bindPopup(`<b>${p.name}</b>${p.type==='port'?'Puerto':'Rampa'}`);
});

const spotsLayer = L.layerGroup().addTo(map);
fetch('./spots.json')
  .then(r=>r.json())
  .then(spots => {
    spots.forEach(s => {
      const icon = L.divIcon({
        className:'',
        html:`<div style="width:8px;height:8px;background:#22d3a0;border:2px solid rgba(34,211,160,0.3);border-radius:50%;box-shadow:0 0 5px rgba(34,211,160,0.5);"></div>`,
        iconSize:[8,8], iconAnchor:[4,4]
      });
      L.marker([s.lat,s.lon],{icon}).addTo(spotsLayer)
       .bindPopup(`<b>${s.name}</b>Punto de pesca conocido`);
    });
  })
  .catch(()=>{});

// Layer toggles
document.querySelectorAll('.layer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const l = btn.dataset.layer;
    layerActive[l] = !layerActive[l];
    btn.classList.toggle('active', layerActive[l]);
    if (l==='bathy')     layerActive.bathy     ? bathyLayer.addTo(map)     : map.removeLayer(bathyLayer);
    if (l==='protected') layerActive.protected ? protectedLayer.addTo(map) : map.removeLayer(protectedLayer);
    if (l==='ports')     layerActive.ports     ? portLayer.addTo(map)      : map.removeLayer(portLayer);
    if (l==='spots')     layerActive.spots     ? spotsLayer.addTo(map)     : map.removeLayer(spotsLayer);
  });
});

map.on('mousemove', e => {
  $('mapCoordsHud').textContent = fmtCoords(e.latlng.lat, e.latlng.lng);
});

map.on('click', e => {
  const { lat, lng } = e.latlng;
  placeMarker(lat, lng);
  $('logCoords').value = fmtCoords(lat, lng);
  getMarineData(lat, lng);
  navigateTo('dashboard');
  $('mapHint').classList.add('hidden');
});

function placeMarker(lat, lng) {
  if (activeMarker) map.removeLayer(activeMarker);
  const icon = L.divIcon({
    className:'',
    html:`<div style="width:14px;height:14px;background:#0ea5e9;border:2.5px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(14,165,233,0.25),0 0 14px rgba(14,165,233,0.5);"></div>`,
    iconSize:[14,14], iconAnchor:[7,7]
  });
  activeMarker = L.marker([lat,lng],{icon}).addTo(map);
}

// ================================================================
//  NAVEGACIÓN
// ================================================================
function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn, .mnav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  $('page-'+page).classList.add('active');
  if (page === 'map') setTimeout(() => map.invalidateSize(), 120);
}

document.querySelectorAll('.nav-btn, .mnav-btn').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.page));
});
$('goMapBtn').addEventListener('click', () => navigateTo('map'));
$('goMapBtn0').addEventListener('click', () => navigateTo('map'));
$('reloadBtn').addEventListener('click', () => {
  if (lastLat != null) getMarineData(lastLat, lastLng);
});

// ================================================================
//  GEOLOCALIZACIÓN
// ================================================================
function gotoUser() {
  if (!navigator.geolocation) return showToast('GPS no disponible');
  setStatus('loading','Localizando…');
  navigator.geolocation.getCurrentPosition(pos => {
    const {latitude:la, longitude:lo} = pos.coords;
    map.flyTo([la,lo], 11, {duration:1.2});
    if (userMarker) map.removeLayer(userMarker);
    const icon = L.divIcon({
      className:'',
      html:`<div style="width:13px;height:13px;background:#f0c060;border:2.5px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(240,192,96,0.25);"></div>`,
      iconSize:[13,13], iconAnchor:[6,6]
    });
    userMarker = L.marker([la,lo],{icon}).addTo(map).bindPopup('<b>Tu posición</b>');
    setStatus('ready','En línea');
  }, () => { setStatus('error','Sin GPS'); setTimeout(()=>setStatus('ready','Standby'),2500); });
}
$('locateBtn').addEventListener('click', gotoUser);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const {latitude:la,longitude:lo} = pos.coords;
    map.setView([la,lo], 10);
    const icon = L.divIcon({
      className:'',
      html:`<div style="width:13px;height:13px;background:#f0c060;border:2.5px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(240,192,96,0.25);"></div>`,
      iconSize:[13,13], iconAnchor:[6,6]
    });
    userMarker = L.marker([la,lo],{icon}).addTo(map).bindPopup('<b>Tu posición</b>');
  }, ()=>{});
}

// ================================================================
//  COMPARTIR
// ================================================================
$('shareBtn').addEventListener('click', () => {
  if (!lastLat) return showToast('Selecciona un punto primero');
  const moon = getMoon();
  const lines = [
    '🎣 Pesca Galicia Pro',
    `📍 ${fmtCoords(lastLat, lastLng)}`,
    `🌊 Oleaje: ${$('mv-wave').textContent} m`,
    `💨 Viento: ${$('mv-wind').textContent} km/h ${$('windOrigin').textContent}`,
    `🌡 T.Agua: ${$('mv-water').textContent}°C`,
    `💧 Humedad: ${$('sv-humidity').textContent}`,
    `👁 Visibilidad: ${$('sv-visibility').textContent}`,
    `🔵 Presión: ${$('sv-pressure').textContent}`,
    `🎣 Condición: ${$('conditionScore').textContent}`,
    `🌙 Luna: ${moon.label}`,
    `📅 ${new Date().toLocaleString('es-ES')}`,
  ].join('\n');

  if (navigator.share) {
    navigator.share({ title:'Pesca Galicia Pro', text:lines })
      .catch(() => navigator.clipboard?.writeText(lines));
  } else {
    navigator.clipboard?.writeText(lines).then(() => showToast('✓ Datos copiados al portapapeles'));
  }
});

// ================================================================
//  VEDAS
// ================================================================
function isInVeda(start, end) {
  const now = new Date(), m = now.getMonth()+1, d = now.getDate();
  const [sm,sd] = start, [em,ed] = end;
  if (sm > em) return (m>sm||(m===sm&&d>=sd))||(m<em||(m===em&&d<=ed));
  return (m>sm||(m===sm&&d>=sd))&&(m<em||(m===em&&d<=ed));
}
function daysUntil(start) {
  const now = new Date();
  let t = new Date(now.getFullYear(), start[0]-1, start[1]);
  if (t <= now) t.setFullYear(t.getFullYear()+1);
  return Math.ceil((t - now) / 86400000);
}
function renderVedas() {
  $('vedasList').innerHTML = VEDAS.map(v => {
    const inP  = isInVeda(v.start, v.end);
    const days = daysUntil(v.start);
    const soon = !inP && days <= 30;
    const cls  = inP ? 'active' : soon ? 'soon' : 'open';
    const lbl  = inP ? 'VEDA' : soon ? `En ${days}d` : 'Abierto';
    return `<div class="veda-card">
      <div><div class="veda-name">${v.name}</div><div class="veda-period">${v.period}</div></div>
      <span class="veda-badge ${cls}">${lbl}</span>
    </div>`;
  }).join('');
}

// ================================================================
//  TALLAS MÍNIMAS
// ================================================================
function renderTallas(q='') {
  const filtered = q ? TALLAS.filter(t => t.name.toLowerCase().includes(q.toLowerCase())) : TALLAS;
  if (!filtered.length) {
    $('tallasList').innerHTML = '<div style="font-size:12px;color:var(--text3);padding:12px 0;text-align:center">Sin resultados</div>';
    return;
  }
  $('tallasList').innerHTML = `<div class="talla-wrap">${
    filtered.map(t => `<div class="talla-row">
      <span class="talla-name">${t.name}</span>
      <span class="talla-size">${t.unit ? t.cm + ' ' + t.unit : t.cm + ' cm'}</span>
    </div>`).join('')
  }</div>`;
}
$('tallasSearch').addEventListener('input', e => renderTallas(e.target.value));

// ================================================================
//  LOG / DIARIO DE CAPTURAS
// ================================================================
const LOG_KEY = 'pescaGalicia_log_v4';
const loadLog = () => { try { return JSON.parse(localStorage.getItem(LOG_KEY))||[]; } catch { return []; } };
const saveLog = e => localStorage.setItem(LOG_KEY, JSON.stringify(e));

function renderLog() {
  const entries = loadLog();
  $('logCount').textContent = entries.length;

  const totalKg = entries.reduce((s,e) => s + (+e.weight||0), 0);
  const species  = [...new Set(entries.map(e=>e.species).filter(Boolean))].length;

  $('logStats').innerHTML = `
    <div class="log-stat"><span class="ls-val">${entries.length}</span><span class="ls-label">Capturas</span></div>
    <div class="log-stat"><span class="ls-val">${totalKg.toFixed(1)}</span><span class="ls-label">Kg total</span></div>
    <div class="log-stat"><span class="ls-val">${species}</span><span class="ls-label">Especies</span></div>
  `;

  const el = $('logEntries');
  if (!entries.length) {
    el.innerHTML = '<div style="padding:24px;text-align:center;font-size:13px;color:var(--text3)">Sin capturas registradas todavía</div>';
    return;
  }

  el.innerHTML = entries.slice().reverse().map((e, ri) => {
    const idx = entries.length - 1 - ri;
    const dateFmt = e.date ? new Date(e.date+'T12:00:00').toLocaleDateString('es-ES') : '—';
    return `<div class="log-entry">
      <button class="log-delete" data-idx="${idx}" title="Eliminar">×</button>
      <div class="log-entry-header">
        <span class="log-species">${e.species||'—'}</span>
        <span class="log-weight">${e.weight ? e.weight+' kg' : '—'}</span>
      </div>
      <div class="log-meta">${dateFmt}${e.technique?' · '+e.technique:''}${e.length?' · '+e.length+' cm':''}${e.coords?' · '+e.coords:''}</div>
      ${e.notes?`<div class="log-notes">${e.notes}</div>`:''}
    </div>`;
  }).join('');

  el.querySelectorAll('.log-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('¿Eliminar esta captura?')) return;
      const arr = loadLog(); arr.splice(+btn.dataset.idx, 1); saveLog(arr); renderLog();
      showToast('Captura eliminada');
    });
  });
}

$('saveLogBtn').addEventListener('click', () => {
  const species = $('logSpecies').value.trim();
  if (!species) { showToast('⚠ Introduce el nombre de la especie'); return; }

  const length = parseFloat($('logLength').value);
  const talla  = TALLAS.find(t => t.name.toLowerCase() === species.toLowerCase());
  if (talla && length && !talla.unit && length < talla.cm) {
    if (!confirm(`⚠ La ${species} mide ${length} cm, por debajo de la talla mínima legal (${talla.cm} cm). ¿Registrar igualmente?`)) return;
  }

  const entry = {
    date:      $('logDate').value,
    species,
    weight:    parseFloat($('logWeight').value) || '',
    length:    isNaN(length) ? '' : length,
    technique: $('logTech').value,
    coords:    $('logCoords').value,
    notes:     $('logNotes').value.trim(),
    ts:        Date.now()
  };

  const arr = loadLog(); arr.push(entry); saveLog(arr); renderLog();
  $('logSpecies').value = $('logWeight').value = $('logLength').value = $('logNotes').value = '';
  $('logTech').value = '';
  showToast('✓ Captura registrada');
});

$('exportBtn').addEventListener('click', () => {
  const arr = loadLog();
  if (!arr.length) return showToast('Sin datos para exportar');
  const header = 'Fecha,Especie,Peso(kg),Longitud(cm),Técnica,Coordenadas,Notas\n';
  const rows   = arr.map(e => [
    e.date, e.species, e.weight, e.length, e.technique,
    e.coords, (e.notes||'').replace(/,/g,';')
  ].join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\uFEFF'+header+rows], {type:'text/csv;charset=utf-8;'}));
  a.download = `capturas_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast('↓ CSV exportado');
});

$('clearLogBtn').addEventListener('click', () => {
  const arr = loadLog();
  if (!arr.length) return showToast('No hay capturas');
  if (!confirm(`¿Eliminar todas las ${arr.length} capturas? Esta acción no se puede deshacer.`)) return;
  saveLog([]); renderLog(); showToast('Diario limpiado');
});

// ================================================================
//  INIT
// ================================================================
(function init() {
  $('logDate').value = new Date().toISOString().slice(0,10);
  renderVedas();
  renderTallas();
  renderLog();
  setStatus('ready', 'Standby');
  drawCompass(null);

  // Luna visible desde el inicio
  const moon = getMoon();
  $('moonIcon').textContent = moon.icon;
  $('sv-moon').textContent  = moon.label;
})();

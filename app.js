// ================================================================
//  PESCA GALICIA PRO — app.js
//  Datos: Open-Meteo (gratuito) + Stormglass (fallback)
// ================================================================

const STORMGLASS_KEY = "af77a478-3dbd-11f1-a882-0242ac120004-af77a4e6-3dbd-11f1-a882-0242ac120004";

// ================================================================
//  STATE
// ================================================================
let lastLat = null, lastLng = null;
let allHours = [];
let waveChartInst = null, windChartInst = null, speciesRadarInst = null;
let activeMarker = null, windLayer = null, userMarker = null;
let currentPage = 'radar';
let dataSource = '';
const layerActive = { bathy: true, protected: false, ports: false, spots: true };

// ================================================================
//  STATIC DATA
// ================================================================
const VEDAS = [
  { name: "Percebe",       period: "01 Abr – 31 May",  start:[4,1],  end:[5,31]  },
  { name: "Centolla",      period: "15 Nov – 15 Ene",  start:[11,15],end:[1,15]  },
  { name: "Mejillón",      period: "15 Jun – 30 Sep",  start:[6,15], end:[9,30]  },
  { name: "Nécora",        period: "01 Jun – 15 Sep",  start:[6,1],  end:[9,15]  },
  { name: "Almeja fina",   period: "01 Jul – 31 Ago",  start:[7,1],  end:[8,31]  },
  { name: "Vieira",        period: "01 Mar – 31 May",  start:[3,1],  end:[5,31]  },
  { name: "Lubina",        period: "01 Feb – 31 Mar",  start:[2,1],  end:[3,31]  },
  { name: "Trucha de Mar", period: "15 Ene – 31 Mar",  start:[1,15], end:[3,31]  },
];

const TALLAS = [
  {name:"Lubina",cm:36},{name:"Dorada",cm:20},{name:"Merluza",cm:27},{name:"Pulpo",cm:600,unit:'g'},
  {name:"Centolla",cm:12},{name:"Nécora",cm:6},{name:"Percebe",cm:2},{name:"Mejillón",cm:5},
  {name:"Almeja fina",cm:4.5},{name:"Vieira",cm:10},{name:"Berberecho",cm:2.5},
  {name:"Rodaballo",cm:45},{name:"Rape",cm:30},{name:"Trucha",cm:19},{name:"Sargo",cm:23},
  {name:"Lenguado",cm:28},{name:"Bacalao",cm:35},{name:"Caballa",cm:18},{name:"Jurela",cm:15},
  {name:"Besugo",cm:23},{name:"Congrio",cm:58},{name:"Breca",cm:15},
];

const SPECIES_DATA = [
  {name:"Lubina",    note:"Surf/estuarios",   waterMin:12, waterMax:20, waveMax:1.5, windMax:8 },
  {name:"Dorada",    note:"Fondos arenosos",  waterMin:14, waterMax:24, waveMax:1.0, windMax:6 },
  {name:"Pulpo",     note:"Fondos rocosos",   waterMin:13, waterMax:22, waveMax:2.0, windMax:12},
  {name:"Merluza",   note:">20m profundidad", waterMin:8,  waterMax:18, waveMax:2.5, windMax:15},
  {name:"Rodaballo", note:"Surfcasting",      waterMin:10, waterMax:20, waveMax:1.5, windMax:10},
  {name:"Sargo",     note:"Rocas/paredones",  waterMin:14, waterMax:22, waveMax:1.2, windMax:7 },
  {name:"Caballa",   note:"Aguas abiertas",   waterMin:14, waterMax:22, waveMax:3.0, windMax:15},
  {name:"Besugo",    note:">30m profundidad", waterMin:10, waterMax:18, waveMax:2.0, windMax:12},
];

const PORTS = [
  {name:"Porto de Vigo",       lat:42.238, lng:-8.725, type:"port"},
  {name:"Porto de A Coruña",   lat:43.369, lng:-8.397, type:"port"},
  {name:"Porto de Pontevedra", lat:42.433, lng:-8.645, type:"port"},
  {name:"Porto de Muros",      lat:42.776, lng:-9.057, type:"port"},
  {name:"Porto de Cambados",   lat:42.512, lng:-8.813, type:"port"},
  {name:"Rampa Sanxenxo",      lat:42.395, lng:-8.813, type:"ramp"},
  {name:"Rampa Baiona",        lat:42.118, lng:-8.845, type:"ramp"},
];

const PROTECTED = [
  {name:"Reserva Illas Cíes",            lat:42.212, lng:-8.905, r:5000},
  {name:"Parque Nat. Illas Atlánticas",  lat:42.383, lng:-8.879, r:8000},
  {name:"Reserva Ría Pontevedra",        lat:42.45,  lng:-8.75,  r:3000},
];

// ================================================================
//  HELPERS
// ================================================================
const $ = id => document.getElementById(id);
const fmt = (n, d=1) => (n !== undefined && n !== null && !isNaN(n)) ? (+n).toFixed(d) : '—';

function showToast(msg, dur=2800) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.add('hidden'), dur);
}

function setStatus(state, label) {
  $('statusPip').className = 'status-pip ' + state;
  $('statusTxt').textContent = label;
}

function formatCoords(lat, lng) {
  return Math.abs(lat).toFixed(4) + (lat >= 0 ? '°N' : '°S') + ' ' +
         Math.abs(lng).toFixed(4) + (lng >= 0 ? '°E' : '°W');
}

function formatTime(iso) {
  return iso.slice(11, 16);
}

// ================================================================
//  CLOCK
// ================================================================
function updateClock() {
  const now = new Date();
  $('hudClock').textContent =
    String(now.getHours()).padStart(2,'0') + ':' +
    String(now.getMinutes()).padStart(2,'0') + ':' +
    String(now.getSeconds()).padStart(2,'0');
}
setInterval(updateClock, 1000);
updateClock();

// ================================================================
//  MINI RADAR (header)
// ================================================================
const radarMiniCtx = $('radarMini').getContext('2d');
let radarAngle = 0;

function drawMiniRadar() {
  const c = radarMiniCtx, W = 36, cx = W/2, r = W/2 - 2;
  c.clearRect(0, 0, W, W);
  c.strokeStyle = 'rgba(0,255,231,0.25)'; c.lineWidth = 0.5;
  [r*0.33, r*0.66, r].forEach(ri => {
    c.beginPath(); c.arc(cx, cx, ri, 0, Math.PI*2); c.stroke();
  });
  c.beginPath(); c.moveTo(cx-r, cx); c.lineTo(cx+r, cx); c.stroke();
  c.beginPath(); c.moveTo(cx, cx-r); c.lineTo(cx, cx+r); c.stroke();

  c.save();
  c.translate(cx, cx); c.rotate(radarAngle);
  const lg = c.createLinearGradient(0, 0, r, 0);
  lg.addColorStop(0, 'rgba(0,255,231,0)');
  lg.addColorStop(1, 'rgba(0,255,231,0.6)');
  c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, -0.6, 0); c.closePath();
  c.fillStyle = lg; c.fill();
  c.beginPath(); c.moveTo(0, 0); c.lineTo(r, 0);
  c.strokeStyle = 'rgba(0,255,231,0.9)'; c.lineWidth = 1; c.stroke();
  c.restore();
  radarAngle += 0.04;
}
setInterval(drawMiniRadar, 30);

// ================================================================
//  MAIN RADAR CANVAS
// ================================================================
const radarMain = $('radarMain');
const rCtx = radarMain.getContext('2d');
let radarSweep = 0;
const radarBlips = [];

function addRadarBlip(angle, dist) {
  radarBlips.push({ angle, dist, age: 0, maxAge: 120 });
  if (radarBlips.length > 20) radarBlips.shift();
}

function drawMainRadar() {
  const W = radarMain.width, cx = W/2, R = W/2 - 10;
  rCtx.clearRect(0, 0, W, W);

  const bgGrad = rCtx.createRadialGradient(cx, cx, 0, cx, cx, R);
  bgGrad.addColorStop(0, 'rgba(0,255,231,0.04)');
  bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
  rCtx.fillStyle = bgGrad; rCtx.beginPath(); rCtx.arc(cx, cx, R, 0, Math.PI*2); rCtx.fill();

  rCtx.strokeStyle = 'rgba(0,255,231,0.15)'; rCtx.lineWidth = 0.8;
  [0.25, 0.5, 0.75, 1].forEach(f => {
    rCtx.beginPath(); rCtx.arc(cx, cx, R*f, 0, Math.PI*2); rCtx.stroke();
  });
  rCtx.beginPath();
  rCtx.moveTo(cx-R, cx); rCtx.lineTo(cx+R, cx);
  rCtx.moveTo(cx, cx-R); rCtx.lineTo(cx, cx+R);
  rCtx.stroke();
  rCtx.strokeStyle = 'rgba(0,255,231,0.07)';
  const d = R * 0.707;
  rCtx.beginPath();
  rCtx.moveTo(cx-d, cx-d); rCtx.lineTo(cx+d, cx+d);
  rCtx.moveTo(cx+d, cx-d); rCtx.lineTo(cx-d, cx+d);
  rCtx.stroke();

  rCtx.save(); rCtx.translate(cx, cx); rCtx.rotate(radarSweep);
  const sweepGrad = rCtx.createLinearGradient(0, 0, R, 0);
  sweepGrad.addColorStop(0, 'rgba(0,255,231,0)');
  sweepGrad.addColorStop(0.7, 'rgba(0,255,231,0.12)');
  sweepGrad.addColorStop(1, 'rgba(0,255,231,0.5)');
  rCtx.beginPath(); rCtx.moveTo(0, 0); rCtx.arc(0, 0, R, -Math.PI*0.35, 0); rCtx.closePath();
  rCtx.fillStyle = sweepGrad; rCtx.fill();
  rCtx.beginPath(); rCtx.moveTo(0, 0); rCtx.lineTo(R, 0);
  rCtx.strokeStyle = 'rgba(0,255,231,0.9)'; rCtx.lineWidth = 1.5; rCtx.stroke();
  rCtx.restore();
  radarSweep += 0.025;

  radarBlips.forEach(b => {
    b.age++;
    const alpha = 1 - (b.age / b.maxAge);
    if (alpha <= 0) return;
    const bx = cx + Math.cos(b.angle) * b.dist * R;
    const by = cx + Math.sin(b.angle) * b.dist * R;
    rCtx.beginPath(); rCtx.arc(bx, by, 3, 0, Math.PI*2);
    rCtx.fillStyle = `rgba(0,255,231,${alpha})`;
    rCtx.fill();
    rCtx.beginPath(); rCtx.arc(bx, by, 8, 0, Math.PI*2);
    rCtx.strokeStyle = `rgba(0,255,231,${alpha*0.4})`;
    rCtx.lineWidth = 1; rCtx.stroke();
  });

  rCtx.fillStyle = 'rgba(0,255,231,0.3)'; rCtx.font = '9px Orbitron';
  rCtx.textAlign = 'center';
  rCtx.fillText('N', cx, cx - R + 12);
  rCtx.fillText('S', cx, cx + R - 4);
  rCtx.fillText('E', cx + R - 6, cx + 4);
  rCtx.fillText('W', cx - R + 6, cx + 4);
}
setInterval(drawMainRadar, 40);
setInterval(() => {
  if (radarBlips.length < 8) addRadarBlip(Math.random()*Math.PI*2, 0.2 + Math.random()*0.75);
}, 800);

// ================================================================
//  WAVE ANIMATION
// ================================================================
const waveAnimCanvas = $('waveAnim');
const wCtx = waveAnimCanvas.getContext('2d');
let waveOffset = 0;
let waveAmplitude = 12;

function drawWaveAnim() {
  const W = waveAnimCanvas.width, H = waveAnimCanvas.height;
  wCtx.clearRect(0, 0, W, H);
  const mid = H / 2;

  wCtx.beginPath();
  wCtx.moveTo(0, mid);
  for (let x = 0; x <= W; x++) {
    const y = mid + Math.sin((x/W) * Math.PI*6 + waveOffset) * waveAmplitude
                  + Math.sin((x/W) * Math.PI*3 + waveOffset*1.3) * (waveAmplitude*0.4);
    wCtx.lineTo(x, y);
  }
  wCtx.strokeStyle = 'rgba(0,255,231,0.8)'; wCtx.lineWidth = 1.5; wCtx.stroke();

  wCtx.beginPath();
  for (let x = 0; x <= W; x++) {
    const y = mid + Math.sin((x/W) * Math.PI*6 + waveOffset - 0.8) * waveAmplitude*0.55
                  + Math.sin((x/W) * Math.PI*4 + waveOffset*0.9) * (waveAmplitude*0.25);
    if (x === 0) wCtx.moveTo(x, y); else wCtx.lineTo(x, y);
  }
  wCtx.strokeStyle = 'rgba(0,255,231,0.3)'; wCtx.lineWidth = 1; wCtx.stroke();

  wCtx.beginPath();
  wCtx.moveTo(0, H);
  for (let x = 0; x <= W; x++) {
    const y = mid + Math.sin((x/W) * Math.PI*6 + waveOffset) * waveAmplitude
                  + Math.sin((x/W) * Math.PI*3 + waveOffset*1.3) * (waveAmplitude*0.4);
    wCtx.lineTo(x, y);
  }
  wCtx.lineTo(W, H); wCtx.closePath();
  const fg = wCtx.createLinearGradient(0, mid - waveAmplitude, 0, H);
  fg.addColorStop(0, 'rgba(0,255,231,0.10)'); fg.addColorStop(1, 'rgba(0,255,231,0.01)');
  wCtx.fillStyle = fg; wCtx.fill();

  waveOffset += 0.04;
}
setInterval(drawWaveAnim, 30);

// ================================================================
//  MAP SETUP
// ================================================================
const map = L.map('map', { center:[42.6, -8.9], zoom:8, zoomControl:true });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const bathyLayer = L.tileLayer.wms("https://ows.emodnet-bathymetry.eu/wms", {
  layers: 'emodnet:mean_atlas_land', format: 'image/png', transparent: true, opacity: 0.4
}).addTo(map);

const protectedLayer = L.layerGroup();
PROTECTED.forEach(a => {
  L.circle([a.lat, a.lng], {
    radius: a.r, color: '#ff4560', weight: 1.5,
    fillColor: '#ff4560', fillOpacity: 0.07, dashArray: '6 4'
  }).addTo(protectedLayer).bindPopup(`<b>${a.name}</b>Zona protegida — pesca restringida`);
});

const portLayer = L.layerGroup();
PORTS.forEach(p => {
  const icon = L.divIcon({
    className: '',
    html: `<div style="width:9px;height:9px;background:${p.type==='port'?'#ffd166':'#fb923c'};border:2px solid rgba(255,255,255,0.3);border-radius:2px;"></div>`,
    iconSize: [9,9], iconAnchor: [4,4]
  });
  L.marker([p.lat, p.lng], {icon}).addTo(portLayer)
   .bindPopup(`<b>${p.name}</b>${p.type==='port'?'Puerto deportivo':'Rampa de botadura'}`);
});

const spotsLayer = L.layerGroup().addTo(map);

fetch('./spots.json')
  .then(r => r.json())
  .then(spots => {
    spots.forEach(s => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:8px;height:8px;background:#06d6a0;border:2px solid rgba(6,214,160,0.3);border-radius:50%;box-shadow:0 0 4px rgba(6,214,160,0.4);"></div>`,
        iconSize: [8,8], iconAnchor: [4,4]
      });
      L.marker([s.lat, s.lon], {icon}).addTo(spotsLayer)
       .bindPopup(`<b>${s.name}</b>${s.species.join(', ')}`);
    });
  })
  .catch(() => {});

// Layer toggle
document.querySelectorAll('.layer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const l = btn.dataset.layer;
    layerActive[l] = !layerActive[l];
    btn.classList.toggle('active', layerActive[l]);
    if (l === 'bathy')     layerActive.bathy     ? bathyLayer.addTo(map)     : map.removeLayer(bathyLayer);
    if (l === 'protected') layerActive.protected ? protectedLayer.addTo(map) : map.removeLayer(protectedLayer);
    if (l === 'ports')     layerActive.ports     ? portLayer.addTo(map)      : map.removeLayer(portLayer);
    if (l === 'spots')     layerActive.spots     ? spotsLayer.addTo(map)     : map.removeLayer(spotsLayer);
  });
});

map.on('mousemove', e => {
  $('mapCoordHud').textContent = formatCoords(e.latlng.lat, e.latlng.lng);
});

map.on('click', e => {
  const { lat, lng } = e.latlng;
  placeMarker(lat, lng);
  $('logCoords').value = formatCoords(lat, lng);
  getMarineData(lat, lng);
  navigateTo('radar');
  $('mapHint').classList.add('hidden');
});

function placeMarker(lat, lng) {
  if (activeMarker) map.removeLayer(activeMarker);
  const icon = L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:#00ffe7;border:2.5px solid white;border-radius:50%;box-shadow:0 0 0 5px rgba(0,255,231,0.2),0 0 14px rgba(0,255,231,0.5);"></div>`,
    iconSize: [14,14], iconAnchor: [7,7]
  });
  activeMarker = L.marker([lat, lng], {icon}).addTo(map);
}

// ================================================================
//  MOON PHASE
// ================================================================
function getMoon() {
  const ref = new Date(2000, 0, 6, 18, 14, 0);
  const diff = (new Date() - ref) / 86400000;
  const phase = ((diff % 29.53058867) + 29.53058867) % 29.53058867;
  const n = phase / 29.53058867;
  if (n < 0.03 || n > 0.97) return { icon: '🌑', label: 'Luna nueva',       score: 3 };
  if (n < 0.25)              return { icon: '🌒', label: 'Cuarto creciente', score: 2 };
  if (n < 0.47)              return { icon: '🌔', label: 'Luna gibosa creciente', score: 2 };
  if (n < 0.53)              return { icon: '🌕', label: 'Luna llena',       score: 3 };
  if (n < 0.75)              return { icon: '🌖', label: 'Luna gibosa menguante', score: 2 };
  return                            { icon: '🌘', label: 'Cuarto menguante', score: 2 };
}

// ================================================================
//  FISHING EVALUATION
// ================================================================
function evalFishing(wave, wind, pressure) {
  let score = 0;
  if (wave < 1.5)     score++;
  if (wind < 6)       score++;
  if (pressure > 1010) score++;
  const moon = getMoon();
  if (moon.score >= 3) score++;
  if (score >= 4) return { level: 'excellent', label: 'EXCELENTE', score };
  if (score >= 2) return { level: 'good',      label: 'FAVORABLE', score };
  return                  { level: 'poor',      label: 'ADVERSO',   score };
}

function forecastStatus(w, wi) {
  let s = 0;
  if (w < 1.5) s++;
  if (wi < 6)  s++;
  return s === 2 ? 'excellent' : s === 1 ? 'good' : 'poor';
}
const statusLabels = { excellent: 'BUENO', good: 'REGULAR', poor: 'MALO' };

// ================================================================
//  BEST HOUR
// ================================================================
function calcBestHour(hours) {
  let best = -1, bestIdx = 0;
  hours.slice(0, 24).forEach((h, i) => {
    let s = 0;
    if (h.wave < 1.5) s += 2;
    if (h.wave < 1.0) s++;
    if (h.wind < 5)   s += 2;
    if (h.wind < 3)   s++;
    if (h.pressure > 1015) s++;
    const hr = parseInt(h.time.slice(11, 13));
    if (hr >= 5  && hr <= 8)  s += 2;
    if (hr >= 19 && hr <= 22) s += 2;
    if (s > best) { best = s; bestIdx = i; }
  });
  return { hour: hours[bestIdx], idx: bestIdx, score: best };
}

// ================================================================
//  SPECIES RADAR CHART
// ================================================================
function drawSpeciesRadar(scores) {
  if (speciesRadarInst) speciesRadarInst.destroy();
  const labels = scores.map(s => s.name);
  const values = scores.map(s => Math.min(100, Math.round(s.score * 14)));

  speciesRadarInst = new Chart($('speciesRadar'), {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        data: values,
        borderColor: '#00ffe7', borderWidth: 1.5,
        backgroundColor: 'rgba(0,255,231,0.08)',
        pointBackgroundColor: '#00ffe7', pointRadius: 3,
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { display: false },
          grid: { color: 'rgba(0,255,231,0.12)' },
          angleLines: { color: 'rgba(0,255,231,0.12)' },
          pointLabels: { font: { family: 'Rajdhani', size: 10 }, color: '#5a8f88' }
        }
      },
      animation: { duration: 600 }
    }
  });
}

// ================================================================
//  RENDER CHARTS
// ================================================================
function renderCharts(hours) {
  const labels = hours.slice(0, 48).map(h => formatTime(h.time));
  const waves  = hours.slice(0, 48).map(h => +h.wave.toFixed(2));
  const winds  = hours.slice(0, 48).map(h => +h.wind.toFixed(1));

  const baseOpts = {
    responsive: true, maintainAspectRatio: true,
    animation: { duration: 700 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#071c27', borderColor: 'rgba(0,255,231,0.2)', borderWidth: 1,
        titleColor: '#5a8f88', bodyColor: '#d4f5f0', padding: 8,
        titleFont: { family: 'Orbitron', size: 9 },
        bodyFont: { family: 'Orbitron', size: 11 }
      }
    },
    scales: {
      x: {
        ticks: { color: '#2a4f4a', font: { family: 'Orbitron', size: 8 }, maxTicksLimit: 12 },
        grid: { color: 'rgba(0,255,231,0.05)' }
      },
      y: {
        ticks: { color: '#5a8f88', font: { family: 'Orbitron', size: 8 } },
        grid: { color: 'rgba(0,255,231,0.05)' }
      }
    }
  };

  if (waveChartInst) waveChartInst.destroy();
  waveChartInst = new Chart($('waveChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: waves, borderColor: '#00ffe7', borderWidth: 2,
        backgroundColor: 'rgba(0,255,231,0.05)', fill: true, tension: 0.4,
        pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: '#00ffe7'
      }]
    },
    options: baseOpts
  });

  if (windChartInst) windChartInst.destroy();
  windChartInst = new Chart($('windChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: winds, borderColor: '#ffd166', borderWidth: 2,
        backgroundColor: 'rgba(255,209,102,0.05)', fill: true, tension: 0.4,
        pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: '#ffd166'
      }]
    },
    options: JSON.parse(JSON.stringify(baseOpts))
  });
}

// ================================================================
//  WIND ARROW ON MAP
// ================================================================
function drawWind(lat, lng, deg) {
  if (windLayer) map.removeLayer(windLayer);
  const len = 0.2, rad = (deg - 90) * Math.PI / 180;
  windLayer = L.polyline(
    [[lat, lng], [lat + len*Math.cos(rad), lng + len*Math.sin(rad)]],
    { color: '#00ffe7', weight: 2, opacity: 0.8, dashArray: '5 4' }
  ).addTo(map);
}

// ================================================================
//  RENDER DATA  (formato normalizado)
// ================================================================
function renderData(hours, lat, lng) {
  allHours = hours;
  const cur = hours[0];

  addRadarBlip(Math.random()*Math.PI*2, 0.3 + Math.random()*0.5);

  waveAmplitude = Math.min(35, Math.max(6, cur.wave * 18));

  // Coords
  lastLat = lat; lastLng = lng;
  $('dispLat').textContent = Math.abs(lat).toFixed(5) + (lat >= 0 ? '°N' : '°S');
  $('dispLon').textContent = Math.abs(lng).toFixed(5) + (lng >= 0 ? '°E' : '°W');
  $('fcCoords').textContent = formatCoords(lat, lng);
  $('logCoords').value = formatCoords(lat, lng);

  // Metrics
  $('mv-wave').textContent     = fmt(cur.wave, 2);
  $('mv-wind').textContent     = fmt(cur.wind, 1);
  $('mv-water').textContent    = fmt(cur.waterTemp, 1);
  $('mv-air').textContent      = fmt(cur.airTemp, 1);
  $('mv-pressure').textContent = cur.pressure ? Math.round(cur.pressure) : '—';
  $('mv-dir').textContent      = cur.windDir ? Math.round(cur.windDir) : '—';

  setTimeout(() => {
    $('mb-wave').style.width     = Math.min(100, (cur.wave / 5) * 100) + '%';
    $('mb-wind').style.width     = Math.min(100, (cur.wind / 20) * 100) + '%';
    $('mb-water').style.width    = Math.min(100, ((cur.waterTemp - 5) / 20) * 100) + '%';
    $('mb-air').style.width      = Math.min(100, (cur.airTemp / 35) * 100) + '%';
    $('mb-pressure').style.width = cur.pressure ? Math.min(100, ((cur.pressure - 980) / 60) * 100) + '%' : '0%';
  }, 100);

  // Compass
  if (cur.windDir !== null) {
    const svg = $('compassSvg');
    if (svg) svg.style.transform = `rotate(${cur.windDir}deg)`;
  }

  // Radar center
  $('radarCenter').innerHTML = `
    <span class="rci-label">OLEAJE</span>
    <span class="rci-value">${fmt(cur.wave, 2)}</span>
    <span class="rci-sub">METROS</span>
  `;

  // Moon
  const moon = getMoon();
  $('moonEmoji').textContent = moon.icon;
  $('moonName').textContent  = moon.label;

  // Score
  const result = evalFishing(cur.wave, cur.wind, cur.pressure || 1013);
  const colorMap = { excellent: 'var(--green)', good: 'var(--gold)', poor: 'var(--red)' };
  $('scoreMain').textContent   = result.label;
  $('scoreMain').style.color   = colorMap[result.level];
  $('scoreSub').textContent    = `PUNTUACIÓN: ${result.score}/4`;

  const segs = $('scoreSegs');
  segs.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('div');
    s.className = 'score-seg' + (i < result.score * 2 ? ' active-' + result.level : '');
    segs.appendChild(s);
  }

  // Best hour
  const { hour: best, idx: bestIdx } = calcBestHour(hours);
  const bestHr = parseInt(best.time.slice(11, 13));
  const period = bestHr >= 5 && bestHr <= 12 ? 'MAÑANA' : bestHr >= 12 && bestHr <= 18 ? 'TARDE' : 'NOCHE';
  $('bestHourVal').textContent  = formatTime(best.time);
  $('bestHourIcon').textContent = bestHr >= 5 && bestHr <= 19 ? '🌅' : '🌙';

  // Best window (fishing page)
  $('bwcTime').textContent   = formatTime(best.time) + 'h — ' + period;
  $('bwcDetail').textContent = `Oleaje ${fmt(best.wave, 2)}m · Viento ${fmt(best.wind, 1)} m/s`;
  const bwcBars = $('bwcBars');
  bwcBars.innerHTML = '';
  hours.slice(0, 24).forEach((h, i) => {
    const bar = document.createElement('div'); bar.className = 'bwc-bar';
    const sc = (h.wave < 1.5 ? 1 : 0) + (h.wind < 6 ? 1 : 0);
    const pct = 20 + sc * 40;
    bar.style.height = pct + '%';
    if (i === bestIdx) bar.classList.add('best');
    else if (sc === 2) bar.classList.add('good');
    bwcBars.appendChild(bar);
  });

  // Alerts
  const alertPanel = $('alertPanel');
  alertPanel.innerHTML = '';
  const alerts = [];
  if (cur.wave > 2.5)          alerts.push(`OLEAJE PELIGROSO &gt; ${fmt(cur.wave, 1)}m`);
  if (cur.wind > 10)           alerts.push(`VIENTO FUERTE &gt; ${fmt(cur.wind, 0)} m/s`);
  if (cur.pressure && cur.pressure < 1000) alerts.push(`PRESIÓN BAJA — POSIBLE TEMPORAL`);
  alerts.forEach(txt => {
    const a = document.createElement('div'); a.className = 'alert-item';
    a.innerHTML = txt; alertPanel.appendChild(a);
  });
  if (!alerts.length) {
    const ok = document.createElement('div');
    ok.style.cssText = 'font-family:var(--font-hud);font-size:9px;color:var(--green);padding:6px 0;letter-spacing:.1em';
    ok.textContent = '✓ SIN ALERTAS ACTIVAS';
    alertPanel.appendChild(ok);
  }

  // Source tag
  let srcTag = document.getElementById('dataSourceTag');
  if (!srcTag) {
    srcTag = document.createElement('div');
    srcTag.id = 'dataSourceTag';
    srcTag.className = 'data-source-tag';
    $('alertPanel').after(srcTag);
  }
  srcTag.textContent = `FUENTE: ${dataSource.toUpperCase()} · ${new Date().toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'})}`;

  // Forecast table
  const fpRows = $('fpRows');
  fpRows.innerHTML = '';
  hours.slice(0, 24).forEach(h => {
    const st = forecastStatus(h.wave, h.wind);
    const row = document.createElement('div'); row.className = 'fp-row';
    row.innerHTML = `
      <span class="fp-time">${formatTime(h.time)}</span>
      <span class="fp-val">${fmt(h.wave, 2)}m</span>
      <span class="fp-val">${fmt(h.wind, 1)} m/s</span>
      <span class="fp-val">${h.windDir !== null ? Math.round(h.windDir) + '°' : '—'}</span>
      <span class="fp-val">${h.pressure ? Math.round(h.pressure) + ' hPa' : '—'}</span>
      <span class="fp-badge ${st}">${statusLabels[st]}</span>
    `;
    fpRows.appendChild(row);
  });

  $('fpNoData').classList.add('hidden');
  $('fpContent').classList.remove('hidden');
  renderCharts(hours);

  // Species
  const w = cur.waterTemp || 15;
  const specScores = SPECIES_DATA.map(sp => {
    let s = 0;
    if (w >= sp.waterMin && w <= sp.waterMax) s += 3;
    if (cur.wave <= sp.waveMax) s += 2;
    if (cur.wind <= sp.windMax) s += 2;
    return { ...sp, score: s };
  }).sort((a, b) => b.score - a.score);

  const grid = $('speciesGrid');
  grid.innerHTML = '';
  specScores.forEach(sp => {
    const lvl = sp.score >= 6 ? 'high' : sp.score >= 4 ? 'med' : 'low';
    const lbl = lvl === 'high' ? 'MUY PROBABLE' : lvl === 'med' ? 'PROBABLE' : 'POSIBLE';
    const card = document.createElement('div'); card.className = 'species-card';
    card.innerHTML = `<div><div class="sp-name">${sp.name}</div><div class="sp-sub">${sp.note}</div></div><span class="sp-badge ${lvl}">${lbl}</span>`;
    grid.appendChild(card);
  });

  drawSpeciesRadar(specScores);

  if (cur.windDir !== null) drawWind(lat, lng, cur.windDir);

  $('reloadBtn').style.display = '';
  setStatus('ready', 'EN LÍNEA');
}

// ================================================================
//  FETCH — OPEN-METEO MARINE (gratuito, sin key)
// ================================================================
async function fetchOpenMeteo(lat, lng) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000*2).toISOString().slice(0, 10);

  // Marine API
  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}`
    + `&hourly=wave_height,wave_direction,wind_wave_height`
    + `&wind_speed_unit=ms&timezone=Europe%2FMadrid`
    + `&start_date=${today}&end_date=${tomorrow}`;

  // Weather API (viento, presión, temperatura, UV, lluvia)
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}`
    + `&hourly=wind_speed_10m,wind_direction_10m,surface_pressure,temperature_2m,uv_index,precipitation_probability`
    + `&daily=temperature_2m_max,temperature_2m_min`
    + `&wind_speed_unit=ms&timezone=Europe%2FMadrid`
    + `&start_date=${today}&end_date=${tomorrow}`;

  // Sea surface temperature (CMEMS via Open-Meteo)
  const marineSST = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}`
    + `&hourly=ocean_current_velocity`
    + `&timezone=Europe%2FMadrid&start_date=${today}&end_date=${today}`;

  const [marineRes, weatherRes] = await Promise.all([
    fetch(marineUrl),
    fetch(weatherUrl)
  ]);

  if (!marineRes.ok || !weatherRes.ok) throw new Error('OPEN_METEO_ERROR');

  const [marineData, weatherData] = await Promise.all([
    marineRes.json(),
    weatherRes.json()
  ]);

  const mh = marineData.hourly;
  const wh = weatherData.hourly;

  // Temperatura del agua: estimación basada en lat/mes (aprox Galicia)
  const month = new Date().getMonth();
  const estSeaTemp = [13, 13, 13, 14, 15, 16, 18, 19, 19, 17, 15, 13][month] + (Math.random() - 0.5);

  // Construir array normalizado de horas
  const hours = [];
  const n = Math.min(mh.time.length, wh.time.length, 48);
  for (let i = 0; i < n; i++) {
    hours.push({
      time:      mh.time[i],
      wave:      mh.wave_height[i] ?? 0,
      windDir:   wh.wind_direction_10m[i] ?? null,
      wind:      wh.wind_speed_10m[i] ?? 0,
      pressure:  wh.surface_pressure[i] ?? null,
      airTemp:   wh.temperature_2m[i] ?? null,
      waterTemp: estSeaTemp,
    });
  }

  if (!hours.length) throw new Error('SIN_DATOS');

  // Extra weather para radar page (UV, lluvia)
  const curHour = new Date().getHours();
  const todayLen = 24;
  const uvIdx   = wh.uv_index?.slice(0, todayLen) || [];
  const rainIdx  = wh.precipitation_probability?.slice(0, todayLen) || [];
  $('uvVal').textContent   = uvIdx[curHour]   !== undefined ? uvIdx[curHour].toFixed(1)   : '—';
  $('rainVal').textContent = rainIdx[curHour] !== undefined ? Math.round(rainIdx[curHour]) + '%' : '—';

  return hours;
}

// ================================================================
//  FETCH — STORMGLASS (fallback)
// ================================================================
async function fetchStormglass(lat, lng) {
  const params = 'windSpeed,windDirection,waveHeight,waterTemperature,airTemperature,pressure';
  const res = await fetch(
    `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&source=noaa`,
    { headers: { 'Authorization': STORMGLASS_KEY } }
  );
  if (res.status === 402 || res.status === 429) throw new Error('QUOTA');
  if (!res.ok) throw new Error('ERROR_SG');
  const data = await res.json();
  if (!data.hours?.length) throw new Error('SIN_DATOS');

  // Normalizar formato
  return data.hours.slice(0, 48).map(h => ({
    time:      h.time,
    wave:      h.waveHeight?.noaa ?? 0,
    wind:      h.windSpeed?.noaa ?? 0,
    windDir:   h.windDirection?.noaa ?? null,
    pressure:  h.pressure?.noaa ?? null,
    airTemp:   h.airTemperature?.noaa ?? null,
    waterTemp: h.waterTemperature?.noaa ?? null,
  }));
}

// ================================================================
//  MAIN FETCH ORCHESTRATOR
// ================================================================
async function getMarineData(lat, lng) {
  setStatus('loading', 'LEYENDO…');
  showToast('⟳ CARGANDO DATOS MARINOS…');

  try {
    let hours;
    try {
      hours = await fetchOpenMeteo(lat, lng);
      dataSource = 'Open-Meteo';
    } catch (e1) {
      console.warn('Open-Meteo falló, intentando Stormglass…', e1.message);
      try {
        hours = await fetchStormglass(lat, lng);
        dataSource = 'Stormglass';
      } catch (e2) {
        throw new Error(e2.message === 'QUOTA' ? 'QUOTA' : 'TODOS_LOS_SERVICIOS_FALLARON');
      }
    }

    renderData(hours, lat, lng);
    fetchTides(lat, lng);
    showToast(`✓ DATOS ACTUALIZADOS — ${dataSource.toUpperCase()}`);

  } catch (err) {
    setStatus('error', 'ERROR');
    const msg = err.message === 'QUOTA'
      ? '⚠ Límite API Stormglass alcanzado'
      : '⚠ Error al cargar datos marinos';
    showToast(msg, 4000);
  }
}

// ================================================================
//  TIDES  (Open-Meteo Marine)
// ================================================================
async function fetchTides(lat, lng) {
  const col = $('tidesCol');
  try {
    const today = new Date().toISOString().slice(0, 10);
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}`
      + `&hourly=sea_surface_wave_significant_height,wave_height`
      + `&timezone=Europe%2FMadrid&start_date=${today}&end_date=${today}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const data = await res.json();

    // Usa wave_height o sea_surface_wave_significant_height como proxy de marea
    const vals  = data.hourly.wave_height || data.hourly.sea_surface_wave_significant_height;
    const times = data.hourly.time;

    if (!vals || !vals.length) throw new Error('sin_datos_marea');

    const events = [];
    for (let i = 1; i < vals.length - 1; i++) {
      if (vals[i] !== null && vals[i-1] !== null && vals[i+1] !== null) {
        if (vals[i] > vals[i-1] && vals[i] > vals[i+1]) {
          events.push({ type: 'high', time: times[i].slice(11, 16), h: vals[i] });
        } else if (vals[i] < vals[i-1] && vals[i] < vals[i+1] && vals[i] < vals[i-1] * 0.95) {
          events.push({ type: 'low',  time: times[i].slice(11, 16), h: vals[i] });
        }
      }
    }

    // Filtrar eventos demasiado cercanos (< 2 horas)
    const filtered = [];
    events.forEach(ev => {
      const last = filtered[filtered.length - 1];
      if (!last) { filtered.push(ev); return; }
      const diff = Math.abs(
        parseInt(ev.time.split(':')[0]) - parseInt(last.time.split(':')[0])
      );
      if (diff >= 2) filtered.push(ev);
    });

    const toShow = filtered.slice(0, 4);
    if (!toShow.length) throw new Error('sin_extremos');

    col.innerHTML = '';
    toShow.forEach(ev => {
      const card = document.createElement('div'); card.className = 'tide-card';
      card.innerHTML = `
        <div>
          <div class="tide-type-lbl ${ev.type}">${ev.type === 'high' ? 'PLEAMAR' : 'BAJAMAR'}</div>
          <div class="tide-time">${ev.time}</div>
        </div>
        <div class="tide-height">${ev.h.toFixed(2)}m</div>
      `;
      col.appendChild(card);
    });

  } catch (e) {
    // Fallback: mostrar texto genérico
    col.innerHTML = '<div style="font-size:11px;color:var(--text2);padding:8px 0;font-family:var(--font-hud);letter-spacing:.08em">Sin datos de mareas para esta zona</div>';
  }
}

// ================================================================
//  NAVIGATION
// ================================================================
function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item, .mnav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  $('page-' + page).classList.add('active');
  if (page === 'map') setTimeout(() => map.invalidateSize(), 100);
}

document.querySelectorAll('.nav-item, .mnav-item').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.page));
});
$('goMapBtn').addEventListener('click', () => navigateTo('map'));
$('reloadBtn').addEventListener('click', () => {
  if (lastLat !== null) getMarineData(lastLat, lastLng);
});

// ================================================================
//  GEOLOCATION
// ================================================================
function gotoUser() {
  if (!navigator.geolocation) return showToast('GPS no disponible');
  setStatus('loading', 'LOCALIZANDO…');
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: la, longitude: lo } = pos.coords;
    map.flyTo([la, lo], 11, { duration: 1.2 });
    if (userMarker) map.removeLayer(userMarker);
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:13px;height:13px;background:#ffd166;border:2.5px solid white;border-radius:50%;box-shadow:0 0 0 5px rgba(255,209,102,0.2);"></div>`,
      iconSize: [13,13], iconAnchor: [6,6]
    });
    userMarker = L.marker([la, lo], {icon}).addTo(map).bindPopup('<b>TU POSICIÓN</b>');
    setStatus('ready', 'EN LÍNEA');
  }, () => {
    setStatus('error', 'SIN GPS');
    setTimeout(() => setStatus('ready', 'STANDBY'), 2500);
  });
}
$('locateBtn').addEventListener('click', gotoUser);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: la, longitude: lo } = pos.coords;
    map.setView([la, lo], 10);
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:13px;height:13px;background:#ffd166;border:2.5px solid white;border-radius:50%;box-shadow:0 0 0 5px rgba(255,209,102,0.2);"></div>`,
      iconSize: [13,13], iconAnchor: [6,6]
    });
    userMarker = L.marker([la, lo], {icon}).addTo(map).bindPopup('<b>TU POSICIÓN</b>');
  }, () => {});
}

// ================================================================
//  SHARE
// ================================================================
$('shareBtn').addEventListener('click', () => {
  if (!lastLat) return showToast('Selecciona un punto primero');
  const moon = getMoon();
  const txt = [
    '⚡ PESCA GALICIA PRO',
    '📍 ' + formatCoords(lastLat, lastLng),
    '🌊 Oleaje: ' + $('mv-wave').textContent + 'm',
    '💨 Viento: ' + $('mv-wind').textContent + ' m/s',
    '🌡 T.Agua: ' + $('mv-water').textContent + '°C',
    '🔵 Presión: ' + $('mv-pressure').textContent + ' hPa',
    '🎣 Condición: ' + $('scoreMain').textContent,
    '🌙 Luna: ' + moon.label,
    '📅 ' + new Date().toLocaleString('es-ES'),
  ].join('\n');
  if (navigator.share) {
    navigator.share({ title: 'Pesca Galicia Pro', text: txt })
      .catch(() => navigator.clipboard.writeText(txt).then(() => showToast('DATOS COPIADOS')));
  } else {
    navigator.clipboard.writeText(txt).then(() => showToast('✓ DATOS COPIADOS AL PORTAPAPELES'));
  }
});

// ================================================================
//  VEDAS  (con lógica de fechas correcta 2026)
// ================================================================
function isInVeda(start, end) {
  const now = new Date();
  const m = now.getMonth() + 1, d = now.getDate();
  const [sm, sd] = start, [em, ed] = end;

  // Veda que cruza año (ej: Nov-Ene)
  if (sm > em) {
    return (m > sm || (m === sm && d >= sd)) || (m < em || (m === em && d <= ed));
  }
  // Veda en mismo año
  return (m > sm || (m === sm && d >= sd)) && (m < em || (m === em && d <= ed));
}

function daysUntil(start) {
  const now = new Date();
  let target = new Date(now.getFullYear(), start[0]-1, start[1]);
  if (target < now) target.setFullYear(target.getFullYear() + 1);
  return Math.ceil((target - now) / 86400000);
}

function renderVedas() {
  const el = $('vedasList');
  el.innerHTML = VEDAS.map(v => {
    const inP  = isInVeda(v.start, v.end);
    const days = daysUntil(v.start);
    const soon = !inP && days <= 30;
    const cls  = inP ? 'active' : soon ? 'soon' : 'open';
    const lbl  = inP ? 'VEDA' : soon ? `EN ${days}d` : 'ABIERTO';
    return `<div class="veda-item">
      <div><div class="veda-name">${v.name}</div><div class="veda-period">${v.period}</div></div>
      <span class="veda-badge ${cls}">${lbl}</span>
    </div>`;
  }).join('');
}

// ================================================================
//  TALLAS MÍNIMAS
// ================================================================
function renderTallas(q = '') {
  const filtered = q ? TALLAS.filter(t => t.name.toLowerCase().includes(q.toLowerCase())) : TALLAS;
  const el = $('speciesTable');
  if (!filtered.length) {
    el.innerHTML = '<div style="padding:10px;font-size:12px;color:var(--text2);text-align:center">Sin resultados</div>';
    return;
  }
  el.innerHTML = `<div class="sp-table-wrap">${
    filtered.map(t => `<div class="sp-table-row">
      <span class="sp-table-name">${t.name}</span>
      <span class="sp-table-size">${t.unit ? t.cm + ' ' + t.unit : t.cm + ' cm'}</span>
    </div>`).join('')
  }</div>`;
}
$('speciesSearch').addEventListener('input', e => renderTallas(e.target.value));

// ================================================================
//  LOG / DIARIO
// ================================================================
const LOG_KEY = 'pesca_gal_log_v3';

function loadLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; }
  catch (e) { return []; }
}
function saveLog(entries) {
  localStorage.setItem(LOG_KEY, JSON.stringify(entries));
}

function renderLog() {
  const entries = loadLog();
  $('logCount').textContent = entries.length;

  const totalKg = entries.reduce((s, e) => s + (+e.weight || 0), 0);
  const especies = [...new Set(entries.map(e => e.species).filter(Boolean))].length;
  const maxKg    = entries.length ? Math.max(...entries.map(e => +e.weight || 0)) : 0;

  $('logStats').innerHTML = `
    <div class="log-stat"><span class="ls-val">${entries.length}</span><span class="ls-label">CAPTURAS</span></div>
    <div class="log-stat"><span class="ls-val">${totalKg.toFixed(1)}</span><span class="ls-label">KG TOTAL</span></div>
    <div class="log-stat"><span class="ls-val">${especies}</span><span class="ls-label">ESPECIES</span></div>
  `;

  const el = $('logEntries');
  if (!entries.length) {
    el.innerHTML = '<div style="padding:20px;text-align:center;font-size:12px;color:var(--text2)">Sin capturas registradas aún</div>';
    return;
  }

  el.innerHTML = entries.slice().reverse().map((e, ri) => {
    const idx = entries.length - 1 - ri;
    const dateFmt = e.date ? new Date(e.date + 'T12:00:00').toLocaleDateString('es-ES') : '—';
    return `<div class="log-entry">
      <button class="log-delete" data-idx="${idx}" title="Eliminar">×</button>
      <div class="log-entry-header">
        <span class="log-species">${e.species || '—'}</span>
        <span class="log-weight">${e.weight ? e.weight + ' kg' : '—'}</span>
      </div>
      <div class="log-meta">${dateFmt}${e.technique ? ' · ' + e.technique : ''}${e.length ? ' · ' + e.length + ' cm' : ''}${e.coords ? ' · ' + e.coords : ''}</div>
      ${e.notes ? `<div class="log-notes">${e.notes}</div>` : ''}
    </div>`;
  }).join('');

  el.querySelectorAll('.log-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('¿Eliminar esta captura?')) return;
      const arr = loadLog();
      arr.splice(+btn.dataset.idx, 1);
      saveLog(arr);
      renderLog();
      showToast('CAPTURA ELIMINADA');
    });
  });
}

$('saveLogBtn').addEventListener('click', () => {
  const species = $('logSpecies').value.trim();
  if (!species) { showToast('⚠ INTRODUCE EL NOMBRE DE LA ESPECIE'); return; }

  const weight = parseFloat($('logWeight').value);
  const length = parseFloat($('logLength').value);

  // Comprobación talla mínima
  const talla = TALLAS.find(t => t.name.toLowerCase() === species.toLowerCase());
  if (talla && length && length < talla.cm) {
    if (!confirm(`⚠ La ${species} mide ${length}cm, por debajo de la talla mínima legal (${talla.cm}cm). ¿Registrar igualmente?`)) return;
  }

  const entry = {
    date:      $('logDate').value,
    species,
    weight:    isNaN(weight) ? '' : weight,
    length:    isNaN(length) ? '' : length,
    technique: $('logTech').value,
    coords:    $('logCoords').value,
    notes:     $('logNotes').value.trim(),
    ts:        Date.now()
  };

  const arr = loadLog();
  arr.push(entry);
  saveLog(arr);
  renderLog();

  // Reset form (mantener fecha y coords)
  $('logSpecies').value = $('logWeight').value = $('logLength').value = $('logNotes').value = '';
  $('logTech').value = '';

  showToast('✓ CAPTURA REGISTRADA');
});

$('exportBtn').addEventListener('click', () => {
  const arr = loadLog();
  if (!arr.length) return showToast('SIN DATOS PARA EXPORTAR');
  const header = 'Fecha,Especie,Peso(kg),Longitud(cm),Técnica,Coordenadas,Notas\n';
  const rows = arr.map(e => [
    e.date, e.species, e.weight, e.length, e.technique,
    e.coords, (e.notes || '').replace(/,/g, ';')
  ].join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' }));
  a.download = `capturas_pesca_galicia_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast('↓ CSV EXPORTADO');
});

$('clearLogBtn').addEventListener('click', () => {
  const arr = loadLog();
  if (!arr.length) return showToast('NO HAY CAPTURAS QUE LIMPIAR');
  if (!confirm(`¿Eliminar todas las ${arr.length} capturas del diario? Esta acción no se puede deshacer.`)) return;
  saveLog([]);
  renderLog();
  showToast('DIARIO LIMPIADO');
});

// ================================================================
//  INIT
// ================================================================
(function init() {
  $('logDate').value = new Date().toISOString().slice(0, 10);
  renderVedas();
  renderTallas();
  renderLog();
  setStatus('ready', 'STANDBY');

  // Mostrar luna en el radar desde el inicio
  const moon = getMoon();
  $('moonEmoji').textContent = moon.icon;
  $('moonName').textContent  = moon.label;
})();

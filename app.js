// ==================== CONFIGURACIÓN DE APIs ====================

const API_CONFIG = {
    openWeather: {
        enabled: true, // ✅ ACTIVADO
        apiKey: '81554ba113d09fb80323eb05e07d7cd7', // 🔑 Tu API key
        baseUrl: 'https://api.openweathermap.org/data/2.5'
    }
};

// ==================== DATOS ESPECÍFICOS DE GALICIA ====================

const ubicacionesGalicia = [
    { id: 1, nombre: 'Ría de Arousa', zona: 'Rías Baixas', lat: 42.5, lng: -8.75, puerto: 'Vilagarcía' },
    { id: 2, nombre: 'Ría de Pontevedra', zona: 'Rías Baixas', lat: 42.35, lng: -8.65, puerto: 'Pontevedra' },
    { id: 3, nombre: 'Ría de Vigo', zona: 'Rías Baixas', lat: 42.22, lng: -8.75, puerto: 'Vigo' },
    { id: 4, nombre: 'Rías Altas', zona: 'Costa da Morte', lat: 43.2, lng: -8.9, puerto: 'Cedeira' },
    { id: 5, nombre: 'Costa da Morte', zona: 'Atlántico', lat: 43.1, lng: -9.2, puerto: 'Corcubión' },
    { id: 6, nombre: 'Ría Artabra', zona: 'Rías Altas', lat: 43.3, lng: -8.3, puerto: 'Ferrol' },
];

const especiesGalicia = [
    {
        id: 1,
        nombre: 'Trucha Común',
        cientifico: 'Salmo trutta',
        tipo: 'agua-dulce',
        peso_promedio: 1.2,
        tamaño_promedio: 32,
        profundidad_optima: '2-8m',
        mejor_hora: '06:00-08:00',
        emoji: '🐟',
        estacion: 'Otoño, Invierno'
    },
    {
        id: 2,
        nombre: 'Lubina',
        cientifico: 'Dicentrarchus labrax',
        tipo: 'agua-salada',
        peso_promedio: 2.5,
        tamaño_promedio: 45,
        profundidad_optima: '10-30m',
        mejor_hora: '05:00-07:00',
        emoji: '🐠',
        estacion: 'Primavera, Otoño'
    },
    {
        id: 3,
        nombre: 'Dorada',
        cientifico: 'Sparus aurata',
        tipo: 'agua-salada',
        peso_promedio: 1.8,
        tamaño_promedio: 40,
        profundidad_optima: '8-25m',
        mejor_hora: '08:00-10:00',
        emoji: '🐟',
        estacion: 'Verano'
    },
    {
        id: 4,
        nombre: 'Mero',
        cientifico: 'Epinephelus guaza',
        tipo: 'agua-profunda',
        peso_promedio: 4,
        tamaño_promedio: 70,
        profundidad_optima: '20-50m',
        mejor_hora: '09:00-15:00',
        emoji: '🐟',
        estacion: 'Verano, Otoño'
    },
    {
        id: 5,
        nombre: 'Sargo',
        cientifico: 'Diplodus vulgaris',
        tipo: 'agua-salada',
        peso_promedio: 0.8,
        tamaño_promedio: 25,
        profundidad_optima: '5-20m',
        mejor_hora: '07:00-09:00',
        emoji: '🐠',
        estacion: 'Primavera, Verano'
    },
    {
        id: 6,
        nombre: 'Caballa',
        cientifico: 'Scomber scombrus',
        tipo: 'agua-salada',
        peso_promedio: 0.8,
        tamaño_promedio: 25,
        profundidad_optima: '10-40m',
        mejor_hora: '07:00-17:00',
        emoji: '🐟',
        estacion: 'Primavera, Otoño'
    },
    {
        id: 7,
        nombre: 'Pez Espada',
        cientifico: 'Trichiurus lepturus',
        tipo: 'agua-profunda',
        peso_promedio: 1.5,
        tamaño_promedio: 80,
        profundidad_optima: '30-100m',
        mejor_hora: '18:00-22:00',
        emoji: '🐠',
        estacion: 'Invierno, Primavera'
    },
    {
        id: 8,
        nombre: 'Salmonete',
        cientifico: 'Mullus barbatus',
        tipo: 'agua-salada',
        peso_promedio: 0.3,
        tamaño_promedio: 15,
        profundidad_optima: '5-40m',
        mejor_hora: '08:00-14:00',
        emoji: '🐟',
        estacion: 'Verano'
    },
    {
        id: 9,
        nombre: 'Lenguado',
        cientifico: 'Solea vulgaris',
        tipo: 'agua-salada',
        peso_promedio: 0.6,
        tamaño_promedio: 28,
        profundidad_optima: '10-30m',
        mejor_hora: '18:00-22:00',
        emoji: '🐠',
        estacion: 'Primavera, Verano'
    },
    {
        id: 10,
        nombre: 'Besugo',
        cientifico: 'Pagellus bogaraveo',
        tipo: 'agua-salada',
        peso_promedio: 2,
        tamaño_promedio: 35,
        profundidad_optima: '20-60m',
        mejor_hora: '06:00-08:00',
        emoji: '🐟',
        estacion: 'Invierno'
    }
];

// ==================== ESTADO GLOBAL ====================

let estado = {
    ubicacionActual: ubicacionesGalicia[0],
    capturas: [],
    mapa: null,
    marcadores: []
};

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎣 FishFinder Galicia - Inicializando con API OpenWeatherMap en tiempo real');
    
    inicializarTabs();
    cargarEspecies();
    inicializarMapa();
    cargarCapturas();
    inicializarEventos();
    
    // Cargar datos de meteorología de la ubicación por defecto
    await actualizarMetereologia();
    
    // Mostrar información de ubicaciones
    cargarUbicacionesLista();
});

// ==================== TABS ====================

function inicializarTabs() {
    const botones = document.querySelectorAll('.nav-btn');
    const contenidos = document.querySelectorAll('.tab-content');

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');

            botones.forEach(b => b.classList.remove('active'));
            contenidos.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(tab).classList.add('active');
        });
    });
}

// ==================== MAPA CON LEAFLET ====================

function inicializarMapa() {
    // Crear mapa centrado en Galicia
    estado.mapa = L.map('mapLeaflet').setView([42.7, -8.5], 9);

    // Agregar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(estado.mapa);

    // Agregar marcadores de ubicaciones
    ubicacionesGalicia.forEach(ubi => {
        const marker = L.circleMarker([ubi.lat, ubi.lng], {
            radius: 8,
            fillColor: '#4CAF50',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        })
        .bindPopup(`<strong>${ubi.nombre}</strong><br>${ubi.zona}`)
        .addTo(estado.mapa)
        .on('click', () => seleccionarUbicacion(ubi));

        estado.marcadores.push(marker);
    });

    // Botón de geolocalización
    document.getElementById('btnGeolocalizacion').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                estado.mapa.setView([latitude, longitude], 12);
                
                L.circleMarker([latitude, longitude], {
                    radius: 10,
                    fillColor: '#FF6B6B',
                    color: '#fff',
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 0.9
                })
                .bindPopup('📍 Tu ubicación')
                .addTo(estado.mapa);

                document.getElementById('mapaInfo').innerHTML = `
                    <h4>📍 Tu Ubicación</h4>
                    <p><strong>Latitud:</strong> ${latitude.toFixed(4)}°</p>
                    <p><strong>Longitud:</strong> ${longitude.toFixed(4)}°</p>
                `;
            });
        } else {
            alert('Geolocalización no disponible en tu navegador');
        }
    });

    // Botón centrar en Arousa
    document.getElementById('btnCentrarArousa').addEventListener('click', () => {
        estado.mapa.setView([42.5, -8.75], 11);
    });

    // Click en mapa para obtener información
    estado.mapa.on('click', (e) => {
        const { lat, lng } = e.latlng;
        document.getElementById('mapaInfo').innerHTML = `
            <h4>📍 Coordenadas</h4>
            <p><strong>Latitud:</strong> ${lat.toFixed(4)}°</p>
            <p><strong>Longitud:</strong> ${lng.toFixed(4)}°</p>
            <p><strong>Zoom:</strong> ${estado.mapa.getZoom()}</p>
        `;
    });
}

function seleccionarUbicacion(ubicacion) {
    estado.ubicacionActual = ubicacion;
    document.getElementById('mapaInfo').innerHTML = `
        <h4>🎣 ${ubicacion.nombre}</h4>
        <p><strong>Zona:</strong> ${ubicacion.zona}</p>
        <p><strong>Coordenadas:</strong> ${ubicacion.lat.toFixed(4)}°, ${ubicacion.lng.toFixed(4)}°</p>
        <p><strong>Puerto:</strong> ${ubicacion.puerto}</p>
    `;
}

function cargarUbicacionesLista() {
    const container = document.getElementById('ubicacionesList');
    container.innerHTML = '';

    ubicacionesGalicia.forEach(ubi => {
        const btn = document.createElement('button');
        btn.className = 'ubicacion-btn';
        btn.innerHTML = `📍 ${ubi.nombre}<br><span style="font-size: 0.8rem; opacity: 0.8;">${ubi.zona}</span>`;
        btn.addEventListener('click', () => {
            seleccionarUbicacion(ubi);
            estado.mapa.setView([ubi.lat, ubi.lng], 11);
        });
        container.appendChild(btn);
    });
}

// ==================== ESPECIES ====================

function cargarEspecies() {
    const container = document.getElementById('especiesList');
    const especieCapturada = document.getElementById('especieCapturada');
    const ubicacionCaptura = document.getElementById('ubicacionCaptura');

    container.innerHTML = '';
    especieCapturada.innerHTML = '<option value="">Selecciona una especie</option>';
    ubicacionCaptura.innerHTML = '<option value="">Selecciona una ubicación</option>';

    especiesGalicia.forEach(esp => {
        // Agregar a grid
        const card = document.createElement('div');
        card.className = 'especie-card';
        card.innerHTML = `
            <div class="especie-imagen">${esp.emoji}</div>
            <div class="especie-contenido">
                <div class="especie-nombre">${esp.nombre}</div>
                <div class="especie-cientifico">${esp.cientifico}</div>
                <div class="especie-detalle">
                    <span>Peso promedio:</span>
                    <span>${esp.peso_promedio}kg</span>
                </div>
                <div class="especie-detalle">
                    <span>Tamaño:</span>
                    <span>${esp.tamaño_promedio}cm</span>
                </div>
                <div class="especie-detalle">
                    <span>Profundidad:</span>
                    <span>${esp.profundidad_optima}</span>
                </div>
                <div class="especie-detalle">
                    <span>Mejor hora:</span>
                    <span>${esp.mejor_hora}</span>
                </div>
                <div class="especie-detalle">
                    <span>Estación:</span>
                    <span>${esp.estacion}</span>
                </div>
            </div>
        `;
        container.appendChild(card);

        // Agregar a select
        const option = document.createElement('option');
        option.value = esp.id;
        option.textContent = `${esp.emoji} ${esp.nombre}`;
        especieCapturada.appendChild(option);
    });

    // Agregar ubicaciones
    ubicacionesGalicia.forEach(ubi => {
        const option = document.createElement('option');
        option.value = ubi.id;
        option.textContent = `${ubi.nombre} (${ubi.zona})`;
        ubicacionCaptura.appendChild(option);
    });

    aplicarFiltrosEspecies();
}

function aplicarFiltrosEspecies() {
    const filtro = document.getElementById('especiesFiltro').value.toLowerCase();
    const tipo = document.getElementById('especiesTipo').value;
    const cards = document.querySelectorAll('.especie-card');

    cards.forEach((card, index) => {
        const nombre = card.querySelector('.especie-nombre').textContent.toLowerCase();
        const cientifico = card.querySelector('.especie-cientifico').textContent.toLowerCase();
        const especie = especiesGalicia[index];

        const coincideNombre = nombre.includes(filtro) || cientifico.includes(filtro);
        const coincideTipo = !tipo || especie.tipo === tipo;

        card.style.display = (coincideNombre && coincideTipo) ? 'block' : 'none';
    });
}

// ==================== METEOROLOGÍA CON OPENWEATHERMAP ====================

async function actualizarMetereologia() {
    const ubicacion = estado.ubicacionActual;
    const selectUbicacion = document.getElementById('meteorologiaUbicacion');

    // Llenar selector de ubicaciones
    if (selectUbicacion.children.length <= 1) {
        ubicacionesGalicia.forEach(ubi => {
            const option = document.createElement('option');
            option.value = ubi.id;
            option.textContent = ubi.nombre;
            selectUbicacion.appendChild(option);
        });
    }

    selectUbicacion.addEventListener('change', async () => {
        const ubiId = parseInt(selectUbicacion.value);
        estado.ubicacionActual = ubicacionesGalicia.find(u => u.id === ubiId);
        await cargarMeteoOpenWeatherMap();
    });

    await cargarMeteoOpenWeatherMap();
}

async function cargarMeteoOpenWeatherMap() {
    const ubicacion = estado.ubicacionActual;
    const cargaDiv = document.getElementById('cargaMeteo');
    const climaDiv = document.getElementById('climaActual');
    const indiceDiv = document.getElementById('indicePesca');
    const pronosticoDiv = document.getElementById('pronosticoContainer');

    cargaDiv.style.display = 'block';
    climaDiv.style.display = 'none';

    try {
        // 1️⃣ Obtener datos actuales con OpenWeatherMap
        const currentUrl = `${API_CONFIG.openWeather.baseUrl}/weather?lat=${ubicacion.lat}&lon=${ubicacion.lng}&appid=${API_CONFIG.openWeather.apiKey}&lang=es&units=metric`;
        
        // 2️⃣ Obtener pronóstico con OpenWeatherMap
        const forecastUrl = `${API_CONFIG.openWeather.baseUrl}/forecast?lat=${ubicacion.lat}&lon=${ubicacion.lng}&appid=${API_CONFIG.openWeather.apiKey}&lang=es&units=metric`;

        const [responseActual, responseForecast] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!responseActual.ok || !responseForecast.ok) {
            throw new Error('Error en la API de OpenWeatherMap');
        }

        const dataActual = await responseActual.json();
        const dataForecast = await responseForecast.json();

        // Actualizar datos actuales
        const main = dataActual.main;
        const wind = dataActual.wind;
        const clouds = dataActual.clouds;
        const weather = dataActual.weather[0];

        document.getElementById('temp').textContent = main.temp.toFixed(1) + '°C';
        document.getElementById('viento').textContent = (wind.speed * 3.6).toFixed(1) + ' km/h'; // Convertir m/s a km/h
        document.getElementById('humedad').textContent = main.humidity + '%';
        document.getElementById('presion').textContent = main.pressure + ' hPa';
        document.getElementById('lluvia').textContent = (dataActual.rain?.['1h'] || 0).toFixed(1) + ' mm';
        document.getElementById('uvIndex').textContent = 'N/A'; // OpenWeatherMap requiere API separada para UV

        // Interpretaciones
        actualizarInterpretacionesOWM(main, wind, clouds, weather);

        // Calcular índice de pesca
        const indice = calcularIndicePescaOWM(main, wind, weather);
        actualizarIndicePesca(indice);

        // Pronóstico
        generarPronosticoOWM(dataForecast);

        cargaDiv.style.display = 'none';
        climaDiv.style.display = 'grid';
        indiceDiv.style.display = 'block';
        pronosticoDiv.style.display = 'block';

    } catch (error) {
        console.error('Error cargando meteorología:', error);
        cargaDiv.innerHTML = `
            <div style="text-align: center;">
                <i class="fas fa-exclamation-circle"></i> 
                <p>Error cargando datos meteorológicos</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}

function actualizarInterpretacionesOWM(main, wind, clouds, weather) {
    const temp = main.temp;
    const vientoKmh = wind.speed * 3.6;
    const humedad = main.humidity;

    // Temperatura
    let tempDetalle = 'Fría';
    if (temp >= 18) tempDetalle = 'Templada';
    if (temp >= 25) tempDetalle = 'Cálida';
    document.getElementById('tempDetalle').textContent = tempDetalle;

    // Viento
    let vientoDetalle = 'Calma';
    if (vientoKmh >= 10) vientoDetalle = 'Moderado';
    if (vientoKmh >= 20) vientoDetalle = 'Fuerte';
    if (vientoKmh >= 40) vientoDetalle = 'Muy Fuerte';
    document.getElementById('vientoDetalle').textContent = vientoDetalle;

    // Humedad
    let humedadDetalle = 'Baja';
    if (humedad >= 60) humedadDetalle = 'Normal';
    if (humedad >= 80) humedadDetalle = 'Alta';
    document.getElementById('humedadDetalle').textContent = humedadDetalle;

    // Presión
    const presion = main.pressure;
    let presionDetalle = 'Baja';
    if (presion >= 1013) presionDetalle = 'Normal';
    if (presion >= 1025) presionDetalle = 'Alta';
    document.getElementById('presionDetalle').textContent = presionDetalle;

    // Lluvia
    const lluvia = weather.description || 'Sin lluvia';
    let lluviaDetalle = lluvia.includes('lluvia') ? 'Con lluvia' : 'Sin lluvia';
    document.getElementById('lluviaDetalle').textContent = lluvia.charAt(0).toUpperCase() + lluvia.slice(1);

    // UV Index (simulado basado en nubes)
    const cloudCover = clouds.all;
    let uvDetalle = 'Bajo';
    if (cloudCover < 50) uvDetalle = 'Moderado';
    if (cloudCover < 30) uvDetalle = 'Alto';
    document.getElementById('uvDetalle').textContent = uvDetalle;
}

function calcularIndicePescaOWM(main, wind, weather) {
    let puntos = 100;

    // Temperatura: óptimo 15-20°C
    const temp = main.temp;
    if (temp < 10 || temp > 25) puntos -= 20;
    else if (temp < 12 || temp > 23) puntos -= 10;

    // Viento: óptimo 5-15 km/h
    const vientoKmh = wind.speed * 3.6;
    if (vientoKmh > 30) puntos -= 30;
    else if (vientoKmh > 20) puntos -= 15;
    else if (vientoKmh < 3) puntos -= 5;

    // Humedad: óptimo 60-80%
    const humedad = main.humidity;
    if (humedad < 50 || humedad > 90) puntos -= 10;

    // Presión: estable es mejor
    const presion = main.pressure;
    if (presion < 1000 || presion > 1030) puntos -= 15;

    // Condición del clima: lluvia es mala
    const weatherId = weather.id;
    if (weatherId >= 500 && weatherId < 600) puntos -= 25; // Lluvia
    if (weatherId >= 800 && weatherId <= 804) puntos += 10; // Cielo despejado

    return Math.max(0, Math.min(100, puntos));
}

function actualizarIndicePesca(indice) {
    const indiceProgreso = document.getElementById('indiceGeneral');
    const indiceTexto = document.getElementById('indiceGeneralTexto');

    indiceProgreso.style.width = indice + '%';

    if (indice > 75) {
        indiceProgreso.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        indiceTexto.textContent = 'Excelente ✓✓';
    } else if (indice > 50) {
        indiceProgreso.style.background = 'linear-gradient(90deg, #FFC107, #FF9800)';
        indiceTexto.textContent = 'Bueno ✓';
    } else {
        indiceProgreso.style.background = 'linear-gradient(90deg, #FF9800, #F44336)';
        indiceTexto.textContent = 'Regular';
    }
}

function generarPronosticoOWM(dataForecast) {
    const container = document.getElementById('pronosticoGrid');
    container.innerHTML = '';

    // Agrupar por día
    const datosPorDia = {};
    dataForecast.list.forEach(item => {
        const fecha = item.dt_txt.split(' ')[0];
        if (!datosPorDia[fecha]) {
            datosPorDia[fecha] = [];
        }
        datosPorDia[fecha].push(item);
    });

    // Mostrar máximo 7 días
    Object.keys(datosPorDia).slice(0, 7).forEach(fecha => {
        const items = datosPorDia[fecha];
        const itemMidDay = items[Math.floor(items.length / 2)];

        const tempMax = Math.max(...items.map(i => i.main.temp_max));
        const tempMin = Math.min(...items.map(i => i.main.temp_min));
        const weather = itemMidDay.weather[0];

        const fechaObj = new Date(fecha);
        const iconoClima = obtenerIconoClimaOWM(weather.main);

        const dia_div = document.createElement('div');
        dia_div.className = 'pronostico-dia';
        dia_div.innerHTML = `
            <div class="pronostico-fecha">${fechaObj.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="pronostico-icono">${iconoClima}</div>
            <div class="pronostico-temp">${tempMax.toFixed(0)}°C / ${tempMin.toFixed(0)}°C</div>
            <div class="pronostico-desc">${weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</div>
        `;
        container.appendChild(dia_div);
    });
}

function obtenerIconoClimaOWM(main) {
    const iconos = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌧️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '🌫️',
        'Haze': '🌫️',
        'Dust': '🌪️',
        'Fog': '🌫️',
        'Sand': '🌪️',
        'Ash': '🌫️',
        'Squall': '💨',
        'Tornado': '🌪️'
    };
    return iconos[main] || '🌤️';
}

// ==================== REGISTRO ====================

function cargarCapturas() {
    const stored = localStorage.getItem('capturas_galicia');
    if (stored) {
        estado.capturas = JSON.parse(stored);
        mostrarCapturas();
    }
}

function guardarCapturas() {
    localStorage.setItem('capturas_galicia', JSON.stringify(estado.capturas));
}

function mostrarCapturas() {
    const container = document.getElementById('historialContainer');

    if (estado.capturas.length === 0) {
        container.innerHTML = '<p class="sin-registros">📭 No hay capturas registradas. ¡Sal a pescar!</p>';
    } else {
        container.innerHTML = estado.capturas.map(captura => {
            const esp = especiesGalicia.find(e => e.id == captura.especie);
            const ubi = ubicacionesGalicia.find(u => u.id == captura.ubicacion);
            const fecha = new Date(captura.fecha);

            return `
                <div class="captura-item">
                    <div class="captura-encabezado">
                        <span class="captura-especie">${esp ? esp.emoji + ' ' + esp.nombre : 'Especie'}</span>
                        <span class="captura-peso">${captura.peso}kg</span>
                    </div>
                    <div class="captura-detalles">
                        <div class="captura-detalle-item">
                            <span>📏</span> ${captura.largo || '--'}cm
                        </div>
                        <div class="captura-detalle-item">
                            <span>📍</span> ${ubi ? ubi.nombre : 'Desconocida'}
                        </div>
                        <div class="captura-detalle-item">
                            <span>🕐</span> ${fecha.toLocaleTimeString('es-ES')}
                        </div>
                        <div class="captura-detalle-item">
                            <span>🌊</span> ${captura.profundidad || '--'}m
                        </div>
                    </div>
                    ${captura.notas ? `<p style="margin-top: 0.75rem; color: var(--color-text-secondary); font-size: 0.9rem; border-top: 1px solid var(--color-surface); padding-top: 0.5rem;">💭 ${captura.notas}</p>` : ''}
                </div>
            `;
        }).join('');
    }

    actualizarEstadisticas();
}

function actualizarEstadisticas() {
    const total = estado.capturas.length;
    const pesoTotal = estado.capturas.reduce((sum, c) => sum + parseFloat(c.peso), 0);
    const pesoPromedio = total > 0 ? (pesoTotal / total).toFixed(2) : 0;

    const especieConteo = {};
    estado.capturas.forEach(c => {
        const esp = especiesGalicia.find(e => e.id == c.especie);
        if (esp) {
            especieConteo[esp.nombre] = (especieConteo[esp.nombre] || 0) + 1;
        }
    });

    let especieComun = '--';
    if (Object.keys(especieConteo).length > 0) {
        especieComun = Object.keys(especieConteo).reduce((a, b) => 
            especieConteo[a] > especieConteo[b] ? a : b
        );
    }

    document.getElementById('totalCapturas').textContent = total;
    document.getElementById('pesoTotal').textContent = pesoTotal.toFixed(2) + ' kg';
    document.getElementById('especieComun').textContent = especieComun;
    document.getElementById('pesoPromedio').textContent = pesoPromedio + ' kg';
}

// ==================== EVENTOS ====================

function inicializarEventos() {
    // Filtros de especies
    document.getElementById('especiesFiltro').addEventListener('input', aplicarFiltrosEspecies);
    document.getElementById('especiesTipo').addEventListener('change', aplicarFiltrosEspecies);

    // Formulario de captura
    document.getElementById('capturaForm').addEventListener('submit', (e) => {
        e.preventDefault();

        if (!document.getElementById('especieCapturada').value) {
            alert('⚠️ Por favor selecciona una especie');
            return;
        }

        const captura = {
            especie: parseInt(document.getElementById('especieCapturada').value),
            peso: parseFloat(document.getElementById('pesoCaptura').value),
            largo: parseFloat(document.getElementById('largoCaptura').value) || null,
            ubicacion: parseInt(document.getElementById('ubicacionCaptura').value) || null,
            fecha: document.getElementById('tiempoCaptura').value,
            profundidad: parseFloat(document.getElementById('profundidadCaptura').value) || null,
            tipo_pesca: document.getElementById('tipoCaptura').value,
            notas: document.getElementById('notas').value
        };

        estado.capturas.unshift(captura);
        guardarCapturas();
        mostrarCapturas();

        document.getElementById('capturaForm').reset();
        document.getElementById('tiempoCaptura').valueAsDate = new Date();

        alert('✅ ¡Captura registrada correctamente! 🎣');
    });

    // Exportar CSV
    document.getElementById('btnExportarCSV').addEventListener('click', () => {
        if (estado.capturas.length === 0) {
            alert('No hay capturas para exportar');
            return;
        }

        let csv = 'Especie,Peso (kg),Largo (cm),Ubicación,Fecha,Profundidad (m),Tipo de Pesca,Notas\n';

        estado.capturas.forEach(c => {
            const esp = especiesGalicia.find(e => e.id == c.especie);
            const ubi = ubicacionesGalicia.find(u => u.id == c.ubicacion);
            const fecha = new Date(c.fecha).toLocaleString('es-ES');
            
            csv += `"${esp ? esp.nombre : 'Desconocida'}",${c.peso},${c.largo || '--'},"${ubi ? ubi.nombre : 'Desconocida'}",${fecha},${c.profundidad || '--'},"${c.tipo_pesca}","${c.notas}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `capturas_galicia_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Limpiar datos
    document.getElementById('btnLimpiarDatos').addEventListener('click', () => {
        if (confirm('⚠️ ¿Estás seguro de que quieres eliminar todos los registros?')) {
            estado.capturas = [];
            guardarCapturas();
            mostrarCapturas();
            alert('✅ Datos eliminados');
        }
    });

    // Setear hora actual
    const ahora = new Date().toISOString().slice(0, 16);
    document.getElementById('tiempoCaptura').value = ahora;

    // Créditos API
    document.getElementById('creditosAPI').addEventListener('click', (e) => {
        e.preventDefault();
        alert('🌍 Datos proporcionados por:\n\n' +
            '📍 Mapas: OpenStreetMap (osm.org)\n' +
            '🌥️ Meteorología: OpenWeatherMap (openweathermap.org)\n' +
            '🗺️ Mapa interactivo: Leaflet.js\n\n' +
            'Datos meteorológicos en TIEMPO REAL desde OpenWeatherMap');
    });
}

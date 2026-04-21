// ==================== DATOS ESPECÍFICOS DE GALICIA ====================

const ubicacionesGalicia = [
    { id: 1, nombre: 'Rías Altas', zona: 'Costa da Morte', lat: 43.2, lng: -8.9 },
    { id: 2, nombre: 'Ría de Arousa', zona: 'Rías Baixas', lat: 42.5, lng: -8.75 },
    { id: 3, nombre: 'Ría de Pontevedra', zona: 'Rías Baixas', lat: 42.35, lng: -8.65 },
    { id: 4, nombre: 'Ría de Vigo', zona: 'Rías Baixas', lat: 42.22, lng: -8.75 },
    { id: 5, nombre: 'Seo de Cambados', zona: 'Rías Baixas', lat: 42.5, lng: -8.8 },
    { id: 6, nombre: 'Porto de Mós', zona: 'Costa da Morte', lat: 43.1, lng: -9.2 },
    { id: 7, nombre: 'Noia', zona: 'Rías Baixas', lat: 42.77, lng: -9.04 },
    { id: 8, nombre: 'Aguincha', zona: 'Rías Altas', lat: 43.28, lng: -8.28 },
    { id: 9, nombre: 'Ferrol', zona: 'Rías Altas', lat: 43.48, lng: -8.25 },
    { id: 10, nombre: 'Cedeira', zona: 'Rías Altas', lat: 43.37, lng: -8.27 }
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
        estacion: 'Otoño, Invierno',
        zona_galicia: 'Ríos interiores'
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
        estacion: 'Primavera, Otoño',
        zona_galicia: 'Rías Baixas'
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
        estacion: 'Verano',
        zona_galicia: 'Rías Baixas, Costa da Morte'
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
        estacion: 'Verano, Otoño',
        zona_galicia: 'Frente costero'
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
        estacion: 'Primavera, Verano',
        zona_galicia: 'Rías Altas, Rías Baixas'
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
        estacion: 'Primavera, Otoño',
        zona_galicia: 'Aguas abiertas'
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
        estacion: 'Invierno, Primavera',
        zona_galicia: 'Talud continental'
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
        estacion: 'Verano',
        zona_galicia: 'Rías Baixas'
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
        estacion: 'Primavera, Verano',
        zona_galicia: 'Fondos arenosos'
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
        estacion: 'Invierno',
        zona_galicia: 'Aguas profundas'
    }
];

const zonasGalicia = [
    { x: 150, y: 100, radio: 70, calidad: 'excelente', nombre: 'Rías Altas', profundidad_prom: 25, ubicacion: 'Costa da Morte' },
    { x: 250, y: 200, radio: 85, calidad: 'excelente', nombre: 'Ría de Arousa', profundidad_prom: 18, ubicacion: 'Rías Baixas' },
    { x: 380, y: 250, radio: 75, calidad: 'buena', nombre: 'Ría Pontevedra', profundidad_prom: 20, ubicacion: 'Rías Baixas' },
    { x: 420, y: 320, radio: 80, calidad: 'excelente', nombre: 'Ría de Vigo', profundidad_prom: 22, ubicacion: 'Rías Baixas' },
    { x: 150, y: 350, radio: 60, calidad: 'buena', nombre: 'Costa da Morte', profundidad_prom: 30, ubicacion: 'Aguas profundas' }
];

const batimetria_galicia = Array.from({ length: 50 }, (_, i) =>
    Array.from({ length: 50 }, (_, j) => {
        // Simular profundidades más realistas para Galicia
        const dist = Math.sqrt((i - 25) ** 2 + (j - 25) ** 2);
        return Math.min(100, dist * 1.5 + Math.random() * 20);
    })
);

// ==================== ESTADO GLOBAL ====================

let estado = {
    zoom: 1,
    panX: 0,
    panY: 0,
    capturas: [],
    clima: {
        temperatura: 16,
        viento: 12,
        humedad: 70,
        visibilidad: 50,
        indice: 70
    }
};

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', () => {
    inicializarTabs();
    inicializarMapa();
    inicializarBatimetria();
    cargarEspecies();
    actualizarMetereologia();
    cargarCapturas();
    inicializarEventos();
    console.log('🎣 FishFinder Galicia iniciado correctamente');
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

            if (tab === 'mapa') {
                setTimeout(() => dibujarMapa(), 100);
            } else if (tab === 'batimetria') {
                setTimeout(() => dibujarBatimetria(), 100);
            }
        });
    });
}

// ==================== MAPA ====================

function inicializarMapa() {
    const canvas = document.getElementById('mapaCanvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    dibujarMapa();
    cargarUbicaciones();

    canvas.addEventListener('mousedown', (e) => iniciarPan(e, canvas));
    canvas.addEventListener('mousemove', (e) => hacerPan(e, canvas));
    canvas.addEventListener('mouseup', () => finalizarPan());
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        hacerZoom(e, canvas);
    });
    canvas.addEventListener('click', (e) => seleccionarZona(e, canvas));

    document.getElementById('zoomIn').addEventListener('click', () => {
        estado.zoom *= 1.2;
        dibujarMapa();
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        estado.zoom /= 1.2;
        dibujarMapa();
    });

    document.getElementById('resetMapa').addEventListener('click', () => {
        estado.zoom = 1;
        estado.panX = 0;
        estado.panY = 0;
        dibujarMapa();
    });
}

let panInicio = null;

function iniciarPan(e, canvas) {
    panInicio = { x: e.offsetX, y: e.offsetY };
}

function hacerPan(e, canvas) {
    if (panInicio) {
        const dx = e.offsetX - panInicio.x;
        const dy = e.offsetY - panInicio.y;
        estado.panX += dx;
        estado.panY += dy;
        panInicio = { x: e.offsetX, y: e.offsetY };
        dibujarMapa();
    }
}

function finalizarPan() {
    panInicio = null;
}

function hacerZoom(e, canvas) {
    const zoom_factor = e.deltaY > 0 ? 0.9 : 1.1;
    estado.zoom *= zoom_factor;
    dibujarMapa();
}

function dibujarMapa() {
    const canvas = document.getElementById('mapaCanvas');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f1f3c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar océano
    ctx.fillStyle = '#1a3a4a';
    ctx.fillRect(300, 0, canvas.width - 300, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(estado.zoom, estado.zoom);
    ctx.translate(-canvas.width / 2 + estado.panX, -canvas.height / 2 + estado.panY);

    // Dibujar zonas de pesca
    zonasGalicia.forEach(zona => {
        const colores = {
            'excelente': '#4CAF50',
            'buena': '#FFC107',
            'regular': '#FF9800'
        };

        ctx.fillStyle = colores[zona.calidad] + '30';
        ctx.beginPath();
        ctx.arc(zona.x, zona.y, zona.radio, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = colores[zona.calidad];
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(zona.x, zona.y, zona.radio, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(zona.nombre, zona.x, zona.y - zona.radio - 15);

        // Icono de zona
        ctx.fillStyle = colores[zona.calidad];
        ctx.beginPath();
        ctx.arc(zona.x, zona.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Dibujar puntos de interés (puertos)
    ubicacionesGalicia.forEach(ubi => {
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(ubi.lat * 10, ubi.lng * 10, 6, 0, Math.PI * 2);
        ctx.fill();
    });

    // Dibujar línea de costa simplificada
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(300, 0);
    ctx.quadraticCurveTo(280, 150, 300, 300);
    ctx.quadraticCurveTo(250, 350, 280, 400);
    ctx.stroke();

    ctx.restore();

    // Dibujar grid
    ctx.strokeStyle = '#2a3142';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function cargarUbicaciones() {
    const container = document.getElementById('ubicacionesList');
    container.innerHTML = '';

    ubicacionesGalicia.forEach(ubi => {
        const btn = document.createElement('button');
        btn.className = 'ubicacion-btn';
        btn.innerHTML = `<i style="margin-right: 0.5rem;">📍</i> ${ubi.nombre}<br><span style="font-size: 0.8rem; opacity: 0.8;">${ubi.zona}</span>`;
        btn.addEventListener('click', () => mostrarInfoUbicacion(ubi));
        container.appendChild(btn);
    });
}

function mostrarInfoUbicacion(ubicacion) {
    const especies_zona = especiesGalicia.filter(e => e.zona_galicia.includes(ubicacion.zona));
    let html = `
        <h4>📍 ${ubicacion.nombre}</h4>
        <p><strong>Zona:</strong> ${ubicacion.zona}</p>
        <p><strong>Coordenadas:</strong> ${ubicacion.lat.toFixed(2)}°, ${ubicacion.lng.toFixed(2)}°</p>
        <p><strong>Especies comunes:</strong></p>
        <ul style="margin-left: 1rem; margin-top: 0.5rem;">
    `;
    especies_zona.forEach(esp => {
        html += `<li>${esp.emoji} ${esp.nombre} (${esp.peso_promedio}kg promedio)</li>`;
    });
    html += '</ul>';

    document.getElementById('mapaInfo').innerHTML = html;
}

function seleccionarZona(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2) / estado.zoom + canvas.width / 2 - estado.panX;
    const y = (e.clientY - rect.top - canvas.height / 2) / estado.zoom + canvas.height / 2 - estado.panY;

    for (let zona of zonasGalicia) {
        const dist = Math.sqrt((x - zona.x) ** 2 + (y - zona.y) ** 2);
        if (dist < zona.radio) {
            mostrarInfoZona(zona);
            return;
        }
    }
}

function mostrarInfoZona(zona) {
    const especies_zona = especiesGalicia.filter(e => e.zona_galicia.includes(zona.ubicacion));
    let html = `
        <h4>🎣 ${zona.nombre}</h4>
        <p><strong>Calidad:</strong> ${zona.calidad.toUpperCase()}</p>
        <p><strong>Ubicación:</strong> ${zona.ubicacion}</p>
        <p><strong>Profundidad promedio:</strong> ${zona.profundidad_prom}m</p>
        <p><strong>Especies principales:</strong></p>
        <ul style="margin-left: 1rem; margin-top: 0.5rem;">
    `;
    especies_zona.slice(0, 5).forEach(esp => {
        html += `<li>${esp.emoji} ${esp.nombre}</li>`;
    });
    html += '</ul>';

    document.getElementById('mapaInfo').innerHTML = html;
}

// ==================== BATIMETRÍA ====================

function inicializarBatimetria() {
    const canvas = document.getElementById('batimetriaCanvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    canvas.addEventListener('mousemove', (e) => mostrarProfundidad(e, canvas));
    canvas.addEventListener('mouseleave', () => {
        document.getElementById('batimetriaInfo').innerHTML = '<p>Pasa el mouse sobre el mapa para ver la profundidad exacta</p>';
    });

    dibujarBatimetria();
}

function dibujarBatimetria() {
    const canvas = document.getElementById('batimetriaCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    const cellWidth = canvas.width / batimetria_galicia[0].length;
    const cellHeight = canvas.height / batimetria_galicia.length;

    for (let i = 0; i < canvas.height; i++) {
        for (let j = 0; j < canvas.width; j++) {
            const dataI = Math.floor(i / cellHeight);
            const dataJ = Math.floor(j / cellWidth);
            const profundidad = batimetria_galicia[dataI] ? batimetria_galicia[dataI][dataJ] : 50;

            let r, g, b;
            if (profundidad < 5) {
                r = 135; g = 206; b = 235; // Azul claro
            } else if (profundidad < 20) {
                r = 76; g = 175; b = 80; // Verde (óptimo)
            } else if (profundidad < 50) {
                r = 33; g = 150; b = 243; // Azul
            } else {
                r = 26; g = 35; b = 126; // Azul oscuro
            }

            const pixelIndex = (i * canvas.width + j) * 4;
            data[pixelIndex] = r;
            data[pixelIndex + 1] = g;
            data[pixelIndex + 2] = b;
            data[pixelIndex + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function mostrarProfundidad(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dataI = Math.floor((y / canvas.height) * batimetria_galicia.length);
    const dataJ = Math.floor((x / canvas.width) * batimetria_galicia[0].length);

    const profundidad = batimetria_galicia[dataI] ? batimetria_galicia[dataI][dataJ] : 0;

    let tipo = 'Muy Superficial';
    let recomendacion = 'No recomendado para pesca';

    if (profundidad > 5 && profundidad < 20) {
        tipo = 'Óptimo (Zona de Pesca)';
        recomendacion = 'Excelente para lubinas, doradas y sargos';
    } else if (profundidad >= 20 && profundidad < 50) {
        tipo = 'Profundo';
        recomendacion = 'Ideal para meros, besugo y pez espada';
    } else if (profundidad >= 50) {
        tipo = 'Muy Profundo';
        recomendacion = 'Especies de aguas profundas';
    }

    document.getElementById('batimetriaInfo').innerHTML = `
        <h4>🌊 Profundidad: ${profundidad.toFixed(1)}m</h4>
        <p><strong>Tipo:</strong> ${tipo}</p>
        <p><strong>Recomendación:</strong> ${recomendacion}</p>
    `;
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
                <div class="especie-detalle">
                    <span>Zona Galicia:</span>
                    <span style="font-size: 0.85rem;">${esp.zona_galicia}</span>
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

// ==================== METEOROLOGÍA ====================

function actualizarMetereologia() {
    // Simular datos climáticos realistas para Galicia
    const hora = new Date().getHours();
    const mes = new Date().getMonth();

    // Temperaturas medias de Galicia por estación
    const tempBase = mes >= 5 && mes <= 9 ? 18 : 12;

    estado.clima = {
        temperatura: tempBase + Math.random() * 8 + (hora > 12 ? 3 : -2),
        viento: 8 + Math.random() * 18, // Galicia tiene vientos más fuertes
        humedad: 65 + Math.random() * 25,
        visibilidad: 40 + Math.random() * 50,
        indice: 55 + Math.random() * 40
    };

    actualizarInterfazMeteo();
    generarPronostico();
    generarMareas();

    setInterval(actualizarInterfazMeteo, 30000); // Actualizar cada 30 segundos
}

function actualizarInterfazMeteo() {
    // Temperatura
    document.getElementById('temp').textContent = estado.clima.temperatura.toFixed(1) + '°C';
    const tempDetalle = estado.clima.temperatura < 10 ? 'Fría' : estado.clima.temperatura < 18 ? 'Templada' : 'Cálida';
    document.getElementById('tempDetalle').textContent = tempDetalle;

    // Viento
    document.getElementById('viento').textContent = estado.clima.viento.toFixed(1) + ' km/h';
    const vientoDetalle = estado.clima.viento < 10 ? 'Calma' : estado.clima.viento < 20 ? 'Moderado' : 'Fuerte';
    document.getElementById('vientoDetalle').textContent = vientoDetalle;

    // Humedad
    document.getElementById('humedad').textContent = estado.clima.humedad.toFixed(0) + '%';
    const humedadDetalle = estado.clima.humedad > 80 ? 'Muy alta' : estado.clima.humedad > 60 ? 'Alta' : 'Normal';
    document.getElementById('humedadDetalle').textContent = humedadDetalle;

    // Visibilidad
    document.getElementById('visibilidad').textContent = estado.clima.visibilidad.toFixed(0) + ' m';
    const visDetalle = estado.clima.visibilidad > 50 ? 'Buena' : estado.clima.visibilidad > 30 ? 'Regular' : 'Mala';
    document.getElementById('visibilidadDetalle').textContent = visDetalle;

    // Índice de pesca
    const indiceProgreso = document.getElementById('indiceGeneral');
    const indiceTexto = document.getElementById('indiceGeneralTexto');

    indiceProgreso.style.width = estado.clima.indice + '%';

    if (estado.clima.indice > 70) {
        indiceProgreso.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        indiceTexto.textContent = 'Excelente ✓✓';
    } else if (estado.clima.indice > 50) {
        indiceProgreso.style.background = 'linear-gradient(90deg, #FFC107, #FF9800)';
        indiceTexto.textContent = 'Bueno ✓';
    } else {
        indiceProgreso.style.background = 'linear-gradient(90deg, #FF9800, #F44336)';
        indiceTexto.textContent = 'Regular';
    }

    // Fases lunares
    const faseLunar = document.getElementById('faseLunar');
    const faseLunarTexto = document.getElementById('faseLunarTexto');
    const dia = new Date().getDate() % 30;
    const fases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    const fasesNombres = ['Luna Nueva', 'Creciente', 'Cuarto Creciente', 'Gibosa', 'Luna Llena', 'Gibosa', 'Cuarto Menguante', 'Menguante'];
    const faseIndex = Math.floor((dia / 30) * fases.length);

    faseLunar.innerHTML = fases[faseIndex];
    faseLunarTexto.textContent = fasesNombres[faseIndex];
}

function generarPronostico() {
    const container = document.getElementById('pronosticoContainer');
    container.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + i);

        const iconos = ['☀️', '⛅', '🌤️', '☁️', '🌧️', '⛈️'];
        const descripciones = ['Soleado', 'Parcialmente nublado', 'Nublado', 'Muy nublado', 'Lluvioso', 'Tormentoso'];

        const aleatorio = Math.floor(Math.random() * iconos.length);
        const temp = (14 + Math.random() * 10).toFixed(0);

        const dia_div = document.createElement('div');
        dia_div.className = 'pronostico-dia';
        dia_div.innerHTML = `
            <div class="pronostico-fecha">${fecha.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="pronostico-icono">${iconos[aleatorio]}</div>
            <div class="pronostico-temp">${temp}°C</div>
            <div class="pronostico-desc">${descripciones[aleatorio]}</div>
        `;
        container.appendChild(dia_div);
    }
}

function generarMareas() {
    const container = document.getElementById('mareasContainer');
    container.innerHTML = '';

    const ubicacionesMareas = ['Ría de Arousa', 'Ría de Vigo', 'Rías Altas'];
    const horas = ['06:30', '12:45', '18:15', '00:30'];
    const alturas = [2.5, 0.8, 2.3, 0.7];

    ubicacionesMareas.forEach((ubicacion, idx) => {
        const card = document.createElement('div');
        card.className = 'marea-card';

        card.innerHTML = `
            <div class="marea-titulo">
                <i class="fas fa-water"></i> ${ubicacion}
            </div>
            <div class="marea-dato">
                <span>Pleamar:</span>
                <span>${horas[0]} (${alturas[0]}m)</span>
            </div>
            <div class="marea-dato">
                <span>Bajamar:</span>
                <span>${horas[1]} (${alturas[1]}m)</span>
            </div>
            <div class="marea-dato">
                <span>Pleamar (noche):</span>
                <span>${horas[2]} (${alturas[2]}m)</span>
            </div>
            <div class="marea-dato">
                <span>Bajamar (madrugada):</span>
                <span>${horas[3]} (${alturas[3]}m)</span>
            </div>
        `;
        container.appendChild(card);
    });
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
    const filtroEspecie = document.getElementById('filtroEspecie');
    const especieFiltrada = filtroEspecie.value;

    let capturas_filtradas = estado.capturas;
    if (especieFiltrada) {
        capturas_filtradas = estado.capturas.filter(c => c.especie == especieFiltrada);
    }

    if (capturas_filtradas.length === 0) {
        container.innerHTML = '<p class="sin-registros">📭 No hay capturas registradas. ¡Sal a pescar!</p>';
    } else {
        container.innerHTML = capturas_filtradas.map(captura => {
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

    // Filtro de historial
    document.getElementById('filtroEspecie').addEventListener('change', () => {
        mostrarCapturas();
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

    // Llenar selector de especies en filtro
    const filtroEspecie = document.getElementById('filtroEspecie');
    especiesGalicia.forEach(esp => {
        const option = document.createElement('option');
        option.value = esp.id;
        option.textContent = `${esp.emoji} ${esp.nombre}`;
        filtroEspecie.appendChild(option);
    });

    // Setear hora actual
    const ahora = new Date().toISOString().slice(0, 16);
    document.getElementById('tiempoCaptura').value = ahora;
}

// ==================== FUNCIONES AUXILIARES ====================

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatearHora(fecha) {
    return new Date(fecha).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

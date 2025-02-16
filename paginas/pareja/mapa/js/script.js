// Crear el mapa y establecer las coordenadas iniciales
const map = L.map('map').setView([42.5, -8.0], 7); // Coordenadas aproximadas del centro de Galicia y un nivel de zoom adecuado

// Añadir la capa de mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Definir los sitios con etiquetas
const sitios = [
    {
        nombre: 'Mirador del Pituco',
        coords: [42.3942396, -8.675326],
        descripcion: 'Un hermoso mirador con vistas panorámicas al mar. Hay fuente y contenedor de basura.'
    },
    {
        nombre: 'Una parada de autobus',
        coords: [42.398511, -8.663005],
        descripcion: 'En frente d ela parada colocas el coche y listo. A veces da la vuelta el autobus.'
    },
    {
        nombre: 'Mirados del Lago de Castiñeiras',
        coords: [42.353401, -8.675539],
        descripcion: 'Por la noche no hay gente pero hay que tener cuidado por el camino.'
    },
    {
        nombre: 'Mirador del monte de Mogor',
        coords: [42.386325, -8.716204],
        descripcion: 'Es una mierda pero por la noche hay buenas vistas.'
    },
    {
        nombre: 'Playa de la Ribeiriña',
        coords: [42.350787, -8.749897],
        descripcion: 'Perfecta si te gusta hacerlo al aire libre. Esta llena de rocas. Ademas se pueden cojer neciras y centollas pero cuidado con la policia.'
    },
    {
        nombre: 'Mirador de Domaio',
        coords: [42.314835, -8.703913],
        descripcion: 'Tiene un acceso complicado pero una vistas muy buenas.'
    },
    {
        nombre: 'Mirador de del Pion',
        coords: [42.297250, -8.673512],
        descripcion: '...'
    },
    {
        nombre: 'Antena RNE',
        coords: [42.341038, -8.720862],
        descripcion: 'Para ver las perseidas con tu novia esta muy bien, se peta.'
    },
    {
        nombre: 'Mirador de Fontenla',
        coords: [42.294304, -8.667372],
        descripcion: 'Mi sitio favorito.'
    },
    {
        nombre: 'Deposito de agua',
        coords: [42.394136, -8.687742],
        descripcion: 'Se ve todo Marin. Cuidado con los vecinos.'
    },
    {
        nombre: 'Parque de suboficiales',
        coords: [42.387499, -8.701062],
        descripcion: 'Si no tienes 16 años no vayas.'
    },
    {
        nombre: 'Parque del hiperfroiz',
        coords: [42.432307, -8.641043],
        descripcion: 'Si no tienes 16 años no vayas.'
    },
    {
        nombre: 'Laberinto de Pontevedra',
        coords: [42.438350, -8.634244],
        descripcion: 'Da mucho asco pero esta apartado.'
    },
    {
        nombre: 'Lavadero de suboficiales',
        coords: [42.388291, -8.703287],
        descripcion: 'Por la noche va a haber gente fumando.'
    },
    {
        nombre: 'Granja de Briz',
        coords: [42.389503, -8.705684],
        descripcion: 'Mitico.'
    },
    {
        nombre: 'Campo de tiro del Lago de Castiñeiras',
        coords: [42.359690, -8.679922],
        descripcion: 'Esta bien y esta apartado.'
    },
    {
        nombre: 'Descampado de O Campo',
        coords: [42.367470, -8.719773],
        descripcion: 'Ahora es un parking, antes molaba.'
    },
    {
        nombre: 'Mirador de Alto da Fracha',
        coords: [42.396968, -8.599521],
        descripcion: 'Tiene buenas vistas, ideal para ir con pareja.'
    },
    {
        nombre: 'Tunel secreto',
        coords: [42.387411, -8.680072],
        descripcion: 'Pasan coche pero son pocos.'
    },
    {
        nombre: 'Ermita de San Cibran',
        coords: [42.411330, -8.627123],
        descripcion: 'Respeta a Cristo.'
    },
    {
        nombre: 'Puente de Lourido',
        coords: [42.428516, -8.656303],
        descripcion: 'Esta apartado pero cuidado con las casa de los vecinos.'
    },
    {
        nombre: 'Observatorio astronomico de Cotobade',
        coords: [42.491874, -8.463897],
        descripcion: 'Esta lejos pero para ver las estrellas esta de locos.'
    },
    {
        nombre: 'Playa de areas',
        coords: [42.391234, -8.777079],
        descripcion: 'Muy bonitas vistas.'
    },
    {
        nombre: 'Aparcamiento de Monteporreiro',
        coords: [42.443515, -8.630065],
        descripcion: 'Muy tranquilo de noche.'
    },
    {
        nombre: 'Marismas de Alba',
        coords: [42.447883, -8.648535],
        descripcion: 'Por la noche no suele haber nadie.'
    },
    {
        nombre: 'Escuela de canteros',
        coords: [42.440806, -8.664624],
        descripcion: 'Nunca pasa nadie.'
    },
    {
        nombre: 'Aparcamiento de la iglesia de Alba',
        coords: [42.460981, -8.644689],
        descripcion: 'Nunca hay nadie. Pasan coches pero no molestan.'
    }
];

// Añadir marcadores al mapa
sitios.forEach(sitio => {
    L.marker(sitio.coords)
        .addTo(map)
        .bindPopup(`<b>${sitio.nombre}</b><br>${sitio.descripcion}`)
        .openPopup();
});

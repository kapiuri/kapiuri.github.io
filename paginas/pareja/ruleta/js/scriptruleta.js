const galeria = document.getElementById('galeria');
const botonGirar = document.getElementById('botonGirar');
const imagenMostrada = document.getElementById('imagenMostrada');
const nombreImagen = document.getElementById('nombreImagen');
let indiceActual = 0;
let intervalo;
let tiempoGiro;
const nombresImagenes = [
    'Abierta de piernas.png', 'Bailarina.png', 'Cara a cara.png', 'Cowboy invertido.png', 'Cuchara arqueada.png', 'De espaldas.png', 'De lado al reves.png',
    'De pie.png', 'Doble placer.png', 'El 69.png', 'El acróbata.png', 'El arquero.png', 'El lingüini.png', 'El medio perrito.png', 'El misionero.png',
    'El perrito sentado.png', 'El perrito.png', 'El puente.png', 'El regalo de Navidad.png', 'El sapo reinvertido.png', 'El sapo.png', 'El trapecista invertido.png',
    'El trono.png', 'El yoga volador.png', 'El yogui.png', 'El ángel de las nieves reinventado.png', 'El ángel de nieve.png', 'Flor de loto.png', 'Incansable.png',
    'La carretilla elevada.png', 'La carretilla.png', 'La cascada.png', 'La cucharita.png', 'La cómoda.png', 'La isla.png', 'La libélula.png', 'La princesa.png',
    'La silla.png', 'Launch Pad.png', 'Mantequilla.png', 'Parado con una pierna arriba.png', 'Perrito reinventado.png', 'Perrito tumbado.png', 'Piernas en los hombros.png',
    'Sexo anal.png', 'Sexo oral abierto de piernas.png', 'Sexo oral de pie.png', 'Sexo oral en pirámide.png', 'Sexo oral recostado.png', 'Tijera.png', 'Uan pierna en el hombro.png',
    'Unión de la abeja.png', 'Ángel de nieve lateral.png'
];
const totalImagenes = nombresImagenes.length;

function cargarImagenes() {
    nombresImagenes.forEach((nombre, i) => {
        const div = document.createElement('div');
        div.classList.add('imagen');
        const img = document.createElement('img');
        img.src = `../../../../assets/imagenes/ruleta/${nombre}`;
        img.alt = `Imagen ${i + 1}`;
        div.appendChild(img);
        galeria.appendChild(div);
    });

    galeria.innerHTML += galeria.innerHTML;
    galeria.style.width = `${totalImagenes * 200 * 2}px`;
}

function girarRuleta() {
    clearInterval(intervalo);
    tiempoGiro = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
    let velocidad = 100;
    let distancia = 200;

    intervalo = setInterval(() => {
        indiceActual = (indiceActual + 1) % totalImagenes;
        galeria.style.transform = `translateX(-${(indiceActual * distancia)}px)`;
    }, velocidad);

    setTimeout(() => {
        clearInterval(intervalo);
        mostrarImagenSeleccionada();
    }, tiempoGiro);
}

function mostrarImagenSeleccionada() {
    const imagenIndex = (indiceActual + totalImagenes) % totalImagenes;
    const imagen = galeria.children[imagenIndex].children[0];
    imagenMostrada.src = imagen.src;

    const nombreCompleto = nombresImagenes[imagenIndex];
    const nombreSinExtension = nombreCompleto.split('.').slice(0, -1).join('.');
    
    nombreImagen.textContent = nombreSinExtension;
}

botonGirar.addEventListener('click', girarRuleta);

cargarImagenes();

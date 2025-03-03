let modo = "normal";
let acciones = {};
let partesCuerpo = {};

// Cargar los datos de los archivos JSON
async function cargarDatos() {
    try {
        // Cargar acciones desde el archivo JSON
        const resAcciones = await fetch('../../../../assets/dados/acciones.json');
        acciones = await resAcciones.json();

        // Cargar partes del cuerpo desde el archivo JSON
        const resPartes = await fetch('../../../../assets/dados/partes.json');
        partesCuerpo = await resPartes.json();

        // Habilitar el botón después de cargar los datos
        document.getElementById('btnLanzar').disabled = false;

    } catch (error) {
        console.error("Error al cargar los datos JSON: ", error);
    }
}

// Función para lanzar los dados
function tirarDados() {
    // Verificar si `acciones` y `partesCuerpo` han sido cargados correctamente
    if (Object.keys(acciones).length === 0 || Object.keys(partesCuerpo).length === 0) {
        console.error("Los datos no han sido cargados correctamente.");
        return;  // Salir si los datos no están disponibles
    }

    // Verificar si `acciones[modo]` y `partesCuerpo[modo]` contienen datos
    let accionesSeleccionadas = acciones[modo];
    let partesSeleccionadas = partesCuerpo[modo];

    // Asegurarnos de que los datos existen antes de intentar acceder a ellos
    if (!accionesSeleccionadas || !accionesSeleccionadas.length) {
        console.error("No se han encontrado acciones para el modo:", modo);
        return;  // Salir si no hay acciones disponibles
    }

    if (!partesSeleccionadas || !partesSeleccionadas.length) {
        console.error("No se han encontrado partes del cuerpo para el modo:", modo);
        return;  // Salir si no hay partes disponibles
    }

    // Cambiar contenido de los dados
    document.getElementById("accion").textContent = accionesSeleccionadas[Math.floor(Math.random() * accionesSeleccionadas.length)];
    document.getElementById("cuerpo").textContent = partesSeleccionadas[Math.floor(Math.random() * partesSeleccionadas.length)];

    // Vibración de los dados
    vibrarDados();
}

// Función para cambiar el modo (normal / sexual)
function cambiarModo() {
    modo = modo === "normal" ? "sexual" : "normal";

    // Cambiar el texto del botón con el nuevo modo
    const botonModo = document.getElementById("cambiarModo");
    botonModo.textContent = "Modo: " + (modo === "normal" ? "Normal" : "Sexual");

    // Después de cambiar el modo, lanzamos los dados con el nuevo modo
    tirarDados();
}

// Función para vibrar los dados
function vibrarDados() {
    // Aplicamos una animación de vibración en los dados
    const dados = document.querySelectorAll('.dado');
    dados.forEach(dado => {
        dado.classList.add('vibrar');
        setTimeout(() => dado.classList.remove('vibrar'), 300); // La vibración dura 300ms
    });

    // Vibración en dispositivos móviles con soporte
    if (navigator.vibrate) {
        navigator.vibrate([50, 50, 100, 50, 150]);
    }
}

// Cargar los datos al iniciar
cargarDatos();

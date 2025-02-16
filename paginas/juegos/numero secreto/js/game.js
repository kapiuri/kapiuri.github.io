let numeroAleatorio = generarNumeroAleatorio();

function generarNumeroAleatorio() {
    return Math.floor(Math.random() * 101);
}

function comprobarNumero() {
    const input = document.getElementById('inputNumero');
    const mensaje = document.getElementById('mensaje');
    const intento = parseInt(input.value, 10);

    if (isNaN(intento) || intento < 0 || intento > 100) {
        mensaje.textContent = 'Por favor, ingresa un número entre 0 y 100.';
        return;
    }

    const diferencia = Math.abs(numeroAleatorio - intento);

    if (diferencia === 0) {
        mensaje.textContent = '¡Felicidades! Has adivinado el número. Se generará un nuevo número.';
        numeroAleatorio = generarNumeroAleatorio();
        input.value = ''; // Limpiar el input después de acertar
    } else if (diferencia <= 10) {
        mensaje.textContent = '¡Caliente! Muy cerca.';
    } else if (diferencia <= 20) {
        mensaje.textContent = 'Caliente.';
    } else if (diferencia <= 30) {
        mensaje.textContent = 'Tibio.';
    } else if (diferencia <= 40) {
        mensaje.textContent = 'Frío.';
    } else {
        mensaje.textContent = '¡Congelado! Muy lejos.';
    }
}

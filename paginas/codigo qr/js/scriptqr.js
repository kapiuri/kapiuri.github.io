// script.js

document.getElementById('generate-btn').addEventListener('click', function() {
    var text = document.getElementById('qr-text').value;
    var qrcodeContainer = document.getElementById('qrcode');

    // Limpia el contenido anterior
    qrcodeContainer.innerHTML = '';

    if (text) {
        // Crea un nuevo elemento canvas
        var canvas = document.createElement('canvas');
        qrcodeContainer.appendChild(canvas);

        // Genera el código QR en el canvas
        QRCode.toCanvas(canvas, text, { width: 200 }, function (error) {
            if (error) {
                console.error(error);
                alert('Error al generar el código QR: ' + error.message);
            } else {
                console.log('Código QR generado con éxito!');
            }
        });
    } else {
        alert('Por favor, introduce algún texto.');
    }
});

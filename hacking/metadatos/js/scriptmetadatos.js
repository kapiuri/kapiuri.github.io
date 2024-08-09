document.getElementById('extractButton').addEventListener('click', function() {
    console.log('Botón clickeado');
    const fileInput = document.getElementById('fileInput');
    const exifOutput = document.getElementById('exifOutput');

    if (fileInput.files.length === 0) {
        exifOutput.textContent = 'No se ha seleccionado ningún archivo. Por favor, elige una imagen.';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        console.log('FileReader onload');
        const image = new Image();
        image.onload = function() {
            console.log('Imagen cargada');
            EXIF.getData(image, function() {
                let exifData = '';
                const tags = EXIF.getAllTags(image); // Obtener todas las etiquetas EXIF
                for (let tag in tags) {
                    if (tags.hasOwnProperty(tag)) {
                        exifData += `${tag}: ${tags[tag]}\n`;
                    }
                }
                if (exifData === '') {
                    exifData = 'No se encontraron datos EXIF.';
                }
                exifOutput.textContent = exifData;
                console.log('Datos EXIF extraídos');
            });
        };
        image.onerror = function() {
            exifOutput.textContent = 'Error al cargar la imagen.';
            console.log('Error al cargar la imagen');
        };
        image.src = e.target.result;
    };

    reader.onerror = function() {
        exifOutput.textContent = 'Error al leer el archivo.';
        console.log('Error al leer el archivo');
    };

    reader.readAsDataURL(file);
});

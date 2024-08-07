document.getElementById('extractButton').addEventListener('click', function() {
    console.log('Button clicked');
    const fileInput = document.getElementById('fileInput');
    const exifOutput = document.getElementById('exifOutput');

    if (fileInput.files.length === 0) {
        exifOutput.textContent = 'No file selected. Please choose an image.';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        console.log('FileReader onload');
        const image = new Image();
        image.onload = function() {
            console.log('Image loaded');
            EXIF.getData(image, function() {
                let exifData = '';
                const tags = EXIF.getAllTags(image); // Get all EXIF tags
                for (let tag in tags) {
                    if (tags.hasOwnProperty(tag)) {
                        exifData += `${tag}: ${tags[tag]}\n`;
                    }
                }
                if (exifData === '') {
                    exifData = 'No EXIF data found.';
                }
                exifOutput.textContent = exifData;
                console.log('EXIF data extracted');
            });
        };
        image.onerror = function() {
            exifOutput.textContent = 'Error loading image.';
            console.log('Error loading image');
        };
        image.src = e.target.result;
    };

    reader.onerror = function() {
        exifOutput.textContent = 'Error reading file.';
        console.log('Error reading file');
    };

    reader.readAsDataURL(file);
});

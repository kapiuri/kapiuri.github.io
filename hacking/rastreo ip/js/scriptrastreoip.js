document.getElementById('consultButton').addEventListener('click', function() {
    const ip = document.getElementById('ipAddress').value;
    if (!ip) {
        alert('Por favor, introduce una dirección IP.');
        return;
    }

    fetch(`https://ipinfo.io/${ip}?token=22089aeaaa30b5`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('ip').textContent = data.ip || 'No disponible';
            document.getElementById('city').textContent = data.city || 'No disponible';
            document.getElementById('region').textContent = data.region || 'No disponible';
            document.getElementById('country').textContent = data.country || 'No disponible';
            document.getElementById('location').textContent = data.loc || 'No disponible';
            document.getElementById('org').textContent = data.org || 'No disponible';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al consultar la información de IP.');
        });
});

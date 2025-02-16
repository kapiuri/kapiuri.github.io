function getIPInfo() {
    const ipAddress = document.getElementById('ipAddress').value.trim();
    const resultElement = document.getElementById('result');
    
    if (!ipAddress) {
        alert('Por favor, introduce una dirección IP.');
        return;
    }

    // Debugging output
    console.log(`Fetching data for IP: ${ipAddress}`);

    fetch(`https://ipinfo.io/${ipAddress}/json?token=22089aeaaa30b5`)
        .then(response => {
            // Debugging output
            console.log(`Response status: ${response.status}`);

            if (!response.ok) {
                throw new Error('No se pudo obtener la información.');
            }
            return response.json();
        })
        .then(data => {
            // Debugging output
            console.log('Received data:', data);

            document.getElementById('ip').textContent = data.ip || 'No disponible';
            document.getElementById('city').textContent = data.city || 'No disponible';
            document.getElementById('region').textContent = data.region || 'No disponible';
            document.getElementById('country').textContent = data.country || 'No disponible';
            document.getElementById('location').textContent = data.loc ? `${data.loc.split(',')[0]}, ${data.loc.split(',')[1]}` : 'No disponible';
            document.getElementById('org').textContent = data.org || 'No disponible';
        })
        .catch(error => {
            console.error('Error:', error);
            resultElement.innerHTML = '<p>No se pudo obtener la información. Verifica la dirección IP y tu conexión.</p>';
        });
}

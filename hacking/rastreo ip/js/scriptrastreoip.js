const token = '22089aeaaa30b5';

async function getIPInfo() {
    const ipAddress = document.getElementById('ipAddress').value;
    const url = `https://ipinfo.io/${ipAddress}?token=${token}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        
        document.getElementById('ip').textContent = data.ip || 'No disponible';
        document.getElementById('city').textContent = data.city || 'No disponible';
        document.getElementById('region').textContent = data.region || 'No disponible';
        document.getElementById('country').textContent = data.country || 'No disponible';
        document.getElementById('location').textContent = data.loc || 'No disponible';
        document.getElementById('org').textContent = data.org || 'No disponible';
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo obtener la información. Verifica la dirección IP y tu conexión.');
    }
}

document.getElementById('checkIp').addEventListener('click', function () {
    const apiKey = "ba55ccc78d76f60b46ca08f59e11942f540944b48920129881cfb46e62ecd742b3240c7af68f1a50"; // Coloca tu API Key aquí
    const ip = document.getElementById('ipInput').value.trim(); // Obtiene la IP ingresada

    if (!ip) {
        document.getElementById('result').innerText = "Por favor, ingresa una dirección IP.";
        return;
    }

    const url = `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90&verbose`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Key': apiKey,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.data.abuseConfidenceScore > 50) {
            document.getElementById('result').innerText = `⚠️ La IP ${ip} ha sido reportada por actividad maliciosa (${data.data.abuseConfidenceScore}% de confianza).`;
        } else {
            document.getElementById('result').innerText = `✅ La IP ${ip} está limpia (${data.data.abuseConfidenceScore}% de confianza).`;
        }
    })
    .catch(error => {
        document.getElementById('result').innerText = "Error al verificar la IP.";
        console.error("Error al verificar la IP:", error);
    });
});
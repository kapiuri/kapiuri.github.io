document.getElementById('censysForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que el formulario recargue la página

    const apiKey = "ba55ccc78d76f60b46ca08f59e11942f540944b48920129881cfb46e62ecd742b3240c7af68f1a50"; // API Key
    const ip = document.getElementById('query').value.trim(); // Obtiene la IP ingresada

    if (!ip) {
        document.getElementById('results').innerText = "⚠️ Por favor, ingresa una dirección IP.";
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
        const score = data.data.abuseConfidenceScore;
        const resultsDiv = document.getElementById('results');

        if (score > 50) {
            resultsDiv.innerHTML = `⚠️ La IP <strong>${ip}</strong> ha sido reportada por actividad maliciosa (${score}% de confianza).`;
        } else {
            resultsDiv.innerHTML = `✅ La IP <strong>${ip}</strong> está limpia (${score}% de confianza).`;
        }
    })
    .catch(error => {
        document.getElementById('results').innerText = "❌ Error al verificar la IP.";
        console.error("Error al verificar la IP:", error);
    });
});

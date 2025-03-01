// Ejemplo para AbuseIPDB API
const apiKey = ba55ccc78d76f60b46ca08f59e11942f540944b48920129881cfb46e62ecd742b3240c7af68f1a50; // Reemplaza con tu AbuseIPDB API Key
const ip = document.getElementById('ipInput').value;
const url = `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`;

fetch(url, {
  method: 'GET',
  headers: {
    'Key': apiKey,
    'Accept': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
    if (data.data.abuseConfidenceScore > 50) {
      document.getElementById('result').innerText = `La IP ${ip} ha sido reportada por actividad maliciosa.`;
    } else {
      document.getElementById('result').innerText = `La IP ${ip} está limpia.`;
    }
  })
  .catch(error => console.log('Error al verificar la IP:', error));

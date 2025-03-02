document.getElementById('shodanForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const query = document.getElementById('query').value.trim();
    const apiKey = "GwBzNJASbQeTZMJwHHZz8KQfYxZEaGzt"; // Clave API de Shodan
    const url = `https://api.shodan.io/shodan/host/search?key=${apiKey}&query=${encodeURIComponent(query)}`;

    if (!query) {
        document.getElementById('results').innerHTML = "<p>⚠️ Ingresa un término de búsqueda.</p>";
        return;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; // Limpiar resultados anteriores
            
            if (data.matches.length === 0) {
                resultsDiv.innerHTML = "<p>🔍 No se encontraron resultados.</p>";
                return;
            }

            data.matches.forEach(item => {
                const result = document.createElement('div');
                result.innerHTML = `<strong>IP:</strong> ${item.ip_str} | <strong>Puerto:</strong> ${item.port}`;
                resultsDiv.appendChild(result);
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            document.getElementById('results').innerHTML = "<p>❌ Error al obtener los datos. Revisa la consola.</p>";
        });
});
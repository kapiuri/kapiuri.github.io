document.getElementById('shodanForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const query = document.getElementById('query').value;
    const apiKey = 'GwBzNJASbQeTZMJwHHZz8KQfYxZEaGzt';  // Inserta tu clave API de Shodan
    const url = `https://api.shodan.io/shodan/host/search?key=${apiKey}&query=${query}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

            if (data.matches && data.matches.length > 0) {
                data.matches.forEach(item => {
                    const result = document.createElement('div');
                    result.innerHTML = `IP: ${item.ip_str} - Puerto: ${item.port}`;
                    resultsDiv.appendChild(result);
                });
            } else {
                resultsDiv.innerHTML = 'No se encontraron resultados.';
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            document.getElementById('results').innerHTML = 'Error al obtener los datos.';
        });
});
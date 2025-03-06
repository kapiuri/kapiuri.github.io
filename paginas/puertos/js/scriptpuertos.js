document.getElementById("escanear").addEventListener("click", async () => {
    const host = document.getElementById("host").value.trim();
    const resultado = document.getElementById("resultado");
    resultado.textContent = "Escaneando...";

    if (!host) {
        resultado.textContent = "Por favor, introduce una IP o dominio válido.";
        return;
    }

    const puertos = [21, 22, 25, 53, 80, 110, 143, 443, 3306, 8080];
    let resultados = "";

    for (let puerto of puertos) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            
            await fetch(`http://${host}:${puerto}`, { mode: 'no-cors', signal: controller.signal });
            resultados += `Puerto ${puerto}: Abierto\n`;
        } catch (error) {
            resultados += `Puerto ${puerto}: Cerrado o filtrado\n`;
        }
    }
    
    resultado.textContent = resultados || "No se encontraron puertos abiertos.";
});

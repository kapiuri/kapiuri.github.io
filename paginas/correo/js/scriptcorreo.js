document.getElementById("verificar").addEventListener("click", async () => {
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const resultado = document.getElementById("resultado");
    
    if (correo === "") {
        resultado.textContent = "Por favor, introduce un correo válido.";
        resultado.style.color = "orange";
        return;
    }
    
    try {
        const response = await fetch(`https://some-public-blacklist-api.com/check?email=${correo}`);
        const data = await response.json();
        
        if (data.blacklisted) {
            resultado.textContent = "Este correo está en la lista negra.";
            resultado.style.color = "red";
        } else {
            resultado.textContent = "Este correo no está en la lista negra.";
            resultado.style.color = "green";
        }
    } catch (error) {
        resultado.textContent = "Error al verificar el correo.";
        resultado.style.color = "orange";
    }
});

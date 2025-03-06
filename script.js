// Script para manejar el menú móvil
document.getElementById('menu-movil').addEventListener('click', function() {
    var enlacesNavegacion = document.getElementById('enlaces-navegacion');
    enlacesNavegacion.classList.toggle('active');
    this.classList.toggle('active');
});

// Script para manejar el año en el footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Script para manejar el modo oscuro/claro
document.addEventListener("DOMContentLoaded", function() {
    const botonModo = document.getElementById("modo-toggle");
    const body = document.body;
    
    // Comprobar si hay una preferencia guardada
    if (localStorage.getItem("modoOscuro") === "true") {
        body.classList.add("modo-oscuro");
    }
    
    botonModo.addEventListener("click", function() {
        body.classList.toggle("modo-oscuro");
        // Guardar la preferencia en localStorage
        localStorage.setItem("modoOscuro", body.classList.contains("modo-oscuro"));
    });
});

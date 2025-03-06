// Script para manejar el año en el footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Script para manejar el modo oscuro/claro
document.addEventListener("DOMContentLoaded", function() {
    const botonModo = document.getElementById("modo-toggle");
    const body = document.body;
    const icono = botonModo.querySelector("i");
    
    // Comprobar si hay una preferencia guardada
    if (localStorage.getItem("modoOscuro") === "true") {
        body.classList.add("modo-oscuro");
        icono.classList.remove("fa-moon");
        icono.classList.add("fa-sun");
    }
    
    botonModo.addEventListener("click", function() {
        body.classList.toggle("modo-oscuro");
        
        if (body.classList.contains("modo-oscuro")) {
            icono.classList.remove("fa-moon");
            icono.classList.add("fa-sun");
            localStorage.setItem("modoOscuro", "true");
        } else {
            icono.classList.remove("fa-sun");
            icono.classList.add("fa-moon");
            localStorage.setItem("modoOscuro", "false");
        }
    });
});

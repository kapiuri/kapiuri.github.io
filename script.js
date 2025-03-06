// Script para manejar el año en el footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Script para manejar el modo oscuro/claro
document.addEventListener("DOMContentLoaded", function() {
    const botonModo = document.getElementById("modo-toggle");
    const body = document.body;
    const icono = botonModo.querySelector("i");
    const enlacesFooter = document.querySelectorAll(".informacion a");

    // Comprobar si hay una preferencia guardada
    if (localStorage.getItem("modoOscuro") === "true") {
        body.classList.add("modo-oscuro");
        icono.classList.remove("fa-moon");
        icono.classList.add("fa-sun");
        enlacesFooter.forEach(enlace => enlace.style.color = "#222");
    }

    botonModo.addEventListener("click", function() {
        body.classList.toggle("modo-oscuro");

        if (body.classList.contains("modo-oscuro")) {
            icono.classList.remove("fa-moon");
            icono.classList.add("fa-sun");
            localStorage.setItem("modoOscuro", "true");
            enlacesFooter.forEach(enlace => enlace.style.color = "#222");
        } else {
            icono.classList.remove("fa-sun");
            icono.classList.add("fa-moon");
            localStorage.setItem("modoOscuro", "false");
            enlacesFooter.forEach(enlace => enlace.style.color = "#00ff00");
        }
    });
});

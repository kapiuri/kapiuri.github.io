// Script para manejar el año en el footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Script para manejar el modo oscuro/claro
document.addEventListener("DOMContentLoaded", function() {
    const botonModo = document.getElementById("modo-toggle");
    const body = document.body;
    const icono = botonModo.querySelector("i");
    const enlacesFooter = document.querySelectorAll(".informacion a");
    const enlaces = document.querySelectorAll("#enlaces-navegacion a");
    
    // Animación de entrada
    document.getElementById("titulo-komodore").style.opacity = "0";
    document.getElementById("titulo-komodore").style.transform = "translateY(-20px)";
    setTimeout(() => {
        document.getElementById("titulo-komodore").style.transition = "opacity 0.8s ease, transform 0.8s ease";
        document.getElementById("titulo-komodore").style.opacity = "1";
        document.getElementById("titulo-komodore").style.transform = "translateY(0)";
    }, 200);
    
    enlaces.forEach((enlace, index) => {
        enlace.style.opacity = "0";
        enlace.style.transform = "translateY(10px)";
        setTimeout(() => {
            enlace.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            enlace.style.opacity = "1";
            enlace.style.transform = "translateY(0)";
        }, 300 + index * 100);
    });
    
    // Efecto rebote en los enlaces al pasar el mouse
    enlaces.forEach(enlace => {
        enlace.addEventListener("mouseenter", () => {
            enlace.style.transform = "scale(1.1) translateY(-3px)";
        });
        enlace.addEventListener("mouseleave", () => {
            enlace.style.transform = "scale(1) translateY(0)";
        });
    });
    
    // Comprobar si hay una preferencia guardada
    if (localStorage.getItem("modoOscuro") === "true") {
        body.classList.add("modo-oscuro");
        icono.classList.remove("fa-moon");
        icono.classList.add("fa-sun");
        enlacesFooter.forEach(enlace => enlace.style.color = "#222");
    }
    
    botonModo.addEventListener("click", function() {
        body.style.transition = "background 0.5s ease, color 0.5s ease";
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

function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('show');
}

// Añadir el evento al botón de menú cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('boton-menu'); // Asegúrate de usar el ID correcto
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
});

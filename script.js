// Script para manejar el menú móvil
document.getElementById('mobile-menu').addEventListener('click', function() {
    var navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
    this.classList.toggle('active');
});

// Script para manejar el año en el footer
document.getElementById('current-year').textContent = new Date().getFullYear();

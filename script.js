document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard Hacker cargado.');

    document.getElementById('mobile-menu').addEventListener('click', function() {
        var navLinks = document.getElementById('nav-links');
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
});

// Obtén el año actual
const currentYear = new Date().getFullYear();

// Selecciona el elemento con el id 'current-year'
document.getElementById('current-year').textContent = currentYear;
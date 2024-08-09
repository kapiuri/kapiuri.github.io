document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard Hacker cargado.');
});

document.getElementById('mobile-menu').addEventListener('click', function() {
    var navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
});

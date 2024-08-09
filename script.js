document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard Hacker cargado.');

    var mobileMenu = document.getElementById('mobile-menu');
    var navLinks = document.getElementById('nav-links');
    var menuClose = document.getElementById('menu-close');

    mobileMenu.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    menuClose.addEventListener('click', function() {
        navLinks.classList.remove('active');
    });
});

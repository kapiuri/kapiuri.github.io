function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('show');
}

// Obtén el año actual
const currentYear = new Date().getFullYear();

// Selecciona el elemento con el id 'current-year'
document.getElementById('current-year').textContent = currentYear;

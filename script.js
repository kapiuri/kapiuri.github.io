// Script para manejar el menú móvil
document.getElementById('menu-movil').addEventListener('click', function() {
    var enlacesNavegacion = document.getElementById('enlaces-navegacion');
    enlacesNavegacion.classList.toggle('active');
    this.classList.toggle('active');
});

// Script para manejar el año en el footer
document.getElementById('current-year').textContent = new Date().getFullYear();

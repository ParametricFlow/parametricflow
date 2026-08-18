// Menú móvil — abre/cierra el listado de navegación en pantallas pequeñas
document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('open');
    });

    // Cierra el menú al elegir una opción
    mobileNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileNav.classList.remove('open');
        });
    });
});

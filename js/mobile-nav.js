// ======================================
// MENÚ MÓVIL (HAMBURGUESA)
// ======================================
// Responsabilidad única de este módulo: abrir/cerrar el panel de
// navegación en pantallas móviles.

(function () {

    document.addEventListener('DOMContentLoaded', function () {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileNav = document.querySelector('.navbar nav');

        if (!menuToggle || !mobileNav) return;

        function closeMenu() {
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menú');
            mobileNav.classList.remove('open');
        }

        function toggleMenu() {
            const isOpen = mobileNav.classList.toggle('open');
            menuToggle.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        }

        menuToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            toggleMenu();
        });

        // Cierra el panel al elegir un link (incluido "Contacto")
        function normalizePath(path) {
            path = path.replace(/\\/g, '/');
            if (path === '/index.html' || path === 'index.html') return '/';
            if (path.length > 1) path = path.replace(/\/$/, '');
            return path || '/';
        }

        mobileNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function (event) {
                closeMenu();

                var target = new URL(link.href, window.location.href);
                var currentPath = normalizePath(window.location.pathname);
                var targetPath = normalizePath(target.pathname);

                if (target.origin === window.location.origin &&
                targetPath === currentPath &&
                !target.hash) {
                event.preventDefault();
                }
            });
        });

        // Cierra el panel al tocar fuera de él
        document.addEventListener('click', function (event) {
            const clickedOutsideMenu = !mobileNav.contains(event.target) && !menuToggle.contains(event.target);
            if (mobileNav.classList.contains('open') && clickedOutsideMenu) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeMenu();
        });

        // Si la pantalla crece más allá del breakpoint móvil, resetea el estado
        window.addEventListener('resize', function () {
            var breakpoint = (window.PF_CONFIG && window.PF_CONFIG.MOBILE_BREAKPOINT_PX) || 640;
            if (window.innerWidth > breakpoint) closeMenu();
        });
    });

})();

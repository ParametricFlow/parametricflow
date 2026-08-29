// ======================================
// FONDO DEL HEADER AL HACER SCROLL
// ======================================

(function () {

    const SCROLL_THRESHOLD_PX = 12;

    document.addEventListener('DOMContentLoaded', function () {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let ticking = false;

        function updateNavbarState() {
            navbar.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD_PX);
            ticking = false;
        }

        function requestNavbarUpdate() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(updateNavbarState);
        }

        updateNavbarState();
        window.addEventListener('scroll', requestNavbarUpdate, { passive: true });
    });

})();

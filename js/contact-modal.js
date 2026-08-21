// Modal de contacto — reemplaza la página contacto.html.
// Construye el modal una sola vez, lo inyecta en <body>, y maneja:
//  1) apertura/cierre del modal desde cualquier link "CONTACTO"
//  2) el envío del formulario vía Formspree (antes vivía en contact.js)
//
// IMPORTANTE: reemplaza FORMSPREE_ENDPOINT con el endpoint real de tu formulario,
// por ejemplo "https://formspree.io/f/xxxxxxxx" (lo obtienes al crear el formulario
// en https://formspree.io asociado a parametricflow@gmail.com).

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrewqldl";

(function () {

    const MODAL_HTML = `
        <div class="modal-overlay" id="contact-modal" aria-hidden="true">
            <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" style="background:#0b1b36; max-width:508px; width:100%; border-radius:20px; padding:40px 36px; box-sizing:border-box;">
                <button type="button" class="modal-close" id="contact-modal-close" aria-label="Cerrar" style="color:#ffffff;">&times;</button>

                <span class="modal-eyebrow" style="display:none;">Hablemos</span>
                <h2 id="contact-modal-title" style="color:#ffffff; margin:0 0 12px;">Cuéntanos tu proyecto</h2>
                <p style="color:#a8bcd6; margin:0 0 28px;">Completa el formulario y te responderemos lo antes posible.</p>

                <form id="contact-form">

                    <div class="form-row">
                        <div class="field" style="margin-bottom:20px;">
                            <label for="modal-name" style="display:block; color:#a8bcd6; text-transform:uppercase; letter-spacing:0.5px; font-size:13px; font-weight:600; margin-bottom:8px;">Nombre</label>
                            <input type="text" id="modal-name" name="name" placeholder="Tu nombre" required style="width:100%; box-sizing:border-box; background:#0f2545; border:1px solid #2196f3; border-radius:6px; color:#ffffff; padding:12px 14px;">
                        </div>
                        <div class="field" style="margin-bottom:20px;">
                            <label for="modal-email" style="display:block; color:#a8bcd6; text-transform:uppercase; letter-spacing:0.5px; font-size:13px; font-weight:600; margin-bottom:8px;">Correo Electrónico</label>
                            <input type="email" id="modal-email" name="email" placeholder="tu@correo.com" required style="width:100%; box-sizing:border-box; background:#0f2545; border:1px solid #1c3a63; border-radius:6px; color:#ffffff; padding:12px 14px;">
                        </div>
                    </div>

                    <div class="field" style="margin-bottom:24px;">
                        <label for="modal-message" style="display:block; color:#a8bcd6; text-transform:uppercase; letter-spacing:0.5px; font-size:13px; font-weight:600; margin-bottom:8px;">Descripción</label>
                        <textarea id="modal-message" name="message" placeholder="Cuéntanos más sobre tu proyecto" required style="width:100%; box-sizing:border-box; background:#0f2545; border:1px solid #1c3a63; border-radius:6px; color:#ffffff; padding:12px 14px; min-height:120px; resize:vertical;"></textarea>
                    </div>

                    <button type="submit" class="submit-btn" id="submit-btn" style="width:100%; background:#1e6fd9; color:#ffffff; border:none; border-radius:6px; padding:14px; font-weight:700; letter-spacing:0.5px;">Enviar mensaje</button>

                    <div class="form-status" id="form-status"></div>

                </form>
            </div>
        </div>
    `;

    let lastFocused = null;

    function openModal(overlay) {
        lastFocused = document.activeElement;
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-locked');

        const firstField = overlay.querySelector('input, textarea');
        if (firstField) firstField.focus();
    }

    function closeModal(overlay) {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-locked');
        if (lastFocused) lastFocused.focus();
    }

    document.addEventListener('DOMContentLoaded', function () {

        // 1) Inyecta el modal en el body (una sola vez por página)
        document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

        const overlay = document.getElementById('contact-modal');
        const closeBtn = document.getElementById('contact-modal-close');

        // 2) Intercepta todos los links "CONTACTO" (nav, botones CTA)
        //    que apunten a contacto.html o lleven la clase js-contact-link
        const contactTriggers = document.querySelectorAll(
            'a[href="contacto.html"], a.js-contact-link'
        );

        contactTriggers.forEach(function (trigger) {
            trigger.setAttribute('href', '#contacto');
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                openModal(overlay);
            });
        });

        closeBtn.addEventListener('click', function () {
            closeModal(overlay);
        });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal(overlay);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('open')) {
                closeModal(overlay);
            }
        });

        // 3) Envío del formulario vía Formspree (AJAX, sin recargar la página)
        const form = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        const status = document.getElementById('form-status');
        const emailField = document.getElementById('modal-email');

        function esEmailValido(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = emailField.value.trim();

            if (!esEmailValido(email)) {
                status.textContent = 'Ingresa una dirección de correo válida (ejemplo: nombre@correo.com).';
                status.className = 'form-status show error';
                emailField.focus();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            status.className = 'form-status';
            status.textContent = '';

            try {
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(form)
                });

                if (response.ok) {
                    status.textContent = 'Gracias por escribirnos. Te responderemos muy pronto.';
                    status.className = 'form-status show success';
                    form.reset();
                    setTimeout(function () {
                        closeModal(overlay);
                    }, 1800);
                } else {
                    throw new Error('Formspree error');
                }

            } catch (err) {
                status.textContent = 'Hubo un problema al enviar tu mensaje. Intenta de nuevo o escríbenos directo a parametricflow@gmail.com.';
                status.className = 'form-status show error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar mensaje';
            }
        });

        // 3.5) Menú móvil (hamburguesa) — abre/cierra el panel de navegación
        const menuToggle = document.getElementById('menu-toggle');
        const mobileNav = document.querySelector('.navbar nav');

        if (menuToggle && mobileNav) {

            function closeMenu() {
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('open');
            }

            function toggleMenu() {
                const isOpen = mobileNav.classList.toggle('open');
                menuToggle.classList.toggle('open', isOpen);
                menuToggle.setAttribute('aria-expanded', String(isOpen));
            }

            menuToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleMenu();
            });

            // Cierra el panel al elegir un link (incluido "Contacto")
            mobileNav.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', closeMenu);
            });

            // Cierra el panel al tocar fuera de él
            document.addEventListener('click', function (e) {
                if (mobileNav.classList.contains('open') &&
                    !mobileNav.contains(e.target) &&
                    !menuToggle.contains(e.target)) {
                    closeMenu();
                }
            });

            // Cierra el panel con Escape
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') closeMenu();
            });

            // Si la pantalla crece más allá del breakpoint móvil, resetea el estado
            window.addEventListener('resize', function () {
                if (window.innerWidth > 640) closeMenu();
            });
        }

        // 4) Header deja de ser transparente al hacer scroll,
        //    para que no se mezcle con el contenido que pasa detrás
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const scrollSource = (document.scrollingElement || document.documentElement);

            function updateNavbarState() {
                if (scrollSource.scrollTop > 12 || window.scrollY > 12) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            updateNavbarState();
            window.addEventListener('scroll', updateNavbarState, { passive: true });
        }

    });

})();

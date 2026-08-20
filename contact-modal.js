// Modal de contacto — reemplaza la página contacto.html.
// Construye el modal una sola vez, lo inyecta en <body>, y maneja:
//  1) apertura/cierre del modal desde cualquier link "CONTACTO"
//  2) el envío del formulario vía Formspree (antes vivía en contact.js)
//
// IMPORTANTE: reemplaza FORMSPREE_ENDPOINT con el endpoint real de tu formulario,
// por ejemplo "https://formspree.io/f/xxxxxxxx" (lo obtienes al crear el formulario
// en https://formspree.io asociado a parametricflow@gmail.com).

const FORMSPREE_ENDPOINT = "https://formspree.io/f/TU_FORM_ID";

(function () {

    const MODAL_HTML = `
        <div class="modal-overlay" id="contact-modal" aria-hidden="true">
            <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
                <button type="button" class="modal-close" id="contact-modal-close" aria-label="Cerrar">&times;</button>

                <span class="modal-eyebrow">Hablemos</span>
                <h2 id="contact-modal-title">Contacto</h2>
                <p>Cuéntanos sobre tu proceso, tu proyecto o la idea que quieres convertir en un flujo paramétrico. Respondemos en un plazo de 1-2 días hábiles.</p>

                <form id="contact-form">

                    <div class="form-row">
                        <div class="field">
                            <label for="modal-name">Nombre</label>
                            <input type="text" id="modal-name" name="name" placeholder="Tu nombre" required>
                        </div>
                        <div class="field">
                            <label for="modal-email">Correo</label>
                            <input type="email" id="modal-email" name="email" placeholder="tu@correo.com" required>
                        </div>
                    </div>

                    <div class="field">
                        <label for="modal-subject">Asunto</label>
                        <input type="text" id="modal-subject" name="subject" placeholder="¿En qué podemos ayudarte?" required>
                    </div>

                    <div class="field">
                        <label for="modal-message">Mensaje</label>
                        <textarea id="modal-message" name="message" placeholder="Cuéntanos sobre tu proyecto..." required></textarea>
                    </div>

                    <button type="submit" class="submit-btn" id="submit-btn">Enviar mensaje</button>

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

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

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

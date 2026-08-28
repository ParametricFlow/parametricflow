// ======================================
// MODAL DE CONTACTO
// ======================================
// Responsabilidad única: crear, abrir, cerrar y gestionar accesibilidad
// del modal. El envío vive en contact-form.js.

(function () {

    const FOCUSABLE_SELECTOR = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const MODAL_HTML = `
        <div class="modal-overlay contact-modal-overlay" id="contact-modal" aria-hidden="true">
            <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
                <button type="button" class="modal-close" id="contact-modal-close" aria-label="Cerrar">&times;</button>

                <h2 id="contact-modal-title">Cuéntenos su proyecto</h2>
                <p>Complete el formulario y le responderemos lo antes posible.</p>

                <form id="contact-form" method="post" novalidate>
                    <div class="form-row">
                        <div class="field">
                            <label for="modal-name">Nombre</label>
                            <input type="text" id="modal-name" name="name" autocomplete="name" minlength="2" maxlength="100" required>
                        </div>
                        <div class="field">
                            <label for="modal-email">Correo Electrónico</label>
                            <input type="email" id="modal-email" name="email" autocomplete="email" maxlength="150" required>
                        </div>
                    </div>

                    <div class="field">
                        <label for="modal-message">Descripción</label>
                        <textarea id="modal-message" name="message" minlength="10" maxlength="2000" required></textarea>
                    </div>

                    <div class="hp-field" aria-hidden="true">
                        <label for="modal-website">No completar este campo</label>
                        <input type="text" id="modal-website" name="_gotcha" tabindex="-1" autocomplete="off">
                    </div>

                    <button type="submit" class="submit-btn" id="submit-btn">Enviar</button>
                    <div class="form-status" id="form-status" role="status" aria-live="polite"></div>
                </form>
            </div>
        </div>
    `;

    let elementFocusedBeforeOpen = null;

    function getFocusableElements(overlay) {
        return Array.from(overlay.querySelectorAll(FOCUSABLE_SELECTOR))
            .filter(function (element) {
                return element.getClientRects().length > 0;
            });
    }

    function openModal(overlay) {
        elementFocusedBeforeOpen = document.activeElement;
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-locked');

        const firstField = overlay.querySelector('#modal-name');
        if (firstField) firstField.focus();
    }

    function closeModal(overlay) {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-locked');

        if (elementFocusedBeforeOpen && typeof elementFocusedBeforeOpen.focus === 'function') {
            elementFocusedBeforeOpen.focus();
        }
    }

    function redirectContactLinksToModal(overlay) {
        const contactTriggers = document.querySelectorAll(
            'a[href="contacto.html"], a.js-contact-link'
        );

        contactTriggers.forEach(function (trigger) {
            trigger.setAttribute('href', '#contacto');
            trigger.addEventListener('click', function (event) {
                event.preventDefault();
                openModal(overlay);
            });
        });
    }

    function wireCloseInteractions(overlay, closeBtn) {
        closeBtn.addEventListener('click', function () {
            closeModal(overlay);
        });

        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) closeModal(overlay);
        });

        document.addEventListener('keydown', function (event) {
            if (!overlay.classList.contains('open')) return;

            if (event.key === 'Escape') {
                event.preventDefault();
                closeModal(overlay);
                return;
            }

            if (event.key !== 'Tab') return;

            const focusable = getFocusableElements(overlay);
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (document.getElementById('contact-modal')) return;

        document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

        const overlay = document.getElementById('contact-modal');
        const closeBtn = document.getElementById('contact-modal-close');

        redirectContactLinksToModal(overlay);
        wireCloseInteractions(overlay, closeBtn);

        window.PF_ContactModal = {
            close: function () { closeModal(overlay); },
            open: function () { openModal(overlay); }
        };
    });

})();

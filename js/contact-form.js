// ======================================
// FORMULARIO DE CONTACTO
// ======================================
// Valida y envía el formulario del modal vía Formspree.

(function () {

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const REQUEST_TIMEOUT_MS = 10000;

    function isValidEmail(email) {
        return EMAIL_PATTERN.test(email);
    }

    function showStatus(statusEl, message, type) {
        statusEl.textContent = message;
        statusEl.className = 'form-status show ' + type;
    }

    function clearStatus(statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
    }

    function setSubmitting(submitBtn, isSubmitting) {
        submitBtn.disabled = isSubmitting;
        submitBtn.textContent = isSubmitting ? 'Enviando...' : 'Enviar';
    }

    async function submitToFormspree(form) {
        if (!window.PF_CONFIG || !window.PF_CONFIG.FORMSPREE_ENDPOINT) {
            throw new Error('Formspree endpoint not configured');
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS);

        try {
            return await fetch(window.PF_CONFIG.FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(form),
                signal: controller.signal
            });
        } finally {
            window.clearTimeout(timeoutId);
        }
    }

    function scheduleModalClose() {
        window.setTimeout(function () {
            if (window.PF_ContactModal) window.PF_ContactModal.close();
        }, 1800);
    }

    async function handleSubmit(event, fields) {
        event.preventDefault();

        if (!fields.form.reportValidity()) return;

        if (fields.honeypot.value.trim() !== '') {
            fields.form.reset();
            showStatus(fields.statusEl, 'Gracias por escribirnos. Te responderemos muy pronto.', 'success');
            scheduleModalClose();
            return;
        }

        const email = fields.emailField.value.trim();
        fields.emailField.value = email;

        if (!isValidEmail(email)) {
            showStatus(fields.statusEl, 'Ingresa una dirección de correo válida (ejemplo: nombre@correo.com).', 'error');
            fields.emailField.focus();
            return;
        }

        setSubmitting(fields.submitBtn, true);
        clearStatus(fields.statusEl);

        try {
            const response = await submitToFormspree(fields.form);
            if (!response.ok) throw new Error('Formspree error');

            showStatus(fields.statusEl, 'Gracias por escribirnos. Te responderemos muy pronto.', 'success');
            fields.form.reset();
            scheduleModalClose();
        } catch (err) {
            const message = err && err.name === 'AbortError'
                ? 'La solicitud tardó demasiado. Intenta de nuevo.'
                : 'Hubo un problema al enviar tu mensaje. Intenta de nuevo o escríbenos directo a ' + ((window.PF_CONFIG && window.PF_CONFIG.CONTACT_EMAIL) || 'parametricflow@gmail.com') + '.';
            showStatus(fields.statusEl, message, 'error');
        } finally {
            setSubmitting(fields.submitBtn, false);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const fields = {
            form: form,
            emailField: document.getElementById('modal-email'),
            honeypot: document.getElementById('modal-website'),
            submitBtn: document.getElementById('submit-btn'),
            statusEl: document.getElementById('form-status')
        };

        if (!fields.emailField || !fields.honeypot || !fields.submitBtn || !fields.statusEl) return;

        form.addEventListener('submit', function (event) {
            handleSubmit(event, fields);
        });
    });

})();

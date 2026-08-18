// Envío del formulario de contacto vía Formspree (AJAX, sin recargar la página)
//
// IMPORTANTE: reemplaza FORMSPREE_ENDPOINT con el endpoint real de tu formulario,
// por ejemplo "https://formspree.io/f/xxxxxxxx" (lo obtienes al crear el formulario
// en https://formspree.io asociado a parametricflow@gmail.com).

const FORMSPREE_ENDPOINT = "https://formspree.io/f/TU_FORM_ID";

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const status = document.getElementById('form-status');

    if (!form) return;

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

});

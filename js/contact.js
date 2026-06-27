const openContactBtn  = document.getElementById('openContactModal');
const contactOverlay  = document.getElementById('contactOverlay');
const contactModal    = document.getElementById('contactModal');
const closeContactBtn = document.getElementById('closeContactModal');
const contactForm     = document.getElementById('contactForm');
const contactStatus   = document.getElementById('contactFormStatus');

function openContactModal() {
  contactOverlay.classList.add('is-open');
  contactModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  document.getElementById('contactName').focus();
}

function closeContactModal() {
  contactOverlay.classList.remove('is-open');
  contactModal.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (openContactBtn) {
  openContactBtn.addEventListener('click', openContactModal);
}
closeContactBtn.addEventListener('click', closeContactModal);
contactOverlay.addEventListener('click', closeContactModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('is-open')) {
    closeContactModal();
  }
});

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre      = document.getElementById('contactName').value.trim();
  const email       = document.getElementById('contactSubject').value.trim();
  const descripcion = document.getElementById('contactMessage').value.trim();

  if (!nombre || !email || !descripcion) {
    contactStatus.textContent = 'Por favor completa todos los campos.';
    contactStatus.className = 'contact-form-status error';
    return;
  }

  if (!esEmailValido(email)) {
    contactStatus.textContent = 'Ingresa un correo electrónico válido (ejemplo: nombre@empresa.com).';
    contactStatus.className = 'contact-form-status error';
    document.getElementById('contactSubject').focus();
    return;
  }

  fetch('https://formspree.io/f/mrewqldl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ Nombre: nombre, Email: email, Descripcion: descripcion })
  })
    .then((response) => {
      if (response.ok) {
        contactStatus.textContent = '¡Mensaje enviado! Te responderemos pronto.';
        contactStatus.className = 'contact-form-status success';
        contactForm.reset();
        setTimeout(closeContactModal, 1800);
      } else {
        contactStatus.textContent = 'Hubo un problema al enviar. Intenta de nuevo.';
        contactStatus.className = 'contact-form-status error';
      }
    })
    .catch(() => {
      contactStatus.textContent = 'Hubo un problema al enviar. Intenta de nuevo.';
      contactStatus.className = 'contact-form-status error';
    });
});

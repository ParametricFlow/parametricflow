const openContactBtn  = document.getElementById('openContactModal');
const contactOverlay  = document.getElementById('contactOverlay');
const contactModal    = document.getElementById('contactModal');
const closeContactBtn = document.getElementById('closeContactModal');
const contactForm     = document.getElementById('contactForm');
const contactStatus   = document.getElementById('contactFormStatus');

function openContactModal() {
  contactOverlay.classList.add('open');
  contactModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('contactName').focus();
}

function closeContactModal() {
  contactOverlay.classList.remove('open');
  contactModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (openContactBtn) {
  openContactBtn.addEventListener('click', openContactModal);
}
closeContactBtn.addEventListener('click', closeContactModal);
contactOverlay.addEventListener('click', closeContactModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactOverlay.classList.contains('open')) {
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
    contactStatus.className = 'form-status show error';
    return;
  }

  if (!esEmailValido(email)) {
    contactStatus.textContent = 'Ingresa un correo electrónico válido (ejemplo: nombre@empresa.com).';
    contactStatus.className = 'form-status show error';
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
        contactStatus.className = 'form-status show success';
        contactForm.reset();
        setTimeout(closeContactModal, 1800);
      } else {
        contactStatus.textContent = 'Hubo un problema al enviar. Intenta de nuevo.';
        contactStatus.className = 'form-status show error';
      }
    })
    .catch(() => {
      contactStatus.textContent = 'Hubo un problema al enviar. Intenta de nuevo.';
      contactStatus.className = 'form-status show error';
    });
});

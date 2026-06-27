const menuToggle    = document.getElementById('menuToggle');
const mobileMenu    = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMenu() {
  menuToggle.classList.add('is-open');
  mobileMenu.classList.add('is-open');
  mobileOverlay.classList.add('is-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menuToggle.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  mobileOverlay.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('is-open');
  isOpen ? closeMenu() : openMenu();
});

mobileOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMenu();
});

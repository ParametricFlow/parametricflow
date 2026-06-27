// ──────────────────────────────────────────────────────────────
// SISTEMA DE IDIOMAS (ES / EN)
// Cambia el texto de todos los elementos marcados con data-es / data-en
// y recuerda la preferencia del usuario entre páginas.
// ──────────────────────────────────────────────────────────────

function getStoredLang() {
  return localStorage.getItem('pf_lang') || 'es';
}

function setStoredLang(lang) {
  localStorage.setItem('pf_lang', lang);
}

function applyLanguage(lang) {
  // Texto de contenido normal
  document.querySelectorAll('[data-es]').forEach((el) => {
    const text = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-es');
    if (text !== null) el.textContent = text;
  });

  // Placeholders de inputs/textarea
  document.querySelectorAll('[data-es-placeholder]').forEach((el) => {
    const text = lang === 'en'
      ? el.getAttribute('data-en-placeholder')
      : el.getAttribute('data-es-placeholder');
    if (text !== null) el.setAttribute('placeholder', text);
  });

  // Atributos aria-label
  document.querySelectorAll('[data-es-aria]').forEach((el) => {
    const text = lang === 'en'
      ? el.getAttribute('data-en-aria')
      : el.getAttribute('data-es-aria');
    if (text !== null) el.setAttribute('aria-label', text);
  });

  // Botón de idioma: muestra el idioma AL QUE puedes cambiar
  document.querySelectorAll('.lang-toggle').forEach((btn) => {
    btn.textContent = lang === 'en' ? 'ES' : 'EN';
  });

  document.documentElement.setAttribute('lang', lang);
  setStoredLang(lang);
}

function toggleLanguage() {
  const current = getStoredLang();
  const next = current === 'en' ? 'es' : 'en';
  applyLanguage(next);
}

document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(getStoredLang());

  document.querySelectorAll('.lang-toggle').forEach((btn) => {
    btn.addEventListener('click', toggleLanguage);
  });
});

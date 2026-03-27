// ── Année footer ──
document.getElementById('year').textContent = new Date().getFullYear();

// ── Menu hamburger mobile ──
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Reveal on scroll ──
const revealEls = document.querySelectorAll('.reveal-on-scroll');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ── FAB WhatsApp/Tel ──
const fabMain = document.getElementById('fabMain');
const fabContainer = document.getElementById('fabContainer');
if (fabMain && fabContainer) {
  fabMain.addEventListener('click', () => {
    const open = fabContainer.classList.toggle('open');
    fabMain.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (!fabContainer.contains(e.target)) {
      fabContainer.classList.remove('open');
      fabMain.setAttribute('aria-expanded', 'false');
    }
  });
}

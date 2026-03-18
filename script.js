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

// ── FAB éventail ──
const fabContainer = document.getElementById('fabContainer');
const fabMain = document.getElementById('fabMain');

if (fabMain && fabContainer) {
  const overlay = document.createElement('div');
  overlay.className = 'fab-overlay';
  document.body.appendChild(overlay);

  const openFab = () => {
    fabContainer.classList.add('is-open');
    fabMain.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
  };

  const closeFab = () => {
    fabContainer.classList.remove('is-open');
    fabMain.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
  };

  fabMain.addEventListener('click', (e) => {
    e.stopPropagation();
    fabContainer.classList.contains('is-open') ? closeFab() : openFab();
  });

  overlay.addEventListener('click', closeFab);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFab();
  });
}

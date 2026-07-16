document.addEventListener('DOMContentLoaded', function () {
  // Année footer
  try {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (e) {
    console.error('Erreur year:', e);
  }

  // Menu mobile
  try {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');

    if (toggle && nav) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = toggle.classList.toggle('open');
        nav.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.classList.remove('open');
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('click', function (e) {
        if (!toggle.contains(e.target) && !nav.contains(e.target)) {
          toggle.classList.remove('open');
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  } catch (e) {
    console.error('Erreur menu mobile:', e);
  }

  // Reveal on scroll
  try {
    var revealEls = document.querySelectorAll('.reveal-on-scroll');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  } catch (e) {
    console.error('Erreur reveal on scroll:', e);
    document.querySelectorAll('.reveal-on-scroll').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // FAQ accordéon
  try {
    document.querySelectorAll('.faq-question').forEach(function (button) {
      button.addEventListener('click', function () {
        var item = button.closest('.faq-item');
        if (item) item.classList.toggle('active');
      });
    });
  } catch (e) {
    console.error('Erreur FAQ accordéon:', e);
  }

  // Bouton WhatsApp flottant (mobile uniquement, injecté pour éviter 21 éditions HTML)
  try {
    if (!document.querySelector('.whatsapp-float')) {
      var floatBtn = document.createElement('a');
      floatBtn.className = 'whatsapp-float';
      floatBtn.href = 'https://wa.me/212720889310?text=Bonjour%2C%20j%27aimerais%20des%20informations%20sur%20vos%20serrures%20connect%C3%A9es';
      floatBtn.target = '_blank';
      floatBtn.rel = 'noopener noreferrer';
      floatBtn.setAttribute('aria-label', 'Contacter Elactronics sur WhatsApp');
      floatBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M20.52 3.48A11.8 11.8 0 0012.05 0C5.49 0 .16 5.34.16 11.89c0 2.09.55 4.14 1.59 5.94L0 24l6.3-1.65a11.87 11.87 0 005.69 1.45h.01c6.55 0 11.88-5.34 11.89-11.89a11.82 11.82 0 00-3.47-8.43zM12 21.3c-1.78 0-3.52-.48-5.04-1.39l-.36-.21-3.74.98 1-3.65-.23-.37a9.86 9.86 0 01-1.51-5.27c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.98 2.89a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.18-1.42-.08-.12-.27-.2-.57-.35z" /></svg>';
      document.body.appendChild(floatBtn);
    }
  } catch (e) {
    console.error('Erreur bouton WhatsApp flottant:', e);
  }

  // Tracking conversions WhatsApp (délégation unique sur document)
  try {
    document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
      if (!link) return;

      var buttonText = (link.textContent || '').replace(/\s+/g, ' ').trim();

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'whatsapp_click', {
          page_path: window.location.pathname,
          page_title: document.title,
          button_text: buttonText,
          transport_type: 'beacon'
        });
      }

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Contact');
      }
    });
  } catch (e) {
    console.error('Erreur tracking WhatsApp:', e);
  }

  // Galerie produits
  try {
    document.querySelectorAll('.product-gallery').forEach(function (gallery) {
      var mainImage = gallery.querySelector('.gallery-main');
      var thumbs = gallery.querySelectorAll('.gallery-thumb');

      if (!mainImage || !thumbs.length) return;

      thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var thumbImage = thumb.querySelector('img');
          if (!thumbImage) return;

          mainImage.src = thumbImage.src;
          if (thumbImage.dataset.alt) mainImage.alt = thumbImage.dataset.alt;

          thumbs.forEach(function (t) {
            t.classList.remove('active');
          });

          thumb.classList.add('active');
        });
      });
    });
  } catch (e) {
    console.error('Erreur galerie produits:', e);
  }
});

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

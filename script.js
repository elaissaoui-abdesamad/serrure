document.addEventListener('DOMContentLoaded', function () {
  // ── Année footer ──
  try {
    var yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  } catch (e) {
    console.error('Erreur year:', e);
  }

  // ── Menu mobile ──
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

  // ── Reveal on scroll ──
  try {
    var revealEls = document.querySelectorAll('.reveal-on-scroll');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

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

  // ── Harmonisation des promos / prix produits ──
  try {
    var promoConfig = {
      'Serrure SmartLock': {
        oldPrice: '1 190 DH',
        newPrice: '890 DH',
        badge: 'PROMO -25%'
      },
      'Serrure NextLock': {
        oldPrice: '1 790 DH',
        newPrice: '1 390 DH',
        badge: 'PROMO -22%'
      },
      'Serrure NeoLock': {
        oldPrice: '2 190 DH',
        newPrice: '1 690 DH',
        badge: 'PROMO -23%'
      },
      'Serrure FutureLock': {
        oldPrice: '3 290 DH',
        newPrice: '2 590 DH',
        badge: 'PROMO -21%'
      },
      'Serrure Infinity': {
        oldPrice: '3 790 DH',
        newPrice: '2 990 DH',
        badge: 'PROMO -21%'
      }
    };

    function parseDh(value) {
      return parseInt(String(value).replace(/[^\d]/g, ''), 10) || 0;
    }

    document.querySelectorAll('.product-card').forEach(function (card) {
      var titleEl = card.querySelector('h3');
      var priceEl = card.querySelector('.product-price');

      if (!titleEl || !priceEl) return;

      var title = titleEl.textContent.trim();
      var config = promoConfig[title];

      if (!config) return;

      // Badge promo
      var promoBadge = card.querySelector('.promo-badge');

      if (!promoBadge) {
        var modelBadge = card.querySelector('.product-model-badge');

        promoBadge = document.createElement('span');
        promoBadge.className = 'promo-badge';

        if (modelBadge && modelBadge.parentNode) {
          modelBadge.parentNode.insertBefore(promoBadge, modelBadge);
        } else if (titleEl.parentNode) {
          titleEl.parentNode.insertBefore(promoBadge, titleEl);
        }
      }

      promoBadge.textContent = config.badge;

      var oldNum = parseDh(config.oldPrice);
      var newNum = parseDh(config.newPrice);
      var saving = oldNum - newNum;

      // Si ancien format <p class="product-price">...</p>, on le convertit en div
      if (priceEl.tagName.toLowerCase() === 'p') {
        var newPriceBlock = document.createElement('div');
        newPriceBlock.className = 'product-price';

        priceEl.parentNode.replaceChild(newPriceBlock, priceEl);
        priceEl = newPriceBlock;
      }

      var oldEl = priceEl.querySelector('.price-old');
      var newEl = priceEl.querySelector('.price-new');
      var savingEl = priceEl.querySelector('.price-saving');

      if (!oldEl) {
        oldEl = document.createElement('span');
        oldEl.className = 'price-old';
        priceEl.appendChild(oldEl);
      }

      if (!newEl) {
        newEl = document.createElement('span');
        newEl.className = 'price-new';
        priceEl.appendChild(newEl);
      }

      if (!savingEl) {
        savingEl = document.createElement('span');
        savingEl.className = 'price-saving';
        priceEl.appendChild(savingEl);
      }

      oldEl.textContent = config.oldPrice;
      newEl.textContent = config.newPrice;
      savingEl.textContent = 'Économie : ' + saving.toLocaleString('fr-FR') + ' DH';
    });
  } catch (e) {
    console.error('Erreur promos produits:', e);
  }
});

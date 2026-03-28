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

    function getInstallText(priceEl) {
      if (!priceEl) return 'installation incluse';

      var span = priceEl.querySelector('span');
      if (span) {
        return span.textContent.replace(/[()]/g, '').trim() || 'installation incluse';
      }

      var raw = priceEl.textContent || '';
      var match = raw.match(/\((.*?)\)/);
      if (match && match[1]) {
        return match[1].trim();
      }

      return 'installation incluse';
    }

    document.querySelectorAll('.product-card').forEach(function (card) {
      var titleEl = card.querySelector('h3');
      var priceEl = card.querySelector('.product-price');

      if (!titleEl || !priceEl) return;

      var title = titleEl.textContent.trim();
      var config = promoConfig[title];

      if (!config) return;

      // Ajouter le badge promo s'il n'existe pas déjà
      if (!card.querySelector('.promo-badge')) {
        var modelBadge = card.querySelector('.product-model-badge');
        var promoBadge = document.createElement('span');
        promoBadge.className = 'promo-badge';
        promoBadge.textContent = config.badge;

        if (modelBadge && modelBadge.parentNode) {
          modelBadge.parentNode.insertBefore(promoBadge, modelBadge);
        } else if (titleEl.parentNode) {
          titleEl.parentNode.insertBefore(promoBadge, titleEl);
        }
      } else {
        card.querySelector('.promo-badge').textContent = config.badge;
      }

      // Si c'est encore un <p class="product-price"> ancien format, on le remplace
      if (priceEl.tagName.toLowerCase() === 'p') {
        var installText = getInstallText(priceEl);
        var oldNum = parseDh(config.oldPrice);
        var newNum = parseDh(config.newPrice);
        var saving = oldNum - newNum;

        var newPriceBlock = document.createElement('div');
        newPriceBlock.className = 'product-price';
        newPriceBlock.innerHTML =
          '<span class="price-old">' + config.oldPrice + '</span>' +
          '<span class="price-new">' + config.newPrice + ' <span>(' + installText + ')</span></span>' +
          '<span class="price-saving">Économie : ' + saving.toLocaleString('fr-FR') + ' DH</span>';

        priceEl.parentNode.replaceChild(newPriceBlock, priceEl);
        return;
      }

      // Si c'est déjà le nouveau format, on met juste à jour les valeurs
      var oldEl = priceEl.querySelector('.price-old');
      var newEl = priceEl.querySelector('.price-new');
      var savingEl = priceEl.querySelector('.price-saving');

      var currentInstallText = 'installation incluse';
      if (newEl) {
        var innerSpan = newEl.querySelector('span');
        if (innerSpan) {
          currentInstallText = innerSpan.textContent.replace(/[()]/g, '').trim() || 'installation incluse';
        }
      }

      var oldNum2 = parseDh(config.oldPrice);
      var newNum2 = parseDh(config.newPrice);
      var saving2 = oldNum2 - newNum2;

      if (!oldEl) {
        oldEl = document.createElement('span');
        oldEl.className = 'price-old';
        priceEl.prepend(oldEl);
      }
      oldEl.textContent = config.oldPrice;

      if (!newEl) {
        newEl = document.createElement('span');
        newEl.className = 'price-new';
        priceEl.appendChild(newEl);
      }
      newEl.innerHTML = config.newPrice + ' <span>(' + currentInstallText + ')</span>';

      if (!savingEl) {
        savingEl = document.createElement('span');
        savingEl.className = 'price-saving';
        priceEl.appendChild(savingEl);
      }
      savingEl.textContent = 'Économie : ' + saving2.toLocaleString('fr-FR') + ' DH';
    });
  } catch (e) {
    console.error('Erreur promos produits:', e);
  }
});
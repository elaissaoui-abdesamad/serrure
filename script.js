document.addEventListener('DOMContentLoaded', function () {
  try {
    var yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  } catch (e) {
    console.error('Erreur year:', e);
  }

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

  try {
    var fabMain = document.getElementById('fabMain');
    var fabContainer = document.getElementById('fabContainer');

    if (fabMain && fabContainer) {
      fabMain.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = fabContainer.classList.toggle('open');
        fabMain.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      document.addEventListener('click', function (e) {
        if (!fabContainer.contains(e.target)) {
          fabContainer.classList.remove('open');
          fabMain.setAttribute('aria-expanded', 'false');
        }
      });
    }
  } catch (e) {
    console.error('Erreur FAB:', e);
  }
});

try {
  var promoConfig = {
    "Serrure SmartLock": {
      oldPrice: "1 190 DH",
      newPrice: "900 DH",
      badge: "PROMO -24%"
    },
    "Serrure NextLock": {
      oldPrice: "1 790 DH",
      newPrice: "1 400 DH",
      badge: "PROMO -22%"
    },
    "Serrure NeoLock": {
      oldPrice: "2 190 DH",
      newPrice: "1 700 DH",
      badge: "PROMO -22%"
    },
    "Serrure FutureLock": {
      oldPrice: "3 290 DH",
      newPrice: "2 600 DH",
      badge: "PROMO -21%"
    },
    "Serrure Infinity": {
      oldPrice: "3 790 DH",
      newPrice: "3 000 DH",
      badge: "PROMO -21%"
    }
  };

  document.querySelectorAll('.product-card').forEach(function (card) {
    var titleEl = card.querySelector('h3');
    var priceEl = card.querySelector('.product-price');

    if (!titleEl || !priceEl) return;

    var title = titleEl.textContent.trim();
    var config = promoConfig[title];

    if (!config) return;

    if (!card.querySelector('.promo-badge')) {
      var modelBadge = card.querySelector('.product-model-badge');
      var promoBadge = document.createElement('span');
      promoBadge.className = 'promo-badge';
      promoBadge.textContent = config.badge;

      if (modelBadge) {
        modelBadge.parentNode.insertBefore(promoBadge, modelBadge);
      } else {
        titleEl.parentNode.insertBefore(promoBadge, titleEl);
      }
    }

    if (priceEl.tagName.toLowerCase() === 'p') {
      var installText = '';
      var installSpan = priceEl.querySelector('span');
      if (installSpan) {
        installText = installSpan.textContent.trim();
      } else {
        installText = 'installation incluse';
      }

      var oldNum = parseInt(config.oldPrice.replace(/\D/g, ''), 10);
      var newNum = parseInt(config.newPrice.replace(/\D/g, ''), 10);
      var saving = oldNum - newNum;

      var newPriceBlock = document.createElement('div');
      newPriceBlock.className = 'product-price';
      newPriceBlock.innerHTML =
        '<span class="price-old">' + config.oldPrice + '</span>' +
        '<span class="price-new">' + config.newPrice + ' <span>(' + installText + ')</span></span>' +
        '<span class="price-saving">Économie : ' + saving.toLocaleString('fr-FR') + ' DH</span>';

      priceEl.parentNode.replaceChild(newPriceBlock, priceEl);
    }
  });
} catch (e) {
  console.error('Erreur promos produits:', e);
}
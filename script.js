// ── Année footer ──
try { document.getElementById(‘year’).textContent = new Date().getFullYear(); } catch(e){}

// ── Menu hamburger mobile ──
try {
var toggle = document.querySelector(’.nav-toggle’);
var nav = document.querySelector(’.main-nav’);
if (toggle && nav) {
toggle.addEventListener(‘click’, function() {
var open = toggle.classList.toggle(‘open’);
nav.classList.toggle(‘open’, open);
toggle.setAttribute(‘aria-expanded’, open);
});
nav.querySelectorAll(‘a’).forEach(function(link) {
link.addEventListener(‘click’, function() {
toggle.classList.remove(‘open’);
nav.classList.remove(‘open’);
toggle.setAttribute(‘aria-expanded’, ‘false’);
});
});
document.addEventListener(‘click’, function(e) {
if (!toggle.contains(e.target) && !nav.contains(e.target)) {
toggle.classList.remove(‘open’);
nav.classList.remove(‘open’);
toggle.setAttribute(‘aria-expanded’, ‘false’);
}
});
}
} catch(e){}

// ── Reveal on scroll ──
try {
var revealEls = document.querySelectorAll(’.reveal-on-scroll’);
var observer = new IntersectionObserver(function(entries) {
entries.forEach(function(entry) {
if (entry.isIntersecting) {
entry.target.classList.add(‘is-visible’);
observer.unobserve(entry.target);
}
});
}, { threshold: 0.1 });
revealEls.forEach(function(el) { observer.observe(el); });
} catch(e){}

// ── FAB WhatsApp ──
try {
var fabMain = document.getElementById(‘fabMain’);
if (fabMain) {
fabMain.addEventListener(‘click’, function() {
window.open(‘https://wa.me/33625287070?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20vos%20serrures.’, ‘_blank’);
});
}
} catch(e){}

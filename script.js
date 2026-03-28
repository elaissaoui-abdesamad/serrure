// ── Année footer ──
document.getElementById(‘year’).textContent = new Date().getFullYear();

// ── Menu hamburger mobile ──
const toggle = document.querySelector(’.nav-toggle’);
const nav = document.querySelector(’.main-nav’);
if (toggle && nav) {
toggle.addEventListener(‘click’, () => {
const open = toggle.classList.toggle(‘open’);
nav.classList.toggle(‘open’, open);
toggle.setAttribute(‘aria-expanded’, open);
});
nav.querySelectorAll(‘a’).forEach(link => {
link.addEventListener(‘click’, () => {
toggle.classList.remove(‘open’);
nav.classList.remove(‘open’);
toggle.setAttribute(‘aria-expanded’, ‘false’);
});
});
document.addEventListener(‘click’, (e) => {
if (!toggle.contains(e.target) && !nav.contains(e.target)) {
toggle.classList.remove(‘open’);
nav.classList.remove(‘open’);
toggle.setAttribute(‘aria-expanded’, ‘false’);
}
});
}

// ── Reveal on scroll ──
const revealEls = document.querySelectorAll(’.reveal-on-scroll’);
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add(‘is-visible’);
observer.unobserve(entry.target);
}
});
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ── Carrousel avis ──
const track = document.getElementById(‘carouselTrack’);
const dotsContainer = document.getElementById(‘carouselDots’);
if (track && dotsContainer) {
const cards = track.querySelectorAll(’.review-card’);
let perView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
let current = 0;
const total = Math.ceil(cards.length / perView);

for (let i = 0; i < total; i++) {
const dot = document.createElement(‘button’);
dot.className = ‘carousel-dot’ + (i === 0 ? ’ active’ : ‘’);
dot.setAttribute(‘aria-label’, ’Slide ’ + (i + 1));
dot.addEventListener(‘click’, () => goTo(i));
dotsContainer.appendChild(dot);
}

function goTo(index) {
current = index;
const cardWidth = cards[0].offsetWidth + 16;
track.style.transform = `translateX(-${current * perView * cardWidth}px)`;
dotsContainer.querySelectorAll(’.carousel-dot’).forEach((d, i) => {
d.classList.toggle(‘active’, i === current);
});
}

let timer = setInterval(() => goTo((current + 1) % total), 3500);
track.addEventListener(‘mouseenter’, () => clearInterval(timer));
track.addEventListener(‘mouseleave’, () => {
timer = setInterval(() => goTo((current + 1) % total), 3500);
});
}

// ── FAB → WhatsApp direct ──
const fabMain = document.getElementById(‘fabMain’);
if (fabMain) {
fabMain.addEventListener(‘click’, () => {
window.open(‘https://wa.me/33625287070?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20vos%20serrures.’, ‘_blank’);
});
}
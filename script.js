document.addEventListener(“DOMContentLoaded”, () => {

// ── ANNÉE ──
const yearEl = document.getElementById(“year”);
if (yearEl) {
yearEl.textContent = new Date().getFullYear().toString();
}

// ── REVEAL ON SCROLL ──
const revealEls = document.querySelectorAll(”.reveal-on-scroll”);

if (“IntersectionObserver” in window) {
const observer = new IntersectionObserver(
(entries, obs) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add(“is-visible”);
obs.unobserve(entry.target);
}
});
},
{ threshold: 0.18 }
);
revealEls.forEach((el) => observer.observe(el));
} else {
revealEls.forEach((el) => el.classList.add(“is-visible”));
}

// ── SMOOTH SCROLL ──
const internalLinks = document.querySelectorAll(‘a[href^=”#”]’);
internalLinks.forEach((link) => {
link.addEventListener(“click”, (event) => {
const href = link.getAttribute(“href”);
if (!href || href === “#”) return;
const target = document.querySelector(href);
if (target) {
event.preventDefault();
target.scrollIntoView({ behavior: “smooth”, block: “start” });
}
});
});

// ── HAMBURGER MENU ──
const navToggle = document.getElementById(“navToggle”);
const mainNav = document.getElementById(“mainNav”);

if (navToggle && mainNav) {
navToggle.addEventListener(“click”, () => {
navToggle.classList.toggle(“is-open”);
mainNav.classList.toggle(“is-open”);
});

```
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("is-open");
    mainNav.classList.remove("is-open");
  });
});
```

}

});
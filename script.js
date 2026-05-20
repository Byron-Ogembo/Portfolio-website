const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const typingTarget = document.getElementById("typingText");
const yearEl = document.getElementById("year");

const typingPhrases = [
  "Data Analyst & Business IT Specialist",
  "Analytics • Cloud • Intelligent Systems",
  "Transforming Data Into Business Value"
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  const currentPhrase = typingPhrases[phraseIndex];
  if (!deleting) {
    typingTarget.textContent = currentPhrase.slice(0, charIndex++);
    if (charIndex > currentPhrase.length) {
      deleting = true;
      setTimeout(typeEffect, 1300);
      return;
    }
  } else {
    typingTarget.textContent = currentPhrase.slice(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      charIndex = 0;
    }
  }
  setTimeout(typeEffect, deleting ? 45 : 85);
}

function setTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  localStorage.setItem("theme", theme);
}

function handleThemeInit() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
    return;
  }
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1300;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    counter.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initObservers() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function updateActiveLink() {
  let currentId = "";
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) currentId = section.id;
  });

  links.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

function setupEvents() {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(navLinks.classList.contains("open")));
  });

  links.forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });

  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light");
    setTheme(isLight ? "dark" : "light");
  });

  window.addEventListener("scroll", () => {
    updateActiveLink();
    backToTop.classList.toggle("show", window.scrollY > 460);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const form = document.querySelector(".contact-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thanks for your message. Byron will get back to you soon.");
    form.reset();
  });
}

function init() {
  yearEl.textContent = new Date().getFullYear();
  handleThemeInit();
  updateActiveLink();
  initObservers();
  setupEvents();
  typeEffect();
}

document.addEventListener("DOMContentLoaded", init);

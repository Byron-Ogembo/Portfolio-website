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
  "Data Lead • Map Maven GMB Experts",
  "SQL • Python • Power BI • Predictive Analytics",
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

  const form = document.getElementById("contactForm");
  if (form) {
    const statusEl = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn ? submitBtn.querySelector(".btn-text") : null;

    function showStatus(message, type) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = `form-status ${type} show`;
    }

    function clearStatus() {
      if (!statusEl) return;
      statusEl.textContent = "";
      statusEl.className = "form-status";
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearStatus();

      const nameInput = form.querySelector("#name");
      const emailInput = form.querySelector("#email");
      const messageInput = form.querySelector("#message");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !email || !message) {
        showStatus("Please fill in all fields before sending.", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus("Please provide a valid email address.", "error");
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = "Sending...";
      form.classList.add("submitting");

      try {
        const formData = new FormData(form);
        formData.set("_replyto", email);
        formData.set("_subject", `New Portfolio Message from ${name}`);
        const endpoint = form.action.includes("/ajax/")
          ? form.action
          : form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json"
          }
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok || data.success === "true" || data.success === true) {
          showStatus("✓ Thank you! Your message has been sent successfully. Byron will respond soon.", "success");
          form.reset();
        } else {
          showStatus("✕ Unable to send message. Please email directly at byronogembo337@gmail.com", "error");
        }
      } catch (error) {
        console.error("Contact form error:", error);
        showStatus("✕ Network error. Please try again or email directly at byronogembo337@gmail.com", "error");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = "Send Message";
        form.classList.remove("submitting");
      }
    });
  }
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

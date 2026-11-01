/* =========================================
   CodeLab Cotonou — Interactions
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav__link");
  const toTop = document.getElementById("toTop");

  /* ---------- Menu mobile ---------- */
  const closeMenu = () => {
    burger.classList.remove("open");
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Ouvrir le menu");
  };

  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    burger.classList.toggle("open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  });

  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  /* ---------- Header au scroll + bouton retour en haut ---------- */
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 10);
    toTop.classList.toggle("show", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Lien actif selon la section visible ---------- */
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Apparition au scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  // Décalage léger entre les éléments d'une même grille
  document.querySelectorAll(".benefits__grid, .activities__grid").forEach((grid) => {
    [...grid.children].forEach((el, i) => (el.style.transitionDelay = `${i * 0.1}s`));
  });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Compteur de la communauté ---------- */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = +el.dataset.count;
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  /* ---------- "En savoir plus" ---------- */
  const moreBtn = document.getElementById("moreBtn");
  const moreText = document.getElementById("moreText");
  moreBtn.addEventListener("click", () => {
    const open = moreText.hidden;
    moreText.hidden = !open;
    moreBtn.setAttribute("aria-expanded", String(open));
    moreBtn.querySelector("span").textContent = open ? "Voir moins" : "En savoir plus";
  });

  /* ---------- Formulaire d'inscription ---------- */
  const form = document.getElementById("joinForm");
  const success = document.getElementById("formSuccess");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input) => {
    const field = input.closest(".field");
    const error = field.querySelector(".error");
    let msg = "";
    const value = input.value.trim();

    if (input.required && !value) msg = "Ce champ est obligatoire.";
    else if (input.type === "email" && !emailRe.test(value)) msg = "Adresse e-mail invalide.";
    else if (input.name === "name" && value.length < 3) msg = "Indique ton nom complet.";

    field.classList.toggle("invalid", !!msg);
    if (error) error.textContent = msg;
    return !msg;
  };

  form.querySelectorAll("[required]").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("invalid")) validateField(input);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll("[required]")];
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      fields.find((f) => f.closest(".field").classList.contains("invalid"))?.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.firstChild.textContent = "Envoi en cours… ";

    // Simulation d'envoi — à remplacer par un vrai service (Formspree, EmailJS, back-end…)
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.firstChild.textContent = "Envoyer ma demande ";
      success.hidden = false;
      setTimeout(() => (success.hidden = true), 6000);
    }, 900);
  });

  /* ---------- Année du footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});

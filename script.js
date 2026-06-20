/* =================================================================
 * nazmulhaquejowel.tech — interactions
 * Refined dark premium portfolio · Nazmul Haque Jowel
 * ================================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.getElementById("main-nav");
  const navLinks = document.getElementById("nav-links");
  const toggle = document.getElementById("mobile-toggle");

  /* ---------- Nav: shadow on scroll ---------- */
  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      nav.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close menu when a link is tapped
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        nav.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Scrollspy: highlight active nav link ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id], header[id]"));
  const linkFor = (id) => document.querySelector(`.nav-cmd[href="#${id}"]`);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            document.querySelectorAll(".nav-cmd.active").forEach((l) => l.classList.remove("active"));
            const link = linkFor(e.target.id);
            if (link) link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("visible"));
  } else {
    const revObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
            // kick off any counters / skill bars inside this section
            animateCounters(e.target);
            animateSkills(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => revObs.observe(el));
  }

  /* ---------- Count-up stats ---------- */
  function animateCounters(scope) {
    scope.querySelectorAll(".stat-value[data-target]").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || "";
      if (prefersReduced) { el.textContent = target + suffix; return; }
      const duration = 1100;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------- Skill bar fill ---------- */
  function animateSkills(scope) {
    scope.querySelectorAll(".skill-fill[data-percent]").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const pct = el.dataset.percent + "%";
      if (prefersReduced) { el.style.width = pct; return; }
      requestAnimationFrame(() => { el.style.width = pct; });
    });
  }

  // In case some reveal sections are already in view on load
  if (prefersReduced) {
    document.querySelectorAll(".section").forEach((s) => { animateCounters(s); animateSkills(s); });
  }

  /* ---------- Lightbox (global for inline onclick) ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");

  window.openLightbox = function (src) {
    if (!lb || !lbImg) return;
    lbImg.src = src;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  window.closeLightbox = function () {
    if (!lb) return;
    lb.classList.remove("open");
    lbImg.src = "";
    document.body.style.overflow = "";
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") window.closeLightbox();
  });
  // prevent click on the image itself from closing (overlay closes it)
  if (lbImg) lbImg.addEventListener("click", (e) => e.stopPropagation());

  /* ---------- Footer year (safety, already 2026 in markup) ---------- */
})();

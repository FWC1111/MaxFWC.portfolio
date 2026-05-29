/**
 * Portfolio interactions — nav, scroll reveal, active section highlight.
 */
(function () {
  const isProjectPage = document.body.classList.contains("project-page");

  function initNav() {
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener("click", function () {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open);
      navToggle.textContent = open ? "CLOSE" : "MENU";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "MENU";
      });
    });
  }

  function initScrollReveal() {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal:not(.visible)").forEach(function (el) {
      observer.observe(el);
    });
  }

  window.initScrollReveal = initScrollReveal;

  function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navAnchors = document.querySelectorAll(".nav-links a");
    if (!sections.length) return;

    function navOffset() {
      return (
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--nav-height"),
          10
        ) + 20
      );
    }

    function setActiveNav() {
      let current = "";
      const scrollY = window.scrollY + navOffset();
      sections.forEach(function (section) {
        if (section.offsetTop <= scrollY) current = section.getAttribute("id");
      });
      navAnchors.forEach(function (a) {
        const href = a.getAttribute("href") || "";
        const active = href === "#" + current || href.endsWith("#" + current);
        a.style.color = active ? "var(--accent)" : "";
        a.style.borderBottomColor = active ? "var(--accent)" : "";
      });
    }

    window.addEventListener("scroll", setActiveNav, { passive: true });
    setActiveNav();
  }

  if (isProjectPage) {
    if (typeof mountProjectPage === "function") mountProjectPage();
  } else {
    PortfolioRender.mount(PORTFOLIO_DATA);
  }

  initNav();
  initScrollReveal();
  if (!isProjectPage) initActiveNav();

  if (typeof BackgroundMusic !== "undefined" && PORTFOLIO_DATA.music) {
    BackgroundMusic.init(PORTFOLIO_DATA.music, PORTFOLIO_DATA.site);
  }
})();

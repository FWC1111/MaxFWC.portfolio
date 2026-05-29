/**
 * Builds page markup from PORTFOLIO_DATA.
 */
const PortfolioRender = (function () {
  const ACCENT_STYLES = {
    accent: { border: "var(--accent)", color: "var(--accent)" },
    cyan: { border: "var(--cyan)", color: "var(--cyan)" },
    purple: { border: "var(--purple)", color: "var(--purple)" },
    amber: { border: "#f59e0b", color: "#f59e0b" },
  };

  const GALLERY_DECOR = {
    default: {},
    purple: {
      background: "var(--purple)",
      boxShadow:
        "8px 0 0 var(--purple), -8px 0 0 var(--purple), 0 8px 0 var(--cyan), 0 -8px 0 var(--purple)",
    },
    cyan: {
      background: "var(--cyan)",
      boxShadow:
        "8px 0 0 var(--cyan), -8px 0 0 var(--cyan), 0 8px 0 var(--accent), 0 -8px 0 var(--cyan)",
    },
    amber: {
      background: "#f59e0b",
      boxShadow:
        "8px 0 0 #f59e0b, -8px 0 0 #f59e0b, 0 8px 0 var(--accent), 0 -8px 0 #f59e0b",
    },
    idle: { width: "32px", height: "64px", borderRadius: "0" },
    walk: { width: "64px", height: "32px", background: "var(--purple)" },
    attack: {
      width: "40px",
      height: "40px",
      transform: "rotate(45deg)",
      background: "var(--accent)",
    },
  };

  function escapeHtml(str) {
    return PortfolioShared.escapeHtml(str);
  }

  function styleAttr(styles) {
    return Object.entries(styles)
      .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}: ${v}`)
      .join("; ");
  }

  function renderNav(data) {
    const homeHref = PortfolioShared.indexUrl();
    const links = data.nav
      .map(function (item) {
        const href = PortfolioShared.resolvePageHref(item.href);
        return `<li><a href="${escapeHtml(href)}">${escapeHtml(item.label)}</a></li>`;
      })
      .join("");
    return `
      <a href="${escapeHtml(homeHref)}" class="nav-logo">${escapeHtml(data.site.logo)}</a>
      <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">MENU</button>
      <ul class="nav-links" id="navLinks">${links}</ul>
    `;
  }

  function mountNav(data) {
    const el = document.getElementById("nav-inner");
    if (!el) return;
    el.innerHTML = renderNav(data);
  }

  function renderHero(data) {
    const h = data.hero;
    return `
      <span class="hero-badge reveal">${escapeHtml(h.badge)}</span>
      <h1 class="reveal">${h.title}</h1>
      <p class="hero-sub reveal">${escapeHtml(h.subtitle)}</p>
      <div class="hero-cta reveal">
        <a href="${escapeHtml(PortfolioShared.resolvePageHref(h.ctaPrimary.href))}" class="btn btn-primary">${escapeHtml(h.ctaPrimary.label)}</a>
        <a href="${escapeHtml(PortfolioShared.resolvePageHref(h.ctaSecondary.href))}" class="btn btn-outline">${escapeHtml(h.ctaSecondary.label)}</a>
      </div>
    `;
  }

  function renderSectionHeader(section) {
    return `
      <div class="section-header reveal">
        <h2>${escapeHtml(section.title)}</h2>
        <p>${escapeHtml(section.subtitle)}</p>
      </div>
    `;
  }

  const IMG_FALLBACK =
    'onerror="this.closest(\'.project-thumb,.gallery-item\')?.classList.add(\'is-fallback\');this.remove();"';

  function renderProjectThumb(project) {
    const accent = ACCENT_STYLES[project.accent] || ACCENT_STYLES.accent;
    const tagStyle = `border-color: ${accent.border}; color: ${accent.color}`;
    const hasImage = Boolean(project.image);
    const placeholder = `<span class="placeholder-icon">[ Screenshot ]<br>${escapeHtml(project.placeholderLabel)}</span>`;
    const img = hasImage
      ? `<img src="${escapeHtml(PortfolioShared.assetPath(project.image))}" alt="${escapeHtml(project.title)} screenshot" ${IMG_FALLBACK}>`
      : "";

    return `
      <div class="project-thumb${hasImage ? " has-image" : ""}">
        <span class="tag-engine" style="${tagStyle}">${escapeHtml(project.engine)}</span>
        ${placeholder}
        ${img}
      </div>
    `;
  }

  function renderProject(project) {
    const highlights = project.highlights
      .map((tag) => `<span>${escapeHtml(tag)}</span>`)
      .join("");
    const accent = project.accent || "accent";
    const href = project.id
      ? PortfolioShared.getProjectUrl(project)
      : project.link || "#";
    const body = `
      ${renderProjectThumb(project)}
      <div class="project-body">
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        <div class="project-highlights">${highlights}</div>
        <span class="project-card-cta">View project →</span>
      </div>
    `;
    return `<a href="${escapeHtml(href)}" class="project-card reveal" data-accent="${accent}">${body}</a>`;
  }

  function renderProjects(projects) {
    return projects.map(renderProject).join("");
  }

  function renderGalleryItem(item) {
    const decor = GALLERY_DECOR[item.decor] || GALLERY_DECOR.default;
    const decorStyle = styleAttr(decor);
    const hasImage = Boolean(item.image);

    const pixelDecor = `<div class="pixel-char"${decorStyle ? ` style="${decorStyle}"` : ""}></div>`;
    const visual = hasImage
      ? `${pixelDecor}<img src="${escapeHtml(PortfolioShared.assetPath(item.image))}" alt="${escapeHtml(item.label)}" ${IMG_FALLBACK}>`
      : pixelDecor;

    const linkStart = item.link
      ? `<a href="${escapeHtml(item.link)}" class="gallery-item reveal${hasImage ? " has-image" : ""}" target="_blank" rel="noopener noreferrer">`
      : `<div class="gallery-item reveal${hasImage ? " has-image" : ""}">`;
    const linkEnd = item.link ? "</a>" : "</div>";

    return `${linkStart}${visual}<span>${escapeHtml(item.label)}</span>${linkEnd}`;
  }

  function renderGallery(items) {
    return items.map(renderGalleryItem).join("");
  }

  function renderAbout(about) {
    return about.paragraphs.map((p) => `<p>${p}</p>`).join("");
  }

  function renderSkills(skills) {
    return skills
      .map((skill) => {
        const sizeClass = skill.size ? ` ${skill.size}` : "";
        return `<span class="skill-tag${sizeClass}">${escapeHtml(skill.name)}</span>`;
      })
      .join("");
  }

  function renderWhatsAppLink(whatsapp) {
    if (!whatsapp || !whatsapp.url) return "";
    return `
        <a href="${escapeHtml(whatsapp.url)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          ${escapeHtml(whatsapp.label || "WhatsApp")}
        </a>`;
  }

  function renderFooter(contact) {
    return `
      <p class="reveal">${escapeHtml(contact.message)}</p>
      <div class="footer-links reveal">
        <a href="${contact.email.url}" aria-label="Send email">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          ${escapeHtml(contact.email.label)}
        </a>
        ${renderWhatsAppLink(contact.whatsapp)}
      </div>
      <p class="reveal" style="margin-top: 1.5rem; font-size: 0.75rem;">${escapeHtml(contact.copyright)}</p>
    `;
  }

  function mount(data) {
    document.title = data.site.title;

    mountNav(data);
    document.getElementById("hero").innerHTML = renderHero(data);

    document.getElementById("games-header").innerHTML = renderSectionHeader(data.sections.games);
    document.getElementById("projects-grid").innerHTML = renderProjects(data.projects);

    document.getElementById("pixel-header").innerHTML = renderSectionHeader(data.sections.pixel);
    document.getElementById("pixel-grid").innerHTML = renderGallery(data.pixelArt);

    document.getElementById("spine-header").innerHTML = renderSectionHeader(data.sections.spine);
    document.getElementById("spine-grid").innerHTML = renderGallery(data.spineAnimations);

    document.getElementById("about-header").innerHTML = renderSectionHeader(data.sections.about);
    document.getElementById("about-text").innerHTML = renderAbout(data.about);
    document.getElementById("skills-cloud").innerHTML = renderSkills(data.skills);

    document.getElementById("footer-content").innerHTML = renderFooter(data.contact);
  }

  return { mount: mount, mountNav: mountNav, renderNav: renderNav };
})();

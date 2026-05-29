/**
 * Renders project.html from ?id= query param and PORTFOLIO_DATA.projects
 */
(function () {
  const ACCENT_STYLES = {
    accent: { border: "var(--accent)", color: "var(--accent)" },
    cyan: { border: "var(--cyan)", color: "var(--cyan)" },
    purple: { border: "var(--purple)", color: "var(--purple)" },
    amber: { border: "#f59e0b", color: "#f59e0b" },
  };

  function getProjectIdFromUrl() {
    return new URLSearchParams(window.location.search).get("id");
  }

  function renderVideo(video) {
    if (!video || !video.src) {
      return `
        <div class="project-video project-video--placeholder reveal">
          <p>Add a trailer in <code>js/data.js</code> → <code>detail.video</code></p>
          <span>Set <code>detail.video.src</code> to your unlisted YouTube URL or video ID</span>
        </div>
      `;
    }

    if (video.type === "youtube") {
      const videoId = PortfolioShared.parseYoutubeId(video.src);
      if (!videoId) return `<div class="project-video project-video--placeholder reveal"><p>Invalid YouTube URL or ID</p></div>`;
      return `
        <div class="project-video reveal">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0"
            title="Project trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `;
    }

    const poster = video.poster
      ? ` poster="${PortfolioShared.escapeHtml(PortfolioShared.assetPath(video.poster))}"`
      : "";
    return `
      <div class="project-video reveal">
        <video controls playsinline preload="metadata"${poster}>
          <source src="${PortfolioShared.escapeHtml(PortfolioShared.assetPath(video.src))}" type="video/mp4">
          Your browser does not support video playback.
        </video>
      </div>
    `;
  }

  function renderDescription(paragraphs) {
    if (!paragraphs || !paragraphs.length) {
      return "<p>No detailed description yet.</p>";
    }
    return paragraphs.map(function (p) {
      return "<p>" + p + "</p>";
    }).join("");
  }

  function renderProjectNav(projects, currentId) {
    const index = projects.findIndex(function (p) {
      return p.id === currentId;
    });
    if (index < 0) return "";

    const prev = projects[index - 1];
    const next = projects[index + 1];

    const prevLink = prev
      ? `<a href="${PortfolioShared.getProjectUrl(prev)}" class="project-nav-link">← ${PortfolioShared.escapeHtml(prev.title)}</a>`
      : "<span></span>";
    const nextLink = next
      ? `<a href="${PortfolioShared.getProjectUrl(next)}" class="project-nav-link">${PortfolioShared.escapeHtml(next.title)} →</a>`
      : "<span></span>";

    return `<nav class="project-nav reveal" aria-label="Other projects">${prevLink}${nextLink}</nav>`;
  }

  function renderNotFound(id) {
    return `
      <div class="project-not-found reveal visible">
        <h1>Project not found</h1>
        <p>No project with id <strong>${PortfolioShared.escapeHtml(id || "(missing)")}</strong>.</p>
        <a href="${PortfolioShared.indexUrl()}#games" class="btn btn-primary">Back to projects</a>
      </div>
    `;
  }

  function renderProjectPage(project, projects) {
    const accent = ACCENT_STYLES[project.accent] || ACCENT_STYLES.accent;
    const tagStyle = `border-color: ${accent.border}; color: ${accent.color}`;
    const detail = project.detail || {};
    const video = detail.video || null;
    const description = detail.description || [project.description];
    const links = detail.links || [];

    const externalLinks = links
      .map(function (link) {
        const attrs = link.external !== false ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${PortfolioShared.escapeHtml(link.url)}" class="btn btn-outline"${attrs}>${PortfolioShared.escapeHtml(link.label)}</a>`;
      })
      .join("");

    const highlights = (project.highlights || [])
      .map(function (tag) {
        return `<span>${PortfolioShared.escapeHtml(tag)}</span>`;
      })
      .join("");

    const meta = [project.engine, detail.role, detail.year].filter(Boolean).join(" · ");

    return `
      <a href="${PortfolioShared.indexUrl()}#games" class="back-link reveal">← Back to projects</a>

      <header class="project-header reveal">
        <span class="project-engine" style="${tagStyle}">${PortfolioShared.escapeHtml(project.engine)}</span>
        <h1>${PortfolioShared.escapeHtml(project.title)}</h1>
        ${meta ? `<p class="project-meta">${PortfolioShared.escapeHtml(meta)}</p>` : ""}
        ${highlights ? `<div class="project-highlights project-highlights--page">${highlights}</div>` : ""}
      </header>

      ${renderVideo(video)}

      <section class="project-description reveal" aria-labelledby="project-desc-heading">
        <h2 id="project-desc-heading">About this project</h2>
        <div class="project-description-body">
          ${renderDescription(description)}
        </div>
        ${externalLinks ? `<div class="project-actions">${externalLinks}</div>` : ""}
      </section>

      ${renderProjectNav(projects, project.id)}
    `;
  }

  function mountProjectPage() {
    const root = document.getElementById("project-root");
    if (!root) return;

    const id = getProjectIdFromUrl();
    const project = PortfolioShared.getProjectById(PORTFOLIO_DATA.projects, id);

    if (project) {
      document.title = project.title + " | " + PORTFOLIO_DATA.site.title;
      root.innerHTML = renderProjectPage(project, PORTFOLIO_DATA.projects);
      root.setAttribute("data-accent", project.accent || "accent");
    } else {
      document.title = "Project not found | " + PORTFOLIO_DATA.site.title;
      root.innerHTML = renderNotFound(id);
    }

    if (typeof PortfolioRender !== "undefined") {
      PortfolioRender.mountNav(PORTFOLIO_DATA);
    }

    const footer = document.getElementById("footer-minimal");
    if (footer) {
      footer.innerHTML = `<p class="reveal visible" style="font-size: 0.75rem;">${PortfolioShared.escapeHtml(PORTFOLIO_DATA.contact.copyright)}</p>`;
    }

    if (typeof initScrollReveal === "function") initScrollReveal();
  }

  window.mountProjectPage = mountProjectPage;
})();


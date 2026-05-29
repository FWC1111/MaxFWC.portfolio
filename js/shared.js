/** Shared helpers for index and project pages */
const PortfolioShared = (function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getBasePath() {
    if (typeof PORTFOLIO_DATA !== "undefined" && PORTFOLIO_DATA.site && PORTFOLIO_DATA.site.basePath) {
      const base = String(PORTFOLIO_DATA.site.basePath);
      if (base === "/" || base === "") return "/";
      return base.endsWith("/") ? base : base + "/";
    }
    return "/MaxFWC.portfolio/";
  }

  function isAbsoluteUrl(path) {
    return /^(https?:|mailto:|tel:|data:)/i.test(path);
  }

  /** Prefix local asset paths with GitHub Pages base (images/, audio/, videos/, css/, etc.) */
  function assetPath(path) {
    if (!path) return path;
    if (isAbsoluteUrl(path)) return path;
    const base = getBasePath();
    const clean = String(path).replace(/^\//, "");
    return base === "/" ? "/" + clean : base + clean;
  }

  /** HTML pages: index.html, project.html */
  function pagePath(filename) {
    return assetPath(filename);
  }

  function indexUrl() {
    return pagePath("index.html");
  }

  function resolvePageHref(href) {
    if (!href) return href;
    if (isAbsoluteUrl(href)) return href;
    if (href.startsWith("#")) return indexUrl() + href;
    return assetPath(href);
  }

  function getProjectById(projects, id) {
    return projects.find(function (p) {
      return p.id === id;
    });
  }

  function getProjectUrl(project) {
    return pagePath("project.html") + "?id=" + encodeURIComponent(project.id);
  }

  function parseYoutubeId(input) {
    if (!input) return null;
    const trimmed = String(input).trim();
    if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
    try {
      const url = new URL(trimmed);
      if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
      if (url.hostname.includes("youtube.com")) return url.searchParams.get("v");
    } catch (_) {
      return null;
    }
    return null;
  }

  return {
    escapeHtml: escapeHtml,
    getBasePath: getBasePath,
    assetPath: assetPath,
    pagePath: pagePath,
    indexUrl: indexUrl,
    resolvePageHref: resolvePageHref,
    getProjectById: getProjectById,
    getProjectUrl: getProjectUrl,
    parseYoutubeId: parseYoutubeId,
  };
})();

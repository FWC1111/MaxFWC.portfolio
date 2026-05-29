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
      if (url.hostname.includes("youtu.be")) {
        const id = url.pathname.replace(/^\//, "").split("/")[0];
        return id && /^[\w-]{11}$/.test(id) ? id : null;
      }
      if (url.hostname.includes("youtube.com")) {
        const fromQuery = url.searchParams.get("v");
        if (fromQuery && /^[\w-]{11}$/.test(fromQuery)) return fromQuery;
        const fromPath = url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/);
        if (fromPath) return fromPath[1];
      }
    } catch (_) {
      return null;
    }
    return null;
  }

  function isYoutubeVideo(video) {
    if (!video || !video.src) return false;
    const type = String(video.type || "").toLowerCase().trim();
    if (type === "youtube") return true;
    if (type === "file") return false;
    return Boolean(parseYoutubeId(video.src));
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
    isYoutubeVideo: isYoutubeVideo,
  };
})();

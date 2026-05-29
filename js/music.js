/**
 * Background music + optional "click to enter" overlay (real user click starts audio).
 * Note: script-generated clicks cannot unlock autoplay — browsers require isTrusted events.
 */
const BackgroundMusic = (function () {
  const LEGACY_STORAGE_KEY = "portfolio-music-enabled";
  const SESSION_KEY = "portfolio-music-state";
  const SESSION_MUTED_KEY = "portfolio-music-muted";
  const ENTERED_KEY = "portfolio-entered";

  function createButton(config) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "music-toggle";
    btn.setAttribute("aria-live", "polite");
    btn.innerHTML = `
      <span class="music-toggle-icon" aria-hidden="true">
        <svg class="icon-music-off" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
        <svg class="icon-music-on" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/>
        </svg>
      </span>
      <span class="music-toggle-label"></span>
    `;
    document.body.appendChild(btn);
    return btn;
  }

  function createEnterOverlay(config, site) {
    const overlay = config.enterOverlay || {};
    const title = overlay.title || site.logo || "PORTFOLIO";
    const subtitle = overlay.subtitle || "Game Developer Portfolio";
    const hint = overlay.hint || "Click or press any key to enter";

    const el = document.createElement("div");
    el.className = "enter-overlay";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Enter portfolio");
    el.tabIndex = 0;
    el.innerHTML = `
      <div class="enter-overlay-panel">
        <p class="enter-overlay-logo">${PortfolioShared ? PortfolioShared.escapeHtml(title) : title}</p>
        <p class="enter-overlay-sub">${PortfolioShared ? PortfolioShared.escapeHtml(subtitle) : subtitle}</p>
        <p class="enter-overlay-hint">${PortfolioShared ? PortfolioShared.escapeHtml(hint) : hint}</p>
        <span class="enter-overlay-blink" aria-hidden="true">▼</span>
      </div>
    `;
    document.body.appendChild(el);
    return el;
  }

  function resolveSrc(config) {
    const src = config.src || "audio/background.mp3";
    return typeof PortfolioShared !== "undefined" ? PortfolioShared.assetPath(src) : src;
  }

  function wantsMusicOn(config) {
    if (config.defaultOn === false) return false;
    return sessionStorage.getItem(SESSION_MUTED_KEY) !== "1";
  }

  function hasEnteredSite() {
    return sessionStorage.getItem(ENTERED_KEY) === "1";
  }

  function shouldShowEnterOverlay(config) {
    if (config.enterOverlay === false) return false;
    const overlay = config.enterOverlay;
    if (overlay && overlay.enabled === false) return false;
    return !hasEnteredSite();
  }

  function readSessionState() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function getResumeTime(state, duration) {
    if (!state || !state.playing) return 0;
    let time = Number(state.currentTime) || 0;
    if (state.savedAt) {
      time += (Date.now() - state.savedAt) / 1000;
    }
    if (duration && duration > 0 && time >= duration) {
      time = time % duration;
    }
    return Math.max(0, time);
  }

  function showLoadError(btn, labelEl, triedSrc) {
    btn.classList.add("music-toggle--error");
    labelEl.textContent = "Music unavailable";
    btn.setAttribute("aria-label", "Could not load " + triedSrc);
  }

  function init(config, site) {
    if (!config || !config.enabled) return;

    site = site || { logo: "PORTFOLIO" };

    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (_) {}

    const targetVolume = Math.min(1, Math.max(0, config.volume ?? 0.35));
    const src = resolveSrc(config);
    const audio = new Audio(src);
    audio.loop = config.loop !== false;
    audio.volume = targetVolume;
    audio.preload = "auto";

    const btn = createButton(config);
    const labelEl = btn.querySelector(".music-toggle-label");
    let isPlaying = false;
    let wantsPlay = wantsMusicOn(config);
    let loadFailed = false;
    let lastSaveAt = 0;
    let playbackStarted = false;
    let enterOverlayEl = null;

    function updateUI() {
      const showOn = wantsPlay && !loadFailed;
      labelEl.textContent = showOn
        ? config.labelOn || "Music on"
        : config.labelOff || "Music off";
      btn.classList.toggle("is-playing", showOn);
      btn.setAttribute(
        "aria-label",
        showOn ? config.labelOn || "Music on" : config.labelOff || "Music off"
      );
      btn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    }

    function saveState() {
      if (loadFailed) return;
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          playing: wantsPlay,
          currentTime: audio.currentTime,
          savedAt: Date.now(),
        })
      );
    }

    function markPlaying() {
      isPlaying = true;
      wantsPlay = true;
      sessionStorage.removeItem(SESSION_MUTED_KEY);
      updateUI();
      saveState();
      btn.classList.remove("music-toggle--hint");
    }

    function play() {
      audio.muted = false;
      audio.volume = targetVolume;
      return audio.play().then(markPlaying);
    }

    function playMutedThenUnmute() {
      audio.muted = true;
      return audio
        .play()
        .then(function () {
          audio.muted = false;
          audio.volume = targetVolume;
          markPlaying();
        })
        .catch(function (err) {
          audio.muted = false;
          audio.volume = targetVolume;
          throw err;
        });
    }

    function attemptPlayback() {
      if (!wantsPlay || loadFailed) return Promise.reject();
      return play().catch(function () {
        return playMutedThenUnmute();
      });
    }

    function pause(userInitiated) {
      audio.pause();
      isPlaying = false;
      if (userInitiated) {
        wantsPlay = false;
        sessionStorage.setItem(SESSION_MUTED_KEY, "1");
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            playing: false,
            currentTime: audio.currentTime,
            savedAt: Date.now(),
          })
        );
      }
      updateUI();
    }

    function toggle() {
      if (loadFailed) return;
      if (isPlaying) {
        pause(true);
      } else {
        wantsPlay = true;
        sessionStorage.removeItem(SESSION_MUTED_KEY);
        updateUI();
        attemptPlayback().catch(function () {
          btn.classList.add("music-toggle--hint");
        });
      }
    }

    function applyResumeAndPlay() {
      if (playbackStarted || loadFailed) return;
      if (audio.readyState < 1) return;
      playbackStarted = true;

      const state = readSessionState();
      const resumeAt = getResumeTime(state, audio.duration);

      if (resumeAt > 0) {
        try {
          audio.currentTime = resumeAt;
        } catch (_) {}
      }

      if (!wantsPlay) {
        updateUI();
        return;
      }

      updateUI();
      attemptPlayback().catch(function () {
        playbackStarted = false;
        btn.classList.add("music-toggle--hint");
      });
    }

    function startPlayback() {
      if (audio.readyState >= 1) {
        applyResumeAndPlay();
      } else {
        audio.addEventListener("loadedmetadata", applyResumeAndPlay, { once: true });
      }
    }

    function dismissEnterOverlay() {
      if (!enterOverlayEl) return;
      sessionStorage.setItem(ENTERED_KEY, "1");
      enterOverlayEl.classList.add("enter-overlay--out");
      document.body.classList.remove("enter-overlay-active");
      btn.style.visibility = "visible";

      setTimeout(function () {
        if (enterOverlayEl && enterOverlayEl.parentNode) {
          enterOverlayEl.parentNode.removeChild(enterOverlayEl);
        }
        enterOverlayEl = null;
      }, 450);

      playbackStarted = false;
      if (wantsPlay) {
        startPlayback();
      } else {
        updateUI();
      }
    }

    function showEnterOverlay() {
      enterOverlayEl = createEnterOverlay(config, site);
      document.body.classList.add("enter-overlay-active");
      btn.style.visibility = "hidden";

      function onEnter(e) {
        if (e && e.isTrusted === false) return;
        enterOverlayEl.removeEventListener("pointerdown", onEnter);
        enterOverlayEl.removeEventListener("keydown", onEnter);
        dismissEnterOverlay();
      }

      enterOverlayEl.addEventListener("pointerdown", onEnter);
      enterOverlayEl.addEventListener("keydown", onEnter);
      requestAnimationFrame(function () {
        enterOverlayEl.focus();
      });
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggle();
    });

    audio.addEventListener("error", function () {
      loadFailed = true;
      showLoadError(btn, labelEl, src);
      updateUI();
    });

    audio.addEventListener("timeupdate", function () {
      if (!isPlaying) return;
      const now = Date.now();
      if (now - lastSaveAt < 1500) return;
      lastSaveAt = now;
      saveState();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        saveState();
        return;
      }
      if (hasEnteredSite() && wantsPlay && !isPlaying && !loadFailed) {
        playbackStarted = false;
        startPlayback();
      }
    });

    window.addEventListener("pagehide", saveState);
    window.addEventListener("beforeunload", saveState);

    document.addEventListener(
      "click",
      function (e) {
        const link = e.target.closest("a[href]");
        if (!link || link.target === "_blank") return;
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) {
          return;
        }
        saveState();
      },
      true
    );

    updateUI();
    audio.load();

    if (shouldShowEnterOverlay(config)) {
      if (audio.readyState >= 1) {
        showEnterOverlay();
      } else {
        audio.addEventListener("loadedmetadata", showEnterOverlay, { once: true });
      }
    } else {
      startPlayback();
    }

    return { audio: audio, toggle: toggle, pause: pause, play: play };
  }

  return { init: init };
})();

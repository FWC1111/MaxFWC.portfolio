/**
 * Portfolio content — edit this file to add or update work.
 *
 * IMAGE FOLDERS (see images/README.md):
 *   games/     → game screenshots     e.g. images/games/2d-roguelike.png
 *   aseprite/  → pixel art exports    e.g. images/aseprite/character-sprites.png
 *   spine/     → Spine preview GIF/PNG e.g. images/spine/idle.png
 *
 * ADD A GAME PROJECT:
 *   Each project needs a unique `id` (used in project.html?id=...).
 *   Fill `detail.video` and `detail.description` for the project page.
 *   Video: type "youtube" + unlisted URL or 11-char video ID (see detail.video below).
 *
 *   Copy an object in `projects`, set `image` under images/games/,
 *   and pick accent: "accent" | "cyan" | "purple" | "amber".
 *
 * ADD GALLERY ITEMS:
 *   Append to `pixelArt` or `spineAnimations` with `image` under aseprite/ or spine/.
 */
const PORTFOLIO_DATA = {
  site: {
    title: "Game Developer Portfolio | Class of 2026",
    logo: "DEV.PORTFOLIO",
    /** GitHub Pages project site base path (repo name). Use "/" for custom domain root. */
    basePath: "/MaxFWC.portfolio/",
  },

  /** Background music — file must be named background.mp3 in audio/ (or set src to your exact filename) */
  music: {
    enabled: true,
    defaultOn: true,
    src: "audio/background.mp3", // e.g. "audio/my-bgm.mp3" if you keep a custom name
    volume: 0.35,
    loop: true,
    labelOn: "Music on",
    labelOff: "Music off",
    /** One real click on this overlay starts BGM (required by browsers). Set enterOverlay: false to disable. */
    enterOverlay: {
      enabled: true,
      title: "DEV.PORTFOLIO",
      subtitle: "Game Developer Portfolio",
      hint: "Click or press any key to enter",
    },
  },

  nav: [
    { href: "#games", label: "Games" },
    { href: "#pixel", label: "Pixel Art" },
    { href: "#spine", label: "Spine Animation" },
    { href: "#about", label: "About" },
  ],

  hero: {
    badge: "Class of 2026 · Game Developer",
    title: "Weaving Games<br>from Code & Pixels",
    subtitle:
      "Specialized in Unity (C#) and foundational Unreal (Blueprint). Currently learning Aseprite pixel art and Spine 2D animation. Passionate about blending gameplay, systems, and visuals into one experience.",
    ctaPrimary: { href: "#games", label: "View Projects" },
    ctaSecondary: { href: "#about", label: "About Me" },
  },

  sections: {
    games: {
      title: "Game Projects",
      subtitle: "Four core projects — from Roguelike to hybrid 2D+3D RPG",
    },
    pixel: {
      title: "Pixel Art",
      subtitle: "Aseprite practice — characters, environments, and UI elements",
    },
    spine: {
      title: "Spine Animation",
      subtitle: "2D skeletal animation study and character motion showcase",
    },
    about: {
      title: "About Me",
      subtitle: "Tech stack and areas of growth",
    },
  },

  projects: [
    {
      id: "crimsonwood",
      title: "2D Roguelike",
      engine: "Unity · C#",
      accent: "accent",
      image: "images/games/crimsonwood.png",
      placeholderLabel: "2D ROGUE",
      description:
        "Implemented Boss AI with a finite state machine (FSM) and a PHP + MySQL meta-progression system supporting create, query, and update operations.",
      highlights: ["FSM Boss AI", "PHP + MySQL", "Meta Progression"],
      detail: {
        role: "Gameplay Programmer",
        year: "2024",
        video: {
          type: "youtube",
          src: "https://youtu.be/wiA7uWxgYpo", // e.g. https://youtu.be/VIDEO_ID or paste 11-char ID
        },
        description: [
          "A 2D roguelike built in <strong>Unity (C#)</strong> with room-based combat and escalating difficulty. I designed and implemented the <strong>Boss AI</strong> as a modular finite state machine, making it easy to add new attack patterns and phase transitions.",
          "Outside the run, players unlock permanent upgrades through a <strong>PHP + MySQL</strong> backend. The API supports creating, reading, and updating player profiles and meta-progression data—bridging the game client with a simple web stack.",
          "This project helped me gain hands-on experience in <strong>combat feel</strong>, <strong>boss AI logic (using FSM)</strong>, and basic full-stack integration between <strong>Unity</strong> and a <strong>PHP/MySQL</strong> backend.",
        ],
        links: [],
      },
    },
    {
      id: "initialz2d",
      title: "2D Racing Mobile Game",
      engine: "Unity · C#",
      accent: "cyan",
      image: "images/games/initialz2d.png",
      placeholderLabel: "RACING",
      description:
        "Waypoint-following NPC AI, a real-time leaderboard system, and shop unlock logic powered by PlayerPrefs.",
      highlights: ["Waypoint AI", "Live Leaderboard", "PlayerPrefs"],
      detail: {
        role: "Gameplay Programmer/Designer",
        year: "2024",
        video: {
          type: "youtube",
          src: "https://youtu.be/axj-ok5NnR0", // e.g. https://youtu.be/VIDEO_ID or paste 11-char ID
        },
        description: [
          "A mobile-friendly <strong>2D racing game</strong> where opponents follow a series of <strong>waypoints</strong> placed along the track. NPCs simply move toward the next <strong>waypoint</strong> without complex acceleration or braking logic.",
          "Race positions are determined each time a car passes a <strong>waypoint</strong>, and the <strong>leaderboard</strong> updates accordingly. Between races, players earn currency by finishing in the top 3, then spend it in a shop to unlock different vehicles and maps. Player progress, including unlocked items and selected car color/type, is saved locally using <strong>PlayerPrefs</strong>.",
          "Focused on arcade-style handling, clear UI, and a system that supports adding new tracks and vehicles easily.",
        ],
        links: [],
      },
    },
    {
      id: "3d-puzzle",
      title: "3D Puzzle Game",
      engine: "Unreal · BP",
      accent: "purple",
      image: "images/games/cluckstronauts.png",
      placeholderLabel: "3D PUZZLE",
      description:
        "Built 3D platforming in Blueprint with laser puzzle mechanics grounded in physics rules and environmental integration.",
      highlights: ["Platforming", "Laser Puzzles", "Environment Interaction"],
      detail: {
        role: "Level & Systems Designer",
        year: "2024",
        video: {
          type: "youtube",
          src: "https://youtu.be/LO9tbT8NhuI", // e.g. https://youtu.be/VIDEO_ID or paste 11-char ID
        },
        description: [
          "A <strong>3D puzzle platformer</strong> built in <strong>Unreal Engine (Blueprint)</strong>. The player must collect all target items and escape within a time limit.",
          "Progression includes unlocking a special gadget that removes weight restrictions, allowing the player to move heavy obstacles. Laser puzzles require pushing and rotating reflectors to redirect beams toward receivers, which then unlock paths or activate moving platforms.",
        ],
        links: [],
      },
    },
    {
      id: "hybrid-rpg",
      title: "2D+3D Hybrid RPG",
      engine: "Unity · C#",
      accent: "amber",
      image: "images/games/lunararcadia.png",
      placeholderLabel: "2D+3D RPG",
      description:
        "Solo-developed all systems: JSON save data, resource gathering and crafting economy, plus Shader Graph outline and perspective effects.",
      highlights: ["JSON Saves", "Crafting Economy", "Shader Graph"],
      detail: {
        role: "Solo Developer",
        year: "2025",
        video: {
          type: "youtube",
          src: "https://youtu.be/Hah3FD7PFtU", // e.g. https://youtu.be/VIDEO_ID or paste 11-char ID
        },
        description: [
          "An experimental <strong>2D + 3D hybrid RPG</strong> where I built every core system alone: exploration, inventory, gathering, crafting, and combat.",
          "Progress is stored in a human-readable <strong>JSON save</strong> format for debugging and future cloud sync. The economy loop ties resource nodes, recipes, and equipment upgrades into a single progression curve.",
          "Visual polish uses <strong>Shader Graph</strong> for character outlines and perspective cues, helping 2D sprites read clearly in a 3D world.",
        ],
        links: [],
      },
    },

    /* --- Add more projects (copy template) ---
    {
      id: "my-new-game",
      title: "My New Game",
      engine: "Unity · C#",
      accent: "accent",
      image: "images/games/my-new-game.png",
      placeholderLabel: "NEW GAME",
      description: "Short summary on the home page card.",
      highlights: ["Feature A", "Feature B"],
      detail: {
        role: "Your Role",
        year: "2026",
        video: { type: "youtube", src: "" },
        description: ["Longer paragraph one.", "Longer paragraph two."],
        links: [{ label: "Play on Itch.io", url: "https://itch.io/...", external: true }],
      },
    },
    --- */
  ],

  pixelArt: [
    { label: "Character Sprites", image: "images/aseprite/mem.png", decor: "default" },
    //{ label: "Environment Tiles", image: "images/aseprite/environment-tiles.png", decor: "purple" },
    //{ label: "Item Icons", image: "images/aseprite/item-icons.png", decor: "cyan" },
    //{ label: "UI Elements", image: "images/aseprite/ui-elements.png", decor: "amber" },
  ],

  spineAnimations: [
    { label: "Idle Animation", image: "images/spine/memidle.gif", decor: "idle" },
    //{ label: "Walk Cycle", image: "images/spine/walk-cycle.png", decor: "walk" },
    //{ label: "Attack Action", image: "images/spine/attack.png", decor: "attack" },
  ],

  about: {
    paragraphs: [
      "I am a <strong>Class of 2026 graduate</strong> aspiring to become a well-rounded game developer. I primarily build 2D/3D gameplay and systems with <strong>Unity (C#)</strong>, while also working with foundational <strong>Unreal Engine (Blueprint)</strong> development.",
      "Beyond programming, I am studying <strong>Aseprite pixel art</strong> and <strong>Spine 2D animation</strong>, with the goal of someday shipping complete game prototypes—from design and code to visuals—on my own.",
      "I’m learning to break systems into maintainable modules—such as AI logic, local data saving, and economy mechanics—through my game projects.",
    ],
  },

  skills: [
    { name: "Unity", size: "large" },
    { name: "C#", size: "large" },
    { name: "Unreal Engine", size: "medium" },
    { name: "Blueprint", size: "medium" },
    { name: "FSM / AI", size: "" },
    { name: "PHP", size: "" },
    { name: "MySQL", size: "" },
    { name: "PlayerPrefs", size: "" },
    { name: "JSON Saves", size: "" },
    { name: "Shader Graph", size: "" },
    { name: "Aseprite", size: "" },
    { name: "Spine 2D", size: "" }
  ],

  contact: {
    message: "Open to opportunities where I can learn, contribute, and collaborate",
    email: {
      url: "mailto:weichungfong1111@gmail.com",
      label: "weichungfong1111@gmail.com",
    },
    whatsapp: {
      url: "https://wa.me/601111303228",
      label: "+601111303228",
    },
    copyright: "© 2026 Game Developer Portfolio",
  },
};

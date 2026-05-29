# Portfolio images

Drop your files here using the filenames below. Supported formats: **PNG**, **JPG**, **WebP**, **GIF**.

## `games/` — Game project screenshots

| File | Project in `data.js` |
|------|----------------------|
| `2d-roguelike.png` | 2D Roguelike |
| `2d-racing.png` | 2D Racing Mobile Game |
| `3d-puzzle.png` | 3D Puzzle Game |
| `hybrid-rpg.png` | 2D+3D Hybrid RPG |

Recommended size: **1280×800** or similar 16:10 aspect ratio.

## `aseprite/` — Pixel art (Aseprite exports)

| File | Gallery label |
|------|----------------|
| `character-sprites.png` | Character Sprites |
| `environment-tiles.png` | Environment Tiles |
| `item-icons.png` | Item Icons |
| `ui-elements.png` | UI Elements |

Recommended: square or portrait, **512×512** or larger.

## `spine/` — Spine 2D previews

Export GIF or PNG previews from Spine (not `.spine` project files).

| File | Gallery label |
|------|----------------|
| `idle.png` | Idle Animation |
| `walk-cycle.png` | Walk Cycle |
| `attack.png` | Attack Action |

Recommended: square preview, **512×512** or animated GIF.

---

## `videos/games/` — Project trailers (detail pages)

| File | Project `id` in `data.js` |
|------|---------------------------|
| `crimsonwood.mp4` | crimsonwood |
| `initialz2d.mp4` | initialz2d |
| `3d-puzzle.mp4` | 3d-puzzle |
| `hybrid-rpg.mp4` | hybrid-rpg |

Or use **YouTube** in `detail.video`: `{ type: "youtube", src: "https://youtu.be/VIDEO_ID" }`.

---

After adding a file, paths in `js/data.js` are already wired — save with the filenames above and refresh.

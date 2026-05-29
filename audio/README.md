# Background music

Place your track here as **`background.mp3`** (required filename unless you change `music.src` in `data.js`).

If your file has another name (e.g. Japanese title), either rename it to `background.mp3` or set:

`music.src: "audio/Your Exact Filename.mp3"` in `js/data.js`.

Also supported if you change `js/data.js`:

- `background.ogg`
- `background.wav` (large file size — not recommended for web)

## Tips

- Use a **looped** chiptune or ambient track (1–3 minutes).
- Keep file size under ~3 MB when possible.
- You must own the rights or use royalty-free music.

## Settings

Edit `PORTFOLIO_DATA.music` in `js/data.js`:

```javascript
music: {
  enabled: true,
  src: "audio/background.mp3",
  volume: 0.35,  // 0.0 – 1.0
  loop: true,
},
```

Music is **on by default**. Click the corner button to turn it off (saved in the browser).

When you open a project page or return home, playback **continues from the same position** instead of restarting.

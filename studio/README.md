# Carousel Studio

A browser-based design app for Instagram carousels, collages, stories and Reels
covers. Single HTML file, no build step, no server, no account. Works offline
once loaded and installs to a phone home screen as a PWA.

Open `index.html` — or serve the folder and visit it — and you're in the editor.

```
npx http-server studio -p 8099     # then open http://localhost:8099
```

## What it does

**Seamless carousel slicer.** Drop one wide photo and it flows edge-to-edge
across every slide. The image stays a single editable layer rather than being cut
into pieces, so you can keep repositioning it after the fact; the amber dashed
lines on the canvas mark where the slide seams fall so you can keep faces and
words clear of them. `Bake into separate slides` flattens it when you're done.

**Ready-made packs.** Six packs — Bold Statement, Editorial, Minimal Mono, Photo
Story, Checklist, Seamless Pano — each build an entire styled deck in one tap:
cover, content slides, and a closing call-to-action, with type and palette already
set. Swap your photos and words and it's finished. Photos you've already placed
are carried across when you switch packs.

**20 single-slide layouts** across carousel, collage, story and Reels-cover
categories, for when you only want to restyle one slide.

**AI cutout.** One-tap background removal running entirely on-device via
WebAssembly (RMBG-1.4 through transformers.js). The model downloads once
(~40 MB) and is cached; nothing is uploaded anywhere.

**Editor.** Direct manipulation with drag, resize, rotate, alignment guides and
snapping. Text layers with eight fonts, weight, tracking, line height, highlight
boxes, outline and shadow. Images with cover/fit/stretch, pan, zoom, corner
radius, brightness/contrast/saturation/blur/grayscale and blend modes. Shapes,
layer ordering, lock/hide, multi-select, full undo/redo.

**Canvas presets.** Carousel 4:5 (1080×1350), Carousel 1:1, Story/Reel 9:16, and
a Reels cover preset that marks the 4:5 region that actually shows in the profile
grid. Switching presets rescales everything rather than cropping it.

**Export.** PNG, JPG or WebP at 1080, 2160 or 3240 px. Multi-slide exports bundle
into a `.zip` with numbered filenames so the upload order is preserved. The ZIP
writer is built in — no CDN needed, so export works offline.

**Autosave.** Projects and imported photos persist in IndexedDB.

## Keyboard

| | |
|---|---|
| `Ctrl/Cmd+Z` / `Shift+Ctrl+Z` | undo / redo |
| `Ctrl/Cmd+D` | duplicate layer |
| `Ctrl/Cmd+A` | select all on slide |
| arrows / `Shift`+arrows | nudge 2px / 20px |
| `[` `]` | previous / next slide |
| `Delete` | remove selection |
| `Esc` | deselect |
| `Ctrl`+scroll | zoom |

Hold `Shift` while resizing a corner to keep the aspect ratio, while rotating to
snap to 15°. Hold `Alt` while dragging to bypass snapping.

## Files

```
index.html             the whole app
sw.js                  service worker (offline shell)
manifest.webmanifest   PWA manifest
icon.png               app icons
```

## Worth knowing

**The cutout model's licence is non-commercial.** RMBG-1.4 is released by BRIA AI
under CC BY-NC 4.0. Everything else here is yours, but if you plan to charge for
this app, swap that model for a permissively licensed one — U²-Net (Apache 2.0)
or BiRefNet are drop-in alternatives; only `loadSegmenter()` in `index.html`
needs to change.

**Fonts and the cutout model load from a CDN.** First run needs a network. After
that the service worker caches them and the app runs offline.

**This is a web app, not a native build.** It installs to a home screen and
behaves like an app, but it isn't in the App Store. Wrapping it with Capacitor
produces real iOS and Android binaries from this same codebase — no rewrite —
which needs a Mac with Xcode and the respective developer accounts.

## Tested

A Playwright suite drives the real app in Chromium and checks that template and
pack geometry is valid, that consecutive slides of a sliced panorama join without
a visible discontinuity (measured against normal adjacent-pixel variance), that
exports come out at the right pixel dimensions, that the generated ZIP passes
`unzip -t`, that undo/redo step correctly, and that the cutout produces a real
alpha mask. 20/20 passing at time of writing.

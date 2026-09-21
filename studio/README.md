# Carousel Studio

A browser-based design app for Instagram carousels, collages, stories and Reels
covers, working in **photos and video**. Single HTML file, no build step, no
server, no account. Works offline once loaded and installs to a phone home
screen as a PWA.

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

**27 photo layouts** are the front of the Layouts panel, because most posts are
one slide and the photo is the content. Full bleed, thin and gallery mats,
instant/polaroid mounts, arch and circle crops, hairline frames, duotone wash,
film strip, overlap, diptych, and grids from two up to nine. Text in these is
never prose — a date stamp, a handle, a short caption.

**Blur fill** solves the commonest Instagram problem: a landscape photo in a 4:5
frame. The photo sits uncropped over an enlarged, blurred copy of itself. It is a
toggle on any photo set to Fit, and a layout and pack of its own.

**Six photo packs** carry the same idea across a whole carousel — Photo dump,
Film roll, Instant album, Gallery, Arches, Blur fill — all at least 45% photo area
and at most six words a slide.

**20 ready-made packs.** Each builds an entire styled deck in one tap — cover,
content slides, and a closing call-to-action, with type and palette already set.
Swap your photos and words and it's finished. Photos you've already placed are
carried across when you switch packs. They come in two groups:

*Styles* (a whole look): Scrapbook, Film, Instant, Plastic, Timeless, Recap,
Editorial, Minimal Mono, Photo Story, Bold Statement, Seamless Pano.

*Formats* (a whole story): Before/After, Step by step, Facts & figures, Product
showcase, Listicle, Myth vs fact, Q&A, Testimonial, Checklist. These are text
posts — a headline and body copy per slide. They sit last in the panel, under
that name, because they are decks rather than photo posts.

The style families are built from real render primitives rather than flat images —
polaroid mounts with a deep chin, 35mm sprocket rails, washi tape with torn
edges, film grain, and Y2K gloss with specular highlights.

**20 single-slide layouts** across carousel, collage, story and Reels-cover
categories, for when you only want to restyle one slide.

**Video.** Clips drop in beside photos and become layers that inherit everything
images get — cover/fit/stretch, pan, zoom, corner radius, filters, blend modes,
shadows and frames. Per-layer trim with in and out points, mute and volume,
playback speed from 0.25× to 4×. A transport bar appears whenever the slide holds
a clip, with a scrubber and play/pause on the space bar. **Grab frame** pulls the
current frame out as a still photo layer — the fastest way to a Reels cover, and
the way to run the AI cutout on a clip.

**AI cutout.** One-tap background removal running entirely on-device via
WebAssembly (RMBG-1.4 through transformers.js). The model downloads once
(~40 MB) and is cached; nothing is uploaded anywhere.

**Photo shaping.** Square, rounded, arch or circle on any photo, driven by
per-corner radii rather than a single value.

**Editor.** Direct manipulation with drag, resize, rotate, alignment guides and
snapping. Text layers with eight fonts, weight, tracking, line height, highlight
boxes, outline and shadow. Images with cover/fit/stretch, pan, zoom, corner
radius, brightness/contrast/saturation/blur/grayscale and blend modes. Shapes,
layer ordering, lock/hide, multi-select, full undo/redo.

**Canvas presets.** Carousel 4:5 (1080×1350), Carousel 1:1, Story/Reel 9:16, and
a Reels cover preset that marks the 4:5 region that actually shows in the profile
grid. Switching presets rescales everything rather than cropping it.

**Export.** *Images* — PNG, JPG or WebP at 1080, 2160 or 3240 px. Multi-slide
exports bundle into a `.zip` with numbered filenames so the upload order is
preserved. The ZIP writer is built in — no CDN needed, so export works offline.

*Video* — records the canvas to MP4 (falling back to WebM where MP4 recording
isn't available), either one slide or the whole carousel end to end, with audio
mixed in from any clip you unmuted. Slides holding a clip run for the clip's
trimmed length; still slides get a duration you choose. Recording happens in real
time, so a 30-second carousel takes 30 seconds.

**Autosave.** Projects and imported photos persist in IndexedDB.

## Keyboard

| | |
|---|---|
| `Ctrl/Cmd+Z` / `Shift+Ctrl+Z` | undo / redo |
| `Ctrl/Cmd+D` | duplicate layer |
| `Ctrl/Cmd+A` | select all on slide |
| arrows / `Shift`+arrows | nudge 2px / 20px |
| `[` `]` | previous / next slide |
| `Space` | play / pause the clip on this slide |
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
that the service worker caches them and the app runs offline. Video needs no
network at any point — decoding, playback and recording are all local.

**Video export is a real-time screen recording, not a transcode.** That keeps it
dependency-free and exact, but it means export takes as long as the video runs,
and the tab needs to stay in the foreground while it records.

**This is a web app, not a native build.** It installs to a home screen and
behaves like an app, but it isn't in the App Store. Wrapping it with Capacitor
produces real iOS and Android binaries from this same codebase — no rewrite —
which needs a Mac with Xcode and the respective developer accounts.

## Tested

Two Playwright suites drive the real app in Chromium — 23 editor checks and 11
video checks, all passing at time of writing.

The editor suite verifies that all 20 packs and 20 layouts build valid geometry
and render real content on every slide, that consecutive slides of a sliced
panorama join without a visible discontinuity (measured against normal
adjacent-pixel variance rather than a fixed threshold), that exports come out at
the right pixel dimensions, that the generated ZIP passes `unzip -t`, that
undo/redo step exactly once, that the project persists to IndexedDB, and that no
pack prints text across a mounted photo — a regression check added after that bug
was found in two packs.

The video suite uploads a real clip through the file input and verifies it decodes
at the right dimensions, renders onto the canvas, that trim and speed change the
slide duration correctly, that scrubbing changes the displayed frame, that grab
frame produces a still layer, and that a recorded export is a valid MP4 which
decodes back at full canvas resolution.

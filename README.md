# Ahmad Hamidi portfolio

Static site. No build step, no dependencies. Open `index.html` or serve the folder:

```bash
python -m http.server 8000
```

```
index.html
assets/
  css/style.css
  js/main.js
  img/            ← raster exports of the heavy art (see below)
  svg/            ← logos, sigil, pastworks wordmark, original Figma exports
```

---

## Design system

- **Direction:** dark zine / collage. A black table with paper objects on it: a torn sheet (about),
  projects as folders on a cutting mat (pastworks), masking-tape labels, film grain. Dark only on purpose.
- **Accent:** one colour, green (`--accent`, `#2fbf5f`), with a deeper `--accent-ink` for use on paper.
- **Type:** Archivo for everything (bold italic headings, extra-wide hero words, regular body)
  and Space Mono for tape labels and skill chips. Google Fonts. The brush "midi" lettering is the
  only handwriting on the site.
- **Icons:** Phosphor (regular weight, from unpkg).
- **Mark (placeholder):** a brush line portrait with "midi" lettered across the neck.
  - `assets/svg/midi-mark.svg`: portrait + lettering, used in the hero on a taped paper card.
  - `assets/svg/midi-word.svg`: lettering only, used in the nav (inverted to paper white by CSS).
  - `assets/svg/midi-favicon.svg`: lettering on a cream tile.

  To change the mark, overwrite those files with the same names. The source drawing and the
  export scripts are in `explorations/` (`midi-portrait-a-v3.html`, `export_mark.py`, `export_word.py`).

## Artwork

The Figma exports of `art-uiux`, `art-brand`, `wordmark-ahmad` and `wordmark-hamidi` are
~3MB each because they embed a texture bitmap. The page uses 2x WebP renders from
`assets/img/` instead. The footer uses `wordmark-*-loop.webp`: each word rendered in full
(uncropped) with a gap after it, so the hover loop can repeat it seamlessly. If you re-export
from Figma, re-render them:

```bash
chrome --headless=new --force-device-scale-factor=2 --default-background-color=00000000 --window-size=1440,335 --screenshot=wordmark-ahmad.png assets/svg/wordmark-ahmad.svg
```

then convert the PNG to WebP (any tool, quality ~82).

The two wordmarks and `pastworks.svg` are applied as CSS masks, so they take the
theme's text or accent colour automatically.

## Motion

- On load the "Design Systems / Brand Assets / Creative Visuals" words come into focus one by
  one, and the portrait card is slapped onto the page
- After the intro, focus drifts slowly through those words (a rack-focus loop)
- The portrait card leans toward the pointer (mouse only)
- Nav gains a frosted surface once you leave the hero, and underlines the section in view
- Paper prints straighten and lift on hover
- Tape labels peel up at one corner on hover and press flat on click
- Project folders open a crack on hover: the front cover lifts and the case study sheet slides out
- The portrait's eyes follow the cursor anywhere on the page while the hero is on screen. The page
  loads `midi-mark.svg` inline for this and moves the paths tagged `class="pupil"`; a mark without
  them just stays a plain image
- Hovering the footer wordmark loops AHMAD left and HAMIDI right; leaving pauses them in place.
  Touch screens run the loop slowly on their own
- The footer wordmark's two words also drift apart as it scrolls through (CSS scroll-driven
  animation; browsers without support show it static)

- On phones and tablets (900px and below), project pages get a floating bar at the bottom:
  previous / current project (opens a list of all projects) / next. It shows on load, slides
  away while scrolling down, comes back on scroll up, and hides once "Next project" is on screen

One scroll listener, for that bar (scroll direction can't be observed any other way); it is
passive and only compares positions and toggles a class. Everything else uses
IntersectionObserver or CSS scroll timelines.
Hidden start states are scoped to `html.js`, so the page reads fine without JavaScript, and
all motion is switched off under `prefers-reduced-motion: reduce`.

## Case studies

`work/parserje.html`, `work/godirect.html`, `work/planally.html`, `work/betacard.html` and the
`work/creative-works.html` archive. They are generated from one template, so they share the
header, nav, footer and the next-project loop (Parserje → Go Direct → Planally → Betacard →
Creative Works → Parserje). Project screens live in `assets/img/cases/`, branding and
illustration work in `assets/img/creative/`. Parserje screens use the web version's made-up
sample workbook, not real statements. The Go Direct and Planally screens were cropped from 1x
exports, so re-export them at 2x from Figma when you can and overwrite the files of the same name.

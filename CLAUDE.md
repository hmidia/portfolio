# Ahmad Hamidi portfolio

Static site on GitHub Pages (public repo). No build step, no dependencies.
Preview: the `portfolio` config in `.claude/launch.json` (python http.server on 8000).

## Where things are

- `index.html`: home (hero, about, pastworks folders, footer wordmark)
- `work/*.html`: case studies (parserje, godirect, planally, betacard, creative-works). They share
  one template, so a header/nav/footer change goes into all five.
- `assets/css/style.css`: all styles. `assets/js/main.js`: all scripts.
- `assets/svg/`: logos and the midi mark/word/favicon. `assets/img/`: WebP renders, case screens
  in `cases/`, creative work in `creative/`.
- `explorations/`: source drawing and export scripts for the midi mark. Not part of the site.
- `README.md` has the full design system, motion list and re-export steps. Read the section you
  need, not the whole file.

## Don't open

- The root-level `art-*.svg` and `wordmark-*.svg` are ~3MB raw Figma exports. The site uses
  `assets/img/*.webp`.
- `old portfolio/` and `explorations/preview/` are large reference images.

## Rules

- Type is Archivo + Space Mono only; one accent colour (`--accent`). Dark only on purpose.
- All motion is off under `prefers-reduced-motion: reduce`; hidden start states are scoped to `html.js`.
- Never commit the resume PDF or its Drive link.
- Verify in the browser with page text or the accessibility tree; take a screenshot only for visual checks.

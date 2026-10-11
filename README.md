# Ahmad Hamidi — portfolio

Static site. No build step, no dependencies. Open `index.html` or serve the folder:

```bash
python3 -m http.server 8000
```

```
index.html
assets/
  css/style.css
  js/main.js
  svg/            ← art (see "Swapping in the real art" below)
```

---

## Swapping in the real art

Every SVG in `assets/svg/` is a **placeholder** at the correct dimensions. Export the
real art from the Figma file and overwrite the file of the same name — nothing else
needs to change.

Figma file: `Midi-PW` → page `Page 1` → the `— v2` frames.

Select the layer, then **Export → SVG** in the right-hand panel.

| Figma layer | Node ID | Save as | Size |
|---|---|---|---|
| `ahmad` | `9:133` | `wordmark-ahmad.svg` | 1657 × 333 |
| `hamidi` | `9:117` | `wordmark-hamidi.svg` | 1625 × 321 |
| `pastworks` | `12:140` | `pastworks.svg` | 444 × 67 |
| `Group 2` (UI/UX art) | `18:264` | `art-uiux.svg` | 320 × 277 |
| `Group 3` (star art) | `20:398` | `art-brand.svg` | 320 × 230 |
| `logo-go-direct 1` | `66:346` | `logo-godirect.svg` | 242 × 103 |
| `Planally-Logo-Full 1` | `66:410` | `logo-planally.svg` | 232 × 71 |
| `fb0f502 1` (Betacard) | `66:468` | `logo-betacard.svg` | 228 × 29 |

**For `pastworks.svg`, tick "Outline text" when exporting.** The display face is
Cubao Free, which isn't a web font — outlining it means the heading renders
correctly for every visitor without shipping a font file.

The dark wave between the work section and the contact band is drawn inline in
`index.html`, not loaded from a file. It's a clean full-width curve, so it stays
seamless at any viewport width. Swap it for the Figma swoosh only if you want to.

---

## Motion

One orchestrated load sequence, then interaction-driven effects. The signature
move is the wordmark: the two words drift in opposite directions as you scroll
past the hero.

- Headline lines clip-reveal on load, staggered
- Nav condenses and gains a shadow once you leave the hero
- Cards lift and their art scales on hover
- Project cards shift their border to blue and slide the arrow
- Contact underline draws itself the first time it enters view

**Accessibility.** Every hidden start state is scoped to `html.js`, so the page is
fully readable if JavaScript fails or is blocked. All motion is disabled under
`prefers-reduced-motion: reduce` — no transforms, no parallax, opacity only.

---

## One thing to check

The contact address is set to **`midi.shaharuddin@gmail.com`**.

The Figma file reads `midi.shaharudding@gmail.com` — with a doubled "d". Since this
is now a live `mailto:` link rather than a static mockup, it's set to the spelling
that matches your account. If the Figma spelling was right after all, change it in
two places in `index.html`: the `href` and the link text.

---

## Case studies

The three project cards link to `#` for now. Clicking one shows "case study coming
soon" rather than failing silently. The case study pages exist as Figma frames
(`Go Direct — v2`, `Planally — v2`, `Betacard — v2`) and can be built next.

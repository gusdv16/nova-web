# NOVA — a cosmic cat in a world of dogs

A cinematic, motion-first landing page built as a front-end portfolio piece. The interaction patterns are inspired by [mew.xyz](https://mew.xyz/); the code and artwork are original. NOVA is a **fictional project**: there is no token, no sale and no real brand behind it.

**Live demo:** https://gusdv16.github.io/nova-web/

## What it does

- **Intro:** preloader that waits for the hero image, then a letter-by-letter title reveal
- **Smooth scroll** (Lenis) wired into the GSAP ticker, with anchor links that use it
- **Custom cursor** that grows on interactive elements and shows a `DRAG` / `PLAY` label
- **Click and trail particles** on a canvas that only redraws while particles are alive
- **Starfield** canvas that pauses when the hero is off screen or the tab is hidden
- **Scroll-velocity marquee:** speeds up while you scroll and eases back
- **Word-by-word text highlight** driven by scroll (stays above 4.5:1 contrast)
- **Seamless looping video** that only plays while visible, plus a native `<dialog>` player from the media cards
- **Draggable carousel** (CSS scroll-snap, mouse drag, buttons, progress bar, keyboard scrolling)
- **Mobile full-screen menu** with focus handling and `Escape` to close
- Parallax, animated counters, magnetic buttons, 3D-tilt cards, film strips
- `prefers-reduced-motion` support and a `<noscript>` fallback

## Performance

Lighthouse (median of 3 runs, production build served locally, Lighthouse 13):

| | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | Transfer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile | 100 | 100 | 100 | 100 | 1.0 s | 29 ms | 0 | 417 KB |
| Desktop | 91 | 100 | 100 | 100 | 1.1 s | 29 ms | 0 | 399 KB |

Desktop Performance is held back by Speed Index (about 2.5 s) because of the deliberate animated intro. Before the optimisation pass the page scored 49 on mobile (LCP 14 s, 3.9 MB, hero title rendering a raw `<br>`).

What made the difference:

- Artwork goes through `astro:assets` (`<Picture>`): AVIF + WebP, several widths, correct `sizes`; only the hero image is eager and `fetchpriority="high"`
- Self-hosted fonts (`@fontsource`, Latin subset) with `preload`, instead of render-blocking Google Fonts
- Critical motion boots first; carousel, video, particles, marquee and text highlight load in a separate chunk on idle
- Canvas loops pause when off screen; the reveal observer detaches after use so it never fights hover transforms

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Astro 5 (static output) |
| Animation | GSAP + ScrollTrigger |
| Smooth scroll | Lenis |
| Styling | Vanilla CSS with custom properties |
| Fonts | Inter, Bebas Neue (self-hosted) |

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321/nova-web/
npm run build    # outputs to dist/
npm run preview  # previews the production build
```

## Project structure

```
src/
  assets/art/             # source artwork (optimised at build time)
  components/Art.astro    # <Picture> wrapper: AVIF/WebP, widths, sizes
  data/art.js             # artwork imports and crops
  layouts/Layout.astro    # document shell, meta tags, fonts, preloader, cursor
  pages/index.astro       # landing page sections
  scripts/                # main.js boots; one small module per feature (lazy.js loads on idle)
  styles/                 # global.css (tokens, primitives) and home.css (page sections)
scripts/gen-video.mjs     # builds public/video/nova-loop.mp4 from the artwork with ffmpeg
public/                   # video, favicon, og image, robots.txt, sitemap
```

## Regenerating the video

`public/video/nova-loop.mp4` is made from the artwork with a slow zoom and cross-fades, and its last frame matches the first so the loop has no jump. It needs `ffmpeg` on your PATH:

```bash
node scripts/gen-video.mjs
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages. If you rename the repository, update `base` in `astro.config.mjs`.

## Artwork

The imagery is AI-generated for this project and lives in `src/assets/art/`.

## License

MIT — code only.

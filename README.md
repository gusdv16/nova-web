# NOVA — a cosmic cat in a world of dogs

A cinematic, motion-first landing page built as a front-end portfolio piece. The visual language and interaction patterns are inspired by [mew.xyz](https://mew.xyz/), but the brand, copy, palette and artwork are original.

**Live demo:** https://gusdv16.github.io/nova-web/

## What it demonstrates

- Scroll-triggered reveals, parallax and animated counters with **GSAP + ScrollTrigger**
- **Lenis** smooth scrolling wired into the GSAP ticker
- Custom cursor, magnetic buttons and 3D-tilt cards
- Infinite marquees and auto-scrolling film strips (pause on hover)
- Animated starfield on canvas
- Static output with **Astro**, zero client framework
- Accessible motion defaults (`prefers-reduced-motion`) and a `<noscript>` fallback

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Astro (static output) |
| Animation | GSAP + ScrollTrigger |
| Smooth scroll | Lenis |
| Styling | Vanilla CSS with custom properties |
| Fonts | Inter, Bebas Neue, Anton |

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321/nova-web/
npm run build    # outputs to dist/
npm run preview  # previews the production build
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.

If you rename the repository, update `base` in `astro.config.mjs` to match (`/<repo-name>`), or set it to `/` for a `username.github.io` user site.

## Project structure

```
src/
  layouts/Layout.astro    # document shell, meta tags, preloader, cursor
  pages/index.astro       # landing page sections
  scripts/main.js         # all client-side motion and interactions
  styles/global.css       # design tokens and shared primitives
public/                   # generated artwork, favicon, og image, robots.txt
```

## Artwork

All imagery is AI-generated for this project and lives in `public/`. Swap the files or the `art` array in `src/pages/index.astro` to re-skin the page.

## License

MIT — code only. Artwork and copy are original to this demo.

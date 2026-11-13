import { defineConfig } from 'astro/config';

// GitHub Pages project site. If the repository name changes, update `base`
// to `/<repo-name>` (or set it to '/' for a user site).
export default defineConfig({
  site: 'https://gusdv16.github.io',
  base: '/mew-style-site',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
});

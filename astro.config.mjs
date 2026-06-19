// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANT (deploy): when you publish to GitHub Pages as a *project* site
// (https://<user>.github.io/<repo>), set `site` to your Pages URL and `base`
// to '/<repo>'. For a user/custom-domain site, set `base` back to '/'.
// These are read in code via import.meta.env.BASE_URL so links stay correct.
export default defineConfig({
  site: 'https://zahid195p.github.io',
  base: '/mgirl',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});

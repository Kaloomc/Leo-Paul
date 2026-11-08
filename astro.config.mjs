// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ⚠️ Remplacer par l'URL définitive du site (Netlify ou domaine perso).
// Utilisée pour le sitemap, le flux RSS et les balises Open Graph.
export default defineConfig({
  site: 'https://monsite.netlify.app',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
});

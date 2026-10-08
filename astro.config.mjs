// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // Remplacez par le vrai domaine quand il sera acheté (ex: https://letinal-ouveillan.fr)
  site: 'https://letinal.pages.dev',
  output: 'static', // statique par defaut ; les routes /api sont en SSR via `export const prerender = false`
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});

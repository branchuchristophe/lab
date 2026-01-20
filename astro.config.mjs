import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://lab.example.com', // Update with actual domain
  integrations: [
    tailwind(),
    // Temporarily disabled until we have content
    // sitemap(),
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    optimizeDeps: {
      exclude: ['drizzle-orm'],
    },
  },
});

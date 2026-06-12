import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static',
  site: process.env.PUBLIC_SITE_URL || 'https://bricksignal.netlify.app',
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(dirname, './src'),
      },
    },
  },
});

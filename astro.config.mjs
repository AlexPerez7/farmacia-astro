// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Publicado en GitHub Pages como sitio de proyecto: https://alexperez7.github.io/farmacia-astro/
export default defineConfig({
  site: 'https://alexperez7.github.io',
  base: '/farmacia-astro/',
  trailingSlash: 'always',
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});

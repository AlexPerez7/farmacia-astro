/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';
import astroConfig from './astro.config.mjs';

// getViteConfig aplica la configuración de Astro (alias, plugins) también a los tests.
export default getViteConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts'],
    // Vitest fija import.meta.env.BASE_URL en '/'; los enlaces del sitio dependen de /farmacia-astro/.
    env: { BASE_URL: astroConfig.base },
  },
});

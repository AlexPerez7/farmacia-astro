import { defineConfig } from '@playwright/test';

const PUERTO = 4322;
const CI = !!process.env.CI;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PUERTO}/farmacia-astro/`,
    trace: 'retain-on-failure',
    // Por defecto el Chromium de Playwright (igual que en CI). PW_CHANNEL=msedge usa el Edge instalado.
    channel: process.env.PW_CHANNEL || undefined,
  },
  // Se prueba el build real, sin la barra de desarrollo de Astro.
  webServer: {
    command: `npm run build && npx astro preview --port ${PUERTO}`,
    url: `http://localhost:${PUERTO}/farmacia-astro/`,
    reuseExistingServer: !CI,
    timeout: 180_000,
  },
  projects: [
    // Las specs que recorren sus propios anchos (responsivo, tema, accesibilidad) corren una sola vez.
    { name: 'escritorio', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'movil', use: { viewport: { width: 375, height: 812 } }, testMatch: /compra\.spec\.ts/ },
  ],
});

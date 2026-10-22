import { expect, test, type Page } from '@playwright/test';

const temaActual = (page: Page) => page.evaluate(() => document.documentElement.dataset.theme);
const preferencia = (page: Page) => page.evaluate(() => localStorage.getItem('pulso:tema'));
const boton = (page: Page) => page.getByRole('button', { name: /^Tema / });

test('no hay destello: el tema guardado se aplica antes de pintar el <body>', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    localStorage.setItem('pulso:tema', 'oscuro');
    // Registra el tema en el momento en que el parser crea el <body>.
    new MutationObserver((_, obs) => {
      if (document.body) {
        (window as unknown as { temaAlPintar?: string }).temaAlPintar = document.documentElement.dataset.theme;
        obs.disconnect();
      }
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto('');
  expect(await page.evaluate(() => (window as unknown as { temaAlPintar?: string }).temaAlPintar)).toBe('dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(2, 6, 23)');
});

test('el interruptor rota sistema → claro → oscuro y se recuerda al recargar', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('');
  await expect(boton(page)).toHaveAccessibleName(/según el sistema/);
  expect(await temaActual(page)).toBe('dark');

  await boton(page).click();
  await expect(boton(page)).toHaveAccessibleName(/^Tema claro/);
  expect([await preferencia(page), await temaActual(page)]).toEqual(['claro', 'light']);

  await boton(page).click();
  await expect(boton(page)).toHaveAccessibleName(/^Tema oscuro/);
  expect([await preferencia(page), await temaActual(page)]).toEqual(['oscuro', 'dark']);

  await page.emulateMedia({ colorScheme: 'light' });
  await page.reload();
  expect(await temaActual(page)).toBe('dark');

  await boton(page).click();
  expect([await preferencia(page), await temaActual(page)]).toEqual(['sistema', 'light']);
});

test('en modo sistema sigue los cambios del sistema operativo en vivo', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('');
  await expect(boton(page)).toBeVisible();
  expect(await temaActual(page)).toBe('light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect.poll(() => temaActual(page)).toBe('dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect.poll(() => temaActual(page)).toBe('light');
});

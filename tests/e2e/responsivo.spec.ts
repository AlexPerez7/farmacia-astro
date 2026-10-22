import { expect, test } from '@playwright/test';
import { ESQUEMAS, PAGINAS, medirDesborde, sembrarCarro } from './utilidades';

const ANCHOS = [320, 375, 768, 1024, 1440];

for (const esquema of ESQUEMAS) {
  for (const ancho of ANCHOS) {
    test(`sin scroll horizontal a ${ancho}px en tema ${esquema}`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: 900 });
      await page.emulateMedia({ colorScheme: esquema });
      await sembrarCarro(page);
      for (const ruta of PAGINAS) {
        await page.goto(ruta, { waitUntil: 'networkidle' });
        const r = await medirDesborde(page);
        expect.soft(r.scrollWidth, `/${ruta} se sale por: ${r.culpables.join(' ')}`).toBeLessThanOrEqual(r.ancho);
      }
    });
  }
}

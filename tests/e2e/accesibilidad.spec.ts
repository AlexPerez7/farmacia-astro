import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { ESQUEMAS, sembrarCarro } from './utilidades';

const PAGINAS = ['', 'productos/', 'productos/amoxicilina-500-mg-21-capsulas/', 'carro/', 'checkout/'];

for (const esquema of ESQUEMAS) {
  for (const ruta of PAGINAS) {
    test(`/${ruta} sin infracciones graves de accesibilidad (tema ${esquema})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: esquema });
      await sembrarCarro(page);
      await page.goto(ruta, { waitUntil: 'networkidle' });
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const graves = violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
      expect(graves).toEqual([]);
    });
  }
}

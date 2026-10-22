import { expect, test } from '@playwright/test';
import productos from '../../src/data/productos.json' with { type: 'json' };
import { ESQUEMAS, abrir } from './utilidades';

const VENTA_DIRECTA = productos.filter((p) => !p.requiereReceta).length;

for (const esquema of ESQUEMAS) {
  test.describe(`tema ${esquema}`, () => {
    test.use({ colorScheme: esquema });
    // Comuna ya confirmada: el aviso de la primera visita no tapa la página.
    test.beforeEach(({ page }) => page.addInitScript(() => localStorage.setItem('pulso:comuna', 'Providencia')));

    test('buscar, filtrar y agregar al carro', async ({ page }) => {
      await abrir(page, 'productos/?q=paracetamol');
      await expect(page.locator('article')).toHaveCount(1);

      // El del header es un combobox; el searchbox es el buscador del catálogo.
      await page.getByRole('searchbox', { name: 'Buscar productos' }).fill('');
      const filtros = page.getByText('Filtros', { exact: true });
      if (await filtros.isVisible()) await filtros.click();
      await page.getByLabel('Solo venta directa (sin receta)').filter({ visible: true }).check();
      await expect(page.locator('article')).toHaveCount(VENTA_DIRECTA);

      const tarjeta = page.locator('article', { hasText: 'Ibuprofeno 400 mg' });
      await tarjeta.getByRole('button', { name: 'Agregar' }).click();
      await expect(tarjeta.getByRole('button', { name: '✓ En el carro' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Carro 1 producto', exact: true })).toBeVisible();
    });

    test('el panel del carro cambia cantidades y respeta el stock', async ({ page }) => {
      // El termómetro tiene 3 unidades en stock.
      await abrir(page, 'productos/termometro-digital/');
      await page.getByRole('button', { name: 'Agregar' }).first().click();
      const panel = page.getByRole('dialog', { name: 'Carro de compras' });
      await expect(panel).toBeVisible();

      const mas = panel.getByRole('button', { name: 'Aumentar cantidad de Termómetro digital' });
      const caja = await mas.boundingBox();
      expect(caja!.width).toBeGreaterThanOrEqual(40);
      expect(caja!.height).toBeGreaterThanOrEqual(40);

      await mas.click();
      await mas.click();
      await expect(panel.getByText('Tu carro (3)')).toBeVisible();
      await expect(mas).toBeDisabled();

      await panel.getByRole('button', { name: 'Quitar' }).click();
      await expect(panel.getByText('Tu carro está vacío.')).toBeVisible();
      await page.keyboard.press('Escape');
      // Al cerrarse, el panel se desliza fuera de la pantalla y queda inerte.
      await expect(panel).not.toBeInViewport();
    });

    test('checkout completo con un producto con receta', async ({ page }) => {
      await abrir(page, 'productos/ibuprofeno-400-mg-20-comprimidos/');
      await page.getByRole('button', { name: 'Agregar' }).first().click();
      await abrir(page, 'productos/amoxicilina-500-mg-21-capsulas/');
      // .first(): los productos relacionados también tienen botones "Reservar".
      await page.getByRole('button', { name: 'Reservar' }).first().click();
      await expect(page.getByRole('dialog', { name: 'Carro de compras' }).getByText(/producto\(s\) con receta/)).toBeVisible();

      await abrir(page, 'checkout/');
      const pagar = page.getByRole('button', { name: /^Pagar/ });
      await pagar.click();
      await expect(page.getByText('El RUT no es válido.')).toBeVisible();
      await expect(page.getByText('Ingresa tu nombre completo.')).toBeVisible();

      await page.getByLabel('Nombre completo').fill('Persona de Prueba');
      await page.getByLabel('RUT').fill('12345678-9');
      await page.getByLabel('Teléfono').fill('+56 9 1234 5678');
      await page.getByLabel('Correo electrónico').fill('prueba@ejemplo.cl');
      await page.getByLabel('Dirección').fill('Calle Falsa 123');
      await page.getByLabel('Comuna').selectOption('Ñuñoa');
      await pagar.click();
      await expect(page.getByText('El RUT no es válido.')).toBeVisible();

      await page.getByLabel('RUT').fill('123456785');
      await page.getByLabel('RUT').blur();
      await expect(page.getByLabel('RUT')).toHaveValue('12.345.678-5');
      await pagar.click();

      await page.waitForURL('**/confirmacion/');
      await expect(page.getByText(/Tu pedido FP-\d{7} fue recibido/)).toBeVisible();
      await expect(page.getByText('Reservado (presenta tu receta en sucursal)')).toBeVisible();
      await expect(page.getByText('1× Amoxicilina 500 mg')).toBeVisible();
      expect(await page.evaluate(() => localStorage.getItem('pulso:carro'))).toBe('[]');
    });
  });
}

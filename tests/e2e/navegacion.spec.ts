import { expect, test, type Page } from '@playwright/test';
import productos from '../../src/data/productos.json' with { type: 'json' };
import { abrir, sembrarCarro } from './utilidades';

const confirmarComuna = (page: Page, comuna = 'Providencia') =>
  page.addInitScript((c) => localStorage.setItem('pulso:comuna', c), comuna);


test.describe('menú de categorías', () => {
  test.beforeEach(({ page }) => confirmarComuna(page));

  test('con teclado: abre, Esc cierra y el foco vuelve al botón', async ({ page }) => {
    await abrir(page);
    const boton = page.getByRole('button', { name: 'Categorías' });
    await boton.focus();
    await page.keyboard.press('Enter');
    await expect(boton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('button', { name: 'Medicamentos', exact: true })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(boton).toHaveAttribute('aria-expanded', 'false');
    await expect(boton).toBeFocused();
    await expect(page.locator('#menu-categorias')).toBeHidden();
  });

  test('con mouse: lleva a una subcategoría ya filtrada', async ({ page }) => {
    await abrir(page);
    await page.getByRole('button', { name: 'Categorías' }).click();
    await page.getByRole('button', { name: 'Dermocosmética', exact: true }).hover();
    await page.getByRole('link', { name: /^Protección solar/ }).click();

    await page.waitForURL('**/categoria/dermocosmetica/?sub=*');
    await expect(page.getByLabel('Protección solar').filter({ visible: true })).toBeChecked();
    const esperados = productos.filter((p) => p.subcategoria === 'Protección solar').length;
    await expect(page.locator('article')).toHaveCount(esperados);
  });
});

test.describe('buscador con sugerencias', () => {
  test.beforeEach(({ page }) => confirmarComuna(page));

  test('flechas y Enter abren el producto sugerido', async ({ page }) => {
    await abrir(page);
    const buscador = page.getByRole('combobox', { name: 'Buscar productos' });
    await buscador.fill('paracetamol');
    const opcion = page.getByRole('option', { name: /Paracetamol/ });
    await expect(opcion).toBeVisible();

    await buscador.press('ArrowDown');
    await expect(opcion).toHaveAttribute('aria-selected', 'true');
    await expect(buscador).toHaveAttribute('aria-activedescendant', (await opcion.getAttribute('id'))!);
    await buscador.press('Enter');
    await page.waitForURL('**/productos/paracetamol-*/');
  });

  test('Enter sin selección busca en el catálogo', async ({ page }) => {
    await abrir(page);
    const buscador = page.getByRole('combobox', { name: 'Buscar productos' });
    await buscador.fill('protector');
    await buscador.press('Enter');
    await page.waitForURL('**/productos/?q=protector');
    await expect(buscador).toHaveValue('protector');
  });

  test('Esc cierra las sugerencias', async ({ page }) => {
    await abrir(page);
    const buscador = page.getByRole('combobox', { name: 'Buscar productos' });
    await buscador.fill('vitamina');
    await expect(buscador).toHaveAttribute('aria-expanded', 'true');
    await buscador.press('Escape');
    await expect(buscador).toHaveAttribute('aria-expanded', 'false');
  });
});

test('la comuna asignada se puede cambiar y llega al producto y al checkout', async ({ page }) => {
  await sembrarCarro(page);
  await abrir(page);
  const aviso = page.getByRole('status').filter({ hasText: 'Te asignamos Providencia' });
  await expect(aviso).toBeVisible();
  await aviso.getByRole('button', { name: 'Cambiar' }).click();

  await page.getByLabel('¿Dónde recibes tu pedido?').selectOption('Maipú');
  await page.getByRole('button', { name: 'Guardar comuna' }).click();
  await expect(page.getByRole('button', { name: /Maipú/ })).toBeVisible();
  await expect(aviso).toBeHidden();

  await abrir(page, 'productos/omega-3-90-capsulas/');
  await expect(page.getByText(/Llega .+ a Maipú/)).toBeVisible();
  await expect(page.getByText(/en Sucursal Maipú/)).toBeVisible();

  await abrir(page, 'checkout/');
  await expect(page.getByLabel('Comuna', { exact: true })).toHaveValue('Maipú');
});

test('el seguimiento muestra el pedido recién hecho', async ({ page }) => {
  await confirmarComuna(page, 'Ñuñoa');
  await sembrarCarro(page);
  await abrir(page, 'checkout/');
  await page.getByLabel('Nombre completo').fill('Persona de Prueba');
  await page.getByLabel('RUT').fill('12.345.678-5');
  await page.getByLabel('Teléfono').fill('+56 9 1234 5678');
  await page.getByLabel('Correo electrónico').fill('prueba@ejemplo.cl');
  await page.getByLabel('Dirección').fill('Calle Falsa 123');
  await page.getByRole('button', { name: /^Pagar/ }).click();

  await page.waitForURL('**/confirmacion/');
  const numero = (await page.getByText(/Tu pedido FP-\d{7}/).textContent())!.match(/FP-\d{7}/)![0];
  await page.getByRole('link', { name: 'Seguir mi pedido' }).click();

  await page.waitForURL('**/seguimiento/?pedido=*');
  await expect(page.getByRole('heading', { name: `Pedido ${numero}` })).toBeVisible();
  await expect(page.getByText('Calle Falsa 123, Ñuñoa')).toBeVisible();
  await expect(page.locator('[aria-current="step"]')).toContainText('Pedido recibido');

  // Un número que no existe en este navegador.
  await page.getByLabel('Número de pedido').fill('FP-0000000');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByText('No encontramos el pedido')).toBeVisible();
});

test('favoritos se guardan y se cuentan en el header', async ({ page }) => {
  await confirmarComuna(page);
  await abrir(page, 'productos/omega-3-90-capsulas/');
  await page.getByRole('button', { name: 'Guardar en favoritos' }).click();
  await expect(page.getByRole('button', { name: 'En favoritos' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Favoritos 1 producto' })).toBeVisible();

  await abrir(page, 'favoritos/');
  await expect(page.locator('article')).toHaveCount(1);
  await expect(page.locator('article')).toContainText('Omega 3 1000 mg');
});

test('la barra de avisos se cierra y no vuelve al recargar', async ({ page }) => {
  await confirmarComuna(page);
  await abrir(page);
  const barra = page.getByRole('list', { name: 'Avisos' });
  await expect(barra).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar avisos' }).click();
  await expect(barra).toBeHidden();
  await page.reload();
  await expect(barra).toBeHidden();
});

test('sucursales muestra si están abiertas', async ({ page }) => {
  await confirmarComuna(page);
  await abrir(page, 'sucursales/');
  await expect(page.getByRole('heading', { name: 'Sucursal Providencia' })).toBeVisible();
  // La de Providencia es de 24 horas: siempre abierta, sin importar la hora del test.
  await expect(page.getByText('Abierta las 24 horas')).toBeVisible();
});

test.describe('en el celular', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('el menú es un panel lateral con subcategorías en acordeón', async ({ page }) => {
    await confirmarComuna(page);
    await abrir(page);
    await page.getByRole('button', { name: 'Categorías' }).click();
    const panel = page.locator('#menu-categorias');
    await expect(panel).toBeInViewport();
    const caja = (await panel.boundingBox())!;
    expect(caja.x).toBe(0);
    expect(caja.width).toBeLessThan(375);

    await panel.getByRole('button', { name: 'Vitaminas y suplementos' }).click();
    await expect(panel.getByRole('link', { name: 'Minerales' })).toBeVisible();
    await panel.getByRole('button', { name: 'Cerrar menú' }).click();
    await expect(panel).toBeHidden();
  });
});

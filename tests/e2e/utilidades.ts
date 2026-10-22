import { expect, type Page } from '@playwright/test';

export const PAGINAS = [
  '',
  'productos/',
  'productos/amoxicilina-500-mg-21-capsulas/',
  'productos/omega-3-90-capsulas/',
  'categoria/vitaminas/',
  'carro/',
  'checkout/',
  'confirmacion/',
  'seguimiento/',
  'sucursales/',
  'favoritos/',
  'ayuda/',
  'terminos/',
  'privacidad/',
  'no-existe/',
];

export const ESQUEMAS = ['light', 'dark'] as const;

// Un producto de venta directa y uno con receta, para que carro y checkout muestren contenido real.
export const CARRO_DE_EJEMPLO = [
  { id: 'omega-3-90-capsulas', nombre: 'Omega 3 1000 mg', laboratorio: 'Mar Austral', categoria: 'vitaminas', presentacion: '90 cápsulas blandas', precio: 12990, stock: 25, requiereReceta: false, cantidad: 2 },
  { id: 'amoxicilina-500-mg-21-capsulas', nombre: 'Amoxicilina 500 mg', laboratorio: 'Biofarma Sur', categoria: 'medicamentos', presentacion: '21 cápsulas', precio: 4990, stock: 30, requiereReceta: true, cantidad: 1 },
];

export async function sembrarCarro(page: Page) {
  await page.addInitScript((carro) => localStorage.setItem('pulso:carro', carro), JSON.stringify(CARRO_DE_EJEMPLO));
}

/** Ancho total del documento y los primeros elementos que se salen por la derecha. */
export function medirDesborde(page: Page) {
  return page.evaluate(() => {
    const ancho = innerWidth;
    const culpables = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const caja = el.getBoundingClientRect();
        // La barra de categorías se desplaza en horizontal a propósito; el panel del carro cerrado está fuera de pantalla.
        return caja.width > 0 && caja.right > ancho + 1 && !el.closest('[inert], ul.overflow-x-auto');
      })
      .slice(0, 3)
      .map((el) => `<${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 80)}">`);
    return { scrollWidth: document.documentElement.scrollWidth, ancho, culpables };
  });
}

/** Abre una ruta y espera a que se hidraten las islas que se pueden usar de inmediato (no las client:visible). */
export async function abrir(page: Page, ruta = '') {
  await page.goto(ruta);
  await expect(page.locator('astro-island[ssr]:not([client="visible"])')).toHaveCount(0);
}

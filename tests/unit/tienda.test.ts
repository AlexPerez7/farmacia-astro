import { describe, expect, it } from 'vitest';
import { COSTO_ENVIO, ENVIO_GRATIS_DESDE, clp, costoEnvio } from '../../src/lib/tienda';
import { descuento } from '../../src/lib/tipos';
import { url } from '../../src/lib/url';

describe('costoEnvio', () => {
  it('es gratis con el carro vacío (no hay nada que despachar)', () => {
    expect(costoEnvio(0)).toBe(0);
  });

  it('cobra justo bajo el umbral', () => {
    expect(costoEnvio(ENVIO_GRATIS_DESDE - 1)).toBe(COSTO_ENVIO);
  });

  it('es gratis desde el umbral', () => {
    expect(costoEnvio(ENVIO_GRATIS_DESDE)).toBe(0);
    expect(costoEnvio(ENVIO_GRATIS_DESDE + 10000)).toBe(0);
  });
});

describe('clp', () => {
  it('formatea pesos chilenos con punto de miles y sin decimales', () => {
    expect(clp(25000)).toMatch(/^\$\s?25\.000$/);
    expect(clp(1290)).toMatch(/^\$\s?1\.290$/);
  });
});

describe('descuento', () => {
  it('es 0 sin precio anterior', () => {
    expect(descuento({ precio: 1000 })).toBe(0);
  });

  it('redondea el porcentaje', () => {
    expect(descuento({ precio: 2190, precioAnterior: 2690 })).toBe(19);
    expect(descuento({ precio: 3990, precioAnterior: 4990 })).toBe(20);
  });
});

describe('url', () => {
  it('antepone la base del sitio', () => {
    expect(url('')).toBe('/farmacia-astro/');
    expect(url('productos/')).toBe('/farmacia-astro/productos/');
  });

  it('no duplica la barra si la ruta empieza con /', () => {
    expect(url('/productos/')).toBe('/farmacia-astro/productos/');
  });
});

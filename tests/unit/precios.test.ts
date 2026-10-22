import { describe, expect, it } from 'vitest';
import { precioPorUnidad } from '../../src/lib/precios';

describe('precioPorUnidad', () => {
  it('divide por unidad de venta', () => {
    expect(precioPorUnidad(1290, 16, 'comprimido')).toEqual({ valor: 81, etiqueta: 'x comprimido' });
  });

  it('expresa ml por litro y g por kilo', () => {
    expect(precioPorUnidad(8990, 200, 'ml')).toEqual({ valor: 44950, etiqueta: 'x litro' });
    expect(precioPorUnidad(2500, 50, 'g')).toEqual({ valor: 50000, etiqueta: 'x kilo' });
  });
});

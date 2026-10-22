import { describe, expect, it } from 'vitest';
import productos from '../../src/data/productos.json';
import { MAX_SUGERENCIAS, crearBuscador, normalizar, type ProductoBuscable } from '../../src/lib/busqueda';

// El JSON crudo trae la categoría como string; el esquema de Astro es el que la valida.
const buscar = crearBuscador(productos as ProductoBuscable[]);

describe('sugerencias del buscador', () => {
  it('no sugiere con menos de 2 letras', () => {
    expect(buscar('a')).toEqual({ categorias: [], productos: [] });
  });

  it('encuentra categorías sin importar tildes', () => {
    expect(normalizar(' Bebé ')).toBe('bebe');
    expect(buscar('bebe').categorias.map((c) => c.id)).toEqual(['bebe-y-mama']);
  });

  it('encuentra productos por nombre y limita la lista', () => {
    expect(buscar('paracetamol').productos[0].nombre).toMatch(/Paracetamol/);
    expect(buscar('crema').productos.length).toBeLessThanOrEqual(MAX_SUGERENCIAS);
  });
});

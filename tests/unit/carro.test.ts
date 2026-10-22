import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProductoCarro } from '../../src/stores/carro';

// El store lee localStorage al cargarse, así que cada test importa una copia nueva del módulo.
async function cargarCarro() {
  vi.resetModules();
  return import('../../src/stores/carro');
}

const directo: ProductoCarro = {
  id: 'paracetamol',
  nombre: 'Paracetamol 500 mg',
  laboratorio: 'Laboratorio Andes',
  categoria: 'medicamentos',
  presentacion: '16 comprimidos',
  precio: 1290,
  stock: 5,
  requiereReceta: false,
};
const conReceta: ProductoCarro = { ...directo, id: 'amoxicilina', nombre: 'Amoxicilina 500 mg', precio: 4990, stock: 30, requiereReceta: true };

beforeEach(() => {
  localStorage.clear();
});

describe('acciones del carro', () => {
  it('agregar el mismo producto suma cantidades', async () => {
    const c = await cargarCarro();
    c.agregar(directo);
    c.agregar(directo, 2);
    expect(c.$carro.get()).toHaveLength(1);
    expect(c.$carro.get()[0].cantidad).toBe(3);
  });

  it('no supera el stock al agregar', async () => {
    const c = await cargarCarro();
    c.agregar(directo, 10);
    expect(c.$carro.get()[0].cantidad).toBe(5);
    c.agregar(directo, 1);
    expect(c.$carro.get()[0].cantidad).toBe(5);
  });

  it('no supera el stock al cambiar la cantidad', async () => {
    const c = await cargarCarro();
    c.agregar(directo);
    c.cambiarCantidad(directo.id, 99);
    expect(c.$carro.get()[0].cantidad).toBe(5);
  });

  it('cambiar la cantidad a 0 quita el producto', async () => {
    const c = await cargarCarro();
    c.agregar(directo);
    c.cambiarCantidad(directo.id, 0);
    expect(c.$carro.get()).toEqual([]);
  });

  it('quitar y vaciar', async () => {
    const c = await cargarCarro();
    c.agregar(directo);
    c.agregar(conReceta);
    c.quitar(directo.id);
    expect(c.$carro.get().map((i) => i.id)).toEqual(['amoxicilina']);
    c.vaciar();
    expect(c.$carro.get()).toEqual([]);
  });
});

describe('$resumen', () => {
  it('separa la venta en línea de las reservas con receta', async () => {
    const c = await cargarCarro();
    c.agregar(directo, 2);
    c.agregar(conReceta);
    const r = c.$resumen.get();
    expect(r.unidades).toBe(3);
    expect(r.directos.map((i) => i.id)).toEqual(['paracetamol']);
    expect(r.conReceta.map((i) => i.id)).toEqual(['amoxicilina']);
    expect(r.subtotal).toBe(2580);
    expect(r.subtotalReceta).toBe(4990);
  });

  it('el envío se calcula solo sobre la venta en línea', async () => {
    const c = await cargarCarro();
    c.agregar({ ...conReceta, precio: 50000 });
    expect(c.$resumen.get().envio).toBe(0); // nada que despachar
    c.agregar(directo);
    expect(c.$resumen.get().envio).toBeGreaterThan(0); // $1.290 no alcanza el despacho gratis
  });
});

describe('persistencia', () => {
  it('guarda el carro en localStorage y lo recupera al recargar', async () => {
    const c = await cargarCarro();
    c.agregar(directo, 2);
    expect(JSON.parse(localStorage.getItem('pulso:carro')!)).toHaveLength(1);
    const recargado = await cargarCarro();
    expect(recargado.$carro.get()[0]).toMatchObject({ id: 'paracetamol', cantidad: 2 });
  });

  it('un valor corrupto en localStorage deja el carro vacío sin error', async () => {
    localStorage.setItem('pulso:carro', '{no es json');
    const c = await cargarCarro();
    expect(c.$carro.get()).toEqual([]);
  });
});

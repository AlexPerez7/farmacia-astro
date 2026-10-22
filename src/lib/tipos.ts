import type { CollectionEntry } from 'astro:content';

export type Producto = { id: string } & CollectionEntry<'productos'>['data'];

export const aProducto = (entrada: CollectionEntry<'productos'>): Producto => ({ id: entrada.id, ...entrada.data });

export const descuento = (p: Pick<Producto, 'precio' | 'precioAnterior'>) =>
  p.precioAnterior ? Math.round((1 - p.precio / p.precioAnterior) * 100) : 0;

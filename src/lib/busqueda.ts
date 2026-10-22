import Fuse, { type IFuseOptions } from 'fuse.js';
import { CATEGORIAS } from './categorias';
import type { Producto } from './tipos';

/** Mismas opciones en el catálogo y en las sugerencias del header. */
export const OPCIONES_FUSE: IFuseOptions<Pick<Producto, 'nombre' | 'principioActivo' | 'laboratorio' | 'descripcion'>> = {
  keys: [{ name: 'nombre', weight: 3 }, { name: 'principioActivo', weight: 2 }, 'laboratorio', 'descripcion'],
  threshold: 0.35,
  ignoreLocation: true,
};

export const MAX_SUGERENCIAS = 5;

/** Minúsculas y sin tildes, para comparar "bebe" con "Bebé". */
export const normalizar = (texto: string) => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

export type ProductoBuscable = Pick<Producto, 'id' | 'nombre' | 'laboratorio' | 'principioActivo' | 'descripcion' | 'precio' | 'categoria'>;

export function crearBuscador<T extends ProductoBuscable>(productos: T[]) {
  const fuse = new Fuse(productos, OPCIONES_FUSE as IFuseOptions<T>);
  return (consulta: string) => {
    const q = normalizar(consulta);
    if (q.length < 2) return { categorias: [], productos: [] };
    return {
      categorias: CATEGORIAS.filter((c) => normalizar(c.nombre).includes(q)),
      productos: fuse.search(consulta.trim(), { limit: MAX_SUGERENCIAS }).map((r) => r.item),
    };
  };
}

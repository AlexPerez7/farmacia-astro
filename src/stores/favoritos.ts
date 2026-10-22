import { atom } from 'nanostores';

const CLAVE = 'pulso:favoritos';

function leer(): string[] {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as string[]) : [];
  } catch {
    return [];
  }
}

/** Ids de producto guardados, el más reciente primero. */
export const $favoritos = atom<string[]>(typeof window === 'undefined' ? [] : leer());

export function alternarFavorito(id: string) {
  const actual = $favoritos.get();
  const lista = actual.includes(id) ? actual.filter((f) => f !== id) : [id, ...actual];
  $favoritos.set(lista);
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    // Sin almacenamiento: los favoritos duran hasta recargar.
  }
}

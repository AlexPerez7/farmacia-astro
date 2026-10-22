import { atom } from 'nanostores';
import { COMUNA_POR_DEFECTO, comunaPorNombre } from '../lib/comunas';

const CLAVE = 'pulso:comuna';

function leer(): { nombre: string; confirmada: boolean } {
  try {
    const guardada = localStorage.getItem(CLAVE);
    if (guardada && comunaPorNombre(guardada)) return { nombre: guardada, confirmada: true };
  } catch {
    // Sin almacenamiento: se usa la comuna por defecto.
  }
  return { nombre: COMUNA_POR_DEFECTO, confirmada: false };
}

const inicial = typeof window === 'undefined' ? { nombre: COMUNA_POR_DEFECTO, confirmada: true } : leer();

export const $comuna = atom(inicial.nombre);
/** false en la primera visita: se muestra el aviso "te asignamos esta comuna". */
export const $comunaConfirmada = atom(inicial.confirmada);

export function elegirComuna(nombre: string) {
  if (!comunaPorNombre(nombre)) return;
  $comuna.set(nombre);
  $comunaConfirmada.set(true);
  try {
    localStorage.setItem(CLAVE, nombre);
  } catch {
    // Sin almacenamiento: la comuna dura hasta recargar.
  }
}

export const mantenerComuna = () => elegirComuna($comuna.get());

/** Abre el selector de comuna del header desde otras islas (p. ej. "Cambiar" en la página de producto). */
export const $selectorComunaAbierto = atom(false);

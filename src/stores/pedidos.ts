import { atom } from 'nanostores';
import { normalizarNumero, type Pedido } from '../lib/pedidos';

const CLAVE = 'pulso:pedidos';
const MAXIMO = 10;

function leer(): Pedido[] {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Pedido[]) : [];
  } catch {
    return [];
  }
}

export const $pedidos = atom<Pedido[]>(typeof window === 'undefined' ? [] : leer());

/** Guarda el pedido al inicio del historial (máximo 10). */
export function registrarPedido(pedido: Pedido) {
  const lista = [pedido, ...$pedidos.get().filter((p) => p.numero !== pedido.numero)].slice(0, MAXIMO);
  $pedidos.set(lista);
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    // Sin almacenamiento: el historial dura hasta recargar.
  }
}

export const buscarPedido = (numero: string) => $pedidos.get().find((p) => p.numero === normalizarNumero(numero));

import type { ItemCarro } from '../stores/carro';

export type Pedido = {
  numero: string;
  fecha: string;
  nombre: string;
  email: string;
  entrega: 'despacho' | 'retiro';
  destino: string;
  items: ItemCarro[];
  reservas: ItemCarro[];
  subtotal: number;
  envio: number;
  total: number;
};

const ETAPAS = {
  despacho: ['Pedido recibido', 'En preparación', 'En camino', 'Entregado'],
  retiro: ['Pedido recibido', 'En preparación', 'Listo para retiro', 'Retirado'],
};
/** Minutos desde la compra en que empieza cada etapa (seguimiento simulado). */
export const MINUTOS_ETAPA = [0, 2, 10, 30];

export function etapasDe(pedido: Pick<Pedido, 'entrega'>) {
  return ETAPAS[pedido.entrega];
}

/** Índice de la etapa actual según el tiempo transcurrido desde la compra. */
export function etapaActual(pedido: Pick<Pedido, 'fecha'>, ahora: Date) {
  const minutos = (ahora.getTime() - new Date(pedido.fecha).getTime()) / 60_000;
  let etapa = 0;
  MINUTOS_ETAPA.forEach((desde, i) => {
    if (minutos >= desde) etapa = i;
  });
  return etapa;
}

export const normalizarNumero = (numero: string) => numero.trim().toUpperCase().replace(/\s+/g, '');

/** sessionStorage: el último pedido, para la página de confirmación. */
export const CLAVE_PEDIDO = 'pulso:ultimo-pedido';

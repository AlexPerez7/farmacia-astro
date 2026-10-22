import { beforeEach, describe, expect, it, vi } from 'vitest';
import { etapaActual, etapasDe, normalizarNumero, type Pedido } from '../../src/lib/pedidos';

const pedido = (numero: string, fecha = '2026-10-21T12:00:00.000Z'): Pedido => ({
  numero,
  fecha,
  nombre: 'Persona de Prueba',
  email: 'prueba@ejemplo.cl',
  entrega: 'despacho',
  destino: 'Calle Falsa 123, Ñuñoa',
  items: [],
  reservas: [],
  subtotal: 0,
  envio: 0,
  total: 0,
});

describe('etapas del seguimiento', () => {
  const base = pedido('FP-0000001');
  const minutos = (m: number) => new Date(new Date(base.fecha).getTime() + m * 60_000);

  it('avanza con los minutos desde la compra', () => {
    expect(etapaActual(base, minutos(0))).toBe(0);
    expect(etapaActual(base, minutos(1.9))).toBe(0);
    expect(etapaActual(base, minutos(2))).toBe(1);
    expect(etapaActual(base, minutos(10))).toBe(2);
    expect(etapaActual(base, minutos(600))).toBe(3);
  });

  it('las etapas dependen del tipo de entrega', () => {
    expect(etapasDe({ entrega: 'despacho' })[2]).toBe('En camino');
    expect(etapasDe({ entrega: 'retiro' })[2]).toBe('Listo para retiro');
  });

  it('normaliza el número ingresado', () => {
    expect(normalizarNumero('  fp- 1234567 ')).toBe('FP-1234567');
  });
});

describe('store de pedidos', () => {
  beforeEach(() => localStorage.clear());
  const cargar = async () => {
    vi.resetModules();
    return import('../../src/stores/pedidos');
  };

  it('guarda el más reciente primero, sin duplicados y hasta 10', async () => {
    const s = await cargar();
    for (let i = 1; i <= 12; i++) s.registrarPedido(pedido(`FP-${i}`));
    s.registrarPedido(pedido('FP-12'));
    const lista = s.$pedidos.get();
    expect(lista).toHaveLength(10);
    expect(lista[0].numero).toBe('FP-12');
    expect(lista.filter((p) => p.numero === 'FP-12')).toHaveLength(1);
    expect(s.buscarPedido('fp-11')?.numero).toBe('FP-11');
  });

  it('el historial sobrevive a una recarga', async () => {
    (await cargar()).registrarPedido(pedido('FP-7'));
    const s = await cargar();
    expect(s.$pedidos.get().map((p) => p.numero)).toEqual(['FP-7']);
  });
});

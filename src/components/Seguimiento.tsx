import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $pedidos } from '../stores/pedidos';
import { etapaActual, etapasDe, normalizarNumero, type Pedido } from '../lib/pedidos';
import { clp } from '../lib/tienda';
import { url } from '../lib/url';

/** Seguimiento simulado: busca el pedido en el historial del navegador y muestra su etapa según el tiempo transcurrido. */
export default function Seguimiento() {
  const pedidos = useStore($pedidos);
  const [numero, setNumero] = useState('');
  const [buscado, setBuscado] = useState('');
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    const n = new URLSearchParams(location.search).get('pedido');
    if (n) {
      setNumero(n);
      setBuscado(normalizarNumero(n));
    }
    const reloj = setInterval(() => setAhora(new Date()), 30_000);
    return () => clearInterval(reloj);
  }, []);

  const pedido = buscado ? pedidos.find((p) => p.numero === buscado) : undefined;

  function ver(n: string) {
    setNumero(n);
    setBuscado(normalizarNumero(n));
    history.replaceState(null, '', `${location.pathname}?pedido=${encodeURIComponent(normalizarNumero(n))}`);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ver(numero);
          }}
          className="rounded-2xl border border-borde bg-superficie p-5"
        >
          <label htmlFor="campo-pedido" className="mb-1 block text-sm font-medium">
            Número de pedido
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="campo-pedido"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="FP-1234567"
              className="w-full flex-1 rounded-lg border border-borde-fuerte bg-superficie px-3 py-2.5 text-base uppercase outline-none focus:border-marca-600 focus:ring-2 focus:ring-acento-suave"
            />
            <button type="submit" className="rounded-lg bg-marca-700 px-5 py-2.5 font-semibold text-white hover:bg-marca-800">
              Buscar
            </button>
          </div>
          <p className="mt-2 text-xs text-tenue">El número aparece en la confirmación de compra. En esta demo los pedidos se guardan solo en este navegador.</p>
        </form>

        <div aria-live="polite">
          {buscado && !pedido && (
            <p className="rounded-2xl border border-dashed border-borde-fuerte p-6 text-center text-texto-2">
              No encontramos el pedido <strong>{buscado}</strong> en este navegador.
            </p>
          )}
          {pedido && <DetallePedido pedido={pedido} ahora={ahora} />}
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-borde bg-superficie p-5">
        <h2 className="font-bold">Tus pedidos recientes</h2>
        {pedidos.length === 0 ? (
          <p className="mt-2 text-sm text-texto-2">
            Aún no tienes pedidos.{' '}
            <a href={url('productos/')} className="font-semibold text-acento hover:underline">
              Ir a la tienda
            </a>
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {pedidos.map((p) => (
              <li key={p.numero}>
                <button
                  type="button"
                  onClick={() => ver(p.numero)}
                  aria-current={p.numero === buscado ? 'true' : undefined}
                  className="flex w-full justify-between gap-2 rounded-lg border border-borde px-3 py-2 text-left hover:bg-superficie-2 aria-[current]:border-marca-600 aria-[current]:bg-acento-suave"
                >
                  <span className="font-semibold">{p.numero}</span>
                  <span className="text-texto-2">{new Date(p.fecha).toLocaleDateString('es-CL')}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

function DetallePedido({ pedido, ahora }: { pedido: Pedido; ahora: Date }) {
  const etapas = etapasDe(pedido);
  const actual = etapaActual(pedido, ahora);
  return (
    <section className="rounded-2xl border border-borde bg-superficie p-5" aria-labelledby="titulo-pedido">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="titulo-pedido" className="text-lg font-bold">
          Pedido {pedido.numero}
        </h2>
        <p className="text-sm text-texto-2">{new Date(pedido.fecha).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })}</p>
      </div>
      <p className="mt-1 text-sm text-texto-2">
        {pedido.entrega === 'despacho' ? 'Despacho a' : 'Retiro en'} {pedido.destino}
      </p>

      <ol className="mt-6 space-y-0">
        {etapas.map((etapa, i) => {
          const estado = i < actual ? 'hecha' : i === actual ? 'actual' : 'pendiente';
          return (
            <li key={etapa} className="relative flex gap-3 pb-6 last:pb-0" aria-current={estado === 'actual' ? 'step' : undefined}>
              {i < etapas.length - 1 && (
                <span className={`absolute left-[11px] top-6 h-[calc(100%-24px)] w-0.5 ${i < actual ? 'bg-marca-600' : 'bg-borde-fuerte'}`} aria-hidden="true" />
              )}
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                  estado === 'pendiente' ? 'border-2 border-borde-fuerte text-tenue' : 'bg-marca-700 text-white'
                }`}
                aria-hidden="true"
              >
                {estado === 'hecha' ? '✓' : i + 1}
              </span>
              <span>
                <span className={`block font-semibold ${estado === 'pendiente' ? 'text-tenue' : 'text-texto'}`}>{etapa}</span>
                <span className="text-sm text-tenue">{estado === 'hecha' ? 'Completado' : estado === 'actual' ? 'Etapa actual' : 'Pendiente'}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 border-t border-borde pt-4 text-sm text-texto-2">
        {pedido.items.length + pedido.reservas.length} {pedido.items.length + pedido.reservas.length === 1 ? 'producto' : 'productos'} · Total pagado{' '}
        <strong className="text-texto">{clp(pedido.total)}</strong>
      </p>
      <p className="mt-2 text-xs text-tenue">Estado simulado: avanza solo con el tiempo transcurrido desde la compra.</p>
    </section>
  );
}

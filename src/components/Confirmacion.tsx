import { useEffect, useState } from 'react';
import { CLAVE_PEDIDO, type Pedido } from '../lib/pedidos';
import { clp } from '../lib/tienda';
import { url } from '../lib/url';

export default function Confirmacion() {
  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    try {
      const crudo = sessionStorage.getItem(CLAVE_PEDIDO);
      if (crudo) setPedido(JSON.parse(crudo));
    } catch {
      // Sin almacenamiento: se muestra el mensaje genérico.
    }
  }, []);

  if (!pedido) {
    return (
      <div className="rounded-2xl border border-borde bg-superficie p-10 text-center">
        <p className="text-texto-2">No encontramos un pedido reciente.</p>
        <a href={url('productos/')} className="mt-4 inline-block font-semibold text-acento hover:underline">
          Ir a la tienda
        </a>
      </div>
    );
  }

  const fecha = new Date(pedido.fecha).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-superficie p-8 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-400/15 text-2xl text-emerald-700 dark:text-emerald-300">✓</div>
        <h1 className="text-2xl font-bold">¡Gracias, {pedido.nombre.split(' ')[0]}!</h1>
        <p className="mt-2 text-texto-2">
          Tu pedido <strong>{pedido.numero}</strong> fue recibido el {fecha}.
        </p>
        <p className="text-sm text-tenue">Enviaríamos la confirmación a {pedido.email} (es una demo, no se envía nada).</p>
      </div>

      <div className="rounded-2xl border border-borde bg-superficie p-6">
        <h2 className="font-bold">{pedido.entrega === 'despacho' ? 'Despacho a' : 'Retiro en'}</h2>
        <p className="text-texto-2">{pedido.destino}</p>

        {pedido.items.length > 0 && (
          <>
            <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-tenue">Pagado en línea</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {pedido.items.map((i) => (
                <li key={i.id} className="flex justify-between">
                  <span>
                    {i.cantidad}× {i.nombre}
                  </span>
                  <span className="tabular-nums">{clp(i.precio * i.cantidad)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {pedido.reservas.length > 0 && (
          <>
            <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-aviso-texto">Reservado (presenta tu receta en sucursal)</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {pedido.reservas.map((i) => (
                <li key={i.id} className="flex justify-between">
                  <span>
                    {i.cantidad}× {i.nombre}
                  </span>
                  <span className="tabular-nums">{clp(i.precio * i.cantidad)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <dl className="mt-5 space-y-1 border-t border-borde pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-texto-2">Despacho</dt>
            <dd>{pedido.envio === 0 ? 'Gratis' : clp(pedido.envio)}</dd>
          </div>
          <div className="flex justify-between text-base font-bold">
            <dt>Total pagado</dt>
            <dd className="tabular-nums">{clp(pedido.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a href={url(`seguimiento/?pedido=${pedido.numero}`)} className="rounded-lg bg-marca-700 px-5 py-2.5 font-semibold text-white hover:bg-marca-800">
          Seguir mi pedido
        </a>
        <a href={url('')} className="font-semibold text-acento hover:underline">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

import { useStore } from '@nanostores/react';
import BarraEnvioGratis from './BarraEnvioGratis';
import ItemCarroFila from './ItemCarroFila';
import { $resumen, vaciar } from '../stores/carro';
import { clp } from '../lib/tienda';
import { url } from '../lib/url';

export default function CarroPagina() {
  const r = useStore($resumen);

  if (r.unidades === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-lg text-slate-600">Tu carro está vacío.</p>
        <a href={url('productos/')} className="mt-4 inline-block rounded-lg bg-marca-700 px-5 py-2.5 font-semibold text-white hover:bg-marca-800">
          Explorar productos
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {r.directos.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white px-5">
            <h2 className="border-b border-slate-100 py-4 font-bold">Venta en línea</h2>
            <ul className="divide-y divide-slate-100">
              {r.directos.map((i) => (
                <ItemCarroFila key={i.id} item={i} />
              ))}
            </ul>
          </section>
        )}
        {r.conReceta.length > 0 && (
          <section className="rounded-2xl border border-amber-200 bg-white px-5">
            <div className="border-b border-amber-100 py-4">
              <h2 className="font-bold">Reserva con receta</h2>
              <p className="text-sm text-slate-600">Se retiran y pagan en sucursal presentando la receta médica. No se cobran en línea.</p>
            </div>
            <ul className="divide-y divide-slate-100">
              {r.conReceta.map((i) => (
                <ItemCarroFila key={i.id} item={i} />
              ))}
            </ul>
          </section>
        )}
        <button type="button" onClick={vaciar} className="text-sm font-medium text-slate-500 hover:text-red-600 hover:underline">
          Vaciar carro
        </button>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
        <h2 className="font-bold">Resumen</h2>
        {r.directos.length > 0 && <BarraEnvioGratis subtotal={r.subtotal} />}
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Subtotal en línea</dt>
            <dd className="font-semibold tabular-nums">{clp(r.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Despacho estimado</dt>
            <dd className="font-semibold tabular-nums">{r.envio === 0 ? 'Gratis' : clp(r.envio)}</dd>
          </div>
          {r.conReceta.length > 0 && (
            <div className="flex justify-between text-amber-800">
              <dt>Reserva (se paga en sucursal)</dt>
              <dd className="font-semibold tabular-nums">{clp(r.subtotalReceta)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
            <dt className="font-bold">Total a pagar hoy</dt>
            <dd className="font-bold tabular-nums">{clp(r.subtotal + r.envio)}</dd>
          </div>
        </dl>
        <a href={url('checkout/')} className="block rounded-lg bg-marca-700 px-4 py-3 text-center font-semibold text-white hover:bg-marca-800">
          Continuar al pago
        </a>
      </aside>
    </div>
  );
}

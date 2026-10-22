import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import BarraEnvioGratis from './BarraEnvioGratis';
import ItemCarroFila from './ItemCarroFila';
import { $carro, $carroAbierto, $resumen, cerrarCarro } from '../stores/carro';
import { clp } from '../lib/tienda';
import { url } from '../lib/url';

export default function CarroDrawer() {
  const abierto = useStore($carroAbierto);
  const items = useStore($carro);
  const resumen = useStore($resumen);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cerrarCarro();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [abierto]);

  return (
    <div className={`fixed inset-0 z-50 ${abierto ? '' : 'pointer-events-none'}`} inert={!abierto}>
      <div
        className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-200 ${abierto ? 'opacity-100' : 'opacity-0'}`}
        onClick={cerrarCarro}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Carro de compras"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl outline-none transition-transform duration-300 ease-out ${
          abierto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold">Tu carro ({resumen.unidades})</h2>
          <button type="button" onClick={cerrarCarro} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Cerrar carro">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-slate-500">Tu carro está vacío.</p>
            <a href={url('productos/')} className="font-semibold text-marca-700 hover:underline">
              Ver productos
            </a>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5">
              <div className="pt-4">
                <BarraEnvioGratis subtotal={resumen.subtotal} />
              </div>
              <ul className="divide-y divide-slate-100">
                {items.map((item) => (
                  <ItemCarroFila key={item.id} item={item} />
                ))}
              </ul>
              {resumen.conReceta.length > 0 && (
                <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                  Tienes {resumen.conReceta.length} producto(s) con receta. Se <strong>reservan</strong> y se pagan al retirar en sucursal presentando la
                  receta.
                </p>
              )}
            </div>
            <footer className="space-y-3 border-t border-slate-200 px-5 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal venta en línea</span>
                <span className="font-bold tabular-nums">{clp(resumen.subtotal)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a href={url('carro/')} className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold hover:bg-slate-50">
                  Ver carro
                </a>
                <a href={url('checkout/')} className="rounded-lg bg-marca-700 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-marca-800">
                  Ir a pagar
                </a>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

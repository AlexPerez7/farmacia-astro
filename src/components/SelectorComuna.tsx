import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $comuna, $comunaConfirmada, $selectorComunaAbierto, elegirComuna, mantenerComuna } from '../stores/comuna';
import { COMUNAS } from '../lib/comunas';

/** Comuna de despacho. En la primera visita avisa cuál se asignó por defecto. */
export default function SelectorComuna() {
  const comuna = useStore($comuna);
  const confirmada = useStore($comunaConfirmada);
  const abierto = useStore($selectorComunaAbierto);
  const [eleccion, setEleccion] = useState(comuna);
  const boton = useRef<HTMLButtonElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  const select = useRef<HTMLSelectElement>(null);

  const cerrar = (devolverFoco = true) => {
    $selectorComunaAbierto.set(false);
    if (devolverFoco) boton.current?.focus();
  };

  useEffect(() => {
    if (!abierto) return;
    setEleccion($comuna.get());
    select.current?.focus();
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && cerrar();
    const alPulsar = (e: PointerEvent) => !caja.current?.contains(e.target as Node) && cerrar(false);
    document.addEventListener('keydown', alTeclear);
    document.addEventListener('pointerdown', alPulsar);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.removeEventListener('pointerdown', alPulsar);
    };
  }, [abierto]);

  return (
    <div ref={caja} className="relative">
      <button
        ref={boton}
        type="button"
        aria-expanded={abierto}
        aria-controls="selector-comuna"
        onClick={() => (abierto ? cerrar() : $selectorComunaAbierto.set(true))}
        className="flex items-center gap-1.5 rounded-full py-1 pr-2 text-sm text-texto-2 hover:text-texto"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-acento" aria-hidden="true">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>
          <span className="max-sm:sr-only">Despacho a </span>
          <strong className="font-semibold text-texto">{comuna}</strong>
        </span>
      </button>

      {!confirmada && !abierto && (
        <div role="status" className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-borde bg-superficie p-3 text-sm shadow-lg">
          <p className="text-texto">
            Te asignamos <strong>{comuna}</strong>. ¿Quieres cambiarla?
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={mantenerComuna} className="flex-1 rounded-lg border border-borde-fuerte px-3 py-1.5 font-semibold hover:bg-superficie-2">
              Mantener
            </button>
            <button type="button" onClick={() => $selectorComunaAbierto.set(true)} className="flex-1 rounded-lg bg-marca-700 px-3 py-1.5 font-semibold text-white hover:bg-marca-800">
              Cambiar
            </button>
          </div>
        </div>
      )}

      <div id="selector-comuna" hidden={!abierto} className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-borde bg-superficie p-3 text-sm shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            elegirComuna(eleccion);
            cerrar();
          }}
        >
          <label htmlFor="campo-comuna-header" className="mb-1 block font-medium text-texto">
            ¿Dónde recibes tu pedido?
          </label>
          <select
            ref={select}
            id="campo-comuna-header"
            value={eleccion}
            onChange={(e) => setEleccion(e.target.value)}
            className="w-full rounded-lg border border-borde-fuerte bg-superficie px-3 py-2 text-base"
          >
            {COMUNAS.map((c) => (
              <option key={c.nombre}>{c.nombre}</option>
            ))}
          </select>
          <p className="mt-2 text-xs text-tenue">Usamos la comuna para estimar el despacho y la sucursal de retiro.</p>
          <button type="submit" className="mt-3 w-full rounded-lg bg-marca-700 px-3 py-2 font-semibold text-white hover:bg-marca-800">
            Guardar comuna
          </button>
        </form>
      </div>
    </div>
  );
}

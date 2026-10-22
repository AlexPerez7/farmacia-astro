import { useStore } from '@nanostores/react';
import { $resumen, abrirCarro } from '../stores/carro';

export default function CarroBoton() {
  const { unidades } = useStore($resumen);
  return (
    <button
      type="button"
      onClick={abrirCarro}
      className="relative flex items-center gap-2 rounded-full bg-marca-700 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-800"
      aria-label={`Abrir carro, ${unidades} productos`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      <span className="hidden sm:inline">Carro</span>
      {/* Color fijo a propósito: va sobre el botón de marca, igual en ambos temas. */}
      {unidades > 0 && (
        <span className="grid min-w-5 place-items-center rounded-full bg-white px-1 text-xs font-bold text-marca-800 tabular-nums">{unidades}</span>
      )}
    </button>
  );
}

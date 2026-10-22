import { useEffect, useState } from 'react';
import { abrirCarro, agregar } from '../stores/carro';
import type { Producto } from '../lib/tipos';

type Props = {
  producto: Producto;
  /** Muestra selector de cantidad (página de producto). */
  conCantidad?: boolean;
  compacto?: boolean;
};

export default function AgregarAlCarro({ producto, conCantidad = false, compacto = false }: Props) {
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    if (!agregado) return;
    const t = setTimeout(() => setAgregado(false), 1600);
    return () => clearTimeout(t);
  }, [agregado]);

  if (producto.stock === 0) {
    return (
      <button disabled className="w-full cursor-not-allowed rounded-lg bg-superficie-2 px-4 py-2.5 text-sm font-semibold text-tenue">
        Sin stock
      </button>
    );
  }

  const { id, nombre, laboratorio, categoria, presentacion, precio, stock, requiereReceta } = producto;

  function onAgregar() {
    agregar({ id, nombre, laboratorio, categoria, presentacion, precio, stock, requiereReceta }, cantidad);
    setAgregado(true);
    if (conCantidad) abrirCarro();
  }

  const etiqueta = requiereReceta ? 'Reservar' : 'Agregar';

  return (
    <div className="flex gap-2">
      {conCantidad && (
        <div className="flex items-center rounded-lg border border-borde-fuerte bg-superficie">
          <button
            type="button"
            className="px-3 py-2.5 text-lg leading-none text-texto-2 hover:text-acento disabled:opacity-30"
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            disabled={cantidad <= 1}
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
            {cantidad}
          </span>
          <button
            type="button"
            className="px-3 py-2.5 text-lg leading-none text-texto-2 hover:text-acento disabled:opacity-30"
            onClick={() => setCantidad((c) => Math.min(stock, c + 1))}
            disabled={cantidad >= stock}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={onAgregar}
        className={`flex-1 rounded-lg font-semibold text-white transition-colors active:scale-[0.98] ${
          compacto ? 'px-3 py-2 text-sm' : 'px-4 py-2.5'
        } ${agregado ? 'bg-emerald-600' : requiereReceta ? 'bg-amber-700 hover:bg-amber-800' : 'bg-marca-700 hover:bg-marca-800'}`}
      >
        {agregado ? '✓ En el carro' : etiqueta}
      </button>
    </div>
  );
}

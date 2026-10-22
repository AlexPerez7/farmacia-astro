import ProductoVisual from './ProductoVisual';
import { cambiarCantidad, quitar, type ItemCarro } from '../stores/carro';
import { clp } from '../lib/tienda';
import { url } from '../lib/url';

export default function ItemCarroFila({ item }: { item: ItemCarro }) {
  return (
    <li className="flex gap-3 py-4">
      <a href={url(`productos/${item.id}/`)} className="shrink-0">
        <ProductoVisual categoria={item.categoria} tamano="sm" className="size-16" />
      </a>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <a href={url(`productos/${item.id}/`)} className="font-semibold leading-snug text-texto hover:text-acento">
              {item.nombre}
            </a>
            <p className="truncate text-xs text-tenue">
              {item.laboratorio} · {item.presentacion}
            </p>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">{clp(item.precio * item.cantidad)}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-borde-fuerte bg-superficie text-sm">
            <button
              type="button"
              className="grid min-h-10 min-w-10 place-items-center text-texto-2 hover:text-acento"
              onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
              aria-label={`Disminuir cantidad de ${item.nombre}`}
            >
              −
            </button>
            <span className="w-7 text-center font-semibold tabular-nums">{item.cantidad}</span>
            <button
              type="button"
              className="grid min-h-10 min-w-10 place-items-center text-texto-2 hover:text-acento disabled:opacity-30"
              onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
              disabled={item.cantidad >= item.stock}
              aria-label={`Aumentar cantidad de ${item.nombre}`}
            >
              +
            </button>
          </div>
          <button type="button" onClick={() => quitar(item.id)} className="min-h-10 px-1 text-xs font-medium text-tenue underline-offset-2 hover:text-red-600 dark:hover:text-red-400 hover:underline">
            Quitar
          </button>
        </div>
      </div>
    </li>
  );
}

import AgregarAlCarro from './AgregarAlCarro';
import ProductoVisual from './ProductoVisual';
import { clp } from '../lib/tienda';
import { descuento, type Producto } from '../lib/tipos';
import { url } from '../lib/url';

export default function ProductoCard({ producto }: { producto: Producto }) {
  const enlace = url(`productos/${producto.id}/`);
  const dcto = descuento(producto);

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md">
      <a href={enlace} className="relative block">
        <ProductoVisual categoria={producto.categoria} className="aspect-square" />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {dcto > 0 && <span className="rounded-md bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">-{dcto}%</span>}
          {producto.requiereReceta && (
            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">Requiere receta</span>
          )}
        </div>
      </a>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{producto.laboratorio}</p>
        <h3 className="mt-0.5 font-semibold leading-snug text-slate-900">
          <a href={enlace} className="hover:text-marca-700">
            {producto.nombre}
          </a>
        </h3>
        <p className="text-sm text-slate-500">{producto.presentacion}</p>
        <div className="mt-auto pt-3">
          <p className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">{clp(producto.precio)}</span>
            {producto.precioAnterior && <span className="text-sm text-slate-400 line-through">{clp(producto.precioAnterior)}</span>}
          </p>
          {producto.stock > 0 && producto.stock <= 5 && <p className="text-xs font-medium text-orange-600">¡Últimas {producto.stock} unidades!</p>}
          <div className="mt-2">
            <AgregarAlCarro producto={producto} compacto />
          </div>
        </div>
      </div>
    </article>
  );
}

import { useStore } from '@nanostores/react';
import ProductoCard from './ProductoCard';
import { $favoritos } from '../stores/favoritos';
import type { Producto } from '../lib/tipos';
import { url } from '../lib/url';

export default function ListaFavoritos({ productos }: { productos: Producto[] }) {
  const ids = useStore($favoritos);
  const guardados = ids.map((id) => productos.find((p) => p.id === id)).filter((p): p is Producto => !!p);

  if (guardados.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-borde-fuerte bg-superficie p-12 text-center">
        <p className="text-lg text-texto-2">Aún no guardas productos en favoritos.</p>
        <p className="mt-1 text-sm text-tenue">Usa el corazón en la página de un producto para encontrarlo después.</p>
        <a href={url('productos/')} className="mt-4 inline-block font-semibold text-acento hover:underline">
          Ver productos
        </a>
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-tenue">
        {guardados.length} {guardados.length === 1 ? 'producto guardado' : 'productos guardados'} en este navegador
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {guardados.map((p) => (
          <ProductoCard key={p.id} producto={p} />
        ))}
      </div>
    </>
  );
}

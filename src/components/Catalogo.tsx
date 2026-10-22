import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import ProductoCard from './ProductoCard';
import { CATEGORIAS } from '../lib/categorias';
import { clp } from '../lib/tienda';
import { descuento, type Producto } from '../lib/tipos';

type Orden = 'relevancia' | 'precio-asc' | 'precio-desc' | 'descuento' | 'nombre';

type Props = {
  productos: Producto[];
  /** En las páginas de categoría el filtro de categoría queda fijo. */
  categoriaFija?: string;
};

export default function Catalogo({ productos, categoriaFija }: Props) {
  const precioTope = useMemo(() => Math.max(...productos.map((p) => p.precio)), [productos]);
  const laboratorios = useMemo(() => [...new Set(productos.map((p) => p.laboratorio))].sort(), [productos]);

  const [busqueda, setBusqueda] = useState('');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [labs, setLabs] = useState<string[]>([]);
  const [precioMax, setPrecioMax] = useState(precioTope);
  const [soloDirecta, setSoloDirecta] = useState(false);
  const [soloStock, setSoloStock] = useState(false);
  const [orden, setOrden] = useState<Orden>('relevancia');

  // La búsqueda del header llega como ?q=...
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q) setBusqueda(q);
  }, []);

  // Refleja la búsqueda en la URL para poder compartirla.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (busqueda) params.set('q', busqueda);
    else params.delete('q');
    const qs = params.toString();
    history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}`);
  }, [busqueda]);

  const fuse = useMemo(
    () =>
      new Fuse(productos, {
        keys: [
          { name: 'nombre', weight: 3 },
          { name: 'principioActivo', weight: 2 },
          'laboratorio',
          'descripcion',
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [productos],
  );

  const resultado = useMemo(() => {
    let lista = busqueda.trim() ? fuse.search(busqueda.trim()).map((r) => r.item) : productos;
    lista = lista.filter(
      (p) =>
        (categorias.length === 0 || categorias.includes(p.categoria)) &&
        (labs.length === 0 || labs.includes(p.laboratorio)) &&
        p.precio <= precioMax &&
        (!soloDirecta || !p.requiereReceta) &&
        (!soloStock || p.stock > 0),
    );
    const ordenada = [...lista];
    if (orden === 'precio-asc') ordenada.sort((a, b) => a.precio - b.precio);
    if (orden === 'precio-desc') ordenada.sort((a, b) => b.precio - a.precio);
    if (orden === 'descuento') ordenada.sort((a, b) => descuento(b) - descuento(a));
    if (orden === 'nombre') ordenada.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    return ordenada;
  }, [busqueda, fuse, productos, categorias, labs, precioMax, soloDirecta, soloStock, orden]);

  const alternar = (lista: string[], valor: string) => (lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);

  const hayFiltros = busqueda || categorias.length || labs.length || precioMax < precioTope || soloDirecta || soloStock;
  function limpiar() {
    setBusqueda('');
    setCategorias([]);
    setLabs([]);
    setPrecioMax(precioTope);
    setSoloDirecta(false);
    setSoloStock(false);
  }

  const filtros = (
    <div className="space-y-6 text-sm">
      {!categoriaFija && (
        <fieldset>
          <legend className="mb-2 font-semibold text-texto">Categoría</legend>
          <div className="space-y-1.5">
            {CATEGORIAS.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="size-4 accent-marca-700"
                  checked={categorias.includes(c.id)}
                  onChange={() => setCategorias((l) => alternar(l, c.id))}
                />
                {c.nombre}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset>
        <legend className="mb-2 font-semibold text-texto">Laboratorio</legend>
        <div className="space-y-1.5">
          {laboratorios.map((l) => (
            <label key={l} className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" className="size-4 accent-marca-700" checked={labs.includes(l)} onChange={() => setLabs((s) => alternar(s, l))} />
              {l}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 font-semibold text-texto">Precio máximo</legend>
        <input
          type="range"
          min={0}
          max={precioTope}
          step={500}
          value={precioMax}
          onChange={(e) => setPrecioMax(Number(e.target.value))}
          className="w-full accent-marca-700"
          aria-label="Precio máximo"
        />
        <p className="mt-1 text-texto-2">Hasta {clp(precioMax)}</p>
      </fieldset>
      <fieldset className="space-y-1.5">
        <legend className="mb-2 font-semibold text-texto">Disponibilidad</legend>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="size-4 accent-marca-700" checked={soloDirecta} onChange={(e) => setSoloDirecta(e.target.checked)} />
          Solo venta directa (sin receta)
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="size-4 accent-marca-700" checked={soloStock} onChange={(e) => setSoloStock(e.target.checked)} />
          Solo con stock
        </label>
      </fieldset>
      {hayFiltros ? (
        <button type="button" onClick={limpiar} className="font-semibold text-acento hover:underline">
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside>
        {/* En móvil los filtros van plegados para no empujar los productos hacia abajo. */}
        <details className="rounded-xl border border-borde bg-superficie p-4 md:hidden">
          <summary className="cursor-pointer font-semibold">Filtros</summary>
          <div className="mt-4">{filtros}</div>
        </details>
        <div className="hidden md:block">{filtros}</div>
      </aside>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, principio activo o laboratorio…"
            className="w-full flex-1 rounded-lg border border-borde-fuerte bg-superficie px-4 py-2.5 text-base outline-none focus:border-marca-600 focus:ring-2 focus:ring-acento-suave"
            aria-label="Buscar productos"
          />
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className="rounded-lg border border-borde-fuerte bg-superficie px-3 py-2.5 text-base sm:text-sm"
            aria-label="Ordenar por"
          >
            <option value="relevancia">Más relevantes</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="descuento">Mayor descuento</option>
            <option value="nombre">Nombre A–Z</option>
          </select>
        </div>
        <p className="mb-4 text-sm text-tenue" aria-live="polite">
          {resultado.length} {resultado.length === 1 ? 'producto' : 'productos'}
        </p>
        {resultado.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-borde-fuerte p-10 text-center text-tenue">
            No encontramos productos con esos filtros.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {resultado.map((p) => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

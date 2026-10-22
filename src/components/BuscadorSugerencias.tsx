import { useEffect, useMemo, useRef, useState } from 'react';
import { crearBuscador, type ProductoBuscable } from '../lib/busqueda';
import { clp } from '../lib/tienda';
import { url } from '../lib/url';

type Opcion = { id: string; href: string; tipo: 'categoria' | 'producto'; nombre: string; detalle?: string };

/** Buscador del header con sugerencias (patrón combobox de ARIA). Enter sin selección va a productos/?q=. */
export default function BuscadorSugerencias({ productos }: { productos: ProductoBuscable[] }) {
  const buscar = useMemo(() => crearBuscador(productos), [productos]);
  const [consulta, setConsulta] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState(-1);
  const contenedor = useRef<HTMLFormElement>(null);

  const entrada = useRef<HTMLInputElement>(null);

  // Al volver a productos/?q=..., el buscador muestra la consulta. Si alguien escribió antes de hidratar, se conserva lo escrito.
  useEffect(() => {
    const escrito = entrada.current?.value;
    const q = escrito || new URLSearchParams(location.search).get('q');
    if (q) setConsulta(q);
    if (escrito && document.activeElement === entrada.current) setAbierto(true);
  }, []);

  const opciones = useMemo<Opcion[]>(() => {
    const r = buscar(consulta);
    return [
      ...r.categorias.map((c) => ({ id: `sug-cat-${c.id}`, href: url(`categoria/${c.id}/`), tipo: 'categoria' as const, nombre: c.nombre })),
      ...r.productos.map((p) => ({ id: `sug-prod-${p.id}`, href: url(`productos/${p.id}/`), tipo: 'producto' as const, nombre: p.nombre, detalle: clp(p.precio) })),
    ];
  }, [buscar, consulta]);

  const visible = abierto && opciones.length > 0;

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!opciones.length) return;
      setAbierto(true);
      const paso = e.key === 'ArrowDown' ? 1 : -1;
      // Recorre -1 (el texto escrito) y las opciones, en ciclo.
      setActiva((a) => ((a + 1 + paso + opciones.length + 1) % (opciones.length + 1)) - 1);
    } else if (e.key === 'Escape') {
      if (visible) e.preventDefault();
      setAbierto(false);
      setActiva(-1);
    } else if (e.key === 'Enter' && visible && activa >= 0 && activa < opciones.length) {
      e.preventDefault();
      location.href = opciones[activa].href;
    }
  }

  const categorias = opciones.filter((o) => o.tipo === 'categoria');
  const sugeridos = opciones.filter((o) => o.tipo === 'producto');
  const fila = (o: Opcion) => {
    const i = opciones.indexOf(o);
    return (
      <li
        key={o.id}
        id={o.id}
        role="option"
        aria-selected={i === activa}
        // mousedown en vez de click: así el input no pierde el foco antes de navegar.
        onMouseDown={(e) => {
          e.preventDefault();
          location.href = o.href;
        }}
        onMouseEnter={() => setActiva(i)}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-acento-suave aria-selected:text-acento"
      >
        <span className="min-w-0 truncate">{o.nombre}</span>
        {o.detalle && <span className="shrink-0 font-semibold tabular-nums">{o.detalle}</span>}
      </li>
    );
  };

  return (
    <form
      ref={contenedor}
      action={url('productos/')}
      method="get"
      role="search"
      className="relative"
      onBlur={(e) => !contenedor.current?.contains(e.relatedTarget as Node) && setAbierto(false)}
    >
      <label htmlFor="buscador" className="sr-only">
        Buscar productos
      </label>
      <input
        ref={entrada}
        id="buscador"
        type="search"
        name="q"
        value={consulta}
        autoComplete="off"
        placeholder="¿Qué estás buscando?"
        role="combobox"
        aria-expanded={visible}
        aria-controls="buscador-sugerencias"
        aria-autocomplete="list"
        aria-activedescendant={visible && activa >= 0 && activa < opciones.length ? opciones[activa].id : undefined}
        onChange={(e) => {
          setConsulta(e.target.value);
          setAbierto(true);
          setActiva(-1);
        }}
        onFocus={() => setAbierto(true)}
        onKeyDown={onKeyDown}
        className="w-full rounded-full border border-borde-fuerte bg-superficie-2 px-4 py-2 text-base outline-none focus:border-marca-600 focus:bg-superficie focus:ring-2 focus:ring-acento-suave md:text-sm"
      />
      <div hidden={!visible} className="absolute inset-x-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-borde bg-superficie p-2 shadow-lg">
        <div id="buscador-sugerencias" role="listbox" aria-label="Sugerencias">
        {categorias.length > 0 && (
          <ul role="group" aria-labelledby="sug-titulo-cat">
            <li id="sug-titulo-cat" role="presentation" className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-tenue">
              Categorías
            </li>
            {categorias.map(fila)}
          </ul>
        )}
        {sugeridos.length > 0 && (
          <ul role="group" aria-labelledby="sug-titulo-prod">
            <li id="sug-titulo-prod" role="presentation" className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-tenue">
              Productos
            </li>
            {sugeridos.map(fila)}
          </ul>
        )}
        </div>
        <p className="border-t border-borde px-3 pb-1 pt-2 text-xs text-tenue">Enter para ver todos los resultados</p>
      </div>
    </form>
  );
}

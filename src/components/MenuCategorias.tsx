import { useEffect, useRef, useState } from 'react';
import SelectorTema from './SelectorTema';
import { url } from '../lib/url';

export type EntradaMenu = {
  id: string;
  nombre: string;
  descripcion: string;
  subcategorias: { nombre: string; cantidad: number }[];
  destacados: { id: string; nombre: string }[];
};

const esEscritorio = () => matchMedia('(min-width: 64rem)').matches;

const enlaceSub = (cat: string, sub: string) => url(`categoria/${cat}/?sub=${encodeURIComponent(sub)}`);

/**
 * Botón "Categorías" con su panel. En escritorio se despliega bajo el header (categorías a la izquierda,
 * subcategorías y destacados a la derecha); bajo lg es un panel lateral con las subcategorías en acordeón.
 */
export default function MenuCategorias({ categorias }: { categorias: EntradaMenu[] }) {
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState(categorias[0].id);
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  function cerrar(devolverFoco = true) {
    setAbierto(false);
    if (devolverFoco) boton.current?.focus();
  }

  useEffect(() => {
    if (!abierto) return;
    // Primer control visible: en escritorio el botón "Cerrar menú" está oculto.
    [...(panel.current?.querySelectorAll<HTMLElement>('a, button') ?? [])].find((el) => el.checkVisibility())?.focus();
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && cerrar();
    const alPulsar = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !boton.current?.contains(t)) cerrar(false);
    };
    document.addEventListener('keydown', alTeclear);
    document.addEventListener('pointerdown', alPulsar);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.removeEventListener('pointerdown', alPulsar);
    };
  }, [abierto]);

  const actual = categorias.find((c) => c.id === activa);

  return (
    <>
      <button
        ref={boton}
        type="button"
        aria-expanded={abierto}
        aria-controls="menu-categorias"
        onClick={() => (abierto ? cerrar() : setAbierto(true))}
        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-texto hover:bg-superficie-2 aria-expanded:bg-acento-suave aria-expanded:text-acento"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-5" aria-hidden="true">
          {abierto ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
        <span className="sr-only sm:not-sr-only">Categorías</span>
      </button>

      {abierto && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" aria-hidden="true" />}

      <div
        ref={panel}
        id="menu-categorias"
        hidden={!abierto}
        onBlur={(e) => {
          // Si el foco sale del panel (Tab más allá del último enlace), el menú se cierra.
          const destino = e.relatedTarget as Node | null;
          if (destino && !panel.current?.contains(destino) && !boton.current?.contains(destino)) setAbierto(false);
        }}
        className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-superficie shadow-xl lg:absolute lg:inset-x-0 lg:bottom-auto lg:top-full lg:w-auto lg:max-w-none lg:overflow-visible lg:border-b lg:border-borde lg:shadow-lg"
      >
        <nav aria-label="Categorías" className="mx-auto max-w-7xl lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:px-4 lg:py-6">
          <div className="flex items-center justify-between border-b border-borde p-4 lg:hidden">
            <p className="font-bold text-texto">Categorías</p>
            <button type="button" onClick={() => cerrar()} className="grid size-9 place-items-center rounded-full hover:bg-superficie-2" aria-label="Cerrar menú">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <ul className="p-2 lg:p-0">
            {categorias.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  aria-expanded={activa === c.id}
                  onClick={() => setActiva(activa === c.id && !esEscritorio() ? '' : c.id)}
                  // Pasar el mouse solo cambia la columna derecha en escritorio; en el panel lateral, el acordeón se abre con clic.
                  onPointerEnter={(e) => e.pointerType === 'mouse' && esEscritorio() && setActiva(c.id)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-medium text-texto hover:bg-superficie-2 aria-expanded:text-acento lg:aria-expanded:bg-acento-suave"
                >
                  {c.nombre}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`size-4 shrink-0 transition-transform ${activa === c.id ? 'max-lg:rotate-90' : ''}`} aria-hidden="true">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </button>
                {/* Acordeón en el panel lateral; en escritorio el detalle va en la columna derecha. */}
                {activa === c.id && (
                  <ul className="mb-2 ml-3 border-l border-borde pl-3 text-sm lg:hidden">
                    <li>
                      <a href={url(`categoria/${c.id}/`)} className="block py-1.5 font-semibold text-acento">
                        Ver todo {c.nombre}
                      </a>
                    </li>
                    {c.subcategorias.map((s) => (
                      <li key={s.nombre}>
                        <a href={enlaceSub(c.id, s.nombre)} className="block py-1.5 text-texto-2 hover:text-acento">
                          {s.nombre}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Solo con el panel abierto: el tema se lee del navegador y no debe entrar en la hidratación. */}
          {abierto && (
            <div className="flex items-center justify-between border-t border-borde p-4 text-sm font-medium text-texto sm:hidden">
              Tema
              <SelectorTema />
            </div>
          )}

          {actual && (
            <div className="hidden lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8">
              <div>
                <p className="text-lg font-bold text-texto">{actual.nombre}</p>
                <p className="text-sm text-tenue">{actual.descripcion}</p>
                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  {actual.subcategorias.map((s) => (
                    <li key={s.nombre}>
                      <a href={enlaceSub(actual.id, s.nombre)} className="block rounded py-1.5 text-texto-2 hover:text-acento">
                        {s.nombre} <span className="text-tenue">({s.cantidad})</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a href={url(`categoria/${actual.id}/`)} className="mt-4 inline-block text-sm font-semibold text-acento hover:underline">
                  Ver todo {actual.nombre} →
                </a>
              </div>
              <div className="rounded-2xl bg-superficie-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-tenue">Destacados</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {actual.destacados.map((p) => (
                    <li key={p.id}>
                      <a href={url(`productos/${p.id}/`)} className="block py-1 font-medium text-texto hover:text-acento">
                        {p.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}

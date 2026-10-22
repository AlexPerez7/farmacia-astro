import { useStore } from '@nanostores/react';
import { $favoritos } from '../stores/favoritos';
import { url } from '../lib/url';

export function IconoCorazon({ lleno = false, className = 'size-5' }: { lleno?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={lleno ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

/** Enlace a favoritos/ con su contador, en el header. */
export default function FavoritosBoton() {
  const cantidad = useStore($favoritos).length;
  return (
    <a href={url('favoritos/')} className="relative grid size-10 place-items-center rounded-full text-texto-2 hover:bg-superficie-2 hover:text-texto" title="Favoritos">
      <IconoCorazon />
      <span className="sr-only">Favoritos</span>
      {cantidad > 0 && (
        <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-marca-700 px-1 text-[10px] font-bold leading-4 text-white tabular-nums">
          {cantidad}
          <span className="sr-only"> {cantidad === 1 ? 'producto' : 'productos'}</span>
        </span>
      )}
    </a>
  );
}

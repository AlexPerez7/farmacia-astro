import { useStore } from '@nanostores/react';
import { $favoritos, alternarFavorito } from '../stores/favoritos';
import { IconoCorazon } from './FavoritosBoton';

type Props = { id: string; nombre: string; compacto?: boolean };

/** Corazón para guardar un producto en favoritos. `compacto` es solo el ícono (para la tarjeta). */
export default function BotonFavorito({ id, nombre, compacto = false }: Props) {
  const guardado = useStore($favoritos).includes(id);
  return (
    <button
      type="button"
      // Con ícono solo, el estado va en aria-pressed; con texto, el texto ya cambia ("En favoritos").
      aria-pressed={compacto ? guardado : undefined}
      aria-label={compacto ? `Guardar ${nombre} en favoritos` : undefined}
      data-guardado={guardado}
      onClick={() => alternarFavorito(id)}
      className={
        compacto
          ? 'grid size-9 place-items-center rounded-full bg-superficie/90 text-texto-2 shadow-sm hover:text-rose-600 aria-pressed:text-rose-600 dark:aria-pressed:text-rose-400'
          : 'flex items-center gap-2 rounded-lg border border-borde-fuerte px-4 py-2.5 text-sm font-semibold text-texto hover:bg-superficie-2 data-[guardado=true]:border-rose-300 data-[guardado=true]:text-rose-700 dark:data-[guardado=true]:border-rose-400/40 dark:data-[guardado=true]:text-rose-300'
      }
    >
      <IconoCorazon lleno={guardado} />
      {!compacto && (guardado ? 'En favoritos' : 'Guardar en favoritos')}
    </button>
  );
}

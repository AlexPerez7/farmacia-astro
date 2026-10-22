import { categoriaPorId } from '../lib/categorias';

// Ilustración por categoría en lugar de fotos reales (los productos son ficticios).
const ICONOS: Record<string, React.ReactNode> = {
  medicamentos: (
    <>
      <path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </>
  ),
  vitaminas: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  dermocosmetica: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />,
  'cuidado-personal': <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />,
  'bebe-y-mama': (
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  ),
  'primeros-auxilios': (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
};

type Props = { categoria: string; tamano?: 'sm' | 'md' | 'lg'; className?: string };

export default function ProductoVisual({ categoria, tamano = 'md', className = '' }: Props) {
  const cat = categoriaPorId(categoria);
  const icono = { sm: 'size-7', md: 'size-14', lg: 'size-28' }[tamano];
  return (
    <div className={`grid place-items-center rounded-xl ${cat?.fondo ?? 'bg-superficie-2'} ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${icono} ${cat?.tinta ?? 'text-tenue'}`}
      >
        {ICONOS[categoria]}
      </svg>
    </div>
  );
}

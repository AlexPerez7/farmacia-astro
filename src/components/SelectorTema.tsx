import { useStore } from '@nanostores/react';
import { $tema, rotarTema, type Tema } from '../stores/tema';

const OPCIONES: Record<Tema, { nombre: string; siguiente: string; icono: React.ReactNode }> = {
  sistema: {
    nombre: 'según el sistema',
    siguiente: 'claro',
    icono: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  claro: {
    nombre: 'claro',
    siguiente: 'oscuro',
    icono: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </>
    ),
  },
  oscuro: {
    nombre: 'oscuro',
    siguiente: 'según el sistema',
    icono: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  },
};

export default function SelectorTema() {
  const tema = useStore($tema);
  const opcion = OPCIONES[tema];
  return (
    <button
      type="button"
      onClick={rotarTema}
      className="grid size-10 place-items-center rounded-full text-texto-2 hover:bg-superficie-2 hover:text-texto"
      aria-label={`Tema ${opcion.nombre}. Cambiar a ${opcion.siguiente}`}
      title={`Tema: ${opcion.nombre}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        {opcion.icono}
      </svg>
    </button>
  );
}

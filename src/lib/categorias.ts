export const CATEGORIA_IDS = [
  'medicamentos',
  'vitaminas',
  'dermocosmetica',
  'cuidado-personal',
  'bebe-y-mama',
  'primeros-auxilios',
] as const;

export type CategoriaId = (typeof CATEGORIA_IDS)[number];

export type Categoria = {
  id: CategoriaId;
  nombre: string;
  descripcion: string;
  /** Clases de Tailwind para el fondo y el ícono de la tarjeta. */
  fondo: string;
  tinta: string;
};

export const CATEGORIAS: Categoria[] = [
  { id: 'medicamentos', nombre: 'Medicamentos', descripcion: 'Venta directa y con receta', fondo: 'bg-sky-100 dark:bg-sky-400/15', tinta: 'text-sky-700 dark:text-sky-300' },
  { id: 'vitaminas', nombre: 'Vitaminas y suplementos', descripcion: 'Energía y defensas', fondo: 'bg-lime-100 dark:bg-lime-400/15', tinta: 'text-lime-700 dark:text-lime-300' },
  { id: 'dermocosmetica', nombre: 'Dermocosmética', descripcion: 'Cuidado de la piel', fondo: 'bg-rose-100 dark:bg-rose-400/15', tinta: 'text-rose-700 dark:text-rose-300' },
  { id: 'cuidado-personal', nombre: 'Cuidado personal', descripcion: 'Higiene diaria', fondo: 'bg-violet-100 dark:bg-violet-400/15', tinta: 'text-violet-700 dark:text-violet-300' },
  { id: 'bebe-y-mama', nombre: 'Bebé y mamá', descripcion: 'Para los más pequeños', fondo: 'bg-amber-100 dark:bg-amber-400/15', tinta: 'text-amber-700 dark:text-amber-300' },
  { id: 'primeros-auxilios', nombre: 'Primeros auxilios', descripcion: 'Botiquín del hogar', fondo: 'bg-red-100 dark:bg-red-400/15', tinta: 'text-red-700 dark:text-red-300' },
];

export const categoriaPorId = (id: string) => CATEGORIAS.find((c) => c.id === id);

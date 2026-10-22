// Comunas con despacho (ficticias en sus reglas): días hábiles de demora y sucursal más cercana para retiro.
export type Comuna = { nombre: string; diasDespacho: number; sucursal: string };

export const COMUNAS: Comuna[] = [
  { nombre: 'Providencia', diasDespacho: 1, sucursal: 'providencia' },
  { nombre: 'Las Condes', diasDespacho: 1, sucursal: 'providencia' },
  { nombre: 'Vitacura', diasDespacho: 1, sucursal: 'providencia' },
  { nombre: 'Santiago', diasDespacho: 1, sucursal: 'providencia' },
  { nombre: 'Ñuñoa', diasDespacho: 1, sucursal: 'nunoa' },
  { nombre: 'La Florida', diasDespacho: 2, sucursal: 'nunoa' },
  { nombre: 'Puente Alto', diasDespacho: 2, sucursal: 'nunoa' },
  { nombre: 'Maipú', diasDespacho: 1, sucursal: 'maipu' },
  { nombre: 'Pudahuel', diasDespacho: 2, sucursal: 'maipu' },
];

export const COMUNA_POR_DEFECTO = 'Providencia';

export const comunaPorNombre = (nombre: string) => COMUNAS.find((c) => c.nombre === nombre);

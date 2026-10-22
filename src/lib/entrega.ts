import { comunaPorNombre, COMUNA_POR_DEFECTO } from './comunas';
import { SUCURSALES, type Sucursal } from './tienda';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
/** Hasta esta hora se puede retirar el mismo día. */
export const CORTE_RETIRO_HOY = 13;

const inicioDelDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** "hoy", "mañana", "pasado mañana" o "el lunes 27". */
export function diaRelativo(fecha: Date, ahora: Date) {
  const dias = Math.round((inicioDelDia(fecha).getTime() - inicioDelDia(ahora).getTime()) / 86_400_000);
  if (dias === 0) return 'hoy';
  if (dias === 1) return 'mañana';
  if (dias === 2) return 'pasado mañana';
  return `el ${DIAS[fecha.getDay()]} ${fecha.getDate()}`;
}

/** Suma días hábiles (los domingos no se despacha). */
function sumarDiasHabiles(desde: Date, dias: number) {
  const fecha = inicioDelDia(desde);
  let sumados = 0;
  while (sumados < dias) {
    fecha.setDate(fecha.getDate() + 1);
    if (fecha.getDay() !== 0) sumados++;
  }
  return fecha;
}

export function estimarDespacho(nombreComuna: string, ahora: Date) {
  const comuna = comunaPorNombre(nombreComuna) ?? comunaPorNombre(COMUNA_POR_DEFECTO)!;
  const fecha = sumarDiasHabiles(ahora, comuna.diasDespacho);
  return { fecha, texto: `Llega ${diaRelativo(fecha, ahora)} a ${comuna.nombre}` };
}

export function sucursalDeComuna(nombreComuna: string): Sucursal {
  const comuna = comunaPorNombre(nombreComuna) ?? comunaPorNombre(COMUNA_POR_DEFECTO)!;
  return SUCURSALES.find((s) => s.id === comuna.sucursal)!;
}

export function estimarRetiro(nombreComuna: string, ahora: Date) {
  const sucursal = sucursalDeComuna(nombreComuna);
  const hoy = ahora.getHours() < CORTE_RETIRO_HOY;
  const fecha = hoy ? inicioDelDia(ahora) : sumarDiasHabiles(ahora, 1);
  return { fecha, sucursal, texto: `Retira ${diaRelativo(fecha, ahora)} en ${sucursal.nombre}` };
}

/** Estado de la sucursal según su horario y la hora local. */
export function estadoSucursal(sucursal: Sucursal, ahora: Date) {
  const [abre, cierra] = ahora.getDay() === 0 ? sucursal.horario.domingo : sucursal.horario.semana;
  if (abre === 0 && cierra === 24) return { abierta: true, texto: 'Abierta las 24 horas' };
  const hora = ahora.getHours() + ahora.getMinutes() / 60;
  if (hora >= abre && hora < cierra) return { abierta: true, texto: `Abierta · cierra a las ${cierra}:00` };
  return { abierta: false, texto: hora < abre ? `Cerrada · abre a las ${abre}:00` : 'Cerrada · abre mañana' };
}

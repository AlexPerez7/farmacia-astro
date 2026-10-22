import { describe, expect, it } from 'vitest';
import { diaRelativo, estadoSucursal, estimarDespacho, estimarRetiro, sucursalDeComuna } from '../../src/lib/entrega';
import { SUCURSALES } from '../../src/lib/tienda';

// Fechas locales: 2026-10-21 es miércoles; 2026-10-24 es sábado; 2026-10-25 es domingo.
const fecha = (dia: number, hora: number, minuto = 0) => new Date(2026, 9, dia, hora, minuto);
const [providencia, nunoa] = SUCURSALES;

describe('diaRelativo', () => {
  it('nombra hoy, mañana y pasado mañana', () => {
    expect(diaRelativo(fecha(21, 23), fecha(21, 8))).toBe('hoy');
    expect(diaRelativo(fecha(22, 1), fecha(21, 23))).toBe('mañana');
    expect(diaRelativo(fecha(23, 9), fecha(21, 9))).toBe('pasado mañana');
  });

  it('desde tres días usa el día de la semana', () => {
    expect(diaRelativo(fecha(26, 9), fecha(21, 9))).toBe('el lunes 26');
  });
});

describe('estimarDespacho', () => {
  it('usa los días de la comuna', () => {
    expect(estimarDespacho('Ñuñoa', fecha(21, 10)).texto).toBe('Llega mañana a Ñuñoa');
    expect(estimarDespacho('Puente Alto', fecha(21, 10)).texto).toBe('Llega pasado mañana a Puente Alto');
  });

  it('no cuenta el domingo', () => {
    // Sábado + 1 día hábil = lunes (pasado mañana); en día hábil sería "mañana".
    expect(estimarDespacho('Providencia', fecha(24, 10)).texto).toBe('Llega pasado mañana a Providencia');
    expect(estimarDespacho('Puente Alto', fecha(24, 10)).texto).toBe('Llega el martes 27 a Puente Alto');
  });

  it('una comuna desconocida cae en la comuna por defecto', () => {
    expect(estimarDespacho('Atlántida', fecha(21, 10)).texto).toBe('Llega mañana a Providencia');
  });
});

describe('estimarRetiro', () => {
  it('antes del corte se retira hoy, después mañana', () => {
    expect(estimarRetiro('Maipú', fecha(21, 12, 59)).texto).toBe('Retira hoy en Sucursal Maipú');
    expect(estimarRetiro('Maipú', fecha(21, 13)).texto).toBe('Retira mañana en Sucursal Maipú');
  });

  it('cada comuna tiene su sucursal', () => {
    expect(sucursalDeComuna('La Florida').id).toBe('nunoa');
    expect(sucursalDeComuna('Las Condes').id).toBe('providencia');
  });
});

describe('estadoSucursal', () => {
  it('la sucursal de 24 horas siempre está abierta', () => {
    expect(estadoSucursal(providencia, fecha(21, 3))).toEqual({ abierta: true, texto: 'Abierta las 24 horas' });
  });

  it('calcula abierta o cerrada según el horario del día', () => {
    expect(estadoSucursal(nunoa, fecha(21, 8))).toEqual({ abierta: false, texto: 'Cerrada · abre a las 9:00' });
    expect(estadoSucursal(nunoa, fecha(21, 21, 59))).toEqual({ abierta: true, texto: 'Abierta · cierra a las 22:00' });
    expect(estadoSucursal(nunoa, fecha(21, 22))).toEqual({ abierta: false, texto: 'Cerrada · abre mañana' });
  });

  it('el domingo usa su propio horario', () => {
    expect(estadoSucursal(nunoa, fecha(25, 9, 30)).texto).toBe('Cerrada · abre a las 10:00');
    expect(estadoSucursal(nunoa, fecha(25, 20, 30)).abierta).toBe(false);
  });
});

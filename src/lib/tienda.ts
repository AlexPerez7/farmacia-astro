// Reglas de negocio de la tienda (ficticias).
export const NOMBRE_TIENDA = 'Farmacia Pulso';
export const ENVIO_GRATIS_DESDE = 25000;
export const COSTO_ENVIO = 3490;

export type Sucursal = {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  /** Horas de apertura y cierre [abre, cierra]; [0, 24] es abierta todo el día. */
  horario: { semana: [number, number]; domingo: [number, number] };
};

export const SUCURSALES: Sucursal[] = [
  { id: 'providencia', nombre: 'Sucursal Providencia', direccion: 'Av. Los Aromos 1234, Providencia', telefono: '+56 2 0000 0001', horario: { semana: [0, 24], domingo: [0, 24] } },
  { id: 'nunoa', nombre: 'Sucursal Ñuñoa', direccion: 'Calle Los Tilos 567, Ñuñoa', telefono: '+56 2 0000 0002', horario: { semana: [9, 22], domingo: [10, 20] } },
  { id: 'maipu', nombre: 'Sucursal Maipú', direccion: 'Pasaje El Roble 89, Maipú', telefono: '+56 2 0000 0003', horario: { semana: [9, 21], domingo: [10, 18] } },
];

const formatoCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
export const clp = (monto: number) => formatoCLP.format(monto);

export const costoEnvio = (subtotal: number) => (subtotal >= ENVIO_GRATIS_DESDE || subtotal === 0 ? 0 : COSTO_ENVIO);

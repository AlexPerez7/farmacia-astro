// Reglas de negocio de la tienda (ficticias).
export const NOMBRE_TIENDA = 'Farmacia Pulso';
export const ENVIO_GRATIS_DESDE = 25000;
export const COSTO_ENVIO = 3490;

export const SUCURSALES = [
  { id: 'providencia', nombre: 'Sucursal Providencia', direccion: 'Av. Los Aromos 1234, Providencia' },
  { id: 'nunoa', nombre: 'Sucursal Ñuñoa', direccion: 'Calle Los Tilos 567, Ñuñoa' },
  { id: 'maipu', nombre: 'Sucursal Maipú', direccion: 'Pasaje El Roble 89, Maipú' },
];

const formatoCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
export const clp = (monto: number) => formatoCLP.format(monto);

export const costoEnvio = (subtotal: number) => (subtotal >= ENVIO_GRATIS_DESDE || subtotal === 0 ? 0 : COSTO_ENVIO);

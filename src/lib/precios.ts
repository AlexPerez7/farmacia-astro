// Precio por unidad de medida: en Chile las farmacias lo informan junto al precio de venta.
export const UNIDADES = ['comprimido', 'cápsula', 'tableta', 'sobre', 'ml', 'g', 'unidad'] as const;
export type Unidad = (typeof UNIDADES)[number];

/** Líquidos se informan por litro y sólidos por kilo; el resto, por unidad del envase. */
export function precioPorUnidad(precio: number, contenido: number, unidad: Unidad) {
  if (unidad === 'ml') return { valor: Math.round((precio / contenido) * 1000), etiqueta: 'x litro' };
  if (unidad === 'g') return { valor: Math.round((precio / contenido) * 1000), etiqueta: 'x kilo' };
  return { valor: Math.round(precio / contenido), etiqueta: `x ${unidad}` };
}

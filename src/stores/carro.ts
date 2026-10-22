import { atom, computed } from 'nanostores';
import { costoEnvio } from '../lib/tienda';

export type ItemCarro = {
  id: string;
  nombre: string;
  laboratorio: string;
  categoria: string;
  presentacion: string;
  precio: number;
  stock: number;
  requiereReceta: boolean;
  cantidad: number;
};

export type ProductoCarro = Omit<ItemCarro, 'cantidad'>;

const CLAVE = 'pulso:carro';

function leer(): ItemCarro[] {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as ItemCarro[]) : [];
  } catch {
    return [];
  }
}

// En el servidor el carro siempre parte vacío; en el navegador se recupera de localStorage.
export const $carro = atom<ItemCarro[]>(typeof window === 'undefined' ? [] : leer());
export const $carroAbierto = atom(false);

if (typeof window !== 'undefined') {
  $carro.listen((items) => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
      // Sin almacenamiento disponible (modo privado): el carro vive solo en memoria.
    }
  });
  // Mantiene sincronizadas varias pestañas abiertas.
  window.addEventListener('storage', (e) => {
    if (e.key === CLAVE) $carro.set(leer());
  });
}

export const $resumen = computed($carro, (items) => {
  const directos = items.filter((i) => !i.requiereReceta);
  const conReceta = items.filter((i) => i.requiereReceta);
  const suma = (lista: ItemCarro[]) => lista.reduce((t, i) => t + i.precio * i.cantidad, 0);
  const subtotal = suma(directos);
  return {
    unidades: items.reduce((t, i) => t + i.cantidad, 0),
    directos,
    conReceta,
    subtotal,
    subtotalReceta: suma(conReceta),
    envio: costoEnvio(subtotal),
  };
});

export function agregar(producto: ProductoCarro, cantidad = 1) {
  const items = $carro.get();
  const existente = items.find((i) => i.id === producto.id);
  if (existente) {
    cambiarCantidad(producto.id, existente.cantidad + cantidad);
  } else {
    $carro.set([...items, { ...producto, cantidad: Math.min(cantidad, producto.stock) }]);
  }
}

export function cambiarCantidad(id: string, cantidad: number) {
  if (cantidad <= 0) return quitar(id);
  $carro.set($carro.get().map((i) => (i.id === id ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i)));
}

export function quitar(id: string) {
  $carro.set($carro.get().filter((i) => i.id !== id));
}

export function vaciar() {
  $carro.set([]);
}

export function abrirCarro() {
  $carroAbierto.set(true);
}

export function cerrarCarro() {
  $carroAbierto.set(false);
}

import { atom } from 'nanostores';

export type Tema = 'sistema' | 'claro' | 'oscuro';

// La misma clave la lee el script en línea de Base.astro antes del primer pintado.
const CLAVE = 'pulso:tema';
const ORDEN: Tema[] = ['sistema', 'claro', 'oscuro'];

function leer(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return ORDEN.includes(guardado as Tema) ? (guardado as Tema) : 'sistema';
  } catch {
    return 'sistema';
  }
}

export const $tema = atom<Tema>(typeof window === 'undefined' ? 'sistema' : leer());

if (typeof window !== 'undefined') {
  const sistemaOscuro = matchMedia('(prefers-color-scheme: dark)');
  const aplicar = (tema: Tema) => {
    const oscuro = tema === 'oscuro' || (tema === 'sistema' && sistemaOscuro.matches);
    document.documentElement.dataset.theme = oscuro ? 'dark' : 'light';
  };

  $tema.subscribe((tema) => {
    aplicar(tema);
    try {
      localStorage.setItem(CLAVE, tema);
    } catch {
      // Sin almacenamiento: el tema dura hasta recargar.
    }
  });
  // En modo sistema, sigue los cambios del sistema operativo en vivo.
  sistemaOscuro.addEventListener('change', () => {
    if ($tema.get() === 'sistema') aplicar('sistema');
  });
  window.addEventListener('storage', (e) => {
    if (e.key === CLAVE) $tema.set(leer());
  });
}

export function rotarTema() {
  $tema.set(ORDEN[(ORDEN.indexOf($tema.get()) + 1) % ORDEN.length]);
}

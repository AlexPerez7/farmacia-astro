// Antepone el `base` de Astro (/farmacia-astro/) para que los enlaces funcionen en GitHub Pages.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const url = (ruta = '') => `${base}/${ruta.replace(/^\//, '')}`;

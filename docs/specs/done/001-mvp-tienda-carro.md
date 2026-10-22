# 001 · MVP de tienda con carro
Estado: hecha · Fase del PLAN: 1 · Fecha: 2026-10-21

> Spec escrita después de implementar, para dejar registro de la base del proyecto.

## Objetivo
Tener una tienda de farmacia ficticia publicable en GitHub Pages, con catálogo, búsqueda, filtros, carro persistente y checkout simulado.

## Alcance
Entra:
- Catálogo de 20 productos en 6 categorías (`src/data/productos.json`), validado con Zod en `src/content.config.ts`.
- Páginas: inicio, todos los productos, categoría (`/categoria/[cat]/`), producto (`/productos/[slug]/`), carro, checkout, confirmación y 404.
- Búsqueda difusa con Fuse.js (nombre, principio activo, laboratorio, descripción) reflejada en `?q=`.
- Filtros por categoría, laboratorio, precio máximo, venta directa y stock; orden por relevancia, precio, descuento y nombre.
- Carro con nanostores: panel lateral, cantidades limitadas por stock, persistencia en `localStorage`, sincronización entre pestañas.
- Despacho gratis sobre $25.000 con barra de progreso.
- Productos con receta: se reservan para retiro en sucursal y no se cobran en línea.
- Checkout simulado: validación de RUT (módulo 11), correo y teléfono chileno; despacho o retiro; sin datos de tarjeta.
- Workflow de GitHub Actions que publica en Pages en cada push a `main`.

No entra:
- Backend, pagos reales, cuentas de usuario, imágenes reales, modo oscuro, tests automatizados.

## Diseño
- `src/stores/carro.ts`: `$carro`, `$carroAbierto`, `$resumen` (separa directos y con receta, subtotal y envío) y las acciones `agregar`, `cambiarCantidad`, `quitar`, `vaciar`.
- `src/lib/`: `categorias.ts`, `tienda.ts` (reglas y `clp()`), `rut.ts`, `url.ts` (antepone `base`), `tipos.ts`.
- Islas: `CarroBoton`, `CarroDrawer`, `CarroPagina`, `Checkout` y `Confirmacion` con `client:only`; `Catalogo` con `client:load`; `ProductoCard` con `client:visible` fuera del catálogo.
- `astro.config.mjs`: `site`, `base: '/farmacia-astro/'`, `trailingSlash: 'always'`.

## Criterios de aceptación
- [x] `npm run build` genera 32 páginas sin errores.
- [x] `astro check`: 0 errores, 0 advertencias.
- [x] Todas las rutas responden 200 en dev; una ruta inexistente responde 404.
- [x] Los enlaces generados llevan el prefijo `/farmacia-astro/`.
- [x] `rutValido` acepta `12.345.678-5` y `11.111.111-1` y rechaza `12345678-9`.
- [x] Deploy en GitHub Pages exitoso; inicio, catálogo, producto y checkout responden 200 en producción.
- [x] Prueba en navegador del carro, filtros y checkout completo: hecha con la spec 002 (2026-10-21).

# 002 · Modo oscuro y responsividad
Estado: hecha · Fase del PLAN: 2 · Fecha: 2026-10-21

## Objetivo
Agregar un modo oscuro completo y revisar el diseño para que funcione bien desde 320 px (celulares pequeños) hasta pantallas de escritorio grandes. Además, hacer la prueba manual en navegador que quedó pendiente en la spec 001.

## Alcance
Entra:
- **Modo oscuro** en todas las páginas, islas y estados (vacío, error, deshabilitado, foco).
- **Interruptor de tema** en el header con tres estados: *Sistema* (por defecto), *Claro* y *Oscuro*. La elección se recuerda.
- **Sin destello** al cargar: el tema se aplica antes del primer pintado.
- **Responsividad** revisada en 320, 375, 768, 1024 y 1440 px, con las correcciones de la lista de abajo.
- Prueba manual completa en navegador (carro, filtros, checkout) en ambos temas.

No entra:
- Rediseño visual o cambio de paleta de marca.
- Tests automatizados (fase 3).
- Imágenes de producto (fase 4).

## Diseño

### 1. Colores semánticos (base del modo oscuro)
Hoy los componentes usan colores fijos (`bg-white`, `text-slate-600`, `border-slate-200`…, unas 200 clases). Repetir `dark:` en cada una duplica el trabajo y es fácil olvidar alguna. En su lugar se definen **tokens semánticos** en `src/styles/global.css` y se redefinen para el tema oscuro:

| Token (clase Tailwind) | Claro | Oscuro | Reemplaza a |
|---|---|---|---|
| `bg-fondo` | slate-50 | slate-950 | fondo del `body` |
| `bg-superficie` | white | slate-900 | `bg-white` (tarjetas, header, panel) |
| `bg-superficie-2` | slate-100 | slate-800 | `bg-slate-100`, `bg-slate-50`, hovers |
| `border-borde` | slate-200 | slate-800 | `border-slate-200/100`, `divide-*` |
| `border-borde-fuerte` | slate-300 | slate-700 | bordes de inputs y botones secundarios |
| `text-texto` | slate-900 | slate-50 | títulos y texto principal |
| `text-texto-2` | slate-600 | slate-300 | texto secundario |
| `text-tenue` | slate-500 | slate-400 | metadatos, ayudas |
| `text-acento` | marca-700 | marca-300 | enlaces y precios destacados |
| `bg-aviso` / `text-aviso` / `border-aviso` | amber-50 / amber-900 / amber-200 | amber-950/40 / amber-200 / amber-900 | avisos de receta |

- Se definen con `@theme` (Tailwind 4) y se sobrescriben en `:root[data-theme="dark"]`. Respaldo sin JavaScript: `@media (prefers-color-scheme: dark)` sobre `:root:not([data-theme="light"])`.
- `@custom-variant dark` apunta a `[data-theme="dark"]` para los pocos casos que necesiten `dark:` puntual (tintes de categoría en `src/lib/categorias.ts`, sombras).
- `color-scheme: light dark` para que los controles nativos (inputs, select, scrollbars, `range`) también cambien.
- Los botones primarios (`bg-marca-700` con texto blanco) se mantienen en ambos temas; el hero usa un degradado algo más oscuro en modo oscuro.
- Todos los pares de texto y fondo deben cumplir contraste WCAG AA (4,5:1 en texto normal).

### 2. Interruptor de tema
- Nuevo `src/components/SelectorTema.tsx` (isla `client:only`), en el header junto al carro: un botón con ícono (sol / luna / monitor) que rota Sistema → Claro → Oscuro, con `aria-label` que dice el estado actual.
- `src/stores/tema.ts`: `$tema` (`'sistema' | 'claro' | 'oscuro'`) persistido en `localStorage` (`pulso:tema`, dentro de `try/catch`).
- Script en línea en `<head>` de `Base.astro` (`is:inline`), antes de los estilos: lee la preferencia, resuelve *sistema* con `matchMedia` y fija `data-theme` en `<html>`. Así no hay destello.
- En modo *Sistema* escucha los cambios de `prefers-color-scheme` en vivo.
- Actualiza `<meta name="theme-color">` según el tema (barra del navegador en el celular).

### 3. Correcciones de responsividad
| # | Problema detectado | Corrección |
|---|---|---|
| R1 | Header a 320 px: logo + "Productos" + botón del carro no caben junto al nuevo selector de tema | Ocultar el enlace "Productos" bajo `sm` (las categorías y el buscador ya cubren esa navegación); logo solo con ícono bajo 360 px |
| R2 | Inicio, destacados con `lg:grid-cols-6`: tarjetas de ~150 px a 1024 px, botón y precio apretados | `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6` |
| R3 | Tarjeta de producto a 320 px (≈140 px de ancho): el precio y el precio anterior se montan, las etiquetas tapan el ícono | Padding `p-2.5` bajo `sm`, precio anterior en una segunda línea si no cabe (`flex-wrap`), etiquetas más pequeñas |
| R4 | Botones − / + del carro de ~28 px de alto (menos del mínimo táctil) | Áreas táctiles de 40 px como mínimo (`min-h-10 min-w-10`) |
| R5 | Checkout: opciones de entrega en 2 columnas a 320 px | Una columna bajo `sm` |
| R6 | Resumen fijo (`lg:sticky lg:top-24`) en carro y checkout queda bajo el header (~110 px de alto) | `lg:top-32`, o una variable `--alto-header` |
| R7 | Ruta de navegación (breadcrumb) con nombres largos ocupa 3 líneas en el celular | Truncar el último tramo con `truncate` y `max-w` |
| R8 | La barra de categorías se desplaza en horizontal sin ninguna pista | Degradado en los bordes que indica que hay más contenido |
| R9 | Panel del carro en el celular: el pie con los botones puede quedar bajo la barra del navegador o el área segura del iPhone | `h-dvh` y `padding-bottom: env(safe-area-inset-bottom)` en el pie |
| R10 | Página de producto: filas de la ficha (`dl`) con valores largos se desalinean | `gap-4` y `text-right` en los valores |
| R11 | Inputs con `text-sm` en el celular provocan zoom en iOS | Todos los campos a 16 px bajo `sm` (`text-base sm:text-sm`) |

### Archivos afectados
`src/styles/global.css`, `src/layouts/Base.astro`, `src/lib/categorias.ts`, todos los componentes de `src/components/`, las páginas de `src/pages/`, y nuevos `src/components/SelectorTema.tsx` y `src/stores/tema.ts`.

## Criterios de aceptación
- [x] `npm run check` con 0 errores y `npm run build` sin errores.
- [x] No quedan colores fijos de superficie o texto: `grep` de `bg-white|text-slate-|border-slate-|bg-slate-` en `src/` sin resultados, salvo excepciones justificadas en un comentario. Quedan 3, comentadas: el contador del botón del carro, el velo del panel del carro y el texto del botón ámbar del hero.
- [x] El interruptor rota Sistema → Claro → Oscuro, se recuerda al recargar y en modo Sistema sigue al sistema operativo en vivo.
- [x] Al recargar en modo oscuro no hay destello blanco: `<html>` ya tiene `data-theme="dark"` cuando el parser llega al `<body>`.
- [x] Sin scroll horizontal en 320, 375, 768, 1024 y 1440 px en las 9 páginas, en ambos temas. La primera corrida encontró que `/carro/` medía 392 px a 320 y 375 px; se corrigió (ver Resultado).
- [x] Contraste AA en los pares de tokens de texto y fondo, en ambos temas (tabla abajo).
- [x] Recorrido en el navegador, en ambos temas (claro a 375 px y oscuro a 1440 px): búsqueda por URL, filtro, agregar, cambiar cantidades, reservar con receta, checkout vacío (errores), RUT inválido (rechazado), RUT válido (formateado), confirmación con número de pedido y reservas separadas, carro vaciado, sin errores de consola. Cierra el criterio pendiente de la spec 001.
- [x] Capturas a 375 px y 1440 px en ambos temas en `docs/capturas/`, enlazadas en el README.

## Resultado (2026-10-21)

**Cómo se verificó.** Playwright con el Edge instalado (`channel: 'msedge'`), con un script fuera del repo que mide `scrollWidth` contra `innerWidth` en cada página, ancho y tema, prueba el interruptor y hace el recorrido de compra. También se revisó a la vista con Claude in Chrome (modo Sistema oscuro → Claro). Las capturas se tomaron del build (`astro preview`) para que no aparezca la barra de desarrollo de Astro.

**Problemas encontrados y corregidos durante la verificación:**
- `/carro/` se desbordaba en el celular: la grilla sin columnas definidas crecía al ancho del texto truncado más largo. Ahora usa `grid-cols-1` y `lg:grid-cols-[minmax(0,1fr)_340px]`. Se aplicó lo mismo al checkout.
- El botón "Reservar" (blanco sobre `amber-600`) tenía contraste 3,19:1. Pasó a `amber-700` (5,0:1).
- `slate-500` como texto tenue daba 4,34:1 sobre `superficie-2`. Se reemplazó por `#5b6779` (5,24:1).

**Cambio respecto del diseño:** `<meta name="theme-color">` no cambia con el tema. Coincide con la franja superior (`marca-900`), que es igual en ambos temas.

**Contraste (texto sobre el fondo más desfavorable de cada tema):**

| Token | Claro | Oscuro |
|---|---|---|
| `texto` | 16,30:1 | 13,60:1 |
| `texto-2` | 6,92:1 | 9,58:1 |
| `tenue` | 5,24:1 | 5,55:1 |
| `acento` | 5,00:1 | 9,62:1 |
| `aviso-texto` | 8,28:1 | 11,42:1 |
| Blanco sobre botón de marca (`marca-700`) | 5,47:1 | 5,47:1 |

## Decisiones (2026-10-21)
1. Interruptor de tres estados: Sistema / Claro / Oscuro.
2. Ancho mínimo soportado: 320 px.
3. Las capturas para el README entran en esta spec.

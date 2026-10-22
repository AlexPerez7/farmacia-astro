# Farmacia Pulso — instrucciones para agentes

Tienda de farmacia **ficticia** para portafolio. Astro 7 estático + islas React 19 + Tailwind 4 + nanostores. Se publica en GitHub Pages (`https://alexperez7.github.io/farmacia-astro/`) en cada push a `main`.

Antes de trabajar, lee [PLAN.md](PLAN.md) (fases y registro) y [docs/specs/README.md](docs/specs/README.md) (flujo de specs).

## Flujo de trabajo: specs primero

Todo cambio no trivial se describe en una spec **antes** de escribir código:

1. Redactar `docs/specs/NNN-nombre.md` con estado `propuesta`, usando la plantilla de `docs/specs/README.md`.
2. Esperar la aprobación del usuario. Si pide cambios, se edita la spec (no se reemplaza).
3. Aprobada → estado `aprobada` → implementar.
4. Verificada → estado `hecha`, mover a `docs/specs/done/`, actualizar el índice de specs y el registro de trabajo de `PLAN.md`.

Correcciones menores (una errata, un estilo puntual) no necesitan spec, pero sí una línea en el registro de `PLAN.md`.

## Reglas del proyecto

- **Idioma:** código, comentarios, commits y documentación en español (nombres de componentes y variables incluidos: `Carro`, `agregar`, `precio`).
- **Enlaces:** siempre con `url()` de `src/lib/url.ts`; nunca rutas absolutas como `/productos/`, porque el sitio vive bajo `base: '/farmacia-astro/'`.
- **Sitio estático:** nada de SSR ni endpoints; GitHub Pages solo sirve archivos. El estado del cliente vive en nanostores + `localStorage`/`sessionStorage`, siempre dentro de `try/catch`.
- **Hidratación:** `client:only="react"` para lo que lee almacenamiento del navegador (carro, checkout); `client:load` o `client:visible` para el resto.
- **Datos:** productos en `src/data/productos.json`, validados por el esquema de `src/content.config.ts`. Todo es ficticio: marcas, laboratorios, sucursales y personas inventadas.
- **Checkout simulado:** nunca pedir datos de tarjeta ni enviar datos a servicios externos.
- **Accesibilidad:** labels en todos los campos, foco visible, `aria-*` en controles sin texto, respetar `prefers-reduced-motion`.

## Verificación antes de dar algo por hecho

```bash
npm run test:todo                      # astro check + Vitest + Playwright
PW_CHANNEL=msedge npm run test:e2e     # e2e con el Edge instalado, sin descargar Chromium
```

- Lógica nueva en `src/lib/` o `src/stores/` → test unitario en `tests/unit/`.
- Página, flujo o componente interactivo nuevo → cubrirlo en `tests/e2e/` y agregar la página a `PAGINAS` de `tests/e2e/utilidades.ts` (así entra en el chequeo de responsividad).
- En e2e, usar aserciones que reintentan (`await expect(...).toBeVisible()`), no `isVisible()` inmediato, y selectores por rol o etiqueta.
- Accesibilidad: axe no debe reportar infracciones `serious` ni `critical`.

Y, cuando el cambio es visual, mirarlo además en el navegador (`astro dev --background`, URL `http://localhost:4321/farmacia-astro/`). Si no se pudo, decirlo explícitamente.

## Desarrollo

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentación de Astro

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

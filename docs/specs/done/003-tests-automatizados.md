# 003 · Tests automatizados
Estado: hecha · Fase del PLAN: 3 · Fecha: 2026-10-21

## Objetivo
Llevar al repo, como tests que se pueden repetir, lo que hoy se verifica a mano o con scripts sueltos. Correrlos en CI y que el sitio solo se publique si pasan. La verificación de la spec 002 encontró un desborde real en `/carro/`; sin tests, un cambio futuro puede volver a romperlo sin que nadie lo note.

## Alcance
Entra:
- **Tests unitarios** (Vitest) de la lógica pura y del store del carro.
- **Tests e2e** (Playwright) que reemplazan el script de verificación de la spec 002: responsividad, tema y recorrido de compra.
- **Accesibilidad automática** con axe en las páginas principales, en ambos temas.
- **CI:** los tests corren en cada push y pull request, y el deploy a Pages depende de que pasen.
- Actualizar las acciones de GitHub que avisan por Node 20 obsoleto.
- Documentar cómo correr los tests en el README y en `AGENTS.md`.

No entra:
- Regresión visual por comparación de capturas (es frágil entre sistemas operativos y fuentes).
- Cobertura mínima obligatoria.
- Tests de rendimiento o Lighthouse (fase 4).

## Diseño

### 1. Unitarios (Vitest)
- Dependencias de desarrollo: `vitest`, `happy-dom` (para `localStorage` y `window` en el store).
- `vitest.config.ts` con `getViteConfig()` de Astro, para que `import.meta.env.BASE_URL` y los alias funcionen igual que en el sitio.
- Archivos en `tests/unit/`:

| Archivo | Casos |
|---|---|
| `rut.test.ts` | Válidos con y sin puntos y guion, dígito `K` y `0`, inválidos, basura, `formatearRut` |
| `tienda.test.ts` | `costoEnvio` en 0, justo bajo, igual y sobre $25.000; `clp` con separador de miles |
| `tipos.test.ts` | `descuento` con y sin precio anterior, redondeo |
| `url.test.ts` | `url('')`, `url('productos/')` y `url('/productos/')` llevan el prefijo `/farmacia-astro/` |
| `carro.test.ts` | `agregar` suma al existente; tope de stock al agregar y al cambiar cantidad; `cambiarCantidad(0)` quita; `$resumen` separa directos y con receta, subtotal y envío; persiste en `localStorage`; JSON corrupto en `localStorage` → carro vacío sin error |
| `tema.test.ts` | `rotarTema` cicla los tres estados; aplica `data-theme` según `matchMedia`; persiste |

### 2. E2E (Playwright)
- Dependencias de desarrollo: `@playwright/test`, `@axe-core/playwright`.
- `playwright.config.ts`:
  - `webServer`: `npm run build && npm run preview` en el puerto 4322. Se prueba el build real, sin la barra de desarrollo de Astro.
  - Proyectos: `movil` (375×812) y `escritorio` (1440×900).
  - Navegador: en CI, el Chromium de Playwright; en local, el canal se puede cambiar con `PW_CHANNEL=msedge` para usar el Edge instalado (lo que se hizo en la spec 002).
- Archivos en `tests/e2e/`:

| Archivo | Qué cubre |
|---|---|
| `responsivo.spec.ts` | Las 9 páginas en 320, 375, 768, 1024 y 1440 px, en ambos temas: `scrollWidth <= innerWidth`; al fallar informa qué elementos se salen |
| `tema.spec.ts` | Sin destello (`data-theme` fijado antes del `<body>`), rotación del interruptor, persistencia al recargar, modo Sistema en vivo |
| `compra.spec.ts` | Búsqueda por `?q=`, filtros, agregar, cantidades y tope de stock, reserva con receta, checkout con errores, RUT inválido y válido, confirmación, carro vacío. En ambos proyectos y ambos temas |
| `accesibilidad.spec.ts` | axe en inicio, catálogo, producto, carro con productos y checkout, en ambos temas. Falla solo con infracciones `serious` o `critical` |

- Esperas: siempre con aserciones que reintentan (`expect(...).toBeVisible()`), nunca con `isVisible()` inmediato. En la spec 002 eso dio falsos fallos en la confirmación.
- Los selectores usan roles y etiquetas accesibles (`getByRole`, `getByLabel`) y `filter({ visible: true })` cuando hay controles duplicados para móvil y escritorio.

### 3. Scripts de npm
```
"test":        "vitest run",
"test:watch":  "vitest",
"test:e2e":    "playwright test",
"test:todo":   "npm run check && npm run test && npm run test:e2e"
```

### 4. CI (GitHub Actions)
- Nuevo job `test` en `.github/workflows/deploy.yml`, que corre en push a `main` y en pull requests:
  1. `npm ci`
  2. `npm run check`
  3. `npm run test`
  4. `npx playwright install --with-deps chromium`
  5. `npm run test:e2e`
  6. Si falla, sube el reporte HTML de Playwright como artefacto.
- `build` pasa a depender de `test` (`needs: test`), y `build`/`deploy` solo corren en push a `main`, no en pull requests.
- Actualizar `actions/checkout`, `actions/setup-node`, `withastro/action` y `actions/deploy-pages` a versiones que usen Node 24, verificando la versión vigente de cada una al implementar.

### Archivos
Nuevos: `vitest.config.ts`, `playwright.config.ts`, `tests/unit/*.test.ts`, `tests/e2e/*.spec.ts`. Modificados: `package.json`, `.github/workflows/deploy.yml`, `.gitignore` (reportes de Playwright), `README.md`, `AGENTS.md`.

## Criterios de aceptación
- [x] `npm run test` en verde: 41 tests en 4 archivos (`rut`, `tienda` con envío, precios, descuento y URLs, `carro` y `tema`).
- [x] `npm run test:e2e` en verde en local con `PW_CHANNEL=msedge`: 35 tests (10 de responsividad, 3 de tema, 12 de compra en móvil y escritorio por tema, 10 de axe).
- [x] Los tests detectan errores: con el desborde de `/carro/` reintroducido fallan 4 e2e de responsividad (320 y 375 px, ambos temas) y nombran los elementos que se salen; sin el tope de stock fallan 2 unitarios. Al restaurar, todo vuelve a verde.
- [x] axe sin infracciones `serious` ni `critical` en ambos temas, después de corregir lo que encontró (ver Resultado).
- [x] En GitHub Actions el job `test` pasa (35 e2e también en CI) y luego corren build y deploy. Ya no hay aviso de Node 20.
- [x] PR de prueba #1 con un test roto: `test` en rojo, `build` y `deploy` omitidos. Cerrado sin fusionar y rama borrada.
- [x] README y `AGENTS.md` explican cómo correr los tests y qué cubrir en cada cambio.

## Decisiones (2026-10-21)
1. El deploy se bloquea si fallan los tests.
2. Accesibilidad con axe, fallando solo con infracciones `serious` y `critical`.
3. Navegador e2e: el Chromium de Playwright por defecto (igual que CI); `PW_CHANNEL=msedge` opcional.
4. Se probó el bloqueo con un PR real (#1), cerrado sin fusionar.

## Resultado (2026-10-21)

**axe encontró 4 problemas reales**, que el cálculo de contraste de la spec 002 no cubría, y se corrigieron:
- `label-content-name-mismatch`: el botón del carro se anunciaba como "Abrir carro, N productos" pero mostraba "Carro N". Ahora el nombre sale del texto visible ("Carro 3 productos", con la palabra "productos" solo para lectores de pantalla).
- `link-name`: el enlace de la imagen en las tarjetas y en el carro no tenía nombre y duplicaba el del título. Ahora está fuera del orden de tabulación y oculto para lectores de pantalla. Lo que mostraban sus etiquetas ("Requiere receta", "-20%") se repite como texto accesible junto al nombre y el precio.
- `color-contrast`: "Pulso" del logo en `marca-600` (3,74:1) pasa a `text-acento`; "¡Últimas N unidades!" en `orange-600` (3,56:1) pasa a `orange-700`.

**Notas de implementación:**
- Vitest fija `import.meta.env.BASE_URL` en `/` aunque se use `getViteConfig`. Se pasa `test.env.BASE_URL` desde `astro.config.mjs`.
- El panel del carro cerrado sigue en el DOM, desplazado e inerte. Para Playwright es "visible", así que el test comprueba `not.toBeInViewport()`.
- Acciones actualizadas: `checkout@v7`, `setup-node@v7`, `upload-artifact@v7`, `withastro/action@v6`, `deploy-pages@v5`.

# Farmacia Pulso — plan del proyecto

Tienda en línea de una farmacia **ficticia**, hecha como proyecto de portafolio. Muestra un catálogo rápido y estático con un carro de compras real del lado del cliente.
Demo: https://alexperez7.github.io/farmacia-astro/ · Repo: https://github.com/AlexPerez7/farmacia-astro

Fecha del plan: 2026-10-21.

---

## 1. Principios

1. **Solo portafolio.** Todo es ficticio y no hay backend, pagos ni datos reales. Un cliente real necesitaría backend de comercio, pasarela de pago, autorización sanitaria y validación de recetas (fuera de alcance).
2. **Estático primero.** El HTML se genera en el build y solo se hidratan las islas interactivas. Debe funcionar en GitHub Pages.
3. **Realismo de dominio.** Se simulan las reglas de una farmacia chilena: venta directa vs. receta, RUT, despacho o retiro en sucursal.
4. **Calidad visible.** Diseño cuidado, accesible y rápido en celular, porque eso es lo que se evalúa en un portafolio.

## 2. Arquitectura

```
build (Astro) ──► HTML estático por página ──► GitHub Pages
                     │
                     └─ islas React ─┬─ Catalogo (client:load) ── Fuse.js
                                     ├─ ProductoCard / AgregarAlCarro
                                     └─ Carro*, Checkout, Confirmacion (client:only)
                                              │
                                     nanostores ($carro, $resumen) ⇄ localStorage
```

## 3. Stack

Astro 7 · React 19 · Tailwind CSS 4 · nanostores · Fuse.js · TypeScript estricto · GitHub Actions (withastro/action).

## 4. Fases

| Fase | Entregable | Estado |
|---|---|---|
| **1. MVP de tienda** | Catálogo, búsqueda y filtros, carro, checkout simulado, despliegue | hecha (spec 001) |
| **2. Calidad visual** | Modo oscuro y responsividad revisada en todos los anchos | hecha (spec 002) |
| **3. Pruebas** | Tests unitarios (Vitest), e2e y accesibilidad (Playwright + axe) en CI, deploy condicionado | propuesta (spec 003) |
| **4. Extras de portafolio** | Imágenes de producto, favoritos, historial de pedidos local, Lighthouse ≥ 95 documentado | pendiente |

## 5. Decisiones

- [x] **Nombre:** Farmacia Pulso (ficticio). 2026-10-21.
- [x] **Hosting:** GitHub Pages como sitio de proyecto (`base: '/farmacia-astro/'`). 2026-10-21.
- [x] **Productos con receta:** se reservan para retiro en sucursal y no se cobran en línea. 2026-10-21.
- [x] **Modo oscuro:** interruptor de tres estados Sistema / Claro / Oscuro (spec 002). 2026-10-21.
- [x] **Ancho mínimo soportado:** 320 px (spec 002). 2026-10-21.

## 6. Registro de trabajo

- 2026-10-21: fase 1 hecha (spec 001). 20 productos, 32 páginas estáticas, carro con nanostores, checkout simulado con validación de RUT. `astro check` 0 errores, build OK, deploy a GitHub Pages OK. Pendiente: prueba manual del carro y checkout en navegador (la extensión de Chrome no estaba conectada).
- 2026-10-21: adoptado el flujo de specs (`docs/specs/`), `AGENTS.md`, `CLAUDE.md` y este plan. Redactada la spec 002 (modo oscuro y responsividad).
- 2026-10-21: fase 2 hecha (spec 002). Colores semánticos con tema claro/oscuro, interruptor Sistema/Claro/Oscuro sin destello, 11 correcciones de responsividad. Verificado con Playwright sobre Edge: sin scroll horizontal en 9 páginas × 5 anchos × 2 temas, interruptor y recorrido de compra completo en ambos temas, contraste AA calculado. La verificación encontró y corrigió el desborde de `/carro/` en el celular y dos contrastes insuficientes. Cierra la prueba en navegador pendiente de la spec 001. Siguiente: fase 3 (tests automatizados en el repo).
- 2026-10-21: push de las specs 001-002 y deploy. Redactada la spec 003 (tests automatizados).

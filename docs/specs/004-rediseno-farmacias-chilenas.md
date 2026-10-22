# 004 · Rediseño inspirado en farmacias chilenas
Estado: propuesta · Fase del PLAN: 4 · Fecha: 2026-10-21

## Objetivo
Que Farmacia Pulso se vea y se use como una farmacia en línea chilena real, tomando los **patrones** comunes de Cruz Verde, Farmacias Ahumada y Salcobrand (revisados el 2026-10-21). Hoy el sitio parece una tienda genérica: le faltan el menú de categorías, la comuna de despacho, las ofertas con vigencia, el precio por unidad y la información sanitaria que esos sitios muestran.

## Principio: inspiración, no copia
- Se toman **patrones** de diseño y de negocio, no la identidad: nada de logos, nombres de programas ("Club…", "…Contigo", "Mi…"), eslóganes, textos ni fotos de esos sitios.
- Se mantiene la paleta propia (verde azulado `marca`), distinta del verde, rojo y azul de esas marcas.
- Las marcas de producto siguen siendo ficticias (Laboratorio Andes, Dermalux…). Nada de marcas reales como ISDIN o Eucerin, aunque aparezcan en las referencias.
- Los banners se dibujan con CSS y SVG. No se usan fotos.

## Qué se observó (resumen)
| Patrón | Dónde | ¿Entra? |
|---|---|---|
| Barra de aviso arriba ("Despacho gratis sobre $X", cerrable) | Los tres | Sí (ya existe; se hace cerrable) |
| Botón "Menú de categorías" que abre un menú grande | Los tres | Sí |
| Selector de comuna con aviso "te asignamos esta comuna" | Los tres | Sí |
| Franja de servicios (seguimiento de pedido, sucursales, venta telefónica) | Cruz Verde, Ahumada | Sí, reducida |
| Carrusel de banners con flechas y puntos | Los tres | Sí |
| Grilla de categorías con ícono | Ahumada | Sí (ya existe; se ajusta) |
| Carruseles de productos por sección ("Destacados", "Ofertas") | Los tres | Sí |
| Oferta relámpago con cuenta regresiva | Cruz Verde | Sí |
| Promos por día ("Todos los miércoles") y vigencia ("Hasta el 27 de octubre") | Ahumada, Salcobrand | Sí |
| Precio por unidad de medida en la tarjeta ($ x Lt, $ x unidad) | Ahumada | Sí: es obligatorio en Chile |
| "Precio ref." / precio normal tachado | Salcobrand | Sí (ya existe; se ajusta el texto) |
| Favoritos | Ahumada | Sí |
| Fila de servicios (stock en locales, locales abiertos, retiro el mismo día) | Salcobrand | Sí |
| Información sanitaria (uso racional, venta directa vs. receta) | Salcobrand | Sí |
| Programas de fidelización, cuentas de usuario, telemedicina, recetario | Varios | **No** (fuera de un sitio estático ficticio) |
| Banner de cookies | Varios | **No** (el sitio no usa cookies) |

## Alcance
Se entrega en dos partes, cada una verificable por separado y con su propio commit.

### Parte A · Navegación (header, menú y footer)
1. **Barra de aviso cerrable.** Rota 2 o 3 mensajes (despacho gratis, retiro el mismo día, sitio de demostración). Al cerrarla, la elección se recuerda.
2. **Header principal:** logo · botón **"Categorías"** · buscador · **comuna** · favoritos · carro.
3. **Menú de categorías:**
   - En escritorio, un panel que se despliega bajo el header, con categorías a la izquierda y subcategorías o productos destacados a la derecha.
   - En el celular, un panel lateral desde la izquierda.
   - Accesible: se abre y cierra con teclado, Esc lo cierra y el foco vuelve al botón.
4. **Buscador con sugerencias.** Mientras escribes muestra hasta 5 productos (con precio) y las categorías que coinciden. Se navega con flechas y Enter; Enter sin selección va a `productos/?q=`. Usa el mismo Fuse.js del catálogo.
5. **Selector de comuna.**
   - La primera visita asigna una comuna por defecto y muestra un aviso pequeño ("Te asignamos Providencia, ¿quieres cambiarla?") con *Mantener* y *Cambiar*.
   - La comuna elegida se usa en la tarjeta y la página de producto ("Llega mañana a Ñuñoa" o "Retiro hoy en Sucursal Ñuñoa") y se precarga en el checkout.
   - Las fechas de entrega son reglas ficticias por comuna.
6. **Franja de servicios** bajo el header: Seguimiento de pedido · Sucursales · Reserva con receta.
   - *Seguimiento de pedido* es una página nueva: ingresas el número de pedido (los que genera el checkout, guardados en el navegador) y muestra un estado simulado por etapas.
   - *Sucursales* es una página nueva con las 3 sucursales ficticias, horarios y "abierta ahora/cerrada", calculado con la hora local.
7. **Footer completo:**
   - Columnas: Ayuda, La farmacia, Legal (páginas simples de texto ficticio) y Medios de pago (íconos genéricos, sin logos de marcas).
   - Químico farmacéutico responsable y número de resolución sanitaria (ficticios, marcados como tales).
   - Se mantiene el aviso de proyecto de portafolio.

### Parte B · Inicio comercial y tarjetas
1. **Carrusel de banners** (3 a 5 slides dibujados con CSS y SVG):
   - Flechas, puntos y botón de pausa.
   - Avance automático que se detiene al pasar el mouse o al tener el foco, y que no corre con `prefers-reduced-motion`.
   - Se desliza con el dedo en el celular.
2. **Fila de servicios** con íconos: Stock en sucursal · Retiro el mismo día · Reserva con receta · Despacho gratis sobre $25.000.
3. **Oferta relámpago:** una sección con cuenta regresiva hasta la medianoche (se reinicia cada día) y 4 productos con descuento extra.
4. **Carruseles de productos** por sección: Ofertas, Más vendidos y Dermocosmética. Desplazamiento horizontal con *scroll-snap*, flechas en escritorio y deslizamiento en el celular.
5. **Grilla de promociones** con 3 banners: una promo por día de la semana ("Todos los miércoles: 20% en vitaminas") y dos promos con fecha de vigencia.
6. **Bloque de información sanitaria:** uso racional de medicamentos y diferencia entre venta directa y con receta (textos propios y breves).
7. **Tarjeta de producto renovada:**
   - Cinta de descuento.
   - "Precio normal" tachado y precio oferta destacado.
   - **Precio por unidad de medida** ("$80 x comprimido", "$32 x ml").
   - Corazón de favoritos.
   - Etiqueta **Bioequivalente** (la franja amarilla que se usa en Chile) en los genéricos que corresponda.
   - "Oferta válida hasta DD-MM" cuando aplique.
   - Mismo botón Agregar/Reservar que hoy.
8. **Página de producto:** precio por unidad, bioequivalente, disponibilidad por sucursal (ficticia), estimación de entrega según la comuna y favoritos.
9. **Página de favoritos** (`favoritos/`), guardada en el navegador, con su contador en el header.

### No entra
Cuentas de usuario, programas de puntos, telemedicina, recetas digitales, banner de cookies, fotos de producto, cambios en el checkout más allá de precargar la comuna.

## Diseño (datos y archivos)
- **Esquema de productos** (`src/content.config.ts`), campos nuevos:
  - `contenido` (número) y `unidad` (`'comprimido' | 'cápsula' | 'ml' | 'g' | 'unidad'`), para el precio por unidad;
  - `bioequivalente` (boolean);
  - `ofertaHasta` (fecha opcional);
  - `subcategoria` (texto), para el menú;
  - `masVendido` (boolean).
- **Catálogo:** pasar de 20 a unos 40 productos ficticios, para que los carruseles y el menú no se vean vacíos.
- **Stores nuevos:** `src/stores/comuna.ts`, `src/stores/favoritos.ts` y `src/stores/pedidos.ts` (historial de pedidos para el seguimiento). Todos con `localStorage` y `try/catch`, igual que el carro.
- **Componentes nuevos** (islas React donde haya interacción):
  - Parte A: `BarraAviso`, `MenuCategorias`, `BuscadorSugerencias`, `SelectorComuna`, `BotonFavorito`.
  - Parte B: `CarruselBanners`, `CarruselProductos`, `OfertaRelampago`.
  - El resto es Astro estático.
- **Páginas nuevas:** `favoritos/`, `seguimiento/`, `sucursales/`, y `ayuda/`, `terminos/`, `privacidad/` (texto breve ficticio).
- **Lógica pura** en `src/lib/` (precio por unidad, estimación de entrega, horario de sucursal, fin de la oferta relámpago), con tests unitarios.

## Criterios de aceptación
- [ ] `npm run test:todo` en verde, con tests nuevos:
  - unitarios de precio por unidad, estimación de entrega, horario de sucursal, cuenta regresiva y los stores de comuna, favoritos y pedidos;
  - e2e del menú de categorías (mouse y teclado), las sugerencias del buscador (flechas y Enter), el cambio de comuna reflejado en producto y checkout, favoritos, el carrusel (flechas, puntos y pausa) y el seguimiento de un pedido recién hecho.
- [ ] Las páginas nuevas entran en el chequeo de responsividad (320–1440 px, ambos temas) y en axe, sin infracciones graves.
- [ ] Con `prefers-reduced-motion`, el carrusel no avanza solo y no hay animaciones de desplazamiento.
- [ ] Ningún logo, nombre de programa, texto ni foto de las farmacias de referencia; `grep` de sus nombres en `src/` sin resultados.
- [ ] Revisión visual en el navegador de ambas partes, en celular y escritorio, en ambos temas. Capturas del README actualizadas.

## Preguntas abiertas
1. **¿Dos partes con commits separados (A navegación, B inicio y tarjetas)?** Recomiendo que sí: el cambio es grande y así cada parte se revisa sola.
2. **¿Ampliar el catálogo a unos 40 productos?** Recomiendo que sí: con 20, los carruseles y el menú de categorías quedan pobres.
3. **¿Etiqueta Bioequivalente?** Es un detalle muy chileno y realista. Recomiendo incluirla, solo en genéricos ficticios.
4. **¿Teléfonos reales de emergencia toxicológica** (como hace Salcobrand con CITUC) en el bloque sanitario? Recomiendo **no**: en un sitio ficticio es mejor no publicar números reales que alguien podría tomar como servicio del sitio. En su lugar, un texto genérico ("ante una intoxicación, llama al centro de información toxicológica de tu país").

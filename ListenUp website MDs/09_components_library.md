# 09 · Librería de componentes

## Globales
- **Logo + eq** — logo blanco con ecualizador animado (5 barras, azul/coral). Firma de marca; clic → inicio.
- **Botones** — `primary` (coral), `secondary`/`ghost` (borde claro), `blue` (azul). Pill, con flecha animada en hover.
- **Eyebrow** — etiqueta superior en mayúsculas, tracking amplio, color azul brillante.
- **Grano** — overlay de ruido SVG sutil sobre fondos.

## Sitio
- **Header** sticky con nav + CTA + burger; **Mobile menu** full-screen.
- **Stat band** — fila de cifras grandes con etiqueta.
- **Event card** — tema, fecha, sede, CTA (alturas alineadas).
- **Past edition card** — portada (object-fit consistente) + CTA "Ver el evento".
- **Gallery tile** — imagen cuadrada uniforme.
- **Pillar card** — ícono + título + texto.
- **Feature block** — foto + mensaje.
- **Timeline** — hitos 2023→hoy.
- **Resource/blog card** (en `#recursos`) — enlace a `/blog`.
- **Dual band** — dos columnas (patrocinio / comunidad).
- **Benefit list** — beneficios de patrocinio (sin precios).
- **Team card** — nombre, rol, marcas.
- **Accordion** (FAQ).
- **Newsletter / final CTA** — fondo gradiente + grano, input + botón.
- **Footer.**

## Blog
- **Blog hero** + **filtros** (chips por etapa).
- **bcard** — tarjeta de artículo (número, título, ICP, tiempo, "Leer artículo →"). **Sin badge de estado.**
- **post-cover** — portada azul con líneas de señal, logo+eq, categoría, título.
- **post-meta** — autor · tiempo · etapa.
- **summary** — bloque "En resumen" (5–6 bullets).
- **audience** — bloque "¿Para quién es este artículo?".
- **callout** y **pullquote**.
- **Figuras on-brand** (con logo/eq en esquina):
  - `flow` — pasos con flechas.
  - `compare` — dos columnas (a favor/encontra, antes/ahora, etc.).
  - `fgrid` — rejilla de ítems con ícono.
  - `check` — lista con casillas (checklist).
  - `catmap` — mapa de categorías/términos.
- **post-cta** — CTA de comunidad.
- **seo** — ficha colapsable (title, meta, slug, keywords).
- **related** — "Sigue aprendiendo" (bcards).

## Estados
- Hover/Focus en tarjetas y botones; foco visible siempre.
- Reduced-motion: desactiva eq y animaciones de reveal.

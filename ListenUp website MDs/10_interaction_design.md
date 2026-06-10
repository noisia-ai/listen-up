# 10 · Diseño de interacción

## Animaciones de marca
- **Ecualizador (eq):** barras que oscilan (azul/coral) junto al logo. Loop sutil. Se detiene con `prefers-reduced-motion`.
- **Líneas de señal:** patrón en portadas/hero; estático (no distrae).
- **Grano:** overlay fijo; sin animación.
- **Reveal on scroll:** entradas suaves (fade/translate) en secciones y tarjetas; desactivable por reduced-motion.

## Navegación del sitio
- Scroll suave entre anclas; header sticky con leve cambio de fondo al hacer scroll.
- Marquee/desplazamiento de marcas (si aplica): pausa en hover; respeta reduced-motion.

## Blog
- **Filtros por etapa:** muestran/ocultan secciones; chip activo resaltado.
- **Router de artículo:**
  - **Maqueta:** navegación en página (mostrar/ocultar) vía JS; botón "Volver al blog".
  - **Producción:** rutas reales `/blog/[slug]`; cada artículo es una URL navegable y compartible.
- **Deep-linking (recomendado):** soportar apertura directa por URL/hash (p. ej. leer `#post-N` o `?post=slug` al cargar) para que el sitio enlace a artículos concretos y el botón "atrás" del navegador funcione.
- **Relacionados:** las bcards de "Sigue aprendiendo" abren el artículo correspondiente.
- **Ficha SEO:** acordeón `<details>` colapsado por defecto.

## Formularios
- Validación de email en cliente; estados de éxito/error inline; sin recargar.

## Accesibilidad de interacción
- Foco visible en todos los interactivos.
- Acordeones y menús operables por teclado, con `aria-expanded`.
- Contraste AA en ambos temas (oscuro del sitio y claro de lectura del blog).

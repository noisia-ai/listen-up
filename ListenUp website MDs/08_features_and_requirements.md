# 08 · Funcionalidad y requerimientos (épicas)

## E1 · Home / Comunidad
- Hero con CTAs; stats band; pilares; feature; historia (timeline).
- Header sticky + menú móvil; scroll suave por anclas.

## E2 · Eventos
- Tarjetas 2026 (5.0, 6.0) con tema, fecha, sede y CTA; alturas de CTA alineadas.
- Ediciones pasadas con portada + CTA de video.
- Galería de 6 fotos (cuadradas, uniformes).
- **Req.:** captura de registro (evento) y de "novedades" (6.0).

## E3 · Patrocinios (sin precios)
- Sección de **beneficios** (no tiers, no montos).
- CTA de contacto para patrocinio.

## E4 · Equipo
- 4 perfiles con rol y representaciones de marca.
- **Req.:** confirmar Daniel Torpide *(validar)*.

## E5 · Captación / Newsletter
- Formularios de email (hero, dual, CTA final) → una sola lista.
- Validación de email; mensajes de éxito/error inline.

## E6 · Blog (NUEVA)
- **Índice** con filtros por etapa (Fundamentos, Awareness, Consideration, Decision); **sin estados** (todo abierto).
- **34 artículos** con plantilla fija (resumen, "¿para quién?", cuerpo, gráficas on-brand, CTA, ficha SEO, relacionados).
- **Gráficas inline** reutilizables: `flow`, `compare`, `fgrid`, `check`, `catmap` (cada una con logo/eq).
- **Deep-linking** a artículos por URL (`/blog/[slug]`); relacionados navegables.
- **SEO por post** (ver doc 12); regla **sin porcentajes**.
- CTA de comunidad en el índice (idéntico a la landing).

## E7 · FAQ
- Acordeón accesible (teclado + aria).

## Requerimientos no funcionales
- **Rendimiento:** imágenes optimizadas; carga rápida en móvil.
- **Accesibilidad:** contraste AA, foco visible, navegación por teclado, `prefers-reduced-motion`.
- **Responsive:** desde 360px.
- **i18n:** español de México por defecto.
- **Eliminado:** todo lo relativo al GTM Program.

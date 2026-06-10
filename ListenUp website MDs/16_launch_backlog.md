# 16 · Backlog de lanzamiento

## MVP (v1.0)
- Home one-page completa (hero, stats, eventos 2026, ediciones pasadas, galería, qué es, feature, historia, dual band, patrocinios beneficios, equipo, FAQ, CTA final).
- Captura de email funcional (una lista) + registro a evento 5.0 / novedades 6.0.
- **Blog:** índice con filtros + los **34 artículos** publicados con plantilla final.
- SEO base (titles/metas, sitemap, schema Organization/Event/BlogPosting/FAQ).
- Analítica básica (pageviews, CTAs, altas).

## v1.1
- **Deep-linking** completo del blog (`/blog/[slug]`) y enlace de los destacados del sitio a su artículo.
- Links de video de ediciones pasadas.
- Newsletter conectado a herramienta de email/CRM real.
- Datos estructurados ampliados + Open Graph por artículo.

## v1.2
- Validación de keywords y ajuste SEO con datos reales (Semrush/Ahrefs).
- Mejora de imágenes (WebP/AVIF, `next/image`).
- Más artículos / cadencia editorial mensual.
- Métricas de lectura (read, scroll-depth) y dashboard.

## Preguntas críticas pendientes (a resolver antes/durante el build)
1. **Equipo:** ¿confirmamos "**Daniel Torpide**" (nombre, rol, foto)?
2. **Videos:** ¿links de las ediciones pasadas (1.0–4.0)?
3. **Fechas:** ¿confirmamos 5.0 = 13 ago 2026 y 6.0 = 1ª semana dic 2026?
4. **Herramientas:** ¿qué CRM/email usamos para capturar miembros y leads?
5. **Dominio y hosting:** ¿dominio definitivo? (recomendado Vercel).
6. **Legal:** ¿quién provee aviso de privacidad/términos?
7. **SEO:** ¿validamos volúmenes de keywords antes de publicar?

## Siguiente mejor paso
Confirmar los 7 puntos anteriores (sobre todo Daniel, fechas y herramienta de captura) y elegir CMS + dominio. Con eso, se arranca el build sobre Next.js + CMS headless usando estos 16 documentos y las maquetas (`listenup_sitio.html`, `listenup_blog.html`) como fuente de verdad.

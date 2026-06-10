# 03 · Arquitectura del sitio

## Estructura general
Dos piezas que se comportan como un solo sitio:
1. **Sitio principal** — landing one-page con navegación por anclas.
2. **Blog** — sección propia con índice y 34 artículos.

> En la maqueta son dos archivos (`listenup_sitio.html`, `listenup_blog.html`) enlazados por ruta relativa. **En producción** se sirven bajo un mismo dominio con rutas reales (abajo).

## Mapa del sitio principal (anclas)
`/` → Home con secciones:
`#inicio` (hero) · stats · eventos gratis (strip) · `#eventos` (2026) · ediciones pasadas · galería · `#comunidad` (qué es) · feature · `#historia` · `#recursos` (blog teaser) · cómo participar (dual) · `#patrocinios` · `#equipo` · FAQ · `#unete` (CTA final) · footer.

## Rutas del blog (producción)
- `/blog` — índice con filtros por etapa (Fundamentos, Awareness, Consideration, Decision).
- `/blog/[slug]` — 34 artículos, uno por slug (lista de slugs en doc 12).

Ejemplos: `/blog/que-es-social-listening`, `/blog/tendencias-social-intelligence-2027-latam`, `/blog/roi-social-intelligence`.

## Navegación
- **Header (desktop):** Eventos · Comunidad · Historia · **Blog** · Patrocinios · Equipo · botón **Únete**.
- **Header (móvil):** mismo set en menú hamburguesa.
- **Footer:** repetición de navegación + redes + aviso de privacidad *(pendiente)*.

## Enlaces entre piezas
- Del sitio al blog: menú "Blog" y sección "Recursos" → `/blog`.
- **Deep-linking (recomendado, ver doc 10):** habilitar que el sitio enlace a artículos concretos (`/blog/[slug]`), y que el índice del blog abra cada post por URL propia. En la maqueta esto aún se navega por JS; en producción son URLs reales.

## Reglas
- One-page para el sitio: scroll suave entre anclas; header sticky.
- El blog vive en su propia plantilla con tema de lectura claro.

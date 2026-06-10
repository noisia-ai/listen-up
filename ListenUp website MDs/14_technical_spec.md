# 14 · Especificación técnica

## Stack recomendado
- **Framework:** Next.js (React) con renderizado estático/ISR para SEO.
- **Estilos:** CSS con variables (tokens del doc 11) o Tailwind con tokens equivalentes; fuentes vía Google Fonts (Schibsted Grotesk + Hanken Grotesk).
- **CMS headless** para el blog (Sanity/Contentful/Strapi, a elegir) — permite editar los 34 posts sin tocar código.
- **Hosting:** Vercel (o equivalente con CDN y edge).
- **Formularios/email:** integración con proveedor de email/CRM (ver doc 16).

## Rutas
- `/` (home one-page con anclas).
- `/blog` (índice con filtros).
- `/blog/[slug]` (34 artículos; deep-linking real).

## Modelo de datos — Post (CMS)
```
Post {
  title: string
  slug: string                 // ej. que-es-social-listening
  stage: 'fundamentos' | 'awareness' | 'consideration' | 'decision'
  icp: string                  // "¿para quién es?"
  readingMin: number
  summaryBullets: string[]     // 5–6
  audience: string             // bloque "¿Para quién es este artículo?"
  body: RichText               // h2/h3, callouts, pull-quotes
  figures: Figure[]            // tipo: flow | compare | fgrid | check | catmap
  seo: { title, description, keywords[] }
  author: string               // "Equipo ListenUp!"
  publishedAt: date
}
Figure { type, title, caption?, items/cols/steps... }
```

## Modelo — Event (CMS)
```
Event { name, edition, date, city, topic, status: 'upcoming'|'past', ctaLabel, videoUrl?, coverImage? }
```

## Imágenes
- Servir en formatos modernos (WebP/AVIF) con tamaños responsivos.
- En la maqueta las imágenes van embebidas en base64; **en producción** usar archivos optimizados + `next/image`.
- HEIC de origen → convertir a JPG/WebP en pipeline de build.

## Interacción
- Filtros del blog (cliente) + rutas reales por artículo (servidor).
- Deep-linking: cada `/blog/[slug]` carga su contenido; relacionados como enlaces.
- `prefers-reduced-motion` para eq/reveals.

## Rendimiento y calidad
- Objetivo Lighthouse alto en móvil; lazy-load de imágenes; CSS crítico inline.
- Accesibilidad AA (contraste, foco, aria en acordeones/menús).

## Seguridad/legales *(pendiente)*
- Aviso de privacidad y términos; consentimiento de cookies; protección de formularios (anti-spam).

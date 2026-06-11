# ListenUp! Website Handoff — Next Steps

Fecha: 2026-06-11  
Repo: `noisia-ai/listen-up`  
Stack actual: sitio estatico en `index.html`, `styles.css`, `script.js`, assets locales en `assets/`.  
Deploy: GitHub Pages en `main`; Vercel conectado al proyecto `listen-up`.

## Estado actual

El sitio profesional ya esta implementado como landing estatica responsive. Incluye:

- Hero principal con navbar sticky, cintillo de evento y CTAs.
- Secciones de stats, eventos 2026, ediciones pasadas, comunidad, historia, recursos, patrocinios, equipo, FAQ y CTA final.
- Tipografia Google Sans desde Google Fonts.
- Ajustes recientes de spacing: hero centrado, secciones compactadas, feature band centrado verticalmente.
- Equipo enriquecido con rol, bio, LinkedIn y foto/avatar local.
- Dominio en proceso/conectado via Vercel con DNS de GoDaddy apuntando a Vercel.

## Material de referencia agregado

Los 34 blogs quedaron versionados como referencia en:

`ListenUp website MDs/ListenUp_blogs/`

Incluye:

- `00_INDEX.md`: inventario de los 34 articulos, etapas, titulos y slugs.
- `01_...md` a `34_...md`: articulos completos en Markdown con front matter YAML.
- `listenup_blog_markdown.zip`: ZIP original de respaldo.

Cada articulo trae campos listos para CMS:

```yaml
title:
slug:
stage:
reading_min:
author:
seo_title:
seo_description:
keywords:
```

## Prioridad 1: Hero card para ListenUp! 5.0

Agregar dentro del hero principal una card compacta/prominente para el evento ListenUp! 5.0.

Contenido sugerido:

- Badge: `Registro abierto`
- Titulo: `ListenUp! 5.0`
- Subtitulo: `Buen Fin & Black Friday: como piensa el consumidor mexicano.`
- Fecha: `13 de agosto de 2026`
- Ubicacion: `CDMX`
- CTA principal: `Unirme al evento`

Comportamiento:

- El CTA debe llevar al formulario del evento, idealmente `/eventos/listenup-5-0/` o `#registro-listenup-5`.
- En desktop, la card puede vivir dentro del hero a la derecha o como modulo superpuesto inferior derecho, sin tapar el headline.
- En mobile, la card debe aparecer debajo del copy del hero y antes de stats, con CTA visible sin hacer scroll excesivo.
- Mantener el estilo ListenUp: fondo oscuro, borde sutil, acento coral para registro abierto, azul para metadata.

Criterios de aceptacion:

- La card se ve en el primer viewport desktop sin competir con el H1.
- En mobile no genera overflow horizontal.
- El CTA navega al formulario correcto.
- El hero conserva balance vertical arriba/abajo.

## Prioridad 2: Formulario de registro + Save the date

Implementar una pagina/seccion de registro para ListenUp! 5.0 con diseno propio.

Ruta recomendada:

- `/eventos/listenup-5-0/`

Campos minimos:

- Nombre completo
- Email
- Empresa
- Puesto/rol
- LinkedIn opcional
- Ciudad
- Checkbox de consentimiento: recibir comunicaciones de ListenUp!

Flujo esperado:

1. Usuario llena el formulario.
2. Submit manda datos a un endpoint backend.
3. Usuario recibe correo de confirmacion con "Save the date".
4. Equipo ListenUp recibe correo interno con los datos del registro.
5. Pantalla muestra estado de exito con copy claro.

Implementacion recomendada en Vercel:

- Crear serverless function `api/event-registration.js`.
- Usar **Resend API** como proveedor unico de envio transaccional.
- Instalar el SDK oficial:

```bash
npm install resend
```

- Importar el cliente en la serverless function:

```js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
```

- Enviar dos correos desde el endpoint:
  - `resend.emails.send(...)` al asistente.
  - `resend.emails.send(...)` al equipo ListenUp.
- Guardar secretos como environment variables en Vercel, no en el repo.
- Verificar en Resend el dominio remitente antes de production. Resend requiere API key y dominio verificado para enviar desde un dominio propio.

Variables sugeridas:

```txt
RESEND_API_KEY=
EVENT_FROM_EMAIL=ListenUp! <hola@listenuplatam.com>
EVENT_NOTIFY_EMAIL=
EVENT_REPLY_TO=hola@listenuplatam.com
EVENT_NAME=ListenUp! 5.0
EVENT_DATE=2026-08-13
EVENT_CITY=CDMX
```

Correos:

- Para asistente:
  - Subject: `Tu lugar para ListenUp! 5.0`
  - Incluir resumen del evento.
  - Incluir boton y adjunto `.ics` para "Save the date".
  - Generar el `.ics` en el endpoint y enviarlo con Resend como attachment usando `filename` y `content` en Base64.
  - Incluir nota: cupo limitado, confirmacion final sujeta a disponibilidad si aplica.
- Para equipo:
  - Subject: `Nuevo registro ListenUp! 5.0`
  - Incluir todos los campos enviados.
  - Incluir timestamp y source page.
  - Usar `reply_to` con el email del asistente para poder responderle facil desde la notificacion interna.

Notas tecnicas:

- Validar email en frontend y backend.
- Deshabilitar boton mientras envia.
- Mostrar error inline, no `alert()`.
- Agregar honeypot anti-spam.
- No guardar datos personales en logs publicos.
- Si se decide guardar leads, usar Airtable, Google Sheets API, Supabase o Vercel KV; documentar consentimiento.
- Manejar errores de Resend devolviendo un mensaje seguro al frontend y registrando solo metadata no sensible.
- Revisar en Resend dashboard que ambos correos aparezcan como enviados/entregados durante QA.

Criterios de aceptacion:

- Registro exitoso dispara dos correos.
- El correo al usuario incluye CTA o adjunto de calendario.
- El formulario funciona en Vercel production.
- El dominio remitente esta verificado en Resend.
- Los errores se ven bien en mobile.
- No hay secretos en Git.

## Prioridad 3: Implementar los 34 blogs

Objetivo: convertir los markdown de referencia en una seccion de blog navegable, indexable y consistente con el sitio.

Fuente:

`ListenUp website MDs/ListenUp_blogs/*.md`

Rutas esperadas:

- `/blog/`
- `/blog/que-es-social-listening/`
- `/blog/quien-usa-social-listening/`
- ... hasta los 34 slugs listados en `00_INDEX.md`.

Enfoque recomendado para mantener el sitio simple:

1. Crear carpeta canonical de contenido:
   - `content/blog/*.md`
   - Copiar ahi los 34 articulos definitivos desde `ListenUp website MDs/ListenUp_blogs/`.
2. Agregar un script de build:
   - `scripts/build-blog.mjs`
   - Leer front matter YAML.
   - Convertir Markdown a HTML.
   - Generar `blog/index.html`.
   - Generar `blog/{slug}/index.html`.
3. Agregar dependencias si se usa Node:
   - `gray-matter`
   - `marked` o `markdown-it`
4. Agregar `package.json` con:
   - `build`: genera blog y deja `index.html` intacto.
5. Configurar Vercel:
   - Build Command: `npm run build`
   - Output Directory: `.`

Tambien se puede implementar sin build step generando HTML estatico una sola vez, pero el script es preferible para mantener los MDs como fuente de verdad.

Blog index:

- Agrupar por etapa: Fundamentos, Awareness, Consideration, Decision.
- Mostrar titulo, descripcion SEO o excerpt, lectura, stage y CTA.
- Agregar busqueda/filtro simple por etapa si hay tiempo.

Plantilla de articulo:

- Header con stage, lectura y autor.
- H1 desde `title`.
- SEO title/description desde front matter.
- Tabla de contenido opcional.
- Callouts del Markdown convertidos a bloques on-brand.
- Bloques de "Grafica on-brand" tratados como placeholder visual para futura infografia.
- CTA al final:
  - `Unirme a ListenUp!`
  - `Ver ListenUp! 5.0`

SEO:

- `title` y meta description por articulo.
- Canonical por slug.
- Open Graph por articulo.
- Agregar `sitemap.xml` con home, blog index y 34 articulos.
- Agregar `robots.txt`.
- Enlazar `Blog` del navbar a `/blog/`.

Criterios de aceptacion:

- Los 34 articulos tienen pagina publica.
- `/blog/` lista los 34 articulos.
- Cada articulo usa su metadata del front matter.
- No hay links rotos internos.
- El sitio sigue funcionando en GitHub Pages y Vercel.
- Mobile sin overflow.

## Pendientes editoriales

- Confirmar fotos reales de David Alfaro y Juan Carlos "Yeici" Rodriguez si se quieren reemplazar los avatares editoriales.
- Confirmar si el nombre publico correcto es `Daniel Topete` o si debe mostrarse como `Daniel Torpide`. En la implementacion actual se dejo `Daniel Topete` por fuentes publicas relacionadas con Holograma Digital/Buzzmonitor.
- Confirmar email remitente final para transaccionales: recomendado `hola@listenuplatam.com`.
- Confirmar lugar exacto de ListenUp! 5.0, cupo y politica de confirmacion.
- Definir herramienta para almacenar registros si no basta solo con correos.

## QA antes de publicar cambios

- Probar desktop: 1440x900.
- Probar mobile: 390x844.
- Verificar que no haya overflow horizontal.
- Verificar Lighthouse basico: Performance, Accessibility, SEO.
- Probar formulario con caso exito y caso error.
- Probar entrega de correos en Gmail/Outlook.
- Confirmar que Vercel no expone variables de entorno.
- Confirmar que `/blog/` y articulos responden 200.

## Comandos utiles

```bash
git status
python3 -m http.server 4173
```

Abrir preview local:

```txt
http://localhost:4173/
```

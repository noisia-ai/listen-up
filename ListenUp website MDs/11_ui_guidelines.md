# 11 · Guía de UI (sistema visual final)

> Reemplaza cualquier dirección previa (la exploración oscura/lima quedó **descartada**). Esta es la marca real, ya validada en maqueta.

## Tokens de color (CSS)
```css
:root{
  --ink:#06060C;        /* base */
  --surface:#0E0E1A;    /* superficies */
  --surface-2:#15152A;
  --line:#262640;       /* bordes */
  --blue:#2D2BEF;       /* azul eléctrico (estructural) */
  --blue-bright:#5A6BFF;
  --blue-deep:#1A18C9;
  --coral:#F2576C;      /* acento / CTA */
  --coral-bright:#FF6E80;
  --text:#FFFFFF;
  --muted:#AFAFC8;
  --dim:#767692;
  /* Tema de lectura del blog (papel) */
  --paper:#F5F3EC; --paper-2:#FFFFFF; --paper-line:#E4E0D4;
  --paper-ink:#1A1A24; --paper-mut:#55556A;
}
```
**Uso:** azul = estructura/links/figuras; **coral = CTA principal y acentos**; base oscura en todo el sitio; **papel** solo en el cuerpo de los artículos del blog.

## Tipografía
- **Display:** Schibsted Grotesk (500–900).
- **Texto:** Hanken Grotesk (400–700).
- Google Fonts. Títulos con tracking ligeramente negativo; eyebrows en mayúsculas con tracking amplio.

## Texturas y motivos
- **Grano:** overlay de ruido SVG (feTurbulence) a baja opacidad sobre fondos oscuros y gradientes.
- **Líneas de señal:** patrón radial/curvas en hero y portadas.
- **Gradiente de marca:** azul (usado en CTA final y portadas).

## Logo
- Versión **blanca** sobre fondos oscuros; siempre acompañado del **eq** (ecualizador).
- No deformar, no recolorear; respetar área de protección.

## Forma y espaciado
- Radios generosos (pill en botones; ~14–22px en tarjetas).
- Bordes sutiles (`--line`) en tarjetas oscuras; en papel, `--paper-line`.

## Tema de lectura (blog)
- Cuerpo del artículo en fondo papel con texto `--paper-ink`.
- H2 en `--blue-deep`; callouts en lila claro; pull-quotes con reglas arriba/abajo.
- Portada y navegación permanecen en la marca oscura.

## Accesibilidad
- Contraste AA mínimo en textos.
- Foco visible; estados hover/active claros.
- Respetar `prefers-reduced-motion`.

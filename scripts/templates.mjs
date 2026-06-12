import { SITE_URL } from "./config.mjs";

export function siteHead({ title, description, canonicalPath, ogType, root }) {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const ogImage = `${SITE_URL}/assets/hero-community.jpg`;

  return `<meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="${root}styles.css" />`;
}

export function siteHeader(root) {
  return `<a class="skip-link" href="#contenido">Saltar al contenido</a>

    <div class="announce" role="status">
      <span class="announce__dot" aria-hidden="true"></span>
      <a href="${root}eventos/listenup-5-0/">ListenUp! 5.0 llega a CDMX el 13 de agosto de 2026</a>
    </div>

    <header class="site-header" id="siteHeader">
      <div class="container header-grid">
        <a class="brand" href="${root}#inicio" aria-label="ListenUp! inicio">
          <img src="${root}assets/listenup-logo-white.svg" alt="ListenUp!" width="112" height="88" />
        </a>

        <nav class="desktop-nav" aria-label="Navegacion principal">
          <a href="${root}#eventos">Eventos</a>
          <a href="${root}#comunidad">Comunidad</a>
          <a href="${root}#historia">Historia</a>
          <a href="${root}blog/">Blog</a>
          <a href="${root}#patrocinios">Patrocinios</a>
          <a href="${root}#equipo">Equipo</a>
        </nav>

        <div class="header-actions">
          <a class="button button--small button--primary" href="${root}#unete">Unete</a>
          <button class="menu-button" type="button" id="menuButton" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobileMenu">
            <span></span><span></span>
          </button>
        </div>
      </div>

      <nav class="mobile-menu" id="mobileMenu" aria-label="Menu movil">
        <a href="${root}#eventos">Eventos</a>
        <a href="${root}#comunidad">Comunidad</a>
        <a href="${root}#historia">Historia</a>
        <a href="${root}blog/">Blog</a>
        <a href="${root}#patrocinios">Patrocinios</a>
        <a href="${root}#equipo">Equipo</a>
        <a class="button button--primary" href="${root}#unete">Unete a la comunidad</a>
      </nav>
    </header>`;
}

export function siteFooter(root) {
  return `<footer class="footer">
      <div class="container footer-grid">
        <div>
          <a class="brand footer-brand" href="${root}#inicio" aria-label="ListenUp! inicio">
            <img src="${root}assets/listenup-logo-white.svg" alt="ListenUp!" width="96" height="75" />
          </a>
          <p>La comunidad de Social Intelligence mas grande de LATAM. Independiente, senior y marca-agnostica.</p>
        </div>
        <nav aria-label="Footer comunidad">
          <h2>Comunidad</h2>
          <a href="${root}#comunidad">Que es ListenUp!</a>
          <a href="${root}#eventos">Eventos</a>
          <a href="${root}#historia">Historia</a>
          <a href="${root}#unete">Unete</a>
        </nav>
        <nav aria-label="Footer empresas">
          <h2>Empresas</h2>
          <a href="${root}#patrocinios">Patrocinios</a>
          <a href="mailto:hola@listenup.lat?subject=Contacto%20ListenUp">Contacto</a>
          <a href="${root}blog/">Blog</a>
        </nav>
      </div>
      <div class="container footer-bottom">
        <span>© ListenUp! 2026 · CDMX, Mexico</span>
        <span>Aviso de privacidad y terminos pendientes de publicacion.</span>
      </div>
    </footer>`;
}

export function pageShell({ head, root, main, scripts = "" }) {
  return `<!doctype html>
<html lang="es-MX">
  <head>
    ${head}
  </head>
  <body>
    ${siteHeader(root)}

    <main id="contenido">
${main}
    </main>

    ${siteFooter(root)}

    <script src="${root}script.js"></script>${scripts}
  </body>
</html>
`;
}

import { STAGE_LABELS } from "./config.mjs";
import { pageShell, siteHead } from "./templates.mjs";

export function articlePage(article) {
  const root = "../../";
  const stageLabel = STAGE_LABELS[article.stage] || article.stage;

  const head = siteHead({
    title: article.seo_title || `${article.title} | ListenUp!`,
    description: article.seo_description,
    canonicalPath: `/blog/${article.slug}/`,
    ogType: "article",
    root,
  });

  const toc = article.toc.length
    ? `
            <aside class="article-toc reveal" aria-label="Tabla de contenido">
              <p class="eyebrow">En este articulo</p>
              <ol>
${article.toc.map((item) => `                <li><a href="#${item.id}">${item.text}</a></li>`).join("\n")}
              </ol>
            </aside>`
    : "";

  const main = `      <section class="section article-hero">
        <div class="container">
          <p class="article-breadcrumb reveal"><a href="${root}blog/">&larr; Blog</a></p>
          <div class="article-header reveal">
            <div class="article-header__meta">
              <span class="tag tag--coral">${stageLabel}</span>
              <span>${article.reading_min} min de lectura</span>
              <span>${article.author}</span>
            </div>
            <h1>${article.title}</h1>
            <p class="article-header__lead">${article.seo_description}</p>
          </div>
        </div>
      </section>

      <section class="section article-section">
        <div class="container article-layout">${toc}
          <article class="article reveal">
${article.html}          </article>
        </div>
      </section>

      <section class="section article-cta">
        <div class="container article-cta__inner reveal">
          <p class="eyebrow">Sigue con ListenUp!</p>
          <h2>Convierte estos aprendizajes en tu proxima decision.</h2>
          <div class="article-cta__actions">
            <a class="button button--primary" href="${root}#unete">Unirme a ListenUp!</a>
            <a class="button button--secondary" href="${root}eventos/listenup-5-0/">Ver ListenUp! 5.0</a>
          </div>
        </div>
      </section>`;

  return pageShell({ head, root, main });
}

export function blogIndexPage(articlesByStage) {
  const root = "../";

  const head = siteHead({
    title: "Blog | Social Listening y Social Intelligence en LATAM | ListenUp!",
    description:
      "Guias, fundamentos y tendencias sobre social listening y social intelligence en LATAM, escritas por la comunidad de ListenUp!.",
    canonicalPath: "/blog/",
    ogType: "website",
    root,
  });

  const filterButtons = [`<button type="button" class="blog-filter__button is-active" data-stage="all">Todos</button>`]
    .concat(
      Object.entries(STAGE_LABELS).map(
        ([stage, label]) =>
          `<button type="button" class="blog-filter__button" data-stage="${stage}">${label}</button>`
      )
    )
    .join("\n            ");

  const groups = Object.entries(articlesByStage)
    .filter(([, items]) => items.length > 0)
    .map(
      ([stage, items]) => `          <div class="blog-group reveal" data-stage="${stage}">
            <h2>${STAGE_LABELS[stage]}</h2>
            <div class="blog-grid">
${items.map((article) => blogCard(article)).join("\n")}
            </div>
          </div>`
    )
    .join("\n");

  const main = `      <section class="section blog-hero">
        <div class="container">
          <div class="section-head reveal">
            <p class="eyebrow">Blog &amp; know-how</p>
            <h1>Aprende Social Intelligence con la comunidad.</h1>
            <p>Guias, fundamentos y tendencias sobre social listening y social intelligence en LATAM, escritas por la comunidad de ListenUp!.</p>
          </div>

          <div class="blog-filter reveal" role="group" aria-label="Filtrar articulos por etapa">
            ${filterButtons}
          </div>
        </div>
      </section>

      <section class="section blog-groups">
        <div class="container">
${groups}
        </div>
      </section>`;

  const scripts = `
    <script>
      document.querySelectorAll(".blog-filter__button").forEach((button) => {
        button.addEventListener("click", () => {
          document
            .querySelectorAll(".blog-filter__button")
            .forEach((other) => other.classList.toggle("is-active", other === button));

          const stage = button.dataset.stage;
          document.querySelectorAll(".blog-group").forEach((group) => {
            group.hidden = stage !== "all" && group.dataset.stage !== stage;
          });
        });
      });
    </script>`;

  return pageShell({ head, root, main, scripts });
}

function blogCard(article) {
  const stageLabel = STAGE_LABELS[article.stage] || article.stage;
  return `              <a class="blog-card reveal" href="${article.slug}/">
                <span class="tag tag--coral">${stageLabel}</span>
                <h3>${article.title}</h3>
                <p>${article.seo_description}</p>
                <div class="blog-card__meta">
                  <span>${article.reading_min} min de lectura</span>
                  <span>${article.author}</span>
                </div>
              </a>`;
}

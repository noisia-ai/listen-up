import fs from "node:fs";
import path from "node:path";
import { loadArticles } from "./content.mjs";
import { articlePage, blogIndexPage } from "./pages.mjs";
import { OUT_DIR, ROOT, SITE_URL, STAGE_ORDER } from "./config.mjs";

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function buildSitemap(articles) {
  const staticPaths = ["/", "/blog/", "/eventos/listenup-5-0/"];
  const articlePaths = articles.map((article) => `/blog/${article.slug}/`);

  const urls = [...staticPaths, ...articlePaths]
    .map((loc) => `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function main() {
  const articles = loadArticles();

  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  }

  const articlesByStage = {};
  for (const stage of STAGE_ORDER) {
    articlesByStage[stage] = [];
  }
  for (const article of articles) {
    if (!articlesByStage[article.stage]) {
      articlesByStage[article.stage] = [];
    }
    articlesByStage[article.stage].push(article);
  }

  for (const article of articles) {
    writeFile(path.join(OUT_DIR, article.slug, "index.html"), articlePage(article));
  }

  writeFile(path.join(OUT_DIR, "index.html"), blogIndexPage(articlesByStage));
  writeFile(path.join(ROOT, "sitemap.xml"), buildSitemap(articles));
  writeFile(path.join(ROOT, "robots.txt"), buildRobots());

  console.log(`Generados ${articles.length} articulos en blog/, mas blog/index.html, sitemap.xml y robots.txt.`);
}

main();

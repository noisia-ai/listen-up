import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { CONTENT_DIR, slugify } from "./config.mjs";

const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
md.renderer.rules.blockquote_open = () => '<blockquote class="callout">';

// Los .md de origen incluyen el H1, la linea "Etapa/Lectura/Autor" y un
// bloque final (CTA / Ficha SEO / Nota de imagenes) que la plantilla genera
// por su cuenta a partir del front matter, asi que se recortan aqui.
function prepareBody(raw) {
  let body = raw.trim();
  body = body.replace(/^#\s+.+\n+/, "");
  body = body.replace(/^\*\*Etapa:\*\*.+\n+/, "");

  const ctaIndex = body.indexOf("\n## CTA");
  if (ctaIndex !== -1) {
    body = body.slice(0, ctaIndex);
  }

  body = body.replace(/\n+-{3,}\s*$/, "");
  return body.trim() + "\n";
}

function renderArticleBody(body) {
  const tokens = md.parse(body, {});
  const toc = [];
  const seen = new Set();

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "heading_open" && token.tag === "h2") {
      const inline = tokens[i + 1];
      const text = inline.children.map((child) => child.content).join("");
      const base = slugify(text) || "seccion";
      let id = base;
      let n = 2;
      while (seen.has(id)) {
        id = `${base}-${n++}`;
      }
      seen.add(id);
      token.attrSet("id", id);
      toc.push({ id, text });
    }
  }

  return { html: md.renderer.render(tokens, md.options, {}), toc };
}

export function loadArticles() {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort();

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const body = prepareBody(content);
    const { html, toc } = renderArticleBody(body);

    return {
      title: data.title,
      slug: data.slug,
      stage: data.stage,
      reading_min: data.reading_min,
      author: data.author,
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      keywords: data.keywords,
      html,
      toc,
    };
  });
}

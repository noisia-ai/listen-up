import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = path.resolve(__dirname, "..");
export const CONTENT_DIR = path.join(ROOT, "content", "blog");
export const OUT_DIR = path.join(ROOT, "blog");
export const SITE_URL = "https://listenuplatam.com";

export const STAGE_LABELS = {
  fundamentos: "Fundamentos",
  awareness: "Awareness",
  consideration: "Consideration",
  decision: "Decision",
};

export const STAGE_ORDER = ["fundamentos", "awareness", "consideration", "decision"];

export function slugify(value) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

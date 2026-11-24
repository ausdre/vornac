#!/usr/bin/env node
/**
 * Markdown twins for AI agents.
 *
 * Runs after the Eleventy build (npm run build:md). For every URL in
 * dist/sitemap.xml it reads the built HTML page, strips the site chrome
 * (announcement bar, header, navigation, footer, consent banner, forms,
 * scripts) and converts the remaining content to Markdown:
 *
 *   /                     -> dist/index.md                (/index.md)
 *   /en                   -> dist/en.md                   (/en.md)
 *   /pentesting           -> dist/pentesting.md           (/pentesting.md)
 *   /research/<d>/<note>  -> dist/research/<d>/<note>.md
 *
 * Every twin starts with a YAML front matter (title, description, url,
 * lang, published, updated, alternate) so an agent sees the canonical page
 * and its date before the text. The pages announce the twin through
 * <link rel="alternate" type="text/markdown"> (partials/head-meta.njk) and
 * the Link header plus the Accept: text/markdown negotiation in
 * vercel.json.
 *
 * The same run writes dist/llms-full.txt: the full text of every twin,
 * German pages first, each section headed by the page title with its URL
 * on the next line, so an agent can cite the page rather than the file.
 *
 * Nothing here calls git or the clock: dates come from the JSON-LD of the
 * page, which src.11tydata.js derives from pageDates.json.
 */
const fs = require("fs");
const path = require("path");
const { parse } = require("node-html-parser");
const TurndownService = require("turndown");
const { gfm } = require("turndown-plugin-gfm");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SITEMAP = path.join(DIST, "sitemap.xml");
const ORIGIN = "https://www.vornac.com";

/** Site chrome and non-content elements to drop before the conversion. */
const DROP_SELECTORS = [
  "script", "style", "noscript", "template", "svg", "canvas", "iframe",
  "video", "audio", "form", "button", "input", "select", "textarea", "dialog",
  "#announcement-bar", "#site-header", "#sticky-nav", "#mobile-backdrop",
  "#mobile-menu", "#consent-banner", "footer.v-footer", ".v-lang-switch",
  "[hidden]", "[aria-hidden=\"true\"]"
];

const LABELS = {
  de: { preamble: "Volltext aller Seiten von www.vornac.com (VORNAC GmbH, Heidelberg), erzeugt beim Build aus den Markdown-Fassungen der Seiten. Jede Seite ist unter ihrer URL mit der Endung .md auch einzeln abrufbar (Startseite: /index.md). Deutsch zuerst, dann Englisch.", lang: "Sprache", updated: "Stand", published: "Veröffentlicht", url: "URL" },
  en: { lang: "Language", updated: "Updated", published: "Published", url: "URL" }
};

function readSitemap() {
  const xml = fs.readFileSync(SITEMAP, "utf8");
  const urls = [];
  const re = /<url>([\s\S]*?)<\/url>/g;
  let m;
  while ((m = re.exec(xml))) {
    const block = m[1];
    const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1];
    if (!loc) continue;
    const lastmod = (block.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1] || "";
    urls.push({ loc, lastmod });
  }
  return urls;
}

/** "https://www.vornac.com/pentesting" -> "/pentesting" */
function pathOf(loc) {
  const p = loc.replace(ORIGIN, "");
  return p === "" ? "/" : p;
}

/** Built HTML file for a site path, honouring both output shapes. */
function htmlFileFor(sitePath) {
  if (sitePath === "/") return path.join(DIST, "index.html");
  const rel = sitePath.replace(/^\//, "");
  const flat = path.join(DIST, `${rel}.html`);
  if (fs.existsSync(flat)) return flat;
  const nested = path.join(DIST, rel, "index.html");
  if (fs.existsSync(nested)) return nested;
  return null;
}

/** Twin file and URL for a site path. */
function twinFor(sitePath) {
  if (sitePath === "/") return { file: path.join(DIST, "index.md"), url: `${ORIGIN}/index.md` };
  const rel = sitePath.replace(/^\//, "");
  return { file: path.join(DIST, `${rel}.md`), url: `${ORIGIN}/${rel}.md` };
}

function absolute(href) {
  if (!href) return href;
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  if (href.startsWith("#")) return href;
  if (href.startsWith("//")) return `https:${href}`;
  if (href.startsWith("/")) return `${ORIGIN}${href}`;
  return href;
}

function datesFromJsonLd(doc) {
  const out = { published: "", updated: "" };
  for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
    let data;
    try { data = JSON.parse(script.rawText || script.text); } catch (e) { continue; }
    const nodes = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
    for (const node of nodes) {
      const type = node["@type"];
      if (["WebPage", "TechArticle", "Article", "CollectionPage", "AboutPage", "FAQPage"].includes(type) && (node.datePublished || node.dateModified)) {
        out.published = out.published || node.datePublished || "";
        out.updated = out.updated || node.dateModified || "";
      }
    }
  }
  return out;
}

function yamlString(value) {
  return JSON.stringify(String(value || ""));
}

function buildTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    hr: "---"
  });
  td.use(gfm);
  // Headings on one line: a <br> inside an <h1> must not split the heading.
  td.addRule("headings", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: (content, node) => {
      const level = Number(node.nodeName.charAt(1));
      const text = content.replace(/\s+/g, " ").trim();
      return text ? `\n\n${"#".repeat(level)} ${text}\n\n` : "";
    }
  });
  // Images: keep the alt text as an image reference, drop decorative ones.
  td.addRule("images", {
    filter: "img",
    replacement: (content, node) => {
      const alt = (node.getAttribute("alt") || "").trim();
      if (!alt) return "";
      const src = absolute(node.getAttribute("src") || "");
      return src ? `![${alt}](${src})` : alt;
    }
  });
  // Links: absolute URLs, no empty anchors. Glossary auto-links (a.x-term,
  // added by the crosslink transform) and in-page buttons become plain text
  // so the prose reads as prose.
  td.addRule("links", {
    filter: (node) => node.nodeName === "A" && node.getAttribute("href"),
    replacement: (content, node) => {
      const text = content.trim();
      if (!text) return "";
      const cls = node.getAttribute("class") || "";
      if (/\bx-term\b/.test(cls)) return text;
      const href = absolute(node.getAttribute("href"));
      if (!href || href.startsWith("#")) {
        return /btn|cta/.test(cls) ? "" : text;
      }
      return `[${text}](${href})`;
    }
  });
  // Label/value rows (compare-dim + compare-val and friends): "**Label:** value".
  td.addRule("dimension", {
    filter: (node) => /-dim$/.test(node.getAttribute("class") || "") && !/^(H[1-6]|P|LI)$/.test(node.nodeName),
    replacement: (content) => (content.trim() ? `**${content.trim()}:** ` : "")
  });
  // FAQ accordions: the question becomes a heading, the answer follows.
  td.addRule("summary", {
    filter: ["summary"],
    replacement: (content) => `\n\n### ${content.trim()}\n\n`
  });
  td.addRule("details", {
    filter: ["details"],
    replacement: (content) => `\n\n${content.trim()}\n\n`
  });
  // Definition lists (glossary): "**term**: definition".
  td.addRule("dl", {
    filter: ["dt"],
    replacement: (content) => `\n**${content.trim()}**\n`
  });
  td.addRule("dd", {
    filter: ["dd"],
    replacement: (content) => `: ${content.trim()}\n\n`
  });
  return td;
}

function tidy(markdown) {
  return markdown
    .replace(/\u00a0/g, " ")
    // turndown escapes a hyphen that opens a text node; inside a word it is just a hyphen.
    .replace(/(\S)\\-/g, "$1-")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim() + "\n";
}

function convertPage(sitePath, lastmod) {
  const file = htmlFileFor(sitePath);
  if (!file) throw new Error(`markdown-twins: no built HTML for ${sitePath}`);
  const html = fs.readFileSync(file, "utf8");
  const doc = parse(html, { comment: false });

  const htmlEl = doc.querySelector("html");
  const lang = ((htmlEl && htmlEl.getAttribute("lang")) || "de").slice(0, 2);
  const title = (doc.querySelector("title") || { text: "" }).text.trim();
  const descriptionEl = doc.querySelector('meta[name="description"]');
  const description = descriptionEl ? descriptionEl.getAttribute("content") || "" : "";
  const canonicalEl = doc.querySelector('link[rel="canonical"]');
  const canonical = canonicalEl ? canonicalEl.getAttribute("href") : `${ORIGIN}${sitePath}`;
  const alternates = {};
  for (const link of doc.querySelectorAll('link[rel="alternate"][hreflang]')) {
    const hl = link.getAttribute("hreflang");
    if (hl && hl !== "x-default" && hl !== lang) alternates[hl] = link.getAttribute("href");
  }
  const dates = datesFromJsonLd(doc);
  const published = dates.published;
  const updated = dates.updated || lastmod;

  // Content: <main> when the page has one, otherwise the body minus chrome.
  const body = doc.querySelector("body");
  for (const sel of DROP_SELECTORS) {
    for (const el of body.querySelectorAll(sel)) el.remove();
  }
  const main = body.querySelector("main");
  const contentHtml = (main || body).innerHTML;

  const td = buildTurndown();
  const content = tidy(td.turndown(contentHtml));

  const fm = [
    "---",
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `url: ${canonical}`,
    `lang: ${lang}`
  ];
  if (published) fm.push(`published: ${published}`);
  if (updated) fm.push(`updated: ${updated}`);
  for (const [hl, href] of Object.entries(alternates)) fm.push(`alternate_${hl}: ${href}`);
  fm.push("---", "");

  return { lang, title, canonical, published, updated, markdown: fm.join("\n") + "\n" + content, content };
}

function main() {
  if (!fs.existsSync(SITEMAP)) {
    console.error("markdown-twins: dist/sitemap.xml missing, run the Eleventy build first.");
    process.exit(1);
  }
  const pages = [];
  for (const { loc, lastmod } of readSitemap()) {
    const sitePath = pathOf(loc);
    const page = convertPage(sitePath, lastmod);
    const twin = twinFor(sitePath);
    fs.mkdirSync(path.dirname(twin.file), { recursive: true });
    fs.writeFileSync(twin.file, page.markdown);
    pages.push({ sitePath, twin, ...page });
  }

  // llms-full.txt: German first (root locale), then English, sitemap order within each.
  const ordered = [...pages.filter((p) => p.lang === "de"), ...pages.filter((p) => p.lang !== "de")];
  const sections = ordered.map((p) => {
    const l = LABELS[p.lang] || LABELS.en;
    const meta = [`${l.url}: ${p.canonical}`];
    const bits = [`${l.lang}: ${p.lang}`];
    if (p.published) bits.push(`${l.published}: ${p.published}`);
    if (p.updated) bits.push(`${l.updated}: ${p.updated}`);
    meta.push(bits.join(" · "));
    // Demote the page headings by one level so the page title stays the section heading.
    const demoted = p.content.replace(/^(#{1,5}) /gm, "#$1 ");
    return `# ${p.title}\n${meta.join("\n")}\n\n${demoted.trim()}\n`;
  });
  const full = `${LABELS.de.preamble}\n\n---\n\n${sections.join("\n---\n\n")}`;
  fs.writeFileSync(path.join(DIST, "llms-full.txt"), full);

  const bytes = Buffer.byteLength(full, "utf8");
  console.log(`markdown-twins: wrote ${pages.length} twins and llms-full.txt (${(bytes / 1024).toFixed(0)} KB)`);
}

main();

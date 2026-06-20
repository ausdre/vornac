/**
 * Eleventy config for the VORNAC website.
 *
 * Input:  src/   (.njk templates + data + partials)
 * Output: dist/  (static HTML + assets, served by Vercel)
 *
 * URLs:
 *   /            <- src/index.njk
 *   /pentesting  <- src/pentesting.njk        (Vercel cleanUrls strips .html)
 *   /de          <- src/de/index.njk
 *   /de/pentesting <- src/de/pentesting.njk
 */
const { parse: parseHTML, HTMLElement, TextNode } = require("node-html-parser");
const CROSSLINKS = require("./src/_data/crosslinks.js");

// Domain-based i18n: a build is single-locale, selected at build time.
// "de" builds the German site (src/de/** at the domain root, → vornac.de);
// anything else builds the English site (src/ root, → vornac.com).
const VORNAC_LOCALE = process.env.VORNAC_LOCALE === "de" ? "de" : "en";

// HTML tags whose text content must never be auto-linked.
const SKIP_TAGS = new Set([
  "a", "code", "pre", "kbd", "script", "style", "noscript",
  "nav", "header", "footer", "h1", "h2", "h3", "button",
  "select", "textarea", "input", "label", "svg", "math"
]);

// CSS class names that mark a subtree as opt-out of cross-linking.
const SKIP_CLASSES = new Set([
  "rs-rule",            // research "Rule of thumb" callout
  "rs-note-hero",       // note hero block (title area)
  "rs-domain-hero",     // domain hero
  "rs-research-hero",   // research index hero
  "gl-eyebrow",         // glossary eyebrow / hero
  "gl-hero",            // glossary hero
  "gl-entry-term",      // glossary term label (don't link "OWASP" inside its own term row)
  "gl-entry-full",      // glossary full-form line
  "gl-cat-pill",        // glossary category chips
  "gl-az-link",         // glossary A–Z jump links
  "gl-meta",            // glossary meta line
  "v-announcement",     // top announcement bar
  "v-nav",              // floating nav island
  "site-footer",        // global footer wrapper (defensive; tag is already <footer>)
  "comcenter",          // command-centre block
  "rs-tier-chip",       // tier chips
  "rs-phase-chip"       // phase chips
]);

// Build a single regex per locale that captures any known phrase
// (longest-first). We split acronyms (case-sensitive) from normal
// phrases (case-insensitive) into two regexes so JavaScript's regex
// engine can keep the right flags per group.
function compileMatcher(phrases) {
  const acronymList = phrases.filter((p) => p.acronym).map((p) => p.phrase);
  const normalList  = phrases.filter((p) => !p.acronym).map((p) => p.phrase);

  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const acronymRe = acronymList.length
    ? new RegExp(`(?<![A-Za-z0-9])(?:${acronymList.map(escapeRe).join("|")})(?![A-Za-z0-9])`, "g")
    : null;
  const normalRe = normalList.length
    ? new RegExp(`(?<![A-Za-z0-9])(?:${normalList.map(escapeRe).join("|")})(?![A-Za-z0-9])`, "gi")
    : null;

  const byKeyAcronym = new Map(phrases.filter((p) => p.acronym).map((p) => [p.phrase, p]));
  const byKeyNormal  = new Map(phrases.filter((p) => !p.acronym).map((p) => [p.phrase.toLowerCase(), p]));

  return { acronymRe, normalRe, byKeyAcronym, byKeyNormal };
}

const MATCHERS = {
  en: compileMatcher(CROSSLINKS.en),
  de: compileMatcher(CROSSLINKS.de)
};

// Walk a parsed DOM and apply cross-linking to all eligible text nodes.
// Mutates the tree in place. `state` tracks which phrase IDs have
// already been linked on this page (first occurrence per term).
function walkAndLink(node, matcher, state) {
  if (!node || !node.childNodes) return;

  for (const child of [...node.childNodes]) {
    if (child instanceof HTMLElement) {
      const tag = (child.rawTagName || "").toLowerCase();
      if (SKIP_TAGS.has(tag)) continue;

      const classList = (child.classList && Array.from(child.classList.values())) || [];
      if (classList.some((c) => SKIP_CLASSES.has(c))) continue;
      if (child.hasAttribute && child.hasAttribute("data-no-crosslink")) continue;

      walkAndLink(child, matcher, state);
    } else if (child instanceof TextNode) {
      // Match against the DECODED text (so "&middot;" → "·" and the
      // regex sees plain characters), then re-encode in linkifyText.
      // Using rawText here would double-escape entities like &nbsp;
      // into &amp;nbsp;, breaking trust-lists / inline separators.
      const decoded = child.text;
      const newText = linkifyText(decoded, matcher, state);
      if (newText !== null) {
        const placeholder = parseHTML(newText);
        const parent = child.parentNode;
        if (!parent) continue;
        const idx = parent.childNodes.indexOf(child);
        if (idx < 0) continue;
        parent.childNodes.splice(idx, 1, ...placeholder.childNodes);
      }
    }
  }
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Apply phrase matches to a single text fragment. Returns the new HTML
// string, or null if no link was inserted.
function linkifyText(text, matcher, state) {
  if (!text || text.length < 2) return null;

  // Collect all candidate matches with offsets, then resolve overlaps
  // by length-descending priority and "first occurrence per phrase".
  const candidates = [];

  if (matcher.acronymRe) {
    matcher.acronymRe.lastIndex = 0;
    let m;
    while ((m = matcher.acronymRe.exec(text)) !== null) {
      const phrase = matcher.byKeyAcronym.get(m[0]);
      if (phrase) candidates.push({ start: m.index, end: m.index + m[0].length, raw: m[0], phrase });
    }
  }
  if (matcher.normalRe) {
    matcher.normalRe.lastIndex = 0;
    let m;
    while ((m = matcher.normalRe.exec(text)) !== null) {
      const phrase = matcher.byKeyNormal.get(m[0].toLowerCase());
      if (phrase) candidates.push({ start: m.index, end: m.index + m[0].length, raw: m[0], phrase });
    }
  }

  if (candidates.length === 0) return null;

  // Sort: longer phrases first; then earlier offset first.
  candidates.sort((a, b) => (b.end - b.start) - (a.end - a.start) || a.start - b.start);

  // Greedy non-overlapping selection, skipping already-linked phrases
  // and self-links.
  const used = [];
  for (const c of candidates) {
    if (state.linked.has(c.phrase.id)) continue;
    if (used.some((u) => !(c.end <= u.start || c.start >= u.end))) continue;
    // Self-link guard: a research note shouldn't link to itself, and
    // the glossary page is skipped wholesale at the top of the transform.
    // For anchored hrefs ("/glossary#term-foo") we never suppress.
    const hasAnchor = c.phrase.href.includes("#");
    if (!hasAnchor) {
      const target = c.phrase.href.split("#")[0].replace(/\/$/, "");
      if (target === state.selfBase) continue;
    }
    used.push(c);
    state.linked.add(c.phrase.id);
  }

  if (used.length === 0) return null;

  // Build the replacement HTML left-to-right.
  used.sort((a, b) => a.start - b.start);
  let out = "";
  let cursor = 0;
  for (const u of used) {
    out += escapeHtml(text.slice(cursor, u.start));
    out += `<a class="x-term" href="${u.phrase.href}" data-x-term="${u.phrase.id}">${escapeHtml(u.raw)}</a>`;
    cursor = u.end;
  }
  out += escapeHtml(text.slice(cursor));
  return out;
}

module.exports = function (eleventyConfig) {
  // ── Single-locale build selection ─────────────────────────────────
  // Each domain gets its own build. The German build keeps only the
  // German page templates (src/de/**) plus the German sitemap; the
  // English build keeps only the English ones. Shared data (_data),
  // includes (_includes) and root assets are never page templates, so
  // they survive both. This guarantees each language is served at its
  // own domain root with no EN/DE path collisions.
  if (VORNAC_LOCALE === "de") {
    // Drop the English content + sitemap templates at the src root.
    // (src/de/*.njk are NOT matched by this glob and are kept.)
    eleventyConfig.ignores.add("src/*.njk");
  } else {
    // English build: drop the German tree entirely.
    eleventyConfig.ignores.add("src/de/**");
  }

  // ── Static assets passthrough ─────────────────────────────────────
  // Project-root assets get copied to dist/ root so existing URLs work.
  eleventyConfig.addPassthroughCopy("*.png");
  eleventyConfig.addPassthroughCopy("*.jpg");
  eleventyConfig.addPassthroughCopy("*.webp");
  eleventyConfig.addPassthroughCopy("*.svg");
  eleventyConfig.addPassthroughCopy("*.MP4");
  eleventyConfig.addPassthroughCopy("*.pdf");
  eleventyConfig.addPassthroughCopy("*.eps");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Page-specific CSS files referenced by /about, /industries, /pentesting
  // templates. They live at project root and are linked from templates as
  // /about.css etc.
  eleventyConfig.addPassthroughCopy("about.css");
  eleventyConfig.addPassthroughCopy("industries.css");
  eleventyConfig.addPassthroughCopy("pentesting.css");
  eleventyConfig.addPassthroughCopy("research.css");
  eleventyConfig.addPassthroughCopy("glossary.css");

  // Hovercard JS for .x-term cross-links (loaded by the crosslink
  // transform when a page contains at least one cross-link).
  eleventyConfig.addPassthroughCopy("x-term.js");
  eleventyConfig.addWatchTarget("./x-term.js");

  // anime.js, self-hosted instead of fetched from jsdelivr — saves a TLS
  // hop on the critical path (was -336ms LCP).
  eleventyConfig.addPassthroughCopy("anime.min.js");

  // Watch the page-specific CSS files so edits hot-reload during dev.
  eleventyConfig.addWatchTarget("./about.css");
  eleventyConfig.addWatchTarget("./industries.css");
  eleventyConfig.addWatchTarget("./pentesting.css");
  eleventyConfig.addWatchTarget("./research.css");
  eleventyConfig.addWatchTarget("./glossary.css");

  // Compiled Tailwind output (built by `npm run build:css` -> dist/output.css)
  // also keep a root copy if someone is serving from project root in legacy mode.
  // No passthrough needed because Tailwind writes directly to dist/.

  // ── Watch Tailwind input so Eleventy hot-reloads on style edits ────
  eleventyConfig.addWatchTarget("./src/input.css");
  eleventyConfig.addWatchTarget("./tailwind.config.js");
  eleventyConfig.addWatchTarget("./dist/output.css");

  // ── Dev server ────────────────────────────────────────────────────
  eleventyConfig.setServerOptions({
    port: 8081,
    showAllHosts: false,
    showVersion: false
  });

  // ── Custom filters ────────────────────────────────────────────────
  // Look up a page in the registry by its i18nKey, return the matching URL
  // for the given locale (or null if no counterpart exists).
  eleventyConfig.addFilter("counterpartUrl", function (i18nKey, locale, pages) {
    if (!i18nKey || !pages) return null;
    const entry = pages.find((p) => p.key === i18nKey);
    if (!entry) return null;
    return entry[locale] || null;
  });

  // Absolute URL helper (prepends domain)
  eleventyConfig.addFilter("absoluteUrl", function (path, domain) {
    if (!path) return domain;
    if (path.startsWith("http")) return path;
    return domain.replace(/\/$/, "") + path;
  });

  // YYYY-MM-DD date formatter for sitemap.xml lastmod fields.
  eleventyConfig.addFilter("isoDate", function (date) {
    const d = date ? new Date(date) : new Date();
    return d.toISOString().slice(0, 10);
  });

  // ── Cross-link transform ──────────────────────────────────────────
  // Walks every generated HTML page and auto-links glossary terms +
  // research note titles wherever they appear in body prose. See top
  // of this file for the helper implementations and skip rules.
  eleventyConfig.addTransform("crosslink", function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    if (process.env.NO_CROSSLINK === "1") return content;

    // Locale is fixed for the whole build (domain-based i18n).
    const locale = VORNAC_LOCALE;
    const matcher = MATCHERS[locale];
    if (!matcher) return content;

    // Self-URL: derived from outputPath. Used to suppress links pointing
    // to the current page (e.g. avoid linking "Active Directory" to the
    // glossary anchor while standing on the glossary page).
    const selfHref = outputPath
      .replace(/\\/g, "/")
      .replace(/^.*?dist/, "")
      .replace(/\/index\.html$/, "/")
      .replace(/\.html$/, "");

    // Glossary page renders all terms inline — skip cross-linking
    // entirely to avoid 154 self-links per page. Match both pretty-URL
    // forms ("/glossary") and folder-index forms ("/glossary/").
    const selfNormalized = selfHref.replace(/\/$/, "");
    if (selfNormalized === "/glossary") return content;

    let root;
    try {
      root = parseHTML(content, { lowerCaseTagName: false, comment: true });
    } catch (e) {
      return content;
    }

    // Only operate inside <body> if present; otherwise treat the whole
    // parsed root as the surface.
    const body = root.querySelector("body") || root;

    const state = {
      linked: new Set(),
      selfBase: selfNormalized
    };
    walkAndLink(body, matcher, state);

    // Inject per-page definitions and the hovercard script so the
    // Wikipedia-style preview popover has data to render. Only emit
    // definitions for terms actually linked on this page (keeps payload
    // small — typically 2–10 KB depending on density).
    if (state.linked.size > 0) {
      const allDefs = CROSSLINKS.definitions[locale] || {};
      const pageDefs = {};
      for (const id of state.linked) {
        if (allDefs[id]) pageDefs[id] = allDefs[id];
      }
      const json = JSON.stringify(pageDefs)
        // Defensive: keep the inline JSON safe against premature </script>.
        .replace(/<\//g, "<\\/");
      const inject =
        `<script type="application/json" id="x-term-defs">${json}</script>` +
        `<script src="/x-term.js" defer></script>`;
      const bodyEl = root.querySelector("body");
      if (bodyEl) {
        bodyEl.insertAdjacentHTML("beforeend", inject);
      }
    }

    return root.toString();
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};

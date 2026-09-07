/**
 * Directory data for everything under src/.
 *
 * Computes per-page values: locale, translation table, counterpart URL,
 * and the output permalink. Eleventy applies this to every template inside
 * the input directory unless individual files override.
 *
 * Locale convention: pages under src/de/* are German. Everything else is
 * English. This means moving a page in or out of src/de/ is enough to
 * flip its locale — no per-file front-matter needed.
 */
/**
 * Date lookup for pages that are not paginated: registry entry first (it
 * carries locale-specific dates), file stem second.
 */
function lookupDate(data, field) {
  const dates = data.dates;
  if (!dates) return null;
  const locale = data.page.filePathStem.startsWith("/de/") ? "de" : "en";
  const fromKey = data.i18nKey && dates.byKey[data.i18nKey] && dates.byKey[data.i18nKey][locale];
  if (fromKey && fromKey[field]) return fromKey[field];
  const fromStem = dates.byStem[data.page.filePathStem];
  return fromStem ? fromStem[field] : null;
}

module.exports = {
  eleventyComputed: {
    /** "en" | "de" */
    locale: (data) =>
      data.page.filePathStem.startsWith("/de/") ? "de" : "en",

    /** i18n strings for this page's locale (shortcut for {{ i18n[locale].* }}) */
    t: (data) => {
      const locale = data.page.filePathStem.startsWith("/de/") ? "de" : "en";
      return data.i18n[locale];
    },

    /**
     * URL of this page's counterpart in the other locale.
     * Pages opt in by declaring `i18nKey: "<page-key>"` in front-matter.
     * Returns null for single-locale pages (e.g. comcenter).
     */
    counterpart: (data) => {
      if (!data.i18nKey) return null;
      const locale = data.page.filePathStem.startsWith("/de/") ? "de" : "en";
      const otherLocale = locale === "en" ? "de" : "en";
      const entry = data.pages.find((p) => p.key === data.i18nKey);
      if (!entry) return null;
      return entry[otherLocale];
    },

    /**
     * Canonical URL of THIS page (computed from registry so it matches
     * what the language switcher / hreflang on counterparts will point to).
     */
    canonicalPath: (data) => {
      if (!data.i18nKey) {
        // Fall back to filePathStem for pages not in the registry.
        return data.page.filePathStem;
      }
      const locale = data.page.filePathStem.startsWith("/de/") ? "de" : "en";
      const entry = data.pages.find((p) => p.key === data.i18nKey);
      return entry ? entry[locale] : data.page.filePathStem;
    },

    /**
     * Per-locale URL lookup table keyed by i18nKey.
     * Lets templates write `{{ pageUrls.pentesting }}` instead of
     * iterating the pages array. Returns the URL in the CURRENT locale,
     * so nav links automatically stay in-language.
     *
     * Example: on a DE page, pageUrls.pentesting === "/pentesting".
     *          on an EN page, pageUrls.pentesting === "/en/pentesting".
     */
    pageUrls: (data) => {
      const locale = data.page.filePathStem.startsWith("/de/") ? "de" : "en";
      const out = {};
      for (const p of data.pages) {
        out[p.key] = p[locale];
      }
      return out;
    },

    /**
     * Publish and last-modified date of THIS page as YYYY-MM-DD strings.
     *
     * Resolution order:
     *   1. `published` / `updated` in the page's own front matter
     *   2. the paginated record (research note or domain from research.js)
     *   3. the registry entry in dates.js (git history via pageDates.json)
     *
     * Both feed article:published_time / article:modified_time in
     * head-meta.njk, datePublished / dateModified in the JSON-LD blocks and
     * lastmod in the sitemap. They never fall back to the build time.
     */
    published: (data) => {
      if (data.published) return data.published;
      if (data.note && data.note.published) return data.note.published;
      if (data.domain && data.domain.published) return data.domain.published;
      return lookupDate(data, "created");
    },

    updated: (data) => {
      if (data.updated) return data.updated;
      if (data.note && data.note.updated) return data.note.updated;
      if (data.domain && data.domain.updated) return data.domain.updated;
      return lookupDate(data, "modified");
    },

    /**
     * Default permalink: German sources (src/de/*) are emitted at the site
     * root, English sources (src/*) under /en.
     *   src/de/index.njk       -> dist/index.html        (/)
     *   src/de/pentesting.njk  -> dist/pentesting.html   (/pentesting)
     *   src/index.njk          -> dist/en/index.html     (/en)
     *   src/pentesting.njk     -> dist/en/pentesting.html (/en/pentesting)
     *
     * Vercel's cleanUrls: true strips the .html at the browser.
     *
     * Pages can override by setting `permalink:` in their own front-matter
     * (404.html and sitemap.xml do).
     */
    permalink: (data) => {
      // Honor explicit overrides (e.g. sitemap.xml, 404.html).
      if (data.permalink && data.permalink !== "__default__") {
        return data.permalink;
      }
      const stem = data.page.filePathStem;
      const out = stem.startsWith("/de/") ? stem.slice(3) : `/en${stem}`;
      return `${out}.html`;
    }
  }
};

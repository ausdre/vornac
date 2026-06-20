/**
 * Directory data for everything under src/.
 *
 * Computes per-page values: locale, translation table, counterpart URL,
 * and the output permalink. Eleventy applies this to every template inside
 * the input directory unless individual files override.
 *
 * Domain-based i18n: a build is single-locale (selected via VORNAC_LOCALE,
 * surfaced as `site.locale`). German pages still live in src/de/ in the
 * repo, but in the German build their /de URL prefix is stripped so they
 * are served at the domain root. The counterpart link now points at the
 * OTHER language's domain (cross-domain), since each language lives on its
 * own domain (vornac.de / vornac.com).
 */
module.exports = {
  eleventyComputed: {
    /** "en" | "de" — the locale of this entire build. */
    locale: (data) => data.site.locale,

    /** i18n strings for this build's locale (shortcut for {{ i18n[locale].* }}) */
    t: (data) => data.i18n[data.site.locale],

    /**
     * Absolute URL of this page's counterpart on the OTHER language's domain.
     * Pages opt in by declaring `i18nKey: "<page-key>"` in front-matter.
     * Returns null for single-locale pages (e.g. comcenter) or when the
     * counterpart locale has no entry.
     */
    counterpart: (data) => {
      if (!data.i18nKey) return null;
      const locale = data.site.locale;
      const otherLocale = locale === "en" ? "de" : "en";
      const entry = data.pages.find((p) => p.key === data.i18nKey);
      if (!entry || !entry[otherLocale]) return null;
      return data.site.domains[otherLocale] + entry[otherLocale];
    },

    /**
     * Canonical path of THIS page (root-relative). Combined with the build's
     * own domain (site.domain) by the absoluteUrl filter where needed.
     */
    canonicalPath: (data) => {
      if (!data.i18nKey) {
        // Fall back to filePathStem for pages not in the registry.
        return data.page.filePathStem;
      }
      const entry = data.pages.find((p) => p.key === data.i18nKey);
      return entry ? entry[data.site.locale] : data.page.filePathStem;
    },

    /**
     * Per-locale URL lookup table keyed by i18nKey, in the CURRENT locale,
     * so nav links stay in-language and root-relative.
     * Example: on the German build, pageUrls.pentesting === "/pentesting".
     */
    pageUrls: (data) => {
      const locale = data.site.locale;
      const out = {};
      for (const p of data.pages) {
        out[p.key] = p[locale];
      }
      return out;
    },

    /**
     * Default permalink: emit a flat .html file matching the input path.
     *   src/index.njk          -> dist/index.html
     *   src/pentesting.njk     -> dist/pentesting.html
     *
     * German pages live in src/de/ and would otherwise emit under /de/. In
     * the German build we strip the leading /de so they are served at the
     * domain root:
     *   src/de/index.njk       -> dist/index.html
     *   src/de/pentesting.njk  -> dist/pentesting.html
     *
     * Vercel's cleanUrls: true strips the .html so URLs look like /pentesting.
     * Pages can override by setting `permalink:` in their own front-matter
     * (those overrides are still /de-stripped here).
     */
    permalink: (data) => {
      // Honor explicit overrides (e.g. sitemap.xml, robots.txt, paginated
      // research pages); otherwise emit a flat .html matching the input path.
      let p =
        data.permalink && data.permalink !== "__default__"
          ? data.permalink
          : `${data.page.filePathStem}.html`;

      // Strip the /de URL prefix so German is served at the domain root.
      // Only ever matches in the German build (the English build ignores
      // src/de/**), so this is a no-op for English.
      p = p.replace(/^\/de(?=\/)/, "");

      return p;
    }
  }
};

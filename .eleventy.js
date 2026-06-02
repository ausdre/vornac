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
module.exports = function (eleventyConfig) {
  // ── Static assets passthrough ─────────────────────────────────────
  // Project-root assets get copied to dist/ root so existing URLs work.
  eleventyConfig.addPassthroughCopy("*.png");
  eleventyConfig.addPassthroughCopy("*.jpg");
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

/**
 * Page registry: maps each logical page to its EN and DE URLs.
 *
 * Domain-based i18n: each language is served at the ROOT of its own domain
 * (German on vornac.de, English on vornac.com), so both columns hold the
 * SAME root-relative path. The domain is supplied separately (site.domains)
 * when an absolute URL is needed (hreflang, language switcher, sitemap).
 *
 * Used by:
 *   - hreflang tag generation (every page links to its counterpart)
 *   - header/footer language switcher (cross-domain link to the counterpart)
 *   - sitemap.xml generation
 *
 * NOTE: keys must match the `i18nKey` declared in each page's front-matter.
 *
 * Dynamic entries: per-research-domain pages are appended at the bottom by
 * deriving from src/_data/research.js. Each gets the key `research-<id>`
 * matching the i18nKey set in the paginated template.
 */
const research = require("./research.js");

const STATIC_PAGES = [
  { key: "index",                              en: "/",                                   de: "/" },
  { key: "pentesting",                         en: "/pentesting",                         de: "/pentesting" },
  { key: "research",                           en: "/research",                           de: "/research" },
  { key: "glossary",                           en: "/glossary",                           de: "/glossary" },
  { key: "about",                              en: "/about",                              de: "/about" },
  { key: "customers",                          en: "/customers",                          de: "/customers" },
  { key: "apply",                              en: "/apply",                              de: "/apply" },
  { key: "industries",                         en: "/industries",                         de: "/industries" },
  { key: "industries-automotive",              en: "/industries-automotive",              de: "/industries-automotive" },
  { key: "industries-critical-infrastructure", en: "/industries-critical-infrastructure", de: "/industries-critical-infrastructure" },
  { key: "industries-enterprise",              en: "/industries-enterprise",              de: "/industries-enterprise" },
  { key: "industries-financial-services",      en: "/industries-financial-services",      de: "/industries-financial-services" },
  { key: "industries-insurance",               en: "/industries-insurance",               de: "/industries-insurance" },
  { key: "legal",                              en: "/legal",                              de: "/legal" },
  { key: "comcenter",                          en: "/comcenter",                          de: null }
];

const RESEARCH_DOMAIN_PAGES = research.domains.map((d) => ({
  key: `research-${d.id}`,
  en: `/research/${d.id}`,
  de: `/research/${d.id}`
}));

const RESEARCH_NOTE_PAGES = research.allNotes.map((n) => ({
  key: `research-note-${n.id}`,
  en: `/research/${n.domain}/${n.id}`,
  de: `/research/${n.domain}/${n.id}`
}));

module.exports = [
  ...STATIC_PAGES,
  ...RESEARCH_DOMAIN_PAGES,
  ...RESEARCH_NOTE_PAGES
];

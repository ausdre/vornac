/**
 * Page registry: maps each logical page to its EN and DE URLs.
 *
 * Used by:
 *   - hreflang tag generation (every page links to its counterpart)
 *   - footer language switcher (links to the right counterpart, not just /)
 *   - smart auto-redirect script (knows where to send a German user
 *     who landed on the English version of this page)
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
  { key: "index",                              en: "/",                                   de: "/de" },
  { key: "pentesting",                         en: "/pentesting",                         de: "/de/pentesting" },
  { key: "research",                           en: "/research",                           de: "/de/research" },
  { key: "glossary",                           en: "/glossary",                           de: "/de/glossary" },
  { key: "about",                              en: "/about",                              de: "/de/about" },
  { key: "customers",                          en: "/customers",                          de: "/de/customers" },
  { key: "apply",                              en: "/apply",                              de: "/de/apply" },
  { key: "industries",                         en: "/industries",                         de: "/de/industries" },
  { key: "industries-automotive",              en: "/industries-automotive",              de: "/de/industries-automotive" },
  { key: "industries-critical-infrastructure", en: "/industries-critical-infrastructure", de: "/de/industries-critical-infrastructure" },
  { key: "industries-enterprise",              en: "/industries-enterprise",              de: "/de/industries-enterprise" },
  { key: "industries-financial-services",      en: "/industries-financial-services",      de: "/de/industries-financial-services" },
  { key: "industries-insurance",               en: "/industries-insurance",               de: "/de/industries-insurance" },
  { key: "faq",                                en: "/faq",                                de: "/de/faq" },
  { key: "legal",                              en: "/legal",                              de: "/de/legal" },
  { key: "comcenter",                          en: "/comcenter",                          de: null }
];

const RESEARCH_DOMAIN_PAGES = research.domains.map((d) => ({
  key: `research-${d.id}`,
  en: `/research/${d.id}`,
  de: `/de/research/${d.id}`
}));

const RESEARCH_NOTE_PAGES = research.allNotes.map((n) => ({
  key: `research-note-${n.id}`,
  en: `/research/${n.domain}/${n.id}`,
  de: `/de/research/${n.domain}/${n.id}`
}));

module.exports = [
  ...STATIC_PAGES,
  ...RESEARCH_DOMAIN_PAGES,
  ...RESEARCH_NOTE_PAGES
];

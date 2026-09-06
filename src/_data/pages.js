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

// URL scheme: German is the root locale, English is prefixed with /en.
//   de: "/pentesting"   en: "/en/pentesting"
const EN = "/en";
const STATIC_PAGES = [
  { key: "index",                              en: `${EN}`,                                     de: "/" },
  { key: "pentesting",                         en: `${EN}/pentesting`,                         de: "/pentesting" },
  { key: "ot-pentesting",                      en: `${EN}/ot-pentesting`,                      de: "/ot-pentesting" },
  { key: "research",                           en: `${EN}/research`,                           de: "/research" },
  { key: "glossary",                           en: `${EN}/glossary`,                           de: "/glossary" },
  { key: "about",                              en: `${EN}/about`,                              de: "/about" },
  { key: "customers",                          en: `${EN}/customers`,                          de: "/customers" },
  { key: "apply",                              en: `${EN}/apply`,                              de: "/apply" },
  { key: "industries",                         en: `${EN}/industries`,                         de: "/industries" },
  { key: "industries-automotive",              en: `${EN}/industries-automotive`,              de: "/industries-automotive" },
  { key: "industries-critical-infrastructure", en: `${EN}/industries-critical-infrastructure`, de: "/industries-critical-infrastructure" },
  { key: "industries-enterprise",              en: `${EN}/industries-enterprise`,              de: "/industries-enterprise" },
  { key: "industries-financial-services",      en: `${EN}/industries-financial-services`,      de: "/industries-financial-services" },
  { key: "industries-insurance",               en: `${EN}/industries-insurance`,               de: "/industries-insurance" },
  { key: "faq",                                en: `${EN}/faq`,                                de: "/faq" },
  { key: "legal",                              en: `${EN}/legal`,                              de: "/legal" },
  { key: "comcenter",                          en: `${EN}/comcenter`,                     de: null }
];

const RESEARCH_DOMAIN_PAGES = research.domains.map((d) => ({
  key: `research-${d.id}`,
  en: `${EN}/research/${d.id}`,
  de: `/research/${d.id}`
}));

const RESEARCH_NOTE_PAGES = research.allNotes.map((n) => ({
  key: `research-note-${n.id}`,
  en: `${EN}/research/${n.domain}/${n.id}`,
  de: `/research/${n.domain}/${n.id}`
}));

module.exports = [
  ...STATIC_PAGES,
  ...RESEARCH_DOMAIN_PAGES,
  ...RESEARCH_NOTE_PAGES
];

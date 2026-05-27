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
 */
module.exports = [
  { key: "index",                              en: "/",                                   de: "/de" },
  { key: "pentesting",                         en: "/pentesting",                         de: "/de/pentesting" },
  { key: "about",                              en: "/about",                              de: "/de/about" },
  { key: "customers",                          en: "/customers",                          de: "/de/customers" },
  { key: "apply",                              en: "/apply",                              de: "/de/apply" },
  { key: "industries",                         en: "/industries",                         de: "/de/industries" },
  { key: "industries-automotive",              en: "/industries-automotive",              de: "/de/industries-automotive" },
  { key: "industries-critical-infrastructure", en: "/industries-critical-infrastructure", de: "/de/industries-critical-infrastructure" },
  { key: "industries-enterprise",              en: "/industries-enterprise",              de: "/de/industries-enterprise" },
  { key: "industries-financial-services",      en: "/industries-financial-services",      de: "/de/industries-financial-services" },
  { key: "industries-insurance",               en: "/industries-insurance",               de: "/de/industries-insurance" },
  { key: "legal",                              en: "/legal",                              de: "/de/legal" },
  { key: "comcenter",                          en: "/comcenter",                          de: null }
];

/**
 * Site-wide constants. Edit here once, used everywhere.
 */
module.exports = {
  domain: "https://www.vornac.com",
  brand: "VORNAC",
  legalName: "VORNAC GmbH",
  copyrightYear: "2026",

  contact: {
    email: "hello@vornac.com",
    bookDemo: "https://zeeg.me/hello3950/your-vornac-meeting",
    linkedin: "https://www.linkedin.com/company/vornac",
    gartner: "https://www.gartner.com/reviews/product/vornac-pentesting"
  },

  analytics: {
    plausibleScript: "https://plausible.io/js/pa-OqjHdWkljhzM3AXJtXHXl.js",
    gtmContainerId: "GTM-MKJX4W2J"
  },

  // Logo paths (live at site root via passthrough copy)
  logos: {
    blackSvg: "/logo-vornac-black.svg",
    whiteSvg: "/logo-vornac-white.svg",
    favicon: "/V_BLACK.svg"
  },

  // Open-Graph/Twitter preview: 1200x630, white background, the V monogram
  // from the favicon centred so a square crop (Slack, iMessage) still shows
  // the V. The 2000x700 wordmark cropped to "RN." in Slack, hence this file.
  socialPreviewImage: "/vornac-og.png",
  socialPreviewWidth: 1200,
  socialPreviewHeight: 630,

  // Shared JSON-LD identities. The Organization and WebSite nodes are defined
  // once, in partials/organization-schema.njk, which layouts/base.njk renders
  // on every page. Page-level JSON-LD only references these two @ids
  // (publisher, provider, isPartOf, about) and never redeclares the nodes.
  organizationId: "https://www.vornac.com/#organization",
  websiteId: "https://www.vornac.com/#website",

  // Named authors for content pages (/wissen, /vergleich). Referenced from
  // front matter as `author: andre`; rendered by page-meta-line.njk and the
  // TechArticle `author` node in wissen-schema.njk.
  authors: {
    andre: {
      id: "https://www.vornac.com/about#andre-feigenbutz",
      name: "André Feigenbutz",
      jobTitle: { de: "Mitgründer und Geschäftsführer, VORNAC GmbH", en: "Co-founder and Managing Director, VORNAC GmbH" },
      url: "https://www.vornac.com/about"
    }
  },

  // Default and supported locales.
  // German is the root locale (/, /pentesting, ...); English lives under /en.
  defaultLocale: "de",
  locales: ["de", "en"],
  localePrefix: { de: "", en: "/en" }
};

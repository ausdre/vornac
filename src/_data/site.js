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

  socialPreviewImage: "/vornacpentesting43.png",

  // Shared JSON-LD identities. Every page that names the publisher or author
  // embeds `organizationLd` (a compact node) so the reference resolves on the
  // page itself; the full Organization record with address, founders and
  // memberships lives on the homepage under the same @id.
  organizationId: "https://www.vornac.com/#organization",
  websiteId: "https://www.vornac.com/#website",
  organizationLd: {
    "@type": "Organization",
    "@id": "https://www.vornac.com/#organization",
    "name": "VORNAC GmbH",
    "alternateName": "VORNAC",
    "url": "https://www.vornac.com/",
    "logo": { "@type": "ImageObject", "url": "https://www.vornac.com/vornacpentesting43.png" }
  },

  // Default and supported locales.
  // German is the root locale (/, /pentesting, ...); English lives under /en.
  defaultLocale: "de",
  locales: ["de", "en"],
  localePrefix: { de: "", en: "/en" }
};

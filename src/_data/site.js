/**
 * Site-wide constants. Edit here once, used everywhere.
 *
 * Domain-based i18n: each language is served at the ROOT of its own domain
 * (German on vornac.de, English on vornac.com) instead of under a /de/ path.
 * A single build is single-locale; the build's locale is selected at build
 * time via the VORNAC_LOCALE env var (set per Vercel project). Default: "en".
 */
const VORNAC_LOCALE = process.env.VORNAC_LOCALE === "de" ? "de" : "en";

// Production origin for each locale. Used for canonical URLs, hreflang,
// the cross-domain language switcher, and the sitemap.
const DOMAINS = {
  en: "https://www.vornac.com",
  de: "https://vornac.de"
};

module.exports = {
  // Locale of THIS build and its matching production origin.
  locale: VORNAC_LOCALE,
  domain: DOMAINS[VORNAC_LOCALE],
  domains: DOMAINS,
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
    plausibleScript: "https://plausible.io/js/pa-OqjHdWkljhzM3AXJtXHXl.js"
  },

  // Logo paths (live at site root via passthrough copy)
  logos: {
    blackSvg: "/logo-vornac-black.svg",
    whiteSvg: "/logo-vornac-white.svg",
    favicon: "/V_BLACK.svg"
  },

  socialPreviewImage: "/vornacpentesting43.png",

  // Default and supported locales
  defaultLocale: "en",
  locales: ["en", "de"]
};

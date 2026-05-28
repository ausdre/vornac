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
    etrackerSecureCode: "LVKB09",
    gtagId: "G-9LJGWDQ2CR",
    leadfeederSiteId: "DzLR5a5AnPWaBoQ2",
    linkedinPartnerId: "8795970"
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

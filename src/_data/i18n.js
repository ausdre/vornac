/**
 * UI strings by locale.
 *
 * Strings here are pulled from the current EN/DE HTML files verbatim
 * unless a string was demonstrably wrong (e.g. the DE footer "Legal"
 * heading rendering in English on a German page). Those are fixed here
 * and flagged in the migration notes for review.
 */
module.exports = {
  en: {
    htmlLang: "en",
    nav: {
      home: "Home",
      pentesting: "Pentesting",
      industries: "Industries",
      customers: "Customers",
      research: "Research",
      glossary: "Glossary",
      faq: "FAQ",
      about: "About",
      company: "Company",
      careers: "Careers",
      bookDemo: "Book Demo",
      contact: "Contact"
    },
    /** URL fragments used in the About dropdown — anchor IDs in /about. */
    aboutAnchors: {
      company: "company",
      careers: "careers"
    },
    /** Anchor IDs on the bilingual /legal page (differ per locale). */
    legalAnchors: {
      imprint: "imprint",
      privacy: "privacy"
    },
    /** Mega-menu section headings (small uppercase labels above each column). */
    navHeadings: {
      research: "Research domains",
      industries: "Industries",
      about: "About",
      glossary: "Reference",
      legal: "Legal"
    },
    navOverview: "All sectors",
    navResearchHome: "Research index",
    /** Industries shown in the Industries dropdown. `fw` is the regulator/framework
        tag rendered as a small caption next to the link, mirroring /industries. */
    industriesNav: [
      { key: "industries-insurance",               label: "Insurance",              fw: "DORA" },
      { key: "industries-financial-services",      label: "Financial services",     fw: "DORA · VAIT · BAIT" },
      { key: "industries-critical-infrastructure", label: "Critical infrastructure", fw: "KRITIS · NIS2" },
      { key: "industries-automotive",              label: "Automotive",             fw: "TISAX" },
      { key: "industries-enterprise",              label: "Enterprise",             fw: "NIS2" }
    ],
    announcement: {
      tag: "New",
      body: "The 2026 Continuous Validation Methodology Paper is now available.",
      cta: "Read the paper →",
      ctaHref: "/CaseStudy_VORNAC_0526.pdf",
      dismiss: "Dismiss announcement"
    },
    footer: {
      tagline: "Enterprise-grade autonomous security testing for continuous assurance and compliance.",
      navHeading: "Navigation",
      legalHeading: "Legal",
      legalLinks: {
        privacy: "Privacy Policy",
        imprint: "Imprint"
      },
      socialsHeading: "Socials",
      socialLinks: {
        linkedin: "LinkedIn",
        gartner: "Gartner Peer Insights"
      },
      copyright: "© 2026 VORNAC GmbH. All rights reserved.",
      langLabel: "Language"
    },
    a11y: {
      siteHome: "VORNAC home",
      langNav: "Language",
      langSwitchTo: "Switch to German",
      menuLabel: "Site navigation",
      closeMenu: "Close menu",
      openMenu: "Open menu"
    }
  },

  de: {
    htmlLang: "de",
    nav: {
      home: "Home",
      pentesting: "Pentesting",
      industries: "Industrien",
      customers: "Kunden",
      research: "Research",
      glossary: "Glossar",
      faq: "FAQ",
      about: "Über uns",
      company: "Unternehmen",
      careers: "Karriere",
      bookDemo: "Demo buchen",
      contact: "Kontakt"
    },
    aboutAnchors: {
      company: "unternehmen",
      careers: "karriere"
    },
    legalAnchors: {
      imprint: "impressum",
      privacy: "datenschutz"
    },
    navHeadings: {
      research: "Research-Domänen",
      industries: "Branchen",
      about: "Über uns",
      glossary: "Referenz",
      legal: "Rechtliches"
    },
    navOverview: "Alle Branchen",
    navResearchHome: "Research-Übersicht",
    industriesNav: [
      { key: "industries-insurance",               label: "Versicherung",            fw: "DORA" },
      { key: "industries-financial-services",      label: "Finanzdienstleistungen",  fw: "DORA · VAIT · BAIT" },
      { key: "industries-critical-infrastructure", label: "Kritische Infrastruktur", fw: "KRITIS · NIS2" },
      { key: "industries-automotive",              label: "Automotive",              fw: "TISAX" },
      { key: "industries-enterprise",              label: "Enterprise",              fw: "NIS2" }
    ],
    announcement: {
      tag: "Neu",
      body: "Das Whitepaper zur kontinuierlichen Sicherheitsvalidierung 2026 ist verfügbar.",
      cta: "Whitepaper lesen →",
      ctaHref: "/CaseStudy_VORNAC_0526.pdf",
      dismiss: "Hinweisleiste schließen"
    },
    footer: {
      tagline: "Autonome Sicherheitsvalidierung auf Enterprise-Niveau – für kontinuierliche Absicherung und Compliance.",
      navHeading: "Navigation",
      // FIX: current DE site renders "Legal" in English. German label is "Rechtliches".
      legalHeading: "Rechtliches",
      legalLinks: {
        privacy: "Datenschutz",
        imprint: "Impressum"
      },
      socialsHeading: "Social Media",
      socialLinks: {
        linkedin: "LinkedIn",
        gartner: "Gartner Peer Insights"
      },
      copyright: "© 2026 VORNAC GmbH. Alle Rechte vorbehalten.",
      langLabel: "Sprache"
    },
    a11y: {
      siteHome: "VORNAC Startseite",
      langNav: "Sprache",
      langSwitchTo: "Auf Englisch wechseln",
      menuLabel: "Seiten-Navigation",
      closeMenu: "Menü schließen",
      openMenu: "Menü öffnen"
    }
  }
};

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
    announcement: {
      tag: "New",
      body: "The 2026 Continuous Validation Methodology Paper is now available.",
      cta: "Read the paper →",
      ctaHref: "/CaseStudy_VORNAC_0526.pdf"
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
        linkedin: "LinkedIn"
      },
      copyright: "© 2026 VORNAC GmbH. All rights reserved.",
      langLabel: "Language"
    },
    cookie: {
      heading: "Privacy Preference",
      body: 'We use <span class="text-stone-900 font-semibold">Plausible Analytics</span> (privacy-friendly, no cookies) and <span class="text-stone-900 font-semibold">Google Ads Conversion Tracking</span>. Your consent is only required for Google Ads.',
      accept: "Accept",
      decline: "Decline",
      readPolicy: "Read Privacy Policy"
    },
    a11y: {
      siteHome: "VORNAC home",
      langNav: "Language",
      langSwitchTo: "Switch to German"
    }
  },

  de: {
    htmlLang: "de",
    nav: {
      home: "Home",
      pentesting: "Pentesting",
      industries: "Industrien",
      customers: "Kunden",
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
    announcement: {
      tag: "Neu",
      body: "Das Whitepaper zur kontinuierlichen Sicherheitsvalidierung 2026 ist verfügbar.",
      cta: "Whitepaper lesen →",
      ctaHref: "/CaseStudy_VORNAC_0526.pdf"
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
        linkedin: "LinkedIn"
      },
      copyright: "© 2026 VORNAC GmbH. Alle Rechte vorbehalten.",
      langLabel: "Sprache"
    },
    cookie: {
      heading: "Datenschutz-Einstellung",
      body: 'Wir nutzen <span class="text-stone-900 font-semibold">Plausible Analytics</span> (datenschutzfreundlich, ohne Cookies) und <span class="text-stone-900 font-semibold">Google Ads Conversion Tracking</span>. Ihre Einwilligung ist nur für Google Ads erforderlich.',
      // FIX: current DE site renders "Accept"/"Decline" in English. German labels.
      accept: "Akzeptieren",
      decline: "Ablehnen",
      readPolicy: "Datenschutzerklärung"
    },
    a11y: {
      siteHome: "VORNAC Startseite",
      langNav: "Sprache",
      langSwitchTo: "Auf Englisch wechseln"
    }
  }
};

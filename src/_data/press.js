/**
 * Press page (/presse, /en/press): contact, awards, coverage, boilerplate,
 * facts and the press kit. One source for both locales; the templates
 * src/de/press.njk and src/press.njk render it through
 * partials/press-render.njk and partials/press-schema.njk.
 *
 * Coverage entries: `date` is YYYY-MM-DD, YYYY-MM or YYYY; the label per
 * locale is derived below. `type` is one of the keys in `types`. `url` is
 * the public source; `pdf` an optional local copy. Newest first.
 *
 * Facts confirmed in the repo: founded 2025 in Heidelberg, HRB 757584
 * Amtsgericht Mannheim, both founders are managing directors (see
 * partials/organization-schema.njk and /legal).
 */

const PHONE = "+49 6221 6479525";
const PHONE_DISPLAY = "+49 6221 647 95 25";

const types = {
  artikel:      { de: "Artikel",        en: "Article" },
  fachbeitrag:  { de: "Fachbeitrag",    en: "Trade-journal article" },
  interview:    { de: "Interview",      en: "Interview" },
  erwaehnung:   { de: "Erwähnung",      en: "Mention" },
  auszeichnung: { de: "Auszeichnung",   en: "Award" },
  paper:        { de: "Forschungspapier", en: "Research paper" },
  podcast:      { de: "Podcast",        en: "Podcast" },
  video:        { de: "Video",          en: "Video" }
};

/** "2026-09" -> { de: "September 2026", en: "September 2026" }, "2026-09-12" -> full date. */
function dateLabel(date) {
  if (!date) return { de: "", en: "" };
  const parts = date.split("-").map(Number);
  const [y, m, d] = parts;
  const out = {};
  for (const [locale, tag] of [["de", "de-DE"], ["en", "en-GB"]]) {
    if (parts.length === 1) { out[locale] = String(y); continue; }
    const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12));
    const opts = parts.length === 2
      ? { month: "long", year: "numeric", timeZone: "UTC" }
      : { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" };
    out[locale] = new Intl.DateTimeFormat(tag, opts).format(dt);
  }
  return out;
}

const coverage = [
  {
    date: "2026-09",
    outlet: "et Energiewirtschaftliche Tagesfragen",
    title: "Vom Messpunkt zum Steuerpunkt: Die neue Angriffsfläche der Verteilnetze",
    url: "",
    pdf: "/vornac-et-fachbeitrag-messpunkt-steuerpunkt-2026.pdf",
    type: "fachbeitrag",
    author: "Arthur Raess",
    cite: "76. Jg. (2026), Heft 9, S. 27 bis 29",
    lang: "de"
  }
].map((c) => Object.assign({}, c, { dateLabel: dateLabel(c.date) }));

const awards = [
  {
    year: "2026",
    date: "2026-10-08",
    title: { de: "Beste Disruption 2026", en: "Best Disruption 2026" },
    by: { de: "EuroCloud Deutschland Award", en: "EuroCloud Deutschland Award" },
    text: {
      de: "Auszeichnung des EuroCloud Deutschland_eco e.V. für die Plattform für kontinuierliche, autonome Penetrationstests.",
      en: "Awarded by EuroCloud Deutschland_eco e.V. for the platform for continuous, autonomous penetration testing."
    },
    url: ""
  },
  {
    year: "2026",
    date: "2026",
    title: { de: "Best of Technology 2026", en: "Best of Technology 2026" },
    by: { de: "WirtschaftsWoche", en: "WirtschaftsWoche" },
    text: {
      de: "Preis der WirtschaftsWoche für Technologieunternehmen aus Deutschland.",
      en: "WirtschaftsWoche award for technology companies from Germany."
    },
    url: ""
  }
].map((a) => Object.assign({}, a, { dateLabel: dateLabel(a.date) }));

const publications = [
  {
    date: "2026-05",
    title: "Autonomous Penetration Testing in High-Complexity Environments: A POMDP Framework and Empirical Evaluation of the VORNAC Agent",
    author: "André Feigenbutz, Arthur Raess",
    url: "/CaseStudy_VORNAC_0526.pdf",
    type: "paper",
    lang: "en",
    note: { de: "Englisch, PDF", en: "English, PDF" }
  }
].map((p) => Object.assign({}, p, { dateLabel: dateLabel(p.date) }));

const kit = [
  { file: "/logo-vornac-black.svg", label: { de: "Logo, schwarz", en: "Logo, black" }, format: "SVG", preview: "light" },
  { file: "/logo-vornac-white.svg", label: { de: "Logo, weiß", en: "Logo, white" }, format: "SVG", preview: "dark" },
  { file: "/V_BLACK.svg", label: { de: "Bildmarke V, schwarz", en: "V mark, black" }, format: "SVG", preview: "light" },
  { file: "/V.svg", label: { de: "Bildmarke V, weiß", en: "V mark, white" }, format: "SVG", preview: "dark" },
  { file: "/founders-group.jpg", label: { de: "Gründer André Feigenbutz und Arthur Raess", en: "Founders André Feigenbutz and Arthur Raess" }, format: "JPG, 1024 × 1024 px", preview: "photo", webp: "/founders-group.webp" },
  { file: "/CaseStudy_VORNAC_0526.pdf", label: { de: "Forschungspapier zum VORNAC-Agenten (Mai 2026)", en: "Research paper on the VORNAC agent (May 2026)" }, format: "PDF, 0,3 MB", preview: "doc" },
  { file: "/vornac-et-fachbeitrag-messpunkt-steuerpunkt-2026.pdf", label: { de: "Fachbeitrag in der et, Heft 9/2026", en: "Trade-journal article in et, issue 9/2026" }, format: "PDF, 0,5 MB", preview: "doc" }
];

module.exports = {
  contact: {
    name: "Angelina Deibert",
    role: { de: "", en: "" },
    email: "presse@vornac.com",
    phone: PHONE,
    phoneDisplay: PHONE_DISPLAY
  },

  speakers: [
    {
      id: "andre-feigenbutz",
      name: "André Feigenbutz",
      role: { de: "Mitgründer und Geschäftsführer", en: "Co-founder and Managing Director" }
    },
    {
      id: "arthur-raess",
      name: "Arthur Raess",
      role: { de: "Mitgründer und Geschäftsführer", en: "Co-founder and Managing Director" }
    }
  ],

  boilerplate: {
    de: {
      short: "VORNAC GmbH, Heidelberg: Plattform für kontinuierliche, autonome Penetrationstests mit auditfähigen Nachweisen für regulierte Unternehmen, betrieben ausschließlich in deutschen Rechenzentren.",
      long: "Die VORNAC GmbH mit Sitz in Heidelberg entwickelt eine Plattform für kontinuierliche, autonome Penetrationstests. Ein KI-gestützter Agent prüft produktive Systeme mit realen Angriffstechniken, verkettet Schwachstellen zu Angriffspfaden und liefert innerhalb von Stunden auditfähige Berichte mit reproduzierbarem Nachweis. Betrieb und Datenhaltung erfolgen ausschließlich in deutschen Rechenzentren. Kunden sind regulierte Unternehmen, die Nachweise nach NIS2, DORA, KRITIS, TISAX und ISO/IEC 27001 erbringen müssen. VORNAC wurde 2025 von André Feigenbutz und Arthur Raess gegründet, ist Mitglied im TeleTrusT Bundesverband IT-Sicherheit e.V. und Partner der Allianz für Cyber-Sicherheit des BSI."
    },
    en: {
      short: "VORNAC GmbH, Heidelberg: platform for continuous, autonomous penetration testing with audit-ready evidence for regulated companies, operated exclusively in German data centres.",
      long: "VORNAC GmbH, based in Heidelberg, develops a platform for continuous, autonomous penetration testing. An AI-driven agent tests production systems with real attack techniques, chains vulnerabilities into attack paths and delivers audit-ready reports with reproducible evidence within hours. Operation and data storage take place exclusively in German data centres. Customers are regulated companies that have to provide evidence under NIS2, DORA, KRITIS, TISAX and ISO/IEC 27001. VORNAC was founded in 2025 by André Feigenbutz and Arthur Raess, is a member of TeleTrusT Bundesverband IT-Sicherheit e.V. and a partner of the BSI's Alliance for Cyber Security."
    }
  },

  facts: [
    { label: { de: "Unternehmen", en: "Company" }, value: { de: "VORNAC GmbH", en: "VORNAC GmbH" } },
    { label: { de: "Gründung", en: "Founded" }, value: { de: "2025 in Heidelberg", en: "2025 in Heidelberg, Germany" } },
    { label: { de: "Gründer und Geschäftsführer", en: "Founders and managing directors" }, value: { de: "André Feigenbutz, Arthur Raess", en: "André Feigenbutz, Arthur Raess" } },
    { label: { de: "Sitz", en: "Registered office" }, value: { de: "Carl-Friedrich-Gauß-Ring 5, 69124 Heidelberg", en: "Carl-Friedrich-Gauß-Ring 5, 69124 Heidelberg" } },
    { label: { de: "Handelsregister", en: "Commercial register" }, value: { de: "HRB 757584, Amtsgericht Mannheim", en: "HRB 757584, Amtsgericht Mannheim" } },
    { label: { de: "Leistungen", en: "Services" }, value: { de: "Kontinuierliches Pentesting, Assumed Breach Simulation, CTEM, OT-Pentesting", en: "Continuous pentesting, assumed breach simulation, CTEM, OT pentesting" } },
    { label: { de: "Datenhaltung", en: "Data residency" }, value: { de: "Ausschließlich deutsche Rechenzentren deutscher Betreiber", en: "German data centres run by German operators only" } },
    { label: { de: "Mitgliedschaften", en: "Memberships" }, value: { de: "TeleTrusT Bundesverband IT-Sicherheit e.V., Allianz für Cyber-Sicherheit (BSI)", en: "TeleTrusT Bundesverband IT-Sicherheit e.V., Alliance for Cyber Security (BSI)" } },
    { label: { de: "Siegel", en: "Seal" }, value: { de: "IT Security made in Germany (TeleTrusT)", en: "IT Security made in Germany (TeleTrusT)" } }
  ],

  types,
  coverage,
  awards,
  publications,
  kit,

  /** UI strings for partials/press-render.njk. */
  ui: {
    de: {
      h1: "Presse",
      lead: "Hier finden Journalistinnen und Journalisten den Pressekontakt der VORNAC GmbH, Heidelberg, Berichte und Fachbeiträge über das Unternehmen, Auszeichnungen, ein Kurzprofil mit Fakten zum Kopieren sowie Logos und Fotos zum Download. Für Interviews mit den Gründern und Hintergrundgespräche zu kontinuierlichen Penetrationstests schreiben Sie an presse@vornac.com.",
      contactHeading: "Pressekontakt",
      awardsHeading: "Auszeichnungen",
      awardsSub: "Preise, die VORNAC für die Plattform erhalten hat, mit Veranstalter und Datum.",
      awardLink: "Zur Preisträgerseite",
      coverageHeading: "Pressespiegel",
      coverageSub: "Berichte, Interviews und Fachbeiträge über VORNAC in Fach- und Wirtschaftsmedien, neueste zuerst.",
      coverageLink: "Beitrag lesen",
      coveragePdf: "PDF",
      by: "von",
      publicationsHeading: "Eigene Veröffentlichungen",
      publicationsSub: "Papiere und Beiträge aus dem Unternehmen, zitierfähig mit Datum und Autor.",
      profileHeading: "Unternehmen in Kürze",
      profileSub: "Kurzprofil und Fakten zur freien Verwendung in redaktionellen Beiträgen.",
      boilerLong: "Kurzprofil",
      boilerShort: "Einzeiler",
      copy: "Text kopieren",
      copied: "Kopiert",
      factsHeading: "Fakten",
      kitHeading: "Presse-Kit",
      kitSub: "Logos, Gründerfoto und Dokumente. Bitte das Logo nicht verzerren, einfärben oder beschneiden.",
      download: "Download",
      speakersHeading: "Gesprächspartner",
      speakersSub: "Die Gründer stehen für Interviews, Hintergrundgespräche und Gastbeiträge zur Verfügung.",
      speakersPhotoAlt: "André Feigenbutz und Arthur Raess, Gründer von VORNAC",
      speakersMail: "Interview anfragen",
      closeHeadline: "Sie recherchieren zu kontinuierlichen Penetrationstests?",
      closeSub: "Wir antworten in der Regel am selben Werktag und vermitteln Gesprächspartner, Zahlen und Hintergrund.",
      closeCta: "presse@vornac.com schreiben"
    },
    en: {
      h1: "Press",
      lead: "This page gives journalists the press contact of VORNAC GmbH, Heidelberg, coverage and trade-journal articles about the company, awards, a company profile with facts ready to copy, and logos and photos for download. For interviews with the founders and background briefings on continuous penetration testing, write to presse@vornac.com.",
      contactHeading: "Press contact",
      awardsHeading: "Awards",
      awardsSub: "Prizes VORNAC has received for the platform, with the awarding body and date.",
      awardLink: "Winners page",
      coverageHeading: "Coverage",
      coverageSub: "Reports, interviews and trade-journal articles about VORNAC in specialist and business media, newest first.",
      coverageLink: "Read the article",
      coveragePdf: "PDF",
      by: "by",
      publicationsHeading: "Our publications",
      publicationsSub: "Papers and articles from the company, citable with date and author.",
      profileHeading: "Company at a glance",
      profileSub: "Company profile and facts for free use in editorial content.",
      boilerLong: "Company profile",
      boilerShort: "One-liner",
      copy: "Copy text",
      copied: "Copied",
      factsHeading: "Facts",
      kitHeading: "Press kit",
      kitSub: "Logos, founder photo and documents. Please do not distort, recolour or crop the logo.",
      download: "Download",
      speakersHeading: "Speakers",
      speakersSub: "The founders are available for interviews, background briefings and guest articles.",
      speakersPhotoAlt: "André Feigenbutz and Arthur Raess, founders of VORNAC",
      speakersMail: "Request an interview",
      closeHeadline: "Researching continuous penetration testing?",
      closeSub: "We usually reply on the same working day and provide speakers, figures and background.",
      closeCta: "Write to presse@vornac.com"
    }
  }
};

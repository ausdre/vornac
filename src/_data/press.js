/**
 * Press page (/presse, /en/press): awards, coverage, publications,
 * boilerplate, facts, press kit, speakers and the press contact. One source
 * for both locales; the templates src/de/press.njk and src/press.njk render
 * it through partials/press-render.njk and partials/press-schema.njk.
 *
 * Every linked item carries a visual: `thumb` is an image path, `thumbKind`
 * is "logo" (outlet or award mark, contained on a soft tile) or "cover" (a
 * page or article image, cropped to the tile). PDF covers are rendered once
 * with pdftoppm (first page, 60 dpi) and committed as press-thumb-*.jpg.
 * Award marks: award-eurocloud.svg (eurocloud.de, 2026-10-09) and
 * award-wirtschaftswoche.png (award.wiwo.de, 2026-10-09).
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

/** Outlet marks already in the repo (also used in the homepage trust band). */
const LOGOS = {
  computerwoche: "/logo_cw.svg",
  cio: "/logo_cio.png",
  cso: "/logo_cso.png",
  rnz: "/logo_rnz.png"
};

const types = {
  artikel:      { de: "Artikel",          en: "Article" },
  fachbeitrag:  { de: "Fachbeitrag",      en: "Trade-journal article" },
  interview:    { de: "Interview",        en: "Interview" },
  erwaehnung:   { de: "Erwähnung",        en: "Mention" },
  auszeichnung: { de: "Auszeichnung",     en: "Award" },
  paper:        { de: "Forschungspapier", en: "Research paper" },
  podcast:      { de: "Podcast",          en: "Podcast" },
  video:        { de: "Video",            en: "Video" },
  post:         { de: "Beitrag",          en: "Post" }
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

const withDates = (list) => list.map((x) => Object.assign({}, x, { dateLabel: dateLabel(x.date) }));

/* Sources checked 2026-10-09 (see docs/presse-recherche-2026-10-09.md). */
const coverage = withDates([
  {
    date: "2026-09-25",
    outlet: "CIO",
    title: "Wenn der KI-Agent zum Pentester wird",
    url: "https://www.cio.de/article/4225545/wenn-der-ki-agent-zum-pentester-wird-2.html",
    type: "artikel",
    author: "Manfred Bremmer",
    summary: {
      de: "Analyse zu kontinuierlichem Pentesting mit KI: Arthur Raess zur Snapshot-Falle des Jahres-Pentests, Betrieb auf deutscher Infrastruktur, Nachweise für NIS2 und DORA.",
      en: "Analysis of continuous AI-driven pentesting: Arthur Raess on the snapshot trap of the annual pentest, operation on German infrastructure, evidence for NIS2 and DORA."
    },
    lang: "de",
    thumb: LOGOS.cio,
    thumbKind: "logo"
  },
  {
    date: "2026-09-18",
    outlet: "Computerwoche",
    title: "Wenn der KI-Agent zum Pentester wird",
    url: "https://www.computerwoche.de/article/4222687/wenn-der-ki-agent-zum-pentester-wird.html",
    type: "artikel",
    author: "Manfred Bremmer",
    summary: {
      de: "Feature über den Ansatz von VORNAC: statt punktueller Sicherheitstests kontinuierliches Pentesting mit einem eigenen Modell ohne externe KI-Dienste, aus deutscher Cloud oder On-Premises.",
      en: "Feature on VORNAC's approach: continuous pentesting with a proprietary model and no external AI services, from a German cloud or on premises, instead of point-in-time tests."
    },
    lang: "de",
    thumb: LOGOS.computerwoche,
    thumbKind: "logo"
  },
  {
    date: "2026-09-04",
    outlet: "et Energiewirtschaftliche Tagesfragen",
    title: "Vom Messpunkt zum Steuerpunkt: Die neue Angriffsfläche der Verteilnetze",
    url: "https://emagazin.et-magazin.de/de/profiles/cb1a7fd451c4/editions/c586a5a226acd313c7a6",
    pdf: "/vornac-et-fachbeitrag-messpunkt-steuerpunkt-2026.pdf",
    type: "fachbeitrag",
    author: "Arthur Raess",
    cite: { de: "76. Jg. (2026), Heft 9, S. 27 bis 29", en: "Vol. 76 (2026), No. 9, pp. 27 to 29" },
    summary: {
      de: "Warum § 14a EnWG den Netzanschluss vom Messpunkt zum Steuerpunkt macht, wo hinter dem Smart-Meter-Gateway die Angriffsfläche entsteht und weshalb jährliche Penetrationstests den Wirksamkeitsnachweis nicht mehr erbringen.",
      en: "Why section 14a of the German Energy Industry Act turns the grid connection from a metering point into a control point, where the attack surface behind the smart meter gateway emerges and why annual penetration tests no longer provide proof of effectiveness."
    },
    lang: "de",
    thumb: "/press-thumb-et-2026-09.jpg",
    thumbKind: "cover"
  },
  {
    date: "2026-06-05",
    outlet: "Computerwoche",
    title: "IT-Security und KI: Warum es auf die Governance ankommt",
    url: "https://www.computerwoche.de/article/4178603/it-security-und-ki-warum-es-auf-die-governance-ankommt.html",
    type: "artikel",
    author: "Florian Stocker",
    summary: {
      de: "Nachbericht zum Roundtable IT- und Cloud Security 2026 mit André Feigenbutz zum offensiven Einsatz von KI und ihrer wachsenden Rolle im Blue Teaming.",
      en: "Report on the IT and Cloud Security 2026 roundtable with André Feigenbutz on the offensive use of AI and its growing role in blue teaming."
    },
    lang: "de",
    thumb: LOGOS.computerwoche,
    thumbKind: "logo"
  },
  {
    date: "2026-04-12",
    outlet: "Rhein-Neckar-Zeitung",
    title: "Ihr KI-Agent ist so kreativ wie ein Hacker",
    url: "https://www.rnz.de/region/heidelberg_artikel,-Heidelberg-Ihr-KI-Agent-ist-so-kreativ-wie-ein-Hacker-_arid,2214253.html",
    type: "artikel",
    author: "Alexander Wenisch",
    summary: {
      de: "Porträt des Heidelberger Unternehmens: Arthur Raess und André Feigenbutz trainieren ihren Agenten auf Verhalten statt auf Wissen, mit 20 Jahren Erfahrung aus der Hacker- und IT-Szene.",
      en: "Profile of the Heidelberg company: Arthur Raess and André Feigenbutz train their agent on behaviour rather than knowledge, drawing on 20 years in the hacker and IT scene."
    },
    note: { de: "RNZ+", en: "RNZ+ (paywall)" },
    lang: "de",
    thumb: LOGOS.rnz,
    thumbKind: "logo"
  }
]);

const awards = withDates([
  {
    year: "2026",
    date: "2026-10-08",
    title: { de: "Beste Disruption", en: "Best Disruption" },
    by: { de: "EuroCloud Award 2026", en: "EuroCloud Award 2026" },
    text: {
      de: "Sieger der Kategorie Beste Disruption beim EuroCloud Summit 2026 in Köln, gewählt von den Teilnehmenden des Summits nach der Top-3-Nominierung. Veranstalter ist der EuroCloud Deutschland_eco e.V.",
      en: "Winner of the Best Disruption category at the EuroCloud Summit 2026 in Cologne, elected by the summit participants after a top-three nomination. Organised by EuroCloud Deutschland_eco e.V."
    },
    url: "https://de.linkedin.com/posts/arthurraess_wer-sorgt-f%C3%BCr-die-beste-disruption-in-deutschland-activity-7514202003955318785-PFto",
    linkLabel: { de: "Zum Beitrag auf LinkedIn", en: "Post on LinkedIn" },
    logo: "/award-eurocloud.svg",
    logoAlt: "EuroCloud Deutschland_eco e.V."
  },
  {
    year: "2026",
    date: "2026-09",
    title: { de: "Best of Technology 2026", en: "Best of Technology 2026" },
    by: { de: "WirtschaftsWoche, Kategorie Cybersecurity", en: "WirtschaftsWoche, Cybersecurity category" },
    text: {
      de: "Finalist in der Kategorie Cybersecurity, ausgezeichnet mit dem Prädikat Exzellent. Wissenschaftlicher Partner des Awards ist das Fraunhofer ISI.",
      en: "Finalist in the Cybersecurity category, awarded the rating Excellent. Fraunhofer ISI is the award's scientific partner."
    },
    url: "https://award.wiwo.de/bot/gewinner-2026/",
    logo: "/award-wirtschaftswoche.png",
    logoAlt: "WirtschaftsWoche"
  }
]);

const publications = withDates([
  {
    date: "2026-05",
    title: "Autonomous Penetration Testing in High-Complexity Environments: A POMDP Framework and Empirical Evaluation of the VORNAC Agent",
    author: "André Feigenbutz, Arthur Raess",
    url: "/CaseStudy_VORNAC_0526.pdf",
    type: "paper",
    lang: "en",
    note: { de: "Englisch, PDF", en: "English, PDF" },
    thumb: "/press-thumb-paper-2026-05.jpg",
    thumbKind: "cover"
  }
]);

const kit = [
  { file: "/logo-vornac-black.svg", label: { de: "Logo, schwarz", en: "Logo, black" }, format: "SVG", preview: "light" },
  { file: "/logo-vornac-white.svg", label: { de: "Logo, weiß", en: "Logo, white" }, format: "SVG", preview: "dark" },
  { file: "/V_BLACK.svg", label: { de: "Bildmarke V, schwarz", en: "V mark, black" }, format: "SVG", preview: "light" },
  { file: "/V.svg", label: { de: "Bildmarke V, weiß", en: "V mark, white" }, format: "SVG", preview: "dark" },
  { file: "/founders-award-print.jpg", label: { de: "Gründer André Feigenbutz und Arthur Raess", en: "Founders André Feigenbutz and Arthur Raess" }, format: "JPG, 4000 × 2913 px, 1,1 MB", preview: "photo", webp: "/founders-award.webp" },
  { file: "/CaseStudy_VORNAC_0526.pdf", label: { de: "Forschungspapier zum VORNAC-Agenten (Mai 2026)", en: "Research paper on the VORNAC agent (May 2026)" }, format: "PDF, 0,3 MB", preview: "cover", thumb: "/press-thumb-paper-2026-05.jpg" },
  { file: "/vornac-et-fachbeitrag-messpunkt-steuerpunkt-2026.pdf", label: { de: "Fachbeitrag in der et, Heft 9/2026", en: "Trade-journal article in et, issue 9/2026" }, format: "PDF, 0,5 MB", preview: "cover", thumb: "/press-thumb-et-2026-09.jpg" }
];

module.exports = {
  logos: LOGOS,

  contact: {
    name: "Angelina Deibert",
    role: { de: "Founders Associate", en: "Founders Associate" },
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
      awardsHeading: "Auszeichnungen",
      awardsSub: "Preise, die VORNAC für die Plattform erhalten hat, mit Veranstalter und Datum.",
      awardLink: "Zur Preisträgerseite",
      coverageHeading: "Pressespiegel",
      coverageSub: "Berichte, Interviews und Fachbeiträge über VORNAC in Fach- und Wirtschaftsmedien, neueste zuerst.",
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
      contactHeading: "Pressekontakt",
      contactLead: "Journalistinnen und Journalisten erreichen uns unter presse@vornac.com. Wir vermitteln Interviews mit den Gründern, Hintergrundgespräche zu kontinuierlichen Penetrationstests, Zahlen und Bildmaterial und antworten in der Regel am selben Werktag.",
      contactCta: "presse@vornac.com schreiben"
    },
    en: {
      h1: "Press",
      awardsHeading: "Awards",
      awardsSub: "Prizes VORNAC has received for the platform, with the awarding body and date.",
      awardLink: "Winners page",
      coverageHeading: "Coverage",
      coverageSub: "Reports, interviews and trade-journal articles about VORNAC in specialist and business media, newest first.",
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
      contactHeading: "Press contact",
      contactLead: "Journalists can reach us at presse@vornac.com. We arrange interviews with the founders, background briefings on continuous penetration testing, figures and images, and usually reply on the same working day.",
      contactCta: "Write to presse@vornac.com"
    }
  }
};

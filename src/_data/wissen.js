/**
 * Wissen section: the German explainer pages under /wissen and /vergleich.
 *
 * One entry per page. `key` is the registry key (src/_data/pages.js) and the
 * i18nKey of the template; `title` and `blurb` feed the index page
 * (src/de/wissen.njk) and the Atom feed (src/feed.njk). Newest page first.
 * Dates come from dates.js at render time, never from here.
 *
 * Tag "Vergleich" marks the competitor pages under /vergleich. They stay in
 * `pages` (index /wissen and feed), and are also exposed as `comparisons`
 * for the /vergleich hub; `explainers` is everything else (product-page
 * teaser).
 */
const pages = [
    {
      key: "wissen-ctem-in-der-praxis",
      tag: "CTEM",
      title: "Kontinuierliche Sicherheitsüberprüfung und Compliance für deutsche Unternehmen: CTEM in der Praxis",
      blurb: "Die fünf Phasen nach Gartner mit Zuständigkeiten und Werkzeugen im Mittelstand, was in 48 Stunden implementierbar ist, sechs Kennzahlen und der Nachweis für ISO/IEC 27001 A.8.8, NIS2, TISAX und DORA. Mit Anbietern nach Phase und Datenhaltung."
    },
    {
      key: "wissen-assumed-breach-simulation",
      tag: "Verfahren",
      title: "Assumed Breach Simulation: Sicherheit und Compliance für deutsche Unternehmen",
      blurb: "Ablauf in acht Schritten, Abgrenzung zu Breach and Attack Simulation, Nachweis für NIS2, TISAX, ISO/IEC 27001 und DORA, deutsche Besonderheiten bei Datenhaltung, Betriebsrat und Zertifizierung, Anbieter nach Ansatz und Sitz."
    },
    {
      key: "wissen-dora-resilienztests",
      tag: "DORA",
      title: "Anforderungen an Penetrationstests nach DORA für Banken und Versicherer",
      blurb: "Art. 24 bis 27 DORA im Wortlaut: jährliche Tests der Systeme kritischer Funktionen, Testarten nach Art. 25, TLPT alle drei Jahre unter BaFin-Aufsicht. Mit der Grenze zwischen kontinuierlichem Pentest und TLPT und Anbietern je Stufe."
    },
    {
      key: "wissen-nis2-anbieter",
      tag: "NIS2",
      title: "NIS2-Compliance durch kontinuierliche, automatisierte Sicherheitstests: Anbieter und Plattformen in Deutschland",
      blurb: "Welche Anbieterklasse welchen Nachweis für § 30 BSIG liefert, was „für NIS2 zertifiziert“ bedeutet und welche Plattformen und Dienstleister in Deutschland in Frage kommen. Mit Zuordnung zu den zehn Maßnahmenbereichen und acht Prüffragen."
    },
    {
      key: "wissen-automatisierte-penetrationstests",
      tag: "Verfahren",
      title: "Automatisierte Penetrationstests: Verfahren, Anbieter in Deutschland, Kosten und Nachweiswert",
      blurb: "Werkzeugklassen, Betrieb in der Produktion, Kostenmodelle und der Nachweis für NIS2, TISAX, ISO/IEC 27001 und DORA. Mit Anbieterübersicht nach Ansatz und Sitz."
    },
    {
      key: "vergleich-pentera-alternative",
      tag: "Vergleich",
      title: "VORNAC oder Pentera: Vergleich für Unternehmen in Deutschland",
      blurb: "Anbieter, Testumfang, Betriebsmodell, Datenstandort, Nachweise, Ansprechpartner und Preismodell im Vergleich, mit öffentlichen Quellen und Datum."
    },
    {
      key: "wissen-nis2-wirksamkeitspruefung",
      tag: "NIS2",
      title: "NIS2: Wirksamkeit der Sicherheitsmaßnahmen belegen (§ 30 BSIG)",
      blurb: "Was § 30 Abs. 2 Satz 2 Nr. 6 BSIG verlangt und welchen Nachweis ein kontinuierlicher Penetrationstest liefert. Mit der Lesart des BSI im Wortlaut."
    }
  ];

module.exports = {
  pages,
  comparisons: pages.filter((p) => p.tag === "Vergleich"),
  explainers: pages.filter((p) => p.tag !== "Vergleich")
};

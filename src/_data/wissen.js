/**
 * Wissen section: the German explainer pages under /wissen and /vergleich.
 *
 * One entry per page. `key` is the registry key (src/_data/pages.js) and the
 * i18nKey of the template; `title` and `blurb` feed the index page
 * (src/de/wissen.njk) and the Atom feed (src/feed.njk). Newest page first.
 * Dates come from dates.js at render time, never from here.
 */
module.exports = {
  pages: [
    {
      key: "wissen-automatisierte-penetrationstests",
      tag: "Verfahren",
      title: "Automatisierte Penetrationstests: Verfahren, Anbieter in Deutschland, Kosten und Nachweiswert",
      blurb: "Werkzeugklassen, Betrieb in der Produktion, Kostenmodelle und der Nachweis für NIS2, TISAX, ISO/IEC 27001 und DORA. Mit Anbieterübersicht nach Ansatz und Sitz."
    },
    {
      key: "vergleich-vornac-vs-pentera",
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
  ]
};

/**
 * Customer quotes as shown on /customers and /en/customers, used to emit
 * Review JSON-LD (partials/customers-schema.njk). Keep the wording in sync
 * with the quote cards in src/customers.njk and src/de/customers.njk: the
 * structured data must match what the page shows.
 *
 * Reviews carry no rating on purpose: the page shows none, and a rating in
 * the markup that readers cannot see would be a policy violation.
 */
module.exports = [
  {
    author: "Michael Müller",
    jobTitle: { en: "CEO", de: "CEO" },
    company: "mbits GmbH",
    body: {
      en: "We build software for hospitals. Security isn't a feature, it's table stakes. Our partners need to hit the same bar we hold ourselves to. VORNAC delivers on both fronts. Instead of one-off engagements, we get continuous testing that matches our release cadence, findings we can ship straight into the backlog, and full visibility into our security posture at any moment. A partner that operates as an extension of our team, and one we recommend to our healthcare customers without hesitation.",
      de: "Wir entwickeln Software für Krankenhäuser. Da ist Sicherheit keine Option, sondern Pflicht. Unsere Partner müssen genauso hohe Ansprüche an Qualität und Verlässlichkeit haben wie wir selbst. VORNAC erfüllt beides. Statt klassischer Einmalprojekte bekommen wir kontinuierliche Sicherheitstests, die zu unserem Tempo passen, klare Ergebnisse, die wir direkt umsetzen können, und jederzeit volle Transparenz über unseren Sicherheitsstatus. Ein Partner, der mitdenkt, und den wir unseren Kunden im Gesundheitswesen guten Gewissens weiterempfehlen können."
    }
  },
  {
    author: "Nikolai Gulatz",
    jobTitle: { en: "CIO", de: "CIO" },
    company: "Instaffo GmbH",
    body: {
      en: "Test results flow straight into our internal ticketing system. Findings are prioritized by technical severity. Our engineering team works through them as regular development tasks. The exact technical write-ups eliminate long alignment rounds on reproducing the bug.",
      de: "Die Testergebnisse fließen direkt in unser internes Ticket-System. Die gefundenen Sicherheitslücken sind dort nach technischer Kritikalität priorisiert. Unser Entwicklerteam arbeitet diese Tickets als reguläre Entwicklungsaufgaben ab. Lange Abstimmungsrunden zur Fehlerreproduktion entfallen durch die exakten technischen Fehlerbeschreibungen."
    }
  },
  {
    author: "Bernhard Gauß",
    jobTitle: { en: "Managing Director", de: "Geschäftsführer" },
    company: "IP-Crew GmbH",
    body: {
      en: "VORNAC's licensing is a flat fee. That lets us bake security into every new software module as a fixed line item from day one. Unlimited test runs mean predictable budgets for our mid-market clients. No surprises.",
      de: "Das Lizenzmodell von VORNAC operiert mit festen Nutzungspauschalen. Wir integrieren die Aufwände für die IT-Sicherheit als festen Posten bei der Einführung neuer Softwaremodule. Die unbegrenzte Anzahl an Tests ermöglicht eine exakte Budgetplanung für unsere Auftraggeber aus dem Mittelstand."
    }
  },
  {
    author: "Christopher Wesch",
    jobTitle: { en: "Managing Director", de: "Geschäftsführer" },
    company: "tilko GmbH",
    body: {
      en: "As a Wi-Fi and network specialist, we build the infrastructure our customers run their business on, and that responsibility doesn't end at handover. With VORNAC, we have a partner that probes those networks continuously and autonomously, not once a year. We catch risks before they turn into incidents, and we can show our customers hard evidence that the networks we operate are secure.",
      de: "Als WLAN- und Netzwerk-Spezialist bauen wir die Infrastruktur, auf der unsere Kunden ihr Tagesgeschäft betreiben. Diese Verantwortung endet für uns nicht mit dem Rollout. Mit VORNAC haben wir einen Partner, der unsere Netzwerke kontinuierlich und autonom auf Schwachstellen prüft, nicht einmal im Jahr, sondern fortlaufend. Wir sehen Risiken, bevor sie zum Problem werden, und können unseren Kunden gegenüber nachvollziehbar belegen, dass die Netze, die wir betreuen, sicher betrieben werden."
    }
  }
];

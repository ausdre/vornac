# KI-Sichtbarkeitsplan VORNAC

> Konvertiert aus dem Cowork-Artefakt vom 5. September 2026. Stand 5. September 2026 · Datenbasis Peec-Projekt VORNAC, Messung 3. Sept. · Prompts 40, Land DE · Antworten 247 (ChatGPT 118, Perplexity 120, AI Overview 9)

Wie VORNAC in den Antworten von ChatGPT, Perplexity und Google AI Overview zu den Kaufentscheidungen deutscher Unternehmen auftaucht: Befund aus dem Peec-Projekt, vier Pläne mit konkreten Seiten, Dateien, Zielquellen und Messpunkten, zwölf Wochen Zeitplan.

**Kurzfassung.** VORNAC kommt in keiner der 247 KI-Antworten zu den 40 getrackten Kaufprompts vor. Tenable, Pentera und Rapid7 werden in 6 bis 10 Prozent der Antworten genannt. vornac.com wurde sechsmal abgerufen und nie zitiert: Die Engines erreichen nur die englische Startseite, und die beantwortet keine der gestellten Fragen. Drei Hebel greifen ineinander. Plan A öffnet die Website technisch für KI-Crawler und stellt sie auf Deutsch. Plan B baut die Seitentypen, die die Engines tatsächlich zitieren: Regelwerkseiten mit Paragrafen, Definitionsseiten, Vergleiche, Preise, eine Anbieterübersicht. Plan C bringt VORNAC in die Verzeichnisse und Listen, aus denen ChatGPT seine Empfehlungen zieht. Plan D regelt Messung und Peec-Setup.

Erste messbare Effekte (Abrufe, erste Zitate) sind nach vier bis sechs Wochen realistisch. Listenplätze, Reviews und stabile Nennungen brauchen acht bis zwölf Wochen. Fünf Entscheidungen liegen bei dir, siehe Abschnitt 8. Für die Sprach- und Domainfrage steht ein fertiger Branch bereit, siehe Abschnitt 3.

## 1 · Befund: Null Nennungen, sechs Abrufe, kein Zitat

- **0 %** Sichtbarkeit VORNAC. 0 von 247 Antworten nennen die Marke.
- **2,4 %** Abrufquote vornac.com. 6 Antworten, alle ChatGPT, 0 Zitate.
- **10,1 %** Tenable, die meistgenannte Marke. Pentera 8,5 %, Rapid7 6,5 %.
- **38,9 %** Anteil der Antworten, die bund.de (BSI) heranziehen. 393 Zitate.

### Sichtbarkeit je Marke, alle Prompts und Engines

| Marke | Sichtbarkeit |
| --- | --- |
| Tenable | 10,1 % |
| Pentera | 8,5 % |
| Rapid7 | 6,5 % |
| Enginsight | 1,6 % |
| VORNAC | 0 % |

Anteil der Antworten, in denen die Marke vorkommt. Sentiment der Wettbewerber liegt bei 52 bis 56 von 100, die Engines loben niemanden. Die Nennungen konzentrieren sich auf ChatGPT (Tenable und Pentera je 15,3 %); Perplexity nennt jede Marke nur in 2,5 % der Antworten.

### Wer welches Thema gewinnt

| Thema (Peec-Topic) | Antworten | Genannte Marken (Sichtbarkeit) | VORNAC |
| --- | --- | --- | --- |
| Automatisierte Penetrationstests | 52 | Pentera 21,2 %, Tenable 19,2 %, Rapid7 5,8 %, Enginsight 5,8 % | 0 |
| Assumed Breach Simulation Software | 48 | Pentera 20,8 %, Tenable 6,3 %, Rapid7 4,2 % | 0 |
| NIS2 Compliance Lösungen | 49 | Rapid7 10,2 %, Tenable 8,2 %, Enginsight 2,0 % | 0 |
| IT-Sicherheitsüberprüfung nach BSI-Standard | 49 | Tenable 10,2 %, Rapid7 6,1 % | 0 |
| Continuous Threat Exposure Management | 49 | Tenable 6,1 %, Rapid7 6,1 % | 0 |

### Was die Engines stattdessen zitieren

Die 247 Antworten stützen sich auf ein überschaubares Muster von Quellen. In dieser Reihenfolge:

- **Behörden und Normen.** bund.de in 38,9 % aller Antworten: BSI-Leitfaden Penetrationstest (29 Zitate), IT-Grundschutz-Kompendium, die BSI-Liste zertifizierter IT-Sicherheitsdienstleister (14 Zitate), das NIS-2-Infopaket zur Wirksamkeitsbewertung. Dazu europa.eu, gesetze-im-internet.de, iso.org, der ISACA-Implementierungsleitfaden ISO 27001 (39 Zitate).
- **Kaufratgeber und Listen.** secjur.com NIS2-Software (26 Zitate), Computerwoche-Kaufratgeber BAS-Tools (25), orbiqhq.com NIS2-Software (34 in zwei Sprachfassungen), kertos.io, proliance.ai, usecure.io, aikido.dev, guideflow.com.
- **Erklärseiten von Anbietern.** SentinelOne "Was ist Breach and Attack Simulation": 22 Zitate aus nur 3 Abrufen. Cymulate, Picus, XM Cyber, Greenbone, Mondoo (CTEM), Praetorian (Continuous Security Testing). Erklärseiten werden je Abruf deutlich häufiger zitiert als Produktseiten.
- **Regelwerkseiten von Anbietern.** binsec (TISAX/VDA ISA), DSecured (TISAX-Pentest), Secfix (TISAX), DataGuard (NIS2-Zertifizierung), Cymulate (NIS2 Solution Brief).
- **Anbieterlisten für Deutschland.** a7.de, nica-it.de, deepstrike.io, binsec.wiki, microcat.de, yekta-it.de, pentest-anbieter.de, it-sicherheit.de, sortlist.de; dazu G2 (in 22 Antworten abgerufen), OMR Reviews (13), Capterra, SourceForge, LinkedIn (18).
- **Konkrete Preise.** ChatGPT übernimmt Preisangaben wörtlich: microCAT wurde mit "2.000 € für bis zu 100 IP-Adressen" zitiert.

### Die Kernfrage im Wortlaut

Auf "Welche Anbieter für automatisierte Penetrationstests in Deutschland sind empfehlenswert?" antwortet ChatGPT mit microCAT, indevis (auf Pentera-Basis), Offensity und Matproof, ergänzt um SySS, usd, RedTeam Pentesting und binsec. Die Quellen: die Anbieterseiten selbst plus vier Listen (nica-it, deepstrike, binsec.wiki, a7). Perplexity liefert auf dieselbe Frage nur klassische Pentest-Häuser und Vergleichsportale.

Aufschlussreich sind die Suchanfragen, die ChatGPT dafür absetzt:

"automatisierte Penetrationstests Anbieter Deutschland Pentest as a Service BAS automated penetration testing"  
"Pentest as a Service Deutschland Anbieter automatisierte Sicherheitsprüfung"  
"TISAX automatisierte Penetrationstests Anbieter"
ChatGPT-Suchanfragen aus den Peec-Chats vom 3. September 2026

Genau diese Wortkombinationen fehlen auf vornac.com. "Pentest as a Service" steht auf keiner der 69 deutschen Seiten, CTEM ebenfalls nicht, "Assumed Breach" zweimal, "Breach and Attack Simulation" nur als Spaltenkopf einer Tabelle.

### Drei Ursachen

**1. Die Engines erreichen die falsche Seite.** Die Root-URL ist Englisch, x-default zeigt auf Englisch, die Weiche nach /de läuft nur im Browser per JavaScript. Crawler führen kein JavaScript aus. In allen sechs Abrufen holte ChatGPT https://www.vornac.com/ mit dem Titel "84% less cyber risk with VORNAC" für deutsche Fragen zu TISAX, ISO 27001 und NIS2. Die Seite beantwortet keine dieser Fragen, also gibt es kein Zitat. Die deutschen Seiten sind inhaltlich vollwertig (die Startseite nennt NIS2, DORA, TISAX, BSI, KRITIS, ISO 27001 und den Pentera-Vergleich), sie werden nur nicht gefunden.

**2. Die zitierten Seitentypen existieren nicht.** Keine Seite beantwortet "Was ist automatisiertes Pentesting", "Was ist Assumed Breach Simulation" oder "Was verlangt NIS2 an Wirksamkeitsprüfung". Es gibt keine Vergleichsseite außer der Tabelle auf der Startseite, keine Preisseite, keine Anbieterübersicht, kein deutsches Whitepaper. Der Link "Whitepaper lesen" führt auf ein englisches POMDP-Forschungspapier ohne Metadaten. Die 53 Research-Seiten behandeln generische Offensive-Security-Themen (Kerberoasting, AWS, XSS) ohne Bezug zu den Kaufprompts, ohne Datum, Autor oder strukturierte Daten. Von 69 deutschen Seiten tragen 10 überhaupt JSON-LD.

**3. VORNAC steht in keiner Quelle, die Anbieter listet.** Nicht in den deutschen Pentest-Anbieterlisten, nicht auf G2, OMR Reviews, Gartner Peer Insights, Capterra oder SourceForge, nicht in der BSI-Liste, nicht auf der öffentlichen ITSMIG-Zeichenträgerliste von TeleTrusT. Das Crunchbase-Profil ist leer. Einzige Fremdquelle mit Substanz: die Allianz für Cyber-Sicherheit führt VORNAC als Partner mit einem Beitrag vom 23. Juli 2026.

Dazu kommt eine Verschiebung in der Interpretation. "BSI-Standards" liest ChatGPT als Managed SOC und empfiehlt 8com, GISA und telent. "NIS2 automatisierte Sicherheitsüberprüfung" liest es als GRC-Plattform und nennt Vanta, Kertos, Secfix, DataGuard. VORNAC braucht deshalb eine eigene Begriffsführung: der technische Wirksamkeitsnachweis nach § 30 Abs. 2 Satz 2 Nr. 6 BSIG, den GRC-Tools nicht erbringen, weil sie nichts angreifen.

## 2 · Plan A: Technik und Struktur, Woche 1 bis 2

Ziel: Crawler finden die deutschen Seiten, erkennen die Entität VORNAC GmbH und lesen Datum, Autor, Leistung und Preis maschinell. Die Dateien für A1, A2 und A4 liegen im Anhang und sind einbaufertig für die Eleventy-Site auf Vercel.

| Nr | Maßnahme | Was genau | Aufwand |
| --- | --- | --- | --- |
| A1 | robots.txt anlegen | Existiert nicht, der 404 liefert die HTML-Fehlerseite. Datei im Anhang und im Branch: alle KI-Crawler ausdrücklich zugelassen (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot, Amazonbot, meta-externalagent), Sitemap-Zeile, Command Center gesperrt (Mock-Dashboard mit fiktiven Zeitstempeln, derzeit indexierbar). Der Passthrough in `.eleventy.js` existiert schon, nur die Datei fehlte. | Im Branch |
| A2 | llms.txt anlegen | Kuratierter Einstieg für KI-Crawler: Beschreibung, Leistungen, Regelwerke, Kontakt, Links auf die deutschen Kernseiten. Picus liefert bereits eine llms.txt, Pentera und Cymulate nicht. Datei im Anhang und im Branch; neue Seiten aus Plan B werden ergänzt. | Im Branch |
| A3 | Deutsch als Standardsprache | Root wird Deutsch (`/`, `/pentesting`, `/faq`), Englisch wandert nach `/en`, `/de/*` leitet auf `/*`, vornac.de leitet auf www.vornac.com. Fertig gebaut im Branch `feat/de-root`; drei Abläufe mit allen Schritten in [Abschnitt 3](#sprache). Keine Bot-Weiche per User-Agent, das wäre Cloaking. | Deploy plus Nacharbeiten 2 bis 3 Std |
| A4 | Strukturierte Daten ausbauen | Organization mit Adresse, Gründern, Gründungsdatum, HRB, Telefon, memberOf (TeleTrusT, Allianz für Cyber-Sicherheit), sameAs (LinkedIn, Crunchbase). Service mit Offer (15.000 € pro Jahr und Zielsystem, sobald der Preis öffentlich ist). FAQPage auf jeder neuen Regelwerkseite. DefinedTermSet für die 155 Glossarbegriffe (die Anker `li id="term-…"` existieren schon). TechArticle mit author, datePublished, dateModified für Wissen und Research. Snippets im Anhang. | 1 Tag |
| A5 | Datum und Autor sichtbar | Keine der 76 Seiten zeigt Datum oder Autor. Jede Inhaltsseite bekommt "Stand: TT.MM.JJJJ" und einen Autor mit Kurzprofil (Mitgründer, BSI-qualifizierter Pentester). Sitemap-lastmod je Seite aus dem Git-Datum statt pauschal 2026-08-28 für alle 139 URLs. | 0,5 Tag |
| A6 | Interne Links ohne Trailing Slash | Rund 3.700 interne Links je Build, darunter jeder Research-Querverweis, zeigten auf `…/`; Vercel antwortet mit 308 auf die Form ohne Slash. Erledigt im Branch `feat/de-root` über einen Build-Transform in `.eleventy.js`. | Erledigt |
| A7 | Feed und Sitemap | Atom-Feed für Wissen und Research, damit Perplexity und Google neue Seiten sofort sehen; `link rel="alternate"` im Head. Optional `/de/sitemap.xml`. | 2 Std |
| A8 | PDFs | `CaseStudy_VORNAC_0526.pdf` ist ein englisches POMDP-Forschungspapier mit leeren Metadaten und hängt hinter "Whitepaper lesen". Umbenennen (research paper), Title/Author/Subject/Keywords setzen. Echtes deutsches Whitepaper und eine Case Study als eigene PDFs mit HTML-Fassung (Plan B, B15). | Teil von B |
| A9 | Kategoriebegriffe auf der Startseite | Peec empfiehlt für die Startseite die Begriffe, mit denen die Engines Lösungen einordnen: "Exposure Validation Platform", "Penetration Testing Platform", "Automated Security Validation", "Breach and Attack Simulation", "Pentest as a Service". In H2 und Fließtext führen, deutsch mit englischem Begriff in Klammern. | 1 Std |

## 3 · Sprache und Domain: Drei Abläufe, einer davon fertig gebaut

Ausgangslage im Repo ausdre/vornac (Eleventy 3, Vercel-Projekt "vornac", Team VORNAC): Quelle src/de/\* ist Deutsch, alles andere Englisch. Die Registry src/_data/pages.js liefert je Seite beide URLs und speist hreflang, Canonical, Sprachumschalter, Navigation und Sitemap. x-default zeigt auf Englisch. Der Sprachwechsel für deutsche Browser läuft per JavaScript in lang-redirect.njk. Dem Vercel-Projekt sind vier Domains zugeordnet: vornac.com, www.vornac.com, vornac.de, www.vornac.de. vercel.json leitet nur vornac.com auf www um; **vornac.de und www.vornac.de liefern die komplette Site als Duplikat** (geprüft am 5. September: Status 200 auf /, /de und /pentesting, Canonical zeigt auf www.vornac.com). Das ist unabhängig von der Sprachfrage zu beenden.

| Ablauf | Ergebnis | Wirkung auf KI-Engines | Aufwand | Risiko |
| --- | --- | --- | --- | --- |
| **A** Deutsch als Root auf www.vornac.com, Englisch unter /en, vornac.de leitet um | Ein Host, eine Autorität, jeder Bot erhält auf der Root-URL Deutsch | Hoch: die Root-URL ist die Seite, die ChatGPT und Perplexity abrufen | Erledigt im Branch, 25 Dateien; Deploy plus Nacharbeiten 2 bis 3 Stunden | Englische Seiten wechseln die URL; alte EN-Pfade liefern künftig Deutsch |
| **B** vornac.de wird die deutsche Site, vornac.com bleibt Englisch | Zwei Deployments aus einem Repo, .de als Herkunftssignal | Mittel bis hoch, aber die neue Domain startet ohne Verweise; alle Verzeichnisse zeigen heute auf vornac.com | 2 bis 3 Tage plus doppelte Pflege (Search Console, Bing, Ads, Analytics, llms.txt) | Autorität geteilt, Einträge müssen auf .de umgestellt werden |
| **C** Minimal: URLs bleiben, x-default auf /de, Duplikat beenden | Sauberere Signale, Root bleibt Englisch | Gering: die Root-URL bleibt die englische Seite | 1 Stunde | Keines, löst das Kernproblem aber nicht |

Empfehlung: Ablauf A. Er ist umgesetzt und gebaut: Branch feat/de-root, zwei Commits, Build fehlerfrei mit 142 HTML-Seiten, kein verbleibender Link auf /de, kein interner Link mit Trailing Slash. Die beiden Patch-Dateien liegen im Chat. Ein Push aus dieser Session scheitert, weil das Repository nicht zu den Session-Quellen gehört; entweder das Repo in den Session-Einstellungen hinzufügen, dann öffne ich den Pull Request, oder die Patches lokal einspielen.

### Ablauf A, Schritt für Schritt

**Schritt 1, Branch einspielen.** Im Repo: `git checkout -b feat/de-root && git am 0001-*.patch 0002-*.patch`. Alternativ Repo zur Session hinzufügen; dann pushe ich den Branch und lege den Pull Request an.

**Schritt 2, was der Branch ändert.** Die Quellen bleiben, wo sie sind; nur die Ausgabe wird umgehängt.

| Datei | Änderung |
| --- | --- |
| src/src.11tydata.js | Permalink-Regel: src/de/\* wird an der Root ausgegeben, src/\* unter /en. Das ist der eigentliche Umschalter. |
| src/_data/pages.js | Registry: de: "/pentesting", en: "/en/pentesting" für alle 17 statischen Seiten, 8 Research-Domänen und 45 Research-Notizen. Daraus entstehen hreflang, Canonical, Umschalter, Navigation, Sitemap. |
| src/_data/site.js | defaultLocale: "de", Tabelle localePrefix. |
| src/index.njk, src/de/index.njk, research-note.njk und research-domain.njk (je EN und DE), src/404.njk | Explizite Permalinks getauscht; 404 bleibt fest auf /404.html, weil Vercel die Datei dort erwartet. |
| src/_data/crosslinks.js | Glossar- und Research-Links: Präfix /en für Englisch statt /de für Deutsch (vier Stellen). |
| .eleventy.js | Locale-Erkennung im Crosslink-Transform (dist/en/ statt dist/de/), Glossar-Selbstlink-Ausnahme, Passthrough für llms.txt, neuer Transform, der interne Links ohne Trailing Slash schreibt (vorher rund 3.700 Links je Build mit 308-Umleitung). |
| partials/lang-redirect.njk | Keine automatische Umleitung mehr, nur noch Speichern von ?lang=. Grund: Googlebot rendert mit en-US; eine JS-Umleitung auf der deutschen Root würde Google die englische Seite unter der deutschen URL zeigen. Bots und KI-Engines holen die Root ohne JavaScript und bekommen Deutsch. |
| partials/site-header.njk, research-\*-render.njk, hero-demo-button.njk, ot-pentesting.njk (EN und DE), de/thank-you.njk | Hart verdrahtete Pfade auf Registry oder neues Präfix umgestellt; Formspree-Ziel /thank-you (DE) und /en/thank-you (EN). |
| src/sitemap.njk | Deutsche URL je Seite zuerst, Alternates in beide Richtungen, x-default bleibt Englisch als Fallback für alle anderen Sprachen. Wer nur den deutschen Markt will, stellt x-default später auf die Root um (eine Zeile in head-meta.njk und sitemap.njk). |
| vercel.json | Redirect-Tabelle unten. Alle Regeln als permanent (Vercel antwortet mit 308). |
| robots.txt, llms.txt | Neu im Repo-Root, Passthrough nach dist/; Links bereits im neuen Schema. |

**Schritt 3, Redirects nach dem Deploy.**

| Anfrage | Antwort |
| --- | --- |
| https://vornac.de/\*, https://www.vornac.de/\* | 308 auf https://www.vornac.com/\* (gleicher Pfad); /de-Pfade auf den .de-Hosts springen in einem Schritt auf den Root-Pfad |
| https://vornac.com/\* | 308 auf https://www.vornac.com/\* (bestehend) |
| /de | 308 auf / |
| /de/pentesting, /de/faq, /de/research/… | 308 auf /pentesting, /faq, /research/… |
| /pentesting.html, /about.html, … (alte englische Dateinamen) | 308 auf /en/pentesting, /en/about, … |
| /pentesting_de, /about_de.html, … (alte deutsche Dateinamen) | 308 auf /pentesting, /about, … |
| /research/offensive-tradecraft/ (mit Slash) | 308 auf die Form ohne Slash (bestehend, jetzt ohne interne Links dorthin) |
| /pentesting (früher Englisch) | 200, liefert jetzt Deutsch; Englisch unter /en/pentesting. Keine Umleitung möglich, der Pfad wird wiederverwendet. |

**Schritt 4, Preview prüfen, dann mergen.** Vercel baut für den Branch ein Preview-Deployment. Dort diese Prüfungen laufen lassen (ich übernehme das, sobald die Preview-URL steht):

curl -s https://PREVIEW/ | grep -o '<html lang="[a-z]\*"' → de  
curl -s https://PREVIEW/en | grep -o '<html lang="[a-z]\*"' → en  
curl -sI https://PREVIEW/de/faq | grep -i '^location' → /faq  
curl -sI https://PREVIEW/pentesting.html | grep -i '^location' → /en/pentesting  
curl -s https://PREVIEW/ | grep -o 'hreflang="[^"]\*" href="[^"]\*"' → de auf /, en auf /en, x-default auf /en  
curl -s https://PREVIEW/sitemap.xml | grep -c '<loc>' → 139  
curl -s https://PREVIEW/robots.txt, …/llms.txt, …/404-test → Inhalt, Inhalt, 404-Seite  
curl -A "GPTBot" -s https://PREVIEW/ | grep -o '<title>[^<]\*' → deutscher Titel

Nach dem Merge auf main dieselben Prüfungen gegen www.vornac.com, zusätzlich curl -sI https://www.vornac.de/de/faq → Location https://www.vornac.com/faq.

**Schritt 5, Nacharbeiten am Tag des Deploys.**

- **Google Search Console:** Property www.vornac.com bleibt, keine Adressänderung. Sitemap neu einreichen, URL-Prüfung mit "Indexierung beantragen" für /, /pentesting, /faq, /glossary und die fünf Branchenseiten. Unter "Internationale Ausrichtung" nichts einstellen.
- **Bing Webmaster Tools:** Property anlegen, falls nicht vorhanden (Import aus der Search Console geht in einem Klick), Sitemap einreichen. ChatGPT sucht über den Bing-Index; ohne Bing-Property dauert die Umstellung dort Wochen länger. IndexNow-Schlüssel hinterlegen und die neuen URLs einmalig melden.
- **Google Ads:** Finale URLs aller deutschen Anzeigen und Sitelinks von /de/… auf /… umstellen (die 308 fängt Klicks ab, aber Tracking und Qualitätsfaktor laufen sauberer ohne Umleitung). Conversion-Aktion "Demo-Anfrage": Zielseite ist jetzt /thank-you (DE) und /en/thank-you (EN).
- **GA4 und GTM:** Trigger und Zielvorhaben mit page_path-Bedingungen auf /de/… prüfen und anpassen; Conversion "thank you" auf beide Pfade.
- **Plausible:** Goals mit Pfadfilter (/de/thank-you) auf /thank-you umstellen.
- **Leadfeeder:** Custom Feeds mit Seitenfiltern auf /de/… anpassen.
- **Externe Links:** LinkedIn, Allianz für Cyber-Sicherheit, Crunchbase, Gartner zeigen auf die Root und liefern damit ab sofort Deutsch. Nichts zu tun. Zeeg-Buchungslink unverändert.
- **Peec:** nichts, die eigene Marke trägt bereits vornac.com und vornac.de.

**Schritt 6, Risiko und Rückweg.** Englische Rankings verlieren ihre alten URLs; die alten Pfade liefern Deutsch, hreflang zeigt Google die englische Fassung. Für den deutschen Zielmarkt ist das der gewollte Effekt, für englische Suchen ein kurzfristiger Verlust. Rückweg: die beiden Commits reverten und deployen; die Redirects verschwinden mit dem Deploy, Vercel hält keine Redirects außerhalb von vercel.json.

### Ablauf B, vornac.de als deutsche Site

1. **Build je Locale:** Umgebungsvariable SITE_LOCALE (de oder en). In .eleventy.js die jeweils andere Locale per eleventyConfig.ignores ausschließen (bei de: alle src/\*.njk außer sitemap und 404; bei en: src/de/\*\*). Permalink-Regel: beide Locales an der Root. In site.js die Domain je Locale (https://www.vornac.de, https://www.vornac.com); Registry und absoluteUrl müssen für hreflang die jeweils andere Domain einsetzen, also de: https://www.vornac.de/pentesting, en: https://www.vornac.com/pentesting.
2. **Vercel:** zweites Projekt "vornac-de" aus demselben Repository mit SITE_LOCALE=de; Domains vornac.de und www.vornac.de dorthin verschieben (apex 308 auf www). Projekt "vornac" bekommt SITE_LOCALE=en. Im .com-Projekt: /de und /de/:path\* 308 auf https://www.vornac.de/:path\*. Im .de-Projekt: /de/:path\* 308 auf /:path\*.
3. **Je Host eigene** Sitemap (mit Alternates auf den anderen Host), robots.txt, llms.txt, JSON-LD mit passender URL-Entität.
4. **Search Console:** neue Domain-Property vornac.de; Bing ebenso; Google Ads DE-Kampagnen auf vornac.de; Leadfeeder-Tracker für die zweite Domain; Plausible-Site für vornac.de.
5. **Verzeichnisse:** alle deutschen Einträge (pentest-anbieter.de, OMR, TeleTrusT, ACS, LinkedIn) auf vornac.de umstellen, sonst zeigen sie weiter auf die englische Site.

Bewertung: sauber möglich, aber teurer als A und mit geteilter Autorität. Sinnvoll erst, wenn eine internationale englische Site mit eigenem Vertrieb dauerhaft unter vornac.com laufen soll.

### Ablauf C, Minimalvariante

1. head-meta.njk und sitemap.njk: x-default auf die deutsche URL.
2. lang-redirect.njk: JavaScript-Umleitung entfernen (siehe Begründung oben).
3. vercel.json: vornac.de und www.vornac.de auf www.vornac.com umleiten (Duplikat beenden). Optional ein 307 nur für die Root bei Accept-Language: de per has: [{ "type": "header", "key": "accept-language", "value": "^de.\*" }]; Bots senden meist Englisch oder gar keinen Header und bleiben auf der englischen Root.
4. robots.txt und llms.txt wie in Plan A.

Bewertung: kostet eine Stunde, beseitigt das Duplikat und schärft die Signale, löst aber nicht, dass die Root-URL englisch bleibt. Nur als Zwischenschritt sinnvoll, wenn A noch nicht entschieden ist.

## 4 · Plan B: Inhalte, die zitiert werden, Woche 2 bis 10

Ziel: Für jede getrackte Frage gibt es eine deutsche Seite, die sie im ersten Absatz beantwortet und die Begriffe trägt, mit denen ChatGPT sucht. Neue Sektion `/wissen`, deutsch zuerst, englische Fassung nachgelagert. Die Research-Notizen bleiben, bekommen aber Datum, Autor und TechArticle-Schema; neue generische Themen erst, wenn B1 bis B14 stehen.

**Zitierregeln für jede Seite**

- Der erste Absatz beantwortet die Frage der Überschrift in 40 bis 60 Wörtern, ohne Einleitung.
- Definitionen in einem Satz. Fachbegriff deutsch, englischer Begriff in Klammern, beide Schreibweisen im Text.
- Rechtsgrundlagen exakt: § 30 Abs. 2 Satz 2 Nr. 6 BSIG, Art. 25 DORA, Anhang A 8.8 ISO/IEC 27001:2022. Keine Paraphrasen.
- Mindestens eine Tabelle (Kriterien, Abgrenzung, Zuordnung) und ein FAQ-Block mit drei bis sechs Fragen, jeweils als FAQPage ausgezeichnet.
- Zahlen mit Quelle. Keine Claims ohne Beleg; "über 95 Prozent Coverage" nur mit Methodikverweis.
- Autor, Stand, Kurzprofil. Die Entität heißt immer "VORNAC GmbH, Heidelberg".
- 900 bis 1.800 Wörter, H2 als Fragen oder Substantive, keine Marketing-Adjektive in Überschriften.
- Wettbewerber werden genannt, wo die Frage es verlangt. Fairness ist Zitierwährung.

| Prio | Seite | Zielprompts (Peec) | Inhalt und Struktur |
| --- | --- | --- | --- |
| P1 W2 | /wissen/nis2-wirksamkeitspruefungNIS2: Wirksamkeit der Sicherheitsmaßnahmen belegen (§ 30 BSIG) | Alle 8 NIS2-Prompts, Enterprise- und KRITIS-Branchenseiten | § 30 Abs. 2 Satz 2 Nr. 5 (Schwachstellenmanagement) und Nr. 6 (Wirksamkeitsbewertung) im Wortlaut; BSI-Lesart "fortlaufender Prozess, kein einmaliges Ereignis"; was GRC-Tools (Vanta, Kertos, Secfix) prüfen und was nicht; Zuordnungstabelle Maßnahme, Nachweis, VORNAC-Report; Fristen und Dokumentation; FAQ. |
| P1 W2 | /preisePreise | Prompts mit Kosten- und Budgetbezug; Preisangaben werden in Antworten übernommen | Single-Target 15.000 € pro Jahr und Zielsystem, beliebig häufige Läufe (Fair Use ein Lauf pro Tag), alle Umgebungen, unbegrenzte Testrollen, Onboarding inklusive, zwölf Monate. CTEM und ABS mit Preislogik (Grundgebühr plus degressive Zielsysteme) auf Anfrage. Vergleich: manueller Jahres-Pentest 15.000 bis 30.000 € pro Scope. Entscheidung 2. |
| P1 W3 | /wissen/automatisierte-penetrationstestsAutomatisierte Penetrationstests: Definition, Abgrenzung, Auswahlkriterien | Topic Automatisierte Penetrationstests, 9 Prompts | Definition; Abgrenzung Schwachstellenscanner, BAS, PTaaS, autonomer Pentest; Kriterientabelle (Exploit-Nachweis, Produktionssicherheit, Datenstandort, Preismodell, Auditformat, Ansprechpartner); Preisrahmen; Link auf die Anbieterübersicht B12. |
| P1 W3 | /assumed-breach-simulationAssumed Breach Simulation: Ablauf, Nutzen, Software | Topic Assumed Breach Simulation Software, 8 Prompts (Pentera 20,8 %) | Produktseite für ABS als eigenes Angebot: Ausgangslage kompromittierter Zugang, Ablauf, Abgrenzung zu Red Teaming und BAS, NIS2- und TISAX-Bezug, Datenstandort, Reportformat, Service-Schema mit Offer. |
| P1 W4 | /vergleich/vornac-vs-penteraVORNAC vs. Pentera | 21 Antworten nennen Pentera; Google-Ads-Keyword bereits belegt | Bestehende Tabelle ausbauen: Datenstandort, Preis, Exploit-Nachweis, Scope-Modell, Ansprechpartner, Betrieb. Sachlich, ohne Herabsetzung, mit Datum. Abschnitt "Pentera-Alternative aus Deutschland" mit den Fragen, die Käufer stellen. Danach dasselbe Format für Cymulate und Picus. |
| P2 W5 | /wissen/tisax-penetrationstestTISAX und Penetrationstests: Was VDA ISA verlangt | 2 TISAX-Prompts (ChatGPT hat vornac.com dafür abgerufen und verworfen) | Assessment-Level, Kontrollfragen zu Schwachstellenmanagement und technischen Prüfungen, Nachweisformat für den Prüfdienstleister, Datenstandort, Turnus. binsec und DSecured werden für genau diese Frage zitiert. |
| P2 W5 | /wissen/dora-testsDORA: Tests der digitalen operationalen Resilienz (Art. 24 bis 27) | DORA-Prompt, Finanz- und Versicherungs-Branchenseiten | Jährliche Testpflicht für IKT-Systeme mit kritischen oder wichtigen Funktionen (Art. 24 Abs. 6), Testarten nach Art. 25 mit Penetrationstests, TLPT nach Art. 26 alle drei Jahre, Rolle der BaFin, was kontinuierliches Pentesting abdeckt und was nicht. |
| P2 W6 | /wissen/iso-27001-penetrationstestISO/IEC 27001:2022 und Penetrationstests (A 8.8, A 8.29) | 3 ISO-Prompts | Kontrollen Anhang A 8.8 (technische Schwachstellen) und A 8.29 (Sicherheitstests), Auditnachweis, Zyklus, Verhältnis zu Überwachungsaudits. ISACA-Leitfaden wird 39-mal zitiert; darauf beziehen. |
| P2 W6 | /wissen/bsi-penetrationstestPenetrationstest nach BSI: Leitfaden, Phasen, Nachweise | 8 BSI-Prompts | BSI-Praxisleitfaden IS-Penetrationstest, Phasenmodell, Abgrenzung zu SOC und MDR (die Engines rutschen dorthin), BSI-Liste zertifizierter Dienstleister, wie VORNAC die Phasen abbildet. |
| P2 W7 | /ctemContinuous Threat Exposure Management: die fünf Phasen | Topic CTEM, 9 Prompts | Produktseite CTEM: Scoping, Discovery, Priorisierung, Validierung, Mobilisierung; Leistungsumfang aus dem Preismodell (Asset-Discovery, Credential-Leak-Monitoring, Risiko-Scoring, Reporting für NIS2, DORA, ISO); Abgrenzung zu EASM. |
| P2 W7 | /wissen/bas-vs-automatisierter-pentestBreach and Attack Simulation, automatisierter Pentest, Schwachstellenscanner: der Unterschied | Prompts mit "Angriffssimulation" und "Schwachstellenanalyse" | Vergleichstabelle, wann welches Verfahren, wie sie sich ergänzen. Den Cymulate-Blog zu genau dieser Frage hat ChatGPT in einer einzigen Antwort dreimal zitiert. |
| P3 W8 | /wissen/anbieter-automatisierte-penetrationstests-deutschlandAnbieter für automatisierte Penetrationstests in Deutschland (2026) | Kernfrage "Welche Anbieter … empfehlenswert", alle Anbieter-Prompts | Faire Übersicht mit 10 bis 12 Anbietern (VORNAC, microCAT, Matproof, indevis mit Pentera, binsec, Trovent, Enginsight, Greenbone, Cymulate, Picus, XM Cyber), Kriterienmatrix, Datenstandort, Preismodell, Stand, jährliche Aktualisierung. Genau dieses Format ziehen die Engines für Empfehlungen heran. |
| P3 W8 | /wissen/pentest-as-a-servicePentest as a Service (PTaaS) in Deutschland | ChatGPT-Suchbegriff in beiden Kernanfragen | Definition, Modelle (manuell wiederkehrend wie binsec, automatisiert wie VORNAC), Preislogik, Auditakzeptanz. |
| P3 W9 | /wissen/kritis-nachweiseKRITIS: Nachweise nach § 39 BSIG | KRITIS-Prompts, Branchenseite | Nachweispflicht für Betreiber kritischer Anlagen (§ 39 BSIG, vormals § 8a Abs. 3), Prüfgrundlage, Orientierungshilfe des BSI, Rolle technischer Tests im Nachweis. |
| P3 W9 | /whitepaper und /case-studyWhitepaper und Case Study | Alle informational Prompts | Deutsches Whitepaper "Kontinuierliche Sicherheitsvalidierung 2026" (Methodik, Coverage über 95 Prozent mit Nachweis, MTTR-Daten) und eine anonymisierte Case Study mit Zahlen. Jeweils PDF mit Metadaten plus HTML-Seite. |
| P3 W10 | /de/glossaryGlossar | Definitionsfragen | DefinedTermSet-Schema, neue Begriffe CTEM, ABS, BAS, PTaaS, AEV (Adversarial Exposure Validation), Exposure Validation; jeder Begriff mit Anker und Ein-Satz-Definition. |

### So klingen die ersten Absätze

Drei Beispiele im Zielformat, jeweils die Antwort vor jeder Einleitung:

**B1, NIS2.** NIS2 verpflichtet besonders wichtige und wichtige Einrichtungen nach § 30 Abs. 2 Satz 2 Nr. 6 BSIG zu Konzepten und Verfahren, mit denen sie die Wirksamkeit ihrer Risikomanagementmaßnahmen bewerten. Das BSI beschreibt diese Bewertung als fortlaufenden Prozess, nicht als einmaliges Ereignis. Ein kontinuierlicher Penetrationstest liefert dafür den technischen Nachweis: Er belegt je Zyklus, welche Maßnahmen einem realen Angriff standhalten und welche nicht.

**B2, Automatisierte Penetrationstests.** Automatisierte Penetrationstests sind Sicherheitsprüfungen, bei denen Software Angriffstechniken selbstständig gegen ein Zielsystem ausführt, Schwachstellen ausnutzt und die Ausnutzbarkeit belegt. Vom Schwachstellenscan unterscheidet sie der Exploit-Nachweis, von Breach and Attack Simulation die Suche nach unbekannten Angriffspfaden statt der Prüfung vorhandener Schutzmaßnahmen. In Deutschland bieten sie unter anderem VORNAC, microCAT, Matproof und indevis an.

**B4, Preise.** VORNAC kostet 15.000 Euro pro Jahr und Zielsystem. Enthalten sind beliebig häufige Testläufe (bis zu einer pro Tag), alle Umgebungen des Zielsystems, authentifiziertes Testen mit beliebig vielen Rollen, das Onboarding und ein BSI-qualifizierter Pentester als Ansprechpartner. Ein manueller Jahres-Pentest kostet in Deutschland typischerweise 15.000 bis 30.000 Euro pro Scope und prüft dabei eine Stichprobe.

## 5 · Plan C: Drittquellen und Verzeichnisse, Woche 1 bis 12

Die Engines empfehlen, was Listen und Verzeichnisse hergeben. Ohne Einträge dort bleibt die beste Website unsichtbar für Empfehlungsfragen. Alle Wege unten sind geprüft; Kontakte und Formulare existieren so.

### C1 · Sofort und kostenlos, Woche 1

| Ziel | Weg | Kosten | Warum |
| --- | --- | --- | --- |
| pentest-anbieter.de (Verzeichnis von AWARE7) | Formular "Firmeneintrag einreichen" auf der Seite, Prüfung durch den Betreiber | 0 € | Von ChatGPT für die Kernfrage abgerufen; listet binsec, 8com, cirosec |
| yekta-it.de Anbieterleitfaden (über 70 Anbieter) | Mail an info@yekta-it.de, die Seite bittet ausdrücklich um Ergänzungen | 0 € | Von ChatGPT abgerufen, alphabetische Liste, binsec enthalten |
| OMR Reviews, Kategorien "Breach and Attack Simulation" und "Penetration Testing" | Formular "Software oder Service vorschlagen" unter omr.com/de/reviews | 0 € Basis | Deutsche Reviewplattform, in 13 Antworten abgerufen; Enginsight und RedMimicry sind gelistet |
| Gartner Peer Insights | Produkt "VORNAC Pentesting" ist bereits gelistet, aber im Sammelmarkt "IT Security" und ohne Bewertung. Im Vendor Portal den Markt "Adversarial Exposure Validation" beantragen (dort stehen Pentera, Cymulate, Picus, Horizon3), Beschreibung mit den Kategoriebegriffen schärfen, dann Bewertungen einholen (C3). | 0 € | Ohne Marktzuordnung erscheint das Profil in keiner AEV-Liste; ohne Bewertungen zitiert es keine Engine |
| G2, Kategorien "Breach and Attack Simulation (BAS)" und "Penetration Testing Tools" | "Add your product" unter g2.com/products/new | 0 € Basis | In 22 Antworten abgerufen; Peec listet g2.com als UGC-Chance |
| Capterra, GetApp, Software Advice | vendors.capterra.com, Prüfung ein bis drei Werktage, Firmen-Mailadresse nötig | 0 € Basis | capterra.com.de wird für Pentest-Software abgerufen; ein Eintrag bedient drei Portale |
| SourceForge, "Best BAS Software in Germany" | "Add a Commercial Product" unter sourceforge.net/software/vendors/new | 0 € | Abgerufen; 51 Produkte, kein deutscher Anbieter |
| Crunchbase | Profil vervollständigen: Gründung, Gründer, Sitz Heidelberg, Beschreibung mit Kategoriebegriffen | 0 € | Entitätsdaten, die alle Engines lesen; aktuell leer |
| LinkedIn-Unternehmensseite | Beschreibung und Spezialgebiete mit den Kategoriebegriffen aus A9, Link auf /wissen | 0 € | linkedin.com in 18 Antworten abgerufen; Peec listet LinkedIn als Chance |
| Wikidata | Eintrag "VORNAC GmbH": Sitz Heidelberg, HRB 757584 Amtsgericht Mannheim, Gründer, Branche, Website, LinkedIn | 0 € | Entitätsauflösung für Google und Perplexity |
| pentest-advisor.de | Kontakt über "Teil von Pentest-Advisor werden" | 0 € | Abgerufen, kleine Reichweite, Inhalte von 2021/22 |

### C2 · Mitgliedschaften und Siegel, Woche 2 bis 6

| Ziel | Weg | Kosten | Warum |
| --- | --- | --- | --- |
| TeleTrusT: Mitgliedsprofil und Zeichenträgerliste "IT Security made in Germany" | VORNAC ist Mitglied (Profilseite unter teletrust.de/ueber-teletrust/mitglieder) und führt das Siegel. Zu prüfen: Profiltext mit den Kategoriebegriffen aus A9 füllen, Eintrag in der öffentlichen Zeichenträgerliste und im TeleTrusT-Anbieterverzeichnis kontrollieren (die Liste zeigte VORNAC bei der Prüfung am 5. September nicht, die Seiten antworteten teils mit 503). | 0 € | Die Liste ist die Referenz für "Made in Germany"-Fragen; rund 250 Zeichenträger, darunter Enginsight, RedMimicry, SCHUTZWERK |
| Allianz für Cyber-Sicherheit (BSI) | Bereits Partner (Beitrag "NIS-2 in der Praxis" vom 23. Juli 2026). Weitere Partnerbeiträge: Wirksamkeitsprüfung nach § 30 BSIG, Pentest-Phasen nach BSI-Leitfaden. | 0 € | bund.de ist mit 38,9 % Abrufquote die dominante Quelle aller Antworten |
| it-sicherheit.de, interaktive Liste Penetrationstests | Mitgliedschaft "Plus" beim Marktplatz IT-Sicherheit (Institut für Internet-Sicherheit) | 1.500 € pro Jahr | Liste von ChatGPT und Perplexity abgerufen; 8com, HiSolutions, G DATA enthalten. Entscheidung 3. |

### C3 · Bewertungen, Woche 2 bis 8

Profile ohne Reviews tauchen in den "Beste BAS-Software"-Seiten nicht auf, die die Engines zitieren. Ziel: mindestens zehn Bewertungen auf G2, OMR Reviews und Gartner Peer Insights aus Pilot- und PoC-Kunden. Ablauf: nach jedem abgeschlossenen Testzyklus eine persönliche Bitte mit Direktlink, Arthur übernimmt die Ansprache, Bewertungen dürfen anonymisiert sein.

### C4 · Redaktion, Woche 3 bis 12

- **Computerwoche-Interview** (liegt zur Freigabe): Begriffe absichern, die die Engines lesen: "automatisiertes Pentesting", "Breach and Attack Simulation", "Wirksamkeitsprüfung nach NIS2", "Made & Hosted in Germany", "VORNAC GmbH, Heidelberg". computerwoche.de wurde in 29 Antworten abgerufen.
- **deepstrike.io**, Liste der 40 führenden Pentest-Anbieter (aktualisiert August 2026): Aufnahme über die Kontaktseite anfragen, mit Verweis auf die Anbieterübersicht B12 als Gegenleistung.
- **Fachbeiträge** in der Reihenfolge der Abrufe: it-daily.net (der Vergleich "manuell oder automatisiert" wird zitiert), security-insider.de, computerweekly.de, manage it (ap-verlag, 12 Abrufe), kes, datenschutz-praxis.de. Themen: NIS2-Wirksamkeitsnachweis, BAS gegen Pentest, Pentest-Kosten pro Zielsystem. Autorenzeile immer mit "VORNAC GmbH, Heidelberg".
- **Internationale Listen** (Aikido "Top automated penetration testing tools", Guideflow BAS, guptadeepak.com CTEM, TechTarget, CSO Online): Pitch mit englischer Produktseite und Datenpunkt "German-hosted". Erfolgsaussicht mittel, Aufwand gering.

### C5 · Strategisch, sechs bis zwölf Monate

BSI-Zertifizierung als IT-Sicherheitsdienstleister im Geltungsbereich IS-Penetrationstests. Die BSI-Listen zertifizierter Dienstleister werden von den Engines als Referenz gezogen; allein die Liste IS-Revision kam auf 14 Zitate. Die Pentest-Liste führt 21 Anbieter, darunter kein einziger automatisierter. Kriterien laut BSI: Zuverlässigkeit, Unabhängigkeit, Fachkompetenz, Qualität; Verfahren, Kosten und Dauer stehen in den BSI-Anforderungsdokumenten. Entscheidung 4.

### C6 · Eigene Kanäle

LinkedIn-Posts (persönlich und Unternehmensseite) mit den Kategoriebegriffen und Links auf die neuen Wissen-Seiten, ein Post je veröffentlichter Seite. YouTube-Demo "Automatisierter Pentest in zwei Stunden: VORNAC live" mit deutscher Beschreibung und Kapitelmarken; youtube.com steht in den Peec-Aktionen mit vier Abrufen.

## 6 · Plan D: Peec-Setup und Messung

**Erledigt am 5. September:** sieben Vorlagenmarken (Adidas, Nike, Puma, Under Armour, Lululemon, Vuori, Gymshark) gelöscht; 13 Wettbewerber angelegt, die in den Antworten vorkommen (Cymulate, Picus Security, XM Cyber, SafeBreach, AttackIQ, Horizon3.ai mit NodeZero, Greenbone mit OpenVAS, microCAT, indevis, Matproof, binsec, Trovent Security, Offensity); fünf unbestätigte Topic-Vorschläge entfernt, darunter zwei Duplikate; Topic "DORA Resilienztests" angelegt und den DORA-Prompt dorthin verschoben; Tag-Gruppe "Regelwerk" mit NIS2, DORA, TISAX, ISO 27001, BSI, KRITIS, Datenschutz und "Kein Regelwerk" angelegt und allen 40 Prompts zugewiesen; eigene Marke um vornac.de und "VORNAC GmbH" ergänzt; Projektprofil mit Produktnamen, Kategoriebegriffen, Personas und Prompt-Builder-Kontext geschärft. Sechs Fragen ergänzt, die vorher nicht getrackt wurden: DORA-TLPT-Anbieter, DORA-Testpflichten, Pentera-Alternativen aus Deutschland, Kosten pro Jahr, Pentest-as-a-Service-Anbieter, Hosting ausschließlich in Deutschland. Das erweitert die Abdeckung, es verändert nicht die Leistung; die Baseline von 40 Prompts bleibt vergleichbar, weil die neuen Prompts als eigene Gruppe auswertbar sind.

- **Noch im Peec-UI zu erledigen:** Engines aktivieren unter Projekteinstellungen, Modelle: Google AI Mode, Gemini, Microsoft Copilot, Claude. Über die Schnittstelle lassen sich Kanäle nicht einschalten. AI Overview liefert derzeit nur 9 Antworten am Tag und trägt statistisch nichts.
- **Prompt-Set ab jetzt stabil lassen.** Weitere Fragen nur, wenn eine echte Käuferfrage fehlt, und dann als Abdeckung dokumentiert.
- **Wöchentlich prüfen:** Domain-Report (Abrufquote vornac.com), URL-Report (welche Seite wird zitiert), Tag-Filter "Regelwerk" je Seite aus Plan B, Actions-Seite unter [app.peec.ai/actions](https://app.peec.ai/actions).

| Messpunkt | Baseline 3. Sept. | Woche 4 | Woche 8 | Woche 12 |
| --- | --- | --- | --- | --- |
| Abrufquote vornac.com | 2,4 % | ≥ 10 % | ≥ 20 % | ≥ 30 % |
| Zitate vornac.com (Summe) | 0 | ≥ 5 | ≥ 30 | ≥ 80 |
| Sichtbarkeit VORNAC gesamt | 0 % | ≥ 1 % | ≥ 5 % | ≥ 10 % |
| Sichtbarkeit in "Automatisierte Penetrationstests" und "Assumed Breach Simulation" | 0 % | ≥ 2 % | ≥ 8 % | ≥ 15 %, Position ≤ 3 |
| Zitierende Drittquellen (Domains) | 0 | 2 | 5 | 8 |

Die Baseline ist eine einzelne Tagesmessung. Bis Woche 4 läuft Peec täglich weiter; ab dann sind Wochenmittel die Vergleichsgröße. Die Zielwerte für Woche 8 entsprechen dem heutigen Niveau von Rapid7, die für Woche 12 dem von Tenable.

## 7 · Zeitplan: Zwölf Wochen

| Woche | Website (A, B) | Drittquellen (C) | Messung (D) |
| --- | --- | --- | --- |
| 1 | Branch feat/de-root mergen (A1, A2, A3, A6), Preview prüfen, Nacharbeiten aus Abschnitt 3; A5, A7, A9 einbauen | C1 komplett: elf Einträge, Crunchbase, LinkedIn, Wikidata | Peec bereinigen, Wettbewerber und Engines ergänzen, Tags setzen |
| 2 | A4 Schema live; B1 NIS2, B4 Preise nach Entscheidung 2 | TeleTrusT-Status klären, ACS-Beitrag einreichen, it-sicherheit.de nach Entscheidung 3 | Erste Kontrolle: werden /de-Seiten abgerufen? |
| 3 bis 4 | B2 Automatisierte Pentests, B3 ABS, B5 Pentera-Vergleich | Computerwoche-Freigabe mit Begriffsliste, deepstrike-Anfrage, Review-Bitten starten | Woche-4-Messpunkt |
| 5 bis 7 | B6 TISAX, B7 DORA, B8 ISO 27001, B9 BSI, B10 CTEM, B11 BAS-Vergleich | Fachbeitrag 1 (it-daily oder security-insider), Vergleiche Cymulate und Picus vorbereiten | URL-Report: welche Seiten ziehen Zitate |
| 8 bis 10 | B12 Anbieterübersicht, B13 PTaaS, B14 KRITIS, B15 Whitepaper und Case Study, B16 Glossar-Schema | Fachbeitrag 2, internationale Pitches, zehn Reviews erreicht | Woche-8-Messpunkt |
| 11 bis 12 | Englische Fassungen der fünf stärksten Seiten, Nachschärfen nach URL-Report | BSI-Zertifizierung: Anforderungen und Aufwand prüfen (Entscheidung 4) | Woche-12-Messpunkt, Plan für Quartal 2 |

## 8 · Entscheidungen: Fünf Punkte, die bei dir liegen

1. **Deutsch als Root-Sprache.** Ablauf A (fertig gebaut), B (vornac.de als deutsche Site) oder C (Minimalvariante), alle drei in Abschnitt 3 mit jedem Schritt. Empfehlung A.
2. **Preis öffentlich.** 15.000 € pro Jahr und Zielsystem auf /preise, inklusive Fair-Use-Regel und Laufzeit. Preise werden von den Engines wörtlich übernommen und sind ein Auswahlkriterium in fast jeder Antwort.
3. **it-sicherheit.de Plus.** 1.500 € pro Jahr für den Eintrag in der interaktiven Liste Penetrationstests, die von ChatGPT und Perplexity abgerufen wird.
4. **BSI-Zertifizierung als IT-Sicherheitsdienstleister, IS-Penetrationstests.** Sechs bis zwölf Monate, Aufwand und Kosten laut BSI-Anforderungsdokumenten zu klären. Die BSI-Listen sind die stärkste Fremdquelle im Segment; die Pentest-Liste enthält bislang keinen automatisierten Anbieter.
5. **Repo-Zugang.** Lesen funktioniert: Der Branch feat/de-root ist aus dem Klon gebaut und geprüft. Ein Push ist aus dieser Session nicht erlaubt, solange ausdre/vornac nicht zu den Session-Quellen gehört. Repo in den Session-Einstellungen hinzufügen, dann pushe ich den Branch, öffne den Pull Request, prüfe das Preview-Deployment und setze anschließend A4 (Schema), A5 (Datum, Autor, lastmod), A7 (Feed) und die Seiten aus Plan B in Reihenfolge um. Alternativ die beiden Patches aus dem Chat lokal einspielen.

## 9 · Anhang: Einbaufertige Dateien

Die Dateien liegen im Repository:

- `robots.txt` und `llms.txt` im Repo-Root (Passthrough nach `dist/`, seit Branch `feat/de-root`)
- `docs/superpowers/specs/ki-sichtbarkeit-schema/schema-organization.jsonld`: Organization, WebSite und Service mit Offer (für den `extraHead`-Block von `src/de/index.njk` und `src/index.njk`; Gründungsdatum noch eintragen)
- `docs/superpowers/specs/ki-sichtbarkeit-schema/schema-wissen-techarticle.jsonld`: TechArticle plus FAQPage als Vorlage für jede Wissen-Seite
- `docs/superpowers/specs/ki-sichtbarkeit-schema/schema-glossar-definedtermset.jsonld`: DefinedTermSet für das Glossar (Anker `li id="term-…"` existieren bereits)

Quellen: Peec-AI-Projekt VORNAC (Brand-, Domain-, URL-Report, Chats und Actions vom 3. September 2026); Crawl von www.vornac.com am 5. September 2026; Prüfung der Drittseiten am 5. September 2026; Repository ausdre/vornac (Stand Commit abfd8a4) und Vercel-Projekt vornac; Gartner-Peer-Insights-Profil "VORNAC Pentesting"; § 30 und § 39 BSIG (2025); BSI NIS-2-Infopaket "Bewertung der Wirksamkeit von Maßnahmen".

# Alternative-Seiten: Landingpages für die Wettbewerber-Keywords

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. Reply in the language the user writes in; the site copy is German first. Eine Seite je Task, Reihenfolge wie unten, Checkboxen hier pflegen.

**Ziel:** Sechs deutsche Vergleichsseiten unter `/vergleich/`, die als Landingpage hinter den laufenden Google-Ads auf Wettbewerber-Keywords stehen und zugleich die Zitatquelle für Prompts wie "Pentera-Alternative aus Deutschland" sind. Wettbewerber: Pentera (Seite besteht, wird auf das neue Format gehoben), Horizon3.ai (NodeZero), XBOW, Cymulate, Picus Security, Fleuret AI.

**Herkunft:** Briefing von André am 2026-10-06. Fleuret AI hat zwischen April und Oktober 2026 zehn Vergleichsartikel veröffentlicht (XBOW, Pentera, Aikido, Escape, Patrowl, Sxipher, SYLink, FireCompass, Horizon3, Hadrian) und ist damit die Vorlage für das Format, nicht für den Umfang: Fleuret schreibt 15.000 Wörter je Artikel, wir bleiben bei 900 bis 1.400.

**Spec-Bezug:** `docs/superpowers/specs/2026-09-05-ki-sichtbarkeit-design.md`, Plan B, Zeile "VORNAC vs. Pentera" ("Danach dasselbe Format für Cymulate und Picus"). Dieser Plan löst diese Zeile ab und erweitert sie um Horizon3, XBOW und Fleuret. Zitierregeln aus `CLAUDE.md` gelten unverändert.

---

## Entscheidungen, die vor Task 1 fallen müssen

Entschieden von André am 2026-10-06: Nr. 1 bis 4 jeweils der Vorschlag (URL-Schema `<name>-alternative` mit Umzug der Pentera-Seite, kein öffentlicher Preis, Hub `/vergleich`, Reihenfolge Pentera, Horizon3, Cymulate, Picus, XBOW, Fleuret). Nr. 5 bleibt beim Vorschlag, solange nichts anderes gesagt wird.

| Nr. | Frage | Vorschlag | Alternative |
| --- | --- | --- | --- |
| 1 | URL-Schema | `/vergleich/<wettbewerber>-alternative` (z. B. `/vergleich/pentera-alternative`). Das Keyword steht im Pfad und im Anzeigen-Pfad, die bestehende Pentera-Seite zieht per 308 in `vercel.json` um. Registry-Schlüssel `vergleich-<wettbewerber>-alternative`. | Bestehendes Schema `vornac-vs-<wettbewerber>` behalten; dann bleibt die Pentera-URL, die restlichen fünf folgen dem Muster. |
| 2 | Preis auf den Seiten | Entscheidung vom 2026-09-09 ("kein öffentlicher Preis") gilt weiter: Zeile "Preislogik" nennt bei VORNAC das Modell (Jahreslizenz je Zielsystem, beliebig häufige Läufe, Onboarding inklusive, Angebot nach Erstgespräch), bei Wettbewerbern nur öffentlich belegte Zahlen mit Quelle und Datum. | Preisanker für die Ads-Landingpage (15.000 € je Zielsystem und Jahr) nur auf den sechs Vergleichsseiten nennen. Dann Offer-Knoten mit `price` im JSON-LD dieser Seiten und ein Hinweis in `CLAUDE.md`. |
| 3 | Reihenfolge | Nach Ads-Impressionen der letzten 30 Tage. Bis die Zahlen vorliegen: Pentera, Horizon3, Cymulate, Picus, XBOW, Fleuret (Reihenfolge der Nennungen in Peec-Antworten). | André nennt die Reihenfolge aus dem Ads-Konto. |
| 4 | Hub-Seite `/vergleich` | Ja, eine kurze Indexseite (CollectionPage mit ItemList, Muster `src/de/wissen.njk`), damit sieben Vergleiche nicht nur als Tag auf `/wissen` liegen und die Brotkrumen `Startseite › Vergleiche › Pentera-Alternative` lauten. | Kein Hub, Vergleiche bleiben mit Tag "Vergleich" auf `/wissen`, Brotkrumen über Wissen wie heute. |
| 5 | Finale URLs in Google Ads | André trägt die finalen URLs und Sitelinks selbst ein, sobald eine Seite in Production ist; dieser Plan liefert je Seite die URL und einen Vorschlag für zwei Anzeigentexte (ohne fremde Marke im Anzeigentext, siehe Rechtsrahmen). | Liste aller sechs URLs am Ende gesammelt übergeben. |

## Rechtsrahmen, der jede Seite einhält

Vergleichende Werbung ist nach § 6 Abs. 2 UWG zulässig, wenn sie die sechs Bedingungen erfüllt. Die Redaktion prüft jede Seite dagegen:

1. **Nr. 1, gleicher Bedarf:** Verglichen werden nur Leistungen für denselben Zweck (Sicherheitsvalidierung mit Nachweis). Bei BAS-Anbietern (Cymulate, Picus) steht der Unterschied im Verfahren im ersten Absatz, damit der Vergleich nicht Gleiches vortäuscht.
2. **Nr. 2, objektiv, wesentlich, nachprüfbar:** Jede Zelle zu einem Wettbewerber trägt eine Quelle in eckigen Klammern mit Abrufdatum. Fehlt eine öffentliche Angabe, steht "keine öffentliche Angabe (Stand TT.MM.JJJJ)", nie "nicht vorhanden".
3. **Nr. 3, keine Verwechslung:** Wettbewerber-Logos werden nicht verwendet, der Name nur als Text. Fußnote "X ist eine Marke des jeweiligen Inhabers. VORNAC steht in keiner Geschäftsbeziehung zu X." bleibt wie auf der Pentera-Seite.
4. **Nr. 4, keine Rufausnutzung:** Keine Formulierung "wie Pentera, nur günstiger". Die Seite erklärt, was der Wettbewerber tut, und was VORNAC anders tut.
5. **Nr. 5, keine Herabsetzung:** Keine Wertungen, keine Marketing-Adjektive, keine Superlative. "US-Hosting" ist eine Tatsache, "unsicher" wäre eine Wertung. Der CLOUD-Act-Bezug wird als Rechtslage beschrieben (Zugriff von US-Behörden auf Daten von US-Unternehmen unabhängig vom Speicherort, 18 U.S.C. § 2713), nicht als Vorwurf.
6. **Nr. 6, keine Imitation:** Entfällt, da keine Nachahmung behauptet wird.

Zusätzlich: Google-Ads-Markenrichtlinie erlaubt in der EU das Bieten auf fremde Marken, die Marke im Anzeigentext hingegen nur mit Freigabe des Inhabers. Anzeigentexte nennen also "Alternative aus Deutschland" und das Produktversprechen, nicht die fremde Marke; die Landingpage darf sie nennen. Korrekturangebot an den Wettbewerber (hello@vornac.com) bleibt auf jeder Seite, das ist die beste Verteidigung gegen "unrichtig".

## Seitenaufbau (gilt für alle sechs)

Front-Matter wie `src/de/vergleich/vornac-vs-pentera.njk`: `title`, `headline`, `breadcrumb`, `description`, `i18nKey`, `ogType: article`, `author: andre`, `about`, `citations`, `faq`. Layout `layouts/base.njk`, Styles `wissen.css`, JSON-LD aus `partials/wissen-schema.njk` (TechArticle, FAQPage, BreadcrumbList). Keine neuen CSS-Klassen, es sei denn, der CTA-Block oben braucht eine (siehe Task 0).

1. **H1:** "<Wettbewerber>-Alternative aus Deutschland: VORNAC im Vergleich". Title-Tag "<Wettbewerber> Alternative aus Deutschland: Vergleich mit VORNAC | VORNAC".
2. **Stand-Zeile** (`page-meta-line.njk`), dann **Lead** (40 bis 60 Wörter): beantwortet "Was ist die Alternative und worin liegt der Unterschied" in drei Sätzen, nennt Sitz beider Anbieter und das Verfahren.
3. **CTA-Block oben** (neu, Task 0): ein Satz plus Button "Erstgespräch vereinbaren", für den Ads-Besucher, der nicht liest.
4. **H2 "Wofür <Wettbewerber> steht":** ein Absatz, neutral, aus den eigenen Seiten des Anbieters, mit Quellen. Dann ein Absatz zur VORNAC GmbH, Heidelberg (Muster Pentera-Seite).
5. **H2 "Angriffsfläche im Vergleich":** Tabelle 1, Zeilen sind Angriffsflächen, Spalten Wettbewerber und VORNAC. Zeilen: Web-Anwendungen, APIs, Mobile Apps, interne Netze und Active Directory, Cloud-Workloads, externe Angriffsfläche (EASM), Binaries, Identity und Access, OT. Zellwerte: "ja [Quelle]", "nein, laut Anbieter nicht im Umfang [Quelle]", "keine öffentliche Angabe".
6. **H2 "Rechtsträger, Hosting, Nachweis, Preis":** Tabelle 2 mit den Zeilen Rechtsträger und Register (VORNAC: VORNAC GmbH, HRB 757584 Amtsgericht Mannheim), Hauptsitz, Niederlassung in Deutschland (Handelsregister), Hosting-Land und Cloud-Betreiber, Auftragsverarbeiter außerhalb der EU, Jurisdiktion der Muttergesellschaft, Nachweisformat (Report je Befund: Proof-of-Concept, Business-Impact, Maßnahmenplan, Wiederholungstest; Export; Zuordnung zu NIS2, DORA, ISO/IEC 27001, TISAX), Zeit bis zum Report, Preislogik, Nachweise des Anbieters (Zertifikate, Mitgliedschaften; bei VORNAC nirgends "zertifiziert" schreiben, BSI-Zertifizierung ist nicht erteilt).
7. **H2 "Wann <Wettbewerber> passt" und H2 "Wann VORNAC passt":** je ein Absatz, ehrlich, mit Link auf `pageUrls.pentesting` und die passende Wissen-Seite.
8. **H2 "<Wettbewerber>-Alternative: Fragen, die Käufer stellen":** fünf FAQ-Einträge aus `faq` (sichtbar als `<details>`, gleichzeitig `FAQPage`). Pflichtfragen: "Ist VORNAC eine <Wettbewerber>-Alternative?", "Wo liegen die Daten?", "Erkennen Auditoren den Report an?", "Kann ich beides parallel betreiben?", eine wettbewerberspezifische Frage.
9. **Quellen** (nummeriert, mit Abrufdatum) und Markenhinweis, dann **CTA unten** (`ws-cta`).

Jede Seite zusätzlich: Eintrag in `src/_data/pages.js` (`en: null`), in `src/_data/wissen.js` (Tag "Vergleich", speist `/wissen` und `/feed.xml`), in `src/sitemap.njk` (`priorities`, 0.8), in `llms.txt` (Abschnitt Wissen), Link aus der Anbietertabelle auf `/wissen/automatisierte-penetrationstests` (Zeile des Wettbewerbers, Muster Pentera) und aus `/wissen/nis2-anbieter`, wo der Wettbewerber genannt ist; vollständige Liste der Verlinkungen in Task 7. Nach dem Commit `npm run dates`, JSON mitcommitten.

## Recherche je Wettbewerber (Steckbrief vor dem Schreiben)

Ein Steckbrief je Anbieter als Abschnitt in dieser Datei, bevor die Seite entsteht: Felder wie Tabelle 2 plus Quelle und Abrufdatum je Feld. Quellen in dieser Reihenfolge: Produktseite und Datenblatt des Anbieters, Trust Center oder Sicherheitsseite, Dokumentation (Netzwerkanforderungen, Regionen), Preisseite, Handelsregister (handelsregister.de oder northdata.de) für die deutsche Niederlassung, Wikipedia oder Crunchbase für Gründung und Sitz, Anbieterverzeichnisse (G2, Capterra, AWS Marketplace) nur für Betriebsmodell und Bewertungszahl. Fremde Vergleichsartikel (Fleuret, Escape, Picus über Cymulate) sind keine Quelle für Tatsachen über den Wettbewerber, nur Hinweis, wo nachzusehen ist.

Vorab-Befund vom 2026-10-06 (noch gegen Primärquellen zu prüfen):

| Anbieter | Rechtsträger und Sitz | Hosting | Angriffsfläche | Preislogik |
| --- | --- | --- | --- | --- |
| Horizon3.ai | Horizon3.ai, Inc., San Francisco; Pressemitteilung nennt eine EU-Bereitstellung in Deutschland auf AWS (Cyber Essentials Plus, Zertifikat vom 2026-09-22, Scope "NodeZero AWS EU network"), API-Endpunkt api.horizon3ai.eu; deutsche Gesellschaft prüfen | SaaS, EU-Region in Deutschland, Muttergesellschaft USA | Interne und externe Netze, AD, Cloud, Angriffspfade | Keine öffentliche Preisliste gefunden; prüfen |
| XBOW | XBOW, Seattle, gegründet 2024 (Oege de Moor) | Laut Drittquellen US-Hosting als Standard, EU (Frankfurt) als Private Preview für Enterprise; gegen xbow.com prüfen | Web-Anwendungen von außen | Listenpreise (4.000 und 8.000 USD je Test) Mitte 2026 entfernt, jetzt "usage-based" auf Anfrage; gegen Preisseite prüfen |
| Cymulate | Cymulate Ltd., Tel Aviv, gegründet 2016; deutsche Gesellschaft prüfen | SaaS; Datenstandort laut Trust Center prüfen (Picus behauptet "keine Data Residency", das ist Wettbewerberaussage, nicht übernehmen) | BAS und Exposure Validation entlang MITRE ATT&CK, kein Exploit-Nachweis je Zielsystem | Lizenz nach Angriffsvektoren, kein öffentlicher Preis |
| Picus Security | Picus Security, Inc., San Francisco, Herkunft Ankara, gegründet 2013; deutsche Gesellschaft prüfen | SaaS und On-Premises | BAS, Kontrollvalidierung | Modulbasiert, kein öffentlicher Preis |
| Fleuret AI | FLEURET AI SAS, 60 Rue François 1er, 75008 Paris, SIREN 999 515 604; 4 Mio. € Pre-Seed im Oktober 2026 | Scaleway, Paris; Vercel fra1 für die Oberfläche | Web-Anwendungen, REST- und GraphQL-APIs, externe Infrastruktur; laut FAQ nicht: Active Directory, Mobile, Cloud | 4.000 € je Web-Anwendung und Test, Plattform 200 € je Monat, Enterprise auf Anfrage |
| Pentera | Siehe bestehende Seite, Stand 2026-09-09; Quellen neu abrufen und Datum setzen | | | |

---

## Task 0: Gerüst für alle sechs Seiten (erledigt 2026-10-09)

**Files:** `wissen.css`, `src/_includes/partials/wissen-schema.njk`, `src/_data/pages.js`, `src/_data/wissen.js`, `src/sitemap.njk`, `vercel.json`, optional `src/de/vergleich.njk` (Hub, Entscheidung 4).

- [x] Navigation, Footer, Teaser-Filter und Hub aus Task 7 (Punkte 1 bis 4) gehören in diesen Task, damit die erste Seite verlinkt live geht.
- [x] CTA-Block oben als Partial `src/_includes/partials/vergleich-cta.njk` (Satz plus Button auf `site.contact.bookDemo`), Klasse in `wissen.css`, zentriert wie `ws-cta`, kein Rahmen, kein grauer Hintergrund.
- [x] Brotkrumen: wenn Entscheidung 4 "Hub", dann in `wissen-schema.njk` Ebene 2 für `vergleich-*`-Seiten auf `/vergleich` statt `/wissen` zeigen (Variable `t.nav.vergleich` in `i18n.js`), sichtbare Brotkrumenleiste und JSON-LD müssen übereinstimmen. Hub-Seite `src/de/vergleich.njk` mit CollectionPage nach dem Muster `src/de/wissen.njk`, Liste aus `wissen.js` gefiltert auf Tag "Vergleich".
- [x] Pentera-Seite auf die neue URL ziehen (Entscheidung 1): Datei umbenennen, `i18nKey` und Registry-Schlüssel ändern, Redirect `/vergleich/vornac-vs-pentera` → `/vergleich/pentera-alternative` in `vercel.json`, Links in `src/de/wissen/automatisierte-penetrationstests.njk`, `src/de/wissen/nis2-anbieter.njk`, `llms.txt`, `sitemap.njk` (`priorities`), `wissen.js`, `pageDates.json` (Schlüssel wandert mit, `npm run dates` prüft).
- [x] Build-Prüfung: `npm run build`, dann `grep -rho 'href="/de[^"]*"' dist | wc -l` → 0, `grep -c '<loc>' dist/sitemap.xml` steigt um die Zahl der neuen Seiten, kein doppeltes `@id` in den JSON-LD-Blöcken (`grep -o '"@id":"[^"]*"' dist/vergleich/*.html | sort | uniq -d`).

## Task 1: Pentera (Umbau der bestehenden Seite) (erledigt 2026-10-09)

**Files:** `src/de/vergleich/pentera-alternative.njk` (vormals `vornac-vs-pentera.njk`).

- [x] Steckbrief aktualisieren: alle fünf Quellen neu abrufen, Abrufdatum auf den Tag der Bearbeitung setzen, Gartner-Bewertungszahl neu lesen, deutsche Gesellschaft (Pentera Security GmbH oder Vertrieb über Partner) im Handelsregister prüfen.
- [x] Tabelle 1 (Angriffsfläche) neu aufbauen; die bisherigen Zeilen "Testumfang" und "Scope-Modell" gehen darin auf. Tabelle 2 aus den restlichen bestehenden Zeilen plus Rechtsträger, Niederlassung, Jurisdiktion.
- [x] H1 und Title auf das neue Schema, Lead neu (40 bis 60 Wörter), Abschnitte "Wann Pentera passt" und "Wann VORNAC passt" übernehmen, FAQ um die Frage "Pentera hat eine deutsche Niederlassung, wo liegen die Daten?" ergänzen.
- [x] Commit, `npm run dates`, JSON committen. Anzeigentext-Vorschlag (zwei Varianten) in den PR-Text.

## Task 2: Horizon3.ai (NodeZero) (erledigt 2026-10-09)

**Files:** `src/de/vergleich/horizon3-alternative.njk`.

- [x] Steckbrief: horizon3.ai (Produkt, Trust Center, Pressemitteilung Cyber Essentials vom 2026-09-22, docs.horizon3.ai Netzwerkanforderungen und EU-Endpunkt), Handelsregister für eine deutsche oder europäische Gesellschaft, Preisseite.
- [x] Besonderheit im Text: Horizon3 ist der engste Nachbar im Verfahren (autonomer Pentest mit Angriffspfaden und Nachweis). Unterschied sachlich: Scope-Modell (Netzwerkweit gegen Zielsystem), Rechtsträger USA mit EU-Bereitstellung in Deutschland gegen deutsche GmbH mit deutschem Betreiber, fester Pentester als Ansprechpartner. Die EU-Bereitstellung korrekt wiedergeben, nicht verschweigen.
- [x] FAQ-Zusatzfrage: "NodeZero läuft in einer EU-Region. Reicht das für NIS2 und DORA?" Antwort mit § 30 BSIG (Lieferkette) und Art. 28 DORA (IKT-Drittdienstleister), ohne Rechtsberatung.
- [x] Eintragungen, Commit, `npm run dates`.

## Task 3: Cymulate (erledigt 2026-10-09)

**Files:** `src/de/vergleich/cymulate-alternative.njk`.

- [x] Steckbrief: cymulate.com (Plattform, Trust Center, Datenstandort, Module), Handelsregister (Cymulate GmbH?), G2/Capterra nur für Betriebsmodell.
- [x] Besonderheit: BAS gegen automatisierten Pentest. Erster Absatz erklärt den Unterschied (Validierung von Schutzmaßnahmen entlang ATT&CK gegen Nachweis der Ausnutzbarkeit je Zielsystem), damit Nr. 1 UWG erfüllt ist. Link auf `/wissen/assumed-breach-simulation` (Abgrenzung ABS, BAS) und, sobald vorhanden, `/wissen/bas-vs-automatisierter-pentest`.
- [x] FAQ-Zusatzfrage: "Ersetzt BAS den Penetrationstest für ISO/IEC 27001 A 8.29?"
- [x] Eintragungen, Commit, `npm run dates`.

## Task 4: Picus Security (erledigt 2026-10-09)

**Files:** `src/de/vergleich/picus-alternative.njk`.

- [x] Steckbrief: picussecurity.com (Plattform, On-Premises-Option, Datenstandort), Handelsregister, Wikipedia (Gründung, Sitz).
- [x] Besonderheit wie Cymulate (BAS); On-Premises-Option als Tatsache nennen, das ist ein Punkt für Picus. Texte nicht aus der Cymulate-Seite kopieren: andere Zusatzfrage ("Picus bietet On-Premises an. Was unterscheidet das vom deutschen Betrieb bei VORNAC?").
- [x] Eintragungen, Commit, `npm run dates`.

## Task 5: XBOW (erledigt 2026-10-09)

**Files:** `src/de/vergleich/xbow-alternative.njk`.

- [x] Steckbrief: xbow.com (Produkt, Preisseite, Sicherheits- oder Trust-Seite, Datenregionen), Pressemeldungen zur Finanzierung für Sitz und Gründung.
- [x] Besonderheit: XBOW prüft Web-Anwendungen von außen, VORNAC je Zielsystem mit Testrollen und in allen Umgebungen. Tabelle 1 zeigt den Unterschied ohne Wertung. Preislogik: frühere Listenpreise nur mit datierter Quelle (Archiv-Link), sonst "auf Anfrage (Stand)".
- [x] FAQ-Zusatzfrage: "XBOW testet Web-Anwendungen. Was ist mit APIs, internen Netzen und Binaries?"
- [x] Eintragungen, Commit, `npm run dates`.

## Task 6: Fleuret AI (erledigt 2026-10-09)

**Files:** `src/de/vergleich/fleuret-alternative.njk`.

- [x] Steckbrief: fleuret.ai (FAQ, Preisseite, Impressum oder Mentions légales für SAS und SIREN), eu-startups.com für die Finanzierung vom Oktober 2026.
- [x] Besonderheit: EU-Anbieter mit französischem Hosting (Scaleway). Der Unterschied liegt nicht in "EU gegen USA", sondern in Angriffsfläche (Fleuret ohne AD, Mobile, Cloud laut eigener FAQ), Jurisdiktion und Sprache des Reports (Deutsch gegen Englisch, prüfen), Ansprechpartner. Preislogik je Test gegen Jahreslizenz je Zielsystem.
- [x] FAQ-Zusatzfrage: "Fleuret hostet in Frankreich. Gilt das für deutsche Aufsichten als gleichwertig?" Antwort: DSGVO ja, Prüfkriterium ist der Auftragsverarbeiter und die Vertragskette, ohne Rechtsberatung.
- [x] Eintragungen, Commit, `npm run dates`.

## Task 7: Verlinkung (Navigation, Footer, Teaser, Querverweise) (erledigt 2026-10-09)

Eine Seite, die nur in Sitemap und llms.txt steht, wird weder von Googlebot gewichtet noch von den Engines gefunden. Jede der sechs Seiten muss über mindestens drei interne Wege erreichbar sein: Navigation, Hub und Fließtext. Die Punkte 1 bis 4 gehören zu Task 0, damit sie mit der ersten Seite live gehen; der Rest je Seite.

**Files:** `src/_includes/partials/site-header.njk`, `site-footer.njk`, `wissen-teaser.njk`, `src/_data/i18n.js`, `src/de/index.njk`, `src/de/pentesting.njk`, `src/de/faq.njk`, `src/de/wissen.njk`, die vier Wissen-Seiten mit Anbieternennung, neues Partial `vergleich-related.njk`.

- [x] **Header:** Research-Dropdown, Spalte `v-dv-drop-aside`, neuer Eintrag "Vergleiche" zwischen Wissen und Glossar, nur wenn `pageUrls.vergleich` existiert (Muster Wissen). `t.nav.vergleich` in `i18n.js` (de "Vergleiche", en "Comparisons"). `is-active` für `vergleich` und `vergleich-*` wandert vom Wissen-Link auf den neuen Eintrag.
- [x] **Footer:** Eintrag "Vergleiche" hinter Wissen in der Seitenliste, gleiche Bedingung.
- [x] **Wissen-Teaser auf den Produktseiten** (`wissen-teaser.njk`, eingebunden auf Startseite, Pentesting, OT-Pentesting, CTEM): zeigt die drei neuesten Einträge aus `wissen.js`. Sechs neue Vergleiche würden die Erklärseiten dort verdrängen. Teaser filtert auf Tag ungleich "Vergleich"; die Vergleiche bekommen auf `/pentesting` und der Startseite stattdessen einen eigenen Satz mit Link auf den Hub (siehe nächste Punkte).
- [x] **Hub `/vergleich`:** listet alle Seiten mit Tag "Vergleich" aus `wissen.js`, mit Stand je Seite aus `dates.byKey`. `/wissen` listet sie weiterhin mit (eine Quelle, zwei Ansichten).
- [x] **Startseite:** Abschnitt "Deshalb wählen Kunden VORNAC statt Pentera und Scannern" (`src/de/index.njk`, Zeile 324) bekommt unter der Tabelle einen Satz mit Link auf die Pentera-Seite und den Hub ("Ausführliche Vergleiche mit Pentera, Horizon3, Cymulate, Picus, XBOW und Fleuret").
- [x] **`/pentesting`:** ein Absatz im Abschnitt Methodik oder vor dem Teaser: "Wie sich VORNAC von Pentera, Horizon3 und BAS-Plattformen unterscheidet, steht auf den Vergleichsseiten" mit Link auf den Hub.
- [x] **FAQ:** neue Frage "Worin unterscheidet sich VORNAC von Pentera, Horizon3 oder Cymulate?" in `src/de/faq.njk` (sichtbar und im FAQPage-JSON), Antwort in drei Sätzen mit Link auf den Hub.
- [x] **Querverweise je Seite** (Partial `vergleich-related.njk`, vor den Quellen): "Weitere Vergleiche" mit den anderen fünf Seiten aus `wissen.js` (Tag "Vergleich", eigene Seite ausgeschlossen), dazu die zwei passenden Wissen-Seiten als feste Links im Fließtext (Pentera und Horizon3: `wissen-automatisierte-penetrationstests`; Cymulate und Picus: `wissen-assumed-breach-simulation`; XBOW und Fleuret: `wissen-nis2-wirksamkeitspruefung` und `wissen-dora-resilienztests`).
- [x] **Wissen-Seiten mit Anbieternennung:** in `automatisierte-penetrationstests.njk` (Anbietertabelle Zeilen 139 bis 141: Pentera verlinkt schon, Horizon3, Cymulate, Picus ergänzen, XBOW und Fleuret als neue Zeilen), `nis2-anbieter.njk`, `assumed-breach-simulation.njk`, `ctem-in-der-praxis.njk` und `dora-resilienztests.njk` jede Nennung eines der sechs Anbieter einmal je Seite auf die Vergleichsseite verlinken.
- [x] **Brotkrumen:** `BreadcrumbList` im JSON-LD (wie auf den Wissen-Seiten ohne sichtbare Leiste) auf `Startseite › Vergleiche › <Seite>` (Task 0), Hub mit `Startseite › Vergleiche`.
- [x] **`llms.txt`:** Hub und alle sechs Seiten im Abschnitt Wissen; Sitemap-Priorität 0.8 je Seite, Hub 0.8.
- [x] **Prüfung nach dem Build:** `grep -o 'href="/vergleich/[^"]*"' dist/**/*.html | sort | uniq -c` zeigt je Vergleichsseite mindestens drei verweisende Seiten außerhalb von `/vergleich/`; kein Link auf die alte Pentera-URL (`grep -r 'vornac-vs-pentera' dist | wc -l` → 0).

## Task 8: Ads, Search Console, Messung (offen, nach dem Merge)

- [ ] Google Ads (André, Entscheidung 5): finale URLs je Anzeigengruppe, Sitelinks auf Hub und `pageUrls.pentesting`, Anzeigentexte ohne fremde Marke. Conversion-Ziel bleibt `/thank-you`; der Button "Erstgespräch vereinbaren" führt auf zeeg.me, dort gibt es derzeit kein Conversion-Tracking (siehe Tracking-Stack-Notiz), das ist ein offener Punkt aus Step 7 des KI-Sichtbarkeit-Plans.
- [ ] Search Console: URL-Prüfung je Seite nach dem Deploy, Rich-Results-Test für FAQPage und TechArticle.
- [ ] Peec: Prompt "Pentera-Alternativen aus Deutschland" ist im Set; `get_url_report` nach vier Wochen zeigt, ob die Seiten zitiert werden. Prompt-Set nicht verändern.
- [ ] Nach 30 Tagen: Ads-CTR und Conversion-Rate je Seite neben der alten Landingpage notieren, Ergebnis an diese Datei anhängen.

## Pflege

Die Angaben zu Wettbewerbern veralten. Jedes Quartal: Quellen neu abrufen, Abrufdatum setzen, `npm run dates`. Hinweise von Wettbewerbern unter hello@vornac.com werden innerhalb einer Woche eingearbeitet, auch das steht auf jeder Seite.

## Stand 2026-10-09

Ergänzung (Entscheidung André, 2026-10-09): Jede Seite sagt, dass VORNAC günstiger ist als der jeweilige Wettbewerber, mit dem Angebot nach dem Erstgespräch als Beleg (Preislogik-Zelle, FAQ, Abschnitt "Wann VORNAC passt"); ein Betrag bleibt unveröffentlicht. VORNAC-Reports sind auf Deutsch, das steht in der Nachweisformat-Zelle jeder Seite.

Alle sechs Seiten, der Hub `/vergleich`, Navigation, Footer, Teaser-Filter und Querverweise sind im PR ausdre/vornac#85 umgesetzt (Build 160 Dateien, Sitemap 155 URLs, jede Seite von mindestens drei Seiten außerhalb von `/vergleich/` verlinkt, Pentera-Seite von mindestens sieben). Quellen je Seite mit Abrufdatum 9. Oktober 2026. Offen: Task 8 (finale URLs in Google Ads, Search Console, Peec-Messung nach vier Wochen) und die Quartalspflege.

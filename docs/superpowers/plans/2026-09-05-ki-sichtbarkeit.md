# KI-Sichtbarkeit: Umsetzungsplan und Übergabe

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Reply in the language the user writes in; the site copy is German first.

**Ziel:** VORNAC wird in den Antworten von ChatGPT, Perplexity und Google AI Overview zu deutschen Kaufprompts genannt und zitiert. Baseline vom 3. September 2026: 0 von 247 Antworten, vornac.com in 6 Antworten abgerufen, 0 Zitate.

**Spec:** `docs/superpowers/specs/2026-09-05-ki-sichtbarkeit-design.md` (Befund, Plan A bis D, Sprache und Domain, Zeitplan, Entscheidungen). Die Cowork-Fassung als Seite: https://claude.ai/code/artifact/4601621c-1094-4d91-9717-fcf2fbf8feb6

**Herkunft:** Übergabe aus der Cowork-Session vom 5. September 2026 (session_01FqvPPH349z5992TcyqKzWY). Die Session hatte Lesezugriff auf das Repo, aber keinen Push; deshalb liegt der Stand als Branch `feat/de-root` (drei Commits auf `abfd8a4`) und als Patches vor.

---

## Stand bei Übergabe

Erledigt:

- Peec-Projekt bereinigt und aufgesetzt (Marken, Topics, Tags, Profil, sechs Abdeckungs-Prompts). Details in der Spec, Abschnitt 6.
- Branch `feat/de-root` gebaut und geprüft: Deutsch als Root-Locale, Englisch unter `/en`, vornac.de leitet auf www.vornac.com, `/de/*` leitet auf `/*`, robots.txt, llms.txt, Trailing-Slash-Transform. Build: 142 HTML-Seiten, 139 Sitemap-URLs, keine Links auf `/de`, keine internen Links mit Slash.
- Drei JSON-LD-Vorlagen unter `docs/superpowers/specs/ki-sichtbarkeit-schema/`.

Offen (Entscheidungen von André, Spec Abschnitt 8): Ablauf A/B/C für Sprache und Domain (Empfehlung A, gebaut), Preis öffentlich, it-sicherheit.de Plus, BSI-Zertifizierung.

Kennungen, die die Werkzeuge brauchen:

| Was | Wert |
| --- | --- |
| Peec-Projekt | `or_7320275e-d967-4613-8f12-03b434a5e86b` (Name VORNAC, Land DE, Sprache de) |
| Peec eigene Marke | `kw_aa18f134-32c7-4bf5-9bd8-be274599ee28` (Domains vornac.com, vornac.de) |
| Peec Topics | Automatisierte Penetrationstests `to_de718bec-1035-4e30-86e3-9209548d2ec5`, Assumed Breach Simulation Software `to_96726cc2-17ce-4bbc-a819-b4f92db0ec8d`, NIS2 Compliance Lösungen `to_85bcd5e5-b549-45cd-915c-28cb9838a843`, IT-Sicherheitsüberprüfung nach BSI-Standard `to_2bced552-5c54-4dde-bf9e-399f44243619`, Continuous Threat Exposure Management `to_972f90bf-8de3-47d1-a4b0-b3bcaccac468`, DORA Resilienztests `to_adfd5e83-cbab-490c-ad4f-6e3bc81e1237` |
| Peec Tag-Gruppe Regelwerk | NIS2 `tg_4e73d745-6f3a-4056-b44b-6f55a43819f8`, DORA `tg_077dc69f-6139-4d4f-89f0-f0b51161cef9`, TISAX `tg_36faca4b-3d1b-402c-9ec9-2a690e2f0138`, ISO 27001 `tg_6a179d78-7062-49b4-9963-9413f59edabc`, BSI `tg_f2745fb4-3f0d-4cd7-885b-42414982fed7`, KRITIS `tg_d5e3ce3b-64af-4d78-bce8-13dcdc394912`, Datenschutz `tg_3ce24582-c00f-43fe-95c5-9317ec7d00e5`, Kein Regelwerk `tg_d41b4548-f2b3-4598-92ab-5f823c5a287a` |
| Peec Systemtags | non-branded `tg_1c8d473a-4442-43c4-a3a9-d1ca0fad9f57`, informational `tg_59e0dad1-22ea-4725-b2f2-afe3c40b61ac`, commercial `tg_7fda464b-0a97-4e9d-9e48-55ed0cb32a36` (bei `update_prompts` immer mitgeben, sonst gehen sie verloren) |
| Vercel | Team `team_8n12UIqO0xEkO4qy2jIX1EAA` (vornacs-projects), Projekt `prj_wrCxBUvRruUzGmW470Loi1Hu78OO` (vornac), Domains vornac.com, www.vornac.com, vornac.de, www.vornac.de |
| Peec-Messpunkte | Baseline 3.9.: Sichtbarkeit 0 %, Abruf 2,4 %, Zitate 0. Ziele: Woche 4 Abruf ≥ 10 %, Zitate ≥ 5; Woche 8 Sichtbarkeit ≥ 5 %; Woche 12 ≥ 10 %, Position ≤ 3 in ABS und Automatisierte Pentests |

Werkzeuge in Claude Code: `.mcp.json` im Repo-Root bringt `peec-ai` (https://api.peec.ai/mcp) und `vercel` (https://mcp.vercel.com) mit; beim ersten Start `/mcp` aufrufen und beide per OAuth freigeben. Prüfung: "Liste meine Peec-Projekte" muss VORNAC liefern.

---

## Task 1: Branch feat/de-root ausrollen (Ablauf A)

**Files:** alles im Branch, siehe `git diff main --stat`; Details Spec Abschnitt 3.

- [ ] **Step 1: Branch holen.** Entweder liegt er nach dem Teleport/Push schon im Remote (`git fetch && git checkout feat/de-root`), oder aus dem Bundle: `git fetch /pfad/vornac-feat-de-root.bundle feat/de-root:feat/de-root`, oder per Patches: `git checkout -b feat/de-root && git am docs/../0001-*.patch 0002-*.patch 0003-*.patch`.
- [ ] **Step 2: Bauen.** `npm ci && npm run build`. Erwartung: 143 geschriebene Dateien, `dist/index.html` hat `lang="de"`, `dist/en/index.html` hat `lang="en"`, `dist/404.html` existiert, `dist/robots.txt` und `dist/llms.txt` existieren.
- [ ] **Step 3: Prüfen.** `grep -rho 'href="/de[^"]*"' dist | wc -l` → 0. `grep -rhoE 'href="/[^"]*/"' dist | grep -v 'href="/"' | wc -l` → 0. `grep -c '<loc>' dist/sitemap.xml` → 139.
- [ ] **Step 4: Push und PR.** `git push -u origin feat/de-root`, PR gegen `main` mit Titel "Make German the root locale". Vercel baut ein Preview-Deployment.
- [ ] **Step 5: Preview prüfen** (PREVIEW = Preview-URL aus dem PR):
  - `curl -s https://PREVIEW/ | grep -o '<html lang="[a-z]*"'` → de
  - `curl -s https://PREVIEW/en | grep -o '<html lang="[a-z]*"'` → en
  - `curl -sI https://PREVIEW/de/faq | grep -i '^location'` → /faq
  - `curl -sI https://PREVIEW/pentesting.html | grep -i '^location'` → /en/pentesting
  - `curl -s https://PREVIEW/ | grep -o 'hreflang="[^"]*" href="[^"]*"'` → de auf /, en auf /en, x-default auf /en
  - `curl -A "GPTBot" -s https://PREVIEW/ | grep -o '<title>[^<]*'` → deutscher Titel
  - Host-Redirects lassen sich erst in Production prüfen (Preview-Hosts sind vercel.app).
- [ ] **Step 6: Merge und Production prüfen.** Dieselben Aufrufe gegen https://www.vornac.com, zusätzlich `curl -sI https://www.vornac.de/de/faq | grep -i '^location'` → https://www.vornac.com/faq und `curl -sI https://vornac.de/ | grep -i '^location'` → https://www.vornac.com/.
- [ ] **Step 7: Nacharbeiten am Deploy-Tag** (Spec Abschnitt 3, Schritt 5): Search Console Sitemap neu einreichen und URL-Prüfung für /, /pentesting, /faq, /glossary, fünf Branchenseiten; Bing Webmaster Tools Property und Sitemap, IndexNow; Google Ads Final URLs und Conversion-Zielseite /thank-you; GA4/GTM page_path-Trigger; Plausible Goals; Leadfeeder Custom Feeds.

## Task 2: Strukturierte Daten ausbauen (A4)

**Files:** `src/index.njk`, `src/de/index.njk` (Block `extraHead`), `src/glossary.njk`, `src/de/glossary.njk`, `src/_includes/partials/head-meta.njk` (optional gemeinsames Partial), Vorlagen unter `docs/superpowers/specs/ki-sichtbarkeit-schema/`.

- [ ] Organization, WebSite und Service mit Offer aus `schema-organization.jsonld` in beide Startseiten übernehmen; `foundingDate` eintragen (Gartner-Profil nennt 2025, mit André bestätigen); Offer nur, wenn Entscheidung 2 (Preis öffentlich) gefallen ist.
- [ ] DefinedTermSet aus `schema-glossar-definedtermset.jsonld` im Glossar erzeugen: aus `src/_data/glossary.js` alle Begriffe als `DefinedTerm` mit `@id` auf den bestehenden Anker `#term-<id>` rendern, deutsche Beschreibung als `description`.
- [ ] Neue Begriffe ins Glossar: Continuous Threat Exposure Management (CTEM), Assumed Breach Simulation (ABS), Breach and Attack Simulation (BAS), Pentest as a Service (PTaaS), Adversarial Exposure Validation (AEV), Exposure Validation.
- [ ] Prüfen mit `npx -y schema-dts` oder dem Rich-Results-Test; keine doppelten `@id`.

## Task 3: Datum, Autor, lastmod (A5)

**Files:** `src/_includes/layouts/base.njk`, `src/_includes/partials/head-meta.njk`, `src/sitemap.njk`, Front-Matter aller Inhaltsseiten, neues Partial `src/_includes/partials/page-meta-line.njk`.

- [ ] Front-Matter-Felder `updated: JJJJ-MM-TT` und `author: andre` (oder `arthur`) einführen; Autorenprofile in `src/_data/site.js` (Name, Rolle "Mitgründer, BSI-qualifizierter Pentester", Link auf /about).
- [ ] Sichtbare Zeile "Stand: TT.MM.JJJJ · Autor" oberhalb des ersten H2 auf Pentesting, OT-Pentesting, FAQ, Glossar, Branchen, Research-Notizen.
- [ ] `sitemap.njk`: `lastmod` aus `updated` je Seite statt `page.date` für alle; Research-Notizen aus einem `updated`-Feld in `src/_data/research.js`.
- [ ] `head-meta.njk`: `article:modified_time` und `article:author` für Seiten mit `updated`.

## Task 4: Atom-Feed (A7)

**Files:** neues `src/feed.njk` (permalink `/feed.xml`), `head-meta.njk`.

- [ ] Feed über Research-Notizen und künftige Wissen-Seiten (deutsch), sortiert nach `updated`; `<link rel="alternate" type="application/atom+xml">` im Head.

## Task 5: PDFs und Startseite (A8, A9)

- [ ] `CaseStudy_VORNAC_0526.pdf` in `VORNAC_Research_Autonomous_Pentesting_2026.pdf` umbenennen, Redirect in `vercel.json`, Announcement-Text in `src/_data/i18n.js` auf "Forschungspapier" ändern, PDF-Metadaten (Title, Author, Subject, Keywords) setzen.
- [ ] Startseite (beide Sprachen): Kategoriebegriffe "Exposure Validation Platform", "Penetration Testing Platform", "Automated Security Validation", "Breach and Attack Simulation", "Pentest as a Service" in H2 und Fließtext, deutsch mit englischem Begriff in Klammern.

## Task 6: Wissen-Seiten (Plan B, Reihenfolge der Spec)

**Files:** neue Templates `src/de/wissen/<slug>.njk` (deutsch zuerst) mit `i18nKey: wissen-<slug>`, Eintrag in `src/_data/pages.js` (`en: null` bis die englische Fassung existiert; `head-meta.njk` und `sitemap.njk` verkraften fehlende Gegenstücke), JSON-LD aus `schema-wissen-techarticle.jsonld`, Navigation "Wissen" in `site-header.njk` und `i18n.js`.

Zitierregeln je Seite (Spec Abschnitt 4): erster Absatz beantwortet die Frage in 40 bis 60 Wörtern; Definitionen in einem Satz mit englischem Begriff in Klammern; Rechtsgrundlagen exakt (§ 30 Abs. 2 Satz 2 Nr. 6 BSIG, Art. 24 Abs. 6 und Art. 25, 26 DORA, Anhang A 8.8 und 8.29 ISO/IEC 27001:2022, § 39 BSIG); mindestens eine Tabelle und ein FAQ-Block (FAQPage); Zahlen mit Quelle; Autor und Stand; Entität "VORNAC GmbH, Heidelberg"; 900 bis 1.800 Wörter; Wettbewerber nennen, wo die Frage es verlangt; keine Gedankenstriche.

- [ ] `/wissen/nis2-wirksamkeitspruefung` NIS2: Wirksamkeit der Sicherheitsmaßnahmen belegen (§ 30 BSIG)
- [ ] `/preise` Preise (nur nach Entscheidung 2)
- [ ] `/wissen/automatisierte-penetrationstests` Definition, Abgrenzung, Auswahlkriterien
- [ ] `/assumed-breach-simulation` Produktseite ABS
- [ ] `/vergleich/vornac-vs-pentera` Vergleich, danach Cymulate und Picus
- [ ] `/wissen/tisax-penetrationstest`
- [ ] `/wissen/dora-tests` (Art. 24 bis 27)
- [ ] `/wissen/iso-27001-penetrationstest` (A 8.8, A 8.29)
- [ ] `/wissen/bsi-penetrationstest`
- [ ] `/ctem` Produktseite CTEM
- [ ] `/wissen/bas-vs-automatisierter-pentest`
- [ ] `/wissen/anbieter-automatisierte-penetrationstests-deutschland` (faire Übersicht mit 10 bis 12 Anbietern)
- [ ] `/wissen/pentest-as-a-service`
- [ ] `/wissen/kritis-nachweise` (§ 39 BSIG)
- [ ] Whitepaper und Case Study (PDF mit Metadaten plus HTML)
- [ ] `llms.txt` um jede neue Seite ergänzen; Feed prüft sich mit.

## Task 7: Drittquellen (Plan C, kein Code)

- [ ] pentest-anbieter.de Formular, yekta-it.de Mail, OMR Reviews Formular (BAS und Penetration Testing), Gartner Peer Insights Markt "Adversarial Exposure Validation" beantragen, G2 (BAS und Penetration Testing Tools), Capterra/GetApp, SourceForge, Crunchbase vervollständigen, LinkedIn-Beschreibung, Wikidata-Eintrag, pentest-advisor.de.
- [ ] TeleTrusT: Profiltext, Zeichenträgerliste und Anbieterverzeichnis prüfen. Allianz für Cyber-Sicherheit: nächsten Partnerbeitrag einreichen.
- [ ] Zehn Bewertungen aus Pilot- und PoC-Kunden (G2, OMR, Gartner).
- [ ] Redaktion: Computerwoche-Interview mit Begriffsliste freigeben, deepstrike.io anfragen, Fachbeitrag it-daily.net oder security-insider.de.

## Task 8: Wöchentliche Messung (Plan D)

- [ ] Über `peec-ai` MCP: `get_domain_report` (Abrufquote vornac.com), `get_url_report` (zitierte Seiten), `get_brand_report` mit Dimension `topic_id` und Tag-Filter Regelwerk, `get_actions scope=overview`. Ergebnisse als kurze Notiz an diese Datei anhängen (Datum, Abruf, Zitate, Sichtbarkeit).
- [ ] Prompt-Set stabil lassen; neue Prompts nur bei echten Lücken und als Abdeckung dokumentiert.
- [ ] Im Peec-UI einmalig: Engines Google AI Mode, Gemini, Copilot, Claude aktivieren.

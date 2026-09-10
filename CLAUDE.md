@AGENTS.md

# Hinweise für Claude Code

## Laufendes Vorhaben: KI-Sichtbarkeit (GEO)

- Spec mit Befund und Plänen: `docs/superpowers/specs/2026-09-05-ki-sichtbarkeit-design.md`
- Umsetzungsplan mit Aufgaben, Kennungen (Peec, Vercel) und Messpunkten: `docs/superpowers/plans/2026-09-05-ki-sichtbarkeit.md`
- Stand: Task 1 (Ablauf A) ist seit 2026-09-06 in Production (PR #74). Task 3 ist seit 2026-09-09 komplett (Stand-Zeile plus Autor auf allen Inhaltsseiten). Aus Task 6 stehen `/wissen`, `/wissen/nis2-wirksamkeitspruefung` und `/vergleich/vornac-vs-pentera` (2026-09-09). Entscheidungen vom 2026-09-09: kein öffentlicher Preis (kein `/preise`, Offer ohne Preis), x-default auf die deutsche Root, BSI-Zertifizierung ist beschlossen, aber nicht erteilt: nirgends "zertifiziert" schreiben. Offen sind Step 7 (Search Console, Bing, Ads, GA4, Plausible, Leadfeeder), der Rest von Task 2 und 6 sowie Task 4, 5, 7, 8. Aufgaben in der Reihenfolge des Plans abarbeiten, Checkboxen dort pflegen.
- Vercel-Hinweis: Redirect-Regeln mit `source: "/:path*"` und Host-Bedingung greifen nicht für die nackte Root `/`; die Root braucht eine eigene Regel je Host (siehe `vercel.json`).

## URL- und Sprachschema (ab Branch `feat/de-root`)

- Deutsch ist die Root-Locale: `src/de/*.njk` wird an der Root ausgegeben (`/`, `/pentesting`, `/faq`). Englisch liegt in `src/*.njk` und wird unter `/en` ausgegeben. Die Abbildung steht in `src/src.11tydata.js` (`permalink`).
- `src/_data/pages.js` ist die einzige Quelle für URLs beider Sprachen. Templates verlinken über `pageUrls[...]`, `counterpart` oder die Registry, nie über hart verdrahtete Pfade. Neue Seiten: Template plus Registry-Eintrag; `en: null` ist erlaubt, solange die englische Fassung fehlt.
- Keine automatische Sprachumleitung im Browser. `lang-redirect.njk` speichert nur `?lang=`. Crawler, KI-Engines und Googlebot müssen auf der Root immer Deutsch bekommen.
- `vercel.json`: `trailingSlash: false`. Interne Links werden beim Build ohne Slash geschrieben (Transform in `.eleventy.js`); Vercel leitet `/de/*` auf `/*` und vornac.de auf www.vornac.com um.
- `robots.txt` und `llms.txt` liegen im Repo-Root und werden per Passthrough kopiert. Jede neue Inhaltsseite kommt in die `llms.txt`.
- Wissen-Seiten liegen unter `src/de/wissen/<slug>.njk` (Registry-Schlüssel `wissen-<slug>`) und Vergleiche unter `src/de/vergleich/<slug>.njk` (`vergleich-<slug>`); `dates.js` bildet verschachtelte Stems auf diese Schlüssel ab, `scripts/page-dates.js` liest Unterordner mit. Jede neue Seite zusätzlich in die Liste `wissenPages` in `src/de/wissen.njk` eintragen. Front-Matter je Seite: `author: andre` (Profil in `site.authors`), `ogType: article`, `faq` (Liste aus `q`/`a`, speist den sichtbaren FAQ-Block und die `FAQPage`), optional `about`, `legislation`, `citations`, `breadcrumb`; JSON-LD kommt aus `partials/wissen-schema.njk` (TechArticle mit Person-Autor, FAQPage, BreadcrumbList). Styles in `wissen.css` (Root, Passthrough), die Stand-Zeile (`partials/page-meta-line.njk`, `.v-meta-line`) in `src/input.css`. Der Menüpunkt "Wissen" im Research-Dropdown erscheint nur, wenn die Registry eine URL für die aktuelle Sprache hat.

## Datum und strukturierte Daten (seit PR "Peec site audit")

- Jede Seite hat `published` und `updated` (JJJJ-MM-TT), berechnet in `src/src.11tydata.js`: Front-Matter geht vor, dann der paginierte Datensatz (Research-Notiz oder -Domäne aus `research.js`), dann `src/_data/pageDates.json`. Die JSON kommt aus der Git-Historie (`npm run dates`) und wird mitcommittet; der Build ruft nie `git` und nie die Uhr auf, weil Vercel flach klont und ein Build-Datum jede Seite bei jedem Deploy "aktualisieren" würde.
- Nach jeder Inhaltsänderung: committen, dann `npm run dates`, JSON mitcommitten. `npm run dates:check` meldet eine veraltete JSON. Research-Notizen tragen ihr Datum selbst: `published`/`updated` je Notiz in `src/_data/research.js`, Standard `RESEARCH_PUBLISHED`/`RESEARCH_UPDATED`.
- Die Daten speisen `article:published_time`/`article:modified_time` (Seiten mit `ogType: article`), `datePublished`/`dateModified` in allen JSON-LD-Blöcken, die sichtbare Zeile "Veröffentlicht"/"Stand" auf Research-Notizen und `lastmod` in der Sitemap (`dates.byKey`).
- JSON-LD wird aus Partials erzeugt: `research-note-schema.njk` (TechArticle plus BreadcrumbList, die exakt der sichtbaren Brotkrumenleiste entspricht), `research-domain-schema.njk` und `research-index-schema.njk` (CollectionPage mit ItemList), `customers-schema.njk` (WebPage mit Reviews auf den Service `/pentesting#service`, Texte aus `src/_data/testimonials.js`, kein Product-Typ), `glossary-schema.njk` (DefinedTermSet aus `glossary.js`, `@id` je Begriff auf den Anker `#term-<id>`), `page-schema.njk` (AboutPage/WebPage), `webpage-node.njk` (WebPage-Knoten mit Datum für die handgeschriebenen Service-Graphen). Filter `jsonLd` serialisiert Objekte script-sicher und lässt leere Felder weg; `jsonString` für einzelne Werte in handgeschriebenem JSON.
- Organization-Knoten: kompakt auf jeder Seite über `site.organizationLd`, vollständig (Gründung 2025, Gründer mit Ankern auf `/about`, HRB, Adresse, Telefon, memberOf, knowsAbout, sameAs) auf den Startseiten über `partials/organization-schema.njk`, immer unter `https://www.vornac.com/#organization`. Kein Offer-Knoten, der Preis ist nicht öffentlich (Entscheidung 2026-09-09). Der Service `#service` wird nur auf `/pentesting` als Service deklariert und trägt dort die Kategoriebegriffe als `serviceType`; andere Seiten referenzieren die `@id`.
- hreflang x-default zeigt auf die deutsche URL (Entscheidung 2026-09-09), in `head-meta.njk` und `sitemap.njk`; nur Seiten ohne deutsche Fassung fallen auf Englisch zurück.
- `comcenter` trägt `noindex, nofollow` und bekommt kein JSON-LD. Eine Site-Suche gibt es nicht, deshalb keine `SearchAction`. Research-Notizen sind Referenzmaterial ohne Jahreszahl im Titel; das bleibt so.
- Genau ein `<h1>` je Seite; auf `/legal` heißt es "Rechtliches"/"Legal", Impressum und Datenschutzerklärung sind `<h2>`.

## Regeln für deutsche Inhaltsseiten (`/wissen`, Regelwerke, Vergleiche, Preise)

- Erster Absatz beantwortet die Frage der Überschrift in 40 bis 60 Wörtern. Definitionen in einem Satz, englischer Begriff in Klammern.
- Rechtsgrundlagen exakt zitieren (§ 30 Abs. 2 Satz 2 Nr. 6 BSIG, § 39 BSIG, Art. 24 Abs. 6 und Art. 25, 26 DORA, Anhang A 8.8 und 8.29 ISO/IEC 27001:2022).
- Mindestens eine Tabelle und ein FAQ-Block mit `FAQPage`-JSON-LD; `TechArticle` mit `author`, `datePublished`, `dateModified`; sichtbare Zeile "Stand" und Autor.
- Zahlen nur mit Quelle. Entität immer "VORNAC GmbH, Heidelberg". Wettbewerber werden genannt, wo die Frage es verlangt.
- Keine Gedankenstriche (kein Halbgeviertstrich, kein Geviertstrich; Bindestriche in Komposita sind in Ordnung), keine Marketing-Adjektive in Überschriften, kein KI-Duktus (keine Dreierketten, keine Floskeleinleitungen). Vorlagen für JSON-LD: `docs/superpowers/specs/ki-sichtbarkeit-schema/`.
- Neue Wissen-Seiten in `src/_data/wissen.js` eintragen: die Liste speist die Indexseite `/wissen` und den Atom-Feed `/feed.xml` (`src/_data/feed.js`, `src/feed.njk`; Research-Notizen kommen automatisch dazu). Der Feed liest wie die Sitemap nur Daten aus `dates.js`.

## Werkzeuge

- `.mcp.json` bringt `peec-ai` (https://api.peec.ai/mcp) und `vercel` (https://mcp.vercel.com) mit. Beim ersten Start `/mcp` und beide per OAuth freigeben.
- Peec: Prompt-Set nicht verändern, um Sichtbarkeit zu "verbessern"; Hebel sind Seiten und Drittquellen. Bei `update_prompts` die Systemtags (branding, intentType) immer mitgeben.
- Vercel-Projekt `vornac` (Team `vornacs-projects`); Preview-Deployments kommen aus dem PR.

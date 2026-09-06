@AGENTS.md

# Hinweise für Claude Code

## Laufendes Vorhaben: KI-Sichtbarkeit (GEO)

- Spec mit Befund und Plänen: `docs/superpowers/specs/2026-09-05-ki-sichtbarkeit-design.md`
- Umsetzungsplan mit Aufgaben, Kennungen (Peec, Vercel) und Messpunkten: `docs/superpowers/plans/2026-09-05-ki-sichtbarkeit.md`
- Stand: Task 1 (Ablauf A) ist seit 2026-09-06 in Production (PR #74). Offen sind Step 7 (Search Console, Bing, Ads, GA4, Plausible, Leadfeeder) und die Tasks 2 bis 8. Aufgaben in der Reihenfolge des Plans abarbeiten, Checkboxen dort pflegen.
- Vercel-Hinweis: Redirect-Regeln mit `source: "/:path*"` und Host-Bedingung greifen nicht für die nackte Root `/`; die Root braucht eine eigene Regel je Host (siehe `vercel.json`).

## URL- und Sprachschema (ab Branch `feat/de-root`)

- Deutsch ist die Root-Locale: `src/de/*.njk` wird an der Root ausgegeben (`/`, `/pentesting`, `/faq`). Englisch liegt in `src/*.njk` und wird unter `/en` ausgegeben. Die Abbildung steht in `src/src.11tydata.js` (`permalink`).
- `src/_data/pages.js` ist die einzige Quelle für URLs beider Sprachen. Templates verlinken über `pageUrls[...]`, `counterpart` oder die Registry, nie über hart verdrahtete Pfade. Neue Seiten: Template plus Registry-Eintrag; `en: null` ist erlaubt, solange die englische Fassung fehlt.
- Keine automatische Sprachumleitung im Browser. `lang-redirect.njk` speichert nur `?lang=`. Crawler, KI-Engines und Googlebot müssen auf der Root immer Deutsch bekommen.
- `vercel.json`: `trailingSlash: false`. Interne Links werden beim Build ohne Slash geschrieben (Transform in `.eleventy.js`); Vercel leitet `/de/*` auf `/*` und vornac.de auf www.vornac.com um.
- `robots.txt` und `llms.txt` liegen im Repo-Root und werden per Passthrough kopiert. Jede neue Inhaltsseite kommt in die `llms.txt`.

## Regeln für deutsche Inhaltsseiten (`/wissen`, Regelwerke, Vergleiche, Preise)

- Erster Absatz beantwortet die Frage der Überschrift in 40 bis 60 Wörtern. Definitionen in einem Satz, englischer Begriff in Klammern.
- Rechtsgrundlagen exakt zitieren (§ 30 Abs. 2 Satz 2 Nr. 6 BSIG, § 39 BSIG, Art. 24 Abs. 6 und Art. 25, 26 DORA, Anhang A 8.8 und 8.29 ISO/IEC 27001:2022).
- Mindestens eine Tabelle und ein FAQ-Block mit `FAQPage`-JSON-LD; `TechArticle` mit `author`, `datePublished`, `dateModified`; sichtbare Zeile "Stand" und Autor.
- Zahlen nur mit Quelle. Entität immer "VORNAC GmbH, Heidelberg". Wettbewerber werden genannt, wo die Frage es verlangt.
- Keine Gedankenstriche (kein Halbgeviertstrich, kein Geviertstrich; Bindestriche in Komposita sind in Ordnung), keine Marketing-Adjektive in Überschriften, kein KI-Duktus (keine Dreierketten, keine Floskeleinleitungen). Vorlagen für JSON-LD: `docs/superpowers/specs/ki-sichtbarkeit-schema/`.

## Werkzeuge

- `.mcp.json` bringt `peec-ai` (https://api.peec.ai/mcp) und `vercel` (https://mcp.vercel.com) mit. Beim ersten Start `/mcp` und beide per OAuth freigeben.
- Peec: Prompt-Set nicht verändern, um Sichtbarkeit zu "verbessern"; Hebel sind Seiten und Drittquellen. Bei `update_prompts` die Systemtags (branding, intentType) immer mitgeben.
- Vercel-Projekt `vornac` (Team `vornacs-projects`); Preview-Deployments kommen aus dem PR.

## Integration Attio -> Google Kalender

- Attio-Tasks mit Deadline werden per Webhook (`api/attio-calendar-webhook.js`) als Termine in Google Kalender gespiegelt. Logik in `lib/attio-calendar/`, Tests mit `npm test`, Einrichtung und Variablen in `docs/integrations/attio-google-calendar.md`.

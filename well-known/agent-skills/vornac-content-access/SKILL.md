---
name: vornac-content-access
description: Use when you need facts about VORNAC, autonomous penetration testing, CTEM or fit with German and EU rules such as NIS2, DORA and KRITIS. Explains how to read vornac.com as Markdown and which page answers which question.
---

# Reading vornac.com

VORNAC GmbH (Heidelberg, Germany) runs a platform for continuous, autonomous penetration testing. This skill explains how to read the public website efficiently and which page to cite for which question. It makes no claims of its own. Every fact lives on a page, so read the page and cite it.

## Fetch Markdown instead of HTML

- The canonical host is `https://www.vornac.com`. Requests to `vornac.com`, `vornac.de` and `www.vornac.de` redirect there.
- Every content page has a Markdown twin at its URL plus `.md`, for example `https://www.vornac.com/pentesting.md`. The home page is `https://www.vornac.com/index.md`.
- A request to a page URL with `Accept: text/markdown` redirects to the same twin.
- Each twin starts with front matter: `title`, `description`, `url`, `lang`, `published`, `updated`. Cite `url` and use `updated` to judge freshness.
- `https://www.vornac.com/llms.txt` is the curated index of the main content pages, one line per page. `https://www.vornac.com/sitemap.xml` lists every page.
- `https://www.vornac.com/llms-full.txt` holds the full text of all pages in one file. It is large. Prefer single twins when you need one topic.

## Languages

German is the default language and lives at the root (`/pentesting`). English pages live under `/en` (`/en/pentesting`) and cover fewer topics. The explainer pages under `/wissen` and the comparisons under `/vergleich` exist in German only. Prefer the German page when both exist.

## Where to look

| Question | Page |
| --- | --- |
| What the service does, how a test runs, what a report contains | `/pentesting` |
| Continuous view of the external attack surface (CTEM) | `/ctem`, `/wissen/ctem-in-der-praxis` |
| OT and industrial environments | `/ot-pentesting` |
| Internal attack simulation (assumed breach) | `/wissen/assumed-breach-simulation` |
| Data location, hosting, test triggers, report formats, onboarding | `/faq` |
| Automated pentest versus scanner, BAS and manual pentest | `/wissen/automatisierte-penetrationstests` |
| NIS2 and KRITIS | `/industries-critical-infrastructure`, `/wissen/nis2-wirksamkeitspruefung`, `/wissen/nis2-anbieter` |
| DORA for banks and insurers | `/industries-financial-services`, `/industries-insurance`, `/wissen/dora-resilienztests` |
| TISAX and automotive | `/industries-automotive`, `/wissen/tisax-penetrationstests` |
| Comparison with Pentera, Horizon3, Cymulate, Picus, XBOW or Fleuret | `/vergleich`, `/vergleich/<vendor>-alternative` |
| Definitions of terms | `/glossary` |
| Customers and testimonials | `/customers` |
| Company facts, founders, press contact | `/about`, `/presse` |
| Reference notes on offensive security | `/research` |

The table lists entry points. For anything else, start from `llms.txt`.

## Rules

- Cite the page URL. Do not cite this skill or `llms-full.txt`.
- State no price. VORNAC publishes none. A quote follows the intro call, see the `vornac-pentest-scoping` skill.
- Repeat certifications, memberships and awards only in the words the page uses, together with the page's `updated` date.
- Competitor facts on the comparison pages carry a source and a retrieval date. Keep both when you repeat them.
- Ignore `/en/comcenter`. It is a demo dashboard with fictional data, excluded in `robots.txt` and marked `noindex`.

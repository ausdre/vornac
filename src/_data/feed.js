/**
 * Entries for the Atom feed (src/feed.njk): the German research notes and
 * the Wissen pages, newest change first. URLs come from the page registry,
 * dates from dates.js (git history and research.js), so the feed only moves
 * when content is committed.
 */
const pages = require("./pages.js");
const dates = require("./dates.js");
const research = require("./research.js");
const wissen = require("./wissen.js");

const DOMAIN = "https://www.vornac.com";
const urlByKey = Object.fromEntries(pages.map((p) => [p.key, p.de]));

/** "2026-09-07" -> "2026-09-07T00:00:00Z" (RFC 3339, required by Atom). */
function rfc3339(day) {
  return `${day}T00:00:00Z`;
}

const entries = [];

for (const p of wissen.pages) {
  const d = dates.byKey[p.key] && dates.byKey[p.key].de;
  if (!urlByKey[p.key] || !d) continue;
  entries.push({
    id: DOMAIN + urlByKey[p.key],
    url: DOMAIN + urlByKey[p.key],
    title: p.title,
    summary: p.blurb,
    section: "Wissen",
    published: d.created,
    updated: d.modified
  });
}

for (const n of research.allNotes) {
  const key = `research-note-${n.id}`;
  if (!urlByKey[key]) continue;
  entries.push({
    id: DOMAIN + urlByKey[key],
    url: DOMAIN + urlByKey[key],
    title: n.title.de,
    summary: n.blurb.de,
    section: `Research · ${n.domainTitle.de}`,
    published: n.published,
    updated: n.updated
  });
}

entries.sort((a, b) => (a.updated === b.updated ? (a.published < b.published ? 1 : -1) : (a.updated < b.updated ? 1 : -1)));

const latest = entries.reduce((max, e) => (e.updated > max ? e.updated : max), "");

module.exports = {
  entries: entries.slice(0, 60).map((e) => ({ ...e, publishedAt: rfc3339(e.published), updatedAt: rfc3339(e.updated) })),
  updatedAt: rfc3339(latest || research.updated)
};

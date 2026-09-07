/**
 * Publish and last-modified dates for every page, derived once from the git
 * history (scripts/page-dates.js writes src/_data/pageDates.json) and from the
 * per-note fields in src/_data/research.js.
 *
 * Nothing here reads the clock or the file system, so a rebuild never moves a
 * date. The dates only change when the underlying edit is committed and the
 * JSON is refreshed with `npm run dates`.
 *
 * Shapes:
 *   byStem["/de/pentesting"]           -> { created, modified }   (from git)
 *   byKey["pentesting"].de             -> { created, modified }   (per registry key and locale)
 *   byKey["research-note-<id>"].de     -> { created, modified }   (from research.js)
 *
 * Templates get the current page's values as `published` and `updated`
 * through src/src.11tydata.js and can override both in front matter.
 */
const pageDates = require("./pageDates.json");
const research = require("./research.js");

/** Registry key -> file stem per locale, for the static templates. */
function stemsForKey(key) {
  const file = key === "index" ? "index" : key;
  return { de: `/de/${file}`, en: `/${file}` };
}

const byKey = {};

// Static pages: every template under src/ and src/de/ that carries an i18nKey.
for (const stem of Object.keys(pageDates)) {
  const m = stem.match(/^\/(de\/)?([^/]+)$/);
  if (!m) continue;
  const locale = m[1] ? "de" : "en";
  const key = m[2];
  if (key === "research-note" || key === "research-domain" || key === "sitemap" || key === "404") continue;
  byKey[key] = byKey[key] || {};
  byKey[key][locale] = pageDates[stem];
}

// Research index: created with the notes, modified when any note changed.
const researchDates = { created: research.published, modified: research.updated };
byKey.research = {
  de: pageDates["/de/research"] ? { created: researchDates.created, modified: latest(pageDates["/de/research"].modified, researchDates.modified) } : researchDates,
  en: pageDates["/research"] ? { created: researchDates.created, modified: latest(pageDates["/research"].modified, researchDates.modified) } : researchDates
};

// Research domains and notes: same dates in both locales, the content is
// maintained as one bilingual record.
for (const d of research.domains) {
  const dates = { created: d.published, modified: d.updated };
  byKey[`research-${d.id}`] = { de: dates, en: dates };
}
for (const n of research.allNotes) {
  const dates = { created: n.published, modified: n.updated };
  byKey[`research-note-${n.id}`] = { de: dates, en: dates };
}

function latest(a, b) {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

module.exports = {
  byStem: pageDates,
  byKey,
  stemsForKey
};

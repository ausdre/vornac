#!/usr/bin/env node
/**
 * Refresh src/_data/pageDates.json from the git history.
 *
 * For every page template under src/ (src/*.njk and src/de/*.njk) the script
 * records two dates, both taken from commits rather than from the file system:
 *
 *   created   date of the commit that added the file (renames followed)
 *   modified  date of the last commit that touched the file
 *
 * The build reads the JSON (see src/_data/pageDates.js) and never calls git
 * itself. Vercel clones shallowly, so a git lookup at build time would report
 * the shallow boundary instead of the real edit, and every deploy would move
 * every date. A committed JSON keeps the dates tied to the edit.
 *
 * Usage:  npm run dates        (run after committing a content change, then
 *                               commit the updated JSON together with it)
 *         npm run dates:check  (exit 1 when the JSON is stale; used before
 *                               opening a pull request)
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const OUT = path.join(SRC, "_data", "pageDates.json");

function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function isShallow() {
  try {
    return git(["rev-parse", "--is-shallow-repository"]) === "true";
  } catch (e) {
    return true;
  }
}

function listTemplates() {
  const out = [];
  for (const dir of [SRC, path.join(SRC, "de")]) {
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".njk")) continue;
      const rel = path.relative(ROOT, path.join(dir, name)).replace(/\\/g, "/");
      out.push(rel);
    }
  }
  return out.sort();
}

/** "src/de/pentesting.njk" -> "/de/pentesting" (Eleventy's page.filePathStem) */
function stemOf(rel) {
  return "/" + rel.replace(/^src\//, "").replace(/\.njk$/, "");
}

function datesFor(rel) {
  const modified = git(["log", "-1", "--format=%cs", "--", rel]);
  const history = git(["log", "--follow", "--diff-filter=A", "--format=%cs", "--", rel])
    .split("\n")
    .filter(Boolean);
  const created = history.length ? history[history.length - 1] : modified;
  if (!modified) throw new Error(`No git history for ${rel}`);
  return { created, modified };
}

function collect() {
  const result = {};
  for (const rel of listTemplates()) {
    result[stemOf(rel)] = datesFor(rel);
  }
  return result;
}

function main() {
  const check = process.argv.includes("--check");
  if (isShallow()) {
    console.error("page-dates: shallow clone, cannot derive dates from git. Run `git fetch --unshallow` first.");
    process.exit(check ? 0 : 1);
  }
  const fresh = collect();
  const json = JSON.stringify(fresh, null, 2) + "\n";
  if (check) {
    const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
    if (current !== json) {
      console.error("page-dates: src/_data/pageDates.json is stale. Run `npm run dates` and commit the result.");
      process.exit(1);
    }
    console.log("page-dates: up to date.");
    return;
  }
  fs.writeFileSync(OUT, json);
  console.log(`page-dates: wrote ${Object.keys(fresh).length} entries to ${path.relative(ROOT, OUT)}`);
}

main();

#!/usr/bin/env node
/**
 * Agent discovery files, run after the Eleventy build (npm run build:agents).
 *
 * The source are the skills under well-known/agent-skills/<name>/SKILL.md,
 * which Eleventy copies to dist/.well-known/agent-skills/ (passthrough in
 * .eleventy.js). This script reads the copies in dist/ and writes
 *
 *   dist/.well-known/agent-skills/index.json
 *       Agent Skills Discovery v0.2.0
 *       (https://github.com/cloudflare/agent-skills-discovery-rfc)
 *   dist/.well-known/ard.json
 *       Agentic Resource Discovery manifest, one entry per skill
 *       (https://agenticresourcediscovery.org/spec/, v0.91)
 *
 * `name` and `description` come from the front matter of each SKILL.md. The
 * digest is the SHA-256 of the bytes in dist/, the same bytes Vercel serves,
 * so the index cannot drift from the file an agent downloads. The ARD extras
 * (display name, sample queries) live in ARD below, one record per skill; a
 * skill without a record fails the build, and so does a record without a
 * skill.
 *
 * Like the other build scripts this one calls neither git nor the clock.
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const WELL_KNOWN = path.join(DIST, ".well-known");
const SKILLS_DIR = path.join(WELL_KNOWN, "agent-skills");
const ORIGIN = "https://www.vornac.com";
const PUBLISHER = "vornac.com";
const INDEX_SCHEMA = "https://schemas.agentskills.io/discovery/0.2.0/schema.json";

/** ARD fields that have no place in the SKILL.md front matter. */
const ARD = {
  "vornac-content-access": {
    displayName: "VORNAC content access",
    description: "How to read vornac.com as Markdown and which page answers which question.",
    representativeQueries: [
      "Welche Anbieter decken die NIS2-Wirksamkeitsprüfung mit Pentests ab?",
      "How does VORNAC compare to Pentera?",
      "Wo verarbeitet VORNAC Kundendaten?"
    ]
  },
  "vornac-pentest-scoping": {
    displayName: "VORNAC pentest scoping",
    description: "What to collect and how to book the intro call before a penetration test with VORNAC.",
    representativeQueries: [
      "Pentest für unsere Web-App bei VORNAC anfragen",
      "What does VORNAC need before a penetration test?",
      "Book a scoping call for continuous pentesting"
    ]
  }
};

function fail(message) {
  console.error(`agent-discovery: ${message}`);
  process.exit(1);
}

/** `name` and `description` from the YAML front matter of a SKILL.md. */
function frontMatter(text, file) {
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!block) fail(`${file} has no front matter`);
  const fields = {};
  for (const line of block[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!pair) continue;
    fields[pair[1]] = pair[2].trim().replace(/^(["'])(.*)\1$/, "$2");
  }
  return fields;
}

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    fail(`${path.relative(ROOT, SKILLS_DIR)} is missing, run the Eleventy build first`);
  }

  const names = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  if (names.length === 0) fail("no skill folders found");

  const skills = [];
  const entries = [];
  for (const name of names) {
    const file = path.join(SKILLS_DIR, name, "SKILL.md");
    const rel = path.relative(ROOT, file);
    if (!fs.existsSync(file)) fail(`${rel} is missing`);

    const bytes = fs.readFileSync(file);
    const fm = frontMatter(bytes.toString("utf8"), rel);

    if (name.length > 64 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) fail(`${name}: invalid skill name`);
    if (fm.name !== name) fail(`${rel}: front matter name "${fm.name}" does not match the folder`);
    if (!fm.description) fail(`${rel}: front matter has no description`);
    if (fm.description.length > 1024) fail(`${rel}: description is longer than 1024 characters`);

    const ard = ARD[name];
    if (!ard) fail(`${name}: add an ARD record in scripts/agent-discovery.js`);
    if (ard.representativeQueries.length < 2 || ard.representativeQueries.length > 5) {
      fail(`${name}: ARD wants 2 to 5 representative queries`);
    }

    const url = `/.well-known/agent-skills/${name}/SKILL.md`;
    skills.push({
      name,
      type: "skill-md",
      description: fm.description,
      url,
      digest: `sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`
    });
    entries.push({
      identifier: `urn:air:${PUBLISHER}:skills:${name}`,
      displayName: ard.displayName,
      type: "application/agent-skills+md",
      url: `${ORIGIN}${url}`,
      description: ard.description,
      representativeQueries: ard.representativeQueries
    });
  }

  for (const key of Object.keys(ARD)) {
    if (!names.includes(key)) fail(`ARD record "${key}" has no skill folder`);
  }

  const write = (file, data) => {
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`agent-discovery: wrote ${path.relative(ROOT, file)}`);
  };
  write(path.join(SKILLS_DIR, "index.json"), { $schema: INDEX_SCHEMA, skills });
  write(path.join(WELL_KNOWN, "ard.json"), { entries });
}

main();

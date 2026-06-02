/**
 * Cross-link phrase index.
 *
 * Builds a per-locale list of { phrase, href, kind, acronym }
 * used by the `crosslink` Eleventy transform in `.eleventy.js` to
 * auto-link glossary and research vocabulary across the whole site
 * (skipping headings, code, nav, header/footer — see transform).
 *
 * Sources:
 *   - Glossary entries (154)         -> /glossary#term-<id>
 *   - Research notes   ( 45)         -> /research/<domain>/<id>/
 *
 * Match rules (applied in the transform):
 *   - Phrases are sorted longest-first; longest match wins.
 *   - "Real word" phrases match case-insensitively but preserve the
 *     visible casing of the source text.
 *   - All-uppercase acronyms (PTES, OWASP, AD, JWT, SAML, etc.) match
 *     case-sensitively. Otherwise "ad hoc" would link to Active Directory.
 *   - Word-boundary check sits in the transform regex
 *     (`(?<!\w)…(?!\w)`) so plurals like "scopes" don't match "scope".
 *
 * Aliases:
 *   - Each glossary entry's `term` is cleaned of "(...)" parentheticals
 *     (the parenthetical is added as its own acronym alias when it is
 *     ALL CAPS).
 *   - `fullForm.en` / `fullForm.de` are added per locale where present.
 *   - Research notes contribute the title minus decorative suffixes
 *     ("— Reference", "— Pentest Reference", "— Mind Map", "— Cheat Sheets",
 *     "— Canonical Reference", "— Fundamentals", "— Threat Model").
 *
 * To exclude an entry from cross-linking, add its id to `EXCLUDE_IDS`
 * below — useful for single letters or words that would generate noise
 * (e.g. a hypothetical glossary entry called "Stack" would match too
 * many things).
 */

const glossary = require("./glossary.js");
const research = require("./research.js");

// Glossary IDs whose `term` is too generic to safely auto-link.
// Keep this list short; prefer trimming aliases over excluding entries.
const EXCLUDE_IDS = new Set([
  // Add only when a real false-positive shows up.
]);

// Manual aliases — short specialist terms that aren't in the glossary
// but should still cross-link to the relevant research note. The href
// is locale-substituted ("{loc}" → "" for EN, "/de" for DE).
//
// Keep the list curated, not exhaustive: every alias here adds a link
// candidate to every page on the site, so noise prevention beats
// coverage. Add an entry only when a phrase clearly maps to one
// specific destination.
const MANUAL_ALIASES = [
  // ── Active Directory attack chain → AD pentest note ────────────
  { phrases: ["BloodHound", "SharpHound", "NTLM", "LSASS", "Kerberoasting",
              "Kerberoast", "AS-REP roasting", "AS-REP Roasting",
              "Pass-the-Hash", "Pass-the-Ticket", "Pass the Hash",
              "Pass the Ticket", "Golden Ticket", "Silver Ticket",
              "Mimikatz", "DCSync", "Domain Admin", "Domain Admins",
              "Group Policy Object", "DCShadow", "ADCS", "AD CS"],
    href: "{loc}/research/offensive-tradecraft/active-directory-pentest/" },

  // ── Web app attack chain → web reference ───────────────────────
  { phrases: ["Burp Suite", "sqlmap", "ZAP", "OWASP ZAP", "XXE", "SSTI",
              "Server-Side Template Injection", "SSRF",
              "Server-Side Request Forgery", "Path Traversal",
              "Directory Traversal", "Open Redirect"],
    href: "{loc}/research/application-identity/web-attack-defense-canon/" },

  // ── XSS specifics → XSS note ───────────────────────────────────
  { phrases: ["Stored XSS", "Reflected XSS", "DOM-based XSS", "DOM XSS",
              "Content Security Policy", "CSP", "XSS Auditor"],
    href: "{loc}/research/application-identity/xss-comprehensive/" },

  // ── Recon → recon note ─────────────────────────────────────────
  { phrases: ["Subdomain Enumeration", "Subdomain Enum", "Amass",
              "Subfinder", "assetfinder", "FFUF", "Gobuster",
              "feroxbuster", "httpx", "nmap", "Nmap", "Masscan",
              "Wappalyzer", "Shodan", "Censys"],
    href: "{loc}/research/offensive-tradecraft/recon-and-discovery/" },

  // ── AWS specifics → AWS reference ──────────────────────────────
  { phrases: ["S3 bucket", "S3 Bucket", "IAM policy", "STS",
              "CloudTrail", "GuardDuty", "AWS Config", "AWS Organizations",
              "AssumeRole", "SCP", "Service Control Policy",
              "Cognito"],
    href: "{loc}/research/cloud-infrastructure/aws-security-reference/" },

  // ── Generic cloud → cloud generalist ───────────────────────────
  { phrases: ["GCP", "Google Cloud", "Azure AD", "Entra ID",
              "Cloud Security Posture Management", "CSPM", "CIEM",
              "Wiz", "Prisma Cloud", "Orca Security"],
    href: "{loc}/research/cloud-infrastructure/cloud-security-generalist/" },

  // ── Reversing / malware specifics → reversing note ─────────────
  { phrases: ["Ghidra", "IDA Pro", "Binary Ninja", "radare2", "x64dbg",
              "WinDbg", "Frida", "Cuckoo Sandbox", "MalwareBazaar",
              "VirusTotal", "AsyncRAT", "NanoCore", "PoisonIvy",
              "Cobalt Strike", "Sliver", "Brute Ratel"],
    href: "{loc}/research/reverse-malware/malware-analysis-canon/" },

  // ── Exploit dev specifics → binary exploitation note ───────────
  { phrases: ["Stack Buffer Overflow", "Heap Buffer Overflow",
              "Use-After-Free", "Type Confusion", "ASLR", "DEP",
              "CFG", "CET", "ROP Chain", "JOP", "Format String",
              "HVCI", "BYOVD"],
    href: "{loc}/research/reverse-malware/binary-exploitation-pipeline/" },

  // ── TLS specifics → TLS threat-model note ──────────────────────
  { phrases: ["Heartbleed", "BEAST", "CRIME", "BREACH", "POODLE",
              "FREAK", "Logjam", "DROWN", "Sweet32", "Lucky 13",
              "ROBOT", "TLS 1.2", "TLS 1.3", "OCSP", "HSTS",
              "Certificate Transparency"],
    href: "{loc}/research/defensive-ops/ssl-tls-threat-model/" },

  // ── SIEM / detection specifics → SIEM architecture note ────────
  { phrases: ["ECS", "Elastic Common Schema", "OCSF", "CIM",
              "Sigma rule", "Sigma rules", "Wazuh", "Suricata", "Zeek",
              "Splunk", "Elastic SIEM", "Sentinel"],
    href: "{loc}/research/defensive-ops/siem-architecture/" },

  // ── DDoS specifics → DDoS reference ────────────────────────────
  { phrases: ["SYN flood", "SYN Flood", "UDP flood", "UDP Flood",
              "Slow-Loris", "Slowloris", "Anycast", "BGP Flowspec",
              "Rapid Reset"],
    href: "{loc}/research/defensive-ops/ddos-defense-reference/" },

  // ── Mobile specifics → mobile platform note ────────────────────
  { phrases: ["Frida", "MobSF", "APK", "Android Keystore",
              "iOS Keychain", "Jailbreak", "Magisk", "TEE", "Trusted Execution Environment"],
    href: "{loc}/research/application-identity/mobile-platform-security/" }
];

// Decorative suffixes stripped from research note titles to derive
// matchable phrases. Em dash and en dash both supported.
const NOTE_SUFFIX_RE = /\s+[—–-]\s+(Reference|Pentest Reference|Mind Map|Mindmap|Cheat Sheets?|Canonical Reference|Fundamentals|Threat Model|Comprehensive|Reference Wheel|Reference – AWS|Reference – Generalist|Reference – APT lens|Reference – Red Team Planning|kanonische Referenz|Referenz|Pentest-Referenz|Mind-Map|Mind Map|Cheat Sheets?|Grundlagen|Bedrohungsmodell|Umfassend)$/i;

function cleanGlossaryTerm(t) {
  // Pull "(XYZ)" trailing acronym off the term so we can match the
  // base phrase independently from its acronym.
  const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(t);
  if (!m) return { base: t.trim(), acronymInParens: null };
  return { base: m[1].trim(), acronymInParens: m[2].trim() };
}

function looksLikeAcronym(s) {
  // Treat short fully-uppercase tokens (≥2 chars) as case-sensitive
  // acronyms. Allow digits and a few special chars (& . / -).
  return /^[A-Z][A-Z0-9&./\-]{1,}$/.test(s) && s === s.toUpperCase();
}

function pushPhrase(arr, phrase, meta) {
  if (!phrase) return;
  const cleaned = phrase.replace(/\s+/g, " ").trim();
  if (cleaned.length < 2) return;
  arr.push({ phrase: cleaned, ...meta });
}

function buildIndex(locale) {
  const phrases = [];

  // ── Glossary ────────────────────────────────────────────────────
  for (const entry of glossary.sorted) {
    if (EXCLUDE_IDS.has(entry.id)) continue;
    const hrefBase = locale === "de" ? "/de/glossary" : "/glossary";
    const href = `${hrefBase}#term-${entry.id}`;
    const meta = { href, kind: "glossary", id: entry.id };

    const { base, acronymInParens } = cleanGlossaryTerm(entry.term);

    // Base term (e.g. "Active Directory" from "Active Directory (AD)")
    if (base) {
      pushPhrase(phrases, base, { ...meta, acronym: looksLikeAcronym(base) });

      // Auto-alias: collapse "ISO/IEC 27001" → also match "ISO 27001"
      // (drops the /XXX part after the first slash). Same shape applies
      // to "ISO/IEC 27002", "ISO/IEC 27017", etc.
      const slashStripped = base.replace(/\/[A-Z]{2,5}\s+/, " ");
      if (slashStripped !== base) {
        pushPhrase(phrases, slashStripped, { ...meta, acronym: false });
      }
    }

    // Parenthetical acronym (e.g. "AD")
    if (acronymInParens && looksLikeAcronym(acronymInParens)) {
      pushPhrase(phrases, acronymInParens, { ...meta, acronym: true });
    }

    // Full form for this locale (e.g. "Penetration Testing Execution Standard")
    if (entry.fullForm && entry.fullForm[locale]) {
      pushPhrase(phrases, entry.fullForm[locale], { ...meta, acronym: false });
    }
  }

  // ── Manual aliases (curated specialist terms) ──────────────────
  const locPrefix = locale === "de" ? "/de" : "";
  for (const group of MANUAL_ALIASES) {
    const href = group.href.replace("{loc}", locPrefix);
    for (const phrase of group.phrases) {
      pushPhrase(phrases, phrase, {
        href,
        kind: "research-alias",
        id: `alias-${phrase.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        acronym: looksLikeAcronym(phrase)
      });
    }
  }

  // ── Research notes ──────────────────────────────────────────────
  for (const note of research.allNotes) {
    const href = locale === "de"
      ? `/de/research/${note.domain}/${note.id}/`
      : `/research/${note.domain}/${note.id}/`;
    const meta = { href, kind: "research", id: `note-${note.id}` };

    const rawTitle = (note.title && note.title[locale]) || "";
    const cleaned = rawTitle.replace(NOTE_SUFFIX_RE, "").trim();
    // Avoid linking very short residues (≤ 2 chars or single common words).
    if (cleaned && cleaned.split(/\s+/).length >= 2 && cleaned.length >= 6) {
      pushPhrase(phrases, cleaned, { ...meta, acronym: false });
    }
  }

  // De-duplicate (phrase + acronym flag is the key). When duplicates
  // exist, prefer the glossary entry (more authoritative).
  const seen = new Map();
  for (const p of phrases) {
    const key = `${p.acronym ? "A" : "a"}|${p.acronym ? p.phrase : p.phrase.toLowerCase()}`;
    const prev = seen.get(key);
    if (!prev || (prev.kind === "research" && p.kind === "glossary")) {
      seen.set(key, p);
    }
  }

  // Sort longest-first so multi-word matches win over substrings.
  return Array.from(seen.values()).sort((a, b) => b.phrase.length - a.phrase.length);
}

// Build the per-locale definitions map used by the hovercard popover.
// Each entry: { term, snippet, href } where snippet is one to two
// sentences kept short enough to fit a ~320px popover comfortably.
function truncate(s, limit) {
  if (!s) return "";
  if (s.length <= limit) return s;
  const cut = s.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > limit - 40 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

function buildDefinitions(locale) {
  const defs = {};

  // ── Glossary definitions (the authoritative source) ───────────
  for (const entry of glossary.sorted) {
    const hrefBase = locale === "de" ? "/de/glossary" : "/glossary";
    defs[entry.id] = {
      term: entry.term,
      snippet: truncate(entry.definition[locale], 280),
      href: `${hrefBase}#term-${entry.id}`
    };
  }

  // ── Research note definitions (blurb is exactly the right shape) ─
  for (const note of research.allNotes) {
    defs[`note-${note.id}`] = {
      term: (note.title && note.title[locale]) || note.id,
      snippet: truncate((note.blurb && note.blurb[locale]) || "", 280),
      href: locale === "de"
        ? `/de/research/${note.domain}/${note.id}/`
        : `/research/${note.domain}/${note.id}/`
    };
  }

  // ── Manual alias definitions (borrow blurb from the target note) ─
  // Reverse-resolve each alias href to its research note id, then
  // copy the note's blurb. The popover shows the alias phrase as title
  // and points to the note as "More" destination.
  const locPrefix = locale === "de" ? "/de" : "";
  const noteByPath = new Map(
    research.allNotes.map((n) => [
      `${locPrefix}/research/${n.domain}/${n.id}/`,
      n
    ])
  );
  for (const group of MANUAL_ALIASES) {
    const href = group.href.replace("{loc}", locPrefix);
    const targetNote = noteByPath.get(href);
    const snippet = targetNote
      ? truncate((targetNote.blurb && targetNote.blurb[locale]) || "", 280)
      : "";
    for (const phrase of group.phrases) {
      const id = `alias-${phrase.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      defs[id] = { term: phrase, snippet, href };
    }
  }

  return defs;
}

module.exports = {
  en: buildIndex("en"),
  de: buildIndex("de"),
  definitions: {
    en: buildDefinitions("en"),
    de: buildDefinitions("de")
  }
};

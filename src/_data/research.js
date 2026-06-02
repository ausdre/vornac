/**
 * VORNAC Research — curated reference index.
 *
 * Source: a 265-entry corpus of offensive-security mindmaps and
 * methodology notes assembled in-house. Every entry was fingerprinted
 * by SHA-256, deduplicated across the source set, machine-extracted
 * from diagrammatic form, and manually re-titled in neutral English.
 *
 * What this file does NOT carry:
 *   - source identifiers, attribution, or upstream filenames
 *   - non-Latin script of any kind
 *   - internal phase nomenclature — phase labels are rendered in
 *     plain English ("XSS", "SQL Injection", "Recon")
 *   - dated artifacts (year-only or version-only titles)
 *
 * Entries are intentionally hand-titled and hand-blurbed so the index
 * reads like a library catalog, not a scraped dump.
 *
 * Structure:
 *   - DOMAINS        the 8 macro-domains shown on the page
 *   - PHASES         readable labels for the 24 mapped engagement phases
 *   - NOTES          curated entries (Tier 1 = featured, Tier 2 = reference,
 *                    Tier 3 = background)
 *   - module.exports returns a derived shape with counts + grouped notes,
 *     ready for templates.
 */

const DOMAINS = [
  {
    id: "offensive-tradecraft",
    number: "01",
    title: { en: "Offensive Tradecraft",            de: "Offensive Tradecraft" },
    blurb: {
      en: "Methodologies, frameworks, and red-team playbooks. The how-we-test layer.",
      de: "Methodiken, Frameworks und Red-Team-Playbooks. Die Wie-wir-testen-Ebene."
    }
  },
  {
    id: "application-identity",
    number: "02",
    title: { en: "Application & Identity Security", de: "Anwendungs- & Identitätssicherheit" },
    blurb: {
      en: "OWASP-adjacent vulnerability classes — from XSS to business logic flaws.",
      de: "OWASP-nahe Schwachstellenklassen — von XSS bis Business-Logic-Fehlern."
    }
  },
  {
    id: "cloud-infrastructure",
    number: "03",
    title: { en: "Cloud & Modern Infrastructure",   de: "Cloud & moderne Infrastruktur" },
    blurb: {
      en: "Public-cloud security models and enterprise architecture patterns.",
      de: "Public-Cloud-Sicherheitsmodelle und Enterprise-Architektur-Muster."
    }
  },
  {
    id: "ot-embedded",
    number: "04",
    title: { en: "Operational Technology & Embedded", de: "Operational Technology & Embedded" },
    blurb: {
      en: "Surfaces outside conventional IT: ICS/SCADA, IoT, automotive, wireless.",
      de: "Angriffsflächen jenseits klassischer IT: ICS/SCADA, IoT, Automotive, Wireless."
    }
  },
  {
    id: "threat-intelligence",
    number: "05",
    title: { en: "Threat Intelligence & Adversary Modeling", de: "Threat Intelligence & Adversary Modeling" },
    blurb: {
      en: "Diamond model, kill chains, attribution, and threat modeling.",
      de: "Diamond Model, Kill Chains, Attribution und Threat Modeling."
    }
  },
  {
    id: "reverse-malware",
    number: "06",
    title: { en: "Reverse Engineering, Binary & Malware", de: "Reverse Engineering, Binary & Malware" },
    blurb: {
      en: "Low-level attack surfaces — exploitation, fuzzing, and malware behavior.",
      de: "Tieferliegende Angriffsflächen — Exploitation, Fuzzing und Malware-Verhalten."
    }
  },
  {
    id: "ai-emerging",
    number: "07",
    title: { en: "AI, Data & Emerging Risk",         de: "KI, Daten & neue Risiken" },
    blurb: {
      en: "Machine-learning security, blockchain, and data-layer threats.",
      de: "Sicherheit von Machine Learning, Blockchain und Daten-Layer-Bedrohungen."
    }
  },
  {
    id: "defensive-ops",
    number: "08",
    title: { en: "Defensive Operations & Governance", de: "Defensive Operations & Governance" },
    blurb: {
      en: "Blue-team operations, the security-product landscape, and compliance posture.",
      de: "Blue-Team-Operationen, Security-Produkt-Landschaft und Compliance-Haltung."
    }
  }
];

/**
 * Phase keys appearing on entries are rendered with these labels.
 * Sourced from the engagement-phase taxonomy used during curation;
 * keys are stable IDs, labels are presentation only.
 */
const PHASES = {
  "osint":             { en: "OSINT",               de: "OSINT" },
  "recon":             { en: "Recon",               de: "Recon" },
  "dir-fuzz":          { en: "Directory Fuzzing",   de: "Directory Fuzzing" },
  "fingerprint":       { en: "Fingerprinting",      de: "Fingerprinting" },
  "auth":              { en: "Authentication",      de: "Authentifizierung" },
  "session":           { en: "Session Mgmt",        de: "Session-Mgmt" },
  "auth-bypass":       { en: "Auth Bypass",         de: "Auth-Bypass" },
  "xss":               { en: "XSS",                 de: "XSS" },
  "dom-xss":           { en: "DOM XSS",             de: "DOM-XSS" },
  "csrf":              { en: "CSRF",                de: "CSRF" },
  "sqli":              { en: "SQL Injection",       de: "SQL-Injection" },
  "cmd-injection":     { en: "Command Injection",   de: "Command Injection" },
  "ssrf":              { en: "SSRF",                de: "SSRF" },
  "deserialization":   { en: "Deserialization",     de: "Deserialisierung" },
  "upload":            { en: "File Upload",         de: "File Upload" },
  "xxe":               { en: "XXE / Path Traversal", de: "XXE / Path Traversal" },
  "idor":              { en: "IDOR",                de: "IDOR" },
  "biz-logic":         { en: "Business Logic",      de: "Business Logic" },
  "api":               { en: "API Security",        de: "API-Sicherheit" },
  "cors-tls-jwt":      { en: "CORS / TLS / JWT",    de: "CORS / TLS / JWT" },
  "misconfig":         { en: "Misconfiguration",    de: "Fehlkonfiguration" },
  "cves":              { en: "Known CVEs",          de: "Bekannte CVEs" },
  "report":            { en: "Reporting",           de: "Reporting" },
  "methodology":       { en: "Methodology",         de: "Methodik" }
};

/**
 * Helper: short blurb. EN/DE pair, both ≤ ~180 chars to keep cards tight.
 * Phase values reference PHASES keys above. Tier: 1 = featured, 2 = reference,
 * 3 = background.
 */
const T = (en, de) => ({ en, de });

const NOTES = [
  // ─────────────────────────────────────────────────────────────
  // 01 — OFFENSIVE TRADECRAFT
  // ─────────────────────────────────────────────────────────────
  {
    id: "comprehensive-pentest-reference",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Comprehensive Pentest Reference", "Umfassende Pentest-Referenz"),
    blurb: T(
      "A three-column reference combining a tooling catalog, a vulnerability-class checklist, and a per-service CVE matrix. The most concrete tooling reference in the index.",
      "Drei-Spalten-Referenz aus Tool-Katalog, Schwachstellenklassen-Checkliste und CVE-Matrix pro Dienst. Die konkreteste Tool-Referenz im Index."
    ),
    phases: ["recon", "fingerprint", "xss", "sqli", "cmd-injection", "ssrf", "upload", "cves"]
  },
  {
    id: "ptes-mindmap",
    domain: "offensive-tradecraft", tier: 1,
    title: T("PTES — Penetration Testing Execution Standard", "PTES — Penetration Testing Execution Standard"),
    blurb: T(
      "The PTES expressed as a navigable tree: scoping, intelligence gathering, threat modeling, vulnerability analysis, exploitation, post-exploitation, reporting.",
      "PTES als navigierbarer Baum: Scoping, Intelligence Gathering, Threat Modeling, Vulnerability Analysis, Exploitation, Post-Exploitation, Reporting."
    ),
    phases: ["methodology", "recon", "report"]
  },
  {
    id: "art-of-pentesting",
    domain: "offensive-tradecraft", tier: 1,
    title: T("The Art of Penetration Testing", "The Art of Penetration Testing"),
    blurb: T(
      "Engagement archetypes, mindset notes, and the practical sequencing of a senior tester's day. A craft companion to the PTES skeleton.",
      "Engagement-Archetypen, Mindset-Notizen und die praktische Sequenz eines erfahrenen Testers. Handwerkliche Ergänzung zum PTES-Skelett."
    ),
    phases: ["methodology"]
  },
  {
    id: "pentest-detailed",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Penetration Testing — Detailed Edition", "Penetration Testing — Detailed Edition"),
    blurb: T(
      "A longer-form walkthrough of an end-to-end engagement, with worked decisions at each phase boundary.",
      "Ausführlicher Walkthrough eines kompletten Engagements, mit ausgearbeiteten Entscheidungen an jeder Phasengrenze."
    ),
    phases: ["recon", "methodology"]
  },
  {
    id: "pentest-overview",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Penetration Testing Overview", "Penetration Testing — Überblick"),
    blurb: T(
      "A compact one-page synthesis of how a modern engagement is structured, useful as a briefing for non-pentester stakeholders.",
      "Kompakte Ein-Seiten-Synthese, wie ein modernes Engagement strukturiert ist — nützlich als Briefing für Nicht-Pentester."
    ),
    phases: ["recon", "methodology"]
  },
  {
    id: "pentest-workflow",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Pentest Workflow", "Pentest-Workflow"),
    blurb: T(
      "The day-by-day rhythm of an engagement, with checkpoints, deliverables, and the points where a junior should escalate.",
      "Tag-für-Tag-Rhythmus eines Engagements, mit Checkpoints, Deliverables und den Punkten, an denen ein Junior eskalieren sollte."
    ),
    phases: ["recon", "methodology"]
  },
  {
    id: "pentest-workflow-wiki",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Pentest Workflow — Wiki Edition", "Pentest-Workflow — Wiki-Edition"),
    blurb: T(
      "A cross-linked, encyclopedic variant of the workflow above, with deeper sub-pages for each test phase.",
      "Eine quervernetzte, enzyklopädische Variante des obigen Workflows, mit tieferen Sub-Seiten pro Testphase."
    ),
    phases: ["recon", "methodology", "report"]
  },
  {
    id: "pentest-flow",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Pentest Flow", "Pentest-Flow"),
    blurb: T(
      "Diagram-first view of the engagement, with explicit branching for grey-box, black-box, and assumed-breach scenarios.",
      "Diagrammgetriebene Sicht auf das Engagement, mit expliziter Verzweigung für Grey-Box, Black-Box und Assumed-Breach-Szenarien."
    ),
    phases: ["methodology", "recon"]
  },
  {
    id: "advanced-pentest",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Advanced Penetration Testing", "Advanced Penetration Testing"),
    blurb: T(
      "Past the OWASP basics: chained exploitation, custom protocol abuse, and reaching the interesting blast radius beyond the first foothold.",
      "Jenseits der OWASP-Basics: verkettete Exploitation, eigene Protokoll-Missbräuche und die Wege zum interessanten Blast-Radius nach dem ersten Foothold."
    ),
    phases: ["methodology", "cves"]
  },
  {
    id: "pentest-lab",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Pentest Lab Setup", "Pentest-Lab-Setup"),
    blurb: T(
      "Air-gapped lab topology for safe payload trials: hypervisor pinning, network segmentation, snapshot discipline.",
      "Air-gapped Lab-Topologie für sichere Payload-Tests: Hypervisor-Pinning, Netzsegmentierung, Snapshot-Disziplin."
    ),
    phases: ["methodology"]
  },
  {
    id: "red-team-manual",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Red Team Manual", "Red-Team-Manual"),
    blurb: T(
      "Operating notes for full-scope adversary simulation: objectives, deconfliction, evasion budgets, after-action structure.",
      "Operative Notizen zur vollständigen Adversary-Simulation: Zielsetzung, Deconfliction, Evasion-Budgets, After-Action-Struktur."
    ),
    phases: ["methodology", "report"]
  },
  {
    id: "information-gathering",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Information Gathering", "Information Gathering"),
    blurb: T(
      "The recon catalog: passive, semi-passive, and active discovery; with the rationale for picking one mode over another per engagement.",
      "Der Recon-Katalog: passiv, semi-passiv und aktiv — mit der Begründung, welcher Modus wann passt."
    ),
    phases: ["recon", "osint"]
  },
  {
    id: "domain-enumeration",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Domain Enumeration Methods", "Methoden zur Domain-Enumeration"),
    blurb: T(
      "Every practical avenue for subdomain discovery: CT logs, DNS bruteforce, ASN walks, JavaScript scraping, archive mining.",
      "Alle praktikablen Wege zur Subdomain-Erkennung: CT-Logs, DNS-Bruteforce, ASN-Walks, JavaScript-Scraping, Archive-Mining."
    ),
    phases: ["recon"]
  },
  {
    id: "web-fingerprinting-methods",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Web Fingerprinting Methods", "Web Fingerprinting — Methoden"),
    blurb: T(
      "Stack identification by header pattern, content quirk, error-page signature, favicon hash, and behavioral probe.",
      "Stack-Identifikation per Header-Muster, Content-Auffälligkeit, Error-Page-Signatur, Favicon-Hash und Verhaltensprobe."
    ),
    phases: ["fingerprint", "recon"]
  },
  {
    id: "web-server-intrusion-defense",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Web Server Intrusion & Defense", "Web Server — Intrusion & Defense"),
    blurb: T(
      "Per-server-class attack chains paired with the corresponding hardening: Apache, nginx, IIS, Tomcat, JBoss.",
      "Angriffsketten pro Server-Klasse mit zugehörigen Härtungsmaßnahmen: Apache, nginx, IIS, Tomcat, JBoss."
    ),
    phases: ["fingerprint", "cmd-injection"]
  },
  {
    id: "pentest-ad",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Pentesting Active Directory", "Pentesting Active Directory"),
    blurb: T(
      "AD attack surface end-to-end: enumeration, Kerberos, ACL abuse, GPO weaponization, the Tier-0 chase.",
      "Active Directory von A bis Z: Enumeration, Kerberos, ACL-Missbrauch, GPO-Waffenbau, Jagd auf Tier 0."
    ),
    phases: ["recon", "auth"]
  },

  // 01 reference (Tier 2)
  {
    id: "web-penetration-methodology",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Web Penetration Methodology", "Web-Pentest-Methodik"),
    blurb: T(
      "A condensed version of the full web-app methodology, formatted for engagement-kickoff use.",
      "Komprimierte Version der vollständigen Web-App-Methodik, formatiert für Engagement-Kickoffs."
    ),
    phases: ["methodology"]
  },
  {
    id: "web-application-testing",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Web Application Testing", "Web Application Testing"),
    blurb: T(
      "Testing-task taxonomy aligned to the modern web-app surface, including SPAs and API-first deployments.",
      "Testing-Task-Taxonomie für die moderne Web-App-Oberfläche, inklusive SPAs und API-first Deployments."
    ),
    phases: ["methodology"]
  },
  {
    id: "pentest-method",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Pentest Method — Field Notes", "Pentest-Methode — Field Notes"),
    blurb: T(
      "Practitioner field notes on method selection, with worked decisions at recon and authentication boundaries.",
      "Praxisnahe Field Notes zur Methodenwahl, mit konkreten Entscheidungen an Recon- und Auth-Übergängen."
    ),
    phases: ["recon", "fingerprint", "auth", "report", "methodology"]
  },
  {
    id: "internal-network-pentest",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Internal Network Penetration", "Internal Network Penetration"),
    blurb: T(
      "Internal-engagement playbook: discovery, credential plumbing, lateral movement, and the path to domain dominance.",
      "Playbook für interne Engagements: Discovery, Credential-Plumbing, Lateral Movement und der Weg zur Domain Dominance."
    ),
    phases: ["fingerprint", "auth", "biz-logic"]
  },
  {
    id: "internal-network-pivoting",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Internal Network Pivoting", "Internal Network Pivoting"),
    blurb: T(
      "Tunnel topologies, port-forwarding patterns, and how to keep an interactive shell on a flaky link.",
      "Tunnel-Topologien, Port-Forwarding-Muster und wie man eine interaktive Shell auf einer instabilen Verbindung hält."
    ),
    phases: ["methodology"]
  },
  {
    id: "web-to-internal-pivot",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Web → Internal Pivot Workflow", "Web → Internal Pivot Workflow"),
    blurb: T(
      "The handoff from a perimeter web compromise to internal lateral movement, condensed to one workflow.",
      "Übergang vom Perimeter-Web-Compromise zu interner Lateral Movement, auf einen Workflow verdichtet."
    ),
    phases: ["methodology"]
  },
  {
    id: "jboss-internal-pentest",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Application-Server Triggered Internal Pentest", "Internal Pentest via Application Server"),
    blurb: T(
      "Worked case: a single JBoss deserialization finding becomes domain-wide access. The chain step-by-step.",
      "Durchgespielter Fall: Ein einziger JBoss-Deserialisierungs-Befund wird zu domänenweitem Zugriff. Die Kette Schritt für Schritt."
    ),
    phases: ["deserialization", "auth", "fingerprint"]
  },
  {
    id: "nmap-mindmap",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Nmap — Operator Reference", "Nmap — Operator-Referenz"),
    blurb: T(
      "Scan templates by goal: stealth, breadth, depth, version pinning, NSE chains. With timing tradeoffs.",
      "Scan-Templates nach Ziel: Stealth, Breite, Tiefe, Version-Pinning, NSE-Ketten. Mit Timing-Tradeoffs."
    ),
    phases: ["recon", "fingerprint"]
  },
  {
    id: "nmap-pentest-guide",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Nmap — Pentest Guide", "Nmap — Pentest-Guide"),
    blurb: T(
      "Per-engagement-phase nmap recipes — what to scan, why, and what to do with the result.",
      "nmap-Rezepte pro Engagement-Phase — was scannen, warum, und was mit dem Ergebnis tun."
    ),
    phases: ["recon", "fingerprint", "auth"]
  },
  {
    id: "maltego-usage",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Maltego — Usage Reference", "Maltego — Usage-Referenz"),
    blurb: T(
      "Transform chains for entity discovery: people, infrastructure, social graph, breach data.",
      "Transform-Ketten für Entity-Discovery: Personen, Infrastruktur, Social Graph, Breach-Daten."
    ),
    phases: ["recon"]
  },
  {
    id: "automated-testing",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Automated Testing", "Automatisiertes Testing"),
    blurb: T(
      "What automation is good at, what it misses, and the seams where manual review must take over.",
      "Wo Automatisierung stark ist, was sie übersieht, und an welchen Nähten der Mensch übernehmen muss."
    ),
    phases: ["recon", "dir-fuzz", "xss", "sqli"]
  },
  {
    id: "manual-testing",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Manual Testing", "Manuelles Testing"),
    blurb: T(
      "The counterpart to the above: techniques that resist tooling, including business-logic and chained authorization flaws.",
      "Das Gegenstück: Techniken, die sich Tooling entziehen — inklusive Business-Logic und verketteten Autorisierungsfehlern."
    ),
    phases: ["biz-logic"]
  },
  {
    id: "pentest-tools-overview",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Pentest Tools — Overview", "Pentest-Tools — Überblick"),
    blurb: T(
      "The toolkit catalog, grouped by purpose. Recommended defaults for each slot.",
      "Toolkit-Katalog, gruppiert nach Zweck. Empfohlene Defaults pro Slot."
    ),
    phases: ["methodology"]
  },
  {
    id: "testing-tools-taxonomy",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Mainstream Testing Tools — Taxonomy", "Testing-Tools — Taxonomie"),
    blurb: T(
      "A taxonomy of the broadly-deployed tooling stacks, with notes on overlap and substitution.",
      "Taxonomie der weit verbreiteten Tool-Stacks, mit Überlapp- und Ersatz-Notizen."
    ),
    phases: ["methodology"]
  },
  {
    id: "meterpreter-cheatsheet",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Meterpreter — Operator Cheat Sheet", "Meterpreter — Operator-Cheatsheet"),
    blurb: T(
      "Session management, pivoting commands, post-modules worth knowing by heart.",
      "Session-Management, Pivot-Kommandos und Post-Module, die man auswendig können sollte."
    ),
    phases: ["methodology"]
  },
  {
    id: "powershell-syntax",
    domain: "offensive-tradecraft", tier: 2,
    title: T("PowerShell — Operator Reference", "PowerShell — Operator-Referenz"),
    blurb: T(
      "PowerShell idioms that survive constrained-language mode, AMSI, and modern EDR baselining.",
      "PowerShell-Idiome, die Constrained Language Mode, AMSI und modernes EDR-Baselining überstehen."
    ),
    phases: ["methodology"]
  },
  {
    id: "system-port-audit-notes",
    domain: "offensive-tradecraft", tier: 2,
    title: T("System Port Audit Notes", "System-Port-Audit-Notizen"),
    blurb: T(
      "Per-port default service, common defaults, and the canonical exploitation hook for each.",
      "Standarddienst pro Port, übliche Defaults und der kanonische Exploitation-Hook je Port."
    ),
    phases: ["recon"]
  },
  {
    id: "linux-security-coaching",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Linux Security — Coaching Notes", "Linux Security — Coaching-Notizen"),
    blurb: T(
      "Operator-level Linux notes for offensive use: capability enumeration, SUID chains, kernel-version routing.",
      "Linux-Notizen auf Operator-Level für offensiven Einsatz: Capability-Enumeration, SUID-Ketten, Kernel-Version-Routing."
    ),
    phases: ["methodology"]
  },
  {
    id: "network-security-intro",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Network Security — Introduction", "Netzwerksicherheit — Einführung"),
    blurb: T(
      "Foundation reading for testers without a deep network background. Layer-by-layer attack surface map.",
      "Grundlagentext für Tester ohne tiefen Netzwerkhintergrund. Angriffsfläche pro Layer."
    ),
    phases: ["methodology"]
  },
  {
    id: "python-system-audit",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Python — System Audit Recipes", "Python — System-Audit-Rezepte"),
    blurb: T(
      "Short Python scripts for routine audit tasks — credential sweeps, config diffs, log triage.",
      "Kurze Python-Skripte für Routine-Audit-Aufgaben — Credential-Sweeps, Config-Diffs, Log-Triage."
    ),
    phases: ["methodology"]
  },

  // 01 background (Tier 3)
  {
    id: "pentester-skills",
    domain: "offensive-tradecraft", tier: 3,
    title: T("Penetration Tester — Skill Reference", "Penetration Tester — Skill-Referenz"),
    blurb: T(
      "What a senior tester is expected to be fluent in across the engagement phases. Useful as a self-assessment.",
      "Was von einem Senior-Tester über die Engagement-Phasen hinweg erwartet wird. Nützlich als Selbstbewertung."
    ),
    phases: ["recon", "fingerprint", "sqli", "upload", "idor", "xxe", "deserialization", "xss", "csrf", "ssrf", "biz-logic", "report"]
  },
  {
    id: "git-for-security",
    domain: "offensive-tradecraft", tier: 3,
    title: T("Git for Security Engineers", "Git für Security Engineers"),
    blurb: T(
      "Repo archaeology techniques: secret hunting in history, blame-driven attribution, fork-comparison for triage.",
      "Repo-Archäologie: Secret-Hunting in der History, Blame-getriebene Attribution, Fork-Vergleiche zur Triage."
    ),
    phases: ["recon"]
  },
  {
    id: "social-engineering",
    domain: "offensive-tradecraft", tier: 3,
    title: T("Social Engineering — Reference", "Social Engineering — Referenz"),
    blurb: T(
      "Pretext design, channel selection, and the failure modes that turn a phishing campaign into an internal incident on your side.",
      "Pretext-Design, Kanalwahl und die Fehlermodi, die eine Phishing-Kampagne in einen internen Vorfall auf eigener Seite verwandeln."
    ),
    phases: ["auth"]
  },
  {
    id: "phishing-admin-targets",
    domain: "offensive-tradecraft", tier: 3,
    title: T("Phishing — Administrator Targets", "Phishing — Administrator-Ziele"),
    blurb: T(
      "Patterns specific to phishing privileged users: tooling-trust exploitation, helpdesk pretexts, console-link redirects.",
      "Muster speziell für Phishing auf privilegierte Nutzer: Ausnutzung von Tool-Vertrauen, Helpdesk-Pretexts, Console-Link-Redirects."
    ),
    phases: ["auth"]
  },
  {
    id: "ctf-tools",
    domain: "offensive-tradecraft", tier: 3,
    title: T("CTF Tools & Resources", "CTF — Tools & Ressourcen"),
    blurb: T(
      "The CTF tooling shortlist worth keeping in muscle memory — many are also useful in real engagements.",
      "Die CTF-Tool-Shortlist, die im Muskelgedächtnis sitzen sollte — vieles davon ist auch in echten Engagements nützlich."
    ),
    phases: ["methodology"]
  },
  {
    id: "ctf-deployment",
    domain: "offensive-tradecraft", tier: 3,
    title: T("CTF Attack/Defense — Infrastructure", "CTF Attack/Defense — Infrastruktur"),
    blurb: T(
      "How a serious A/D CTF is set up: VPN topology, vulnerable-service rotation, scoring loop hardening.",
      "Wie ein ernsthaftes A/D-CTF aufgesetzt wird: VPN-Topologie, Service-Rotation, Härtung des Scoring-Loops."
    ),
    phases: ["methodology"]
  },

  // ─────────────────────────────────────────────────────────────
  // 02 — APPLICATION & IDENTITY SECURITY
  // ─────────────────────────────────────────────────────────────
  {
    id: "common-web-vulnerabilities",
    domain: "application-identity", tier: 1,
    title: T("Common Web Vulnerabilities", "Gängige Web-Schwachstellen"),
    blurb: T(
      "The canonical vulnerability catalog: every class with at least one concrete proof-pattern. The single most-cited entry in the index.",
      "Der kanonische Schwachstellenkatalog: jede Klasse mit mindestens einem konkreten Proof-Muster. Der meistreferenzierte Eintrag im Index."
    ),
    phases: ["xss", "sqli", "csrf", "cmd-injection", "ssrf", "deserialization", "upload", "idor", "xxe"]
  },
  {
    id: "web-attack-and-defense-techniques",
    domain: "application-identity", tier: 1,
    title: T("Web Attack & Defense Techniques", "Web — Angriffs- & Verteidigungstechniken"),
    blurb: T(
      "Each vulnerability class presented as an attack/defense pair, so the testing checklist and the hardening checklist stay in sync.",
      "Jede Schwachstellenklasse als Angriffs/Verteidigungs-Paar — Testing-Checkliste und Hardening-Checkliste bleiben synchron."
    ),
    phases: ["xss", "sqli", "csrf", "cmd-injection", "ssrf", "upload", "idor"]
  },
  {
    id: "web-security-overview",
    domain: "application-identity", tier: 1,
    title: T("Web Security Overview", "Web Security — Überblick"),
    blurb: T(
      "A briefing-level summary of the web attack surface, suitable to onboard a new platform engineer in an afternoon.",
      "Briefing-Zusammenfassung der Web-Angriffsfläche, mit der man einen neuen Plattform-Engineer an einem Nachmittag onboardet."
    ),
    phases: ["xss", "sqli", "csrf", "ssrf"]
  },
  {
    id: "xss-mindmap",
    domain: "application-identity", tier: 1,
    title: T("XSS — Attack Mindmap", "XSS — Angriffs-Mindmap"),
    blurb: T(
      "The full XSS taxonomy: reflected, stored, DOM-based, mutation. Bypass strategies for CSP, WAF, filter and encoding layers.",
      "Vollständige XSS-Taxonomie: reflected, stored, DOM-based, mutation. Bypass-Strategien für CSP, WAF, Filter und Encoding-Layer."
    ),
    phases: ["xss", "dom-xss"]
  },
  {
    id: "xss-exploitation-architecture",
    domain: "application-identity", tier: 1,
    title: T("XSS — Exploitation Architecture", "XSS — Exploitation-Architektur"),
    blurb: T(
      "Beyond cookie theft: hook-and-control patterns, persistent C2 over WebSocket, browser-as-a-pivot tradeoffs.",
      "Jenseits von Cookie-Diebstahl: Hook-and-Control-Muster, persistentes C2 via WebSocket, Trade-offs beim Browser-als-Pivot."
    ),
    phases: ["xss"]
  },
  {
    id: "xss-self-propagating",
    domain: "application-identity", tier: 1,
    title: T("Self-Propagating XSS Payloads", "Selbstverbreitende XSS-Payloads"),
    blurb: T(
      "Conditions under which an XSS payload becomes worm-like. Reproductions are intentionally kept defensive.",
      "Bedingungen, unter denen ein XSS-Payload wurmartig wird. Reproduktionen bewusst defensiv gehalten."
    ),
    phases: ["xss"]
  },
  {
    id: "ssrf-mindmap",
    domain: "application-identity", tier: 1,
    title: T("SSRF — Attack Mindmap", "SSRF — Angriffs-Mindmap"),
    blurb: T(
      "Server-side request forgery surface: vector enumeration, internal-service discovery, blind-SSRF exfiltration, gopher/file/ftp payload chains.",
      "Server-side Request Forgery: Vektor-Enumeration, interne Service-Discovery, Blind-SSRF-Exfiltration, gopher/file/ftp-Payload-Ketten."
    ),
    phases: ["ssrf"]
  },
  {
    id: "xml-security-overview",
    domain: "application-identity", tier: 1,
    title: T("XML Security — XXE & Path Traversal", "XML-Sicherheit — XXE & Path Traversal"),
    blurb: T(
      "DTD weaponization, out-of-band exfil, parser-quirk routing, and the path-traversal cousins that share parser surface.",
      "DTD-Waffenbau, Out-of-Band-Exfiltration, Parser-Quirk-Routing und die Path-Traversal-Verwandten mit gemeinsamer Parser-Fläche."
    ),
    phases: ["xxe"]
  },
  {
    id: "password-recovery-logic-flaws",
    domain: "application-identity", tier: 1,
    title: T("Password Recovery — Logic Flaws", "Password Recovery — Logikfehler"),
    blurb: T(
      "Where credential-recovery flows go wrong: predictable tokens, response-leak telltales, second-factor downgrade.",
      "Wo Credential-Recovery-Flows scheitern: vorhersagbare Tokens, Response-Leak-Tells, Second-Factor-Downgrade."
    ),
    phases: ["biz-logic", "session"]
  },
  {
    id: "web-architecture-security-issues",
    domain: "application-identity", tier: 1,
    title: T("Web Architecture — Security Issues", "Web-Architektur — Sicherheitsprobleme"),
    blurb: T(
      "Cross-origin policy mistakes, JWT misuse, TLS-config rot, and the modern API-surface pitfalls that don't fit OWASP buckets.",
      "Cross-Origin-Fehler, JWT-Missbrauch, TLS-Config-Rost und moderne API-Fallstricke, die nicht in OWASP-Buckets passen."
    ),
    phases: ["cors-tls-jwt", "api"]
  },
  {
    id: "security-vulnerabilities-summary",
    domain: "application-identity", tier: 1,
    title: T("Vulnerability Classes — Summary", "Schwachstellenklassen — Zusammenfassung"),
    blurb: T(
      "A one-glance summary card mapping each vulnerability class to its trigger pattern and detection signal.",
      "Eine Übersicht auf einen Blick: jede Schwachstellenklasse mit ihrem Auslösemuster und Detektionssignal."
    ),
    phases: ["xss", "sqli", "csrf", "ssrf", "idor"]
  },
  {
    id: "web-security-technical-points",
    domain: "application-identity", tier: 1,
    title: T("Web Security — Technical Reference Points", "Web Security — technische Referenzpunkte"),
    blurb: T(
      "The specific protocol/header/encoding points where weaknesses recur. Cite-able list for review checklists.",
      "Die konkreten Protokoll-/Header-/Encoding-Punkte, an denen Schwächen wiederkehren. Zitierbare Liste für Review-Checklisten."
    ),
    phases: ["xss", "sqli", "idor"]
  },
  {
    id: "xss-mindmap-alt",
    domain: "application-identity", tier: 1,
    title: T("XSS Mindmap — Alternate Reference", "XSS Mindmap — alternative Referenz"),
    blurb: T(
      "Second take on the XSS landscape, structured by sink rather than source. Useful when grepping a code review.",
      "Zweite Sicht auf das XSS-Feld, strukturiert nach Sink statt Source. Nützlich beim Grep durch ein Code-Review."
    ),
    phases: ["xss"]
  },
  {
    id: "web-app-security-practitioner",
    domain: "application-identity", tier: 1,
    title: T("Web Application Security — Practitioner Reference", "Web Application Security — Praxis-Referenz"),
    blurb: T(
      "A working pentester's running reference, with the corner cases that don't make it into book-length texts.",
      "Laufende Referenz eines aktiven Pentesters, mit den Sonderfällen, die nicht in Lehrbüchern auftauchen."
    ),
    phases: ["xss", "sqli", "csrf", "idor", "biz-logic"]
  },

  // 02 reference (Tier 2)
  {
    id: "javaweb-app-security",
    domain: "application-identity", tier: 2,
    title: T("Java Web Application Security", "Java Web Application Security"),
    blurb: T(
      "Stack-specific notes for Java: deserialization gadgets, expression-language injection, framework-default risks.",
      "Stack-spezifische Notizen für Java: Deserialisierungs-Gadgets, Expression-Language-Injection, Framework-Default-Risiken."
    ),
    phases: ["deserialization", "upload"]
  },
  {
    id: "javaweb-introduction",
    domain: "application-identity", tier: 2,
    title: T("Java Web — Introduction", "Java Web — Einführung"),
    blurb: T(
      "Onboarding context for testers without Java background: build, deploy, request lifecycle, where vulnerabilities tend to live.",
      "Onboarding-Kontext für Tester ohne Java-Hintergrund: Build, Deployment, Request-Lifecycle, typische Schwachstellen-Habitate."
    ),
    phases: ["methodology"]
  },
  {
    id: "php-source-audit",
    domain: "application-identity", tier: 2,
    title: T("PHP — Source Code Audit", "PHP — Source-Code-Audit"),
    blurb: T(
      "Source-driven PHP audit recipes: tainted-input flow, eval/include sinks, the perennial unserialize trap.",
      "Source-getriebene PHP-Audit-Rezepte: Tainted-Input-Flow, eval/include-Sinks, die ewige unserialize-Falle."
    ),
    phases: ["sqli", "upload", "xxe", "deserialization", "cmd-injection", "idor", "xss", "csrf"]
  },
  {
    id: "php-code-audit",
    domain: "application-identity", tier: 2,
    title: T("PHP — Code Audit Mindmap", "PHP — Code-Audit-Mindmap"),
    blurb: T(
      "Companion to the source audit: structural tree from entry-point to sink, organized by vulnerability class.",
      "Begleiter zum Source-Audit: strukturelle Baumsicht vom Entry-Point bis zum Sink, geordnet nach Schwachstellenklasse."
    ),
    phases: ["sqli", "upload", "xxe", "cmd-injection", "xss", "csrf", "idor", "biz-logic"]
  },
  {
    id: "sqlmap-mindmap",
    domain: "application-identity", tier: 2,
    title: T("SQLmap — Operator Reference", "SQLmap — Operator-Referenz"),
    blurb: T(
      "Flag combinations for production-safe SQL injection extraction, tamper-script picking, WAF-evasion settings.",
      "Flag-Kombinationen für produktionssichere SQL-Injection-Extraktion, Tamper-Script-Auswahl, WAF-Evasion."
    ),
    phases: ["sqli", "auth", "cmd-injection", "upload"]
  },
  {
    id: "website-intrusion-diagram",
    domain: "application-identity", tier: 2,
    title: T("Website Intrusion — Decision Diagram", "Website Intrusion — Entscheidungsdiagramm"),
    blurb: T(
      "Tree of next-step decisions during a web compromise, from first 200 OK to authenticated context.",
      "Entscheidungsbaum für den nächsten Schritt während eines Web-Kompromisses, vom ersten 200 OK bis zum authentifizierten Kontext."
    ),
    phases: ["recon", "auth", "sqli", "upload", "biz-logic"]
  },
  {
    id: "owasp-testing-cheatsheet",
    domain: "application-identity", tier: 2,
    title: T("OWASP Testing Checklist — Cheat Sheet", "OWASP Testing Checklist — Cheat Sheet"),
    blurb: T(
      "Compressed pre-flight checklist aligned to the OWASP Testing Guide categories. One-pager, ready to attach to engagement notes.",
      "Komprimierte Pre-Flight-Checkliste nach den OWASP-Testing-Guide-Kategorien. Einseiter, anhängbar an Engagement-Notizen."
    ),
    phases: ["recon", "sqli", "xss", "csrf", "auth", "biz-logic", "idor", "report", "cves"]
  },
  {
    id: "business-logic-top10",
    domain: "application-identity", tier: 2,
    title: T("Business Logic Flaws — Working Top 10", "Business-Logic-Fehler — Arbeits-Top-10"),
    blurb: T(
      "The ten business-logic patterns we see most often in production engagements, with the typical detection path.",
      "Die zehn Business-Logic-Muster, die wir in Produktions-Engagements am häufigsten sehen, mit typischem Detektionspfad."
    ),
    phases: ["biz-logic"]
  },
  {
    id: "intrusion-behavior-analysis",
    domain: "application-identity", tier: 2,
    title: T("Intrusion Behavior — Analysis Reference", "Intrusion-Behavior — Analyse-Referenz"),
    blurb: T(
      "What a real intrusion looks like in logs vs. what test traffic looks like. Useful for tuning blue-team detection.",
      "Wie eine echte Intrusion in Logs aussieht vs. wie Test-Traffic aussieht. Nützlich zum Tuning der Blue-Team-Detektion."
    ),
    phases: ["recon", "fingerprint", "auth", "idor", "biz-logic"]
  },

  // 02 background (Tier 3)
  {
    id: "android-security-overview",
    domain: "application-identity", tier: 3,
    title: T("Android Security — Overview", "Android Security — Überblick"),
    blurb: T(
      "Permission model, intent surface, and where Android applications most frequently fail review.",
      "Permission-Modell, Intent-Oberfläche und wo Android-Apps am häufigsten Reviews nicht bestehen."
    ),
    phases: []
  },
  {
    id: "android-security-skills",
    domain: "application-identity", tier: 3,
    title: T("Android Security Engineer — Skill Reference", "Android Security Engineer — Skill-Referenz"),
    blurb: T(
      "Competency map for testers focused on Android. Useful for hiring rubrics.",
      "Kompetenzkarte für Tester mit Android-Fokus. Nützlich für Hiring-Rubriken."
    ),
    phases: []
  },
  {
    id: "android-forensics",
    domain: "application-identity", tier: 3,
    title: T("Android Forensics", "Android Forensics"),
    blurb: T(
      "Acquisition options on Android, from logical pull to chip-off, with what each leaves on the device.",
      "Akquisitionsoptionen auf Android, von Logical Pull bis Chip-Off, mit den jeweiligen Spuren auf dem Gerät."
    ),
    phases: []
  },
  {
    id: "apk-attack-defense",
    domain: "application-identity", tier: 3,
    title: T("APK Attack & Defense", "APK — Angriff & Verteidigung"),
    blurb: T(
      "Static and dynamic APK attack patterns paired with the corresponding obfuscation and integrity-check defenses.",
      "Statische und dynamische APK-Angriffsmuster, gepaart mit Obfuskations- und Integritätsprüfungs-Verteidigungen."
    ),
    phases: []
  },
  {
    id: "ios-security-skills",
    domain: "application-identity", tier: 3,
    title: T("iOS Security Engineer — Skill Reference", "iOS Security Engineer — Skill-Referenz"),
    blurb: T(
      "Competency map for iOS-focused testers: entitlement reasoning, sandbox, runtime instrumentation.",
      "Kompetenzkarte für iOS-fokussierte Tester: Entitlement-Reasoning, Sandbox, Runtime-Instrumentation."
    ),
    phases: []
  },
  {
    id: "ios-app-audit-system",
    domain: "application-identity", tier: 3,
    title: T("iOS Application Audit System", "iOS Application Audit System"),
    blurb: T(
      "A system view of iOS audits: pipeline, automation gate, the manual steps that don't yield to automation.",
      "Systemsicht auf iOS-Audits: Pipeline, Automation-Gate, manuelle Schritte, die sich nicht automatisieren lassen."
    ),
    phases: []
  },
  {
    id: "macos-security-skills",
    domain: "application-identity", tier: 3,
    title: T("macOS Security Engineer — Skill Reference", "macOS Security Engineer — Skill-Referenz"),
    blurb: T(
      "Competency map for macOS-focused testers: TCC, codesign, persistence locations, EndpointSecurity framework.",
      "Kompetenzkarte für macOS-fokussierte Tester: TCC, codesign, Persistenz-Orte, EndpointSecurity-Framework."
    ),
    phases: []
  },
  {
    id: "mobile-vuln-detection-platform",
    domain: "application-identity", tier: 3,
    title: T("Mobile App Vulnerability Detection — Platform", "Mobile-App-Schwachstellen-Detektion — Plattform"),
    blurb: T(
      "Reference architecture for an in-house mobile vulnerability detection platform.",
      "Referenzarchitektur für eine eigene Mobile-Schwachstellen-Detektionsplattform."
    ),
    phases: []
  },
  {
    id: "mobile-malware-history",
    domain: "application-identity", tier: 3,
    title: T("Mobile Malware — Historical Reference", "Mobile Malware — historische Referenz"),
    blurb: T(
      "Long-arc view of Android and Windows mobile-era malware families. Useful for archival research.",
      "Langzeit-Sicht auf Malware-Familien aus der Android- und Windows-Mobile-Ära. Nützlich für Archivrecherche."
    ),
    phases: []
  },

  // ─────────────────────────────────────────────────────────────
  // 03 — CLOUD & MODERN INFRASTRUCTURE
  // ─────────────────────────────────────────────────────────────
  {
    id: "aws-security-reference",
    domain: "cloud-infrastructure", tier: 2,
    title: T("AWS Security Reference", "AWS Security — Referenz"),
    blurb: T(
      "IAM modeling, cross-account boundaries, and the highest-leverage misconfigurations to look for first on AWS.",
      "IAM-Modellierung, Cross-Account-Grenzen und die Fehlkonfigurationen mit dem höchsten Hebel, die man auf AWS zuerst sucht."
    ),
    phases: ["recon", "cves", "report"]
  },
  {
    id: "cloud-security-reference",
    domain: "cloud-infrastructure", tier: 2,
    title: T("Cloud Security — Generalist Reference", "Cloud Security — Generalisten-Referenz"),
    blurb: T(
      "Cross-provider security concepts: identity, network, data, control plane vs. data plane.",
      "Provider-übergreifende Sicherheitskonzepte: Identity, Netzwerk, Daten, Control-Plane vs. Data-Plane."
    ),
    phases: ["recon", "fingerprint", "cves"]
  },
  {
    id: "enterprise-security-architecture",
    domain: "cloud-infrastructure", tier: 2,
    title: T("Enterprise Security Architecture", "Enterprise Security Architecture"),
    blurb: T(
      "Reference architecture patterns for security at enterprise scale, with the typical failure modes per pattern.",
      "Referenzarchitektur-Muster für Sicherheit im Unternehmensmaßstab, mit den typischen Fehlermodi pro Muster."
    ),
    phases: ["recon", "report"]
  },
  {
    id: "thoughtworks-radar-reference",
    domain: "cloud-infrastructure", tier: 3,
    title: T("Technology Radar — Reference Notes", "Technology Radar — Referenznotizen"),
    blurb: T(
      "Cross-industry view of which platform and tooling choices the field is moving toward or away from.",
      "Branchenübergreifende Sicht, wohin sich Plattform- und Tool-Entscheidungen bewegen."
    ),
    phases: []
  },
  {
    id: "python-for-security",
    domain: "cloud-infrastructure", tier: 3,
    title: T("Python for Security Work", "Python für Sicherheits-Arbeit"),
    blurb: T(
      "Python idioms specific to security automation: subprocess discipline, robust HTTP, async scanners.",
      "Python-Idiome speziell für Security-Automation: Subprocess-Disziplin, robuste HTTP-Aufrufe, Async-Scanner."
    ),
    phases: []
  },
  {
    id: "python-regex-reference",
    domain: "cloud-infrastructure", tier: 3,
    title: T("Python Regex — Reference", "Python Regex — Referenz"),
    blurb: T(
      "Regex patterns that recur in log triage and payload extraction. Catastrophic-backtracking notes included.",
      "Regex-Muster, die in Log-Triage und Payload-Extraktion wiederkehren. Inklusive Hinweise zu katastrophalem Backtracking."
    ),
    phases: []
  },

  // ─────────────────────────────────────────────────────────────
  // 04 — OT & EMBEDDED
  // ─────────────────────────────────────────────────────────────
  {
    id: "ics-convergence-with-iot",
    domain: "ot-embedded", tier: 3,
    title: T("ICS — Convergence with IoT", "ICS — Konvergenz mit IoT"),
    blurb: T(
      "Where industrial control systems and IoT surface meet, and where their threat models diverge.",
      "Wo sich Industrial Control Systems und IoT-Flächen treffen, und wo ihre Bedrohungsmodelle auseinanderlaufen."
    ),
    phases: ["recon", "cves"]
  },
  {
    id: "iot-security-reference",
    domain: "ot-embedded", tier: 3,
    title: T("IoT Security — Reference", "IoT-Sicherheit — Referenz"),
    blurb: T(
      "CSA-aligned IoT security reference: device, edge, network, cloud, lifecycle.",
      "CSA-orientierte IoT-Sicherheitsreferenz: Device, Edge, Netzwerk, Cloud, Lifecycle."
    ),
    phases: ["recon", "report", "cves"]
  },
  {
    id: "automotive-security",
    domain: "ot-embedded", tier: 3,
    title: T("Automotive Security — Reference", "Automotive Security — Referenz"),
    blurb: T(
      "Vehicle attack surface map: in-cabin networks, telematics gateway, software-update channel, supplier dependency graph.",
      "Angriffsfläche eines Fahrzeugs: In-Cabin-Netze, Telematik-Gateway, Software-Update-Kanal, Lieferanten-Abhängigkeitsgraph."
    ),
    phases: ["report"]
  },
  {
    id: "wifi-attack-mindmap",
    domain: "ot-embedded", tier: 2,
    title: T("Wi-Fi Attack Mindmap", "Wi-Fi — Angriffs-Mindmap"),
    blurb: T(
      "Wireless attack surface across WPA2/WPA3 and enterprise EAP variants, with the practical detection telltales.",
      "Wireless-Angriffsfläche über WPA2/WPA3 und Enterprise-EAP-Varianten, mit praxisrelevanten Detektionsmerkmalen."
    ),
    phases: ["recon"]
  },

  // ─────────────────────────────────────────────────────────────
  // 05 — THREAT INTELLIGENCE & ADVERSARY MODELING
  // ─────────────────────────────────────────────────────────────
  {
    id: "osint-mindmap",
    domain: "threat-intelligence", tier: 1,
    title: T("OSINT Mindmap", "OSINT-Mindmap"),
    blurb: T(
      "Open-source intelligence routes by entity type: people, organizations, infrastructure, code, leaks. The recon companion to engagement scoping.",
      "OSINT-Wege nach Entity-Typ: Personen, Organisationen, Infrastruktur, Code, Leaks. Recon-Begleiter zum Engagement-Scoping."
    ),
    phases: ["recon"]
  },
  {
    id: "diamond-threat-model",
    domain: "threat-intelligence", tier: 3,
    title: T("Diamond Threat Model", "Diamond Threat Model"),
    blurb: T(
      "The four-vertex Diamond model (adversary, capability, infrastructure, victim) as a structured note-taking template.",
      "Das Vier-Knoten-Diamond-Modell (Adversary, Capability, Infrastructure, Victim) als strukturiertes Notiz-Template."
    ),
    phases: []
  },
  {
    id: "threat-modeling-reference",
    domain: "threat-intelligence", tier: 3,
    title: T("Threat Modeling — Reference", "Threat Modeling — Referenz"),
    blurb: T(
      "Working notes across STRIDE, LINDDUN, and attack-tree approaches, with the slot where each is the right tool.",
      "Arbeitsnotizen zu STRIDE, LINDDUN und Attack-Tree-Ansätzen, mit dem Slot, an dem jeder Ansatz das richtige Werkzeug ist."
    ),
    phases: ["recon", "cves"]
  },
  {
    id: "threat-intelligence-analysis",
    domain: "threat-intelligence", tier: 3,
    title: T("Threat Intelligence — Analysis", "Threat Intelligence — Analyse"),
    blurb: T(
      "Source rating, cross-corroboration, and how to keep a threat-intel report honest about confidence.",
      "Quellenbewertung, Cross-Corroboration und wie ein Threat-Intel-Report bei seiner Konfidenz ehrlich bleibt."
    ),
    phases: ["recon"]
  },
  {
    id: "attack-path-reference",
    domain: "threat-intelligence", tier: 3,
    title: T("Attack Path — Reference", "Attack Path — Referenz"),
    blurb: T(
      "How adversaries traverse from initial access to objective. Used to validate that engagement scopes actually cover what matters.",
      "Wie Adversaries vom Initial Access zum Ziel kommen. Hilft zu prüfen, ob Engagement-Scopes wirklich das Wesentliche abdecken."
    ),
    phases: ["recon"]
  },
  {
    id: "email-threat-workflow",
    domain: "threat-intelligence", tier: 3,
    title: T("Email Threat — Workflow", "E-Mail-Bedrohung — Workflow"),
    blurb: T(
      "Triage workflow for a suspicious email: header reasoning, attachment detonation, URL pivot, victim-impact assessment.",
      "Triage-Workflow für eine verdächtige E-Mail: Header-Analyse, Anhang-Detonation, URL-Pivot, Opfer-Impact-Bewertung."
    ),
    phases: ["recon"]
  },
  {
    id: "fraud-forensics",
    domain: "threat-intelligence", tier: 3,
    title: T("Fraud Forensics — Mindmap", "Fraud Forensics — Mindmap"),
    blurb: T(
      "Investigative routes for transaction fraud across account, device, and payment dimensions.",
      "Investigative Routen für Transaktionsbetrug entlang Konto-, Geräte- und Zahlungsdimension."
    ),
    phases: []
  },
  {
    id: "apt-attack-defense-guide",
    domain: "threat-intelligence", tier: 3,
    title: T("APT Attack & Defense — Guide", "APT — Angriff & Verteidigung"),
    blurb: T(
      "Long-form companion: how a sustained adversary operates, with the defensive control points that interrupt the chain.",
      "Langform-Begleiter: Wie ein anhaltender Adversary operiert, mit den Kontrollpunkten, die die Kette unterbrechen."
    ),
    phases: []
  },
  {
    id: "apt-attacks-overview",
    domain: "threat-intelligence", tier: 3,
    title: T("APT Attacks — Overview", "APT-Angriffe — Überblick"),
    blurb: T(
      "Briefing-level view of APT activity patterns, suitable as a leadership read-along.",
      "Briefing-Sicht auf APT-Aktivitätsmuster, geeignet als Leitungs-Lektüre."
    ),
    phases: []
  },
  {
    id: "apt-deep-analysis",
    domain: "threat-intelligence", tier: 3,
    title: T("APT — Deep Analysis", "APT — Tiefenanalyse"),
    blurb: T(
      "Tooling, TTPs, and infrastructure overlap analysis used to attribute long-running activity.",
      "Tooling-, TTP- und Infrastruktur-Überlapp-Analyse zur Attribution lang laufender Aktivität."
    ),
    phases: []
  },
  {
    id: "apt-penetration",
    domain: "threat-intelligence", tier: 3,
    title: T("APT — Penetration Phase Notes", "APT — Notizen zur Penetration-Phase"),
    blurb: T(
      "Initial-access patterns characteristic of sustained adversaries, contrasted with opportunistic intrusions.",
      "Initial-Access-Muster nachhaltiger Adversaries im Kontrast zu opportunistischen Intrusionen."
    ),
    phases: []
  },
  {
    id: "windows-persistence",
    domain: "threat-intelligence", tier: 3,
    title: T("Windows Persistence — Techniques", "Windows Persistence — Techniken"),
    blurb: T(
      "Persistence locations a defender should sweep first, ranked by adversary preference in observed activity.",
      "Persistenz-Orte, die ein Defender zuerst durchsucht — gerankt nach Adversary-Präferenz in beobachteter Aktivität."
    ),
    phases: []
  },
  {
    id: "apt-discovery-impact",
    domain: "threat-intelligence", tier: 3,
    title: T("APT — Discovery & Impact Assessment", "APT — Discovery & Impact Assessment"),
    blurb: T(
      "Once a long-running adversary is suspected, how to scope the investigation and assess business impact.",
      "Wenn ein nachhaltiger Adversary vermutet wird: wie die Untersuchung scoped und der Business-Impact bewertet wird."
    ),
    phases: []
  },
  {
    id: "cyberattack-prevention-map",
    domain: "threat-intelligence", tier: 3,
    title: T("Cyberattack Prevention — Map", "Cyberangriff-Prävention — Karte"),
    blurb: T(
      "Preventive-control map across the attack lifecycle. Useful when justifying control investments.",
      "Karte präventiver Controls über den Angriffslebenszyklus. Hilfreich beim Begründen von Control-Investitionen."
    ),
    phases: []
  },
  {
    id: "cyberattack-defense-map",
    domain: "threat-intelligence", tier: 3,
    title: T("Cyberattack & Defense — Map", "Cyberangriff & Verteidigung — Karte"),
    blurb: T(
      "Companion to the prevention map: detective and responsive controls layered over the same lifecycle.",
      "Begleiter zur Präventions-Karte: detektive und reaktive Controls über demselben Lebenszyklus."
    ),
    phases: []
  },
  {
    id: "red-teaming-mindmap",
    domain: "threat-intelligence", tier: 3,
    title: T("Red Teaming — Mindmap", "Red Teaming — Mindmap"),
    blurb: T(
      "Adversary-emulation planning tree: objective, profile, infrastructure, evasion, deconfliction.",
      "Planungsbaum für Adversary Emulation: Ziel, Profil, Infrastruktur, Evasion, Deconfliction."
    ),
    phases: []
  },

  // ─────────────────────────────────────────────────────────────
  // 06 — REVERSE, BINARY & MALWARE
  // ─────────────────────────────────────────────────────────────
  {
    id: "browser-security-mindmap",
    domain: "reverse-malware", tier: 3,
    title: T("Browser Security — Mindmap", "Browser-Sicherheit — Mindmap"),
    blurb: T(
      "The modern browser as an attack surface: sandbox boundaries, IPC, renderer/process model, mitigation stack.",
      "Der moderne Browser als Angriffsfläche: Sandbox-Grenzen, IPC, Renderer/Process-Modell, Mitigation-Stack."
    ),
    phases: []
  },
  {
    id: "binary-vuln-primer",
    domain: "reverse-malware", tier: 3,
    title: T("Binary Vulnerability Analysis — Primer", "Binär-Schwachstellen-Analyse — Primer"),
    blurb: T(
      "Entry-level binary vulnerability reading: corruption classes, mitigations, the toolchain you actually need on day one.",
      "Einstiegslektüre zur Binär-Schwachstellen-Analyse: Korruptions-Klassen, Mitigations, die Toolchain für Tag 1."
    ),
    phases: []
  },
  {
    id: "reverse-cheatsheet",
    domain: "reverse-malware", tier: 3,
    title: T("Reverse Engineering — Cheat Sheet", "Reverse Engineering — Cheat Sheet"),
    blurb: T(
      "Quick-reference card across disassemblers, debuggers, and the typical signature patterns to look for first.",
      "Quick-Reference-Karte über Disassembler, Debugger und die typischen Signaturmuster, die zuerst zu prüfen sind."
    ),
    phases: []
  },
  {
    id: "vulnerability-exploit-fuzz-mitigation",
    domain: "reverse-malware", tier: 3,
    title: T("Vulnerability — Exploit, Fuzz, Mitigation", "Vulnerability — Exploit, Fuzz, Mitigation"),
    blurb: T(
      "End-to-end memory-corruption pipeline: from fuzzing crash to working exploit, with mitigation tradeoffs per stage.",
      "End-to-End-Pipeline zu Memory-Corruption: vom Fuzzing-Crash zum funktionierenden Exploit, mit Mitigations-Trade-offs pro Stufe."
    ),
    phases: []
  },
  {
    id: "arm-assembly-cheatsheet",
    domain: "reverse-malware", tier: 3,
    title: T("ARM Assembly — Cheat Sheet", "ARM Assembly — Cheat Sheet"),
    blurb: T(
      "Practical ARM assembly reference for analysts moving from x86 — calling conventions, instruction patterns, syscall surface.",
      "Praktische ARM-Assembly-Referenz für Analysten beim Übergang von x86 — Calling Conventions, Instruction-Muster, Syscall-Fläche."
    ),
    phases: []
  },
  {
    id: "windows-internals-offensive",
    domain: "reverse-malware", tier: 3,
    title: T("Windows Internals — Offensive Use", "Windows Internals — Offensive Nutzung"),
    blurb: T(
      "Internals notes selected for offensive relevance: object manager, token mechanics, kernel callbacks.",
      "Internals-Notizen mit offensiver Relevanz: Object Manager, Token-Mechanik, Kernel-Callbacks."
    ),
    phases: []
  },
  {
    id: "remote-access-trojans-study",
    domain: "reverse-malware", tier: 3,
    title: T("Remote Access Trojans — Study Reference", "Remote Access Trojans — Studienreferenz"),
    blurb: T(
      "Long-arc study reference on RAT family behaviors and how they have shifted across deployment generations.",
      "Langzeit-Studienreferenz zu RAT-Familien-Verhalten und wie es sich über Deployment-Generationen verschoben hat."
    ),
    phases: []
  },
  {
    id: "malicious-code-primer",
    domain: "reverse-malware", tier: 3,
    title: T("Malicious Code Analysis — Primer", "Malicious Code Analysis — Primer"),
    blurb: T(
      "Entry-level malware-analysis reading: triage, sandbox, static stripping, the first dynamic pass.",
      "Einstiegslektüre zur Malware-Analyse: Triage, Sandbox, statisches Stripping, erster dynamischer Pass."
    ),
    phases: []
  },
  {
    id: "malware-packers",
    domain: "reverse-malware", tier: 3,
    title: T("Malware Packers — Reference", "Malware-Packer — Referenz"),
    blurb: T(
      "Packing technique reference: detection signatures, unpacking patterns, the cases where a generic unpacker still earns its keep.",
      "Packing-Techniken-Referenz: Detektionssignaturen, Unpacking-Muster, Fälle in denen ein generischer Unpacker noch hilft."
    ),
    phases: []
  },
  {
    id: "exploit-behavior",
    domain: "reverse-malware", tier: 3,
    title: T("Exploit Behavior — Reference", "Exploit-Verhalten — Referenz"),
    blurb: T(
      "Behavioral profile of a successful exploit, separated from the payload it delivers.",
      "Verhaltensprofil eines erfolgreichen Exploits, getrennt vom Payload, den er liefert."
    ),
    phases: []
  },
  {
    id: "apt-group-analysis",
    domain: "reverse-malware", tier: 3,
    title: T("APT Group — Analysis Reference", "APT-Gruppe — Analyse-Referenz"),
    blurb: T(
      "Template for documenting a sustained adversary group: tooling, infrastructure, victimology, confidence.",
      "Template zur Dokumentation einer nachhaltigen Adversary-Gruppe: Tooling, Infrastruktur, Victimology, Konfidenz."
    ),
    phases: []
  },
  {
    id: "malicious-pdf",
    domain: "reverse-malware", tier: 3,
    title: T("Malicious PDF — Reference", "Malicious PDF — Referenz"),
    blurb: T(
      "PDF as a delivery vehicle: structure walk-through, script extraction, the parser quirks attackers rely on.",
      "PDF als Delivery-Vehikel: Strukturanalyse, Skript-Extraktion, die Parser-Quirks, auf die Angreifer setzen."
    ),
    phases: []
  },
  {
    id: "java-exploit",
    domain: "reverse-malware", tier: 3,
    title: T("Java Exploit — Reference", "Java Exploit — Referenz"),
    blurb: T(
      "Historical and current Java-runtime exploit patterns, with what each tells you about the deployed JRE.",
      "Historische und aktuelle Java-Runtime-Exploit-Muster — und was jeder über die deployte JRE verrät."
    ),
    phases: []
  },

  // ─────────────────────────────────────────────────────────────
  // 07 — AI, DATA & EMERGING RISK
  // ─────────────────────────────────────────────────────────────
  {
    id: "machine-learning-landscape",
    domain: "ai-emerging", tier: 3,
    title: T("Machine Learning — Landscape Map", "Machine Learning — Landschaftskarte"),
    blurb: T(
      "Vendor-neutral landscape: model families, training pipelines, deployment patterns. Useful as a security-team primer.",
      "Hersteller-neutrale Landschaft: Modell-Familien, Training-Pipelines, Deployment-Muster. Nützlich als Security-Team-Primer."
    ),
    phases: []
  },
  {
    id: "cyber-analytics-models",
    domain: "ai-emerging", tier: 3,
    title: T("Cyber Analytics — Models & Algorithms", "Cyber Analytics — Modelle & Algorithmen"),
    blurb: T(
      "What kinds of statistical/ML models fit which security-analytics problems, and where they reliably fail.",
      "Welche statistischen/ML-Modelle zu welchen Security-Analytics-Problemen passen — und wo sie zuverlässig scheitern."
    ),
    phases: ["cves"]
  },
  {
    id: "nlp-in-security",
    domain: "ai-emerging", tier: 3,
    title: T("NLP in Security — Reference", "NLP in Security — Referenz"),
    blurb: T(
      "Natural-language processing applied to security work: log clustering, phishing detection, report summarization.",
      "Natural Language Processing für Sicherheits-Arbeit: Log-Clustering, Phishing-Detektion, Report-Zusammenfassung."
    ),
    phases: []
  },
  {
    id: "blockchain-security-reference",
    domain: "ai-emerging", tier: 3,
    title: T("Blockchain Security — Reference", "Blockchain Security — Referenz"),
    blurb: T(
      "Smart-contract, bridge, and consensus-layer threat classes. Where the field's actual losses cluster.",
      "Bedrohungsklassen für Smart Contracts, Bridges und Konsens-Layer. Wo die tatsächlichen Verluste der Branche kumulieren."
    ),
    phases: []
  },
  {
    id: "cryptographic-hashing-reference",
    domain: "ai-emerging", tier: 3,
    title: T("Cryptographic Hashing — Reference", "Kryptografisches Hashing — Referenz"),
    blurb: T(
      "Practitioner-level hashing reference: when collision resistance matters, when length-extension bites, and what to pick today.",
      "Praxisnahe Hashing-Referenz: wann Kollisionsresistenz zählt, wann Length-Extension schadet, und was heute zu wählen ist."
    ),
    phases: []
  },

  // ─────────────────────────────────────────────────────────────
  // 08 — DEFENSIVE OPERATIONS & GOVERNANCE
  // ─────────────────────────────────────────────────────────────
  {
    id: "siem-architecture",
    domain: "defensive-ops", tier: 2,
    title: T("SIEM Architecture — Mindmap", "SIEM-Architektur — Mindmap"),
    blurb: T(
      "Reference architecture for a working SIEM: ingestion, normalization, detection layer, response loop.",
      "Referenzarchitektur eines funktionierenden SIEM: Ingestion, Normalisierung, Detektions-Layer, Response-Loop."
    ),
    phases: ["report", "recon"]
  },
  {
    id: "ssl-tls-threat-model",
    domain: "defensive-ops", tier: 2,
    title: T("SSL/TLS Threat Model", "SSL/TLS-Bedrohungsmodell"),
    blurb: T(
      "TLS attack surface organized by ceremony stage: handshake, certificate path, cipher choice, record layer.",
      "TLS-Angriffsfläche nach Ceremony-Stufe: Handshake, Zertifikatspfad, Cipher-Auswahl, Record-Layer."
    ),
    phases: []
  },
  {
    id: "ddos-defense-reference",
    domain: "defensive-ops", tier: 2,
    title: T("DDoS Defense — Reference", "DDoS-Abwehr — Referenz"),
    blurb: T(
      "DDoS attack-class taxonomy with the corresponding mitigation layers — anycast, scrubbing, app-layer rate logic.",
      "DDoS-Angriffsklassen-Taxonomie mit den passenden Mitigation-Layern — Anycast, Scrubbing, App-Layer-Rate-Logik."
    ),
    phases: []
  },
  {
    id: "linux-ops-security",
    domain: "defensive-ops", tier: 2,
    title: T("Linux Operations Security", "Linux Operations Security"),
    blurb: T(
      "Operator-facing Linux hardening notes: account hygiene, package supply chain, kernel surface tightening.",
      "Operator-orientierte Linux-Härtung: Account-Hygiene, Package-Supply-Chain, Verschärfung der Kernel-Oberfläche."
    ),
    phases: ["report"]
  },
  {
    id: "tcp-ip-operational",
    domain: "defensive-ops", tier: 2,
    title: T("TCP/IP — Operational Notes", "TCP/IP — Operative Notizen"),
    blurb: T(
      "Operator-level TCP/IP reference for detection engineers: handshake telltales, fragmentation behavior, the protocol details that matter at scale.",
      "Operator-Level-TCP/IP-Referenz für Detection-Engineers: Handshake-Merkmale, Fragmentierungs-Verhalten, die Protokoll-Details, die im Maßstab zählen."
    ),
    phases: ["report"]
  },
  {
    id: "compliance-control-framework",
    domain: "defensive-ops", tier: 3,
    title: T("Compliance — Control-Framework Reference", "Compliance — Control-Framework-Referenz"),
    blurb: T(
      "Cross-walk between common control frameworks, with the place where they speak past each other.",
      "Cross-Walk zwischen gängigen Control-Frameworks, mit den Stellen, an denen sie aneinander vorbeireden."
    ),
    phases: ["report"]
  },
  {
    id: "risk-control-system",
    domain: "defensive-ops", tier: 3,
    title: T("Risk Control — System Architecture", "Risk Control — Systemarchitektur"),
    blurb: T(
      "Reference architecture for an in-house risk-control platform: signal ingest, rule layer, decision loop, audit trail.",
      "Referenzarchitektur einer eigenen Risk-Control-Plattform: Signal-Ingest, Regel-Layer, Decision-Loop, Audit-Trail."
    ),
    phases: []
  },
  {
    id: "infosec-landscape",
    domain: "defensive-ops", tier: 3,
    title: T("Information Security — Landscape Reference", "Informationssicherheit — Landschaftsreferenz"),
    blurb: T(
      "Field-level orientation map: how the discipline is sub-divided, where each sub-discipline meets the next.",
      "Feldebenen-Orientierungskarte: wie die Disziplin unterteilt ist, wo die Subdisziplinen aufeinandertreffen."
    ),
    phases: []
  },
  {
    id: "ad-domain-penetration",
    domain: "defensive-ops", tier: 3,
    title: T("Active Directory — Domain Penetration", "Active Directory — Domain-Penetration"),
    blurb: T(
      "Companion to the AD pentest reference, viewed from the defender's perspective: which controls catch each attack step.",
      "Begleiter zur AD-Pentest-Referenz aus Defender-Sicht: welche Controls welchen Angriffsschritt fangen."
    ),
    phases: []
  },
  {
    id: "data-center-host-security",
    domain: "defensive-ops", tier: 3,
    title: T("Data Center Host Security", "Data-Center-Host-Sicherheit"),
    blurb: T(
      "Hardening reference for hosts running in colocated data-center environments, where vendor patches and physical access intersect.",
      "Härtungsreferenz für Hosts in Colocation-Rechenzentren — wo Hersteller-Patches und physischer Zugriff aufeinandertreffen."
    ),
    phases: []
  },
  {
    id: "external-web-security",
    domain: "defensive-ops", tier: 3,
    title: T("External-Facing Web Security", "External-Facing Web Security"),
    blurb: T(
      "What changes when the application sits at the very perimeter: discoverability, exposure budget, abuse-platform interactions.",
      "Was sich ändert, wenn die Anwendung direkt am Perimeter sitzt: Auffindbarkeit, Exposure-Budget, Abuse-Plattform-Interaktionen."
    ),
    phases: []
  },
  {
    id: "database-security-specialization",
    domain: "defensive-ops", tier: 3,
    title: T("Database Security — Specialization", "Database Security — Spezialisierung"),
    blurb: T(
      "Beyond SQL injection: replication topology, backup posture, role-engine quirks, encryption-at-rest tradeoffs.",
      "Über SQL Injection hinaus: Replikationstopologie, Backup-Haltung, Rollen-Engine-Quirks, Encryption-at-Rest-Trade-offs."
    ),
    phases: ["report", "cves"]
  },
  {
    id: "office-network-security",
    domain: "defensive-ops", tier: 3,
    title: T("Office Network Security", "Office-Netzwerk-Sicherheit"),
    blurb: T(
      "Real-world office network hardening: BYOD, printer/IoT noise, guest segmentation, the audit-trail you actually need.",
      "Realweltliche Office-Netzwerk-Härtung: BYOD, Drucker/IoT-Rauschen, Gast-Segmentierung, der Audit-Trail, den man wirklich braucht."
    ),
    phases: ["report"]
  }
];

// ── Derive page-ready shapes ────────────────────────────────────────

function statsFor(notes) {
  const tierOne = notes.filter((n) => n.tier === 1).length;
  const tierTwo = notes.filter((n) => n.tier === 2).length;
  const tierThree = notes.filter((n) => n.tier === 3).length;
  const phaseSet = new Set();
  for (const n of notes) for (const p of n.phases) phaseSet.add(p);
  return {
    total: notes.length,
    tierOne, tierTwo, tierThree,
    domainCount: DOMAINS.length,
    phaseCount: phaseSet.size
  };
}

function domainsWithNotes(notes) {
  return DOMAINS.map((d) => {
    const list = notes.filter((n) => n.domain === d.id);
    return {
      ...d,
      count: list.length,
      featured: list.filter((n) => n.tier === 1),
      reference: list.filter((n) => n.tier === 2),
      background: list.filter((n) => n.tier === 3)
    };
  });
}

module.exports = {
  domains: domainsWithNotes(NOTES),
  phases: PHASES,
  stats: statsFor(NOTES)
};

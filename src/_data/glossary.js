/**
 * VORNAC Glossary — bilingual definitions for the security, compliance,
 * and pentest vocabulary used across the site.
 *
 * Editorial line:
 *   - Each definition is one or two sentences. No marketing voice.
 *   - Acronyms expand once, in the same entry.
 *   - German entries are translations of substance, not literal word swaps.
 *   - Where a term lives in multiple worlds (technical AND regulatory),
 *     pick the lens that matters most for a VORNAC audience.
 *
 * Structure:
 *   CATEGORIES   the 8 buckets used in the filter + per-entry tag
 *   TERMS        the entries; rendered alphabetically by `term`
 *   exports a derived shape with stats + grouped-by-letter + grouped-by-category
 */

const CATEGORIES = [
  { id: "methodology",   label: { en: "Methodology",                de: "Methodik" } },
  { id: "engagement",    label: { en: "Engagement Type",            de: "Engagement-Typ" } },
  { id: "vuln-class",    label: { en: "Vulnerability Class",        de: "Schwachstellenklasse" } },
  { id: "attack",        label: { en: "Attack Technique",           de: "Angriffstechnik" } },
  { id: "identity",      label: { en: "Identity & Cryptography",    de: "Identität & Kryptografie" } },
  { id: "defense",       label: { en: "Defensive Operations",       de: "Defensive Operations" } },
  { id: "compliance",    label: { en: "Compliance & Regulation",    de: "Compliance & Regulatorik" } },
  { id: "cloud-ot",      label: { en: "Cloud, OT & Emerging",       de: "Cloud, OT & Emerging" } }
];

// Compact constructor — keeps the entry list readable.
// Optional `termLocale` overrides the displayed heading per locale
const T = (
  id, term, category, fullEn, fullDe, defEn, defDe, seeAlso = [], termLocale = null
) => ({
  id, term, category, termLocale,
  fullForm: fullEn || fullDe ? { en: fullEn, de: fullDe } : null,
  definition: { en: defEn, de: defDe },
  seeAlso
});

function displayTerm(entry, locale) {
  return (entry.termLocale && entry.termLocale[locale]) || entry.term;
}

const TERMS = [

  // ── Methodology ────────────────────────────────────────────────────
  T("ptes", "PTES", "methodology",
    "Penetration Testing Execution Standard",
    "Penetration Testing Execution Standard",
    "A practitioner-defined seven-phase pentest framework: pre-engagement, intelligence gathering, threat modeling, vulnerability analysis, exploitation, post-exploitation, reporting. The most widely-referenced methodological backbone for technical security testing.",
    "Ein praxisdefiniertes Sieben-Phasen-Pentest-Framework: Pre-Engagement, Intelligence Gathering, Threat Modeling, Vulnerability Analysis, Exploitation, Post-Exploitation, Reporting. Das am häufigsten referenzierte methodische Rückgrat technischer Sicherheitstests.",
    ["owasp", "mitre-attack"]
  ),
  T("owasp", "OWASP", "methodology",
    "Open Worldwide Application Security Project",
    "Open Worldwide Application Security Project",
    "A nonprofit foundation publishing freely available standards, guidance, and tooling for application security. Its outputs — Top 10, ASVS, Testing Guide, Cheat Sheets — are the de-facto reference set for web and API security work.",
    "Eine gemeinnützige Stiftung, die frei verfügbare Standards, Leitfäden und Tooling für Anwendungssicherheit veröffentlicht. Ihre Ergebnisse — Top 10, ASVS, Testing Guide, Cheat Sheets — sind die De-facto-Referenz für Web- und API-Sicherheitsarbeit.",
    ["owasp-top-10", "owasp-asvs"]
  ),
  T("owasp-top-10", "OWASP Top 10", "methodology", null, null,
    "A ten-item ranking of the most impactful web-application security risks, refreshed every three to four years. Used to brief stakeholders and to bound minimum scope on routine assessments.",
    "Ein zehnstufiges Ranking der wirkungsstärksten Web-Anwendungs-Sicherheitsrisiken, alle drei bis vier Jahre aktualisiert. Wird zur Stakeholder-Briefing-Zusammenfassung und als Mindest-Scope-Grenze in Routine-Assessments verwendet.",
    ["owasp", "owasp-asvs"]
  ),
  T("owasp-asvs", "OWASP ASVS", "methodology",
    "Application Security Verification Standard",
    "Application Security Verification Standard",
    "A three-level requirements catalog (L1 opportunistic, L2 standard, L3 advanced) for verifying application security controls. Used as the spec when an audit needs verifiable evidence per control.",
    "Ein dreistufiger Anforderungskatalog (L1 opportunistisch, L2 standard, L3 fortgeschritten) zur Verifikation von Anwendungssicherheits-Controls. Dient als Spezifikation, wenn ein Audit nachweisbare Evidenz pro Control verlangt.",
    ["owasp", "owasp-top-10"]
  ),
  T("owasp-testing-guide", "OWASP Testing Guide", "methodology", null, null,
    "A long-form manual that prescribes the test cases for every OWASP-recognized vulnerability class. The pre-flight checklist for web assessments.",
    "Ein umfangreiches Handbuch, das die Testfälle für jede OWASP-anerkannte Schwachstellenklasse vorschreibt. Die Pre-Flight-Checkliste für Web-Assessments.",
    ["owasp", "owasp-asvs"]
  ),
  T("mitre-attack", "MITRE ATT&CK", "methodology", null, null,
    "A community-curated knowledge base of real-world adversary tactics, techniques, and procedures (TTPs), indexed by platform and adversary group. The lingua franca for blue-team detection coverage and red-team scope.",
    "Eine community-kuratierte Wissensbasis realer Adversary-Tactics, -Techniques und -Procedures (TTPs), nach Plattform und Adversary-Gruppe indiziert. Die Lingua franca für Blue-Team-Detection-Abdeckung und Red-Team-Scope.",
    ["ttp", "cyber-kill-chain", "diamond-model"]
  ),
  T("cyber-kill-chain", "Cyber Kill Chain", "methodology", null, null,
    "A seven-step model of an intrusion (recon, weaponization, delivery, exploitation, installation, command-and-control, actions on objectives) introduced by Lockheed Martin in 2011. Useful for narrative reporting; less granular than ATT&CK.",
    "Ein Sieben-Schritt-Modell einer Intrusion (Recon, Weaponization, Delivery, Exploitation, Installation, Command-and-Control, Actions on Objectives), 2011 von Lockheed Martin eingeführt. Hilfreich für narrative Berichte; weniger granular als ATT&CK.",
    ["mitre-attack", "diamond-model"]
  ),
  T("diamond-model", "Diamond Model", "methodology", null, null,
    "A four-vertex analytical framework — adversary, capability, infrastructure, victim — for structured note-taking on a single intrusion event. Pairs naturally with ATT&CK for TTPs.",
    "Ein analytisches Vier-Knoten-Framework — Adversary, Capability, Infrastructure, Victim — für strukturierte Notizen zu einem einzelnen Intrusion-Event. Ergänzt sich natürlich mit ATT&CK für TTPs.",
    ["mitre-attack", "cyber-kill-chain"]
  ),
  T("stride", "STRIDE", "methodology", null, null,
    "A six-category threat-modeling mnemonic: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege. Microsoft-originated, still the most teachable starter framework.",
    "Eine Sechs-Kategorien-Threat-Modeling-Mnemonik: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. Ursprünglich von Microsoft, weiterhin das am besten lehrbare Einstiegs-Framework.",
    ["linddun", "threat-modeling"]
  ),
  T("linddun", "LINDDUN", "methodology", null, null,
    "A privacy-focused threat-modeling framework — Linkability, Identifiability, Non-repudiation, Detectability, Disclosure of information, Unawareness, Non-compliance. Used where GDPR-class data is in scope.",
    "Ein datenschutzfokussiertes Threat-Modeling-Framework — Linkability, Identifiability, Non-Repudiation, Detectability, Disclosure of Information, Unawareness, Non-Compliance. Wird verwendet, wo DSGVO-relevante Daten im Scope sind.",
    ["stride", "gdpr"]
  ),
  T("threat-modeling", "Threat Modeling", "methodology", null, null,
    "The structured exercise of enumerating likely threats against a system before they are realized. Outputs are control gaps and test priorities, not predictions.",
    "Die strukturierte Übung, plausible Bedrohungen gegen ein System zu enumerieren, bevor sie eintreten. Ergebnisse sind Control-Lücken und Test-Prioritäten — keine Vorhersagen.",
    ["stride", "linddun", "diamond-model"]
  ),
  T("tiber-eu", "TIBER-EU", "methodology",
    "Threat Intelligence-based Ethical Red Teaming — European framework",
    "Threat Intelligence-based Ethical Red Teaming — Europäisches Rahmenwerk",
    "An ECB-published framework for intelligence-led red-team tests against financial-sector entities, with national flavors (TIBER-DE, TIBER-NL, etc.). The implementation baseline for DORA's threat-led penetration testing requirement.",
    "Ein von der EZB veröffentlichtes Framework für intelligence-led Red-Team-Tests gegen Finanzsektor-Entitäten, mit nationalen Ausprägungen (TIBER-DE, TIBER-NL, etc.). Die Umsetzungsgrundlage für die Threat-Led-Penetration-Testing-Anforderung der DORA.",
    ["dora", "tlpt", "red-team"]
  ),
  T("nist-csf", "NIST CSF", "methodology",
    "NIST Cybersecurity Framework",
    "NIST Cybersecurity Framework",
    "A US National Institute of Standards and Technology framework organizing security around five functions: Identify, Protect, Detect, Respond, Recover (version 2.0 adds Govern). Widely cited internationally as a maturity scaffold.",
    "Ein Framework des US National Institute of Standards and Technology, das Sicherheit um fünf Funktionen organisiert: Identify, Protect, Detect, Respond, Recover (Version 2.0 ergänzt Govern). International als Reifegrad-Gerüst weit zitiert.",
    ["iso-27001", "bsi-grundschutz"]
  ),
  T("swiss-cheese-model", "Swiss Cheese Model", "methodology", null, null,
    "A human-factors model formulated by British psychologist James Reason, depicting layered protections as imperfect barriers where latent organizational weaknesses and active failures create gaps; incidents occur when those gaps align across layers. The reference framework in aviation, healthcare, and high-reliability safety culture — and increasingly in cybersecurity — for explaining why defense-in-depth lowers risk without removing it.",
    "Das Schweizer-Käse-Modell (James Reason) vergleicht geschichtete Defenses mit hintereinanderliegenden Käsescheiben — latente Bedingungen und aktive Fehler — und schreibt Schaden dem Moment zu, in dem sich die Löcher über die Schichten hinweg ausrichten. Die Standard-Metapher dafür, warum Defense-in-Depth Risiko reduziert, aber nicht eliminiert.",
    ["defense-in-depth", "nist-csf"],
    { de: "Schweizer-Käse-Modell" }
  ),

  // ── Engagement Type ────────────────────────────────────────────────
  T("pentest", "Penetration Test", "engagement", null, null,
    "An authorized, time-boxed simulation of an attack against a system or environment, intended to surface exploitable weaknesses and validate controls. The deliverable is a report of confirmed findings with reproduction steps.",
    "Ein autorisierter, zeitlich begrenzter Angriffstest gegen ein System oder Umfeld, der ausnutzbare Schwächen offenlegen und Controls validieren soll. Das Ergebnis ist ein Report mit bestätigten Befunden samt Reproduktionsschritten.",
    ["red-team", "tlpt", "black-box", "assumed-breach"]
  ),
  T("red-team", "Red Team", "engagement", null, null,
    "An offensive-security operation simulating a specific adversary against the full attack surface — people, processes, technology. Scope-light, objective-driven, often unannounced to defenders.",
    "Eine offensive Sicherheitsoperation, die einen spezifischen Adversary gegen die gesamte Angriffsfläche simuliert — Menschen, Prozesse, Technologie. Scope-leicht, zielgetrieben, oft den Verteidigern nicht angekündigt.",
    ["blue-team", "purple-team", "adversary-emulation", "tlpt"]
  ),
  T("blue-team", "Blue Team", "engagement", null, null,
    "The defensive counterpart to red — the people, tooling, and detections that protect, monitor, and respond. In an exercise context, the team being tested.",
    "Das defensive Gegenstück zum Red Team — die Personen, das Tooling und die Detektionen, die schützen, überwachen und reagieren. Im Übungskontext: das getestete Team.",
    ["red-team", "purple-team", "soc"]
  ),
  T("purple-team", "Purple Team", "engagement", null, null,
    "A collaborative exercise where red and blue work side-by-side: red executes a known TTP, blue confirms (or fails to confirm) detection in real time. Optimizes detection coverage, not surprise.",
    "Eine kollaborative Übung, in der Red und Blue Seite an Seite arbeiten: Red führt eine bekannte TTP aus, Blue bestätigt (oder verfehlt) die Detektion in Echtzeit. Optimiert Detection-Abdeckung, nicht Überraschung.",
    ["red-team", "blue-team", "mitre-attack"]
  ),
  T("black-box", "Black Box Testing", "engagement", null, null,
    "Testing from an outside attacker's perspective, with no internal knowledge, accounts, or source code provided. Maximizes realism, minimizes depth per unit of time.",
    "Tests aus der Perspektive eines externen Angreifers — ohne internes Wissen, Zugänge oder Quellcode. Maximiert Realismus, minimiert Tiefe pro Zeiteinheit.",
    ["white-box", "grey-box", "assumed-breach"]
  ),
  T("white-box", "White Box Testing", "engagement", null, null,
    "Testing with full information — source code, architecture diagrams, credentials. Maximizes coverage and defect-density yield; useful before a code release.",
    "Tests mit vollständigen Informationen — Quellcode, Architekturdiagramme, Zugänge. Maximiert Abdeckung und Defekt-Dichte; nützlich vor einem Code-Release.",
    ["black-box", "grey-box"]
  ),
  T("grey-box", "Grey Box Testing", "engagement", null, null,
    "Testing with partial information — typically authenticated user accounts and high-level architecture, but no source. The most common mode for application assessments.",
    "Tests mit partiellen Informationen — typischerweise authentifizierte Nutzer-Accounts und High-Level-Architektur, aber kein Quellcode. Der häufigste Modus für Anwendungs-Assessments.",
    ["black-box", "white-box"]
  ),
  T("assumed-breach", "Assumed Breach", "engagement", null, null,
    "An engagement that starts inside the perimeter — for example, with an attacker-controlled workstation — to bypass the (already-tested) external surface and focus on lateral movement and blast radius.",
    "Ein Engagement, das innerhalb des Perimeters startet — beispielsweise mit einer angreifer-kontrollierten Workstation — um die (bereits getestete) externe Oberfläche zu umgehen und sich auf Lateral Movement und Blast Radius zu konzentrieren.",
    ["red-team", "lateral-movement", "blue-team"]
  ),
  T("adversary-emulation", "Adversary Emulation", "engagement", null, null,
    "A red-team variant where the operators imitate a specific named threat actor — its TTPs, tooling, infrastructure pattern — to test whether defenses tuned for that actor actually catch it.",
    "Eine Red-Team-Variante, in der die Operatoren einen spezifischen benannten Threat-Actor imitieren — seine TTPs, Tooling, Infrastruktur-Muster — um zu prüfen, ob speziell auf diesen Actor abgestimmte Defenses ihn tatsächlich erkennen.",
    ["red-team", "mitre-attack", "apt"]
  ),
  T("tlpt", "TLPT", "engagement",
    "Threat-Led Penetration Testing",
    "Threat-Led Penetration Testing",
    "Intelligence-driven red-team testing against critical systems, mandated for in-scope financial entities under DORA. Implementation follows TIBER-EU and its national variants.",
    "Intelligence-getriebene Red-Team-Tests gegen kritische Systeme, für in-scope Finanzentitäten unter DORA verpflichtend. Die Umsetzung folgt TIBER-EU und seinen nationalen Varianten.",
    ["dora", "tiber-eu", "red-team"]
  ),
  T("bug-bounty", "Bug Bounty", "engagement", null, null,
    "A program that pays external researchers for valid vulnerability reports against a defined scope. Complements but does not replace engagement-based testing.",
    "Ein Programm, das externe Researcher für valide Schwachstellen-Berichte gegen einen definierten Scope vergütet. Ergänzt engagement-basierte Tests, ersetzt sie nicht.",
    ["responsible-disclosure", "pentest"]
  ),
  T("responsible-disclosure", "Responsible Disclosure", "engagement", null, null,
    "The practice (and norm) of reporting a discovered vulnerability to the affected party privately first, allowing a remediation window before public disclosure. Sometimes called coordinated disclosure.",
    "Die Praxis (und Norm), eine entdeckte Schwachstelle zunächst privat an die betroffene Partei zu melden — mit einem Remediation-Fenster vor Veröffentlichung. Wird auch als Coordinated Disclosure bezeichnet.",
    ["bug-bounty", "cve"]
  ),
  T("ctf", "CTF", "engagement",
    "Capture The Flag",
    "Capture The Flag",
    "A skill-building competition format where participants exploit prepared challenges to retrieve hidden tokens (flags). Two main variants: jeopardy-style and attack-defense.",
    "Ein Wettbewerbsformat zum Kompetenzaufbau, bei dem Teilnehmer präparierte Challenges exploiten, um versteckte Tokens (Flags) zu bergen. Zwei Hauptvarianten: Jeopardy und Attack-Defense.",
    []
  ),

  // ── Vulnerability Class ────────────────────────────────────────────
  T("xss", "XSS", "vuln-class",
    "Cross-Site Scripting",
    "Cross-Site Scripting",
    "Injection of attacker-controlled script into a page rendered by another user's browser. Three primary modes: reflected, stored, and DOM-based.",
    "Injektion angreifer-kontrollierten Skripts in eine Seite, die im Browser eines anderen Nutzers gerendert wird. Drei Hauptmodi: reflected, stored, DOM-based.",
    ["dom-xss", "csrf"]
  ),
  T("dom-xss", "DOM XSS", "vuln-class", null, null,
    "An XSS variant where the malicious payload is introduced and executed entirely within the browser via unsafe handling of DOM sinks, with no server-side reflection.",
    "Eine XSS-Variante, bei der der bösartige Payload vollständig im Browser über unsichere DOM-Sinks eingeführt und ausgeführt wird — ohne serverseitige Reflektion.",
    ["xss"]
  ),
  T("csrf", "CSRF", "vuln-class",
    "Cross-Site Request Forgery",
    "Cross-Site Request Forgery",
    "An attack that causes an authenticated user's browser to issue an unintended state-changing request to a trusted application. Defended by anti-forgery tokens or same-site cookie policies.",
    "Ein Angriff, der den Browser eines authentifizierten Nutzers dazu bringt, eine unbeabsichtigte zustandsändernde Anfrage an eine vertrauenswürdige Anwendung zu senden. Wird durch Anti-Forgery-Tokens oder SameSite-Cookie-Policies abgewehrt.",
    ["xss"]
  ),
  T("sqli", "SQL Injection", "vuln-class", null, null,
    "Injection of attacker-controlled SQL fragments into a query, typically via unparameterized concatenation of user input. Outcomes range from authentication bypass to full database extraction.",
    "Injektion angreifer-kontrollierter SQL-Fragmente in eine Query, typischerweise über nicht-parametrisierte Konkatenation von Nutzereingaben. Konsequenzen reichen von Auth-Bypass bis zur vollständigen Datenbank-Extraktion.",
    ["nosql-injection", "cmd-injection"]
  ),
  T("nosql-injection", "NoSQL Injection", "vuln-class", null, null,
    "The NoSQL counterpart to SQL injection — manipulation of query operators (e.g., MongoDB's `$ne`, `$gt`) or JavaScript evaluation inside the database engine.",
    "Das NoSQL-Pendant zur SQL-Injection — Manipulation von Query-Operatoren (z. B. MongoDB `$ne`, `$gt`) oder JavaScript-Auswertung in der Datenbank-Engine.",
    ["sqli"]
  ),
  T("cmd-injection", "Command Injection", "vuln-class", null, null,
    "Injection of attacker-controlled commands into a call passed to the underlying operating-system shell. Typically leads to immediate remote code execution as the application user.",
    "Injektion angreifer-kontrollierter Kommandos in einen Aufruf, der an die zugrundeliegende Betriebssystem-Shell weitergegeben wird. Führt typischerweise zu sofortiger Remote Code Execution unter dem Anwendungs-Nutzer.",
    ["sqli", "deserialization"]
  ),
  T("ssrf", "SSRF", "vuln-class",
    "Server-Side Request Forgery",
    "Server-Side Request Forgery",
    "Coercing a server to make a network request the attacker controls — to internal services, cloud metadata endpoints, or arbitrary URLs. A primary path into otherwise unreachable internal infrastructure.",
    "Ein Server wird gezwungen, eine angreifer-kontrollierte Netzwerk-Anfrage zu senden — an interne Dienste, Cloud-Metadata-Endpoints oder beliebige URLs. Ein zentraler Pfad in ansonsten unerreichbare interne Infrastruktur.",
    ["xxe"]
  ),
  T("xxe", "XXE", "vuln-class",
    "XML External Entity",
    "XML External Entity",
    "Abuse of XML parsers that resolve external entity references, enabling file read, SSRF, and in some configurations remote code execution. Mitigated by disabling DTD processing.",
    "Missbrauch von XML-Parsern, die externe Entity-Referenzen auflösen — ermöglicht Datei-Auslesen, SSRF und in manchen Konfigurationen Remote Code Execution. Wird durch Deaktivieren der DTD-Verarbeitung mitigiert.",
    ["ssrf", "path-traversal"]
  ),
  T("path-traversal", "Path Traversal", "vuln-class", null, null,
    "Use of relative-path segments (e.g., `../`) in input to escape an intended directory and read or write arbitrary files. Often combined with file-upload weaknesses.",
    "Verwendung relativer Pfad-Segmente (z. B. `../`) in Eingaben, um aus einem vorgesehenen Verzeichnis auszubrechen und beliebige Dateien zu lesen oder zu schreiben. Oft mit File-Upload-Schwächen kombiniert.",
    ["xxe", "file-upload"]
  ),
  T("idor", "IDOR", "vuln-class",
    "Insecure Direct Object Reference",
    "Insecure Direct Object Reference",
    "An authorization flaw where a user can access another user's records by guessing or altering an identifier in the request, because the server checks authentication but not ownership.",
    "Ein Autorisierungsfehler, bei dem ein Nutzer auf Datensätze anderer zugreifen kann, indem er einen Identifier in der Anfrage rät oder verändert — weil der Server zwar Authentifizierung, aber nicht Eigentümerschaft prüft.",
    ["biz-logic", "auth-bypass"]
  ),
  T("file-upload", "Insecure File Upload", "vuln-class", null, null,
    "A vulnerability class where the server stores or executes uploaded files without sufficient validation, allowing webshells, archive bombs, or content-type confusion attacks.",
    "Eine Schwachstellenklasse, bei der der Server hochgeladene Dateien ohne hinreichende Validierung speichert oder ausführt — was Webshells, Archive-Bomben oder Content-Type-Confusion-Angriffe ermöglicht.",
    ["path-traversal", "cmd-injection"]
  ),
  T("deserialization", "Insecure Deserialization", "vuln-class", null, null,
    "Reconstruction of attacker-controlled serialized objects (Java, .NET, PHP, Python) leading to gadget-chain remote code execution. Hard to remediate without library upgrades.",
    "Rekonstruktion angreifer-kontrollierter serialisierter Objekte (Java, .NET, PHP, Python), die zu Gadget-Chain-Remote-Code-Execution führt. Ohne Library-Upgrades schwer zu beheben.",
    ["cmd-injection", "cves"]
  ),
  T("biz-logic", "Business Logic Flaw", "vuln-class", null, null,
    "A defect where every individual request is authenticated and authorized correctly, but the sequence or combination of requests violates the application's intended rules — e.g., a discount applied twice, a checkout completed without payment.",
    "Ein Defekt, bei dem jede einzelne Anfrage korrekt authentifiziert und autorisiert wird, die Sequenz oder Kombination der Anfragen jedoch die beabsichtigten Anwendungsregeln verletzt — z. B. ein doppelt angewendeter Rabatt, ein Checkout ohne Zahlung.",
    ["idor", "race-condition"]
  ),
  T("auth-bypass", "Authentication Bypass", "vuln-class", null, null,
    "Reaching an authenticated state without valid credentials — via logic flaws, hardcoded credentials, mass-assignment, or session-handling defects.",
    "Erreichen eines authentifizierten Zustands ohne gültige Zugangsdaten — über Logikfehler, hardcodierte Credentials, Mass-Assignment oder Session-Handling-Defekte.",
    ["session-fixation", "jwt"]
  ),
  T("session-fixation", "Session Fixation", "vuln-class", null, null,
    "Forcing a victim to use a session identifier known to the attacker, who then hijacks the session after the victim authenticates. Mitigated by regenerating the session ID on login.",
    "Ein Opfer wird gezwungen, einen dem Angreifer bekannten Session-Identifier zu nutzen — der Angreifer übernimmt die Session nach der Anmeldung. Wird durch Regenerieren der Session-ID beim Login mitigiert.",
    ["auth-bypass"]
  ),
  T("race-condition", "Race Condition", "vuln-class", null, null,
    "A defect that manifests when concurrent requests interleave in an unexpected order, breaking an invariant the code assumed was atomic. In security contexts, classically a double-spend or double-redeem.",
    "Ein Defekt, der entsteht, wenn parallele Anfragen sich in unerwarteter Reihenfolge verzahnen und eine vom Code als atomar angenommene Invariante brechen. Im Sicherheitskontext klassisch ein Double-Spend oder Double-Redeem.",
    ["biz-logic"]
  ),
  T("misconfig", "Misconfiguration", "vuln-class", null, null,
    "A vulnerability rooted in a configuration choice — not an unsafe primitive — that exposes data or functionality unintentionally. Default credentials, open S3 buckets, exposed management consoles are typical.",
    "Eine Schwachstelle, die in einer Konfigurationsentscheidung wurzelt — nicht in einer unsicheren Primitive — und Daten oder Funktionalität ungewollt freilegt. Default-Credentials, offene S3-Buckets, exponierte Management-Konsolen sind typisch.",
    ["hardcoded-creds", "cves"]
  ),
  T("hardcoded-creds", "Hardcoded Credentials", "vuln-class", null, null,
    "Authentication material baked into source code, configuration files, or firmware images. Eliminated by secret managers and build-time injection, not by `.gitignore`.",
    "Authentifizierungsmaterial, das in Quellcode, Konfigurationsdateien oder Firmware-Images eingebacken ist. Wird durch Secret Manager und Build-Time-Injection beseitigt — nicht durch `.gitignore`.",
    ["misconfig", "hsm"]
  ),
  T("memory-corruption", "Memory Corruption", "vuln-class", null, null,
    "A class of vulnerabilities in unsafe-language code where memory layout assumptions are violated — buffer overflows, use-after-free, type confusion. Mitigated by ASLR, stack canaries, and increasingly by memory-safe languages.",
    "Eine Schwachstellenklasse in Code unsicherer Sprachen, bei der Annahmen über das Speicherlayout verletzt werden — Buffer Overflows, Use-after-Free, Type Confusion. Mitigiert durch ASLR, Stack-Canaries und zunehmend durch speichersichere Sprachen.",
    ["zero-day", "cves"]
  ),
  T("crypto-failure", "Cryptographic Failure", "vuln-class", null, null,
    "The OWASP-renamed bucket for what used to be called sensitive-data exposure: missing encryption, weak algorithms, bad key management, mishandled certificates.",
    "Der von OWASP umbenannte Sammelbegriff für das, was früher Sensitive Data Exposure hieß: fehlende Verschlüsselung, schwache Algorithmen, schlechtes Key-Management, falsch gehandhabte Zertifikate.",
    ["tls", "hash-function", "pki"]
  ),
  T("cors-flaw", "CORS Misconfiguration", "vuln-class",
    "Cross-Origin Resource Sharing misconfiguration",
    "Cross-Origin Resource Sharing — Fehlkonfiguration",
    "Overly permissive CORS headers (e.g., `Access-Control-Allow-Origin: *` combined with credentials) that let attacker-controlled origins read protected responses.",
    "Zu großzügige CORS-Header (z. B. `Access-Control-Allow-Origin: *` in Kombination mit Credentials), die angreifer-kontrollierten Origins erlauben, geschützte Responses zu lesen.",
    ["xss", "csrf"]
  ),

  // ── Attack Technique ───────────────────────────────────────────────
  T("osint", "OSINT", "attack",
    "Open-Source Intelligence",
    "Open-Source Intelligence",
    "Collection of information from publicly available sources — DNS, code repositories, breach data, social media, archives — to build a target picture without active interaction.",
    "Sammlung von Informationen aus öffentlich verfügbaren Quellen — DNS, Code-Repositories, Breach-Daten, Social Media, Archive — um ein Zielbild ohne aktive Interaktion aufzubauen.",
    ["recon", "fingerprinting"]
  ),
  T("recon", "Reconnaissance", "attack", null, null,
    "The first phase of an engagement: identifying targets, surfaces, and access vectors. Subdivided into passive (no traffic to the target) and active (probes, scans).",
    "Die erste Phase eines Engagements: Identifikation von Zielen, Oberflächen und Zugangsvektoren. Unterteilt in passiv (kein Traffic zum Ziel) und aktiv (Probes, Scans).",
    ["osint", "fingerprinting"]
  ),
  T("fingerprinting", "Fingerprinting", "attack", null, null,
    "Identifying the specific software stack — server, framework, library version — of a target via header patterns, error pages, default content, or behavioral probes.",
    "Identifikation des spezifischen Software-Stacks — Server, Framework, Library-Version — eines Ziels über Header-Muster, Error-Pages, Default-Inhalte oder Verhaltens-Probes.",
    ["recon", "dir-fuzz"]
  ),
  T("dir-fuzz", "Directory Fuzzing", "attack", null, null,
    "Brute-force enumeration of paths and files on a web server, using wordlists tuned to the detected stack. Surfaces hidden admin panels, backup files, legacy endpoints.",
    "Brute-Force-Enumeration von Pfaden und Dateien auf einem Webserver, mit auf den erkannten Stack abgestimmten Wortlisten. Legt versteckte Admin-Panels, Backup-Dateien, Legacy-Endpoints offen.",
    ["fingerprinting"]
  ),
  T("initial-access", "Initial Access", "attack", null, null,
    "The first foothold an attacker establishes inside a target environment — through phishing, exposed credentials, exploitable service, or supply-chain compromise.",
    "Der erste Foothold, den ein Angreifer in einem Zielumfeld etabliert — über Phishing, exponierte Credentials, einen ausnutzbaren Dienst oder eine Supply-Chain-Kompromittierung.",
    ["phishing", "foothold", "lateral-movement"]
  ),
  T("foothold", "Foothold", "attack", null, null,
    "A persistent presence in the target environment from which an attacker can operate. Typically a compromised host with reliable callback to attacker-controlled infrastructure.",
    "Eine persistente Präsenz im Zielumfeld, von der aus ein Angreifer operieren kann. Typischerweise ein kompromittierter Host mit zuverlässigem Callback zur angreifer-kontrollierten Infrastruktur.",
    ["initial-access", "c2", "persistence"]
  ),
  T("lateral-movement", "Lateral Movement", "attack", null, null,
    "Moving from the initial foothold to other systems inside the same environment — using stolen credentials, exploited trust relationships, or remote-execution primitives.",
    "Die Bewegung vom anfänglichen Foothold zu anderen Systemen im selben Umfeld — mit gestohlenen Credentials, ausgenutzten Vertrauensbeziehungen oder Remote-Execution-Primitiven.",
    ["pivoting", "priv-esc", "kerberos"]
  ),
  T("pivoting", "Pivoting", "attack", null, null,
    "Tunneling network traffic through a compromised host to reach systems that the attacker cannot directly route to. The mechanical layer beneath lateral movement.",
    "Tunneling von Netzwerk-Traffic durch einen kompromittierten Host, um Systeme zu erreichen, zu denen der Angreifer keine direkte Route hat. Die mechanische Schicht unter Lateral Movement.",
    ["lateral-movement", "c2"]
  ),
  T("priv-esc", "Privilege Escalation", "attack", null, null,
    "Elevating from a low-privilege context to a higher one — local (user → root/SYSTEM) or remote (standard user → domain admin).",
    "Erhöhung von einem niedrigprivilegierten in einen höheren Kontext — lokal (User → root/SYSTEM) oder remote (Standard-User → Domain-Admin).",
    ["lateral-movement", "kerberos", "active-directory"]
  ),
  T("persistence", "Persistence", "attack", null, null,
    "Mechanisms that allow an attacker to retain access across reboots, credential changes, or partial cleanup — registry autoruns, scheduled tasks, service installs, malicious certificates.",
    "Mechanismen, die einem Angreifer erlauben, Zugriff über Reboots, Credential-Änderungen oder teilweise Bereinigungen hinweg zu behalten — Registry-Autoruns, Scheduled Tasks, Service-Installationen, bösartige Zertifikate.",
    ["foothold", "c2"]
  ),
  T("c2", "Command & Control (C2)", "attack", null, null,
    "The communication channel between a compromised host and attacker-controlled infrastructure that issues commands and receives results. Modern C2 frequently mimics legitimate web or cloud traffic.",
    "Der Kommunikationskanal zwischen einem kompromittierten Host und angreifer-kontrollierter Infrastruktur, der Befehle gibt und Ergebnisse empfängt. Modernes C2 imitiert häufig legitimen Web- oder Cloud-Traffic.",
    ["persistence", "foothold"]
  ),
  T("post-exploitation", "Post-Exploitation", "attack", null, null,
    "Everything an attacker does after a foothold is achieved: situational awareness, credential harvesting, lateral movement, persistence, exfiltration.",
    "Alles, was ein Angreifer nach erfolgreichem Foothold tut: Situational Awareness, Credential-Harvesting, Lateral Movement, Persistence, Exfiltration.",
    ["foothold", "lateral-movement", "exfiltration"]
  ),
  T("exfiltration", "Exfiltration", "attack", null, null,
    "Removing data from the target environment to attacker-controlled storage. Modern exfiltration is throttled and channel-disguised to slip past data-loss prevention.",
    "Die Auslagerung von Daten aus dem Zielumfeld in angreifer-kontrollierten Speicher. Moderne Exfiltration ist gedrosselt und kanal-getarnt, um Data Loss Prevention zu umgehen.",
    ["dlp", "post-exploitation"]
  ),
  T("phishing", "Phishing", "attack", null, null,
    "Social-engineering attacks delivered at volume, typically via email, asking the recipient to disclose credentials or run a payload. The most common initial-access vector.",
    "Social-Engineering-Angriffe mit hohem Volumen, typischerweise per E-Mail — der Empfänger soll Credentials preisgeben oder einen Payload ausführen. Der häufigste Initial-Access-Vektor.",
    ["spear-phishing", "social-engineering", "initial-access"]
  ),
  T("spear-phishing", "Spear Phishing", "attack", null, null,
    "Phishing targeted at a single person or small group, with personalized context that increases the click-through rate dramatically.",
    "Phishing, das auf eine Einzelperson oder kleine Gruppe abzielt — mit personalisiertem Kontext, der die Klickrate dramatisch erhöht.",
    ["phishing", "social-engineering"]
  ),
  T("social-engineering", "Social Engineering", "attack", null, null,
    "Manipulation of people — by impersonation, pretext, urgency, or authority — to obtain information or actions that bypass technical controls.",
    "Manipulation von Menschen — durch Impersonation, Pretext, Dringlichkeit oder Autorität — um Informationen oder Handlungen zu erlangen, die technische Controls umgehen.",
    ["phishing", "spear-phishing"]
  ),
  T("threat-actor", "Threat Actor", "attack", null, null,
    "An individual or group with intent and capability to attack a defined set of targets. Catalogued by name, tooling, infrastructure, and TTP signature.",
    "Eine Einzelperson oder Gruppe mit Intent und Capability, eine definierte Zielmenge anzugreifen. Wird nach Name, Tooling, Infrastruktur und TTP-Signatur katalogisiert.",
    ["apt", "ttp", "mitre-attack"]
  ),
  T("apt", "APT", "attack",
    "Advanced Persistent Threat",
    "Advanced Persistent Threat",
    "A threat actor characterized by sustained, well-resourced, multi-stage operations against specific targets — typically state-aligned or state-sponsored. The label is overused; the meaning is operational, not legal.",
    "Ein Threat-Actor, charakterisiert durch nachhaltige, gut ausgestattete, mehrstufige Operationen gegen spezifische Ziele — typischerweise staatsnah oder staatlich gesponsert. Der Begriff wird inflationär verwendet; die Bedeutung ist operativ, nicht juristisch.",
    ["threat-actor", "adversary-emulation", "ttp"]
  ),

  // ── Identity & Cryptography ────────────────────────────────────────
  T("tls", "TLS", "identity",
    "Transport Layer Security",
    "Transport Layer Security",
    "The cryptographic protocol that secures most HTTP, SMTP, and database traffic. TLS 1.2 is the minimum baseline; TLS 1.3 is current; SSL is deprecated.",
    "Das kryptografische Protokoll, das den Großteil des HTTP-, SMTP- und Datenbank-Traffics absichert. TLS 1.2 ist der Mindeststandard; TLS 1.3 ist aktuell; SSL ist veraltet.",
    ["mtls", "pki", "ca"]
  ),
  T("mtls", "mTLS", "identity",
    "mutual TLS",
    "mutual TLS",
    "TLS in which both client and server present and validate certificates. Used for service-to-service authentication where bearer tokens are insufficient.",
    "TLS, bei dem sowohl Client als auch Server Zertifikate vorzeigen und validieren. Wird für Service-to-Service-Authentifizierung eingesetzt, wo Bearer-Tokens nicht ausreichen.",
    ["tls", "pki"]
  ),
  T("pki", "PKI", "identity",
    "Public Key Infrastructure",
    "Public Key Infrastructure",
    "The system of policies, processes, and components — root CAs, intermediate CAs, registration authorities, revocation lists — that binds public keys to identities.",
    "Das System aus Policies, Prozessen und Komponenten — Root-CAs, Intermediate-CAs, Registration Authorities, Revocation Lists — das öffentliche Schlüssel an Identitäten bindet.",
    ["ca", "tls", "hsm"]
  ),
  T("ca", "Certificate Authority (CA)", "identity", null, null,
    "An entity that issues digital certificates after verifying the identity of the requester. Trust in a CA is itself trust in its policies, audits, and key custody.",
    "Eine Entität, die digitale Zertifikate ausstellt, nachdem sie die Identität des Antragstellers verifiziert hat. Vertrauen in eine CA ist Vertrauen in ihre Policies, Audits und Schlüssel-Verwahrung.",
    ["pki", "tls"]
  ),
  T("hsm", "HSM", "identity",
    "Hardware Security Module",
    "Hardware Security Module",
    "A tamper-resistant hardware device that generates, stores, and uses cryptographic keys without ever exposing the key material to host memory. Mandatory for high-assurance key custody.",
    "Ein manipulationsresistentes Hardware-Gerät, das kryptografische Schlüssel erzeugt, speichert und einsetzt, ohne das Schlüsselmaterial je in den Host-Speicher zu exponieren. Pflicht für hohe Vertraulichkeitsanforderungen an Schlüsselverwahrung.",
    ["pki", "ca"]
  ),
  T("mfa", "MFA", "identity",
    "Multi-Factor Authentication",
    "Multi-Faktor-Authentifizierung",
    "Authentication requiring two or more independent factors from the categories knowledge, possession, and inherence. Phishing-resistant MFA (WebAuthn, hardware keys) is the modern standard.",
    "Authentifizierung, die zwei oder mehr unabhängige Faktoren aus den Kategorien Wissen, Besitz und Inhärenz verlangt. Phishing-resistente MFA (WebAuthn, Hardware-Keys) ist der moderne Standard.",
    ["sso", "saml", "oidc"]
  ),
  T("sso", "SSO", "identity",
    "Single Sign-On",
    "Single Sign-On",
    "An architecture where one authentication event grants access to multiple downstream applications via federated tokens — typically SAML or OIDC.",
    "Eine Architektur, bei der ein einziges Authentifizierungs-Event Zugang zu mehreren nachgelagerten Anwendungen über föderierte Tokens gewährt — typischerweise SAML oder OIDC.",
    ["saml", "oidc", "oauth"]
  ),
  T("saml", "SAML", "identity",
    "Security Assertion Markup Language",
    "Security Assertion Markup Language",
    "An XML-based federation protocol for SSO, dominant in enterprise integrations. Verbose, but the only practical choice when one party speaks only SAML.",
    "Ein XML-basiertes Föderationsprotokoll für SSO, dominant in Enterprise-Integrationen. Wortreich, aber die einzige praktikable Wahl, wenn eine Partei nur SAML spricht.",
    ["sso", "oidc"]
  ),
  T("oidc", "OIDC", "identity",
    "OpenID Connect",
    "OpenID Connect",
    "An identity layer on top of OAuth 2.0 that adds standardized ID tokens. The modern default for federation in new applications.",
    "Eine Identity-Schicht auf OAuth 2.0, die standardisierte ID-Tokens hinzufügt. Der moderne Standard für Föderation in neuen Anwendungen.",
    ["oauth", "saml", "sso", "jwt"]
  ),
  T("oauth", "OAuth 2.0", "identity", null, null,
    "An authorization framework that allows a user to grant a third party scoped access to their resources without sharing credentials. Authorization, not authentication — OIDC adds the authentication.",
    "Ein Autorisierungs-Framework, das einem Nutzer erlaubt, einem Dritten gescopten Zugriff auf seine Ressourcen zu gewähren, ohne Credentials zu teilen. Autorisierung, nicht Authentifizierung — OIDC ergänzt die Authentifizierung.",
    ["oidc", "jwt"]
  ),
  T("jwt", "JWT", "identity",
    "JSON Web Token",
    "JSON Web Token",
    "A signed, base64-encoded token format used for stateless authentication. Easy to misuse: accepting `alg: none`, weak signing keys, and missing audience validation are the recurring traps.",
    "Ein signiertes, base64-kodiertes Token-Format für zustandslose Authentifizierung. Leicht falsch einzusetzen: das Akzeptieren von `alg: none`, schwache Signing-Keys und fehlende Audience-Validierung sind wiederkehrende Fallen.",
    ["oidc", "oauth"]
  ),
  T("kerberos", "Kerberos", "identity", null, null,
    "A ticket-based network authentication protocol designed in the 1980s and the foundation of Active Directory authentication. Attacks include Kerberoasting, AS-REP roasting, and Golden Ticket forgery.",
    "Ein ticket-basiertes Netzwerk-Authentifizierungsprotokoll aus den 1980er-Jahren und die Grundlage der Active-Directory-Authentifizierung. Angriffe umfassen Kerberoasting, AS-REP-Roasting und Golden-Ticket-Forgery.",
    ["active-directory", "priv-esc"]
  ),
  T("ldap", "LDAP", "identity",
    "Lightweight Directory Access Protocol",
    "Lightweight Directory Access Protocol",
    "The directory protocol underneath Active Directory and several open-source IAM stacks. LDAP injection is a parallel risk to SQL injection where filter strings are concatenated unsafely.",
    "Das Directory-Protokoll unter Active Directory und mehreren Open-Source-IAM-Stacks. LDAP-Injection ist ein paralleles Risiko zu SQL-Injection, wo Filter-Strings unsicher konkateniert werden.",
    ["active-directory", "sqli"]
  ),
  T("active-directory", "Active Directory (AD)", "identity", null, null,
    "Microsoft's enterprise directory and authentication service. The richest attack surface in most enterprise environments, with established kill chains from low-privileged user to Domain Admin.",
    "Microsofts Enterprise-Directory und -Authentifizierungsdienst. In den meisten Enterprise-Umfeldern die reichhaltigste Angriffsfläche, mit etablierten Kill-Chains vom niedrigprivilegierten User zum Domain Admin.",
    ["kerberos", "ldap", "priv-esc", "lateral-movement"]
  ),
  T("hash-function", "Hash Function", "identity", null, null,
    "A one-way function mapping arbitrary input to a fixed-length digest. Security-relevant properties: pre-image resistance, second-pre-image resistance, collision resistance.",
    "Eine Einwegfunktion, die beliebige Eingaben auf einen Digest fester Länge abbildet. Sicherheitsrelevante Eigenschaften: Pre-Image-Resistenz, Second-Pre-Image-Resistenz, Kollisionsresistenz.",
    ["sha-256", "hmac", "salt"]
  ),
  T("sha-256", "SHA-256", "identity", null, null,
    "The 256-bit member of the SHA-2 family. The current default cryptographic hash for general use, including TLS certificates and content addressing.",
    "Das 256-Bit-Mitglied der SHA-2-Familie. Der aktuelle Default für kryptografisches Hashing — etwa für TLS-Zertifikate und Content-Addressing.",
    ["hash-function", "hmac"]
  ),
  T("hmac", "HMAC", "identity",
    "Hash-based Message Authentication Code",
    "Hash-based Message Authentication Code",
    "A construction that combines a cryptographic hash with a shared secret to produce a message authentication code. Resistant to length-extension attacks that plain `hash(key || message)` is not.",
    "Eine Konstruktion, die einen kryptografischen Hash mit einem geteilten Geheimnis kombiniert, um einen Message Authentication Code zu erzeugen. Resistent gegen Length-Extension-Angriffe — anders als naives `hash(key || message)`.",
    ["hash-function", "sha-256"]
  ),
  T("salt", "Salt", "identity", null, null,
    "A unique, random value mixed into a password before hashing, so identical passwords yield different digests. Mandatory for any stored-password scheme.",
    "Ein einzigartiger, zufälliger Wert, der vor dem Hashing mit einem Passwort gemischt wird, damit gleiche Passwörter unterschiedliche Digests ergeben. Pflicht für jedes Stored-Password-Schema.",
    ["hash-function"]
  ),

  // ── Defensive Operations ───────────────────────────────────────────
  T("siem", "SIEM", "defense",
    "Security Information and Event Management",
    "Security Information and Event Management",
    "A platform that ingests logs from across an environment, normalizes them, applies detection rules, and surfaces alerts. The central nervous system of a SOC.",
    "Eine Plattform, die Logs aus einer ganzen Umgebung einsammelt, normalisiert, Detektionsregeln anwendet und Alerts hervorhebt. Das zentrale Nervensystem eines SOC.",
    ["soc", "soar", "edr"]
  ),
  T("soc", "SOC", "defense",
    "Security Operations Center",
    "Security Operations Center",
    "The function — internal or outsourced — that monitors security events, triages alerts, and runs incident response. Measured by mean time to detect and mean time to respond.",
    "Die Funktion — intern oder ausgelagert — die Sicherheits-Events überwacht, Alerts triagiert und Incident Response durchführt. Gemessen an Mean Time to Detect und Mean Time to Respond.",
    ["siem", "soar", "mdr"]
  ),
  T("edr", "EDR", "defense",
    "Endpoint Detection and Response",
    "Endpoint Detection and Response",
    "Endpoint-resident agents that observe process, file, network, and registry activity, ship telemetry, and enable remote response actions. The successor to traditional antivirus.",
    "Endpoint-residente Agents, die Prozess-, Datei-, Netzwerk- und Registry-Aktivität beobachten, Telemetrie liefern und Remote-Response-Aktionen ermöglichen. Der Nachfolger des klassischen Antivirus.",
    ["xdr", "mdr"]
  ),
  T("xdr", "XDR", "defense",
    "Extended Detection and Response",
    "Extended Detection and Response",
    "A category that broadens EDR's endpoint focus to include email, network, cloud, and identity telemetry under a single correlation layer. Vendor-defined more than standards-defined.",
    "Eine Kategorie, die den Endpoint-Fokus von EDR um E-Mail-, Netzwerk-, Cloud- und Identity-Telemetrie unter einer einzigen Korrelations-Schicht erweitert. Eher hersteller- als standarddefiniert.",
    ["edr", "siem"]
  ),
  T("mdr", "MDR", "defense",
    "Managed Detection and Response",
    "Managed Detection and Response",
    "An outsourced SOC service — usually built on EDR or XDR plus a 24/7 analyst team. Where a 24/7 in-house SOC is uneconomical.",
    "Ein ausgelagerter SOC-Dienst — meist aufgebaut auf EDR oder XDR plus einem 24/7-Analystenteam. Wo ein 24/7-In-House-SOC unwirtschaftlich ist.",
    ["soc", "edr", "xdr"]
  ),
  T("waf", "WAF", "defense",
    "Web Application Firewall",
    "Web Application Firewall",
    "A reverse-proxy filter for HTTP traffic, applying signature- and anomaly-based rules to block known attack patterns. A useful brake, not a fix; vulnerabilities behind it still need patching.",
    "Ein Reverse-Proxy-Filter für HTTP-Traffic, der signatur- und anomalie-basierte Regeln anwendet, um bekannte Angriffsmuster zu blockieren. Eine nützliche Bremse, kein Fix; Schwachstellen dahinter müssen weiterhin gepatcht werden.",
    ["ids", "ips"]
  ),
  T("ids", "IDS", "defense",
    "Intrusion Detection System",
    "Intrusion Detection System",
    "A monitoring system that observes network or host activity and raises alerts when it matches attack signatures or anomaly profiles. Detection only, no blocking.",
    "Ein Monitoring-System, das Netzwerk- oder Host-Aktivität beobachtet und Alerts auslöst, wenn sie Angriffssignaturen oder Anomalie-Profilen entspricht. Reine Detektion, kein Blocking.",
    ["ips", "siem"]
  ),
  T("ips", "IPS", "defense",
    "Intrusion Prevention System",
    "Intrusion Prevention System",
    "An IDS variant that sits inline and drops, resets, or rewrites traffic when it matches an attack pattern. Active mitigation; risks false-positive disruption.",
    "Eine IDS-Variante, die inline sitzt und Traffic verwirft, zurücksetzt oder umschreibt, wenn er einem Angriffsmuster entspricht. Aktive Mitigation; birgt Risiko durch False-Positive-Störungen.",
    ["ids", "waf"]
  ),
  T("soar", "SOAR", "defense",
    "Security Orchestration, Automation and Response",
    "Security Orchestration, Automation and Response",
    "Tooling that codifies analyst playbooks so routine triage and response steps execute automatically across the security stack. Lives on top of a SIEM, not instead of it.",
    "Tooling, das Analysten-Playbooks kodifiziert, sodass Routine-Triage- und Response-Schritte automatisch über den Security-Stack hinweg ausgeführt werden. Sitzt auf einem SIEM, nicht statt eines SIEM.",
    ["siem", "soc"]
  ),
  T("dlp", "DLP", "defense",
    "Data Loss Prevention",
    "Data Loss Prevention",
    "Controls — at endpoint, network, and cloud-storage layers — that classify sensitive data and block disallowed transfers. Effective against accidents and lazy insiders, evadable by motivated attackers.",
    "Controls — auf Endpoint-, Netzwerk- und Cloud-Storage-Ebene — die sensible Daten klassifizieren und unerlaubte Transfers blockieren. Wirksam gegen Versehen und nachlässige Insider, umgehbar durch motivierte Angreifer.",
    ["exfiltration"]
  ),
  T("zero-trust", "Zero Trust", "defense", null, null,
    "An architectural principle that grants no implicit trust based on network location and instead verifies every request against identity, device posture, and least-privilege policy. Aspirational at scale; selective in practice.",
    "Ein Architekturprinzip, das keinen impliziten Vertrauensvorschuss anhand des Netzwerk-Standorts gewährt und stattdessen jede Anfrage gegen Identität, Device-Posture und Least-Privilege-Policy prüft. Anspruchsvoll in der Skalierung; in der Praxis selektiv.",
    ["defense-in-depth", "iam"]
  ),
  T("defense-in-depth", "Defense in Depth", "defense", null, null,
    "The classical principle of layering independent controls so that the failure of any single layer does not compromise the system. Complementary to, not replaced by, Zero Trust.",
    "Das klassische Prinzip, unabhängige Controls so zu schichten, dass das Versagen einer einzelnen Schicht das System nicht kompromittiert. Komplementär zu Zero Trust — nicht durch es ersetzt.",
    ["zero-trust", "swiss-cheese-model"]
  ),
  T("threat-hunting", "Threat Hunting", "defense", null, null,
    "Hypothesis-driven proactive search through telemetry for adversary activity that escaped automated detection. Distinguished from alert triage by who started the investigation: the hunter, not the SIEM.",
    "Hypothesengetriebene proaktive Suche durch Telemetrie nach Adversary-Aktivität, die der automatisierten Detektion entgangen ist. Vom Alert-Triage dadurch unterschieden, wer die Untersuchung gestartet hat: der Hunter, nicht das SIEM.",
    ["soc", "siem", "ttp"]
  ),
  T("ttp", "TTP", "defense",
    "Tactics, Techniques, and Procedures",
    "Tactics, Techniques, and Procedures",
    "The behavioral fingerprint of an adversary — what they do (tactics), how (techniques), and exactly how (procedures). Catalogued by MITRE ATT&CK.",
    "Der Verhaltens-Fingerprint eines Adversary — was er tut (Tactics), wie (Techniques), und genau wie (Procedures). Wird von MITRE ATT&CK katalogisiert.",
    ["mitre-attack", "ioc", "threat-actor"]
  ),
  T("ioc", "IOC", "defense",
    "Indicator of Compromise",
    "Indicator of Compromise",
    "An observable artifact — IP address, file hash, domain, registry key — that suggests an intrusion may have occurred. Useful for known-bad detection; brittle against novel adversaries.",
    "Ein beobachtbares Artefakt — IP-Adresse, File-Hash, Domain, Registry-Key — das auf eine erfolgte Intrusion hindeutet. Nützlich für Known-Bad-Detection; spröde gegen neuartige Adversaries.",
    ["ttp", "stix-taxii"]
  ),
  T("stix-taxii", "STIX / TAXII", "defense",
    "Structured Threat Information Expression / Trusted Automated Exchange of Intelligence Information",
    "Structured Threat Information Expression / Trusted Automated Exchange of Intelligence Information",
    "STIX is the format for representing structured threat intelligence; TAXII is the transport for exchanging it. Together they enable machine-to-machine sharing of indicators and TTPs.",
    "STIX ist das Format zur Darstellung strukturierter Threat Intelligence; TAXII ist der Transport zu deren Austausch. Zusammen ermöglichen sie maschinenlesbares Teilen von Indicators und TTPs.",
    ["ttp", "ioc"]
  ),

  // ── Compliance & Regulation ────────────────────────────────────────
  T("nis2", "NIS2", "compliance",
    "Network and Information Security Directive 2",
    "Network- und Informationssicherheits-Richtlinie 2",
    "EU directive (2022/2555) that raises cybersecurity requirements for essential and important entities across 18 sectors. Replaces the original NIS directive; enforced via national transposition laws.",
    "EU-Richtlinie (2022/2555), die Cybersicherheitsanforderungen für wesentliche und wichtige Einrichtungen über 18 Sektoren hinweg verschärft. Ersetzt die ursprüngliche NIS-Richtlinie; durchgesetzt über nationale Umsetzungsgesetze.",
    ["dora", "cer", "kritis", "bsi"]
  ),
  T("dora", "DORA", "compliance",
    "Digital Operational Resilience Act",
    "Digital Operational Resilience Act",
    "EU regulation (2022/2554) for the financial sector, harmonizing ICT risk management, incident reporting, resilience testing (including TLPT), and oversight of critical third-party providers. Directly applicable since January 2025.",
    "EU-Verordnung (2022/2554) für den Finanzsektor, die IKT-Risikomanagement, Vorfallmeldungen, Resilienztests (inklusive TLPT) und die Aufsicht über kritische Drittanbieter harmonisiert. Seit Januar 2025 unmittelbar anwendbar.",
    ["nis2", "tlpt", "tiber-eu", "bafin", "bait", "vait"]
  ),
  T("kritis", "KRITIS", "compliance",
    "Kritische Infrastrukturen (Germany)",
    "Kritische Infrastrukturen",
    "The German regulatory category for operators of critical infrastructure across nine sectors. Subject to BSI oversight, mandatory state-of-the-art security, and incident reporting. Implements NIS2 in part.",
    "Die deutsche Regulierungskategorie für Betreiber kritischer Infrastrukturen über neun Sektoren. Unterliegt der BSI-Aufsicht, verpflichtenden Stand-der-Technik-Sicherheitsmaßnahmen und Meldepflichten. Setzt NIS2 teilweise um.",
    ["bsi", "nis2", "bsi-grundschutz"]
  ),
  T("bsi", "BSI", "compliance",
    "Bundesamt für Sicherheit in der Informationstechnik",
    "Bundesamt für Sicherheit in der Informationstechnik",
    "Germany's federal cybersecurity authority. Sets technical baselines (IT-Grundschutz, C5), certifies products and personnel, oversees KRITIS operators, and acts as the national NIS2 competent authority.",
    "Die deutsche Bundesbehörde für Cybersicherheit. Definiert technische Baselines (IT-Grundschutz, C5), zertifiziert Produkte und Personen, beaufsichtigt KRITIS-Betreiber und ist nationale NIS2-Zuständigkeitsbehörde.",
    ["kritis", "bsi-grundschutz", "bsi-c5", "nis2"]
  ),
  T("bsi-grundschutz", "BSI IT-Grundschutz", "compliance", null, null,
    "The BSI's modular control catalog for managing information-security risk in German organizations. ISO/IEC 27001 compatible; common path to certification for public-sector and KRITIS bodies.",
    "Der modulare Control-Katalog des BSI zum Management von Informationssicherheits-Risiken in deutschen Organisationen. ISO/IEC 27001-kompatibel; üblicher Zertifizierungspfad für öffentliche Stellen und KRITIS-Betreiber.",
    ["bsi", "iso-27001"]
  ),
  T("bsi-c5", "BSI C5", "compliance",
    "Cloud Computing Compliance Criteria Catalogue",
    "Cloud Computing Compliance Criteria Catalogue",
    "A BSI-published audit catalog for cloud-service providers, increasingly required by German public-sector and regulated customers when procuring cloud services.",
    "Ein vom BSI veröffentlichter Audit-Katalog für Cloud-Service-Provider, der zunehmend von deutschen öffentlichen Stellen und regulierten Kunden beim Cloud-Einkauf gefordert wird.",
    ["bsi", "iso-27001"]
  ),
  T("iso-27001", "ISO/IEC 27001", "compliance", null, null,
    "The international standard for information-security management systems (ISMS). Specifies the process; Annex A lists the controls. The 2022 revision modernized the control set.",
    "Der internationale Standard für Informationssicherheits-Managementsysteme (ISMS). Spezifiziert den Prozess; Anhang A listet die Controls. Die Revision von 2022 hat den Control-Satz modernisiert.",
    ["iso-27002", "bsi-grundschutz", "soc-2"]
  ),
  T("iso-27002", "ISO/IEC 27002", "compliance", null, null,
    "The companion standard to ISO/IEC 27001, providing implementation guidance for each Annex A control. Reference rather than certification target.",
    "Der Begleitstandard zu ISO/IEC 27001, der Umsetzungsleitfäden für jeden Annex-A-Control bereitstellt. Referenz, kein Zertifizierungsziel.",
    ["iso-27001"]
  ),
  T("tisax", "TISAX", "compliance",
    "Trusted Information Security Assessment Exchange",
    "Trusted Information Security Assessment Exchange",
    "The German automotive industry's information-security assessment and exchange mechanism, governed by ENX and based on the VDA ISA catalog. Required to participate in OEM supply chains.",
    "Der Informationssicherheits-Bewertungs- und Austauschmechanismus der deutschen Automobilindustrie, von ENX getragen und auf dem VDA ISA basierend. Voraussetzung für die Teilnahme an OEM-Lieferketten.",
    ["enx", "vda-isa", "iso-27001"]
  ),
  T("enx", "ENX Association", "compliance", null, null,
    "The not-for-profit governance body for TISAX and ENX, the secure automotive industry network. Accredits TISAX audit providers and operates the result-exchange portal.",
    "Die gemeinnützige Governance-Organisation für TISAX und ENX, das sichere Branchennetzwerk der Automobilindustrie. Akkreditiert TISAX-Audit-Anbieter und betreibt das Ergebnis-Austauschportal.",
    ["tisax", "vda-isa"]
  ),
  T("vda-isa", "VDA ISA", "compliance",
    "Verband der Automobilindustrie — Information Security Assessment",
    "VDA Information Security Assessment",
    "The control catalog that TISAX assessments evaluate against. Maintained by the German automotive association (VDA), aligned to ISO/IEC 27001 with automotive-specific extensions.",
    "Der Control-Katalog, gegen den TISAX-Assessments geprüft werden. Vom Verband der Automobilindustrie (VDA) gepflegt, an ISO/IEC 27001 ausgerichtet mit automobil-spezifischen Erweiterungen.",
    ["tisax", "enx", "iso-27001"]
  ),
  T("bafin", "BaFin", "compliance",
    "Bundesanstalt für Finanzdienstleistungsaufsicht",
    "Bundesanstalt für Finanzdienstleistungsaufsicht",
    "Germany's integrated supervisor for banks, insurers, payment service providers, and securities markets. Publishes the BAIT/VAIT/KAIT/ZAIT requirements and is the competent national authority under DORA.",
    "Die integrierte deutsche Aufsicht für Banken, Versicherer, Zahlungsdienstleister und Wertpapiermärkte. Veröffentlicht die BAIT/VAIT/KAIT/ZAIT-Anforderungen und ist die nationale Zuständigkeitsbehörde unter DORA.",
    ["bait", "vait", "kait", "zait", "dora", "marisk"]
  ),
  T("bait", "BAIT", "compliance",
    "Bankaufsichtliche Anforderungen an die IT",
    "Bankaufsichtliche Anforderungen an die IT",
    "BaFin's IT-supervisory requirements for credit institutions — covering IT governance, information security, identity management, and outsourcing. The interpretation framework for §25a KWG.",
    "Die IT-Aufsichtsanforderungen der BaFin für Kreditinstitute — IT-Governance, Informationssicherheit, Identitäts- und Berechtigungsmanagement, Auslagerung. Der Auslegungsrahmen für §25a KWG.",
    ["bafin", "vait", "marisk", "dora"]
  ),
  T("vait", "VAIT", "compliance",
    "Versicherungsaufsichtliche Anforderungen an die IT",
    "Versicherungsaufsichtliche Anforderungen an die IT",
    "BaFin's IT-supervisory requirements for insurance undertakings, structured in parallel to BAIT. Now overlaid with DORA for in-scope entities.",
    "Die IT-Aufsichtsanforderungen der BaFin für Versicherungsunternehmen, parallel zu BAIT strukturiert. Für betroffene Entitäten inzwischen mit DORA überlagert.",
    ["bafin", "bait", "dora"]
  ),
  T("kait", "KAIT", "compliance",
    "Kapitalverwaltungsaufsichtliche Anforderungen an die IT",
    "Kapitalverwaltungsaufsichtliche Anforderungen an die IT",
    "BaFin's IT-supervisory requirements for capital-management companies (asset managers under the KAGB).",
    "Die IT-Aufsichtsanforderungen der BaFin für Kapitalverwaltungsgesellschaften (Asset Manager unter dem KAGB).",
    ["bafin", "bait", "vait"]
  ),
  T("zait", "ZAIT", "compliance",
    "Zahlungsdiensteaufsichtliche Anforderungen an die IT",
    "Zahlungsdiensteaufsichtliche Anforderungen an die IT",
    "BaFin's IT-supervisory requirements for payment institutions and e-money institutions.",
    "Die IT-Aufsichtsanforderungen der BaFin für Zahlungsinstitute und E-Geld-Institute.",
    ["bafin", "bait", "vait", "psd2"]
  ),
  T("marisk", "MaRisk", "compliance",
    "Mindestanforderungen an das Risikomanagement",
    "Mindestanforderungen an das Risikomanagement",
    "BaFin's minimum requirements on risk management for credit institutions. Sets the qualitative bar that BAIT then specifies for the IT dimension.",
    "Die Mindestanforderungen der BaFin an das Risikomanagement für Kreditinstitute. Setzt die qualitative Messlatte, die BAIT für die IT-Dimension dann konkretisiert.",
    ["bafin", "bait"]
  ),
  T("gdpr", "GDPR / DSGVO", "compliance",
    "General Data Protection Regulation",
    "Datenschutz-Grundverordnung",
    "EU regulation 2016/679 on the processing of personal data. Mandates technical and organizational measures, breach notification within 72 hours, and the right to data-subject access.",
    "EU-Verordnung 2016/679 über die Verarbeitung personenbezogener Daten. Verlangt technische und organisatorische Maßnahmen, Meldung von Datenpannen innerhalb von 72 Stunden und das Auskunftsrecht der Betroffenen.",
    ["linddun", "dlp"]
  ),
  T("pci-dss", "PCI DSS", "compliance",
    "Payment Card Industry Data Security Standard",
    "Payment Card Industry Data Security Standard",
    "The card-brand-mandated standard for any environment that stores, processes, or transmits payment-card data. Currently v4.0 with phased compliance dates through 2025.",
    "Der von den Kartenmarken vorgeschriebene Standard für jede Umgebung, die Zahlungskartendaten speichert, verarbeitet oder überträgt. Aktuell v4.0 mit gestaffelten Compliance-Daten bis 2025.",
    ["iso-27001", "soc-2"]
  ),
  T("soc-2", "SOC 2", "compliance",
    "System and Organization Controls 2",
    "System and Organization Controls 2",
    "An AICPA attestation report on the operational controls of a service organization, against five trust-services criteria. The de-facto procurement document for US enterprise sales.",
    "Ein AICPA-Attestierungsbericht über die operativen Controls einer Dienstleistungsorganisation, gemessen an fünf Trust-Services-Kriterien. Das De-facto-Procurement-Dokument im US-Enterprise-Vertrieb.",
    ["iso-27001", "pci-dss"]
  ),
  T("enisa", "ENISA", "compliance",
    "European Union Agency for Cybersecurity",
    "Agentur der Europäischen Union für Cybersicherheit",
    "The EU cybersecurity agency. Publishes threat landscapes, certification schemes, and implementation guidance — including for NIS2, CRA, and the Cybersecurity Act.",
    "Die EU-Agentur für Cybersicherheit. Veröffentlicht Threat-Landscape-Berichte, Zertifizierungsschemata und Umsetzungsleitfäden — u. a. für NIS2, CRA und den Cybersecurity Act.",
    ["nis2", "cra", "ai-act"]
  ),
  T("cra", "CRA", "compliance",
    "Cyber Resilience Act",
    "Cyber Resilience Act",
    "EU regulation (2024/2847) setting horizontal cybersecurity requirements for products with digital elements — across hardware and software. Comes into force in stages from 2026.",
    "EU-Verordnung (2024/2847), die horizontale Cybersicherheitsanforderungen für Produkte mit digitalen Elementen festlegt — über Hardware und Software hinweg. Tritt ab 2026 gestaffelt in Kraft.",
    ["enisa", "ai-act", "nis2"]
  ),
  T("ai-act", "AI Act", "compliance",
    "European Union Artificial Intelligence Act",
    "EU-Verordnung über Künstliche Intelligenz",
    "EU regulation (2024/1689) classifying AI systems by risk tier with corresponding obligations. Cybersecurity duties apply to high-risk systems and general-purpose AI models.",
    "EU-Verordnung (2024/1689), die KI-Systeme nach Risiko-Tier mit entsprechenden Pflichten klassifiziert. Cybersicherheits-Pflichten gelten für Hochrisiko-Systeme und General-Purpose-AI-Modelle.",
    ["cra", "gdpr"]
  ),
  T("cer", "CER", "compliance",
    "Critical Entities Resilience Directive",
    "Richtlinie zur Resilienz kritischer Einrichtungen",
    "EU directive (2022/2557) on the physical resilience of critical entities — the non-cyber companion piece to NIS2.",
    "EU-Richtlinie (2022/2557) zur physischen Resilienz kritischer Einrichtungen — das Nicht-Cyber-Gegenstück zu NIS2.",
    ["nis2", "kritis"]
  ),
  T("nist-800-53", "NIST 800-53", "compliance", null, null,
    "The US federal control catalog for information systems. Densely cross-referenced, used as a vocabulary even outside US-federal procurement contexts.",
    "Der US-Föderal-Control-Katalog für Informationssysteme. Dicht quervernetzt, auch außerhalb US-bundesbehördlicher Procurement-Kontexte als Vokabular verwendet.",
    ["nist-csf", "iso-27001"]
  ),
  T("unece-r155-r156", "UNECE R155 / R156", "compliance", null, null,
    "United Nations regulations for cybersecurity (R155) and software-update management (R156) of road vehicles. Required for vehicle type approval in UN-1958 markets, including the EU.",
    "UN-Regelungen für Cybersicherheit (R155) und Software-Update-Management (R156) von Straßenfahrzeugen. Voraussetzung für Fahrzeugtypgenehmigungen in UN-1958-Märkten, einschließlich der EU.",
    ["tisax"]
  ),
  T("psd2", "PSD2", "compliance",
    "Payment Services Directive 2",
    "Zahlungsdiensterichtlinie 2",
    "EU directive that opened bank account access to licensed third parties and mandated strong customer authentication for electronic payments.",
    "EU-Richtlinie, die Bankkonto-Zugänge für lizenzierte Dritte öffnete und starke Kunden-Authentifizierung für elektronische Zahlungen vorschrieb.",
    ["zait", "mfa"]
  ),
  T("eidas", "eIDAS", "compliance",
    "electronic IDentification, Authentication and trust Services regulation",
    "Verordnung über elektronische Identifizierung und Vertrauensdienste",
    "EU regulation governing electronic identification and trust services (signatures, seals, time stamps). eIDAS 2.0 introduces the EU Digital Identity Wallet.",
    "EU-Verordnung über elektronische Identifizierung und Vertrauensdienste (Signaturen, Siegel, Zeitstempel). eIDAS 2.0 führt die EU Digital Identity Wallet ein.",
    ["pki", "ca"]
  ),

  // ── Cloud, OT & Emerging ───────────────────────────────────────────
  T("iam", "IAM", "cloud-ot",
    "Identity and Access Management",
    "Identity and Access Management",
    "The discipline and tooling for managing who can do what in a system — users, groups, roles, policies, sessions. In cloud contexts, the highest-leverage attack surface.",
    "Die Disziplin und das Tooling für die Verwaltung, wer was in einem System tun darf — User, Gruppen, Rollen, Policies, Sessions. In Cloud-Kontexten die hebelwirksamste Angriffsfläche.",
    ["sso", "mfa", "zero-trust"]
  ),
  T("vpc", "VPC", "cloud-ot",
    "Virtual Private Cloud",
    "Virtual Private Cloud",
    "An isolated network segment inside a public-cloud provider, with its own address space, routing, and access controls. The unit of network blast-radius in modern cloud designs.",
    "Ein isoliertes Netzwerksegment innerhalb eines Public-Cloud-Anbieters, mit eigenem Adressraum, Routing und Zugriffs-Controls. Die Einheit des Netzwerk-Blast-Radius in modernen Cloud-Architekturen.",
    ["iam"]
  ),
  T("container", "Container", "cloud-ot", null, null,
    "A lightweight, isolated process bundle that shares the host kernel but has its own filesystem, network, and process view. The standard packaging unit for cloud-native applications.",
    "Ein leichtgewichtiges, isoliertes Prozess-Bündel, das den Host-Kernel teilt, aber eigenes Dateisystem, Netzwerk und Prozess-Sicht hat. Die Standard-Paketierung für Cloud-native Anwendungen.",
    ["kubernetes", "iac"]
  ),
  T("kubernetes", "Kubernetes (K8s)", "cloud-ot", null, null,
    "An open-source orchestration system for containerized workloads. Powerful and complex; misconfigured cluster roles and exposed dashboards are the recurring weakness pattern.",
    "Ein Open-Source-Orchestrierungssystem für containerisierte Workloads. Mächtig und komplex; fehlkonfigurierte Cluster-Rollen und exponierte Dashboards sind das wiederkehrende Schwachstellenmuster.",
    ["container", "iam"]
  ),
  T("iac", "IaC", "cloud-ot",
    "Infrastructure as Code",
    "Infrastructure as Code",
    "Provisioning and configuring infrastructure through machine-readable definitions (Terraform, Pulumi, CloudFormation) rather than console clicks. Enables review and reproducibility.",
    "Bereitstellung und Konfiguration von Infrastruktur über maschinenlesbare Definitionen (Terraform, Pulumi, CloudFormation) statt Konsolen-Klicks. Ermöglicht Review und Reproduzierbarkeit.",
    ["container", "cicd"]
  ),
  T("cicd", "CI/CD", "cloud-ot",
    "Continuous Integration / Continuous Delivery",
    "Continuous Integration / Continuous Delivery",
    "The automated pipeline that builds, tests, and deploys software on every change. Security-relevant choke points are secret handling, supply-chain trust, and deployment-key custody.",
    "Die automatisierte Pipeline, die Software bei jeder Änderung baut, testet und deployt. Sicherheitsrelevante Engstellen sind Secret-Handling, Supply-Chain-Vertrauen und Verwahrung von Deployment-Keys.",
    ["iac", "devsecops"]
  ),
  T("devsecops", "DevSecOps", "cloud-ot", null, null,
    "The practice of integrating security activities — threat modeling, automated testing, dependency scanning — into the same pipeline that builds and deploys software.",
    "Die Praxis, Sicherheitsaktivitäten — Threat Modeling, automatisierte Tests, Dependency-Scanning — in dieselbe Pipeline zu integrieren, die Software baut und deployt.",
    ["cicd", "iac"]
  ),
  T("saas-paas-iaas", "SaaS / PaaS / IaaS", "cloud-ot",
    "Software, Platform, Infrastructure as a Service",
    "Software, Platform, Infrastructure as a Service",
    "Three layers of the cloud-service model. SaaS gives a finished application; PaaS gives a runtime environment; IaaS gives raw compute, storage, and network. Each shifts the security responsibility boundary.",
    "Drei Schichten des Cloud-Service-Modells. SaaS liefert eine fertige Anwendung; PaaS liefert eine Laufzeitumgebung; IaaS liefert rohe Compute-, Storage- und Netzwerk-Ressourcen. Jede verschiebt die Sicherheitsverantwortungs-Grenze.",
    ["iam", "vpc"]
  ),
  T("api-gateway", "API Gateway", "cloud-ot", null, null,
    "A managed front door for APIs — handling authentication, rate limiting, request routing, and observability. Where most modern web traffic actually first hits a security control.",
    "Eine verwaltete Eingangstür für APIs — übernimmt Authentifizierung, Rate Limiting, Request-Routing und Observability. Wo der Großteil des modernen Web-Traffics tatsächlich zuerst auf ein Sicherheits-Control trifft.",
    ["waf", "oauth", "jwt"]
  ),
  T("ics", "ICS", "cloud-ot",
    "Industrial Control Systems",
    "Industrielle Steuerungssysteme",
    "The umbrella for systems that monitor and control physical industrial processes — from a single PLC to a plant-wide DCS. Security model is fundamentally different from IT: safety and availability first, confidentiality last.",
    "Der Oberbegriff für Systeme, die physische industrielle Prozesse überwachen und steuern — vom einzelnen PLC bis zum anlagenweiten DCS. Das Sicherheitsmodell unterscheidet sich grundlegend von IT: Sicherheit und Verfügbarkeit zuerst, Vertraulichkeit zuletzt.",
    ["scada", "plc", "dcs", "ot"]
  ),
  T("scada", "SCADA", "cloud-ot",
    "Supervisory Control and Data Acquisition",
    "Supervisory Control and Data Acquisition",
    "A specific class of ICS that supervises distributed assets — pipelines, grids, water networks — via long-distance telemetry and remote control. The classic high-impact target.",
    "Eine spezifische Klasse von ICS, die verteilte Assets überwacht — Pipelines, Stromnetze, Wassernetze — über Fern-Telemetrie und Remote-Control. Das klassische High-Impact-Ziel.",
    ["ics", "plc"]
  ),
  T("plc", "PLC", "cloud-ot",
    "Programmable Logic Controller",
    "Speicherprogrammierbare Steuerung",
    "A ruggedized industrial computer that executes deterministic control logic for a single machine or cell. The atomic unit of ICS and the most common point of ladder-logic manipulation.",
    "Ein robuster Industrie-Computer, der deterministische Steuerlogik für eine einzelne Maschine oder Zelle ausführt. Die atomare Einheit eines ICS und der häufigste Angriffspunkt für Ladder-Logic-Manipulation.",
    ["ics", "hmi", "scada"]
  ),
  T("hmi", "HMI", "cloud-ot",
    "Human Machine Interface",
    "Human Machine Interface",
    "The operator-facing display and control surface for an industrial process. Increasingly browser-based, increasingly exposed to the same vulnerability classes as web applications.",
    "Die operatorseitige Anzeige- und Bedienoberfläche eines industriellen Prozesses. Zunehmend browserbasiert, zunehmend denselben Schwachstellenklassen wie Web-Anwendungen ausgesetzt.",
    ["scada", "plc"]
  ),
  T("dcs", "DCS", "cloud-ot",
    "Distributed Control System",
    "Distributed Control System",
    "An ICS variant designed for plant-scale process control — refineries, power generation, chemical plants — with controllers, HMIs, and engineering stations on a tightly integrated network.",
    "Eine ICS-Variante für anlagenweite Prozesssteuerung — Raffinerien, Energieerzeugung, Chemiewerke — mit Controllern, HMIs und Engineering-Stations in einem eng integrierten Netzwerk.",
    ["ics", "scada"]
  ),
  T("opc-ua", "OPC UA", "cloud-ot",
    "Open Platform Communications — Unified Architecture",
    "Open Platform Communications — Unified Architecture",
    "A platform-independent industrial communication protocol with first-class security (encryption, authentication, certificates). The modern replacement for the older OPC Classic.",
    "Ein plattformunabhängiges Industrie-Kommunikationsprotokoll mit erstklassiger Sicherheit (Verschlüsselung, Authentifizierung, Zertifikate). Der moderne Nachfolger des älteren OPC Classic.",
    ["modbus", "ics"]
  ),
  T("modbus", "Modbus", "cloud-ot", null, null,
    "A 1979-vintage serial industrial protocol still ubiquitous in field devices. No native authentication or encryption — security depends entirely on network isolation.",
    "Ein 1979 entstandenes serielles Industrieprotokoll, das in Feldgeräten allgegenwärtig ist. Keine native Authentifizierung oder Verschlüsselung — Sicherheit hängt vollständig von Netzwerk-Isolation ab.",
    ["opc-ua", "ics"]
  ),
  T("iot", "IoT", "cloud-ot",
    "Internet of Things",
    "Internet of Things",
    "Network-connected embedded devices outside the traditional IT inventory — sensors, cameras, building automation, consumer electronics. Notorious for unpatched stacks and hardcoded credentials.",
    "Vernetzte Embedded-Geräte außerhalb des klassischen IT-Inventars — Sensoren, Kameras, Gebäudeautomation, Consumer-Elektronik. Berüchtigt für ungepatche Stacks und hardcodierte Credentials.",
    ["ot", "hardcoded-creds"]
  ),
  T("ot", "OT", "cloud-ot",
    "Operational Technology",
    "Operational Technology",
    "The umbrella for technology that interacts with the physical world — ICS, SCADA, building automation, medical devices. Differentiated from IT by its different priorities (safety, availability) and far longer lifecycles.",
    "Der Oberbegriff für Technologie, die mit der physischen Welt interagiert — ICS, SCADA, Gebäudeautomation, Medizingeräte. Unterscheidet sich von IT durch andere Prioritäten (Safety, Verfügbarkeit) und deutlich längere Lebenszyklen.",
    ["ics", "iot"]
  ),
  T("edge-computing", "Edge Computing", "cloud-ot", null, null,
    "Compute and storage placed close to data sources or end users, instead of in a central data center or cloud region. Reduces latency; multiplies the attack surface that must be physically protected.",
    "Compute und Storage in der Nähe von Datenquellen oder Endnutzern, statt in zentralen Rechenzentren oder Cloud-Regionen. Reduziert Latenz; vervielfacht die physisch zu schützende Angriffsfläche.",
    ["iot", "ot"]
  ),

  // ── Cross-cutting (mapped into closest category for filtering) ────
  T("cve", "CVE", "vuln-class",
    "Common Vulnerabilities and Exposures",
    "Common Vulnerabilities and Exposures",
    "The MITRE-curated identifier system for publicly disclosed vulnerabilities. A CVE is a name; CVSS is a score; KEV is a curated subset of actively exploited ones.",
    "Das von MITRE kuratierte Identifier-System für öffentlich bekannt gemachte Schwachstellen. Ein CVE ist ein Name; CVSS ist eine Bewertung; KEV ist ein kuratiertes Subset aktiv ausgenutzter CVEs.",
    ["cvss", "cwe", "zero-day"]
  ),
  T("cvss", "CVSS", "vuln-class",
    "Common Vulnerability Scoring System",
    "Common Vulnerability Scoring System",
    "A standardized 0.0–10.0 severity-scoring framework for vulnerabilities. CVSS 3.1 is the current widespread version; CVSS 4.0 (2023) adds more contextual metrics.",
    "Ein standardisiertes Severity-Bewertungs-Framework von 0,0 bis 10,0 für Schwachstellen. CVSS 3.1 ist die aktuell verbreitete Version; CVSS 4.0 (2023) ergänzt weitere Kontext-Metriken.",
    ["cve", "cwe"]
  ),
  T("cwe", "CWE", "vuln-class",
    "Common Weakness Enumeration",
    "Common Weakness Enumeration",
    "A MITRE-curated taxonomy of software-weakness types. Where CVE names a specific instance, CWE names the class of weakness it belongs to.",
    "Eine von MITRE kuratierte Taxonomie für Software-Schwachstellen-Typen. Wo CVE eine spezifische Instanz benennt, benennt CWE die Klasse, zu der sie gehört.",
    ["cve", "cvss"]
  ),
  T("zero-day", "Zero-Day", "vuln-class", null, null,
    "A vulnerability for which no public patch yet exists at the time of exploitation. The countdown nickname; in practice the meaningful question is exploitation visibility, not patch existence.",
    "Eine Schwachstelle, für die zum Zeitpunkt der Ausnutzung noch kein öffentlicher Patch existiert. Ein Countdown-Begriff; in der Praxis ist die aussagekräftige Frage die Sichtbarkeit der Ausnutzung, nicht die Existenz des Patches.",
    ["cve", "exploit"]
  ),
  T("exploit", "Exploit", "vuln-class", null, null,
    "Working code that takes a vulnerability from theoretical to actual — gaining unauthorized access, execution, or data. Distinct from a proof-of-concept by intent and reliability.",
    "Funktionierender Code, der eine Schwachstelle von theoretisch zu praktisch macht — unauthorisierten Zugriff, Ausführung oder Daten zu erlangen. Unterscheidet sich von einem Proof-of-Concept durch Intent und Zuverlässigkeit.",
    ["poc", "zero-day", "cve"]
  ),
  T("poc", "Proof-of-Concept (PoC)", "vuln-class", null, null,
    "Minimal demonstration code that proves a vulnerability is real and exploitable, often used to convince a vendor or stakeholder. Not engineered for reliability or weaponization.",
    "Minimaler Demonstrations-Code, der zeigt, dass eine Schwachstelle real und ausnutzbar ist — häufig eingesetzt, um Anbieter oder Stakeholder zu überzeugen. Nicht auf Zuverlässigkeit oder Weaponization ausgelegt.",
    ["exploit", "cve"]
  ),
  T("sandbox", "Sandbox", "defense", null, null,
    "An isolated runtime environment in which untrusted code or files are executed, so their behavior can be observed without affecting the host. Used in malware analysis and in browser security architectures.",
    "Eine isolierte Laufzeitumgebung, in der nicht vertrauenswürdiger Code oder Dateien ausgeführt werden, sodass ihr Verhalten beobachtet werden kann, ohne den Host zu beeinflussen. Wird in der Malware-Analyse und in Browser-Sicherheitsarchitekturen verwendet.",
    ["edr", "honeypot"]
  ),
  T("honeypot", "Honeypot", "defense", null, null,
    "An intentionally exposed system with no legitimate purpose, designed to attract attackers so their behavior — and indicators — can be captured. Useful for early-warning and threat intelligence.",
    "Ein absichtlich exponiertes System ohne legitimen Zweck, das Angreifer anlocken soll, sodass deren Verhalten — und Indicators — erfasst werden können. Nützlich für Frühwarnung und Threat Intelligence.",
    ["ioc", "threat-hunting"]
  )
];

// ── Derived shapes ──────────────────────────────────────────────────

function sortedTermsFor(locale) {
  const arr = TERMS.slice();
  const collator = locale === "de" ? "de" : "en";
  arr.sort((a, b) =>
    displayTerm(a, locale).localeCompare(displayTerm(b, locale), collator, { sensitivity: "base" })
  );
  return arr;
}

function firstLetter(term) {
  const stripped = term.replace(/[^A-Za-z]/g, "");
  return stripped ? stripped[0].toUpperCase() : "#";
}

function groupedByLetter(termsSorted, locale) {
  const out = {};
  const order = [];
  for (const t of termsSorted) {
    const letter = firstLetter(displayTerm(t, locale));
    if (!out[letter]) {
      out[letter] = [];
      order.push(letter);
    }
    out[letter].push(t);
  }
  return order.map((letter) => ({ letter, entries: out[letter] }));
}

function statsFor(terms, locale) {
  const perCategory = {};
  for (const c of CATEGORIES) perCategory[c.id] = 0;
  for (const t of terms) {
    if (perCategory[t.category] !== undefined) perCategory[t.category]++;
  }
  return {
    total: terms.length,
    categories: CATEGORIES.length,
    letters: new Set(terms.map((t) => firstLetter(displayTerm(t, locale)))).size,
    perCategory
  };
}

const sortedByLocale = {
  en: sortedTermsFor("en"),
  de: sortedTermsFor("de")
};
const groupedByLocale = {
  en: groupedByLetter(sortedByLocale.en, "en"),
  de: groupedByLetter(sortedByLocale.de, "de")
};
const sorted = sortedByLocale.en;
const grouped = groupedByLocale.en;

// Pre-computed lookup maps so the Nunjucks template never has to do
// nested `set inside for` to resolve a category label or a cross-ref term.
const categoryLabelById = { en: {}, de: {} };
for (const c of CATEGORIES) {
  categoryLabelById.en[c.id] = c.label.en;
  categoryLabelById.de[c.id] = c.label.de;
}

const termById = { en: {}, de: {} };
for (const locale of ["en", "de"]) {
  for (const t of sortedByLocale[locale]) {
    termById[locale][t.id] = displayTerm(t, locale);
  }
}

const presentLettersByLocale = { en: {}, de: {} };
for (const locale of ["en", "de"]) {
  for (const g of groupedByLocale[locale]) presentLettersByLocale[locale][g.letter] = true;
}

module.exports = {
  categories: CATEGORIES,
  sorted,
  grouped,
  sortedByLocale,
  groupedByLocale,
  stats: statsFor(sorted, "en"),
  statsByLocale: {
    en: statsFor(sortedByLocale.en, "en"),
    de: statsFor(sortedByLocale.de, "de")
  },
  categoryLabelById,
  termById,
  presentLetters: presentLettersByLocale.en,
  presentLettersByLocale,
  displayTerm,
  alphabet: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
};

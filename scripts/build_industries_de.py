#!/usr/bin/env python3
"""Generate German industry pages from EN templates."""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from de_shared import ANNOUNCEMENT, FOOTER_TAGLINE  # noqa: E402

FILES = [
    "industries.html",
    "industries-insurance.html",
    "industries-financial-services.html",
    "industries-critical-infrastructure.html",
    "industries-automotive.html",
    "industries-enterprise.html",
]

INDUSTRY_SLUGS = [
    "insurance",
    "financial-services",
    "critical-infrastructure",
    "automotive",
    "enterprise",
]


def apply_pairs(text: str, pairs: list[tuple[str, str]]) -> str:
    for old, new in pairs:
        text = text.replace(old, new)
    return text


def localize_shell(text: str) -> str:
    text = text.replace('<html lang="en"', '<html lang="de"')
    text = text.replace('<span class="v-announcement-tag">New</span>', '<span class="v-announcement-tag">Neu</span>')
    text = text.replace(ANNOUNCEMENT[0], ANNOUNCEMENT[1])
    text = text.replace("Read the paper →", "Whitepaper lesen →")
    text = text.replace('aria-label="VORNAC home"', 'aria-label="VORNAC Startseite"')
    text = text.replace('aria-label="Menu"', 'aria-label="Menü"')
    text = text.replace('aria-label="Open menu"', 'aria-label="Menü öffnen"')

    text = text.replace('<a href="/" class="flex items-center gap-3"', '<a href="/de" class="flex items-center gap-3"')
    text = text.replace('<a href="/" class="text-stone-500 hover:text-stone-900 transition-colors">Home</a>',
                        '<a href="/de" class="text-stone-500 hover:text-stone-900 transition-colors">Home</a>')
    text = text.replace('<a href="/" class="text-lg font-medium text-stone-600">Home</a>',
                        '<a href="/de" class="text-lg font-medium text-stone-600">Home</a>')
    text = text.replace('<a href="/" class="text-lg font-medium text-stone-600 hover:text-stone-900">Home</a>',
                        '<a href="/de" class="text-lg font-medium text-stone-600 hover:text-stone-900">Home</a>')

    text = text.replace('href="/pentesting#coverage"', 'href="/pentesting_de#coverage"')
    text = text.replace('href="/pentesting"', 'href="/pentesting_de"')
    text = text.replace('href="/about"', 'href="/about_de"')
    text = text.replace('>About</a>', '>Über uns</a>')
    text = text.replace('>Industries</a>', '>Branchen</a>')
    text = text.replace('>Book Demo</a>', '>Demo buchen</a>')
    text = text.replace('Book Demo', 'Demo buchen')
    text = text.replace('Book a demo', 'Demo buchen')
    text = text.replace('See the platform', 'Zur Plattform')
    text = text.replace('See coverage', 'Zum Umfang')
    text = text.replace('How VORNAC works →', 'So funktioniert VORNAC →')
    text = text.replace('All industries', 'Alle Branchen')
    text = text.replace('Industries</a>', 'Branchen</a>')
    text = text.replace('>Privacy Policy</a>', '>Datenschutz</a>')
    text = text.replace('>Imprint</a>', '>Impressum</a>')
    text = text.replace('All rights reserved.', 'Alle Rechte vorbehalten.')
    text = text.replace(FOOTER_TAGLINE[0], FOOTER_TAGLINE[1])

    for slug in INDUSTRY_SLUGS:
        text = text.replace(f'href="/industries-{slug}"', f'href="/industries-{slug}_de"')

    text = text.replace('href="/industries" class="text-stone-900 font-semibold border-b-2 border-amber-500">Branchen</a>',
                        'href="/industries_de" class="text-stone-900 font-semibold border-b-2 border-amber-500">Branchen</a>')
    text = text.replace('href="/industries" class="text-lg font-medium text-amber-600">Branchen</a>',
                        'href="/industries_de" class="text-lg font-medium text-amber-600">Branchen</a>')
    text = text.replace('<a href="/industries">Branchen</a>', '<a href="/industries_de">Branchen</a>')
    text = text.replace('<a href="/industries" class="hover:text-white">Branchen</a>',
                        '<a href="/industries_de" class="hover:text-white">Branchen</a>')
    text = text.replace('aria-label="Industries by sector"', 'aria-label="Branchen nach Sektor"')

    def canon_sub(m: re.Match[str]) -> str:
        path = m.group(2)
        if path.endswith("_de"):
            return m.group(0)
        return f'{m.group(1)}{path}_de{m.group(3)}'

    text = re.sub(
        r'(href="https://www\.vornac\.com/)(industries[^"]*)(")',
        canon_sub,
        text,
    )
    return text


HUB_PAIRS: list[tuple[str, str]] = [
    ("<title>Industries — Continuous validation by sector | VORNAC</title>",
     "<title>Branchen — Kontinuierliche Validierung nach Sektor | VORNAC</title>"),
    ('content="VORNAC continuous pentesting mapped to the regulations that govern your industry — DORA, NIS2, KRITIS, BaFin VAIT/BAIT, and TISAX."',
     'content="Kontinuierliches Pentesting von VORNAC — zugeordnet zu DORA, NIS2, KRITIS, BaFin VAIT/BAIT und TISAX in Ihrer Branche."'),
    ("Your sector. Your regulator. <span class=\"ind-hub-headline-emph\">Continuous validation built in.</span>",
     "Ihre Branche. Ihre Aufsicht. <span class=\"ind-hub-headline-emph\">Kontinuierliche Validierung von Anfang an.</span>"),
    ("VORNAC maps every finding to the article clauses your auditors already use — by industry, not as a generic checklist.",
     "VORNAC ordnet jeden Befund den Artikeln zu, die Ihre Auditoren bereits kennen — branchenspezifisch, nicht als generische Checkliste."),
    ("ICT risk management, resilience testing, and third-party oversight for insurers and insurance groups.",
     "IKT-Risikomanagement, Resilienztests und Überwachung von Drittanbietern für Versicherer und Versicherungsgruppen."),
    ("<h2 class=\"ind-hub-row-title\">Insurance</h2>", "<h2 class=\"ind-hub-row-title\">Versicherung</h2>"),
    ("Banks, payment institutions, and asset managers — EU resilience plus BaFin IT and outsourcing depth.",
     "Banken, Zahlungsinstitute und Vermögensverwalter — EU-Resilienz plus BaFin-Anforderungen an IT und Outsourcing."),
    ("<h2 class=\"ind-hub-row-title\">Financial services</h2>", "<h2 class=\"ind-hub-row-title\">Finanzdienstleistungen</h2>"),
    ("Energy, transport, healthcare operators, and essential services — national resilience requirements.",
     "Energie, Transport, Gesundheitswesen und leistungskritische Betreiber — nationale Resilienzanforderungen."),
    ("<h2 class=\"ind-hub-row-title\">Critical infrastructure</h2>", "<h2 class=\"ind-hub-row-title\">Kritische Infrastruktur</h2>"),
    ("OEMs and suppliers — assessment alignment plus continuous validation of connected systems and binaries.",
     "OEMs und Zulieferer — Abstimmung mit Assessments plus kontinuierliche Prüfung vernetzter Systeme und Software-Artefakte."),
    ("<h2 class=\"ind-hub-row-title\">Automotive</h2>", "<h2 class=\"ind-hub-row-title\">Automotive</h2>"),
    ("Essential and important entities — Article 21 measures, proven on live production, audit-ready by clause.",
     "Wesentliche und wichtige Einrichtungen — Artikel-21-Maßnahmen, in Produktion belegt, auditbereit auf Artikelebene."),
    ("<h2 class=\"ind-hub-row-title\">Enterprise</h2>", "<h2 class=\"ind-hub-row-title\">Enterprise</h2>"),
    ("Methodology, coverage scope, and credentials — on the product page.",
     "Methodik, Abdeckungsumfang und Credentials — auf der Produktseite."),
]

INSURANCE_PAIRS: list[tuple[str, str]] = [
    ("<title>Insurance — Continuous validation under DORA | VORNAC</title>",
     "<title>Versicherung — Kontinuierliche Validierung unter DORA | VORNAC</title>"),
    ('content="Continuous pentesting for insurers under DORA — ICT risk management, resilience testing, and audit-ready reports mapped to article-level clauses."',
     'content="Kontinuierliches Pentesting für Versicherer unter DORA — IKT-Risikomanagement, Resilienztests und auditfähige Berichte auf Artikelebene."'),
    ("<a href=\"/industries_de\">Branchen</a> / Insurance", "<a href=\"/industries_de\">Branchen</a> / Versicherung"),
    ("Continuous validation for insurers under <span class=\"ind-hero-headline-emph\">DORA</span>",
     "Kontinuierliche Validierung für Versicherer unter <span class=\"ind-hero-headline-emph\">DORA</span>"),
    ("Insurance undertakings and groups face binding ICT risk, incident, and resilience requirements. VORNAC proves exploitability on live systems and maps every finding to the DORA articles your supervisors expect — continuously, not once a year.",
     "Versicherungsunternehmen und -gruppen unterliegen verbindlichen Anforderungen zu IKT-Risiko, Vorfällen und Resilienz. VORNAC belegt die Ausnutzbarkeit in produktiven Systemen und ordnet jeden Befund den DORA-Artikeln zu, die Ihre Aufsicht erwartet — kontinuierlich, nicht einmal im Jahr."),
    ("What DORA requires from insurers", "Was DORA von Versicherern verlangt"),
    ("The Digital Operational Resilience Act applies to insurance undertakings and groups. Supervisors expect demonstrable ICT risk management — not policy documents alone.",
     "DORA gilt für Versicherungsunternehmen und -gruppen. Aufsichtsbehörden erwarten nachweisbares IKT-Risikomanagement — nicht nur Policy-Dokumente."),
    ("ICT risk management", "IKT-Risikomanagement"),
    ("Documented frameworks, governance, and controls over ICT assets — including identification of critical functions and supporting systems.",
     "Dokumentierte Frameworks, Governance und Kontrollen über IKT-Assets — inklusive Identifikation kritischer Funktionen und unterstützender Systeme."),
    ("Incident reporting", "Incident-Reporting"),
    ("Major ICT-related incidents must be classified, reported, and root-caused. You need evidence that detection and response actually work.",
     "Schwere IKT-Vorfälle müssen klassifiziert, gemeldet und bis zur Ursache aufgearbeitet werden. Sie brauchen Belege, dass Erkennung und Reaktion wirklich funktionieren."),
    ("Digital operational resilience testing", "Digitale operationale Resilienztests"),
    ("Threat-led penetration testing (TLPT) and resilience testing on critical ICT systems — with results that supervisors can verify.",
     "Threat-led Penetration Testing (TLPT) und Resilienztests auf kritischen IKT-Systemen — mit Ergebnissen, die Aufsicht prüfen kann."),
    ("Third-party ICT risk", "Third-Party-IKT-Risiko"),
    ("Oversight of critical ICT service providers, contractual safeguards, and concentration risk — including validation of what providers expose in your perimeter.",
     "Überwachung kritischer IKT-Dienstleister, vertragliche Absicherung und Klumpenrisiken — inklusive Prüfung dessen, was Anbieter in Ihrer Angriffsfläche offenlegen."),
    ("Annual pentests leave 364 days of blind spots", "Jährliche Pentests lassen 364 Tage blinde Flecken"),
    ("Point-in-time assessments cannot prove resilience when your claims platforms, policy admin systems, and partner APIs change every sprint. Regulators are moving toward continuous evidence — not PDFs from last year.",
     "Stichtagsprüfungen belegen keine Resilienz, wenn Schaden-, Policen- und Partner-Systeme sich jeden Sprint ändern. Aufsichtsbehörden erwarten fortlaufende Nachweise — keine PDFs vom letzten Jahr."),
    ("False positives — every finding exploit-proven with reproducible PoC.", "Keine Fehlalarme — jeder Befund mit nachgewiesener Ausnutzbarkeit und reproduzierbarem Nachweis."),
    ("How VORNAC helps insurers", "So hilft VORNAC Versicherern"),
    ("Continuous adversarial validation with reports your risk, compliance, and audit teams can use without rewriting.",
     "Kontinuierliche Angriffssimulation mit Berichten, die Risiko-, Compliance- und Audit-Teams direkt nutzen können."),
    ("Article-mapped findings", "Befunde mit Artikelzuordnung"),
    ("Each vulnerability is tied to the relevant DORA article and control expectation — ready for internal audit and supervisory dialogue.",
     "Jede Schwachstelle ist dem relevanten DORA-Artikel und der erwarteten Kontrolle zugeordnet — bereit für internes Audit und Aufsichtsgespräch."),
    ("TLPT-ready evidence", "Nachweise für TLPT"),
    ("Real attack chains across your live environment, not theoretical CVE lists. Proof-of-concept for every finding, cryptographically signed.",
     "Echte Angriffsketten in Ihrer produktiven Umgebung, keine theoretischen CVE-Listen. Nachweis pro Befund, kryptografisch signiert."),
    ("Continuous, production-safe cadence", "Kontinuierlich und produktionssicher"),
    ("Validate on every release and on demand via API — non-destructive in production, hosted in Germany under BDSG and GDPR.",
     "Prüfung bei jedem Release und bei Bedarf per API — nicht-destruktiv in Produktion, in Deutschland unter BDSG und DSGVO."),
    ("Also relevant for you", "Für Sie auch relevant"),
    ("Financial services (DORA · VAIT)", "Finanzdienstleistungen (DORA · VAIT)"),
    ("Enterprise (NIS2)", "Enterprise (NIS2)"),
    ("Prove resilience to your supervisor — <em>continuously</em>.", "Resilienz gegenüber der Aufsicht belegen — <em>kontinuierlich</em>."),
    ("30-minute session. We map your insurance ICT landscape to a continuous DORA-aligned validation cycle.",
     "30-Minuten-Session: Wir ordnen Ihre Versicherungs-IKT-Landschaft einem kontinuierlichen, DORA-konformen Validierungszyklus zu."),
]

FINANCIAL_PAIRS: list[tuple[str, str]] = [
    ("<title>Financial services — DORA, VAIT &amp; BAIT validation | VORNAC</title>",
     "<title>Finanzdienstleistungen — DORA, VAIT &amp; BAIT Validierung | VORNAC</title>"),
    ('content="Continuous pentesting for banks and financial institutions — DORA resilience testing plus BaFin VAIT/BAIT-aligned reports, exploit-proven on production."',
     'content="Kontinuierliches Pentesting für Banken und Finanzinstitute — DORA-Resilienztests und Berichte nach BaFin VAIT/BAIT, mit nachgewiesener Ausnutzbarkeit in Produktion."'),
    ("Industries</a> / Financial services", "Branchen</a> / Finanzdienstleistungen"),
    ("Continuous validation for <span class=\"ind-hero-headline-emph\">banks and financial institutions</span>",
     "Kontinuierliche Validierung für <span class=\"ind-hero-headline-emph\">Banken und Finanzinstitute</span>"),
    ("DORA sets EU-wide operational resilience expectations. BaFin VAIT and BAIT add German-specific IT and outsourcing depth. VORNAC delivers exploit-proven findings mapped to the clauses both supervisors use — on live systems, every release.",
     "DORA definiert EU-weite Erwartungen an operative Resilienz. BaFin VAIT und BAIT ergänzen deutsche Anforderungen an IT und Outsourcing. VORNAC liefert Befunde mit nachgewiesener Ausnutzbarkeit, zugeordnet zu den Artikeln beider Aufsichten — in produktiven Systemen, bei jedem Release."),
    ("What regulators expect", "Was Regulatoren erwarten"),
    ("Financial entities must demonstrate ICT resilience, outsourcing control, and testing discipline — under EU and German supervision.",
     "Finanzunternehmen müssen IKT-Resilienz, Outsourcing-Kontrolle und Testdisziplin unter EU- und deutscher Aufsicht nachweisen."),
    ("DORA operational resilience", "DORA operationale Resilienz"),
    ("ICT risk management, incident classification, resilience testing including TLPT on critical systems.",
     "IKT-Risikomanagement, Incident-Klassifikation, Resilienztests inkl. TLPT auf kritischen Systemen."),
    ("BaFin VAIT (insurance groups)", "BaFin VAIT (Versicherungsgruppen)"),
    ("IT governance, information security, and continuity requirements for supervised insurance groups where applicable.",
     "IT-Governance, Informationssicherheit und Kontinuitätsanforderungen für beaufsichtigte Versicherungsgruppen, wo anwendbar."),
    ("BaFin BAIT (banks)", "BaFin BAIT (Banken)"),
    ("IT systems, information security, and outsourcing requirements for credit institutions and financial services institutions.",
     "IT-Systeme, Informationssicherheit und Outsourcing-Anforderungen für Kreditinstitute und Finanzdienstleistungsinstitute."),
    ("Outsourcing &amp; cloud", "Outsourcing &amp; Cloud"),
    ("Critical and important functions — contractual, monitoring, and exit requirements for ICT service providers.",
     "Kritische und wichtige Funktionen — vertragliche, Monitoring- und Exit-Anforderungen für IKT-Dienstleister."),
    ("Supervisors want proof, not posture slides", "Aufsicht will Nachweise, keine Folien"),
    ("Annual pentest PDFs rarely survive BaFin or ECB scrutiny when core banking, payment rails, and trading interfaces change weekly. Continuous, signed exploit evidence closes the gap.",
     "Jährliche Pentest-PDFs überstehen selten BaFin- oder EZB-Prüfungen, wenn Kernbankensysteme, Zahlungswege und Handelsschnittstellen wöchentlich wechseln. Kontinuierliche, signierte Exploit-Nachweise schließen die Lücke."),
    ("Reports accepted on first auditor pass — article-mapped to your frameworks.", "Berichte beim ersten Audit ohne Nacharbeit — den Artikeln Ihrer Regelwerke zugeordnet."),
    ("How VORNAC helps", "So hilft VORNAC"),
    ("Multi-framework mapping", "Zuordnung mehrerer Regelwerke"),
    ("DORA, VAIT, BAIT, NIS2, and TISAX where relevant — one finding, multiple clause references where applicable.",
     "DORA, VAIT, BAIT, NIS2 und TISAX wo relevant — ein Befund, mehrere Artikelreferenzen wo anwendbar."),
    ("Production-safe adversarial testing", "Produktionssichere Angriffssimulation"),
    ("Non-destructive emulation on live environments — no maintenance windows required for external surface validation.",
     "Nicht-destruktive Simulation in produktiven Umgebungen — keine Wartungsfenster für die externe Angriffsfläche nötig."),
    ("German jurisdiction by default", "Deutsche Jurisdiktion standardmäßig"),
    ("EU-hosted, German-operated — no US Cloud Act exposure for supervisory data and findings.",
     "Hosting in der EU, Betrieb in Deutschland — kein US Cloud Act für Aufsichtsdaten und Befunde."),
    ("Also relevant", "Auch relevant"),
    ("Insurance (DORA)", "Versicherung (DORA)"),
    ("One validation cycle. <em>Every framework your auditors ask for.</em>", "Ein Validierungszyklus. <em>Jedes Framework, das Ihre Auditoren fragen.</em>"),
    ("Book a 30-minute session — we scope your financial ICT landscape to continuous, clause-mapped testing.",
     "30-Minuten-Session buchen — wir grenzen Ihre Finanz-IKT-Landschaft für kontinuierliche, artikelbezogene Tests ab."),
]

KRITIS_PAIRS: list[tuple[str, str]] = [
    ("<title>Critical infrastructure — KRITIS &amp; NIS2 validation | VORNAC</title>",
     "<title>Kritische Infrastruktur — KRITIS &amp; NIS2 Validierung | VORNAC</title>"),
    ('content="Continuous pentesting for KRITIS operators and NIS2 essential entities — energy, transport, healthcare, and essential services in Germany."',
     'content="Kontinuierliches Pentesting für KRITIS-Betreiber und NIS2-wesentliche Einrichtungen — Energie, Transport, Gesundheit und leistungskritische Dienste in Deutschland."'),
    ("Industries</a> / Critical infrastructure", "Branchen</a> / Kritische Infrastruktur"),
    ("Resilience testing for <span class=\"ind-hero-headline-emph\">KRITIS and essential services</span>",
     "Resilienztests für <span class=\"ind-hero-headline-emph\">KRITIS und leistungskritische Dienste</span>"),
    ("Operators of energy, water, transport, healthcare, and other essential facilities face KRITIS obligations and NIS2 essential-entity requirements. VORNAC validates your live OT/IT boundary and production systems with exploit-proven findings — mapped to the clauses BSI and sector regulators expect.",
     "Betreiber von Energie, Wasser, Transport, Gesundheit und anderen leistungskritischen Anlagen unterliegen KRITIS und NIS2. VORNAC prüft Ihre OT/IT-Grenze und Produktionssysteme mit nachgewiesener Ausnutzbarkeit — zugeordnet zu den Artikeln von BSI und Branchenaufsicht."),
    ("What KRITIS and NIS2 require", "Was KRITIS und NIS2 verlangen"),
    ("Germany&rsquo;s KRITIS umbrella and the NIS2 Directive set concrete security and incident obligations for operators of essential services.",
     "Das deutsche KRITIS-Dach und die NIS2-Richtlinie setzen konkrete Sicherheits- und Incident-Pflichten für Betreiber leistungskritischer Dienste."),
    ("KRITIS security standards", "KRITIS-Sicherheitsstandards"),
    ("Sector-specific requirements (e.g. energy, IT, transport) for protection of critical components and proof of effective security measures.",
     "Sektorspezifische Anforderungen (z. B. Energie, IT, Transport) zum Schutz kritischer Komponenten und Nachweis wirksamer Sicherheitsmaßnahmen."),
    ("NIS2 Article 21 measures", "NIS2 Artikel-21-Maßnahmen"),
    ("Risk management, incident handling, supply chain security, and testing of cybersecurity defenses for essential and important entities.",
     "Risikomanagement, Incident Handling, Supply-Chain-Security und Tests der Cybersecurity-Defenses für wesentliche und wichtige Einrichtungen."),
    ("Incident &amp; reporting", "Incident &amp; Reporting"),
    ("Timely detection, response, and notification — regulators expect evidence that controls work under real attack conditions.",
     "Zeitnahe Erkennung, Reaktion und Meldung — Aufsicht erwartet Belege, dass Kontrollen unter realen Angriffsbedingungen wirken."),
    ("OT / IT convergence", "OT / IT-Konvergenz"),
    ("Increasing connectivity between operational technology and corporate IT expands the attack surface — both must be validated.",
     "Wachsende Konnektivität zwischen OT und Unternehmens-IT erweitert die Angriffsfläche — beides muss validiert werden."),
    ("Sampled scope is not resilience", "Stichproben-Scope ist keine Resilienz"),
    ("KRITIS audits fail when &ldquo;representative&rdquo; IP ranges miss the segment where an attacker actually moves. VORNAC tests the full attack surface every cycle.",
     "KRITIS-Audits scheitern, wenn „repräsentative“ IP-Ranges das Segment verfehlen, in dem Angreifer wirklich bewegen. VORNAC testet die volle Angriffsfläche jeden Zyklus."),
    ("Attack surface coverage per cycle — cloud, on-prem, APIs, VPN.", "Angriffsfläche pro Zyklus — Cloud, On-Premises, APIs, VPN."),
    ("How VORNAC helps operators", "So unterstützt VORNAC Betreiber"),
    ("BSI-aligned evidence", "Nachweise im BSI-Kontext"),
    ("Findings structured for KRITIS and NIS2 supervisory dialogue — not generic scanner output.",
     "Befunde strukturiert für KRITIS- und NIS2-Gespräche mit der Aufsicht — kein generischer Scanner-Output."),
    ("Continuous cadence", "Kontinuierliche Taktung"),
    ("Validate after every infrastructure change and release — not once per audit cycle.",
     "Validierung nach jeder Infra-Änderung und jedem Release — nicht einmal pro Audit-Zyklus."),
    ("Made &amp; hosted in Germany", "Made &amp; hosted in Germany"),
    ("Data and operations stay in German jurisdiction — critical for national infrastructure operators.",
     "Daten und Betrieb bleiben in deutscher Jurisdiktion — kritisch für nationale Infrastrukturbetreiber."),
    ("Prove KRITIS resilience <em>before</em> the regulator asks.", "KRITIS-Resilienz belegen, <em>bevor</em> der Regulator fragt."),
]

AUTOMOTIVE_PAIRS: list[tuple[str, str]] = [
    ("<title>Automotive — TISAX &amp; continuous validation | VORNAC</title>",
     "<title>Automotive — TISAX &amp; kontinuierliche Validierung | VORNAC</title>"),
    ('content="Continuous pentesting for automotive OEMs and suppliers — TISAX-aligned validation plus adversarial testing of connected vehicles, APIs, and binaries."',
     'content="Kontinuierliches Pentesting für Automotive-OEMs und Zulieferer — TISAX-konforme Validierung plus Angriffstests an vernetzten Fahrzeugen, APIs und Software-Artefakten."'),
    ("Industries</a> / Automotive", "Branchen</a> / Automotive"),
    ("Security validation for <span class=\"ind-hero-headline-emph\">automotive supply chains</span>",
     "Security-Validierung für <span class=\"ind-hero-headline-emph\">Automotive-Lieferketten</span>"),
    ("OEMs and Tier suppliers must satisfy TISAX and customer audit programs while shipping connected software faster. VORNAC adds continuous, exploit-proven adversarial validation — web, APIs, binaries, and cloud — with evidence your assessors can verify.",
     "OEMs und Zulieferer müssen TISAX und Kunden-Audits erfüllen und gleichzeitig schneller vernetzte Software ausliefern. VORNAC ergänzt kontinuierliche Validierung mit nachgewiesener Ausnutzbarkeit — Web, APIs, Software-Artefakte und Cloud — mit Nachweisen für Ihre Prüfer."),
    ("What TISAX and OEM programs require", "Was TISAX und OEM-Programme verlangen"),
    ("Information security assessment for the automotive industry — plus customer-specific requirements on connected products.",
     "Informationssicherheits-Assessment für die Automotive-Industrie — plus kundenspezifische Anforderungen an vernetzte Produkte."),
    ("TISAX assessment objectives", "TISAX-Assessment-Ziele"),
    ("Protection levels aligned with VDA ISA — prototype protection, data protection, and connection to third parties.",
     "Schutzstufen abgestimmt mit VDA ISA — Prototypenschutz, Datenschutz und Anbindung an Dritte."),
    ("Connected vehicle &amp; backend", "Connected Vehicle &amp; Backend"),
    ("Telematics, OTA updates, mobile apps, and API backends — real attack paths, not checkbox scans.",
     "Telematik, OTA-Updates, Mobile Apps und API-Backends — echte Angriffspfade, keine Checkbox-Scans."),
    ("Binary &amp; embedded software", "Binary &amp; Embedded Software"),
    (".exe, .dmg, firmware, and ECU-related deliverables — reverse engineering and exploit validation where applicable.",
     ".exe, .dmg, Firmware und ECU-bezogene Deliverables — Reverse Engineering und Exploit-Validierung wo anwendbar."),
    ("Supplier cascade", "Supplier-Kaskade"),
    ("Tier-N suppliers must prove the same rigor as OEMs — continuous evidence beats annual assessment snapshots.",
     "Tier-N-Zulieferer müssen dieselbe Rigur wie OEMs belegen — kontinuierliche Evidenz schlägt jährliche Assessment-Snapshots."),
    ("TISAX every three years is not enough", "TISAX alle drei Jahre reicht nicht"),
    ("New vehicle lines, supplier integrations, and OTA releases change your exposure between assessments. Continuous validation keeps your label and your customers&rsquo; trust.",
     "Neue Fahrzeuglinien, Supplier-Integrationen und OTA-Releases ändern Ihre Exposure zwischen Assessments. Kontinuierliche Validierung hält Label und Kundenvertrauen."),
    ("From trigger to actionable finding — on every release.", "Vom Start bis zum umsetzbaren Befund — bei jedem Release."),
    ("How VORNAC helps automotive", "So hilft VORNAC in der Automotive-Branche"),
    ("TISAX-mapped reporting", "Berichte mit TISAX-Bezug"),
    ("Findings aligned to assessment objectives and control expectations — ready for ENX and customer audits.",
     "Befunde abgestimmt auf Assessment-Ziele und Kontrollerwartungen — bereit für ENX und Kunden-Audits."),
    ("Full-stack coverage", "Full-Stack-Abdeckung"),
    ("External surface, cloud, APIs, binaries (.exe, .dmg, .apk) — one platform, one evidence trail.",
     "Externe Fläche, Cloud, APIs, Binaries (.exe, .dmg, .apk) — eine Plattform, ein Evidenz-Trail."),
    ("EU / German operations", "EU / deutscher Betrieb"),
    ("No US-jurisdiction tooling for prototype and production data — built for European automotive supply chains.",
     "Kein US-Jurisdiction-Tooling für Prototyp- und Produktionsdaten — gebaut für europäische Automotive-Lieferketten."),
    ("Keep TISAX evidence <em>current</em> between assessments.", "TISAX-Evidenz zwischen Assessments <em>aktuell</em> halten."),
]

ENTERPRISE_PAIRS: list[tuple[str, str]] = [
    ("<title>Enterprise — NIS2 continuous validation | VORNAC</title>",
     "<title>Enterprise — NIS2 kontinuierliche Validierung | VORNAC</title>"),
    ('content="Continuous pentesting for NIS2 essential and important entities — Article 21 cybersecurity measures, proven on live production, audit-ready by clause."',
     'content="Kontinuierliches Pentesting für NIS2-wesentliche und -wichtige Einrichtungen — Artikel-21-Maßnahmen, in Produktion belegt, auditbereit auf Artikelebene."'),
    ("Industries</a> / Enterprise", "Branchen</a> / Enterprise"),
    ("NIS2-ready validation for <span class=\"ind-hero-headline-emph\">essential and important entities</span>",
     "NIS2-ready Validierung für <span class=\"ind-hero-headline-emph\">wesentliche und wichtige Einrichtungen</span>"),
    ("The NIS2 Directive sets binding cybersecurity measures for thousands of EU organizations. Article 21 requires risk management, incident handling, and testing of defenses. VORNAC proves what attackers can actually do — on your live environment, mapped to the clauses auditors use.",
     "Die NIS2-Richtlinie verpflichtet tausende EU-Organisationen zu Cybersecurity-Maßnahmen. Artikel 21 verlangt Risikomanagement, Vorfallbearbeitung und Wirksamkeitstests. VORNAC belegt, was Angreifer wirklich ausrichten können — in Ihrer produktiven Umgebung, zugeordnet zu den Artikeln Ihrer Auditoren."),
    ("What NIS2 Article 21 requires", "Was NIS2 Artikel 21 verlangt"),
    ("Member states transpose NIS2 into national law. Essential and important entities must implement documented measures — and prove they work.",
     "Mitgliedstaaten setzen NIS2 in nationales Recht um. Wesentliche und wichtige Einrichtungen müssen dokumentierte Maßnahmen umsetzen — und belegen, dass sie wirken."),
    ("Policies &amp; risk management", "Policies &amp; Risikomanagement"),
    ("Cybersecurity risk analysis, information system security policies, and governance at management level.",
     "Cybersecurity-Risikoanalyse, Informationssystem-Security-Policies und Governance auf Management-Ebene."),
    ("Incident handling", "Incident Handling"),
    ("Detection, response, and reporting within defined timelines — evidence of effective playbooks.",
     "Detection, Response und Reporting in definierten Timelines — Belege wirksamer Playbooks."),
    ("Supply chain security", "Supply-Chain-Security"),
    ("Security in relationships with direct suppliers and service providers — including validation of exposed integrations.",
     "Security in Beziehungen zu direkten Lieferanten und Dienstleistern — inklusive Validierung exponierter Integrationen."),
    ("Testing &amp; effectiveness", "Testing &amp; Wirksamkeit"),
    ("Testing of cybersecurity defenses, including vulnerability assessments and adversarial testing where appropriate.",
     "Tests der Cybersecurity-Defenses, inkl. Vulnerability Assessments und adversarischem Testing wo angemessen."),
    ("Compliance without exploit proof is assumptions", "Compliance ohne Exploit-Nachweis bleibt Annahme"),
    ("NIS2 auditors increasingly ask whether controls survive real attack techniques — not whether a scanner flagged a CVE. VORNAC closes that evidence gap.",
     "NIS2-Auditoren fragen zunehmend, ob Kontrollen reale Angriffstechniken überstehen — nicht ob ein Scanner eine CVE markierte. VORNAC schließt diese Evidenzlücke."),
    ("Data leaves your jurisdiction — German hosting and operations.", "Daten verlassen Ihre Jurisdiktion nicht — deutsches Hosting und Betrieb."),
    ("How VORNAC helps enterprises", "So hilft VORNAC Enterprises"),
    ("Article 21-aligned reports", "Berichte zu Artikel 21"),
    ("Findings mapped to the measures your national transposition and auditors reference — plus TISAX and ISO 27001 where applicable.",
     "Befunde zugeordnet zu den Maßnahmen Ihrer nationalen Umsetzung und den Erwartungen Ihrer Auditoren — plus TISAX und ISO 27001 wo anwendbar."),
    ("Continuous testing cadence", "Kontinuierliche Test-Taktung"),
    ("Meet the spirit of &ldquo;regular testing&rdquo; with validation on every release, not a single annual engagement.",
     "Erfüllen Sie den Geist von „regelmäßigem Testing“ mit Validierung bei jedem Release, nicht einem einzigen Jahres-Engagement."),
    ("Ticketing &amp; audit trail", "Ticketing &amp; Audit Trail"),
    ("Auto-route to Jira, Linear, or ServiceNow. Immutable audit log, cryptographically signed findings.",
     "Automatische Weiterleitung an Jira, Linear oder ServiceNow. Unveränderliches Audit-Log, kryptografisch signierte Befunde."),
    ("Critical infrastructure (KRITIS)", "Kritische Infrastruktur (KRITIS)"),
    ("NIS2 compliance you can <em>demonstrate</em>, not just document.", "NIS2-Compliance, die Sie <em>belegen</em> können, nicht nur dokumentieren."),
]

PAGE_PAIRS: dict[str, list[tuple[str, str]]] = {
    "industries.html": HUB_PAIRS,
    "industries-insurance.html": INSURANCE_PAIRS,
    "industries-financial-services.html": FINANCIAL_PAIRS,
    "industries-critical-infrastructure.html": KRITIS_PAIRS,
    "industries-automotive.html": AUTOMOTIVE_PAIRS,
    "industries-enterprise.html": ENTERPRISE_PAIRS,
}


def dest_name(src: str) -> str:
    if src == "industries.html":
        return "industries_de.html"
    return src.replace(".html", "_de.html")


def patch_de_nav_links(path: Path, old: str, new: str) -> None:
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    updated = text.replace(old, new)
    if updated != text:
        path.write_text(updated, encoding="utf-8")
        print(f"Patched nav in {path.name}")


def main() -> None:
    for src in FILES:
        source = ROOT / src
        dest = ROOT / dest_name(src)
        shutil.copy2(source, dest)
        text = dest.read_text(encoding="utf-8")
        text = localize_shell(text)
        text = apply_pairs(text, PAGE_PAIRS.get(src, []))
        dest.write_text(text, encoding="utf-8")
        print(f"Wrote {dest.name}")

    # Point main DE pages at industries hub
    for page in ("index_de.html", "pentesting_de.html", "about_de.html"):
        patch_de_nav_links(ROOT / page, 'href="/industries"', 'href="/industries_de"')
        patch_de_nav_links(ROOT / page, ">Industries</a>", ">Branchen</a>")


if __name__ == "__main__":
    main()

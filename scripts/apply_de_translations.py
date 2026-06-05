#!/usr/bin/env python3
"""Apply German translations to copied EN HTML pages."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

from de_shared import ANNOUNCEMENT, FOOTER_TAGLINE

ROOT = Path(__file__).resolve().parents[1]


def apply_ordered(text: str, pairs: list[tuple[str, str]]) -> str:
    for old, new in pairs:
        text = text.replace(old, new)
    return text


def shell_pairs() -> list[tuple[str, str]]:
    return [
        ANNOUNCEMENT,
        FOOTER_TAGLINE,
        ('<span class="v-announcement-tag">New</span>', '<span class="v-announcement-tag">Neu</span>'),
        ('Read the paper →', 'Whitepaper lesen →'),
        ('aria-label="VORNAC home"', 'aria-label="VORNAC Startseite"'),
        ('<a href="/" class="flex items-center gap-3"', '<a href="/de" class="flex items-center gap-3"'),
        ('<a href="/" class="nav-link text-stone-500', '<a href="/de" class="nav-link text-stone-500'),
        ('<a href="/" class="mobile-link text-lg', '<a href="/de" class="mobile-link text-lg'),
        ('<li><a href="/" class="hover:text-white', '<li><a href="/de" class="hover:text-white'),
        ('href="/pentesting"', 'href="/pentesting_de"'),
        ('href="/industries"', 'href="/industries_de"'),
        ('>Industries</a>', '>Branchen</a>'),
        ('                    About\n                    <svg', '                    Über uns\n                    <svg'),
        ('href="/about#company"', 'href="/about_de#unternehmen"'),
        ('href="/about#careers"', 'href="/about_de#karriere"'),
        ('>Company</a>', '>Unternehmen</a>'),
        ('>Careers</a>', '>Karriere</a>'),
        ('>Book Demo</a>', '>Demo buchen</a>'),
        ('onclick="this.nextElementSibling.classList.toggle(\'hidden\')" class="mobile-link text-lg font-medium text-stone-600 hover:text-stone-900 flex items-center justify-center gap-2">\n                    About',
         'onclick="this.nextElementSibling.classList.toggle(\'hidden\')" class="mobile-link text-lg font-medium text-stone-600 hover:text-stone-900 flex items-center justify-center gap-2">\n                    Über uns'),
        ('aria-label="Open menu"', 'aria-label="Menü öffnen"'),
        ('→ Company</a>', '→ Unternehmen</a>'),
        ('→ Careers</a>', '→ Karriere</a>'),
        ('Book a demo', 'Demo buchen'),
        ('>Contact</a>', '>Kontakt</a>'),
        ('href="/about"', 'href="/about_de"'),
        ('>About</a>', '>Über uns</a>'),
        ('>Privacy Policy</a>', '>Datenschutz</a>'),
        ('>Imprint</a>', '>Impressum</a>'),
        ('All rights reserved.', 'Alle Rechte vorbehalten.'),
        ('Privacy Preference', 'Datenschutz-Einstellung'),
        (
            'We use <span class="text-stone-900 font-semibold">Plausible Analytics</span> (privacy-friendly, no cookies) and <span class="text-stone-900 font-semibold">Google Ads Conversion Tracking</span>. Your consent is only required for Google Ads.',
            'Wir nutzen <span class="text-stone-900 font-semibold">Plausible Analytics</span> (datenschutzfreundlich, ohne Cookies) und <span class="text-stone-900 font-semibold">Google Ads Conversion Tracking</span>. Ihre Einwilligung ist nur für Google Ads erforderlich.',
        ),
        ('>Accept</button>', '>Akzeptieren</button>'),
        ('>Decline</button>', '>Ablehnen</button>'),
        ('Read Privacy Policy', 'Datenschutzerklärung'),
    ]


PENTESTING_PAIRS: list[tuple[str, str]] = [
    ('<html lang="en"', '<html lang="de"'),
    (
        "<title>VORNAC Pentesting — Continuous adversarial validation, audit-ready by clause.</title>",
        "<title>VORNAC Pentesting — Kontinuierliche Validierung, auditbereit auf Artikelebene</title>",
    ),
    (
        'content="Continuous pentesting against live production. Triggered via UI, API, or schedule. Every finding signed and mapped to NIS2, DORA, BaFin VAIT/BAIT, KRITIS, TISAX, and ISO/IEC 27001 clauses."',
        'content="Pentests gegen Ihre produktive Umgebung — per Oberfläche, API oder Zeitplan. Jeder Befund kryptografisch signiert und NIS2, DORA, BaFin VAIT/BAIT, KRITIS, TISAX sowie ISO/IEC 27001 zugeordnet."',
    ),
    (
        'content="Continuous pentesting against live production. Triggered via UI, API, or schedule. Every finding signed and mapped to NIS2, DORA, BaFin VAIT/BAIT, KRITIS, and TISAX clauses."',
        'content="Pentests gegen Ihre produktive Umgebung — per Oberfläche, API oder Zeitplan. Jeder Befund kryptografisch signiert und NIS2, DORA, BaFin VAIT/BAIT, KRITIS und TISAX zugeordnet."',
    ),
    (
        'content="Continuous pentesting against live production. Triggered via UI, API, or schedule. Every finding signed and mapped to compliance clauses."',
        'content="Pentests gegen Ihre produktive Umgebung — per Oberfläche, API oder Zeitplan. Befunde signiert und den Anforderungen Ihrer Regelwerke zugeordnet."',
    ),
    ('href="https://www.vornac.com/pentesting"', 'href="https://www.vornac.com/pentesting_de"'),
    ('hreflang="de" href="https://www.vornac.com/de/pentesting"', 'hreflang="de" href="https://www.vornac.com/pentesting_de"'),
    (
        'VORNAC Pentesting — Continuous adversarial validation, audit-ready by clause.',
        'VORNAC Pentesting — Kontinuierliche Validierung, auditbereit auf Artikelebene',
    ),
    (
        'Validate your live production environment against real adversarial techniques — continuously, on every release, via API. Every finding exploitability-proven and cryptographically signed. Every report mapped to the article clauses of NIS2, DORA, BaFin VAIT/BAIT, KRITIS, and TISAX.',
        'Prüfen Sie Ihre produktive Umgebung mit echten Angriffstechniken — kontinuierlich, bei jedem Release, per API. Jeder Befund mit nachgewiesener Ausnutzbarkeit und kryptografischer Signatur. Jeder Bericht ordnet die Artikel von NIS2, DORA, BaFin VAIT/BAIT, KRITIS und TISAX zu.',
    ),
    ('See how it works', 'So funktioniert es'),
    (
        '<span class="breach-cost-price">$4.88M</span> is the average cost of a data breach. We make sure it doesn&rsquo;t happen to you.',
        '<span class="breach-cost-price">4,88 Mio. $</span> kostet ein Datenleck im Schnitt. Wir sorgen dafür, dass es Sie nicht trifft.',
    ),
    (
        'Continuous, exploit-proven validation that finds the gap before an attacker does &mdash; every release, every environment, every time.',
        'Kontinuierliche Validierung mit nachgewiesener Ausnutzbarkeit — die Lücke finden, bevor es ein Angreifer tut. Bei jedem Release, in jeder Umgebung.',
    ),
    ('Source: IBM Cost of a Data Breach Report 2024.', 'Quelle: IBM Cost of a Data Breach Report 2024.'),
    ('False positives.', 'Keine Fehlalarme.'),
    (
        'Every finding ships with a working exploit and reproducible proof-of-concept. No theoretical CVEs, no chasing noise, no manual triage.',
        'Jeder Befund mit funktionierendem Exploit und reproduzierbarem Nachweis. Keine theoretischen CVEs, kein Rauschen, kein manuelles Sortieren.',
    ),
    ('Production incidents.', 'Keine Produktionsstörungen.'),
    (
        'Non-destructive adversarial emulation runs against your live environment without touching customer data, breaking sessions, or creating downtime.',
        'Nicht-destruktive Angriffssimulation in der produktiven Umgebung — ohne Kundendaten, ohne abgebrochene Sessions, ohne Ausfallzeiten.',
    ),
    ('Data leaves your jurisdiction.', 'Kein Datenabflug ins Ausland.'),
    (
        'Tests, findings, and reports stored and processed exclusively in EU data centers under German operations. No US Cloud Act exposure, no third-country transfers.',
        'Tests, Befunde und Berichte ausschließlich in EU-Rechenzentren unter deutschem Betrieb. Kein US Cloud Act, keine Übermittlung in Drittländer.',
    ),
    (
        'Pentesting wasn&rsquo;t built for production.\n                <span class="compare-headline-emph">We rebuilt it from scratch.</span>',
        'Klassisches Pentesting passt nicht zur Produktion.\n                <span class="compare-headline-emph">Wir haben es neu gebaut.</span>',
    ),
    ('The old way', 'Bisher'),
    ('Traditional pentesting', 'Klassisches Pentesting'),
    ('Cadence', 'Taktung'),
    ('Once a year, scheduled engagement.', 'Einmal im Jahr, fester Projekttermin.'),
    ('Coverage', 'Abdeckung'),
    ('Sampled IP ranges, &ldquo;representative scope.&rdquo;, 10-20&amp; Coverage',
     'Stichproben-IP-Bereiche, „repräsentativer Umfang“, 10–20&nbsp;% Abdeckung'),
    ('<span class="compare-dim">Reports</span>', '<span class="compare-dim">Berichte</span>'),
    ('PDFs', 'PDFs'),
    ('Time to value', 'Zeit bis zum Nutzen'),
    ('Weeks of consultant calendar coordination.', 'Wochen Abstimmung mit Beraterkalendern.'),
    ('Jurisdiction', 'Datenstandort'),
    ('Mixed, often US-hosted tooling and data.', 'Gemischt, oft US-gehostete Tools und Daten.'),
    ('Continuous validation platform', 'Plattform für kontinuierliche Validierung'),
    ('Every release, on-demand via API.', 'Jedes Release, bei Bedarf per API.'),
    ('Full attack surface, every asset, every cycle.', 'Volle Angriffsfläche, jedes Asset, jeder Zyklus.'),
    ('PDF, structured Format, Ticketing System integration',
     'PDF, strukturierte Daten, Anbindung an Ihr Ticketing'),
    ('Hours from trigger to actionable finding.', 'Stunden vom Start bis zum umsetzbaren Befund.'),
    ('German data centers, German operations', 'Deutsche Rechenzentren, deutscher Betrieb'),
    (
        'Continuous validation, <span class="steps-headline-emph">end to end.</span>',
        'Kontinuierliche Validierung, <span class="steps-headline-emph">durchgängig.</span>',
    ),
    (
        'From the first API call to the audit-ready report &mdash; every step automated, evidence-driven, and replayable.',
        'Vom ersten API-Aufruf bis zum auditfähigen Bericht — jeder Schritt automatisiert, evidenzbasiert und nachvollziehbar.',
    ),
    ('Step 01', 'Schritt 01'),
    ('Step 02', 'Schritt 02'),
    ('Step 03', 'Schritt 03'),
    ('Step 04', 'Schritt 04'),
    ('Connect your environment', 'Umgebung anbinden'),
    (
        'Define scope in our Command Center. Networks, applications, on-prem assets &mdash; all in one inventory. Authentication via your existing SSO/IAM/TOTP, no agent install required for external/internal surface.',
        'Umfang im Command Center festlegen: Netzwerke, Anwendungen, On-Prem-Assets — in einem Inventar. Anmeldung über Ihr SSO/IAM/TOTP, ohne Agenten für externe und interne Flächen.',
    ),
    ('Trigger validation', 'Validierung starten'),
    (
        'Run on every release via CI/CD webhook, on infrastructure changes, on a schedule, or on-demand via API. No engagement scoping, no calendar coordination, no quarterly retainer windows.',
        'Bei jedem Release per CI/CD-Webhook, bei Infrastrukturänderungen, nach Zeitplan oder bei Bedarf per API. Kein Projekt-Scoping, keine Terminabstimmung, keine Quartalsfenster.',
    ),
    ('Adversarial emulation', 'Angriffssimulation'),
    (
        'Real exploit chains across the full MITRE ATT&amp;CK kill chain &mdash; reconnaissance, initial access, privilege escalation, lateral movement, exfiltration. Non-destructive in production, full PoC for every finding.',
        'Echte Exploit-Ketten über die gesamte MITRE ATT&amp;CK Kill Chain — Aufklärung, Initial Access, Rechteausweitung, laterale Bewegung, Exfiltration. Nicht-destruktiv in Produktion, vollständiger Nachweis pro Befund.',
    ),
    ('Audit-ready delivery', 'Auditfähige Auslieferung'),
    (
        'Findings auto-routed to your ticketing (Jira, Linear, ServiceNow). Reports framework-mapped to NIS2, DORA, VAIT, BAIT, KRITIS, and TISAX. Audit log immutable, every finding cryptographically signed.',
        'Befunde automatisch ins Ticketing (Jira, Linear, ServiceNow). Berichte den Anforderungen von NIS2, DORA, VAIT, BAIT, KRITIS und TISAX zugeordnet. Unveränderliches Audit-Log, jeder Befund kryptografisch signiert.',
    ),
    (
        'Everything in your attack surface.\n                <span class="scope-headline-emph">Tested every cycle.</span>',
        'Alles auf Ihrer Angriffsfläche.\n                <span class="scope-headline-emph">In jedem Zyklus geprüft.</span>',
    ),
    (
        'From public APIs to internal Active Directory, from cloud workloads to legacy ICS &mdash; VORNAC validates the full perimeter and depth in a single platform.',
        'Von öffentlichen APIs bis Active Directory, von Cloud-Workloads bis Legacy-ICS — VORNAC prüft Perimeter und Tiefe in einer Plattform.',
    ),
    ('External attack surface', 'Externe Angriffsfläche'),
    (
        'Public-facing assets, exposed services, shadow-IT discovery. Continuous reconnaissance against the perimeter an attacker hits first.',
        'Öffentliche Assets, exponierte Dienste, Shadow-IT-Erkennung. Kontinuierliche Aufklärung dort, wo Angreifer zuerst ansetzen.',
    ),
    ('Cloud workloads', 'Cloud-Workloads'),
    (
        'IAM mispermissions, exposed storage, runtime misconfigurations, escape paths from compromised workloads to control planes.',
        'IAM-Fehlkonfigurationen, offener Speicher, Laufzeitfehler, Ausbruchspfade von kompromittierten Workloads zur Steuerungsebene.',
    ),
    ('Internal networks', 'Interne Netzwerke'),
    (
        'Active Directory paths, lateral movement, privilege escalation, network segmentation gaps. From beachhead to domain admin, time-boxed and proven.',
        'Active-Directory-Pfade, laterale Bewegung, Rechteausweitung, Segmentierungslücken. Vom ersten Fußabdruck bis Domain Admin — begrenzt und belegt.',
    ),
    ('Binaries', 'Binärdateien'),
    (
        'Compiled software across desktop, mobile, and embedded. Reverse engineering, code-signing bypass, hardcoded secret extraction, anti-tamper validation, and local privilege escalation.',
        'Kompilierte Software auf Desktop, Mobile und Embedded: Reverse Engineering, Umgehung von Code-Signing, hartcodierte Geheimnisse, Anti-Tamper und lokale Rechteausweitung.',
    ),
    ('APIs &amp; supply chain', 'APIs &amp; Lieferkette'),
    (
        'REST, GraphQL, gRPC endpoint authorization, broken object-level access. Third-party dependency abuse paths and integration boundary attacks.',
        'REST, GraphQL, gRPC — Autorisierung und fehlerhafte Objektzugriffe. Missbrauch von Drittanbieter-Abhängigkeiten und Angriffe an Integrationsgrenzen.',
    ),
    ('Identity &amp; access', 'Identität &amp; Zugriff'),
    (
        'SSO bypass paths, MFA fatigue and bypass, OAuth scope escalation, privileged-account abuse, federation trust exploits.',
        'SSO-Umgehung, MFA-Ermüdung und -Bypass, OAuth-Scope-Eskalation, Missbrauch privilegierter Konten, Schwächen im Verbundvertrauen.',
    ),
    (
        'Built on the standards your auditors already trust. <span class="certs-headline-emph">Built by certified pentesters.</span>',
        'Auf Standards, denen Ihre Auditoren vertrauen. <span class="certs-headline-emph">Von zertifizierten Pentestern entwickelt.</span>',
    ),
    (
        'The same frameworks regulators use to evaluate you, baked into how VORNAC is built and operated. The same hands-on certifications your red-team partners hold, on the team that runs every engagement.',
        'Die Regelwerke der Aufsicht — in Aufbau und Betrieb von VORNAC verankert. Dieselben praktischen Zertifizierungen wie bei Ihren Red-Team-Partnern, im Team hinter jedem Test.',
    ),
    ('Built on ISO 27001', 'Auf Basis von ISO 27001'),
    ('Aligned with BSI standards', 'Ausgerichtet an BSI-Standards'),
    ('CISSP certified', 'CISSP-zertifiziert'),
    ('OSCP certified', 'OSCP-zertifiziert'),
    (
        'Ready to see <span class="pent-contact-headline-emph">VORNAC</span> in action?',
        'Bereit, <span class="pent-contact-headline-emph">VORNAC</span> live zu sehen?',
    ),
    (
        'Schedule a live session with our team, or send us a message &mdash; we&rsquo;ll get back to you within 24 hours.',
        'Live-Session mit unserem Team buchen oder Nachricht senden — Rückmeldung innerhalb von 24 Stunden.',
    ),
    ('30-minute intro call with our team', '30 Minuten Einführungsgespräch mit unserem Team'),
    ('Or send us a message', 'Oder schreiben Sie uns'),
    ('Work email', 'Geschäftliche E-Mail'),
    ('Full name', 'Vollständiger Name'),
    ('Organization', 'Organisation'),
    ('Your message&hellip;', 'Ihre Nachricht…'),
    ('Send message', 'Nachricht senden'),
    ('Request sent.', 'Anfrage gesendet.'),
    (
        'Thank you. Your request has been received. Our team will get back to you within 24 hours.',
        'Danke. Ihre Anfrage ist eingegangen. Unser Team meldet sich innerhalb von 24 Stunden.',
    ),
    ('>Close</button>', '>Schließen</button>'),
    (
        'Move from once-a-year<br>to <span class="pent-cta-headline-emph">once-a-day.</span>',
        'Vom einmal im Jahr<br>zum <span class="pent-cta-headline-emph">täglichen Test.</span>',
    ),
    (
        '30-minute session. We map your environment to a continuous validation cycle &mdash; scoped, signed, and audit-ready.',
        '30-Minuten-Session: Wir ordnen Ihre Umgebung einem kontinuierlichen Validierungszyklus zu — abgegrenzt, signiert und auditbereit.',
    ),
    ('>Navigation</h4>', '>Navigation</h4>'),
    ('<li><a href="/" class="hover:text-white transition-colors">Home</a></li>',
     '<li><a href="/de" class="hover:text-white transition-colors">Home</a></li>'),
    (
        '<a href="/pentesting_de" onclick="localStorage.setItem(\'vornac_lang\', \'de\')" class="hover:text-white transition-colors">DE</a>\n                <span class="text-stone-700">|</span>\n                <span class="text-white">EN</span>',
        '<span class="text-white">DE</span>\n                <span class="text-stone-700">|</span>\n                <a href="/pentesting" onclick="localStorage.setItem(\'vornac_lang\', \'en\')" class="hover:text-white transition-colors">EN</a>',
    ),
]

INDEX_PAIRS: list[tuple[str, str]] = [
    ('<html lang="en"', '<html lang="de"'),
    (
        "<title>84% less cyber risk with VORNAC – continuous pentesting</title>",
        "<title>84% weniger Cyberrisiko durch VORNAC - kontinuierliches Pentesting</title>",
    ),
    (
        'content="VORNAC validates your live production environment against real adversarial techniques — continuously, on schedule, via API. Every finding is exploitability-proven and mapped to NIS2, DORA, VAIT/BAIT, KRITIS, and TISAX."',
        'content="VORNAC prüft Ihre produktive Umgebung mit echten Angriffstechniken — kontinuierlich, planbar, per API. Jeder Befund mit nachgewiesener Ausnutzbarkeit; Zuordnung zu NIS2, DORA, VAIT/BAIT, KRITIS und TISAX."',
    ),
    ('href="https://www.vornac.com/"', 'href="https://www.vornac.com/de"'),
    ('href="#top"', 'href="/de"'),
    (
        'Continuous validation.<br>\n            <span class="v-amber-mark">Proven exploitability.</span><br>\n            Audit-ready by design.',
        'Kontinuierlich prüfen, was in Produktion wirklich angreifbar ist.<br>\n            <span class="v-amber-mark">Mit Nachweisen, die Auditoren akzeptieren.</span><br>\n            Auditfähig von Haus aus.',
    ),
    (
        'VORNAC runs the techniques an attacker would — against your live production environment, continuously, on schedule, via API. Every finding is exploitability-proven. Every report maps to the article clauses of NIS2, DORA, BaFin VAIT/BAIT, KRITIS, and TISAX.',
        'VORNAC setzt die Techniken ein, die ein Angreifer nutzen würde — gegen Ihre produktive Umgebung, kontinuierlich, planbar, per API. Jeder Befund mit nachgewiesener Ausnutzbarkeit. Jeder Bericht ordnet die Artikel von NIS2, DORA, BaFin VAIT/BAIT, KRITIS und TISAX zu.',
    ),
    ('See the platform overview', 'Zur Plattform'),
    ('Less cyber risk', 'Weniger Cyberrisiko'),
    ('across the validated estate', 'in der geprüften IT-Landschaft'),
    ('up to', 'bis zu'),
    ('Lower external pentesting costs', 'Geringere externe Pentest-Kosten'),
    ('vs. annual report-only engagements', 'gegenüber jährlichen reinen Report-Projekten'),
    ('Faster mean time to remediation', 'Kürzere Zeit bis zur Behebung'),
    ('measured across the program (MTTR)', 'über das gesamte Programm (MTTR)'),
    (
        'German jurisdiction. German hosting. <span class="v-sov-emph">Zero foreign cloud exposure.</span>',
        'Deutsche Rechtsordnung. Deutsches Hosting. <span class="v-sov-emph">Keine ausländische Cloud.</span>',
    ),
    (
        'VORNAC runs entirely on German-owned infrastructure. No US clouds. No data egress outside the EU. No subprocessors that bypass German jurisdiction. Every byte your team validates is processed under BDSG and GDPR — by default, not by request.',
        'VORNAC läuft auf Infrastruktur unter deutscher Hoheit. Keine US-Clouds. Kein Datenabfluss aus der EU. Keine Auftragsverarbeiter außerhalb deutscher Rechtsordnung. Jede verarbeitete Information unter BDSG und DSGVO — standardmäßig, nicht auf Nachfrage.',
    ),
    ('Made &amp; hosted in Germany', 'Entwickelt &amp; gehostet in Deutschland'),
    (
        'German jurisdiction by default. Hosted in German data centers operated by German entities.',
        'Deutsche Rechtsordnung standardmäßig. Hosting in deutschen Rechenzentren deutscher Betreiber.',
    ),
    ('Member, TeleTrusT — IT Security Association Germany', 'Mitglied TeleTrusT — IT-Sicherheitsverband Deutschland'),
    ('Awarded the “IT Security Made in Germany” seal', 'Mit dem Siegel „IT Security Made in Germany“ ausgezeichnet'),
    (
        'Pentest coverage you can prove. Time-to-result you can plan.',
        'Pentest-Abdeckung, die Sie belegen können. Zeit bis zum Ergebnis, die Sie planen können.',
    ),
    ('Of attack surface validated each cycle', 'der Angriffsfläche pro Zyklus validiert'),
    (
        'Across cloud, on-premises, APIs, and behind-VPN systems. Continuous — not annual — coverage from day one of deployment.',
        'Cloud, On-Premises, APIs und Systeme hinter VPN — kontinuierlich, nicht jährlich, ab dem ersten Tag.',
    ),
    ('From trigger to actionable finding', 'Vom Start bis zum umsetzbaren Befund'),
    (
        'No multi-week engagement window. UI or API trigger, signed exploitability-proven findings the same day.',
        'Kein mehrwöchiges Projekt-Fenster. Start per Oberfläche oder API, signierte Befunde noch am selben Tag.',
    ),
    ('Of reports accepted on first auditor pass', 'der Berichte beim ersten Audit ohne Nacharbeit'),
    (
        'Reports map to article-level clauses for NIS2, DORA, BaFin VAIT/BAIT, KRITIS, TISAX, and ISO/IEC 27001.',
        'Berichte auf Artikelebene der Regelwerke — NIS2, DORA, BaFin VAIT/BAIT, KRITIS, TISAX und ISO/IEC 27001.',
    ),
    ('aria-label="Trusted by"', 'aria-label="Vertrauen von"'),
    ('Trusted by', 'Vertrauen von'),
    (
        '<a href="/de" onclick="localStorage.setItem(\'vornac_lang\', \'de\')" class="hover:text-white transition-colors">DE</a>\n                <span class="text-stone-700">|</span>\n                <span class="text-white">EN</span>',
        '<span class="text-white">DE</span>\n                <span class="text-stone-700">|</span>\n                <a href="/" onclick="localStorage.setItem(\'vornac_lang\', \'en\')" class="hover:text-white transition-colors">EN</a>',
    ),
]


def fix_pentesting_nav_active(text: str) -> str:
    text = text.replace(
        'href="/pentesting_de" class="nav-link text-stone-500 hover:text-stone-900 transition-colors">Pentesting</a>',
        'href="/pentesting_de" class="nav-link text-stone-900 font-semibold border-b-2 border-amber-500">Pentesting</a>',
    )
    return text


def fix_index_meta_and_lang_redirect(text: str) -> str:
    redirect_block = re.search(
        r"<script>\s*\(function\(\)\s*\{.*?window\.location\.replace.*?\}\)\(\);\s*</script>",
        text,
        re.DOTALL,
    )
    if redirect_block:
        de_block = """<script>
    if (localStorage.getItem('vornac_lang') !== 'de') {
        localStorage.setItem('vornac_lang', 'de');
    }
    </script>"""
        text = text[: redirect_block.start()] + de_block + text[redirect_block.end() :]

    text = text.replace(
        '<link rel="canonical" href="https://www.vornac.com/de" />',
        '<link rel="canonical" href="https://www.vornac.com/de" />\n    <base href="/"/>',
        1,
    )
    text = text.replace(
        'content="84% less cyber risk with VORNAC – continuous pentesting"',
        'content="84% weniger Cyberrisiko durch VORNAC - kontinuierliches Pentesting"',
    )
    text = text.replace(
        'content="VORNAC validates your live production environment against real adversarial techniques — continuously, on schedule, via API. Every finding is exploitability-proven and mapped to NIS2, DORA, VAIT/BAIT, KRITIS, and TISAX."',
        'content="Kontinuierliche Pentests und KI-Sicherheit. Befunde mit nachgewiesener Ausnutzbarkeit — NIS2, DORA, VAIT/BAIT, KRITIS und TISAX."',
    )
    return text


def main() -> None:
    shell = shell_pairs()

    shutil.copy2(ROOT / "pentesting.html", ROOT / "pentesting_de.html")
    pent = (ROOT / "pentesting_de.html").read_text(encoding="utf-8")
    pent = apply_ordered(pent, shell + PENTESTING_PAIRS)
    pent = fix_pentesting_nav_active(pent)
    (ROOT / "pentesting_de.html").write_text(pent, encoding="utf-8")
    print("Wrote pentesting_de.html", len(pent))

    shutil.copy2(ROOT / "index.html", ROOT / "index_de.html")
    idx = (ROOT / "index_de.html").read_text(encoding="utf-8")
    idx = apply_ordered(idx, shell + INDEX_PAIRS)
    idx = fix_index_meta_and_lang_redirect(idx)
    (ROOT / "index_de.html").write_text(idx, encoding="utf-8")
    print("Wrote index_de.html", len(idx))


if __name__ == "__main__":
    main()

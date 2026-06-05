#!/usr/bin/env python3
"""Ensure a DE|EN language switcher exists in the footer of all production pages."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# EN filename -> DE path; DE filename -> EN path
ALT_URL: dict[str, str] = {
    "index.html": "/de",
    "index_de.html": "/",
    "pentesting.html": "/pentesting_de",
    "pentesting_de.html": "/pentesting",
    "about.html": "/about_de",
    "about_de.html": "/about",
    "apply.html": "/apply_de",
    "apply_de.html": "/apply?lang=en",
    "legal.html": "/legal_de",
    "legal_de.html": "/legal?lang=en",
    "industries.html": "/industries_de",
    "industries_de.html": "/industries",
    "industries-insurance.html": "/industries-insurance_de",
    "industries-insurance_de.html": "/industries-insurance",
    "industries-financial-services.html": "/industries-financial-services_de",
    "industries-financial-services_de.html": "/industries-financial-services",
    "industries-critical-infrastructure.html": "/industries-critical-infrastructure_de",
    "industries-critical-infrastructure_de.html": "/industries-critical-infrastructure",
    "industries-automotive.html": "/industries-automotive_de",
    "industries-automotive_de.html": "/industries-automotive",
    "industries-enterprise.html": "/industries-enterprise_de",
    "industries-enterprise_de.html": "/industries-enterprise",
    "comcenter.html": "/de",
}

LANG_SWITCH_RE = re.compile(
    r'<div class="(?:v-lang-switch )?flex items-center gap-3 text-\[11px\] font-bold uppercase tracking-\[0\.18em\] text-stone-500"[^>]*>.*?</div>',
    re.DOTALL,
)


def is_de_page(name: str, content: str) -> bool:
    if name.endswith("_de.html") or name == "index_de.html":
        return True
    match = re.search(r"<html[^>]*\blang=[\"']([a-zA-Z-]+)[\"']", content)
    if match:
        return match.group(1).lower().startswith("de")
    return False


def lang_switch_html(is_de: bool, alt_url: str) -> str:
    if is_de:
        return (
            '<div class="v-lang-switch flex items-center gap-3 text-[11px] font-bold uppercase '
            'tracking-[0.18em] text-stone-500" role="navigation" aria-label="Sprache">\n'
            '                <span class="text-white" aria-current="true">DE</span>\n'
            '                <span class="text-stone-700" aria-hidden="true">|</span>\n'
            f'                <a href="{alt_url}" hreflang="en" onclick="localStorage.setItem(\'vornac_lang\', \'en\')" '
            'class="hover:text-white transition-colors">EN</a>\n'
            "            </div>"
        )
    return (
        '<div class="v-lang-switch flex items-center gap-3 text-[11px] font-bold uppercase '
        'tracking-[0.18em] text-stone-500" role="navigation" aria-label="Language">\n'
        f'                <a href="{alt_url}" hreflang="de" onclick="localStorage.setItem(\'vornac_lang\', \'de\')" '
        'class="hover:text-white transition-colors">DE</a>\n'
        '                <span class="text-stone-700" aria-hidden="true">|</span>\n'
        '                <span class="text-white" aria-current="true">EN</span>\n'
        "            </div>"
    )


def patch_full_footer(content: str, switcher: str) -> str:
    if LANG_SWITCH_RE.search(content):
        return LANG_SWITCH_RE.sub(switcher, content, count=1)

    # Copyright row without switcher (flex bottom bar)
    old = re.search(
        r'(<div class="mt-10 pt-6 border-t border-stone-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">\s*'
        r'<p class="text-xs uppercase tracking-\[0\.16em\] text-stone-500">[^<]+</p>\s*)'
        r'(</div>)',
        content,
        re.DOTALL,
    )
    if old:
        return content[: old.start()] + old.group(1) + "\n            " + switcher + "\n        " + old.group(2) + content[old.end() :]

    # Copyright only <p> after grid (industries hub)
    old2 = re.search(
        r'(<p class="mt-10 pt-6 border-t border-stone-800 text-xs uppercase tracking-\[0\.16em\] text-stone-500">[^<]+</p>)',
        content,
    )
    if old2:
        inner = old2.group(1)
        block = (
            '<div class="mt-10 pt-6 border-t border-stone-800 flex flex-col gap-4 sm:flex-row '
            'sm:items-center sm:justify-between">\n            '
            + inner
            + "\n            "
            + switcher
            + "\n        </div>"
        )
        return content[: old2.start()] + block + content[old2.end() :]

    return content


def patch_minimal_footer(content: str, switcher: str, is_de: bool) -> str:
    industries_link = (
        '<a href="/industries_de" class="hover:text-white transition-colors">Alle Branchen</a>'
        if is_de
        else '<a href="/industries" class="hover:text-white transition-colors">All industries</a>'
    )
    copy = "Alle Rechte vorbehalten." if is_de else "All rights reserved."

    # One-line compact footer
    one_line = re.search(
        r'<footer class="bg-stone-900 pt-10 pb-8 px-6"><p class="text-xs text-stone-500 uppercase tracking-widest">'
        r".*?</p></footer>",
        content,
        re.DOTALL,
    )
    if one_line:
        new_footer = (
            '<footer class="bg-stone-900 border-t border-stone-800 pt-10 pb-8 px-4 sm:px-6">\n'
            '    <div class="max-w-content mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">\n'
            f'        <p class="text-xs uppercase tracking-[0.16em] text-stone-500">&copy; 2026 VORNAC GmbH · {industries_link}</p>\n'
            f"        {switcher}\n"
            "    </div>\n"
            "</footer>"
        )
        return content[: one_line.start()] + new_footer + content[one_line.end() :]

    # insurance-style footer with max-w-content
    ins = re.search(
        r'<footer class="bg-stone-900 border-t border-stone-800 pt-14 pb-10 px-4 sm:px-6">\s*'
        r'<div class="max-w-content mx-auto">\s*'
        r'<p class="text-xs uppercase tracking-\[0\.16em\] text-stone-500">.*?</p>\s*'
        r"</div>\s*</footer>",
        content,
        re.DOTALL,
    )
    if ins:
        new_footer = (
            '<footer class="bg-stone-900 border-t border-stone-800 pt-10 pb-8 px-4 sm:px-6">\n'
            '    <div class="max-w-content mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">\n'
            f'        <p class="text-xs uppercase tracking-[0.16em] text-stone-500">&copy; 2026 VORNAC GmbH · {industries_link}</p>\n'
            f"        {switcher}\n"
            "    </div>\n"
            "</footer>"
        )
        return content[: ins.start()] + new_footer + content[ins.end() :]

    return content


def patch_file(path: Path) -> bool:
    name = path.name
    if name not in ALT_URL:
        return False

    content = path.read_text(encoding="utf-8")
    de = is_de_page(name, content)
    switcher = lang_switch_html(de, ALT_URL[name])
    updated = patch_full_footer(content, switcher)
    updated = patch_minimal_footer(updated, switcher, de)

    if updated != content:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = []
    for name in ALT_URL:
        p = ROOT / name
        if p.exists() and patch_file(p):
            changed.append(name)
    print("Updated:", ", ".join(changed) if changed else "(none)")


if __name__ == "__main__":
    main()

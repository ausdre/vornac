# Command Center Visualization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current `<!-- One Command Center -->` section on `pentesting.html` with a brutalist-styled diagram matching the rest of the page (Coverage cards + Impact box DNA).

**Architecture:** Single static HTML/Tailwind section. No JS, no new CSS file. The new markup replaces lines 402–469 of `pentesting.html`. Three sub-blocks: source cards, SVG connector, command-center hub. Verification is visual at two viewport widths.

**Tech Stack:** HTML + Tailwind (already in project), inline SVG.

**Spec:** `docs/superpowers/specs/2026-05-20-command-center-visualization-design.md`

---

## File Structure

- **Modify:** `pentesting.html:402-469` — replace the entire `<!-- One Command Center -->` section
- **No new files.** All styling via existing Tailwind classes already used elsewhere on this page.

---

## Task 1: Replace the section markup

**Files:**
- Modify: `pentesting.html:402-469`

- [ ] **Step 1: Confirm current section boundaries**

Open `pentesting.html` and locate the section. Expected boundaries:
- Start: line 402 — `    <!-- One Command Center -->`
- End: line 469 — `    </section>`

If line numbers have drifted, use the `<!-- One Command Center -->` comment as the anchor and locate the matching `</section>` (it's the section before `<section id="compliance" ...>`).

- [ ] **Step 2: Replace the entire section with the new markup**

Replace lines 402–469 (everything from the comment `<!-- One Command Center -->` through the closing `</section>` immediately before `<section id="compliance"`) with this exact markup:

```html
    <!-- One Command Center -->
    <section class="relative bg-warm py-20 lg:py-28 border-b-2 border-stone-300">
        <div class="max-w-5xl mx-auto px-4 lg:px-6 relative z-10">
            <div class="max-w-2xl mb-12 lg:mb-14">
                <span class="text-amber-600 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Unified View</span>
                <h2 class="font-heading text-4xl sm:text-5xl lg:text-6xl font-black italic uppercase text-stone-900 tracking-tighter leading-[0.95]">
                    One <span class="text-amber-600">Command Center</span> for everything.
                </h2>
            </div>

            <div class="max-w-[56rem] mx-auto" aria-label="Cloud, on-prem, and API flow into one Command Center">
                <!-- Source cards -->
                <div class="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                    <div class="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 bg-white border-2 sm:border-4 border-stone-900 shadow-[4px_4px_0_0_rgba(28,25,23,1)] sm:shadow-[6px_6px_0_0_rgba(28,25,23,1)] px-2 sm:px-4 md:px-5 py-3 sm:py-5 md:py-6">
                        <svg class="w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0 text-amber-600" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M14 32h20a5 5 0 0 0 .4-10 6.5 6.5 0 0 0-12.6-1.9A5.5 5.5 0 0 0 14 32z"/>
                        </svg>
                        <span class="font-heading text-[11px] sm:text-base md:text-xl font-black italic uppercase tracking-tight text-stone-900 leading-tight whitespace-nowrap">Cloud Hosting</span>
                    </div>
                    <div class="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 bg-white border-2 sm:border-4 border-stone-900 shadow-[4px_4px_0_0_rgba(28,25,23,1)] sm:shadow-[6px_6px_0_0_rgba(28,25,23,1)] px-2 sm:px-4 md:px-5 py-3 sm:py-5 md:py-6">
                        <svg class="w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0 text-amber-600" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M10 38h28"/>
                            <path d="M15 38V26M21 38V26M27 38V26M33 38V26"/>
                            <path d="M8 26l16-12 16 12"/>
                            <path d="M12 26h24"/>
                        </svg>
                        <span class="font-heading text-[11px] sm:text-base md:text-xl font-black italic uppercase tracking-tight text-stone-900 leading-tight whitespace-nowrap">On-Prem</span>
                    </div>
                    <div class="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 bg-white border-2 sm:border-4 border-stone-900 shadow-[4px_4px_0_0_rgba(28,25,23,1)] sm:shadow-[6px_6px_0_0_rgba(28,25,23,1)] px-2 sm:px-4 md:px-5 py-3 sm:py-5 md:py-6">
                        <svg class="w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0 text-amber-600" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <rect x="8" y="10" width="32" height="28" rx="2"/>
                            <path d="M14 24l4 4-4 4"/>
                            <path d="M26 28h10"/>
                        </svg>
                        <span class="font-heading text-[11px] sm:text-base md:text-xl font-black italic uppercase tracking-tight text-stone-900 leading-tight whitespace-nowrap">API</span>
                    </div>
                </div>

                <!-- Connector: 3 thick black lines converging into an amber node -->
                <div class="hidden sm:block py-3 md:py-4" aria-hidden="true">
                    <svg class="block w-full h-16 md:h-20" viewBox="0 0 896 80" preserveAspectRatio="xMidYMid meet">
                        <path d="M 150 0 L 150 24 L 448 60" stroke="#1c1917" stroke-width="5" fill="none" stroke-linejoin="miter"/>
                        <path d="M 448 0 L 448 60" stroke="#1c1917" stroke-width="5" fill="none"/>
                        <path d="M 746 0 L 746 24 L 448 60" stroke="#1c1917" stroke-width="5" fill="none" stroke-linejoin="miter"/>
                        <rect x="438" y="56" width="20" height="20" fill="#d97706"/>
                    </svg>
                </div>
                <div class="sm:hidden flex flex-col items-center py-4" aria-hidden="true">
                    <div class="w-1 h-10 bg-stone-900"></div>
                    <div class="w-3.5 h-3.5 bg-amber-600"></div>
                </div>

                <!-- Command Center hub: matches Impact box style -->
                <div class="bg-stone-900 border-4 border-stone-900 shadow-[8px_8px_0_0_rgba(217,119,6,0.5)] px-5 py-6 sm:px-8 sm:py-7 md:px-10 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-7 md:gap-10">
                    <div class="border-l-4 border-amber-500 pl-4 sm:pl-5 md:max-w-[48%]">
                        <div class="font-heading text-2xl sm:text-3xl md:text-[2rem] font-black italic uppercase text-white tracking-tight leading-none mb-2 sm:mb-3">Command Center</div>
                        <p class="text-stone-400 text-sm md:text-base leading-relaxed">All systems and pentests at a glance.</p>
                    </div>
                    <div class="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 shrink-0">
                        <div class="w-full sm:w-20 md:w-24 h-20 md:h-24 border-2 border-amber-500 bg-stone-950 flex flex-col items-center justify-center text-center px-1">
                            <span class="font-heading text-2xl md:text-3xl font-black italic text-amber-500 leading-none">All</span>
                            <span class="text-stone-300 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold mt-2">Systems</span>
                        </div>
                        <div class="w-full sm:w-20 md:w-24 h-20 md:h-24 border-2 border-amber-500 bg-stone-950 flex flex-col items-center justify-center text-center px-1">
                            <span class="font-heading text-2xl md:text-3xl font-black italic text-amber-500 leading-none">All</span>
                            <span class="text-stone-300 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold mt-2">Pentests</span>
                        </div>
                        <div class="w-full sm:w-20 md:w-24 h-20 md:h-24 border-2 border-amber-500 bg-stone-950 flex flex-col items-center justify-center text-center px-1">
                            <span class="font-heading text-2xl md:text-3xl font-black italic text-amber-500 leading-none">24/7</span>
                            <span class="text-stone-300 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold mt-2">Monitoring</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 3: Save and reload in the browser**

Save `pentesting.html`. Open it in a browser (or hard-refresh if already open: `Cmd+Shift+R`). Scroll to the "One Command Center" section.

---

## Task 2: Verify desktop layout

- [ ] **Step 1: Render at 1280 px viewport width**

Resize browser to ≥ 1280 px (or use device-toolbar at 1280 × 800).

Expected:

1. Three white source cards in one row, equal width, hard 4 px black border, sharp 6 px black offset shadow to the lower-right
2. Each card shows: amber icon (~40 px) on the left, black italic uppercase label on the right, single line, no wrapping
3. Below the cards: thin gap, then a `<svg>` showing three black lines (5 px wide, miter corners) converging to an amber square (20 × 20 px) at horizontal center
4. Below the SVG: the Command Center bar — solid black fill, 4 px black border, amber offset shadow (8 px down/right)
5. Left side of bar: amber vertical bar (`border-l-4 border-amber-500`), then `COMMAND CENTER` in white italic uppercase, then "All systems and pentests at a glance." in muted gray
6. Right side: three square tiles, amber 2 px border, dark fill, italic amber number (`All` / `All` / `24/7`), small white uppercase label below (`Systems` / `Pentests` / `Monitoring`)

If any of these is off, fix inline and re-check. Do NOT add hover effects, rounded corners, soft shadows, or floating blurs.

- [ ] **Step 2: Render at 768 px (tablet)**

Resize to 768 × 1024.

Expected:

1. Cards still 3-across, slightly smaller text (`text-base`)
2. Hub still in horizontal layout (left text + right tiles)
3. Connector still visible

- [ ] **Step 3: Render at 375 px (mobile)**

Resize to 375 × 667 (iPhone SE width).

Expected:

1. Cards still 3-across with tiny `text-[11px]` labels, thinner 2 px border, smaller 4 px offset shadow. No label wraps or clips. "Cloud Hosting" fits on one line.
2. Connector replaced by a vertical black bar with a small amber square at the bottom
3. Hub stacks vertically: text block on top, three tiles row below in a 3-column grid

If "Cloud Hosting" wraps or clips on 375 px, reduce label font further (`text-[10px]`) or remove `gap-2` (`gap-1.5`). Goal: it must fit on a single line at 375 px.

---

## Task 3: Cross-check against the rest of the page

- [ ] **Step 1: Visual continuity check**

Scroll up to the Coverage Comparison cards ("Manual Pentesting" vs VORNAC, around line 240) and the Impact box ("Pentesting, whenever you need it", around line 294).

The new Command Center section should look like it belongs in the same family:

- Same `border-4` weight on the dark hub
- Same `shadow-[8px_8px_0_0_rgba(217,119,6,...)]` amber offset shadow
- Same `font-heading font-black italic uppercase` typography for titles
- No rounded corners on the new elements (the existing Coverage cards have no rounding either)

- [ ] **Step 2: Skim the spec's "Anti-Goals" section and confirm none of them appear**

Open `docs/superpowers/specs/2026-05-20-command-center-visualization-design.md` and re-read the Anti-Goals list. Confirm none are in the final markup:

- No `rounded-*` on cards, connector, or hub elements ✓
- No `shadow-lg` / `shadow-xl` / `blur` shadows ✓
- No `bg-gradient-to-*` fills ✓
- No `animate-ping` / "Live" indicator ✓
- No `bg-amber-500/5 blur-[140px]` decoration inside the section ✓
- No `hover:` classes on cards or hub ✓

---

## Task 4: User confirms in browser

- [ ] **Step 1: Show the user**

Tell the user: "Implementation done. Please reload `pentesting.html` and scroll to the Command Center section. Check at desktop, tablet, mobile."

- [ ] **Step 2: Address any feedback**

If the user requests visual adjustments, implement them inline (this is HTML/CSS — fast iteration is fine). Adjustments should preserve the brutalist style established by the spec.

---

## Task 5 (Optional): Commit

> Only do this step if the user explicitly asks for a commit. Project rule: no auto-commits.

- [ ] **Step 1: Commit**

```bash
git add pentesting.html docs/superpowers/specs/2026-05-20-command-center-visualization-design.md docs/superpowers/plans/2026-05-20-command-center-visualization.md
git commit -m "Redesign Command Center section on pentesting page

Match the brutalist style of the surrounding sections (Coverage cards,
Impact box): heavy black borders, hard offset shadows, italic uppercase
typography. Replace the soft funnel with three thick black lines
converging into an amber node. Hub uses the same amber-offset shadow
treatment as the Impact box."
```

---

## Task 6 (Out of Scope, separate change): German translation

Per spec, `pentesting_de.html` is explicitly out of scope. After EN is approved, port the same markup to DE with translated labels:

- `Cloud Hosting` → `Cloud Hosting` (kept as-is)
- `On-Prem` → `On-Prem` (kept)
- `API` → `API`
- `Command Center` → `Command Center` (kept as brand-y)
- Subtitle → `Alle Systeme und Pentests auf einen Blick.`
- `Systems` → `Systeme`, `Pentests` → `Pentests`, `Monitoring` → `Monitoring`

This is a separate task once EN is signed off.

---

## Self-Review

**Spec coverage**

| Spec section | Task | Status |
|---|---|---|
| Source Cards (border-4, shadow offset, icon+label) | Task 1, Step 2 | ✓ covered |
| Connector (3 thick black lines, amber square node) | Task 1, Step 2 | ✓ covered |
| Hub (border-4, amber offset shadow, accent strip, tiles) | Task 1, Step 2 | ✓ covered |
| Responsive (`<640px`, `640–767px`, `≥768px`) | Task 2, Steps 1–3 | ✓ covered |
| Anti-Goals | Task 3, Step 2 | ✓ covered as a checklist |
| Out of Scope (DE) | Task 6 | ✓ documented as separate |

**Placeholder scan:** No "TBD", "TODO", "handle later", or unwritten code blocks. ✓

**Type/class consistency:** Tailwind class names verified to match between the markup and the spec (e.g., `border-4 border-stone-900`, `shadow-[8px_8px_0_0_rgba(217,119,6,0.5)]`, `border-l-4 border-amber-500`). ✓

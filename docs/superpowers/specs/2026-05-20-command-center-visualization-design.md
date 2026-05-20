---
date: 2026-05-20
topic: Command Center visualization (pentesting page)
status: draft
file: pentesting.html (English only — DE follows after EN is approved)
---

# Command Center Visualization — Design

## Problem

The "One Command Center" section on `pentesting.html` has been redesigned five times and still feels out of place. The repeated issue is **stylistic mismatch**: previous attempts leaned corporate-clean (soft shadows, rounded corners, thin lines, hairline connectors), while the rest of the pentesting page is **brutalist** — `border-4 border-stone-900`, hard offset shadows (`shadow-[8px_8px_0px_0px_...]`), italic black uppercase headings, strong amber accents.

The section needs to match the existing page DNA instead of fighting it.

## Goal

Communicate **consolidation**: three input environments (Cloud Hosting, On-Prem, API) converge into one unified Command Center.

Visual language must match the brutalist style already used in:

- `#evolution` Coverage Comparison cards (Manual Pentesting vs VORNAC)
- The "Impact" box (`bg-stone-900 border-4 border-stone-900 shadow-[8px_8px_0px_0px_rgba(217,119,6,0.5)]`)

## Scope

- `pentesting.html` only. English version. DE follows in a separate change once EN is approved by the user in the browser.
- Visual rework of one section. No copy changes beyond keeping/restoring labels from the slide.
- No new JS. No new dependencies.

## Layout

```
[Cloud Hosting]      [On-Prem]      [API]        ← three brutalist cards
       \\               |              /
        \\              |             /          ← three thick black lines
         \\             |            /             converging downward
          ===========[■]===========             ← amber square node
[                                          ]
[ ▌COMMAND CENTER       [All][All][24/7]    ]  ← dark hub bar with
[   All systems and     Systems Pentests     ]   amber-bordered tiles
[   pentests at a       Monitoring           ]
[   glance.                                  ]
[                                          ]
```

Container: `max-w-5xl mx-auto`. Stack flows vertically: cards → connector SVG → hub.

## Source Cards

Three equal cards in a responsive grid (`grid-cols-3` on all viewports — labels short enough to fit; if too tight on small mobile, scale label down rather than stacking).

Per card:

- `bg-white`
- `border-4 border-stone-900`
- `shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]` — hard black offset, no blur
- Horizontal layout: `flex items-center gap-4`
- Padding: `px-5 py-5` (desktop `px-6 py-6`)
- Icon: ~40 px (`w-10 h-10`), `text-amber-600`, `stroke-width="1.75"`, `stroke-linecap="round"`. Three existing icons reused (Cloud, On-Prem temple, API terminal).
- Label: `font-heading font-black italic uppercase tracking-tight text-base sm:text-lg md:text-xl text-stone-900 whitespace-nowrap`
- Labels: `Cloud Hosting`, `On-Prem`, `API`

## Connector

SVG element placed between the card grid and the hub. Single `<svg>`, full container width, ~64 px tall.

- Three thick lines from the bottom-center of each card to a single point in the visual center
- Stroke: `stone-900`, `stroke-width="5"`, `stroke-linecap="square"`
- Outer-left and outer-right lines drawn as smooth cubic Bézier curves so the geometry reads as "merge", not "X"
- Center line is straight vertical
- At the convergence point: a solid `amber-600` square, 14 × 14 px, no border-radius — the "node" of unification
- Below the node, a 4 px-wide vertical amber stripe extends 8 px down to visually connect into the hub's top edge

Mobile (`< sm`):

- Replace SVG with a simple vertical stack: 4 px-wide amber bar (~40 px tall) + 12 × 12 px amber square at bottom
- Keeps the brutalist visual language without the converging geometry that needs width to read

## Command Center Hub

Single bar matching the Impact box style on the same page.

- Container: `bg-stone-900 border-4 border-stone-900 shadow-[8px_8px_0px_0px_rgba(217,119,6,0.45)]`
- Layout: `flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-10 px-6 py-7 md:px-10 md:py-9`

**Left block** (`md:max-w-[48%]`):

- Amber accent strip: `border-l-4 border-amber-500 pl-5`
- Title: `font-heading font-black italic uppercase tracking-tight text-2xl md:text-3xl text-white` — `Command Center`
- Subtitle: `text-stone-400 text-sm md:text-base mt-2` — `All systems and pentests at a glance.`

**Right block** (three metric tiles):

- Container: `flex gap-3 md:gap-4 justify-center md:justify-end shrink-0`
- Each tile: `w-20 h-20 md:w-24 md:h-24 border-2 border-amber-500 bg-stone-950 flex flex-col items-center justify-center text-center`
- Value: `font-heading font-black italic text-amber-500 text-2xl md:text-3xl leading-none` — `All` / `All` / `24/7`
- Label: `text-stone-300 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold mt-2` — `Systems` / `Pentests` / `Monitoring`

## Responsive Behavior

- **`< 640px` (mobile):** Source cards keep `grid-cols-3` with smaller padding/icons/labels (`text-xs`, `w-8 h-8` icon). Connector becomes vertical bar + square. Hub stacks vertically, metric tiles in 3 columns.
- **`640–767px`:** Cards mid-size. Hub still stacked.
- **`≥ 768px`:** Full layout per spec above.

Mobile labels must fit on one line in `grid-cols-3`. "Cloud Hosting" is the longest at 13 characters — verified to fit at `text-xs` with `w-8 h-8` icon and minimal padding.

## Anti-Goals (what NOT to do)

- No rounded corners (`rounded-*`) on the new elements
- No soft drop shadows with blur
- No gradient fills (the previous beige funnel gradient looked weak)
- No animated `animate-ping` "Live" indicator (was added in v3, removed in v4 — stay removed)
- No floating decorative blurs (`bg-amber-500/5 blur-[140px]` etc.) inside this section — the section is heavy and confident, not atmospheric
- No `hover:` effects on the source cards or hub — this is a diagram, not a CTA grid

## Out of Scope

- DE translation (`pentesting_de.html`) — separate follow-up after EN approved
- Section heading and eyebrow ("Unified View", "One Command Center for everything") — unchanged
- Anything outside the `<!-- One Command Center -->` section markers

## Done When

- Section visually parses at a glance: three sources → one hub
- Styling reads as one piece with the rest of the page (specifically the Coverage cards and Impact box above it)
- Cards, connector, and hub all align horizontally and feel as one diagram, not three separate components
- Mobile (375 px) and desktop (1280 px+) both render without label clipping, wrapping, or overlap
- User confirms it visually in the browser

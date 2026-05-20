# What We Can Test — Design Spec

**Date:** 2026-05-20
**Page:** `pentesting.html` (English only — DE follows later)
**Source:** Slide screenshot provided by user 2026-05-20

## Problem
The pentesting page currently does not communicate the concrete scope of what VORNAC can test. The user wants to port the "What we can Test." slide (three numbered cards: Web Apps, Binaries, Infrastructure) into the page.

## Goal
A scannable three-card section that establishes the testing capability range, placed after the Command Center section and before Compliance.

## Visual Approach
**Hybrid style** — brutalist accent (large italic 01/02/03 numbers, amber accent line under titles) on a softer card body (no offset shadow, clean white card with thin border). This deliberately decompresses the visual rhythm after the heavy brutalist Command Center section and before the also-soft Compliance cards.

## Placement
Insert as a new `<section>` between the closing `</section>` of "One Command Center" (line ~477) and the opening `<section id="compliance">` (line ~479).

## Section Structure
- **Background:** `bg-warm` (matches both neighboring sections for continuity)
- **Border:** `border-b-2 border-stone-300` bottom (matches Command Center separator)
- **Padding:** `py-20 lg:py-28` (matches Command Center rhythm)
- **Container:** `max-w-5xl mx-auto px-4 lg:px-6`

## Header
- **Eyebrow:** `Coverage Scope` — small amber uppercase tracked label (matches existing eyebrows like `Unified View`, `Regulatory Alignment`)
- **Headline:** `What we can <span class="text-amber-600">Test</span>.` — uses the same `h2` styling as Command Center / Compliance for brand consistency
- **Subhead:** None — cards are self-explanatory

## Card Grid
- `grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6`
- Each card is a single visual unit, all equal height

## Single Card Anatomy
```
┌─────────────────────────────────────┐
│  01            [browser icon ▢]     │  ← top row: number left, icon right
│                                     │
│  Web Apps                           │  ← title (bold, NOT italic)
│  ▬▬▬▬                              │  ← short amber underline
│                                     │
│  [Internal (Grey box)]              │  ← pills stacked
│  [External (Black box)]             │
│  [Behind VPN]                       │
└─────────────────────────────────────┘
```

- **Card chrome:** `bg-white border border-stone-200 shadow-sm p-7 lg:p-8`
- **Top row:** `flex items-start justify-between mb-6`
  - **Number:** `font-heading text-5xl lg:text-6xl font-black italic text-stone-900 tracking-tighter leading-none`
  - **Icon:** `w-12 h-12 text-amber-600`, stroke-width 1.75–2, line-art only
- **Title:** `font-heading text-2xl font-bold text-stone-900 leading-tight mb-2`
- **Underline:** `block w-10 h-[3px] bg-amber-600 mb-5`
- **Pills container:** `flex flex-wrap gap-2`
- **Single pill:** `inline-flex items-center px-3 py-1.5 text-sm text-stone-700 bg-stone-100 border border-stone-200 rounded-sm font-medium`

## Cards Content
| # | Title | Icon | Pills |
|---|-------|------|-------|
| 01 | Web Apps | Browser window (rect with top bar + dots) | Internal (Grey box) · External (Black box) · Behind VPN |
| 02 | Binaries | Open box (cube with flaps) | .ipa · .apk · .exe · .dmg · Any Executable |
| 03 | Infrastructure | Cylinder stack (database) | Internal (Grey box) · External (Black box) · Behind VPN |

## Icons (line-art SVG, 48×48 viewBox)
- **Browser:** rect 8,12 32,28 + horizontal line at 20 + three dots in title bar
- **Open box:** isometric cube with top flaps splayed open
- **Database stack:** three stacked ellipses (cylinder rings) with vertical sides

## Responsive Behavior
- **Mobile (<768px):** 1 column, cards full-width stacked
- **Tablet/Desktop (≥768px):** 3 equal columns
- **Pills:** wrap naturally (`flex-wrap`), never truncate

## Accessibility
- `aria-label="What we can test"` on the section
- Icons get `aria-hidden="true"`
- Numbers are decorative — visible but not announced as headings (use `<div>` not `<h3>` for the number)
- Title becomes `<h3>` for semantic outline

## Anti-Goals
- ❌ No offset shadows (decompress after Command Center)
- ❌ No hover animations (this is informational, not interactive)
- ❌ No background tint on cards (white only — matches slide)
- ❌ No equal-fill colorful pills (keep stone-100 grey for scanning)
- ❌ No icon backgrounds/circles around icons (line-art only)

## Out of Scope
- German translation in `pentesting_de.html` — separate task once EN is approved
- Linking pills to anything — purely descriptive
- Adding more pill rows or detail variants

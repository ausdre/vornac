# Implementation Plan — "What we can Test." Section

**Spec:** `docs/superpowers/specs/2026-05-20-what-we-can-test-design.md`
**Target file:** `pentesting.html`
**Scope:** English page only (DE follows once EN is approved)

## Goal
Insert a new "What we can Test." section between the existing "One Command Center" section and the Compliance section using a hybrid brutalist/clean card style as specified.

## Insertion Point
Between lines 477 (`</section>` closing One Command Center) and 479 (`<section id="compliance" ...>` opening Compliance).

## Tech / Style Notes
- Pure HTML + Tailwind CSS classes — no new CSS rules, no JS
- Reuse existing eyebrow + headline pattern from neighboring sections
- Use the same `font-heading` family and stone/amber palette
- Inline SVG icons (line-art, 48×48 viewBox, `currentColor` stroke)

## Steps

### Step 1: Insert the new section
Insert the new `<section>` between Command Center and Compliance with:
- Section wrapper: `bg-warm py-20 lg:py-28 border-b-2 border-stone-300`
- `max-w-5xl mx-auto px-4 lg:px-6` container
- Header block with eyebrow `Coverage Scope` and `h2` "What we can `<span amber>Test</span>`."
- 3-column responsive grid of cards (1 col mobile, 3 cols `md:`)
- Each card: white background, thin border, no offset shadow, number+icon top row, title with amber underline, stacked pills

### Step 2: Verify desktop layout
- Open `pentesting.html` in browser at ~1280px width
- Confirm: three equal cards in a row, numbers prominent, icons amber line-art, pills wrap naturally on the Binaries card if needed
- Confirm: spacing rhythm matches what flows from Command Center into Compliance (no abrupt jumps)

### Step 3: Verify tablet (~768px) layout
- Cards should still be 3 columns, with pills wrapping inside cards if tight
- No text overflow, no clipped pills, no broken icons

### Step 4: Verify mobile (~375px) layout
- Cards stack vertically full-width
- Number stays prominent, icon stays right
- Pills wrap to multiple lines, all readable

### Step 5: Cross-check against page rhythm
- Eyebrow color/sizing/tracking matches existing eyebrows
- Headline weight + italic style matches Command Center / Compliance h2s
- No visual collision with the brutalist Command Center directly above
- Section feels like a natural pause before Compliance

### Step 6: Anti-goal verification
- ✅ No offset shadows on cards
- ✅ No hover transitions on cards
- ✅ No colored card backgrounds
- ✅ No icon background circles
- ✅ Pills are grey (stone-100), not colorful

### Step 7: Lint check
Run `ReadLints` on `pentesting.html` — should be clean (no HTML errors introduced).

### Step 8: User browser confirmation
User opens the page, scrolls to the new section, confirms it looks right or provides feedback for iteration.

## Files modified
- `pentesting.html` — insert new section (~80 lines added between line 477 and 479)
- `pentesting_de.html` — UNCHANGED in this iteration (per user scope)

## Anti-goals for this implementation
- ❌ Don't touch `pentesting_de.html` yet
- ❌ Don't introduce new CSS classes — Tailwind only
- ❌ Don't add JavaScript
- ❌ Don't modify neighboring sections (Command Center, Compliance) — only insert

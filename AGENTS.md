## Learned User Preferences

- Use clean white backgrounds (`#ffffff`); do not use cream/beige bases.
- Favor generous whitespace and a big, airy feel; cramped/"gequetscht" layouts are a recurring complaint.
- No section borders and no gray section backgrounds; separate sections with whitespace, not chrome.
- Strip decorative chrome aggressively — a recurring request: remove eyebrow/kicker labels, hairline divider rules (between stats/percentages and horizontal separators), card frames ("entrahmen"), and borders around logos. Prefer plain, cardless, borderless layouts.
- Avoid "AI-slop" gradients and generic SaaS clichés (e.g. purple); keep the voice enterprise, regulator-credible, German-engineering.
- Design changes should be applied to all pages, including the German mirror under `src/de/*.njk`.
- During iterative design work, stay on the current branch — no worktrees, no branch switches unless explicitly requested.
- Commit each design iteration directly to the working branch with sentence-case, imperative messages.
- The user writes prompts in mixed German and English; reply in the language they used in that message.
- The footer must include a `socials` column.
- Brand color is `#ffa317`; do not introduce new accent colors casually.
- Keep section content consistently aligned across all pages: section heads (kicker + headline + subline), CTAs, stats grids, and final/contact blocks are CENTERED. Structured content (definition lists, comparison tables, research note bodies, glossary entries, footer columns) stays left-aligned for readability. The user objects when one section breaks the convention. Keep headline sizes consistent across sections.
- Never distort the logo — preserve its aspect ratio; size adjacent labels (e.g. `KLASSISCHE TOOLS` / `PENTERA`) to match the logo.

## Learned Workspace Facts

- Project is the VORNAC landing site (pentesting / IT security; positioned as German-engineering, regulator-credible); design/positioning references `pentera.io`, and the homepage includes a "classic tools vs Pentera" comparison.
- Static site built with Eleventy 3.x + Tailwind CSS v3.4, using Nunjucks templates (`.njk`).
- Bilingual: English homepage at `src/index.njk`, German mirror at `src/de/index.njk` (mirror is synced at the end of design iterations, not during).
- Dev server: `npm run dev` runs Tailwind watcher + Eleventy `--serve` together on http://localhost:8081/ with hot reload — do not start a second one.
- Global CSS tokens live in `src/input.css` under `:root`; this file affects every page. Compiled output is `dist/output.css` (do not edit `dist/`).
- Homepage-scoped styles live in `src/_includes/partials/index-styles.njk` (inline `<style>` block included by `src/index.njk`).
- Shared partials (`announcement-bar.njk`, `site-header.njk`, `site-footer.njk`) affect every page — flag site-wide impact when touching them.
- The header (`site-header.njk`, `.v-nav`) is a sticky, Apple-style floating "island pill" with a subtle transparent dark-glass background (backdrop-blur); on scroll it gets an `is-scrolled` state that adds a soft shadow and slightly shrinks the logo. The top announcement bar is light/white.
- The header logo is inlined as SVG in `site-header.njk` (a gradient "V" monogram path plus one path per `ORNAC` letter, split out of the original single wordmark) to drive a load-time intro modeled on `dataveyes.com`: letters run in one-by-one from the right, hold as the full `VORNAC`, then slide out and fade, leaving just the V at rest (gated by `prefers-reduced-motion`; same `cubic-bezier(.86,0,.07,1)` easing). The footer and `comcenter.njk` still use the `<img>` logo (`site.logos.whiteSvg` / `blackSvg`).
- Locked color tokens: `--v-bg` `#ffffff`, `--v-bg-band` `#f5f5f4` (defined but no longer used on sections), `--v-bg-card` `#ffffff`, `--v-line` `#e7e5e4`, `--v-line-soft` `#f1f0ee`, `--v-bg-dark` `#0E1116`, `--v-amber` `#ffa317`, `--v-amber-deep` `#cc8200`, `--v-amber-soft` `#fff3d8`, `--v-ink` `#0E1116`; a clear red `#FF4B4B` (Tailwind `vornac-red`) marks the "NEIN"/X negatives in the comparison table.
- Typography stack: Saira Condensed (display/billboard — H1, hero numbers, section headlines, weights 500–900) + Archivo (body + mid-display, weights 400–800) + JetBrains Mono (regulator/framework/data accents); mapped in `tailwind.config.js` as `font-display`, `font-heading`/`font-body`, `font-mono`. Do not reintroduce Archivo Black, Manrope, or Montserrat.
- For browser testing use the `cursor-ide-browser` MCP server (`browser_navigate`, `browser_snapshot`, `browser_scroll`, `browser_take_screenshot`); `agent-browser` is not installed in this environment.
- `.design-iter/` is a gitignored scratch directory for design-iteration screenshots.
- Repo origin: `github.com/ausdre/vornac`; build via `npm run build` (Tailwind minify + Eleventy), deploys via `vercel.json`.

# VORNAC

Website of VORNAC GmbH, Heidelberg: continuous, autonomous, AI-driven penetration testing, made and hosted in Germany.

![VORNAC Logo](logo-vornac-black.svg)

## Design

- **Surfaces:** clean white (`--v-bg`) with printed-ink dark sections (`--v-bg-dark`). Sections are separated by whitespace, not by borders or grey bands.
- **Accent:** amber `#ffa317` (`--v-amber`), used sparingly.
- **Type:** Saira Condensed for display, Archivo for everything else. Both are self-hosted from `fonts/`. No monospace.
- **Tokens:** CSS variables under `:root` in `src/input.css`; Tailwind extensions in `tailwind.config.js`.

Working conventions for design and content live in `AGENTS.md` and `CLAUDE.md`.

## Stack

- Eleventy 3 with Nunjucks templates
- Tailwind CSS 3.4 through PostCSS
- Deployed on Vercel (`vercel.json`)

## Structure

```text
src/de/*.njk            German pages, served at the root
src/*.njk               English pages, served under /en
src/_includes/          Layouts and partials
src/_data/              Site data, URL registry, translations
src/input.css           Global styles and design tokens
*.css                   Page stylesheets, copied as they are
fonts/                  Self-hosted webfonts and fonts.css
scripts/                Build helpers
```

## Commands

```bash
npm run dev      # Tailwind watcher and Eleventy on http://localhost:8081/
npm run build    # Production build into dist/
npm run dates    # Refresh src/_data/pageDates.json after content changes
```

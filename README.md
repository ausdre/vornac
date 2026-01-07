# VORNAC

This repository contains the official frontend for VORNAC. 
The website is engineered to reflect the precision and technical sophistication of the VORNAC engine, utilizing a "Dark Operations" design language.

![VORNAC Logo](V.svg)

## 🎨 Design Philosophy

VORNAC’s web presence is built on a custom design system defined in `tailwind.config.js`:

*   **Palette**: A deep `vornac-black` (#0111317) foundation accented by `vornac-gold` (#FFA317) highlights.
*   **Typography**: High-tech `Montserat` for headings paired with highly legible `Inter` for body copy.
*   **Motion**: Custom orbital keyframes and soft-pulse animations to simulate the "living" nature of an autonomous system.

## 🛠 Technical Implementation

The site is a high-performance static build optimized for speed and visual fidelity:

*   **Tailwind CSS v3.4**: Leverages custom theme extensions for glow effects (`glow-gold`) and specific border radiuses.
*   **PostCSS Pipeline**: Handles automated vendor prefixing and CSS optimization.
*   **Responsive Architecture**: Designed for an immersive experience across all device classes, from mobile previews to 4K ultra-wide displays.
*   **Asset Optimization**: SVG-based iconography for infinite scalability and ultra-low load times.

## 📂 Project Overview

```text
├── index.html            # Primary landing page
├── legal.html            # Compliance, RoE, and Legal Disclosures
├── src/                  # Core assets and JavaScript modules
├── tailwind.config.js    # The source of truth for the VORNAC design system
├── postcss.config.js     # CSS transformation settings
└── output.css            # Compiled and optimized production styles
```
# DESIGN SYSTEM SPECIFICATION: PREMIUM MODERN PRODUCT EDITION

## 1. Visual Direction & Philosophy
- **Identity**: Premium Modern Product • Bento Grid Composition • Restrained Glassmorphism • Editorial Precision.
- **Inspirations**: Linear / Vercel-style precision, Apple-level restraint, high-end design studios, sophisticated developer platforms.
- **Anti-Patterns Strictly Avoided**:
  - NO generic AI SaaS templates or repetitive placeholder cards.
  - NO gaudy all-over rainbow gradients or blinding neon saturations.
  - NO pure glassmorphism everywhere (glass is an accent, not the substrate).
  - NO excessive or cartoonish box shadows.
  - NO fake metrics, fake claims, or broken routes.

---

## 2. Color System & Surface Hierarchy

### Foundation Canvas & Surfaces
- **App Canvas**: `#FAFAFA` (Clean alabaster off-white with subtle neutral undertone)
- **Secondary Canvas**: `#F4F5F7` / `#F8F9FA` (Soft neutral contrast for alternating bento stages)
- **Surface Cards**: `#FFFFFF` (Crisp white with ultra-thin hairline borders)
- **Glass Surfaces**: `rgba(255, 255, 255, 0.78)` with `backdrop-filter: blur(16px)` and `border: 1px solid rgba(0, 0, 0, 0.06)`

### Typography & Ink
- **Primary Ink**: `#09090B` (Deep obsidian black for headlines and strong focal points)
- **Secondary Ink**: `#52525B` (Refined neutral zinc for subtitles, paragraphs, and specifications)
- **Muted Ink**: `#71717A` / `#A1A1AA` (System coordinates, metadata stamps, timestamps)

### Strategic Accent Palette
- **Primary Strategic Accent**: Electric Indigo / Sapphire (`#2563EB` to `#4F46E5`)
- **Parity & Real-Time Sync**: Emerald (`#10B981` / `#059669`)
- **Operational Data & Alerts**: Amber / Warm Ochre (`#F59E0B` / `#D97706`)
- **AI Gateway & Synthesis**: Royal Violet (`#8B5CF6` / `#7C3AED`)

---

## 3. Typography Hierarchy
- **Display Hero Headline**: `clamp(2.75rem, 6.5vw, 5.25rem)`, tight leading (`1.04`), negative tracking (`-0.035em`), font-weight 800/900.
- **H1 Section Headers**: `clamp(2rem, 4vw, 3.25rem)`, tight leading (`1.1`), negative tracking (`-0.025em`), font-weight 700/800.
- **H2 Bento Headers**: `1.25rem` to `1.75rem`, font-weight 700, clean tracking.
- **Body & Editorial**: `0.9375rem` to `1.125rem`, line-height `1.6`, high legibility.
- **Technical & Monospace**: Refined monospace with tabular digits (`font-mono`, `text-[11px]`, uppercase tracking).

---

## 4. Bento Composition & Depth
- **Bento Card Structure**:
  - Border radius: `16px` (`rounded-2xl`) on standard cards, `24px` (`rounded-3xl`) on hero stage containers, `8px` (`rounded-lg`) on controls.
  - Borders: `1px solid rgba(0, 0, 0, 0.08)` on light cards; crisp specular highlight `rgba(255, 255, 255, 0.6)` on glass surfaces.
  - Shadows: Layered ambient shadows (`0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.06)`).
  - Hover interactions: Gentle kinetic lift (`translateY(-2px)`), enhanced soft shadow, and subtle inner glow.

---

## 5. Glassmorphism Application Rules
Glass is strictly reserved for:
1. **Floating Navigation**: Pinned top pill nav with soft backdrop blur and thin frosted border.
2. **Hero Telemetry & Verification Badges**: Floating micro-pills over the product showcase.
3. **Interactive Modals & Layers**: Backdrop overlays with restrained gaussian blur (`backdrop-blur-md`).
4. **Status Badges & Pill Toggles**: Subtle semi-transparent backing with high-contrast text.

---

## 6. Motion & Kinetic Standards
- **Lenis Smooth Inertia**: Organic scrolling feel without abrupt jumps.
- **GSAP Orchestration**:
  - Hero staggered entrance: sequential fade-and-rise of eyebrow, typography, value prop, and showcase.
  - Interactive tabs & accordion items: smooth height and opacity transitions.
  - Respect `prefers-reduced-motion` unconditionally.

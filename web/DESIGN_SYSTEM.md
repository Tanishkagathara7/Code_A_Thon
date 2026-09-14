# Web Design System Specification: Premium Modern Product Edition

## 1. Visual Direction & Philosophy
- **Identity**: Premium Modern Product • Bento Grid Composition • Restrained Glassmorphism • Editorial Precision.
- **Inspirations**: Linear / Vercel-style precision, Apple-level restraint, high-end developer platforms.
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
- **H3 Component Titles**: `1.0rem` to `1.125rem`, font-weight 600.
- **Body & Editorial**: `0.9375rem` to `1.125rem`, line-height `1.6`, high legibility.
- **Caption & Labels**: `0.75rem` to `0.875rem`, uppercase tracking for system labels.
- **Technical & Monospace**: Tabular digits (`font-mono`, `text-[11px]`, uppercase tracking).

---

## 4. Spacing Scale & Bento Composition

### Spacing Scale
- `4px` (`gap-1` / `p-1`) — Micro badges and tight icon offsets
- `8px` (`gap-2` / `p-2`) — Button padding, input inner spacing
- `12px` (`gap-3` / `p-3`) — Compact list items and breadcrumbs
- `16px` (`gap-4` / `p-4`) — Standard card inner padding
- `24px` (`gap-6` / `p-6`) — Bento grid gaps and container padding
- `32px` (`gap-8` / `p-8`) — Section header spacing
- `64px` (`py-16`) — Page section vertical rhythm

### Bento Card Structure
- **Border radius**: `16px` (`rounded-2xl`) on standard cards, `24px` (`rounded-3xl`) on hero stage containers, `8px` (`rounded-lg`) on controls.
- **Borders**: `1px solid rgba(0, 0, 0, 0.08)` on light cards; crisp specular highlight `rgba(255, 255, 255, 0.6)` on glass surfaces.
- **Shadows**: Layered ambient shadows (`0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.06)`).
- **Hover interactions**: Gentle kinetic lift (`translateY(-2px)`), enhanced soft shadow, and subtle inner glow.

---

## 5. Responsive Breakpoint Matrix

| Token | Breakpoint | Target Layout Behavior |
| :--- | :--- | :--- |
| `sm` | `640px` | Single column forms expand to dual columns where appropriate. |
| `md` | `768px` | Tablet layout: Mobile dock transitions to topbar or collapsible drawer. |
| `lg` | `1024px` | Laptop layout: Persistent left navigation sidebar (`w-56`), 2-column bento grids. |
| `xl` | `1280px` | Desktop layout: Full desktop sidebar (`w-64`), 3-column bento grids, full data tables. |
| `2xl`| `1536px` | Ultrawide layout: Max container constraint (`max-w-7xl`) centered with balanced margins. |

---

## 6. Component Standards & Lifecycle States

Every web UI component must support the complete state matrix:

### Buttons
- **Primary**: Solid accent (`bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-[0.98] transition`).
- **Secondary**: Subtle surface (`bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200`).
- **Ghost**: Zero background (`hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900`).
- **Disabled**: Dimmed opacity (`opacity-50 pointer-events-none cursor-not-allowed`).

### Inputs & Forms
- **Resting**: Crisp border (`border border-zinc-200 bg-white rounded-lg px-3 py-2 text-sm`).
- **Focus**: Visible ring (`focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`).
- **Error**: High-contrast alert (`border-red-500 focus:ring-red-500 bg-red-50/20`).

### Data Tables
- Sticky headers with subtle hairline divider.
- Alternating row hover (`hover:bg-zinc-50/80 transition-colors`).
- Monospace tabular alignment for timestamps and numerical quantities.

---

## 7. Glassmorphism Application Rules

Glass is strictly reserved for:
1. **Floating Navigation**: Pinned top pill nav with soft backdrop blur and thin frosted border.
2. **Hero Telemetry & Verification Badges**: Floating micro-pills over the product showcase.
3. **Interactive Modals & Layers**: Backdrop overlays with restrained gaussian blur (`backdrop-blur-md`).
4. **Status Badges & Pill Toggles**: Subtle semi-transparent backing with high-contrast text.

---

## 8. Accessibility & Motion Standards

- **WCAG AA Compliance**: High-contrast ratios (> 4.5:1 for body copy, > 3:1 for large display titles).
- **Keyboard Navigation**: Explicit `:focus-visible` styling on all buttons, links, and form fields.
- **Motion Reduction**: All GSAP animations and CSS transitions strictly wrap inside `@media (prefers-reduced-motion: reduce)`.

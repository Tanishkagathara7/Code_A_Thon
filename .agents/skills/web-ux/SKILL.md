---
name: web-ux
description: Enforces web UX standards, responsive desktop/tablet/mobile design, typography hierarchy, accessibility, and interaction states in Next.js and Tailwind CSS.
---

# Web UX & Design System Skill

This skill governs screen design, UI component hierarchy, and responsive user experience patterns for Web application development in this repository (`web/`).

## Core Mandate

Every web screen must look and feel like a high-precision, production-grade SaaS product (e.g. Linear, Vercel, Supabase). Avoid generic AI dashboard templates, garish gradients, and broken viewport layouts.

---

## 1. Design System First

Before writing any new web UI component, Antigravity MUST inspect and reuse tokens and components in `web/`:

- **Design System Spec**: `web/DESIGN_SYSTEM.md`
- **Global Tokens**: `web/app/globals.css` (Tailwind CSS v4 tokens, typography, surfaces)
- **Shared Constants**: `shared/src/constants/index.ts`
- **Layout Shells**: `web/components/layout/Sidebar.tsx`, `web/components/layout/Topbar.tsx`
- **Context Providers**: `web/lib/context/AuthContext.tsx`, `web/lib/context/ToastContext.tsx`

> **Do NOT introduce arbitrary external CSS frameworks or disconnected design patterns.**

---

## 2. Responsive Breakpoint Rules

The Web application must be designed and verified across 4 responsive tiers:

1. **Desktop / Ultrawide ($\ge$ 1280px)**:
   - Dedicated left navigation sidebar (`w-64`).
   - 3-column bento grids and comprehensive Data Tables with sorting and pagination.
   - High information density with refined padding (`p-6` to `p-8`).
2. **Laptop (1024px – 1279px)**:
   - Compact sidebar navigation.
   - 2-column bento grids and balanced card padding.
3. **Tablet (768px – 1023px)**:
   - Collapsible navigation drawer.
   - Single-to-dual column hybrid layouts.
4. **Mobile Web (< 768px)**:
   - Drawer navigation menu with floating trigger.
   - Single-column card feeds replacing multi-column tables.
   - Touch targets meeting a minimum size of 44×44px.

---

## 3. UI/UX Interaction States

Every interactive component, data table, and form must support 4 discrete states:

- **Loading State**: Subtle pulse skeleton cards or spinner buttons. Never leave an empty white viewport.
- **Success State**: Instant optimistic UI update accompanied by a clear Toast notification.
- **Empty State**: Contextual copy explaining what will appear once records are created, paired with an immediate call-to-action button.
- **Error State**: Informative error banner with an explicit "Retry" action. Never fail silently.

---

## 4. Web Accessibility (a11y) & SEO Standards

- **Semantic HTML**: Use proper semantic tags (`<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`, `<article>`).
- **Heading Hierarchy**: Exactly one `<h1>` per page, followed sequentially by `<h2>` and `<h3>`.
- **Keyboard Navigation**: All interactive elements must exhibit visible `:focus-visible` styling (`focus-visible:ring-2 focus-visible:ring-blue-500`).
- **Form Controls**: Every input must feature an explicit `<label>` or `aria-label`, visible helper text, and inline error messages.
- **Motion Reduction**: All GSAP animations and smooth scrolling effects must respect `@media (prefers-reduced-motion: reduce)`.

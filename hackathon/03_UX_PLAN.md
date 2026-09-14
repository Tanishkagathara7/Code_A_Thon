# 03 — UX / UI Plan

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity after completing [`02_PRODUCT_SPEC.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/02_PRODUCT_SPEC.md).*

---

## UX Principles (Web & Mobile)

1. **Dual-Platform Ergonomics**:
   - **Web UX**: Information-dense multi-column bento grids, sortable data tables, keyboard shortcuts, sticky sidebar/topbar navigation.
   - **Mobile UX**: Touch targets $\ge$ 44pt, single-column vertical flow, bottom navigation dock, smooth Reanimated swipe/tap transitions.
2. **Speed & Minimal Interaction Friction**: The primary domain action must be achievable in 3 clicks/taps or fewer.
3. **Comprehensive State Feedback**: Explicit handling of Loading (skeletons), Empty (call-to-action illustrations), Error (inline retry banners), and Success (toasts).
4. **Visual Cohesion**: Consistent color palette, typography hierarchy, and status badges aligned between Web and Mobile via `shared/src/constants/index.ts` and `web/DESIGN_SYSTEM.md`.

---

## Platform Viewport & Surface Strategy

```text
Web Desktop (>= 1024px)       Web Mobile (< 768px)          Mobile Native (Expo)
┌────────────────────────┐    ┌────────────────────┐        ┌────────────────────┐
│Sidebar│ Topbar         │    │ Topbar (Logo/Menu) │        │ Native Status Bar  │
│       ├────────────────┤    ├────────────────────┤        ├────────────────────┤
│Nav    │ Bento Grid     │    │ Single-Column Feed │        │ Native Safe Area   │
│Links  │ or Data Table  │    │ Card View          │        │ Reanimated List    │
│       │                │    │                    │        │ Touch Gestures     │
│       │                │    ├────────────────────┤        ├────────────────────┤
│       │                │    │ Bottom Nav Bar     │        │ Bottom Tab Bar     │
└───────┴────────────────┘    └────────────────────┘        └────────────────────┘
```

---

## Screen & Route Inventory

### Classification Summary
* **MUST BUILD (P0)**: Essential for core user journey and winning feature demo.
* **SHOULD BUILD (P1)**: Important secondary workflows (filtering, edit, notifications).
* **SKIP (P2/P3)**: Defer until core flows are 100% stable.

---

### Route / Screen 1: Dashboard & Intelligence Hub
* **Platform Support**: Web (`/dashboard`) & Mobile (`app/home.tsx`)
* **Category**: MUST BUILD (P0)
* **Purpose**: Overview of operational metrics, primary entity feed, quick actions, and recent activity.
* **Web Implementation**: Desktop sidebar shell, KPI summary cards, interactive filter bar, high-density entity data table.
* **Mobile Implementation**: Vertical scroll container, metric carousel, swipeable card feed, floating action button.
* **Components Reused**:
  - Web: `web/components/layout/Sidebar.tsx`, `web/components/layout/Topbar.tsx`
  - Mobile: `frontend/components/common/HeaderSection.tsx`, `frontend/components/domain/ItemCard.tsx`

---

### Route / Screen 2: Entity Creation & AI Copilot
* **Platform Support**: Web (`/items/new`) & Mobile (`app/items/create.tsx`)
* **Category**: MUST BUILD (P0)
* **Purpose**: Capture new domain entities with AI-assisted enrichment and auto-completion.
* **Web Implementation**: Two-column layout (form on left, AI copilot preview and prompt generator on right).
* **Mobile Implementation**: Clean form with keyboard-avoiding container and "Generate with AI" toggle button.
* **Components Reused**:
  - Web: Form inputs, `web/lib/api/domain.ts`
  - Mobile: `CustomInput`, `CategoryPicker`, `AIButton`

---

### Route / Screen 3: Entity Detail & Lifecycle Manager
* **Platform Support**: Web (`/items/[id]`) & Mobile (`app/items/[id].tsx`)
* **Category**: MUST BUILD (P0)
* **Purpose**: Inspect single record, update status lifecycle, view timeline, download attachments.
* **Web Implementation**: Bento grid card container with status dropdown, action bar, and full file previews.
* **Mobile Implementation**: Card view with status badge pills, native document previewer, and delete confirmation sheet.

---

### Route / Screen 4: Dedicated AI Assistant / Synthesis Hub
* **Platform Support**: Web (`/ai-assistant`) & Mobile (in-dashboard modal or tab)
* **Category**: SHOULD BUILD (P1)
* **Purpose**: Free-form domain synthesis, task decomposition, and prompt generation via OpenRouter.
* **Web Implementation**: Split-pane prompt editor and formatted markdown response viewer with copy-to-clipboard.

---

### Route / Screen 5: Asset & File Manager
* **Platform Support**: Web (`/files`) & Mobile (`frontend/components/FilePicker.tsx`)
* **Category**: SHOULD BUILD (P1)
* **Purpose**: Upload, preview, and download project attachments and images.
* **Web Implementation**: Drag-and-drop file upload zone with file size/type validation and grid preview.
* **Mobile Implementation**: Native image/document picker with camera integration.

# 10 — Test Plan

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity after completing [`09_IMPLEMENTATION_PLAN.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/09_IMPLEMENTATION_PLAN.md).*

---

## Critical Dual-Platform User Journey

```text
Web or Mobile Sign In (Demo User)
   ↓
View Operational Dashboard with Domain KPIs
   ↓
Filter by Category & Query via Search Bar
   ↓
Create New Domain Entity with AI Assist
   ↓
Execute Standout Winning Feature Action
   ↓
Verify Notification Badge & Instant Analytics Update
   ↓
Cross-Platform Parity Check (Item visible on both Web and Mobile)
```

---

## Automated Verification Commands

Run these automated checks before any presentation:

| Target | Command | Verification Goal |
| :--- | :--- | :--- |
| **Web Production Build** | `npm run web:build` | Confirms zero TypeScript or Next.js bundling errors |
| **Backend Build** | `cd backend && npm run build` | Confirms Node.js / Express compilation succeeds |
| **Backend Test Suite** | `cd backend && npm test -- --runInBand` | Executes unit and route tests |
| **Database Seed** | `npm run seed:reset` | Resets deterministic demo records and credentials |

---

## Web Client Verification Matrix

- [ ] **Landing Page (`/`)**: Hero animations, product showcase, and smooth scrolling render with zero console errors.
- [ ] **Authentication (`/login`, `/signup`)**: Email login (`demo@app.com` / `Demo123!`), password visibility toggle, password strength meter on signup.
- [ ] **Protected Route Guard**: Accessing `/dashboard` while unauthenticated routes user to `/login`.
- [ ] **Dashboard (`/dashboard`)**: KPI metric cards, completion rate chart, category distribution, and recent activity load clean.
- [ ] **Data Table (`/items`)**: Full-text search filtering, category pills, status indicators, and pagination controls work.
- [ ] **Entity Creation (`/items/new`)**: Form submission creates item, triggers toast feedback, and redirects to item detail.
- [ ] **Entity Inspection (`/items/[id]`)**: Lifecycle status transition updates color badge and persists to backend.
- [ ] **AI Assistant (`/ai-assistant`)**: Prompt synthesizer generates structured output via OpenRouter gateway.
- [ ] **Asset Manager (`/files`)**: File drag-and-drop uploads asset and displays file metadata.
- [ ] **Responsive Layout**:
  - [ ] Desktop Viewport (1280px+): Persistent left sidebar and 3-column bento grids.
  - [ ] Tablet Viewport (768px): Compact header and collapsible menu.
  - [ ] Mobile Viewport (375px): Touch-friendly card view with minimum 44px tap targets.
- [ ] **Accessibility**: All interactive elements have `:focus-visible` styling; proper heading hierarchy (`h1`, `h2`, `h3`).

---

## Mobile Client Verification Matrix

- [ ] **Launch & Auth**: Onboarding flow and email/password login operate on Expo emulator/device.
- [ ] **Home Dashboard**: Metric cards and category filter pills render correctly.
- [ ] **Item CRUD**: Entity creation, detail inspection, and deletion function smoothly.
- [ ] **Native Safe Areas**: Layouts respect device notches and bottom navigation bars.
- [ ] **Touch Targets**: All action buttons and touchables meet minimum 44pt sizing.

---

## Offline & Resilience Verification

- [ ] **API Failure Handling**: Graceful error toast with retry trigger when API is unreachable.
- [ ] **AI Timeout Fallback**: Fallback template response appears if OpenRouter gateway times out.
- [ ] **Session Expiry**: Clearing `localStorage` triggers immediate redirect to `/login`.

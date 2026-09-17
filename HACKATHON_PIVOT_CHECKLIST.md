# Hackathon Rapid Pivot Checklist

A battle-tested execution guide for adapting this multi-platform codebase to any hackathon problem statement in **under 2 hours** across **Web (`web/`)**, **Mobile (`frontend/`)**, and **Backend (`backend/`)**.

---

## 1. Decompose the Problem Statement (0:00 – 0:15)

Open `hackathon/PROBLEM_STATEMENT.md` and document:
- [ ] **Target Users & Roles**: (e.g. `Paramedic`, `ER Nurse`, `Dispatcher`)
- [ ] **Primary Entity**: (e.g. `TriageCase`, `DonationItem`, `CourseSession`)
- [ ] **Core User Workflow**: What 3 actions demonstrate real value in the demo?
- [ ] **Winning Feature**: What unique differentiator wows the judges?
- [ ] **Target Execution**: Synchronized Dual-Platform (Web command center + Mobile field app).

---

## 2. Configure the Unified Domain Engine (0:15 – 0:30)

Update **`web/lib/domain.config.ts`** and **`shared/src/config/domain.config.ts`**:
- [ ] `brand`: App name, tagline, description, theme accent color.
- [ ] `domain`: Primary entity name, plural, categories, and custom status options.
- [ ] `navigation`: Routes mapped to Lucide icons (`LayoutDashboard`, `HeartPulse`, `Activity`, `Sparkles`, `Bell`).
- [ ] `landing`: Dynamic hero headlines, value proposition, and feature cards.
- [ ] `dashboard`: Problem-relevant KPI cards and metrics.

*Note: Mobile automatically consumes this via `frontend/config/appConfig.ts`.*

---

## 3. Populate Realistic Domain Seeds (0:30 – 0:45)

Never present empty or generic ticket records to judges:
- [ ] Edit `backend/src/seeds/datasets/generic.ts` with 5–10 realistic domain records.
- [ ] Use `priority` (`'urgent' | 'high' | 'medium' | 'low'`).
- [ ] Use the `attributes` map for domain-specific telemetry (e.g. `vitals`, `location`, `assignedUnits`).
- [ ] Run seed reset:
  ```bash
  cd backend && npm run seed:reset
  ```

---

## 4. Implement Dual-Platform Parity (0:45 – 1:30)

Execute Web and Mobile in parallel:

### Web Command Center (`web/`)
- [ ] Verify data table displays domain items, categories, and priority badges (`/items`).
- [ ] Check `/items/new` creates items with domain categories.
- [ ] Inspect `/items/[id]` detail view displays specifications and system telemetry.
- [ ] Check `/dashboard` displays live KPI cards and operational feed.
- [ ] **Synchronize Markdown Specifications**: Whenever the dashboard layout, data models, or hero showcase mockups are updated, immediately update the relevant markdown files (`hackathon/02_PRODUCT_SPEC.md`, `hackathon/03_UX_PLAN.md`, `hackathon/05_DATA_MODEL.md`, `hackathon/13_CHANGE_LOG.md`, and `PROJECT_ARCHITECTURE.md`).

### Mobile Field Client (`frontend/`)
- [ ] Verify `home.tsx` displays domain metrics and quick action cards.
- [ ] Check active bottom tabs: `Home`, `Records`, `Create`, `AI Copilot`, `Alerts`.
- [ ] Verify creating an item on Mobile persists to the shared backend.

---

## 5. Polish Landing Page & AI Grounding (1:30 – 1:45)

- [ ] Check `http://localhost:3000` tells the problem statement story, not a starter pack description.
- [ ] Verify OpenRouter AI prompt in `domainConfig.domain.aiSystemPrompt` generates domain-grounded summaries.

---

## 6. Pre-Demo Verification & Walkthrough (1:45 – 2:00)

Run the verification battery:
- [ ] **Web Lint Check**: `npm run lint` in `web/` (must pass with 0 errors).
- [ ] **Mobile Type Check**: `npx tsc --noEmit` in `frontend/` (must pass with 0 errors).
- [ ] **Database Integrity**: Re-run `npm run seed:reset` in `backend/` for fresh presentation data.
- [ ] **2-Minute Demo Rehearsal**:
  1. *Hook*: Landing page showing the problem statement value proposition.
  2. *Action*: Log a new entity on the Mobile field app.
  3. *Sync*: Refresh Web Command Center to show the record instantly appeared.
  4. *Intelligence*: Click "AI Copilot Analysis" on the entity detail view for automated synthesis.

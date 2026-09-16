---
name: hackathon-pivot
description: Controls how Antigravity adapts this multi-platform starter pack to any new hackathon problem statement through rapid domain modeling, dual-platform parity, and unified configuration.
---

# Hackathon Pivot Skill (Production-Grade Autonomous Engine)

This skill governs how Antigravity autonomously analyzes, models, and implements any hackathon problem statement across **Web (`web/`)**, **Mobile (`frontend/`)**, and **Shared Backend (`backend/`)**.

## The Sovereign Mandate

> **"Solve the actual problem statement. Never deliver a generic SaaS ticket dashboard with substituted titles."**

Antigravity must treat the hackathon problem statement as the single source of truth for:
1. Target actors and user roles.
2. Core domain entities, relationships, and data fields.
3. Purpose-built workflows and states.
4. Bespoke landing page narrative.
5. Dual-platform execution parity (Web + Mobile).

---

## 1. The Autonomous Execution Lifecycle

When given an arbitrary problem statement, Antigravity executes the following 6-phase pipeline without cutting corners or relabeling templates:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                      HACKATHON EXECUTION LIFECYCLE                            │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  [PHASE 1: DOMAIN DECOMPOSITION]                                              │
│  Extract: Target Users, Primary Entities, Core Workflow, Winning Feature      │
│                                  │                                            │
│                                  ▼                                            │
│  [PHASE 2: UNIFIED CONFIG ENGINE]                                             │
│  Update `domain.config.ts` (Propagates brand, nav, landing copy & KPI metrics)│
│                                  │                                            │
│                                  ▼                                            │
│  [PHASE 3: DOMAIN SEED PAYLOAD]                                               │
│  Populate `backend/src/seeds/datasets/` with rich domain records + attributes │
│                                  │                                            │
│                                  ▼                                            │
│  [PHASE 4: DUAL-PLATFORM PARITY EXECUTION]                                    │
│  Build Web Command Center AND Mobile Touch Experience in Parallel             │
│                                  │                                            │
│                                  ▼                                            │
│  [PHASE 5: LANDING PAGE & STORYTELLING]                                       │
│  Ensure landing page tells the specific problem story, not a starter kit pitch│
│                                  │                                            │
│                                  ▼                                            │
│  [PHASE 6: VERIFICATION & TRIAL DEMO WALKTHROUGH]                             │
│  Run typechecks, seed resets, and rehearse the 2-minute judge demo flow       │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase-by-Phase Directives

### Phase 1: Domain Decomposition
1. **Read `hackathon/PROBLEM_STATEMENT.md`** first.
2. Extract the **Primary Domain Entity** (e.g. `TriageCase`, `FoodDonation`, `CourseModule`, `SensorIncident`).
3. Extract **Actor Roles** (e.g. `['Dispatcher', 'Field Responder', 'Medical Staff']`).
4. Extract **Core User Journey**: What exact 3-step action sequence will be shown to the hackathon judges?
5. Extract the **Winning Feature**: The specific differentiator (e.g. live resource matching, real-time risk heat-map, instant offline triage queue).

### Phase 2: Unified Domain Configuration Engine
Update the domain configuration in **`web/lib/domain.config.ts`** and **`shared/src/config/domain.config.ts`**:
```typescript
export const domainConfig: DomainConfig = {
  brand: {
    name: 'DisasterMed',
    shortName: 'D-Med',
    tagline: 'Real-Time Disaster Triage & Emergency Hospital Bed Routing',
    description: 'Connecting field paramedics with emergency room capacity in real time.',
    accentColor: '#DC2626',
    themeGradient: ['#7F1D1D', '#991B1B'],
  },
  domain: {
    primaryEntityName: 'Triage Case',
    entityPluralName: 'Triage Cases',
    categories: ['Trauma', 'Pediatric', 'Cardiovascular', 'Burn', 'General'],
    statuses: [
      { key: 'pending', label: 'Triage Influx', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700' },
      { key: 'in_progress', label: 'En Route', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700' },
      { key: 'completed', label: 'Admitted', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    ],
    roles: ['Paramedic', 'Triage Nurse', 'Physician', 'Incident Commander'],
    aiSystemPrompt: 'Act as an emergency triage decision assistant. Classify injury severity and recommend facility routing.',
  },
  navigation: [
    { name: 'Command Center', href: '/dashboard', iconName: 'LayoutDashboard' },
    { name: 'Triage Feed', href: '/items', iconName: 'HeartPulse' },
    { name: 'Bed Logistics', href: '/files', iconName: 'Activity' },
    { name: 'AI Dispatcher', href: '/ai-assistant', iconName: 'Sparkles' },
    { name: 'Emergency Alerts', href: '/notifications', iconName: 'Bell' },
  ],
  landing: {
    hero: {
      badge: 'Critical Life-Support Logistics',
      headlineWords: [
        { text: 'Sub-Second', highlightBg: '#DC2626', textColor: '#FFFFFF' },
        { text: 'Triage' },
        { text: 'Routing', highlightBg: '#2563EB', textColor: '#FFFFFF' },
        { text: 'for' },
        { text: 'Emergency', highlightBg: '#10B981', textColor: '#FFFFFF' },
        { text: 'Responders.' },
      ],
      subheadline: 'Eliminate casualty routing bottlenecks by synchronizing field ambulances directly with emergency room ICU bed capacity.',
      ctaPrimary: { label: 'Open Triage Command', href: '/login' },
      ctaSecondary: { label: 'Field Responder Mobile', href: '#features' },
    },
    ...
  }
};
```
*Updating this configuration immediately updates the Web Sidebar, Web Topbar, Mobile Home, and Dashboard titles across all clients.*

### Phase 3: Domain Seed Payload
Never leave generic "Sample Item 1", "Engineering Task" demo records in the database.
1. Update `backend/src/seeds/datasets/` with 5–10 realistic, domain-specific records.
2. Use the flexible `attributes` map for domain-specific fields:
   ```json
   {
     "title": "Severe Hypothermia - Sector 4",
     "description": "Patient extracted from floodwaters. Core temp 31C, GCS 11.",
     "status": "in_progress",
     "category": "Trauma",
     "priority": "urgent",
     "attributes": {
       "vitals": { "heartRate": 132, "spo2": 88 },
       "assignedAmbulance": "Unit-104",
       "targetFacility": "Mercy General ER (2 ICU Beds Available)"
     }
   }
   ```
3. Run `npm run seed:reset` to load clean, deterministic demo data.

### Phase 4: Dual-Platform Execution Parity
**RULE**: Every core workflow capability must be accessible on both Web and Mobile.
- **Web Command Center (`web/app/(app)/`)**:
  - High-density data table with category filters, priority badges, and quick triage actions.
  - Detail inspection drawer rendering the custom `attributes`.
  - Dynamic KPI cards matching `domainConfig.dashboard.metrics`.
- **Mobile Field Experience (`frontend/app/`)**:
  - Touch-first cards optimized for one-handed operation.
  - Quick action buttons (e.g. `Log Incident`, `Update Status`, `Attach Photo`).
  - Active bottom tabs: `Home`, `Records`, `Create`, `AI Copilot`, `Alerts`.

### Phase 5: Landing Page Narrative
The landing page must immediately communicate what the solution does to any judge who visits `http://localhost:3000`:
- Clear problem hook and solution summary.
- Highlighted domain keywords matching the problem statement.
- Feature cards explaining how the platform solves the specific bottleneck.

### Phase 6: Verification & Trial Demo
Before declaring the pivot complete:
1. Run `npm run lint` in `web/` (must pass with 0 errors).
2. Run `npx tsc --noEmit` in `frontend/` (must pass with 0 errors).
3. Test the cross-platform sync flow: Log a record on Mobile, verify it appears on the Web dashboard table upon refresh.
4. Formulate the 2-minute judge walkthrough: Problem statement → Live triage log → AI synthesis → Cross-platform update.

---

## 3. Strict Code & Architecture Rules

1. **Zero Monolithic Bloat**: Keep components modular; never introduce single-file 800+ line monsters.
2. **Never Break Metro Bundling**: Do not alter `frontend/babel.config.js`, `frontend/metro.config.js`, or native packages unless explicitly mandated.
3. **No Speculative Architecture**: Do not install PostgreSQL, Redis, GraphQL, or complex state managers. Use the existing, battle-tested REST + Mongo + Context stack.
4. **Preserve Reusable Infrastructure**: Keep JWT auth, rate limiters, Multer upload pipes, and OpenRouter AI adapters untouched—only adapt the domain schemas, configs, and UI views.

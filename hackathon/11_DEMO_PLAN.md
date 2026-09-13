# 11 — Demo Plan

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity after completing [`10_TEST_PLAN.md`](file:///d:/Code_A_Thon/hackathon/10_TEST_PLAN.md).*

---

## Demo Goal

Within the **first 60 seconds**, judges must clearly understand:
1. Who the target user is.
2. What acute problem they face.
3. How this application solves it effortlessly.
4. The unique power of the **Winning Feature**.

---

## Demo Flow (2-Minute Timed Breakdown)

```text
[0:00 - 0:20] Context & Hook
  ↳ Open on polished Onboarding screen. State the target user and acute pain point.

[0:20 - 0:45] Core Dashboard & Seed Realism
  ↳ Navigate to Dashboard. Show category filtering & search. Highlight status distribution.

[0:45 - 1:20] Creation & Winning Feature ("WOW Moment")
  ↳ Create a new item live. Trigger AI auto-summarization / subtask generation.
  ↳ Execute the Winning Feature action with instant visual feedback.

[1:20 - 1:45] Analytics & Value Summary
  ↳ Show Analytics dashboard metrics auto-updating. Point out real-time notifications.

[1:45 - 2:00] Closing Statement & Impact
  ↳ Recap core impact, scalability, and wrap up presentation.
```

---

## "Wow Moment"

* **Target Feature**: [Winning Feature Name]
* **Exact Step**: [The exact click/tap action during demo]
* **Visual Impact**: [What appears on screen—e.g., instant AI insights modal, dynamic visual transition, notification badge animation]
* **Why Judges Care**: Demonstrates real technical execution over slide deck promises.

---

## Backup Demo Flow

What happens if live failure occurs during presentation:

* **If OpenRouter AI fails or lags**:  
  ↳ System automatically switches to pre-built offline fallback responses. Continue presentation seamlessly without mentioning network delay.
* **If live network fails**:  
  ↳ App operates on local cached state. Demonstrate offline resilience banner as an intentional feature.
* **If API server stops**:  
  ↳ Keep demo database pre-seeded (`npm run seed:reset`) and restart backend script immediately using backup terminal window.
* **If mobile screen mirroring disconnects**:  
  ↳ Have Expo web browser build pre-loaded in browser tab (`localhost:8081`).

---

## Demo Data Strategy

* **Dataset File**: [`backend/src/seeds/datasets/generic.ts`](file:///d:/Code_A_Thon/backend/src/seeds/datasets/generic.ts)
* **Pre-seeded Items**: 6 realistic, highly descriptive domain records.
* **Demo User Credentials**: `demo@app.com` / `Demo123!`

---

## Demo Preparation Checklist

- [ ] Run `npm run seed:reset` to guarantee clean initial state.
- [ ] Log in as demo user and verify dashboard is populated.
- [ ] Confirm screen brightness is set to high for display/mirroring.
- [ ] Open backup browser window pointing to web build.
- [ ] Test audio/screen recording if remote pitch.
- [ ] Perform full 2-minute trial run-through.

# 11 — Demo Plan

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity after completing [`10_TEST_PLAN.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/10_TEST_PLAN.md).*

---

## Demo Goal & Audience Impact

Within the **first 60 seconds**, judges must clearly grasp:
1. **Who** the target user is.
2. **What** acute pain point they face.
3. **How** this multi-platform application solves it with speed and precision.
4. The unique technical superiority of the **Winning Feature**.

---

## 2-Minute Presentation Breakdown (Web & Cross-Platform Flow)

```text
[0:00 - 0:25] Context & Hook
  ↳ Open on the high-conversion Web Landing Page (http://localhost:3000).
  ↳ State target user persona and acute operational pain point in 2 punchy sentences.

[0:25 - 0:55] Core Operational Workspace & Realism
  ↳ Log in as demo user into `/dashboard`.
  ↳ Point out real-time KPI metrics, category breakdowns, and high-density Data Table.
  ↳ Filter by category and search keyword to demonstrate speed and zero lag.

[0:55 - 1:30] Creation & The Winning Feature ("WOW Moment")
  ↳ Navigate to `/items/new`.
  ↳ Enter domain entity details and trigger AI auto-enrichment.
  ↳ Execute the Winning Feature action live with visible visual feedback (modal, chart update).

[1:30 - 1:45] Cross-Platform Parity Showcase
  ↳ Pull up Mobile Client (or responsive mobile viewport) showing the newly created item 
    instantly visible via the shared backend API.

[1:45 - 2:00] Closing Impact & Scalability
  ↳ Summarize measurable time saved, architecture cleanliness, and open for judge questions.
```

---

## Standout "Wow Moment"

* **Target Feature**: [Winning Feature Name]
* **Exact Step**: [The exact click/action taken during presentation]
* **Visual Impact**: [Instant AI synthesis, kinetic visualization, dynamic data recalculation]
* **Why Judges Care**: Demonstrates full-stack technical execution over static prototypes or slide decks.

---

## Presentation Backup Protocols

If unexpected failures occur during the live judge demo:

* **If OpenRouter AI lags or times out**:
  ↳ The application automatically displays a pre-cached offline domain analysis. Proceed without pausing or mentioning API latency.
* **If live WiFi disconnects**:
  ↳ Demonstrate local UI responsiveness and explain that offline state handling is an intentional resilience feature.
* **If API server terminates**:
  ↳ Keep a secondary terminal window ready to run `npm run backend` and `npm run seed:reset`.
* **If mobile mirroring fails**:
  ↳ Switch immediately to the desktop browser in responsive mobile viewport mode (`Ctrl+Shift+M`).

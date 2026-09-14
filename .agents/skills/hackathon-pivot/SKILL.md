---
name: hackathon-pivot
description: Controls how Antigravity handles a new hackathon problem statement by enforcing analysis, documentation updates, and strict architectural reuse across Web, Mobile, and Backend before any implementation code is written.
---

# Hackathon Pivot Skill

This skill governs how Antigravity approaches a completely new hackathon problem statement or product pivot in this workspace across **Web (`web/`)**, **Mobile (`frontend/`)**, and **Shared Backend (`backend/`)**.

## Core Mandate

> **"Do not turn every hackathon problem into a new architecture."**

Before modifying application code, Antigravity must systematically analyze requirements, determine the primary delivery platform(s), map requirements against existing capabilities, update planning documentation, and obtain explicit user approval.

---

## 1. Problem Statement Analysis Workflow

When given a new hackathon problem statement or pivot request, Antigravity MUST execute the following sequence:

### Step 1: Read Primary Problem Source
Read the official problem statement first from:
`hackathon/PROBLEM_STATEMENT.md`

### Step 2: Determine Target Platform(s)
Identify whether the prompt mandates:
- **Web Application** (Desktop / responsive browser)
- **Mobile Application** (Touch-first mobile app)
- **Dual-Platform** (Synchronized Web workspace + Mobile field client)

### Step 3: Read Planning Documents & Pivot Checklist
Read core hackathon planning files in `hackathon/`:
- `hackathon/README.md`
- `01_PROBLEM_ANALYSIS.md`
- `02_PRODUCT_SPEC.md`
- `03_UX_PLAN.md`
- `04_TECHNICAL_PLAN.md`
- `06_API_PLAN.md`
- `09_IMPLEMENTATION_PLAN.md`
- `10_TEST_PLAN.md`
- `11_DEMO_PLAN.md`
- `HACKATHON_PIVOT_CHECKLIST.md`

### Step 4: Inspect Actual Repository
Inspect existing code structures in `web/`, `frontend/`, `backend/`, and `shared/` to verify current state before making architectural assumptions.

---

## 2. Requirement Mapping Matrix

Every identified requirement must be mapped using the strict hierarchy:

$$\text{REUSE} \longrightarrow \text{CONFIGURE} \longrightarrow \text{EXTEND} \longrightarrow \text{NEW}$$

1. **REUSE**: Use existing backend routes, UI components, data models, auth, or hooks without alteration.
2. **CONFIGURE**: Adjust existing parameters, themes, seeds, or configuration files (`shared/src/constants/index.ts`, `frontend/config/appConfig.ts`).
3. **EXTEND**: Add new endpoints, fields, or props to existing files while keeping contracts backward-compatible.
4. **NEW**: Create new files ONLY when existing functionality cannot satisfy the requirement.

---

## 3. Entity & Core Journey Identification

Antigravity must explicitly define:
- **Target User & Persona**: Who is using the solution.
- **Actual Problem**: Root pain point being solved.
- **Target Platform**: Web, Mobile, or Synchronized Dual-Platform.
- **Primary Entity**: Core domain model (e.g., Task, Incident, Request, Donation).
- **Core User Journey**: End-to-end user path from entry to completion.
- **Feature Prioritization (P0 / P1 / P2)**:
  - **P0**: Core journey & winning feature (Must have for MVP).
  - **P1**: UX polish, secondary flows, error handling.
  - **P2**: Nice-to-haves (defer unless core flow is 100% complete).
- **Unique / Winning Feature**: The standout capability that wows hackathon judges.
- **Required Client Screens / Routes**: Web pages (`web/app/(app)/...`) and/or Mobile screens (`frontend/app/...`).
- **Required Backend / Shared Changes**: Minimal changes to `HackathonItemSchema` and `shared/src/types/`.
- **AI Utility Check**: Determine whether AI is genuinely useful for the core problem or just novelty.

---

## 4. Strict Execution Constraints

1. **Do Not Invent Requirements**: Build strictly what solves the problem statement.
2. **No Speculative Architecture**: Never install unneeded frameworks, ORMs, or database engines.
3. **Preserve Cross-Platform Stability**: Do not break mobile Metro paths while building Web features, and vice versa.
4. **Build Verification**: Validate changes using `npm run web:build` and backend tests before declaring tasks complete.

# Hackathon AI Planning & Documentation System

The `hackathon/` directory contains a reusable, domain-agnostic planning and documentation system designed for rapid hackathon execution with AI assistance (Antigravity).

---

## What is `hackathon/`?

`hackathon/` is a structured, standardized documentation pipeline that converts any raw hackathon problem statement into a clear, executable, and architecture-preserving implementation plan.

It ensures that when a new hackathon problem is received:
1. Requirements are analyzed systematically.
2. Architecture is reused rather than reinvented.
3. The MVP scope is strictly controlled (P0 vs P1/P2).
4. A single winning feature is prioritized.
5. The implementation follows deterministic, verifiable steps without breaking existing code.

---

## When to Use It

Use this documentation system **immediately upon receiving the official hackathon problem statement** on hackathon day.

---

## Documentation Pipeline & Order of Execution

Antigravity and the developer must read and process the files in the following strict sequential order:

```text
PROBLEM STATEMENT (PROBLEM_STATEMENT.md) — [User Input / Source of Truth]
        ↓
01_PROBLEM_ANALYSIS.md — [Structured Problem & Job Analysis]
        ↓
02_PRODUCT_SPEC.md — [Scope, MVP Features & Winning Feature]
        ↓
03_UX_PLAN.md — [Screen Inventory & User Journey]
        ↓
04_TECHNICAL_PLAN.md — [Architecture Inspection & Capability Mapping]
        ↓
05_DATA_MODEL.md — [HackathonItem Adaptation & Entity Plan]
        ↓
06_API_PLAN.md — [Endpoint Classification & Rules]
        ↓
07_AI_PLAN.md — [OpenRouter Integration & Prompts]
        ↓
08_MOBBIN_RESEARCH.md — [UX Patterns & Mobile UI Direction]
        ↓
09_IMPLEMENTATION_PLAN.md — [Phase & Task Execution Plan]
        ↓
IMPLEMENTATION — [Execute Tasks in 09_IMPLEMENTATION_PLAN.md]
        ↓
10_TEST_PLAN.md — [Automated & Manual Demo Verification]
        ↓
11_DEMO_PLAN.md — [Live Demo Flow & Backup Protocols]
        ↓
12_PITCH_PLAN.md — [Presentation & Value Story]
```

*Note: `13_CHANGE_LOG.md` is updated continuously throughout the execution process.*

---

## Document Classification

### Source of Truth
* [`PROBLEM_STATEMENT.md`](file:///d:/Code_A_Thon/hackathon/PROBLEM_STATEMENT.md) — The raw, unmodified problem statement provided by hackathon organizers. **Antigravity must not invent requirements not present here.**

### Static Entry & Operating Rules
* [`README.md`](file:///d:/Code_A_Thon/hackathon/README.md) — System entry point, workflow diagram, and permanent AI operating rules.

### Generated / Updated Planning Documents
All other files (`01_` through `13_`) are structured planning documents generated/updated after pasting the problem statement into `PROBLEM_STATEMENT.md`:
* **Problem & Product Definition**: [`01_PROBLEM_ANALYSIS.md`](file:///d:/Code_A_Thon/hackathon/01_PROBLEM_ANALYSIS.md), [`02_PRODUCT_SPEC.md`](file:///d:/Code_A_Thon/hackathon/02_PRODUCT_SPEC.md), [`03_UX_PLAN.md`](file:///d:/Code_A_Thon/hackathon/03_UX_PLAN.md)
* **Technical & Architecture Adaptation**: [`04_TECHNICAL_PLAN.md`](file:///d:/Code_A_Thon/hackathon/04_TECHNICAL_PLAN.md), [`05_DATA_MODEL.md`](file:///d:/Code_A_Thon/hackathon/05_DATA_MODEL.md), [`06_API_PLAN.md`](file:///d:/Code_A_Thon/hackathon/06_API_PLAN.md), [`07_AI_PLAN.md`](file:///d:/Code_A_Thon/hackathon/07_AI_PLAN.md), [`08_MOBBIN_RESEARCH.md`](file:///d:/Code_A_Thon/hackathon/08_MOBBIN_RESEARCH.md)
* **Execution & Quality**: [`09_IMPLEMENTATION_PLAN.md`](file:///d:/Code_A_Thon/hackathon/09_IMPLEMENTATION_PLAN.md), [`10_TEST_PLAN.md`](file:///d:/Code_A_Thon/hackathon/10_TEST_PLAN.md), [`11_DEMO_PLAN.md`](file:///d:/Code_A_Thon/hackathon/11_DEMO_PLAN.md), [`12_PITCH_PLAN.md`](file:///d:/Code_A_Thon/hackathon/12_PITCH_PLAN.md), [`13_CHANGE_LOG.md`](file:///d:/Code_A_Thon/hackathon/13_CHANGE_LOG.md)

---

## Important Distinction: Planning System vs Architecture

This directory is a **planning and documentation system**, NOT a second application architecture.

* It does **not** introduce new backend frameworks, database managers, or state libraries.
* It operates strictly within the existing starter kit architecture documented in [`HACKATHON_PIVOT_CHECKLIST.md`](file:///d:/Code_A_Thon/HACKATHON_PIVOT_CHECKLIST.md) and [`frontend/config/appConfig.ts`](file:///d:/Code_A_Thon/frontend/config/appConfig.ts).

---

# ANTIGRAVITY OPERATING RULES

When Antigravity is instructed to analyze a hackathon problem statement and build the solution, it MUST adhere strictly to these permanent operating rules:

## Rule 1 — Read Before Coding

When a new problem statement is provided:
1. Read [`PROBLEM_STATEMENT.md`](file:///d:/Code_A_Thon/hackathon/PROBLEM_STATEMENT.md)
2. Read [`01_PROBLEM_ANALYSIS.md`](file:///d:/Code_A_Thon/hackathon/01_PROBLEM_ANALYSIS.md)
3. Read [`02_PRODUCT_SPEC.md`](file:///d:/Code_A_Thon/hackathon/02_PRODUCT_SPEC.md)
4. Read [`03_UX_PLAN.md`](file:///d:/Code_A_Thon/hackathon/03_UX_PLAN.md)
5. Read [`04_TECHNICAL_PLAN.md`](file:///d:/Code_A_Thon/hackathon/04_TECHNICAL_PLAN.md)
6. Read the relevant remaining documents in sequence.

Do not start coding immediately.

## Rule 2 — Existing Architecture First

Before creating anything:
> Search the repository for existing functionality.

Prefer:
```text
REUSE > CONFIGURE > EXTEND > NEW
```

Always check existing capabilities in [`frontend/config/appConfig.ts`](file:///d:/Code_A_Thon/frontend/config/appConfig.ts), [`backend/src/models/HackathonItem.ts`](file:///d:/Code_A_Thon/backend/src/models/HackathonItem.ts), and existing APIs/services before writing code.

## Rule 3 — No Speculation

Do not implement features because they might become useful later. Implement only requirements that are explicitly justified by `PROBLEM_STATEMENT.md`.

## Rule 4 — No Architecture Rewrites

The existing starter kit (React Native / Expo + Node.js / Express + MongoDB / Mongoose + OpenRouter AI) is the fixed technical foundation. Do not replace working architecture without a demonstrated requirement.

## Rule 5 — One Logical Change at a Time

Each implementation task in `09_IMPLEMENTATION_PLAN.md` must have:
* objective
* target files
* implementation details
* explicit verification command/steps

## Rule 6 — No Fake Verification

Never claim tests/builds/manual flows passed unless actually executed via command line tools or physical verification.

## Rule 7 — Preserve Working Features

Do not accidentally break existing starter-kit features:
* authentication / JWT / OAuth
* CRUD on `HackathonItem`
* full-text search & category filtering
* analytics dashboard endpoints
* OpenRouter AI integration
* file upload & attachment handling
* in-app notifications
* network resilience & offline fallbacks
* navigation structure

when they are not related to the current task.

## Rule 8 — Problem-Specific Work Gets Priority

The unique feature ("Winning Feature") that solves the actual hackathon problem has higher priority than generic infrastructure or non-essential polish.

## Rule 9 — Time Awareness

Prefer a smaller working MVP (P0 features + winning feature) over an ambitious, incomplete product.

## Rule 10 — Stop Expanding

Once P0 requirements and the winning feature are working:
> Polish → test → demo.

Do not continue adding speculative infrastructure or secondary features.

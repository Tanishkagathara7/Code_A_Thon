# Hackathon AI Planning & Documentation System

The `hackathon/` directory contains a reusable, domain-agnostic planning and documentation system designed for rapid hackathon execution with AI assistance (Antigravity).

It supports **Dual-Platform (Web + Mobile) Development**, **Web-First Prototyping**, and **Mobile-First App Workflows** with a unified shared backend.

---

## What is `hackathon/`?

`hackathon/` is a structured, standardized documentation pipeline that converts any raw hackathon problem statement into a clear, executable, and architecture-preserving implementation plan.

It ensures that when a new hackathon problem is received:
1. Requirements are analyzed systematically across target user roles.
2. The target platform(s) (**Web**, **Mobile**, or **Both**) are explicitly identified.
3. Architecture is reused rather than reinvented across `web/`, `frontend/`, and `backend/`.
4. The MVP scope is strictly controlled (P0 vs P1/P2).
5. A single winning feature is prioritized for maximum presentation impact.
6. The implementation follows deterministic, verifiable steps without breaking existing code.

---

## When to Use It

Use this documentation system **immediately upon receiving the official hackathon problem statement** on hackathon day.

---

## Documentation Pipeline & Order of Execution

Antigravity and the developer must read and process the files in the following strict sequential order:

```text
PROBLEM STATEMENT (PROBLEM_STATEMENT.md) — [User Input / Source of Truth]
        ↓
01_PROBLEM_ANALYSIS.md — [Structured Problem, Job & Platform Analysis]
        ↓
02_PRODUCT_SPEC.md — [Scope, MVP Features & Winning Feature]
        ↓
03_UX_PLAN.md — [Web Routes & Mobile Screen Inventory]
        ↓
04_TECHNICAL_PLAN.md — [Architecture Inspection & Capability Mapping]
        ↓
05_DATA_MODEL.md — [HackathonItem Adaptation & Entity Plan]
        ↓
06_API_PLAN.md — [Shared Endpoint Classification & Rules]
        ↓
07_AI_PLAN.md — [OpenRouter Integration & Prompts]
        ↓
08_MOBBIN_RESEARCH.md — [UX Patterns & Visual Direction]
        ↓
09_IMPLEMENTATION_PLAN.md — [Web, Mobile & Shared Task Execution]
        ↓
IMPLEMENTATION — [Execute Tasks in 09_IMPLEMENTATION_PLAN.md]
        ↓
10_TEST_PLAN.md — [Automated & Manual Demo Verification on Web/Mobile]
        ↓
11_DEMO_PLAN.md — [Live Demo Flow & Backup Protocols]
        ↓
12_PITCH_PLAN.md — [Presentation & Value Story]
```

*Note: `13_CHANGE_LOG.md` is updated continuously throughout the execution process.*

---

## Document Classification

### Source of Truth
* [`PROBLEM_STATEMENT.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/PROBLEM_STATEMENT.md) — The raw, unmodified problem statement provided by hackathon organizers. **Antigravity must not invent requirements not present here.**

### Static Entry & Operating Rules
* [`README.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/README.md) — System entry point, workflow diagram, and permanent AI operating rules.

### Generated / Updated Planning Documents
All other files (`01_` through `13_`) are structured planning documents generated/updated after pasting the problem statement into `PROBLEM_STATEMENT.md`:
* **Problem & Product Definition**: [`01_PROBLEM_ANALYSIS.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/01_PROBLEM_ANALYSIS.md), [`02_PRODUCT_SPEC.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/02_PRODUCT_SPEC.md), [`03_UX_PLAN.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/03_UX_PLAN.md)
* **Technical & Architecture Adaptation**: [`04_TECHNICAL_PLAN.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/04_TECHNICAL_PLAN.md), [`05_DATA_MODEL.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/05_DATA_MODEL.md), [`06_API_PLAN.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/06_API_PLAN.md), [`07_AI_PLAN.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/07_AI_PLAN.md), [`08_MOBBIN_RESEARCH.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/08_MOBBIN_RESEARCH.md)
* **Execution & Quality**: [`09_IMPLEMENTATION_PLAN.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/09_IMPLEMENTATION_PLAN.md), [`10_TEST_PLAN.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/10_TEST_PLAN.md), [`11_DEMO_PLAN.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/11_DEMO_PLAN.md), [`12_PITCH_PLAN.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/12_PITCH_PLAN.md), [`13_CHANGE_LOG.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/13_CHANGE_LOG.md)

---

# ANTIGRAVITY OPERATING RULES (WEB + MOBILE)

When Antigravity is instructed to analyze a hackathon problem statement and build the solution, it MUST adhere strictly to these permanent operating rules:

## Rule 1 — Read Before Coding
When a new problem statement is provided:
1. Read `PROBLEM_STATEMENT.md`
2. Read `01_PROBLEM_ANALYSIS.md`
3. Read `02_PRODUCT_SPEC.md`
4. Read `03_UX_PLAN.md`
5. Read `04_TECHNICAL_PLAN.md`
6. Read the relevant remaining documents in sequence.
Do not start coding immediately.

## Rule 2 — Existing Architecture First
Before creating anything, search the repository for existing functionality:
```text
REUSE > CONFIGURE > EXTEND > NEW
```
Always check:
- **Shared Contracts**: `shared/src/constants/index.ts`, `shared/src/types/`
- **Web Components & API**: `web/components/`, `web/lib/api/`
- **Mobile Components & Config**: `frontend/config/appConfig.ts`, `frontend/components/`
- **Backend Services**: `backend/src/controllers/`, `backend/src/models/HackathonItem.ts`

## Rule 3 — No Speculation
Do not implement features because they might become useful later. Implement only requirements explicitly justified by `PROBLEM_STATEMENT.md`.

## Rule 4 — No Architecture Rewrites
The existing starter kit (Next.js 16 Web + Expo 57 React Native + Node.js/Express Backend + MongoDB Atlas + OpenRouter AI) is the fixed technical foundation. Do not replace working architecture without a demonstrated requirement.

## Rule 5 — Do Not Break Cross-Platform Parity
- When implementing a Web feature, do NOT delete or corrupt mobile code or Metro bundler paths in `frontend/`.
- When implementing a Mobile feature, do NOT break Next.js App Router conventions or web API clients in `web/`.
- Keep domain types synchronized inside `shared/src/types/domain.ts`.

## Rule 6 — One Logical Change at a Time
Each implementation task in `09_IMPLEMENTATION_PLAN.md` must have:
* Objective
* Target files
* Implementation details
* Explicit verification command/steps

## Rule 7 — No Fake Verification
Never claim tests, builds, or manual flows passed unless actually executed via command line tools (`npm run web:build`, `npm test`, etc.) or physical inspection.

## Rule 8 — Problem-Specific Work Gets Priority
The unique feature ("Winning Feature") that solves the actual hackathon problem has higher priority than generic infrastructure or non-essential polish.

## Rule 9 — Time Awareness
Prefer a smaller working, responsive MVP (P0 features + winning feature) over an ambitious, incomplete multi-page product with broken routes.

## Rule 10 — Stop Expanding
Once P0 requirements and the winning feature are working:
> Polish → test → demo.
Do not continue adding speculative infrastructure or secondary features.

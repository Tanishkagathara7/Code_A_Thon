---
name: hackathon-pivot
description: Controls how Antigravity handles a new hackathon problem statement by enforcing analysis, documentation updates, and strict architectural reuse before any implementation code is written.
---

# Hackathon Pivot Skill

This skill governs how Antigravity approaches a completely new hackathon problem statement or product pivot in this workspace.

## Core Mandate

> **"Do not turn every hackathon problem into a new architecture."**

Before modifying application code, Antigravity must systematically analyze requirements, map them against existing capabilities, update planning documentation, and obtain explicit user approval.

---

## 1. Problem Statement Analysis Workflow

When given a new hackathon problem statement or pivot request, Antigravity MUST execute the following sequence:

### Step 1: Read Primary Problem Source
Read the official problem statement first from:
`hackathon/PROBLEM_STATEMENT.md`

### Step 2: Read Planning Documents & Pivot Checklist
Read all core hackathon planning files in `hackathon/`:
- [hackathon/README.md](file:///d:/Code_A_Thon/hackathon/README.md)
- [01_PROBLEM_ANALYSIS.md](file:///d:/Code_A_Thon/hackathon/01_PROBLEM_ANALYSIS.md)
- [02_PRODUCT_SPEC.md](file:///d:/Code_A_Thon/hackathon/02_PRODUCT_SPEC.md)
- [03_UX_PLAN.md](file:///d:/Code_A_Thon/hackathon/03_UX_PLAN.md)
- [04_TECHNICAL_PLAN.md](file:///d:/Code_A_Thon/hackathon/04_TECHNICAL_PLAN.md)
- [08_MOBBIN_RESEARCH.md](file:///d:/Code_A_Thon/hackathon/08_MOBBIN_RESEARCH.md)
- [09_IMPLEMENTATION_PLAN.md](file:///d:/Code_A_Thon/hackathon/09_IMPLEMENTATION_PLAN.md)
- [10_TEST_PLAN.md](file:///d:/Code_A_Thon/hackathon/10_TEST_PLAN.md)
- [11_DEMO_PLAN.md](file:///d:/Code_A_Thon/hackathon/11_DEMO_PLAN.md)
- [12_PITCH_PLAN.md](file:///d:/Code_A_Thon/hackathon/12_PITCH_PLAN.md)
- `HACKATHON_PIVOT_CHECKLIST.md` (if present)

### Step 3: Inspect Actual Repository
Inspect existing code structures in `frontend/` and `backend/` to verify current state before making any architectural assumptions.

---

## 2. Requirement Mapping Matrix

Every identified requirement must be mapped using the strict hierarchy:

$$\text{REUSE} \longrightarrow \text{CONFIGURE} \longrightarrow \text{EXTEND} \longrightarrow \text{NEW}$$

1. **REUSE**: Use existing backend routes, UI components, data models, auth, or hooks without alteration.
2. **CONFIGURE**: Adjust existing parameters, themes, seeds, or configuration files.
3. **EXTEND**: Add new endpoints, fields, or props to existing files while keeping contracts backward-compatible.
4. **NEW**: Create new files ONLY when existing functionality cannot satisfy the requirement.

---

## 3. Entity & Core Journey Identification

Antigravity must explicitly define:
- **Target User**: Who is using the solution.
- **Actual Problem**: Root pain point being solved.
- **Primary Entity**: Core domain model (e.g., Task, Incident, Request, Project).
- **Core User Journey**: End-to-end user path from entry to completion.
- **Functional Requirements**: Clear scope breakdown.
- **Feature Prioritization (P0 / P1 / P2)**:
  - **P0**: Core journey & winning feature (Must have for MVP).
  - **P1**: UX polish, secondary flows, error handling.
  - **P2**: Nice-to-haves (defer unless core flow is 100% complete).
- **Unique / Winning Feature**: The differentiator that wins the hackathon.
- **Required Screens**: Minimum set of mobile screens needed.
- **Required Backend Changes**: Minimal REST API / service adjustments.
- **Required Database Changes**: Minimal MongoDB schema extensions.
- **AI Utility Check**: Determine whether AI is genuinely useful for the core problem or just novelty.

---

## 4. Strict Execution Constraints

1. **Do Not Invent Requirements**: Build strictly what solves the problem statement.
2. **No Speculative Functionality**: Do not implement features "just in case" a judge asks for them later.
3. **No Immediate Coding**: Do not start writing application code upon receiving a problem statement. Update planning documents first.
4. **Require Explicit Approval**: Wait for user confirmation on planning documents before writing implementation code.
5. **Dependency Order Execution**: When approved, build backend models/API $\rightarrow$ frontend components $\rightarrow$ screens $\rightarrow$ integration.
6. **Prioritize Winning Feature**: Spend time on the problem-specific winning feature over generic infrastructure.
7. **Small Complete MVP > Large Incomplete App**: A polished, working 2-screen core flow beats 10 broken screens.
8. **Active Scope Control**: Continuously cut non-essential features during hackathon time pressure.
9. **No Unjustified Infrastructure**: If introducing a new capability (library, service, table), explain *why* existing capabilities fail first.
10. **Use Specialized MCPs**:
    - **Mobbin MCP**: Query for UX/UI reference patterns before building new screens.
    - **Context7 MCP**: Verify framework/library APIs against installed `package.json` versions before writing code.
11. **Truthful Verification**: Never claim a test or build succeeded unless explicitly executed and confirmed.
12. **Preserve Starter Architecture**: Maintain existing auth, OAuth, navigation, and state structures.

---

## 5. Hackathon Priority Order

$$\text{Problem Correctness} > \text{Core User Journey} > \text{Winning Feature} > \text{Reliability} > \text{UX Polish} > \text{AI/Data Enhancement} > \text{Optional Features} > \text{Generic Infrastructure}$$

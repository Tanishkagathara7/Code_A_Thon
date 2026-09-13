# 08 — Mobbin Design Research

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity using Mobbin MCP research AFTER [`03_UX_PLAN.md`](file:///d:/Code_A_Thon/hackathon/03_UX_PLAN.md) and [`07_AI_PLAN.md`](file:///d:/Code_A_Thon/hackathon/07_AI_PLAN.md) are completed.*

---

## MCP Responsibilities

### Mobbin
Use Mobbin MCP for:
- UX research
- Mobile UI patterns
- Interaction patterns
- Screen references
- Design inspiration

### Context7
Use Context7 MCP for:
- Library documentation
- Framework APIs
- Version-specific implementation guidance
- Third-party package usage

Do not use Context7 as a substitute for Mobbin UX research.
Do not use Mobbin as a substitute for technical documentation.

So your system becomes:

```text
                 PROBLEM
                    ↓
             Product decision
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
       MOBBIN             CONTEXT7
       UX/UI              TECH/API
          ↓                   ↓
          └─────────┬─────────┘
                    ↓
              ANTIGRAVITY
                    ↓
           EXISTING STARTER KIT
```

---

## Purpose of Mobbin Research

Mobbin research must happen **after** the problem and UX requirements are understood.  
It is used to extract UI patterns and layout principles from proven mobile apps—**not to clone any single product**.

> **Research Flow**:  
> Problem & UX Needs → Mobbin Query → Pattern Identification → Design Principle → Original Implementation

---

## Screens To Research

List only the screens where Mobbin research materially improves UX quality:

1. **Screen 1**: [Primary Feed / Entity List]
2. **Screen 2**: [Creation Form & AI Assistant Input]
3. **Screen 3**: [Winning Feature Detail View]

---

## Generated Search Queries

Antigravity generates domain-tailored queries for the Mobbin MCP server:

* `mobile onboarding`
* `mobile dashboard layout`
* `mobile search and filter`
* `mobile creation flow`
* `mobile AI result display`
* `mobile status tracking`
* `[domain-specific query, e.g. mobile health tracker / mobile incident report]`

---

## References Reviewed

*(Populated after invoking Mobbin search tools)*

### Reference 1: [AppName / Screen Name]
* **Reference**: [Mobbin URL / Identifier]
* **Screen**: [Target Screen]
* **Pattern**: [e.g., Floating search bar + category pill filters]
* **Why Useful**: [Provides clean hierarchy for quick scanning]
* **What We Adopt**: [Pill filter scroll container layout]
* **What We Deliberately Do NOT Copy**: [Complex multi-tab drawer navigation]

---

## Design Principles Extracted

1. **Visual Hierarchy**: Highlight primary action button with domain accent color.
2. **Card Layout**: Use clear typography contrast for title, status badge, and timestamp.
3. **Micro-Feedback**: Add smooth color shifts for active tab states.

---

## Final UX Direction

Combine extracted patterns into a clean, cohesive mobile layout using existing starter kit components. Ensure UI remains fast, uncluttered, and demo-ready.

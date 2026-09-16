---
name: hackathon-code-review
description: Governs code review standards for the repository to prevent unnecessary refactoring, architectural drift, security vulnerabilities, or scope creep across Web, Mobile, and Backend during hackathons.
---

# Hackathon Code Review Skill

This skill controls how Antigravity performs code reviews on changes made within this workspace during hackathons across **Web (`web/`)**, **Mobile (`frontend/`)**, and **Shared Backend (`backend/`)**.

## Core Rule

> **"Working code should not be refactored simply because another implementation looks cleaner."**

---

## 1. Review Checklist Categories

When reviewing pull requests, diffs, or proposed code edits, Antigravity MUST evaluate changes against these 8 categories:

### 1. Multi-Platform Architecture & Domain Fidelity
- Does the implementation solve the actual problem statement rather than cosmetically relabeling generic starter kit templates?
- Are `domain.config.ts` and `shared/` domain contracts used as the single source of truth across Web and Mobile?
- Are core workflows implemented with dual-platform parity (Web Command Center + Mobile Field Client)?
- Are shared interfaces and types imported properly without violating bundler boundaries?
- Did Web modifications preserve mobile Metro bundler compatibility in `frontend/`?

### 2. Security & Secret Isolation
- **Authentication**: Are API routes guarded with `authenticateToken`?
- **Secret Isolation**: Are client-side variables strictly restricted to `NEXT_PUBLIC_*` (Web) or `EXPO_PUBLIC_*` (Mobile)? Are `JWT_SECRET` and `MONGODB_URI` never imported into client bundles?
- **Input Validation**: Are user inputs sanitized and checked for valid ranges?
- **Authorization**: Does the API verify resource ownership against `req.user.id`?

### 3. API & Contract Consistency
- Are existing REST endpoint contracts preserved (no breaking changes to payload signatures)?
- Do both `web/lib/api/` and `frontend/services/api/` handle identical error response structures?
- Are HTTP status codes used correctly (200, 201, 400, 401, 403, 404, 500)?

### 4. Database & Models
- Is proper ownership enforced on Mongo document schemas (`userId`)?
- Are schema validations present for required fields?
- Are database queries efficient and properly indexed?

### 5. Web UI & Performance (`web/`)
- **App Router Boundaries**: Are Client Components (`'use client'`) used only when state/effects are needed?
- **Lifecycle States**: Are Loading (skeletons), Empty, Error, and Success states implemented?
- **Responsive Layout**: Does the layout adapt gracefully across desktop (1280px+), tablet (768px), and mobile web (< 768px)?
- **Accessibility**: Are `:focus-visible` rings present? Is heading hierarchy (`h1`, `h2`) preserved?
- **Build Cleanliness**: Does `npm run web:build` succeed without syntax or bundling errors?

### 6. Mobile UI & Performance (`frontend/`)
- **Touch Targets**: Do all buttons and touchables meet the minimum 44–48pt target?
- **Safe Areas**: Are screens wrapped in `SafeAreaView` with keyboard avoidance?
- **List Performance**: Are long lists rendered using virtualized `FlatList` with `keyExtractor`?

### 7. Time & Scope Discipline
- Is the change focused on P0 core journey requirements or the winning feature?
- Is speculative refactoring rejected to protect the hackathon deadline?

### 8. Verification Integrity
- Has the change been verified via actual build execution or manual check?

# 04 — Technical Plan

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity after completing [`03_UX_PLAN.md`](file:///d:/Code_A_Thon/hackathon/03_UX_PLAN.md).*

---

## Existing Architecture

The existing starter kit provides a production-grade, highly adaptable cross-platform stack.

* **Frontend**: React Native with Expo SDK 52, TypeScript, React Navigation v7, React Native Reanimated v3, Vector Icons.
* **Backend**: Node.js, Express, TypeScript (`ts-node-dev`), REST APIs.
* **Database**: MongoDB with Mongoose ODM (Model: `HackathonItem`).
* **Authentication**: JWT-based session tokens with password hashing (`bcryptjs`), Google OAuth verification support, persistent `AuthContext`.
* **API Structure**: Centralized Express router handling Auth (`/api/auth`), Items (`/api/items`), Analytics (`/api/analytics`), AI (`/api/ai`), Uploads (`/api/upload`), Notifications (`/api/notifications`).
* **AI Integration**: OpenRouter API service wrapper integration for LLM summarization and sub-task generation (`backend/src/services/ai.service.ts`).
* **Files / Attachments**: Multer file upload service (`/api/upload`) storing attachments locally in `uploads/`.
* **Notifications**: Server-triggered notification persistence (`Notification` schema) with real-time unread badge counts in header.
* **Analytics**: Aggregated metrics service (`GET /api/analytics/dashboard`) computing category distribution, status breakdowns, and activity counts.
* **Network Resilience**: Axio client interceptors with offline fallback caching and user error toasts.
* **Theme & Copy**: Centralized visual tokens, domain labels, statuses, gradients, and prompts in [`frontend/config/appConfig.ts`](file:///d:/Code_A_Thon/frontend/config/appConfig.ts).
* **Motion**: Smooth UI transitions utilizing React Native Reanimated.
* **Configuration**: Environment variables managed via `.env` (backend) and Expo config (frontend).
* **Testing**: Jest + Supertest test suites for backend APIs and Jest + React Native Testing Library for frontend components.

---

## Requirement → Existing Capability Mapping

| Problem Requirement | Existing Capability | Action (REUSE / CONFIGURE / EXTEND / NEW) |
| ------------------- | ------------------- | ------------------------------------------ |
| User Authentication | JWT Auth / `AuthContext` | **REUSE** |
| Core Entity Lifecycle | `HackathonItem` API (`POST`, `GET`, `PUT`, `DELETE`) | **REUSE** |
| Category & Status Filters | Built-in search, category & status queries | **CONFIGURE** via `appConfig.ts` |
| Domain Terminology & UI Branding | `appConfig.ts` (`appName`, `primaryEntityName`, `accentColor`) | **CONFIGURE** via `appConfig.ts` |
| Analytics Summary | `GET /api/analytics/dashboard` | **REUSE** |
| AI Summarization / Sub-tasks | OpenRouter service (`/api/ai/summarize`, `/api/ai/generate-subtasks`) | **CONFIGURE** prompts / **EXTEND** service |
| Photo/File Attachments | Local Upload service (`/api/upload`) | **REUSE** |
| User Notifications | Notification center & badges (`/api/notifications`) | **REUSE** |
| Domain Seed Data | Seed system (`npm run seed:reset`) | **CONFIGURE** via `datasets/generic.ts` |
| Differentiating Business Logic | Custom controller / service | **NEW** (Scoped to winning feature) |

---

## Architecture Changes

> **CRITICAL RULE**: Do NOT make architecture changes unless explicitly mandated by the problem statement.

* **Database Changes**: NONE (Reuse `HackathonItem`).
* **Framework Changes**: NONE.
* **State Management Changes**: NONE (Use existing React Context).

---

## New Dependencies

* **Packages Needed**: NONE.
* *Note: If a specific package is required (e.g., SVG parser or QR scanner), document exact justification before adding.*

---

## Infrastructure Changes

* **Infrastructure Changes**: NONE.
* Do not introduce Redis, WebSockets, or new cloud services.

---

## Technical Risks

* **Risk 1**: OpenRouter API rate limits or latency during demo.  
  *Mitigation*: Implement offline mock fallback response in AI service.
* **Risk 2**: Demo database state missing expected records.  
  *Mitigation*: Pre-wire deterministic seed command (`npm run seed:reset`).

---

## Performance Considerations

* Keep API queries indexed by `userId`, `category`, and `status`.
* Leverage existing React Native list optimizations (`FlatList` key extractors).

---

## Security Considerations

* Preserve JWT token verification on all protected routes.
* Ensure data ownership checks (`item.userId == req.user.id`) remain enforced.

---

## Scalability Considerations

* Starter kit handles local concurrency cleanly for hackathon demo evaluation. Do not over-engineer infrastructure.

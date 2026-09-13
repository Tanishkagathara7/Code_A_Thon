# 05 — Data Model Plan

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity after completing [`04_TECHNICAL_PLAN.md`](file:///d:/Code_A_Thon/hackathon/04_TECHNICAL_PLAN.md).*

---

## Adaptation Strategy: `HackathonItem` Mapping

The existing core Mongoose model is `HackathonItem` ([`backend/src/models/HackathonItem.ts`](file:///d:/Code_A_Thon/backend/src/models/HackathonItem.ts)).

Every domain problem maps its primary entity directly to `HackathonItem`.

### Field Classification Matrix

| Existing `HackathonItem` Field | Type | Domain Adaptation | Action (REUSE / RENAME/REPURPOSE / EXTEND / NEW) |
| ----------------------------- | ---- | ----------------- | ------------------------------------------------ |
| `title` | String | Core item title / name | **REUSE** |
| `description` | String | Full item description / details | **REUSE** |
| `category` | String | Domain category (defined in `appConfig.ts`) | **REUSE** |
| `status` | String | Domain status (defined in `appConfig.ts`) | **REUSE** |
| `priority` | String | Urgency / Importance level | **REUSE** |
| `tags` | String[] | Searchable tags | **REUSE** |
| `attachments` | String[] | File / Image upload URLs | **REUSE** |
| `subtasks` | SubtaskSchema[] | AI-generated or manual sub-steps | **REUSE** |
| `aiSummary` | String | AI-generated summary or insights | **REUSE** |
| `userId` | ObjectId | Owner reference | **REUSE** |
| `createdAt` / `updatedAt` | Date | Timestamps | **REUSE** |

---

## Primary Entity

* **Entity Name**: [Domain Primary Entity, e.g. PatientRecord, DisasterResource, CivicIssue]
* **Mapped Schema**: `HackathonItemSchema`

---

## Existing Fields Reused

All existing fields in `HackathonItem` are retained to support CRUD, search, filtering, and analytics out of the box.

---

## New Fields

> **CRITICAL RULE**: Do NOT add speculative fields. Add only fields strictly required by the problem prompt.

* **Field 1**: [Optional new field name if strictly required] — *Type*: [String/Number] — *Purpose*: [Reason]

---

## New Models

* **New Models**: NONE.
* *Note: Only create a second model if the problem strictly requires relational structures that cannot fit in subdocuments or tags.*

---

## Relationships

* `User` (1) ── (N) `HackathonItem` (`userId` reference)
* `HackathonItem` (1) ── (N) `Subtasks` (Embedded Array)

---

## Indexes

* Existing Index: `{ userId: 1, createdAt: -1 }`
* Existing Index: `{ category: 1, status: 1 }`
* Existing Index: Text search index on `title`, `description`, `tags`

---

## Validation

* `title`: Required, min length 2, max 120.
* `category`: Required, validated against `appConfig.categories`.
* `status`: Required, validated against `appConfig.statuses`.

---

## Data Ownership

* Every item is linked to the authenticated user ID (`userId`).
* Unauthenticated requests to modify or delete items are rejected (`401/403`).

---

## Demo / Seed Data Plan

1. Edit [`backend/src/seeds/datasets/generic.ts`](file:///d:/Code_A_Thon/backend/src/seeds/datasets/generic.ts).
2. Populate 5–8 realistic demo records matching domain categories and statuses.
3. Ensure seed dataset includes realistic titles, rich descriptions, and populated AI summary fields.
4. Execute `npm run seed:reset` to verify clean seed loading.

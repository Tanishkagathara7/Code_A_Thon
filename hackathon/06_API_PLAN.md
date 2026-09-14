# 06 — API Plan

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity after completing [`05_DATA_MODEL.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/05_DATA_MODEL.md).*

---

## Shared Backend API Inventory & Client Mapping

Both the Web Client (`web/lib/api/`) and Mobile Client (`frontend/services/api/`) consume these standardized endpoints:

### 1. Authentication Routes (`/api/auth`)
* `POST /api/auth/email` — Dual-mode Login / Sign up returning JWT token and user profile.
  - **Web**: Invoked by `web/lib/api/auth.ts` -> stores session in `localStorage`.
  - **Mobile**: Invoked by `frontend/services/api/auth.ts` -> stores token in `expo-secure-store`.
* `POST /api/auth/sync` — Social OAuth profile synchronization (Google / Native).
* `POST /api/auth/github` — GitHub OAuth authorization code exchange.
* `POST /api/auth/forgot-password` — Initiates 6-digit OTP reset email.
* `POST /api/auth/reset-password` — Validates OTP and updates account password.
* `GET /api/auth/me` — Retrieves currently authenticated profile (Bearer JWT).

### 2. Core Entity Routes (`/api/items`)
* `GET /api/items` — Query items with search query, category, status, pagination (`page`, `limit`), and sort parameters.
  - **Web**: Populates the workspace Data Table with sorting and pagination controls.
  - **Mobile**: Populates the vertical feed with pull-to-refresh.
* `POST /api/items` — Creates a new domain entity.
* `GET /api/items/:id` — Fetches complete entity details.
* `PUT /api/items/:id` — Updates entity properties and status lifecycle.
* `DELETE /api/items/:id` — Removes entity from database.

### 3. Analytics Routes (`/api/analytics`)
* `GET /api/analytics/overview` — Returns aggregate KPI counts, completion rates, category distributions, and activity metrics.
  - **Web**: Feeds the Dashboard visual overview, completion donuts, and category distribution cards.
  - **Mobile**: Feeds the header KPI summary cards.

### 4. AI Gateway Routes (`/api/ai`)
* `POST /api/ai/generate` — Sends structured prompts to the OpenRouter LLM gateway.
  - **Web**: Powers the dedicated `/ai-assistant` prompt copilot.
  - **Mobile**: Powers the item creation AI assistant and summary widgets.

### 5. File & Notification Routes
* `POST /api/files` — Multer disk storage upload for multipart attachments (max 20MB).
* `GET /api/files/:id` — Inspects file metadata.
* `GET /api/files/download/*` — Downloads or streams stored assets.
* `GET /api/notifications` — Returns paginated user notifications.
* `GET /api/notifications/unread-count` — Returns unread badge count for Topbar and Mobile Dock.
* `PATCH /api/notifications/:id/read` — Marks single notification as read.
* `PATCH /api/notifications/read-all` — Marks all user notifications as read.

---

## Endpoint Classification Matrix

| Feature Requirement | Backend Route | Classification (REUSE / EXTEND / NEW) | Web Consumer | Mobile Consumer |
| :--- | :--- | :--- | :--- | :--- |
| User Session | `/api/auth/email` | **REUSE** | `web/lib/api/auth.ts` | `frontend/services/api/auth.ts` |
| Primary Entity List | `/api/items` | **REUSE** | `web/lib/api/domain.ts` | `frontend/services/api/hackathonItemApi.ts` |
| Entity Lifecycle | `/api/items/:id` | **REUSE** | `web/lib/api/domain.ts` | `frontend/services/api/hackathonItemApi.ts` |
| Operational Metrics | `/api/analytics/overview` | **REUSE** | `web/lib/api/domain.ts` | `frontend/services/api/analyticsApi.ts` |
| AI Synthesizer | `/api/ai/generate` | **REUSE** | `web/lib/api/domain.ts` | `frontend/services/api/aiApi.ts` |
| Winning Feature Endpoint | `/api/...` | **NEW** (Only if strictly required) | Custom caller | Custom caller |

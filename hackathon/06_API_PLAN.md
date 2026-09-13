# 06 — API Plan

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity after completing [`05_DATA_MODEL.md`](file:///d:/Code_A_Thon/hackathon/05_DATA_MODEL.md).*

---

## Existing Endpoint Inventory

### Auth Routes (`/api/auth`)
* `POST /api/auth/register` — **REUSE** (User registration)
* `POST /api/auth/login` — **REUSE** (JWT Login)
* `POST /api/auth/google` — **REUSE** (Google OAuth exchange)
* `GET /api/auth/me` — **REUSE** (Fetch authenticated profile)

### Item Routes (`/api/items`)
* `GET /api/items` — **REUSE** (Paginated list with search & filters)
* `GET /api/items/:id` — **REUSE** (Fetch item detail by ID)
* `POST /api/items` — **REUSE** (Create new item)
* `PUT /api/items/:id` — **REUSE** (Update item)
* `DELETE /api/items/:id` — **REUSE** (Delete item)

### Analytics Routes (`/api/analytics`)
* `GET /api/analytics/dashboard` — **REUSE** (Summary statistics & breakdowns)

### AI Routes (`/api/ai`)
* `POST /api/ai/summarize` — **REUSE** (OpenRouter AI item summary)
* `POST /api/ai/generate-subtasks` — **REUSE** (OpenRouter AI subtask generation)

### Upload & Notification Routes
* `POST /api/upload` — **REUSE** (File/image attachment upload)
* `GET /api/notifications` — **REUSE** (Fetch user notifications)
* `PUT /api/notifications/:id/read` — **REUSE** (Mark notification as read)

---

## Requirement Endpoint Classification

| Feature Requirement | Existing Endpoint | Classification (REUSE / EXTEND / NEW) |
| ------------------- | ----------------- | ------------------------------------- |
| List & Filter Items | `GET /api/items` | **REUSE** |
| Create Item | `POST /api/items` | **REUSE** |
| Dashboard Analytics | `GET /api/analytics/dashboard` | **REUSE** |
| AI Processing | `POST /api/ai/summarize` | **REUSE / EXTEND** |
| Winning Feature Endpoint | N/A | **NEW** (If specific custom endpoint is required) |

---

## New Endpoints Specification

> **CRITICAL RULE**: Create new endpoints ONLY if existing APIs cannot support the requirement.

### Endpoint: [New Endpoint Name - e.g. POST /api/items/:id/process-action]
* **METHOD**: `POST`
* **PATH**: `/api/items/:id/process-action`
* **AUTH**: Required (JWT Bearer Token)
* **REQUEST**:
  ```json
  {
    "actionType": "string",
    "parameters": {}
  }
  ```
* **RESPONSE**:
  ```json
  {
    "success": true,
    "data": {},
    "message": "Action executed successfully"
  }
  ```
* **VALIDATION**: `actionType` must be non-empty string.
* **ERRORS**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`.
* **OWNER**: Backend controller.

---

## API Contract Rules

1. **Do Not Break Existing Contracts**: Keep parameter names and JSON response envelopes (`{ success, data, message }`) consistent across all endpoints.
2. **Preserve Authentication**: All data mutation endpoints must validate JWT via `authMiddleware`.
3. **Preserve Error Conventions**: Return uniform HTTP status codes (`400`, `401`, `403`, `404`, `500`).
4. **Preserve Ownership Rules**: Ensure users can only modify or delete records owned by their account (`userId`).

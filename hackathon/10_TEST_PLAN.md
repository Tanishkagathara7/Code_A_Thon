# 10 — Test Plan

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity after completing [`09_IMPLEMENTATION_PLAN.md`](file:///d:/Code_A_Thon/hackathon/09_IMPLEMENTATION_PLAN.md).*

---

## Critical User Journey

```text
Log in as Demo User 
  → View Dashboard with Seed Data 
  → Filter by Category & Search Keyword 
  → Create New Domain Entity with AI Assist 
  → Execute Winning Feature Action 
  → Verify Notification Badge & Analytics Dashboard Update
```

---

## Functional Tests

* [ ] **Entity Creation**: Verify new item creates successfully and appears at top of feed.
* [ ] **Filtering**: Verify selecting category pills filters items correctly.
* [ ] **Search**: Verify typing keyword filters list by text query.
* [ ] **Status Update**: Verify updating item status reflects new status badge color.
* [ ] **Deletion**: Verify deleting item removes it from list and updates count.

---

## API Tests

* **Backend Test Suite Command**:
  ```bash
  cd backend && npm test -- --runInBand
  ```
* [ ] Auth Endpoints (`POST /api/auth/login`, `GET /api/auth/me`)
* [ ] Items Endpoints (`GET /api/items`, `POST /api/items`, `PUT /api/items/:id`)
* [ ] Analytics Endpoint (`GET /api/analytics/dashboard`)

---

## Authentication Tests

* [ ] **Login Flow**: Log in with demo credentials (`demo@app.com` / `Demo123!`).
* [ ] **Protected Routes**: Verify unauthenticated API requests return `401 Unauthorized`.
* [ ] **Session Persistence**: Verify app reloads maintain user session.

---

## AI Tests

*(Only if AI is enabled)*

* [ ] **Summarize**: Trigger `POST /api/ai/summarize` and verify formatted summary returns.
* [ ] **Subtasks**: Trigger `POST /api/ai/generate-subtasks` and verify subtask array returns.
* [ ] **Fallback**: Disconnect internet / set mock flag and verify app displays graceful fallback.

---

## File Tests

*(Only if files are enabled)*

* [ ] **Upload**: Upload image attachment via `POST /api/upload` and verify media preview renders.

---

## Notification Tests

*(Only if notifications are enabled)*

* [ ] **Badge Count**: Verify creating an item increments unread notification count.
* [ ] **Read State**: Tap notification to mark as read and verify badge count decrements.

---

## Network Tests

* [ ] **Offline Banner**: Toggle offline mode in emulator and verify offline indicator banner appears.
* [ ] **Error Toast**: Verify API failures trigger visible user toast alert.

---

## Regression Tests

* [ ] **Frontend TypeScript**: `cd frontend && npx tsc --noEmit`
* [ ] **Frontend Tests**: `cd frontend && npm test -- --runInBand`
* [ ] **Backend Build**: `cd backend && npm run build`
* [ ] **Seed Reset**: `cd backend && npm run seed:reset`

---

## Manual Demo Test Checklist

Execute this sequence immediately before the live pitch:

1. [ ] Run `npm run seed:reset` in backend.
2. [ ] Launch mobile app / emulator.
3. [ ] Perform 2-minute trial demo without pause.
4. [ ] Confirm zero unhandled red screens or console crashes.

# Hackathon Pivot Checklist

A rapid, hackathon-day execution guide for pivoting this codebase to any new domain in under 3 hours.

---

## 1. Understand the Problem

Run through this quick checklist before touching code:

- [ ] **Target User**: Who is using the app? (e.g., students, disaster victims, citizens, healthcare workers)
- [ ] **Actual Problem**: What specific pain point is being solved?
- [ ] **Primary Entity**: What is the core data unit? (e.g., Incident, Resource, Task, Course, Alert)
- [ ] **Core User Actions**: What can users do with the entity? (Create, Filter, Mark Complete, Generate AI Insights)
- [ ] **Unique/Differentiating Feature**: What single feature will wows the judges?
- [ ] **Demo Path**: What exact sequence of screens/clicks MUST work flawlessly during the 2-minute demo?

---

## 2. Configure the Existing Foundation

Centralize all domain copy, categories, statuses, AI system prompts, notification templates, and visual branding in [`frontend/config/appConfig.ts`](file:///d:/Code_A_Thon/frontend/config/appConfig.ts).

### Frontend Configuration (`frontend/config/appConfig.ts`)

```typescript
export const appConfig: AppConfig = {
  appName: 'YourAppName',                     // e.g. EcoTrack, FoodRelief, CareConnect
  tagline: 'Your catchphrase here',          // e.g. Community Surplus & Food Security
  primaryEntityName: 'Donation',              // Singular entity name used across UI
  entityPluralName: 'Donations',              // Plural entity name used across UI
  categories: ['Food', 'Shelter', 'Medical', 'Volunteers', 'General'],
  statuses: [
    { key: 'pending', label: 'Pending', bg: '#FEF3C7', text: '#B45309' },
    { key: 'in_progress', label: 'In Progress', bg: '#E0E7FF', text: '#4338CA' },
    { key: 'completed', label: 'Delivered', bg: '#DCFCE7', text: '#15803D' },
  ],
  aiSystemPrompt: 'Act as an expert assistant for disaster relief logistics...',
  notificationCopy: {
    itemCreatedTitle: 'Donation Registered',
    itemCreatedMessage: 'Your donation entry has been posted.',
    itemCompletedTitle: 'Delivery Complete',
    itemCompletedMessage: 'The donation item was successfully delivered.',
  },
  accentColor: '#10B981',                      // Primary brand color (Hex)
  themeGradient: ['#064E3B', '#047857'],      // Header / hero gradient colors
};
```

### Backend Environment Notification Overrides (`backend/.env`)

If custom notification titles/messages are required on the server side without rebuilding code, set environment variables in [`backend/.env`](file:///d:/Code_A_Thon/backend/.env):

```env
NOTIF_ITEM_CREATED_TITLE="Donation Registered"
NOTIF_ITEM_CREATED_MSG="Your donation entry has been posted."
NOTIF_ITEM_COMPLETED_TITLE="Delivery Complete"
NOTIF_ITEM_COMPLETED_MSG="The donation item was successfully delivered."
```

---

## 3. Adapt Demo Data

Replace or customize demo data using the dataset seed structure in [`backend/src/seeds/`](file:///d:/Code_A_Thon/backend/src/seeds).

### Seed Workflow

1. Edit [`backend/src/seeds/datasets/generic.ts`](file:///d:/Code_A_Thon/backend/src/seeds/datasets/generic.ts) or create a new dataset file conforming to `SeedDataset` (`backend/src/seeds/datasets/types.ts`).
2. Populate realistic seed items with matching `category`, `status`, `title`, and `description`.
3. Seed the database cleanly:

```bash
# Clean existing demo records and re-seed deterministically
npm run seed:reset

# Or seed without resetting existing user items
npm run seed
```

*Note: Seeding preserves demo user credentials (`demo@mindbloom.com` / `Demo123!`) and maintains full idempotency.*

---

## 4. Reuse Existing Modules

Rule of thumb: **Reuse existing modules unless the problem statement strictly requires an extension.**

- [x] **Authentication**: Pre-built JWT auth, register/login, Google OAuth support, and persistent session management.
- [x] **CRUD**: Full lifecycle management via `HackathonItem` API (`POST /api/items`, `GET /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`).
- [x] **Search & Filter**: Built-in full-text search, category filtering, status filtering, and sorting (`createdAt`, `title`).
- [x] **Pagination**: Built-in server-side and UI pagination metadata (`page`, `limit`, `totalPages`).
- [x] **Analytics**: Pre-configured distribution charts, status breakdown, and summary counts (`GET /api/analytics/dashboard`).
- [x] **AI Integration**: Plug-and-play LLM endpoints for summarizing items (`POST /api/ai/summarize`) and auto-generating sub-tasks (`POST /api/ai/generate-subtasks`).
- [x] **File Uploads**: Local image/document attachment handling (`POST /api/upload`).
- [x] **Notifications**: In-app notification center, real-time unread badges, and auto-triggered status alerts.
- [x] **Network Resilience**: Built-in offline fallback caching and user toast alerts.

---

## 5. Build the Problem-Specific Feature

Allocate the bulk of hackathon coding time strictly to what makes the hackathon submission stand out:

1. **Problem-Specific Functionality**: Implement the exact business logic unique to the problem prompt.
2. **Differentiating UX**: Focus on smooth transitions, clear call-to-action buttons, and clear data visualization.
3. **Meaningful AI / Data Usage**: Use the pre-wired AI summary or task breakdown endpoints with domain-tailored prompts.
4. **Demo Reliability**: Test the exact sequence end-to-end to guarantee zero unexpected UI crashes during presentation.

---

## 6. When to Extend the Architecture

Only add new models, database fields, indexes, or third-party packages if the problem statement explicitly requires them.

*Examples of safe minimal extensions (if strictly required):*
- Adding an optional field (e.g., `urgencyLevel` or `locationName`) to `HackathonItemSchema` in [`backend/src/models/HackathonItem.ts`](file:///d:/Code_A_Thon/backend/src/models/HackathonItem.ts).
- Adding a custom calculated metric to [`backend/src/services/analytics.service.ts`](file:///d:/Code_A_Thon/backend/src/services/analytics.service.ts).

*Do NOT add:*
- New database engines (Redis, PostgreSQL, etc.)
- WebSockets or real-time pub/sub infrastructure
- Extra state management libraries (Redux, Zustand)
- Geolocation map rendering engines unless maps are the central project focus

---

## 7. Final Verification

Run the full verification suite before starting the live demo:

- [ ] **Frontend TypeScript**: `npx tsc --noEmit` (in `frontend/`)
- [ ] **Frontend Tests**: `npm test -- --runInBand` (in `frontend/`)
- [ ] **Backend Build**: `npm run build` (in `backend/`)
- [ ] **Backend Tests**: `npm test -- --runInBand` (in `backend/`)
- [ ] **Seed Verification**: `npm run seed:reset` (in `backend/`)
- [ ] **Login Flow**: Log in with demo credentials (`demo@mindbloom.com`)
- [ ] **Main User Flow**: Create, filter, update, and delete an item
- [ ] **AI Flow**: Trigger AI summary / action items on a sample record
- [ ] **File Upload**: Attach and view an image asset (if used)
- [ ] **Notification Flow**: Verify badge increments and notification list updates
- [ ] **Android Build**: Test layout on mobile viewport / emulator (if presenting mobile)
- [ ] **Demo Walkthrough**: Perform a full 2-minute trial demo run-through

---

## 8. Hackathon Time Allocation

Suggested 3-hour execution timeline:

```text
Problem understanding       ~15 min
Foundation configuration    ~15 min
Unique feature              ~60–90 min
AI/data/polish              ~30 min
Testing                     ~20 min
Demo preparation             ~10 min
```

*(Note: These timing allocations are flexible guidelines to keep the team focused on shipping high-impact demo features quickly.)*

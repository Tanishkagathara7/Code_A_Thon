# Hackathon Pivot Checklist

A rapid, hackathon-day execution guide for pivoting this codebase to any new domain in under 3 hours across **Web, Mobile, or Both Platforms**.

---

## 1. Understand the Problem

Run through this quick checklist before touching code:

- [ ] **Target User**: Who is using the app? (e.g., students, disaster victims, citizens, healthcare workers)
- [ ] **Target Platform**: Is this submission **Web-First**, **Mobile-First**, or **Synchronized Dual-Platform**?
- [ ] **Actual Problem**: What specific pain point is being solved?
- [ ] **Primary Entity**: What is the core data unit? (e.g., Incident, Resource, Task, Course, Alert)
- [ ] **Core User Actions**: What can users do with the entity? (Create, Filter, Mark Complete, Generate AI Insights)
- [ ] **Unique / Winning Feature**: What single feature will wow the judges?
- [ ] **Demo Path**: What exact sequence of clicks/taps MUST work flawlessly during the 2-minute demo?

---

## 2. Configure the Existing Foundation

The repository enables rapid rebranding and domain customization across all clients:

### 2.1 Shared Branding & Category Defaults (`shared/src/constants/index.ts`)
Centralize cross-platform constants for both Web and Mobile:
```typescript
export const DEFAULT_CATEGORIES = [
  'Food', 'Shelter', 'Medical', 'Volunteers', 'General'
] as const;

export const PRODUCT_BRAND = {
  name: 'FoodRelief',
  tagline: 'Community Surplus & Food Security Hub',
  entityName: 'Donation',
  entityPlural: 'Donations',
} as const;
```

### 2.2 Mobile Configuration (`frontend/config/appConfig.ts`)
```typescript
export const appConfig: AppConfig = {
  appName: 'FoodRelief',
  tagline: 'Community Surplus & Food Security Hub',
  primaryEntityName: 'Donation',
  entityPluralName: 'Donations',
  categories: ['Food', 'Shelter', 'Medical', 'Volunteers', 'General'],
  statuses: [
    { key: 'pending', label: 'Pending', bg: '#FEF3C7', text: '#B45309' },
    { key: 'in_progress', label: 'In Transit', bg: '#E0E7FF', text: '#4338CA' },
    { key: 'completed', label: 'Delivered', bg: '#DCFCE7', text: '#15803D' },
  ],
  aiSystemPrompt: 'Act as an expert assistant for disaster relief logistics...',
  accentColor: '#10B981',
  themeGradient: ['#064E3B', '#047857'],
};
```

### 2.3 Backend Environment Notification Overrides (`backend/.env`)
If custom notification titles/messages are required on the server side without rebuilding code, set environment variables in `backend/.env`:
```env
NOTIF_ITEM_CREATED_TITLE="Donation Registered"
NOTIF_ITEM_CREATED_MSG="Your donation entry has been posted."
NOTIF_ITEM_COMPLETED_TITLE="Delivery Complete"
NOTIF_ITEM_COMPLETED_MSG="The donation item was successfully delivered."
```

---

## 3. Adapt Demo Data

Replace or customize demo data using the dataset seed structure in `backend/src/seeds/`.

### Seed Workflow
1. Edit `backend/src/seeds/datasets/generic.ts` or create a new dataset file conforming to `SeedDataset` (`backend/src/seeds/datasets/types.ts`).
2. Populate realistic seed items with matching `category`, `status`, `title`, and `description`.
3. Seed the database cleanly:
```bash
# Clean existing demo records and re-seed deterministically
npm run seed:reset

# Or seed without resetting existing user items
npm run seed
```
*Note: Seeding preserves demo user credentials (`demo@app.com` / `Demo123!`) and maintains full idempotency.*

---

## 4. Reuse Existing Modules (Dual-Platform Capability)

Rule of thumb: **Reuse existing modules unless the problem statement strictly requires an extension.**

| Capability | Web Application (`web/`) | Mobile Application (`frontend/`) | Backend API |
| :--- | :--- | :--- | :--- |
| **Authentication** | `(auth)/login`, `(auth)/signup`, `AuthContext` | `(auth)/`, `AuthContext`, `expo-secure-store` | `POST /api/auth/email`, `POST /api/auth/sync` |
| **Entity CRUD** | `(app)/items` Data Table, `new/`, `[id]/` detail | `items/` native list, create modal, `[id]` view | `GET /api/items`, `POST /api/items`, `PUT`, `DELETE` |
| **Search & Filter** | Real-time search bar & category pill selector | Search bar & category horizontal scroll pills | Built-in query filters (`search`, `category`, `status`) |
| **Analytics** | Dashboard KPI cards, completion donut, bar chart | Dashboard metric cards & activity feed | `GET /api/analytics/overview` |
| **AI Integration** | `(app)/ai-assistant` prompt copilot & generator | Item creation AI suggestion & summary box | `POST /api/ai/generate` (OpenRouter Gateway) |
| **File Management** | `(app)/files` drag-and-drop file uploader & preview | Native camera/gallery picker (`FilePicker.tsx`) | `POST /api/files`, `GET /api/files/:id` |
| **Notifications** | `(app)/notifications` inbox & unread badge count | Native notification feed & badge count | `GET /api/notifications`, `PATCH /api/notifications/*` |

---

## 5. Build the Problem-Specific Feature

Allocate the bulk of hackathon coding time strictly to what makes the hackathon submission stand out:

1. **Problem-Specific Functionality**: Implement the exact business logic unique to the problem prompt.
2. **Platform-Tailored UX**: 
   - On **Web**: Multi-column layouts, rich data visualization, keyboard efficiency, bento grid showcases.
   - On **Mobile**: Fluid gesture transitions, bottom dock actions, safe area padding, touch target comfort.
3. **Meaningful AI / Data Usage**: Use the pre-wired AI summary or prompt endpoints with domain-tailored prompts.
4. **Demo Reliability**: Test the exact demo sequence end-to-end to guarantee zero unexpected UI crashes during presentation.

---

## 6. When to Extend the Architecture

Only add new models, database fields, indexes, or third-party packages if the problem statement explicitly requires them.

*Examples of safe minimal extensions (if strictly required):*
- Adding an optional field (e.g., `urgencyLevel` or `locationName`) to `HackathonItemSchema` in `backend/src/models/HackathonItem.ts` and `shared/src/types/domain.ts`.
- Adding a custom calculated metric to `backend/src/services/analytics.service.ts`.

*Do NOT add:*
- New database engines (Redis, PostgreSQL, etc.)
- WebSockets or real-time pub/sub infrastructure unless strictly essential
- Complex state management libraries (Redux, Zustand)
- Unverified third-party libraries that bloat bundles

---

## 7. Dual-Platform Verification Checklist

Run verification before starting the live demo:

- [ ] **Web Build Check**: `npm run web:build` (in `web/` or root)
- [ ] **Mobile Type Check**: `npx tsc --noEmit` (in `frontend/`)
- [ ] **Backend Build**: `npm run build` (in `backend/`)
- [ ] **Database Seed**: `npm run seed:reset` (in `backend/`)
- [ ] **Web Auth Flow**: Login with `demo@app.com` / `Demo123!` on `http://localhost:3000`
- [ ] **Web CRUD Flow**: Create item, test category filter, search, view detail, edit, delete
- [ ] **Web AI Assistant**: Test `(app)/ai-assistant` and verify prompt generation works
- [ ] **Mobile Demo Flow**: Verify mobile dashboard and item feed on Expo / Android emulator
- [ ] **Cross-Platform Sync**: Create an item on Web, verify it instantly appears on Mobile after refresh
- [ ] **Demo Walkthrough**: Perform a full 2-minute trial demo run-through

---

## 8. Hackathon Time Allocation (3-Hour Model)

```text
[0:00 - 0:15] Problem understanding & Target Platform Decision (Web/Mobile/Both)
[0:15 - 0:30] Foundation configuration (`shared/`, `appConfig.ts`, seed data)
[0:30 - 1:45] Winning Feature implementation on chosen client(s)
[1:45 - 2:15] AI prompt tuning, data cards, and polish (states, loaders, responsive)
[2:15 - 2:40] Testing & build verification (`web:build`, seed checks)
[2:40 - 3:00] 2-minute live demo rehearsal & backup plan verification
```

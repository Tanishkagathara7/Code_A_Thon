# Project Architecture: Multi-Platform Evolution (Mobile, Web, Backend)

## 1. Executive Summary & Product Identity
- **Product Name**: Pulse (Configurable Hackathon Pivot Engine / Operations & Intelligence Hub)
- **Tagline**: Real-Time Operational Intelligence & AI-Assisted Workflow Platform
- **Core Architecture**:
  - **Shared Backend API**: Node.js + Express + TypeScript + Mongoose (MongoDB Atlas), Helmet, Express Rate Limiting, JWT auth, Multer file processing, OpenRouter AI Gateway integration.
  - **Mobile Client**: React Native + Expo (v57) + Expo Router + Reanimated 4.5.1 + Native Biometrics & Storage (`expo-secure-store`). Located in `frontend/` (preserved safely to protect native build & Expo Metro paths).
  - **Web Client**: Next.js 14/15 App Router + TypeScript + Tailwind CSS + Lucide Icons + Framer Motion. Located in `web/`.
  - **Shared Contract Layer**: `shared/` directory providing common TypeScript interfaces, domain types, API response contracts, validation schemas, and constants without pulling in platform-specific UI.

---

## 2. Current Repository Analysis

### 2.1 File Structure & Locations
```
Code_A_Thon/
├── backend/                  # Node.js + Express TypeScript API
│   ├── src/
│   │   ├── config/          # database.ts
│   │   ├── controllers/     # auth, hackathonItem, ai, file, analytics, notification
│   │   ├── middleware/      # auth (JWT, rate limiters), errorHandler
│   │   ├── models/          # User, HackathonItem, Notification, UploadedFile
│   │   ├── routes/          # auth, hackathonItem, ai, file, analytics, notification
│   │   ├── services/        # auth, email, openrouter, storage
│   │   └── utils/           # validation, fileValidation
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # React Native + Expo 57 Application (Mobile Client)
│   ├── app/                 # Expo Router file system routing:
│   │   ├── (auth)/          # Authentication screen & OAuth handler
│   │   ├── home.tsx         # Dashboard with metrics, quick actions, AI summary, files
│   │   ├── items/           # CRUD: index (list/filter/sort), create, [id] detail, edit/[id]
│   │   ├── notifications/   # Real-time / paginated notification feed
│   │   └── onboarding.tsx   # Gesture-driven animated onboarding sequence
│   ├── components/          # ai, analytics, auth, domain, file, navigation, notifications
│   ├── context/             # AuthContext, NetworkContext, ToastContext
│   ├── services/api/        # apiClient, auth, hackathonItemApi, aiApi, fileApi, analyticsApi, notificationApi
│   ├── theme/               # config, colors, typography, motion
│   ├── types/               # domain, ai, analytics, file, notification
│   ├── app.json             # Expo project configuration (bundle IDs, schemes, plugins)
│   └── package.json
├── package.json             # Root monorepo runner (`concurrently`)
└── .agents/                 # Antigravity skills & hackathon rules
```

### 2.2 Preserving Mobile Safety (`frontend/` vs `mobile/`)
- **Critical Finding**: Expo Router, Metro config, `app.json` (bundle identifier `com.tvkms.app`, slug `tanis`, eas projectId `bc0e2321-ddf3-4df9-b813-e6e8c3549eeb`), native plugins, and root `package.json` scripts (`frontend`, `frontend:web`, `install:all`) specifically reference `frontend/`.
- **Decision**: In strict accordance with user prompt ("*If moving it creates unnecessary risk, keep the existing directory and treat that directory as the mobile application. FUNCTIONALITY AND STABILITY ARE MORE IMPORTANT THAN THE FOLDER NAME.*"), we **keep `frontend/` as the mobile application**. We add symlink/scripts in root `package.json` to allow both `npm run mobile` and `npm run frontend`.

---

## 3. Backend & API Inventory (Source of Truth)

The shared Express backend exposes all core services at `/api/*`:

| Endpoint Group | Route | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `/api/health` | GET | Server & MongoDB readiness state | No |
| **Auth** | `/api/auth/email` | POST | Login (`mode: 'login'`) & Sign up (`mode: 'signup'`) | No (Rate limited) |
| **Auth** | `/api/auth/sync` | POST | OAuth profile synchronization (Google / Native) | No |
| **Auth** | `/api/auth/github` | POST | Exchange GitHub code for JWT session | No |
| **Auth** | `/api/auth/forgot-password` | POST | Trigger 6-digit OTP email reset | No (Rate limited) |
| **Auth** | `/api/auth/reset-password` | POST | Verify OTP & set new password | No (Rate limited) |
| **Auth** | `/api/auth/me` | GET | Retrieve authenticated profile | Yes (Bearer JWT) |
| **Items (CRUD)** | `/api/items` | GET | Filter, search, paginate, sort items | Yes |
| **Items (CRUD)** | `/api/items` | POST | Create domain entity | Yes |
| **Items (CRUD)** | `/api/items/:id` | GET | Fetch single item details | Yes |
| **Items (CRUD)** | `/api/items/:id` | PUT | Update domain entity | Yes |
| **Items (CRUD)** | `/api/items/:id` | DELETE | Remove item | Yes |
| **Analytics** | `/api/analytics/overview` | GET | Aggregated counts, completion rates, category metrics, activity timeline | Yes |
| **AI Gateway** | `/api/ai/generate` | POST | OpenRouter AI summarization & action plan generation | Yes (AI rate limited) |
| **File Storage** | `/api/files` | POST | Upload file (multipart/form-data, max 20MB) | Yes |
| **File Storage** | `/api/files/:id` | GET | File metadata inspection | Yes |
| **File Storage** | `/api/files/download/*` | GET | Download uploaded asset | Yes |
| **File Storage** | `/api/files/:id` | DELETE | Delete uploaded asset | Yes |
| **Notifications** | `/api/notifications` | GET | Paginated notification inbox | Yes |
| **Notifications** | `/api/notifications/unread-count`| GET | Unread counter | Yes |
| **Notifications** | `/api/notifications/:id/read` | PATCH | Mark single notification as read | Yes |
| **Notifications** | `/api/notifications/read-all` | PATCH | Mark all notifications read | Yes |

---

## 4. Authentication Architecture

### 4.1 Token & Session Handling
- **JWT Mechanism**: Backend signs standard HMAC SHA-256 JWT tokens containing `{ id: user._id, email: user.email }` with a 7-day validity.
- **Mobile**: Persisted securely in `expo-secure-store` (`app_auth_token` and `app_user_profile`).
- **Web**: Persisted in browser `localStorage` and synchronized via reactive `AuthContext` with an HTTP Bearer header attached to every API call.

### 4.2 Web Auth Flow:
1. **Login Screen (`/login`)**: Email + Password with validation, password visibility toggle, error display, instant redirect to `/dashboard`.
2. **Signup Screen (`/signup`)**: Full Name, Email, Strong Password verification (minimum 6 chars), instant session creation, redirect to `/dashboard`.
3. **Forgot Password Screen (`/forgot-password`)**: Two-step verification UI:
   - Step 1: Submit email to receive 6-digit OTP.
   - Step 2: Enter 6-digit OTP code + new password with confirmation, instant update.
4. **Protected Route Guard**: Web middleware / route layout verifying session state, automatically routing unauthenticated visitors to `/login` with return redirect support.

---

## 5. Web Application Architecture (`web/`)

The web client is built with Next.js 14 App Router, structured strictly for high-information density, desktop productivity, and responsive layouts:

```
web/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx         # Marketing navbar & footer
│   │   └── page.tsx           # Premium landing page (Hero, Ecosystem, Features, Live Demo, FAQ, CTA)
│   ├── (auth)/
│   │   ├── layout.tsx         # Minimal centered clean auth layout
│   │   ├── login/page.tsx     # Full desktop & mobile responsive login
│   │   ├── signup/page.tsx    # Full registration with validation
│   │   └── forgot-password/page.tsx # OTP-based verification & reset
│   ├── (app)/                 # Protected Application Routes
│   │   ├── layout.tsx         # Desktop sidebar + Topbar + User Profile + Notification menu
│   │   ├── dashboard/page.tsx # Operational analytics, quick metrics, activity charts, AI cards
│   │   ├── items/
│   │   │   ├── page.tsx       # Desktop data table & card grid with filters, search, pagination
│   │   │   ├── new/page.tsx   # Entity creation form with AI assistance
│   │   │   ├── [id]/page.tsx  # Detailed entity overview with status updater & actions
│   │   │   └── [id]/edit/page.tsx # Full entity editing form
│   │   ├── ai-assistant/page.tsx # Dedicated desktop AI text analysis, decomposition & summarization
│   │   ├── files/page.tsx     # File asset manager with drag-and-drop file upload & preview
│   │   └── notifications/page.tsx # Full notification inbox with bulk read & filter
│   ├── globals.css
│   └── layout.tsx             # Root layout with Fonts, AuthProvider, ToastProvider
├── components/
│   ├── ui/                    # Reusable button, input, badge, modal, dropdown, card, table
│   ├── layout/                # Sidebar, Header, MobileNav, Footer
│   ├── marketing/             # Hero, FeatureGrid, MultiPlatformShowcase, HowItWorks, FAQ
│   └── domain/                # ItemCard, ItemTable, ItemForm, AnalyticsChart, AICard, FileUploader
├── lib/
│   ├── api/                   # Centralized client.ts, auth.ts, items.ts, analytics.ts, ai.ts, files.ts, notifications.ts
│   └── utils.ts               # cn() helper, date formatters, status helpers
└── package.json
```

---

## 6. Shared Module Architecture (`shared/`)

A platform-independent TypeScript package:
```
shared/
├── src/
│   ├── types/
│   │   ├── auth.ts            # User, Session, AuthCredentials
│   │   ├── domain.ts          # HackathonItem, ItemStatus, ItemListQuery, PaginationMeta
│   │   ├── analytics.ts       # AnalyticsOverviewData, CategoryMetric, ActivityMetric
│   │   ├── ai.ts              # AIGeneratePayload, AIGeneratedResult
│   │   ├── file.ts            # UploadedFile, FileUploadResponse
│   │   └── notification.ts    # AppNotification, PaginatedNotifications
│   ├── constants/
│   │   └── config.ts          # Default statuses, categories, brand colors
│   └── validation/
│       └── authValidation.ts  # Email, password strength validator
├── package.json
└── tsconfig.json
```

---

## 7. Migration & Implementation Phases

1. **Phase 1: Analysis & Architecture Approval** (Completed with this document).
2. **Phase 2: Shared Layer Creation (`shared/`)** - Extract common interfaces and validation.
3. **Phase 3: Next.js Web Client Initialization (`web/`)** - Initialize Next.js 14 App Router, Tailwind CSS, Lucide icons, setup layout & design tokens.
4. **Phase 4: Centralized API Service Layer (`web/lib/api/`)** - Standardized HTTP client with JWT interceptor, timeout handling, and type safety.
5. **Phase 5: Web Authentication UX** - Complete AuthContext, Login, Signup, Forgot Password & OTP flows.
6. **Phase 6: Core Web Product Experiences** - Dashboard with interactive analytics, Item CRUD with data table + card views, AI summarizer suite, file manager, notifications center.
7. **Phase 7: Premium Marketing Landing Page** - Hero section with live product visual, Multi-Platform ecosystem story ("One Product, Everywhere"), Feature deep-dive, Live stats, FAQ, high-conversion CTA.
8. **Phase 8: Micro-Interactions & Styling Polish** - Polished animations, skeleton loaders, error states, empty states, responsive viewports (375px to 1440px+).
9. **Phase 9: Root Scripts & Monorepo Configuration** - Update root `package.json` to concurrently run `backend`, `frontend` (mobile), and `web`.
10. **Phase 10: Verification & Mobile Protection** - Run TypeScript type checks, verify backend endpoints, ensure mobile Expo build/config is pristine and untouched.

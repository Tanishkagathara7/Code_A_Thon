# APP — Multi-Platform Architecture & System Specification

> **The Definitive Blueprint for Web, Mobile, and Backend Co-Development**

---

## 1. Executive Summary & Product Vision

**APP** is an agile, multi-platform operational intelligence and hackathon pivot system. It delivers **two first-class client experiences**—a responsive desktop/tablet/mobile **Web application** and a gesture-driven **Mobile application**—powered by a **shared Node.js/Express REST API**, a shared MongoDB Atlas database, and unified TypeScript domain contracts.

```text
                                 ┌─────────────────────────────────┐
                                 │          User / Judge           │
                                 └────────────────┬────────────────┘
                                                  │
                         ┌────────────────────────┴────────────────────────┐
                         │                                                 │
                         ▼                                                 ▼
            ┌─────────────────────────┐                       ┌─────────────────────────┐
            │     Web Application     │                       │   Mobile Application    │
            │  Next.js 16 App Router  │                       │ React Native / Expo 57  │
            │    Tailwind CSS v4      │                       │     Expo Router v57     │
            │  Desktop / Tablet / PWA │                       │  Android / iOS / Native │
            └────────────┬────────────┘                       └────────────┬────────────┘
                         │                                                 │
                         │              Shared Contracts Layer             │
                         │             `shared/` TypeScript types          │
                         │                                                 │
                         └────────────────────────┬────────────────────────┘
                                                  │
                                                  ▼
                                     ┌─────────────────────────┐
                                     │    API / Backend Layer   │
                                     │     Node.js + Express   │
                                     │   JWT • Helmet • Rate   │
                                     └────────────┬────────────┘
                                                  │
                         ┌────────────────────────┴────────────────────────┐
                         │                                                 │
                         ▼                                                 ▼
            ┌─────────────────────────┐                       ┌─────────────────────────┐
            │      Database Layer     │                       │     External Services   │
            │   MongoDB Atlas Cluster │                       │  OpenRouter AI Gateway  │
            │      Mongoose ODM       │                       │  Nodemailer SMTP Mailer │
            └─────────────────────────┘                       └─────────────────────────┘
```

---

## 2. Platform Comparison & Responsibility Matrix

Web and Mobile share the same domain contracts and backend endpoints, but deliberately implement platform-native UI/UX patterns.

| Architectural Dimension | Web Application (`web/`) | Mobile Application (`frontend/`) | Shared Backend (`backend/`) | Shared Layer (`shared/`) |
| :--- | :--- | :--- | :--- | :--- |
| **Framework** | Next.js 16.3.5 (App Router, React 19.2.8) | Expo 57.0.21 (React Native 0.86.3) | Express 4.21.2 (Node.js 18+) | TypeScript 5.7+ |
| **Routing** | File-based App Router (`app/(app)`, `app/(auth)`) | Expo Router v57 file-based routing (`app/`) | Express centralized router (`/api/*`) | N/A |
| **Styling & Theme** | Tailwind CSS v4, Lucide React, Glass tokens | Vanilla RN StyleSheet, theme tokens, Vector Icons | N/A | Theme constants (`config.ts`) |
| **Motion** | GSAP 3.15, Lenis Smooth Scroll 1.3, CSS transforms | React Native Reanimated 4.5.1 Worklets | N/A | N/A |
| **State Management**| React Context (`AuthContext`, `ToastContext`) | React Context (`AuthContext`, `NetworkContext`) | Stateless JWT sessions | Shared interfaces |
| **Session Storage** | Browser `localStorage` / HTTP Bearer | `expo-secure-store` encrypted keychain | JWT signature (7 days expiration) | Token schemas |
| **File Handling** | Drag-and-drop HTML5 File API + FormData | `expo-image-picker`, `expo-document-picker` | Multer disk storage (`backend/uploads/`) | File metadata types |
| **Hardware / OS** | Keyboard shortcuts, mouse hover, window resize | Touch gestures, safe areas, haptics, back button | Server OS / container | N/A |
| **SEO & Indexing** | OpenGraph, Twitter cards, meta tags, sitemap | Not applicable (app store listing) | N/A | N/A |
| **Deployment** | Vercel, Netlify, Docker | EAS Build (APK/AAB/IPA), Expo Go | Render, Railway, AWS ECS, Fly.io | npm / workspace link |

---

## 3. Directory Structure & Codebase Map

```text
Code_A_Thon/
├── backend/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/              # database.ts (Mongoose Atlas connection)
│   │   ├── controllers/         # auth, hackathonItem, ai, file, analytics, notification
│   │   ├── middleware/          # auth (JWT), errorHandler, rateLimiter
│   │   ├── models/              # User, HackathonItem, Notification, UploadedFile
│   │   ├── routes/              # /api/auth, /api/items, /api/ai, /api/files, /api/analytics
│   │   ├── seeds/               # Deterministic demo dataset seeds (`npm run seed:reset`)
│   │   ├── services/            # authService, emailService, openrouterService, storageService
│   │   └── utils/               # validators, fileValidators
│   ├── uploads/                 # Local filesystem upload destination
│   └── package.json
│
├── frontend/                     # React Native + Expo 57 Mobile Application
│   │                            # NOTE: Retained as "frontend/" to safeguard native Metro/EAS configs
│   ├── app/                     # Expo Router file system routing:
│   │   ├── (auth)/              # Mobile auth & OAuth callbacks
│   │   ├── home.tsx             # Mobile dashboard, metrics, quick actions, AI cards
│   │   ├── items/               # CRUD: index, create, [id], edit/[id]
│   │   ├── notifications/       # Native notification drawer
│   │   └── onboarding.tsx       # Kinetic onboarding carousel
│   ├── components/              # Native UI components (auth, domain, common, navigation)
│   ├── config/                  # appConfig.ts (Central pivot config for mobile)
│   ├── context/                 # AuthContext, NetworkContext, ToastContext
│   ├── services/api/            # Mobile HTTP client layer
│   ├── theme/                   # colors.ts, typography.ts, motion.ts
│   ├── app.json                 # Expo bundle IDs, schemes, EAS project keys
│   └── package.json
│
├── web/                          # Next.js 16 App Router Web Application
│   ├── app/
│   │   ├── page.tsx             # Editorial landing page (Hero, Ecosystem, FAQ, CTA)
│   │   ├── layout.tsx           # Root layout with Fonts, AuthProvider, ToastProvider
│   │   ├── globals.css          # Tailwind CSS v4 design tokens and core variables
│   │   ├── (auth)/              # Centered auth flow:
│   │   │   ├── login/page.tsx   # Login with password strength & OAuth
│   │   │   ├── signup/page.tsx  # Registration with validation
│   │   │   └── forgot-password/page.tsx # 2-step OTP email recovery
│   │   ├── (app)/               # Protected workspace shell:
│   │   │   ├── layout.tsx       # Desktop Sidebar + Topbar + Navigation
│   │   │   ├── dashboard/page.tsx # Operational analytics, KPIs, activity timeline
│   │   │   ├── items/           # CRUD: data table, search, filter, pagination
│   │   │   │   ├── page.tsx     # Items list view & search
│   │   │   │   ├── new/page.tsx # Create entity with AI co-generation
│   │   │   │   ├── [id]/page.tsx # Item detail, status transition, timeline
│   │   │   │   └── [id]/edit/page.tsx # Full entity editing form
│   │   │   ├── ai-assistant/page.tsx # Desktop AI workspace & prompt synthesizer
│   │   │   ├── files/page.tsx   # Asset repository with drag-and-drop
│   │   │   └── notifications/page.tsx # Notification feed with bulk-actions
│   │   └── auth/callback/       # OAuth redirect landing pages (Google, GitHub)
│   ├── components/
│   │   ├── auth/                # KineticHeadline, InteractiveGridTiles, UnifiedAuthView
│   │   ├── layout/              # Sidebar, Topbar, MobileNav
│   │   └── marketing/           # HeroProductShowcase, AmbientHeroScene, ArchitectureDiagram
│   ├── lib/
│   │   ├── api/                 # Centralized client.ts, auth.ts, domain.ts
│   │   ├── animations/          # GSAP & Lenis smooth scroll drivers
│   │   ├── context/             # AuthContext.tsx, ToastContext.tsx
│   │   ├── types.ts             # Web-specific interfaces & view models
│   │   └── utils.ts             # cn() Tailwind merger and formatting helpers
│   ├── DESIGN_SYSTEM.md         # Visual tokens, typography, surfaces & layout specs
│   └── package.json
│
├── shared/                       # Cross-platform TypeScript contracts (Zero UI)
│   ├── src/
│   │   ├── constants/           # Branding, default categories, item statuses
│   │   ├── types/               # Auth, HackathonItem, Analytics, AI, File, Notification
│   │   └── validation/          # Email regex, password complexity rules
│   └── package.json
│
├── hackathon/                    # Hackathon execution operating pipeline (01_ through 13_)
├── .agents/                      # Antigravity AI engineering skills (pivot, code review, mobile UX, web UX)
├── HACKATHON_PIVOT_CHECKLIST.md  # 3-hour rapid pivot guide
├── PROJECT_ARCHITECTURE.md       # This document
└── package.json                  # Root monorepo runner (`concurrently`)
```

---

## 4. Shared Backend & API Inventory

The shared backend (`backend/`) exposes RESTful endpoints at `/api/*`. Both the Web and Mobile clients consume these exact endpoints:

| Domain | Route | Method | Payload / Query | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **System** | `/api/health` | GET | None | No | Server status & MongoDB connection state |
| **Auth** | `/api/auth/email` | POST | `{ mode: 'login' \| 'signup', email, password, name? }` | No (Rate limited) | Dual-mode email auth returning JWT session |
| **Auth** | `/api/auth/sync` | POST | `{ email, name, avatar?, provider, providerId }` | No | Social profile synchronization |
| **Auth** | `/api/auth/github` | POST | `{ code: string }` | No | GitHub OAuth code exchange for JWT session |
| **Auth** | `/api/auth/forgot-password` | POST | `{ email: string }` | No (Rate limited) | Triggers 6-digit OTP reset email |
| **Auth** | `/api/auth/reset-password` | POST | `{ email, otp, newPassword }` | No (Rate limited) | Verifies OTP code and sets new password |
| **Auth** | `/api/auth/me` | GET | None | Yes (Bearer JWT) | Returns current authenticated user record |
| **Items** | `/api/items` | GET | `?search=&category=&status=&page=&limit=&sort=` | Yes | Paginated, filtered, sorted entity list |
| **Items** | `/api/items` | POST | `{ title, description, category, status, priority?, tags?, ... }` | Yes | Creates new domain entity |
| **Items** | `/api/items/:id` | GET | URL param `:id` | Yes | Retrieves single entity by ID |
| **Items** | `/api/items/:id` | PUT | Partial entity payload | Yes | Updates entity properties |
| **Items** | `/api/items/:id` | DELETE | URL param `:id` | Yes | Deletes entity |
| **Analytics** | `/api/analytics/overview` | GET | None | Yes | Aggregated counts, completion ratios, category breakdown |
| **AI Copilot** | `/api/ai/generate` | POST | `{ prompt: string, system?: string }` | Yes (AI rate limited) | OpenRouter LLM text generation & synthesis |
| **Files** | `/api/files` | POST | `multipart/form-data` (file) | Yes | Uploads asset (max 20MB) |
| **Files** | `/api/files/:id` | GET | URL param `:id` | Yes | Inspects file metadata |
| **Files** | `/api/files/download/*` | GET | Relative path | Yes | Downloads or streams stored file |
| **Files** | `/api/files/:id` | DELETE | URL param `:id` | Yes | Deletes stored file |
| **Notifications** | `/api/notifications` | GET | `?page=&limit=` | Yes | Paginated user notification inbox |
| **Notifications** | `/api/notifications/unread-count` | GET | None | Yes | Returns integer badge counter |
| **Notifications** | `/api/notifications/:id/read` | PATCH | URL param `:id` | Yes | Marks single notification as read |
| **Notifications** | `/api/notifications/read-all` | PATCH | None | Yes | Marks all notifications read |

---

## 5. Authentication & Session Architecture

```text
       Web Browser (Next.js)                      Mobile Device (Expo)
   ┌───────────────────────────┐              ┌───────────────────────────┐
   │ localStorage ('pulse_web_')│              │ SecureStore (Encrypted)   │
   └─────────────┬─────────────┘              └─────────────┬─────────────┘
                 │                                          │
                 ▼                                          ▼
   Authorization: Bearer <jwt>                Authorization: Bearer <jwt>
                 │                                          │
                 └────────────────────┬─────────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │  Express auth Middleware  │
                        │   jwt.verify(token, key)  │
                        └─────────────┬─────────────┘
                                      │
                         Success: req.user = decoded
```

1. **Token Signature**: Backend signs standard HMAC SHA-256 JWT tokens containing `{ id: user._id, email: user.email }` with a 7-day expiration.
2. **Web Token Persistence**: `web/lib/api/client.ts` stores tokens under `pulse_web_token` and user profiles under `pulse_web_user` in browser `localStorage`.
3. **Web Route Protection**: `web/app/(app)/layout.tsx` checks authentication state on mount. If no token is found, visitors are redirected to `/login` with clean query parameter preservation.
4. **Mobile Token Persistence**: `frontend/context/AuthContext.tsx` stores tokens securely in native keychain via `expo-secure-store`.

---

## 6. Shared vs Platform-Specific Architecture

### 6.1 Shared Architecture (`shared/`)
- **Domain Interfaces**: `HackathonItem`, `ItemStatus`, `ItemPriority`, `User`, `AppNotification`, `UploadedFile`, `AnalyticsOverviewData`.
- **Validation Rules**: Password strength evaluation (`shared/src/validation/index.ts`), email format regex.
- **Default Constants**: Categories (`Engineering`, `Design`, `Product`, `Marketing`, `General`), Status metadata (colors, labels).

### 6.2 Web-Specific Architecture (`web/`)
- **Desktop Information Density**: High-density Data Tables with sortable column headers, pagination controls, and batch actions.
- **Responsive Layout Shell**: Collapsible sidebar navigation for desktop (`lg:w-64`), compact top navigation on tablet, and bottom/drawer menu on mobile viewports.
- **Micro-Animations & Smoothness**: GSAP hero typography animations, Lenis inertia scrolling for editorial landing sections, and CSS transitions on interactive elements.
- **Keyboard & Accessibility**: Full tab order navigation, visible focus rings (`focus-visible:ring-2`), semantic HTML5 tags (`<main>`, `<nav>`, `<aside>`, `<header>`).

### 6.3 Mobile-Specific Architecture (`frontend/`)
- **Touch-First Mechanics**: Minimum touch targets of 44×44pt, pull-to-refresh list behaviors, swipe gestures.
- **Native Device Access**: Camera/Gallery via `expo-image-picker`, system documents via `expo-document-picker`, native haptics.
- **Screen Safety**: `SafeAreaView` wrapping top and bottom notches, Android hardware back-button handlers.

---

## 7. Environment Variables Matrix

Environment variables are partitioned into **Client/Public** variables (exposed to the browser) and **Server/Private** variables (strictly confidential).

| Variable Name | Layer | Purpose | Public / Private | Example / Default |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | Backend | Express HTTP server listening port | **Private** | `5000` |
| `MONGODB_URI` | Backend | MongoDB Atlas connection string | **Private** | `mongodb+srv://<user>:<pass>@...` |
| `JWT_SECRET` | Backend | Key used to sign session tokens | **Private** | `YOUR_SECURE_JWT_SECRET` |
| `OPENROUTER_API_KEY` | Backend | AI Gateway API Key | **Private** | `YOUR_OPENROUTER_KEY` |
| `OPENROUTER_MODEL` | Backend | Default LLM model identifier | **Private** | `openrouter/free` |
| `SMTP_USER` / `SMTP_PASS` | Backend | Nodemailer Gmail credentials | **Private** | `YOUR_EMAIL@gmail.com` |
| `GITHUB_CLIENT_SECRET` | Backend | GitHub OAuth secret | **Private** | `YOUR_GITHUB_SECRET` |
| `NEXT_PUBLIC_API_URL` | Web | Root backend REST API endpoint | **Public** | `http://localhost:5000/api` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`| Web | Google OAuth Web Client ID | **Public** | `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID`| Web | GitHub OAuth Client ID | **Public** | `YOUR_GITHUB_CLIENT_ID` |
| `EXPO_PUBLIC_API_URL` | Mobile | Root backend REST API for Expo | **Public** | `http://10.0.2.2:5000/api` or Deployed URL |

> [!CAUTION]
> Never commit actual secret keys (`JWT_SECRET`, `OPENROUTER_API_KEY`, `MONGODB_URI`, `SMTP_PASS`, `GITHUB_CLIENT_SECRET`) into Git. Only use sample `.env.example` templates in the repository.

---

## 8. Development & Deployment Lifecycle

### 8.1 Local Multi-Platform Bootstrapping
```bash
# 1. Install all dependencies across monorepo
npm run install:all

# 2. Seed database with realistic demo records
npm run seed:reset

# 3. Boot all services concurrently (Mobile, Web, Backend)
npm run dev
```

### 8.2 Deployment Targets
- **Web**: Hosted on **Vercel** with Next.js edge runtime support. Set environment variable `NEXT_PUBLIC_API_URL`.
- **Backend**: Hosted on **Render** / **Railway** / **Fly.io**. Ensure `MONGODB_URI`, `JWT_SECRET`, and `OPENROUTER_API_KEY` are configured in project environment.
- **Mobile**: Built via **Expo Application Services (EAS)**:
  ```bash
  cd frontend
  eas build --platform android --profile preview
  ```

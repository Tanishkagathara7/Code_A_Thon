# APP Web Application — Engineering & Developer Guide

> **Next.js 16 App Router • React 19 • Tailwind CSS v4 • TypeScript • GSAP • Lenis**

This directory contains the production web client for **APP**. It is built as a first-class, desktop-optimized, and fully responsive operational intelligence workspace.

---

## 🏛️ Directory Architecture

```text
web/
├── app/                                 # Next.js 16 App Router
│   ├── layout.tsx                       # Root HTML shell with Geist fonts & providers
│   ├── globals.css                      # Tailwind CSS v4 tokens, surface variables
│   ├── page.tsx                         # Editorial landing page (Hero, Showcase, FAQ)
│   ├── (auth)/                          # Centered authentication layout
│   │   ├── layout.tsx                   # Clean centered auth shell with kinetic backdrop
│   │   ├── login/page.tsx               # Login with password visibility & OAuth options
│   │   ├── signup/page.tsx              # User registration with password strength meter
│   │   └── forgot-password/page.tsx     # 2-step OTP email recovery flow
│   ├── (app)/                           # Authenticated workspace layout
│   │   ├── layout.tsx                   # Protected shell: Sidebar + Topbar + Auth guard
│   │   ├── dashboard/page.tsx           # Operational KPIs, activity timeline, AI widget
│   │   ├── items/                       # Domain Entity CRUD Hub
│   │   │   ├── page.tsx                 # High-density Data Table, search, filter, pagination
│   │   │   ├── new/page.tsx             # Entity creator with AI prompt generator
│   │   │   ├── [id]/page.tsx            # Detail overview, status updater, attachments
│   │   │   └── [id]/edit/page.tsx       # Entity editing form
│   │   ├── ai-assistant/page.tsx        # Desktop AI synthesis workspace
│   │   ├── files/page.tsx               # Drag-and-drop asset repository
│   │   └── notifications/page.tsx       # Notification center with read/unread filters
│   └── auth/callback/                   # OAuth redirect handlers (Google & GitHub)
│
├── components/                          # Modular React Components
│   ├── auth/                            # KineticHeadline, UnifiedAuthView, PasswordStrengthMeter
│   ├── layout/                          # Sidebar, Topbar, MobileNav
│   └── marketing/                       # HeroProductShowcase, AmbientHeroScene, ArchitectureDiagram
│
├── lib/                                 # Client Infrastructure
│   ├── api/
│   │   ├── client.ts                    # Fetch wrapper with Bearer token & ApiError handling
│   │   ├── auth.ts                      # Email login/signup, password reset, OAuth API calls
│   │   └── domain.ts                    # Items, Analytics, AI, Files, Notifications API calls
│   ├── animations/                      # GSAP & Lenis smooth scrolling orchestrations
│   ├── context/
│   │   ├── AuthContext.tsx              # Reactive user session & login/logout state
│   │   └── ToastContext.tsx             # Interactive toast notification system
│   ├── types.ts                         # Web domain interfaces & view models
│   └── utils.ts                         # cn() clsx + tailwind-merge helper, formatters
│
├── public/                              # Static visual assets & illustrations
├── DESIGN_SYSTEM.md                     # Visual tokens, typography, surfaces & layout specs
└── package.json                         # Next.js dependencies & scripts
```

---

## 🚦 Web Routing & Route Protection

The web client employs Next.js Route Groups to separate public marketing, authentication, and protected operational spaces:

```text
Public Marketing
 └── /                       → Premium product showcase, live telemetry & FAQ

Authentication
 ├── /login                  → Email & OAuth sign-in
 ├── /signup                 → User registration with live password strength scoring
 ├── /forgot-password        → OTP email verification & password update
 ├── /auth/callback/google   → Google OAuth callback receiver
 └── /auth/callback/github   → GitHub OAuth callback receiver

Protected Workspace (Requires Bearer JWT)
 ├── /dashboard              → High-level metrics, completion breakdown & activity feed
 ├── /items                  → Searchable, paginated data table of domain entities
 ├── /items/new              → Creation form with AI assisted field completion
 ├── /items/:id              → Entity inspector with status toggling & attachments
 ├── /items/:id/edit         → Entity modification form
 ├── /ai-assistant           → AI prompt synthesizer & text analysis copilot
 ├── /files                  → Drag-and-drop file upload & asset library
 └── /notifications          → Notification inbox with bulk read & filter controls
```

### Route Guard Mechanism
Protected routes inside `app/(app)/layout.tsx` check authentication via `useAuth()` on initial render. If `token` is missing or invalid:
1. The user is redirected to `/login?redirect=<target_route>`.
2. Upon successful login, the user is seamlessly routed back to their intended target destination.

---

## 📱 Responsive Web Design & Breakpoints

The web interface is engineered across 4 distinct viewport tiers:

| Viewport Tier | Width Range | Layout Adaptation |
| :--- | :--- | :--- |
| **Desktop / Ultrawide** | `1280px` and up | Pinned desktop sidebar (`w-64`), multi-column bento grids, dense data tables with full column visibility. |
| **Laptop** | `1024px – 1279px` | Compact sidebar, 2-column dashboard grids, optimized table padding. |
| **Tablet** | `768px – 1023px` | Collapsible navigation drawer, single/dual column hybrid, simplified table view. |
| **Mobile Web** | `< 768px` | Bottom dock / hamburger drawer, single-column card feeds replacing tables, minimum 44px touch targets. |

---

## 🎨 UI/UX Standards & Interaction States

To ensure a standout presentation for hackathon judges, every interactive feature must implement the complete 4-state lifecycle:

1. **Loading State**: Clean pulse skeletons or animated loaders (never freeze the UI or leave empty blank screens).
2. **Success State**: Immediate optimistic UI update or success Toast confirmation.
3. **Empty State**: Context-aware helpful prompt and primary call-to-action button:
   > *Example*: Rather than displaying a blank card or "No data", display *"No items registered yet — Create your first item or generate sample seed data."* with an instant "Create Item" button.
4. **Error State**: Informative inline banner or Toast alert with a clear retry action. Never fail silently.

---

## 🔌 API Client & Error Strategy

All HTTP requests pass through `web/lib/api/client.ts`:
- **Authorization Header**: Automatically attaches `Authorization: Bearer <token>` when a session token is present in `localStorage`.
- **Structured Error Model**: Throws typed `ApiError(message, status, data)` with HTTP status code and server response payload.
- **Base URL Fallback**: Reads `process.env.NEXT_PUBLIC_API_URL` with fallback to deployed production API.

---

## 🔍 Search Engine Optimization (SEO)

- **Metadata Architecture**: Root `app/layout.tsx` defines high-conversion OpenGraph, Twitter Card, and semantic metadata tags.
- **Indexability Controls**:
  - Marketing pages (`/`) are fully indexable with structured metadata.
  - Workspace and Auth routes (`/dashboard`, `/items`, `/login`) include `robots: { index: false, follow: false }` to prevent indexing private workspace data.
- **Heading Hierarchy**: Exactly one `<h1>` per page, followed by logical `<h2>` and `<h3>` section demarcations.

---

## 🛡️ Web Security Guidelines

- **Zero Secret Exposure**: Only variables prefixed with `NEXT_PUBLIC_` are bundled into the client browser. Never access `MONGODB_URI` or `JWT_SECRET` in web client code.
- **XSS & Injection Defense**: React JSX auto-escaping protects against cross-site scripting. HTML injection via `dangerouslySetInnerHTML` is prohibited.
- **Safe Authentication**: Tokens stored in `localStorage` are cleared on logout, and 401 responses trigger automatic session termination and clean redirection.

---

## 🚀 Running & Building

```bash
# Start local development server (port 3000)
npm run dev

# Build production bundle for verification
npm run build

# Start production server locally
npm start

# Run ESLint validation
npm run lint
```

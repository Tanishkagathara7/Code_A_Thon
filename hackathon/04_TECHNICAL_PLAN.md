# 04 — Technical Plan

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity after completing [`03_UX_PLAN.md`](file:///c:/Users/a2z/Code_A_Thon/hackathon/03_UX_PLAN.md).*

---

## Existing Architecture & Technology Stack

The repository provides a complete, dual-client, and shared-backend operational foundation:

* **Web Client (`web/`)**:
  - Next.js 16.3.5 (App Router, Server & Client Components)
  - React 19.2.8
  - Tailwind CSS v4, Lucide React icons
  - GSAP 3.15, Lenis 1.3 smooth scrolling, Three.js 0.186
  - TypeScript 5.x
* **Mobile Client (`frontend/`)**:
  - React Native 0.86.3 + Expo SDK 57.0.21
  - Expo Router v57 file-based routing
  - React Native Reanimated 4.5.1
  - Vector Icons, Linear Gradient, SecureStore
  - TypeScript ~6.0.3
* **Shared Backend (`backend/`)**:
  - Node.js 18+ & Express 4.21.2
  - MongoDB Atlas with Mongoose 8.10 ODM
  - Authentication: JWT, bcryptjs password hashing, 6-digit OTP email recovery
  - Middleware: Helmet, rate limiters, Multer disk storage
  - OpenRouter AI Gateway service
* **Shared Contract Layer (`shared/`)**:
  - Cross-platform TypeScript interfaces (`HackathonItem`, `User`, `AnalyticsOverviewData`)
  - Shared domain constants (`PRODUCT_BRAND`, `DEFAULT_CATEGORIES`, `ITEM_STATUSES`)
  - Common validation logic (email regex, password complexity)

---

## Requirement → Existing Capability Mapping

| Problem Requirement | Existing Capability | Target Client / Layer | Action (REUSE / CONFIGURE / EXTEND / NEW) |
| :--- | :--- | :--- | :--- |
| User Authentication | JWT Email + Social Sync | Web `(auth)` & Mobile `(auth)` | **REUSE** |
| Core Entity Lifecycle | `HackathonItem` CRUD | Web `(app)/items` & Mobile `items/` | **REUSE** |
| Search & Category Filter | Full-text query & category pills | Web Data Table & Mobile List | **REUSE / CONFIGURE** |
| Domain Terminology & Branding | Brand names, colors, categories | `shared/src/constants/` & `appConfig.ts` | **CONFIGURE** |
| Operational Analytics | Overview counts, categories, ratios | Web Dashboard & Mobile Home | **REUSE** |
| AI Summaries & Copilot | OpenRouter Gateway | Web `/ai-assistant` & Mobile AI Card | **CONFIGURE** prompts |
| File Attachments | Multer upload service | Web `/files` & Mobile `FilePicker` | **REUSE** |
| Notifications Center | Notification model & unread counts | Web Topbar inbox & Mobile feed | **REUSE** |
| Domain Seed Data | Realistic mock datasets | `backend/src/seeds/datasets/` | **CONFIGURE** |
| Differentiating Business Logic | Custom controller / service | Shared Backend or Client Logic | **NEW** (Scoped to winning feature) |

---

## Architecture Change Constraints

> **CRITICAL RULE**: Do NOT make architectural modifications unless explicitly mandated by the problem statement.

* **Database Changes**: NONE (Reuse `HackathonItemSchema` with custom tags or optional metadata).
* **Framework Changes**: NONE (Strictly maintain Next.js 16 and Expo 57).
* **State Management Changes**: NONE (Reuse React Context on Web and Mobile).
* **New Dependencies**: Prohibited unless strictly required for a problem-specific winning feature (e.g. barcode scanner).

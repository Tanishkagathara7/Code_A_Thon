# APP — Multi-Platform Operational Intelligence Platform

> **One Product • Two First-Class Clients • One Shared Backend**

APP is a synchronized cross-platform operational intelligence platform featuring an **Expo React Native mobile client**, a **Next.js App Router web application**, and a **shared Node.js/Express REST backend** backed by MongoDB Atlas and the OpenRouter AI Gateway.

---

## 🏛️ Monorepo & Client Architecture

```text
Code_A_Thon/
├── backend/                  # Shared Node.js + Express REST API
│   ├── src/
│   │   ├── controllers/     # Auth, Items, AI, Files, Analytics, Notifications
│   │   ├── middleware/      # JWT validation, rate limiters, error handling
│   │   ├── models/          # User, HackathonItem, Notification, UploadedFile
│   │   ├── routes/          # /api/auth, /api/items, /api/ai, /api/files, etc.
│   │   └── services/        # Auth, Email (SMTP), OpenRouter, Storage
│   └── package.json
│
├── frontend/                 # React Native + Expo 57 Mobile Application (Mobile Client)
│   ├── app/                 # Expo Router (Home, Items CRUD, Auth, Notifications, Onboarding)
│   ├── components/          # Native touch-first UI, bottom dock, Reanimated 4.5 animations
│   ├── context/             # AuthContext (expo-secure-store), NetworkContext, ToastContext
│   ├── services/api/        # Mobile API service layer
│   └── package.json
│
├── web/                      # Next.js 16 App Router Web Application (Web Client)
│   ├── app/
│   │   ├── page.tsx         # Premium multi-platform landing page (Hero, Ecosystem, FAQ)
│   │   ├── (auth)/          # Desktop & mobile responsive Login, Signup, Forgot Password
│   │   └── (app)/           # Protected workspace: Dashboard, Items Hub, AI Copilot, Files, Notifications
│   ├── components/          # Sidebar, Topbar, Data Table, KPI cards, AI assistant form
│   ├── lib/api/             # Centralized Web API client with JWT interceptor
│   └── package.json
│
├── shared/                   # Shared TypeScript contracts (Zero UI duplication)
│   ├── src/types/           # User, HackathonItem, Analytics, AI, File, Notification interfaces
│   ├── src/constants/       # System categories, statuses, branding defaults
│   └── src/validation/      # Password strength and email regex validators
│
├── hackathon/                # Hackathon execution operating pipeline (01_ through 13_)
├── .agents/                  # Antigravity AI engineering skills (pivot, code review, mobile UX, web UX)
├── HACKATHON_PIVOT_CHECKLIST.md # 3-hour rapid pivot guide
├── PROJECT_ARCHITECTURE.md   # Architectural blueprint and API contract inventory
└── package.json             # Root monorepo orchestrator
```

---

## 🚀 Quickstart & Local Development

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20 & v24)
- **npm**: v9+
- **MongoDB Atlas Connection URI**

### 2. Environment Variables

#### Backend (`backend/.env`)
Create `backend/.env` from `backend/.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pulse?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openrouter/free
```

#### Web Client (`web/.env.local`)
Create `web/.env.local` from `web/.env.local.example`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
```

#### Mobile Client (`frontend/.env`)
Create `frontend/.env` from `frontend/.env.example`:
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
# Or use your deployed backend / local IP address for physical devices
```

---

## 🏃 Running the Applications

From the repository root:

### Run Everything Together (Mobile + Web + Backend)
```bash
npm run dev
```
*Uses `concurrently` to boot the Mobile Expo Metro bundler, Next.js web dev server, and Express backend API simultaneously.*

### Run Clients Individually

- **Web Application**:
  ```bash
  npm run web
  ```
  *Accessible at [http://localhost:3000](http://localhost:3000)*

- **Mobile Application**:
  ```bash
  npm run mobile
  # or
  npm run frontend
  ```
  *Opens Expo Dev Tools to run on Android, iOS, or Expo Go.*

- **Backend API**:
  ```bash
  npm run backend
  ```
  *Runs Express server at [http://localhost:5000](http://localhost:5000)*

- **Seed Demo Data**:
  ```bash
  npm run seed:reset
  ```

- **Production Web Build Verification**:
  ```bash
  npm run web:build
  ```

---

## 🔒 Security & Best Practices
- **Strict Client Separation**: Web and mobile share TypeScript contracts and Express REST endpoints, but retain dedicated native UX paradigms.
- **Mobile Integrity Preserved**: `frontend/` retains its verified Expo 57 setup, Reanimated 4.5 bindings, Metro configurations, and native bundle IDs without breaking changes.
- **JWT & Rate Limiting**: Express backend applies `helmet()`, general and endpoint-specific rate limiters, bcrypt password hashing, and 6-digit OTP verification codes.
- **Web Defense in Depth**: Strict form input validation, client/server secret isolation (`NEXT_PUBLIC_` prefix enforcement), safe token lifecycle handling, and route protection.

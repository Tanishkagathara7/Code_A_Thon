# VyaaparGST — Smart GST Billing & Invoicing Suite for Indian Businesses

> **One Modern Monorepo • Next.js 16 Web Desk • Expo React Native Mobile Client • Node.js & Express REST Backend**

**VyaaparGST** is a fast, compliant Indian GST billing, invoicing, party khata ledger, and inventory tracking platform designed for retail shopkeepers, wholesale merchants, kirana store owners, and service providers. It empowers merchants with 30-second invoice generation, automated CGST/SGST/IGST tax splits, printable A4 and thermal receipts, and real-time inventory tracking.

---

## 🌟 Core Feature Suite

- ⚡ **30-Second GST Invoicing**: Instant line-item entry, quantity/rate arithmetic, statutory HSN/SAC code support, and automatic round-off.
- 🇮🇳 **Automatic Intra-State vs. Inter-State Tax Engine**:
  - **Intra-State (Local)**: Automatically divides GST into **50% CGST + 50% SGST**.
  - **Inter-State**: Dynamically assigns **100% IGST** based on buyer's Place of Supply.
  - Slabs: Fully supports **0% (Exempt), 5%, 12%, 18%, and 28%** statutory rates.
- 🖨️ **Printable Tax Invoices & Thermal Slips**: A4 professional invoice generator with business trade header, party details, tax break-up table, amount in words, and signature blocks.
- 📦 **Real-Time Inventory & Stock Audit**: Catalog of items, SKU codes, HSN numbers, purchase/selling margins, current stock levels, and automated low-stock warnings.
- 👥 **Customer & Party Khata Ledger**: Customer directory with separate B2B (with statutory 15-character GSTIN verification) and B2C tracking, outstanding dues, and historical invoice ledgers.
- 🤖 **Smart AI Billing Assistant**: Natural language prompt processor that converts text or spoken summaries into itemized GST invoices.
- 🛡️ **End-to-End Field Validation**: Strict validation across client forms and backend endpoints for phone numbers, GSTINs, prices, HSN codes, and quantities.

---

## 🏛️ Monorepo & Client Architecture

```text
Code_A_Thon/
├── web/                      # Next.js 16 App Router Web Application (Desktop-first POS Desk)
│   ├── app/                  # Route groups: (auth) for login/signup, (app) for workspace
│   │   ├── dashboard/        # Executive sales metrics, tax totals, recent invoices
│   │   ├── items/            # Invoices hub: creation desk (/new), inspector (/[id]), editor (/[id]/edit)
│   │   ├── products/         # Product catalog, stock levels, adjustment drawer
│   │   ├── customers/        # Party directory, GSTIN ledger, transaction khata
│   │   ├── ai-assistant/     # AI prompt billing synthesizer
│   │   └── settings/         # Shop profile, GSTIN, business trade name
│   ├── components/           # Modular UI: Layout (Sidebar/Topbar), POS Desk, Data Tables
│   ├── lib/                  # Centralized API client, AuthContext, ToastContext, domain models
│   └── README.md             # Dedicated Web Client Architecture & Developer Guide
│
├── backend/                  # Shared Node.js + Express REST API
│   ├── src/
│   │   ├── controllers/      # CustomerController, ProductController, HackathonItemController, Auth
│   │   ├── middleware/       # JWT auth guard, request rate limiters, error handling
│   │   ├── models/           # Customer, Product, HackathonItem (Invoices), StockHistory, User
│   │   ├── routes/           # /api/customers, /api/products, /api/items, /api/auth, /api/ai
│   │   └── services/         # CustomerService, ProductService, OpenRouter AI, Email SMTP
│   └── package.json
│
├── frontend/                 # React Native + Expo 57 Mobile Application (Mobile Client)
│   ├── app/                  # Expo Router (Home, Invoices CRUD, Auth, Notifications, Onboarding)
│   ├── components/           # Native touch-first UI, bottom dock, Reanimated 4.5 animations
│   ├── context/              # AuthContext (expo-secure-store), NetworkContext, ToastContext
│   ├── services/api/         # Mobile API service layer
│   └── package.json
│
├── shared/                   # Shared TypeScript contracts & domain models
└── package.json              # Monorepo orchestrator
```

---

## 🚀 Quickstart & Local Development

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20 & v24)
- **npm**: v9+
- **MongoDB Atlas Database URI**

### 2. Environment Setup

#### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pulse?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openrouter/free
```

#### Web Client (`web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Mobile Client (`frontend/.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

From the repository root:

### Run Everything Together (Web + Mobile + Backend)
```bash
npm run dev
```

### Run Clients Individually
- **Web Application**:
  ```bash
  npm run web
  ```
  *Accessible at [http://localhost:3000](http://localhost:3000)*

- **Backend API Server**:
  ```bash
  npm run backend
  ```
  *Runs Express API at [http://localhost:5000](http://localhost:5000)*

- **Mobile Application**:
  ```bash
  npm run mobile
  # or
  npm run frontend
  ```
  *Opens Expo Metro bundler for iOS, Android, or Expo Go.*

- **Production Web Build**:
  ```bash
  npm run web:build
  ```

---

## 🔒 Security & Statutory Compliance

- **Statutory GSTIN Validation**: Regex-validated 15-character GSTIN codes (`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`).
- **Clean Customer Isolation**: Customer directories begin completely clean upon new user logins, strictly scoped to each merchant account.
- **JWT & Route Guarding**: Authenticated sessions are enforced via HTTP Bearer token headers, and private routes redirect unauthenticated traffic to login.
- **Input Sanitization**: Numerical bounds enforcement on prices, stock delta adjustments, quantities, and phone numbers.

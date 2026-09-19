# VyaaparGST Web Client — Modern GST Billing & Khata Suite

> **Next.js 16 (App Router) • React 19 • Tailwind CSS v4 • TypeScript • GSAP & Lenis Micro-Animations • Lucide Icons**

The `web/` directory contains the production-grade, desktop-first web application for **VyaaparGST** — a compliant, lightning-fast GST billing, party khata ledger, inventory tracker, and automated tax calculation suite built for Indian retail shopkeepers, wholesale traders, and kirana store merchants.

---

## 🌟 Key Functional Highlights

1. **⚡ Fast POS Billing & A4 Tax Invoicing (`/items/new`)**:
   - 30-second bill generator with instant line-item additions, HSN/SAC code lookup, and quantity/unit rate calculations.
   - Statutory GST slab computation: **0%, 5%, 12%, 18%, 28%**.
   - Automatic Place-of-Supply detection: dynamically splits into **CGST + SGST** for intra-state supply (e.g., Gujarat to Gujarat) or **IGST** for inter-state supply.
   - Live printable thermal receipt and full A4 tax invoice preview with print-to-PDF support.

2. **📊 Real-Time Operations Dashboard (`/dashboard`)**:
   - Executive metric cards: Today's Gross Revenue, Total GST Collected (CGST/SGST/IGST breakdown), Invoices Generated, and Outstanding Credit Balances.
   - Interactive trend charts with monthly/weekly revenue curves and tax breakdown bars.
   - Recent tax invoices feed with quick status badges (`Paid in Full`, `Partial Balance`, `Unpaid / Due`).

3. **📦 Inventory & Stock Management (`/products`)**:
   - Real-time catalog of products, SKU identifiers, and statutory HSN codes.
   - Automatic stock level tracking with visual alerts for `In Stock`, `Low Stock`, and `Out of Stock`.
   - Purchase price, selling price, margin determination, and stock adjustment logs.

4. **👥 Customer Directory & Party Khata (`/customers`)**:
   - Buyer ledger management supporting both **B2B Businesses** (with 15-character GSTIN validation) and **Retail / Individuals**.
   - State and Place of Supply mapping with standard Indian State Code lookup.
   - Transaction history, total billed volume, outstanding balance, and customer profile inspector (`/customers/[id]`).
   - Clean slate isolation: New logins start with an empty customer directory scoped to the authenticated user account.

5. **🧾 Invoice History & Lifecycle (`/items`)**:
   - High-density data table with multi-criteria search (party name, invoice number, status, category).
   - Complete lifecycle tracking: Record partial payments, settle balance, or edit past invoices (`/items/[id]/edit`).
   - Thermal slip preview, bill breakdown inspector, and quick export.

6. **🤖 Smart AI Billing Assistant (`/ai-assistant`)**:
   - Natural language billing prompt synthesis: Convert conversational voice/text summaries (e.g., *"Bill 5 bags of basmati rice to Rajesh Traders on 30 days credit"*) into structured invoice line items.

7. **⚙️ Shop & Business Profile Settings (`/settings`)**:
   - Manage business legal trade name, shop address, registered GSTIN, contact numbers, and invoice preferences.

---

## 🏛️ Directory Architecture

```text
web/
├── app/                                 # Next.js 16 App Router hierarchy
│   ├── layout.tsx                       # Root layout (fonts, ToastProvider, AuthProvider, NotificationProvider)
│   ├── globals.css                      # Tailwind CSS v4 design tokens, surface gradients, print stylesheet
│   ├── page.tsx                         # Editorial product landing page & live interactive billing demo
│   │
│   ├── (auth)/                          # Centered authentication layout
│   │   ├── layout.tsx                   # Kinetic auth shell with dynamic backdrop
│   │   ├── login/page.tsx               # Email/password authentication & Guest login
│   │   ├── signup/page.tsx              # Business account registration & password strength analyzer
│   │   └── forgot-password/page.tsx     # 2-step OTP email password reset
│   │
│   ├── (app)/                           # Authenticated workspace layout (Protected)
│   │   ├── layout.tsx                   # Authenticated layout guard: Sidebar + Topbar + Command Palette
│   │   ├── dashboard/                   # Executive billing summary & operational metrics
│   │   │   ├── page.tsx                 # Real-time billing overview & KPI metrics
│   │   │   └── analytics/page.tsx       # In-depth sales & tax analytics
│   │   │
│   │   ├── items/                       # Invoices & Tax Bills Hub
│   │   │   ├── page.tsx                 # Invoice history table, filters, pagination
│   │   │   ├── new/page.tsx             # Interactive POS desk & instant GST bill creator
│   │   │   ├── [id]/page.tsx            # Invoice detail inspector & A4 print generator
│   │   │   └── [id]/edit/page.tsx       # Live invoice modification & line-item recalculation
│   │   │
│   │   ├── products/                    # Product catalog & inventory control
│   │   │   ├── page.tsx                 # Product directory, stock status, category filters
│   │   │   └── [id]/page.tsx            # Product detail & stock adjustment logs
│   │   │
│   │   ├── customers/                   # Party Directory & Khata Ledger
│   │   │   ├── page.tsx                 # Customer directory with B2B/B2C tabs & add modal
│   │   │   └── [id]/page.tsx            # Customer profile, ledger balance & transaction ledger
│   │   │
│   │   ├── ai-assistant/page.tsx        # AI prompt synthesizer & billing copilot
│   │   ├── files/page.tsx               # Asset & invoice receipt document vault
│   │   ├── notifications/page.tsx       # Real-time stock alerts & payment due reminders
│   │   └── settings/page.tsx            # Shopkeeper profile & business configuration
│   │
│   └── auth/callback/                   # OAuth redirect handlers
│
├── components/                          # Modular React Components
│   ├── auth/                            # Auth forms, kinetic headlines, password strength scoring
│   ├── dashboard/                       # Metric cards, IncidentTrendChart, POS quick counters
│   ├── layout/                          # Sidebar, Topbar, WorkspaceShell, CommandPalette
│   └── marketing/                       # Hero showcases, authentic invoice previews, demo desks
│
├── lib/                                 # Shared Client Architecture
│   ├── api/
│   │   ├── client.ts                    # Fetch wrapper with Bearer token injection & ApiError handling
│   │   ├── auth.ts                      # Authentication endpoints & session persistence
│   │   └── domain.ts                    # Invoices, products, customers, and AI backend interfaces
│   ├── context/
│   │   ├── AuthContext.tsx              # Reactive user session, profile & guest access
│   │   ├── ToastContext.tsx             # Animated alert notifications
│   │   └── NotificationContext.tsx      # In-app stock alerts & status change notifications
│   ├── domain.config.ts                 # VyaaparGST domain specs, tax slabs & navigation metadata
│   ├── types.ts                         # Complete TypeScript models (Invoices, Customers, Products, Taxes)
│   └── utils.ts                         # cn() utility, INR currency formatters, date helpers
│
├── public/                              # Branding assets, favicons, illustrations
└── package.json                         # Web client dependencies & build scripts
```

---

## 🚦 Application Routes

| Route | Access Level | Description |
| :--- | :--- | :--- |
| `/` | Public | Editorial landing page with interactive billing counter demonstrator |
| `/login` | Public | Sign in with email/password, OAuth, or 1-click Instant Guest Access |
| `/signup` | Public | New business merchant registration |
| `/forgot-password` | Public | Account recovery via verification code |
| `/dashboard` | Protected | Executive sales, tax collections, bill throughput, and quick POS desk |
| `/dashboard/analytics` | Protected | High-resolution sales analytics and tax slab breakdown |
| `/items/new` | Protected | Fast GST invoice generation with dynamic tax split & print engine |
| `/items` | Protected | Searchable, paginated tax bill history |
| `/items/:id` | Protected | Printable A4 invoice viewer with statutory tax declarations |
| `/items/:id/edit` | Protected | Invoice editor with automatic tax recalculation |
| `/products` | Protected | Product directory, inventory stock levels, and HSN codes |
| `/customers` | Protected | Buyer directory, GSTIN ledger, and transaction khata |
| `/customers/:id` | Protected | Customer profile, address details, and historical bill ledger |
| `/ai-assistant` | Protected | Conversational bill drafting and ledger summarization |
| `/settings` | Protected | Shop name, GSTIN profile, and operational preferences |

---

## 🇮🇳 GST Compliance & Calculation Engine

The web application adheres to statutory Indian Goods and Services Tax (GST) rules:
- **Intra-State Supply**: When the merchant's state equals the customer's Place of Supply, tax is split equally:
  $$\text{CGST} = \frac{\text{GST Rate}}{2}, \quad \text{SGST} = \frac{\text{GST Rate}}{2}$$
- **Inter-State Supply**: When the merchant and customer reside in different states:
  $$\text{IGST} = \text{GST Rate}$$
- **Standard Slabs**: Pre-configured support for **0% (Exempt)**, **5%**, **12%**, **18%**, and **28%**.
- **Statutory GSTIN Validation**: Automatic validation using the standard 15-character format (`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`).

---

## 💻 Tech Stack & Dependencies

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Runtime**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom micro-animations & print stylesheets
- **Typography**: Geist Sans & Geist Mono (via `next/font`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Smooth Scrolling & Motion**: [Lenis](https://lenis.darkroom.engineering/) & [GSAP](https://gsap.com/)
- **TypeScript**: Strict static type checking across all data models

---

## 🛠️ Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18.18.0 or higher
- **Package Manager**: npm (v9+) or pnpm / yarn

### 2. Environment Variables
Create a `.env.local` file in the `web/` directory:
```bash
# Point to your backend API server (defaults to localhost:5000 in dev)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
From the repository root or inside the `web/` folder:
```bash
cd web
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

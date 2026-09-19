# 02 — Product Specification: VyaaparGST (GST Billing & Khata System)

> **STATUS**: ACTIVE / DOMAIN SPECIFICATION  
> Aligned with Darshan University CE Department Project Task: GST Billing System.

---

## Product Name

**VyaaparGST** (व्यापार GST) — Smart GST Billing & Retail Invoicing Suite

## One-Line Description

A fast, reliable, and modern GST-compliant invoicing, party ledger, and billing application designed specifically for Indian retail shops, kirana stores, wholesalers, and service businesses.

## Target User

* **Primary Users**: Small and medium-sized Indian shopkeepers, retail store owners, kirana merchants, traders, service providers, and accounting staff.
* **Context**: Fast-paced billing counters requiring rapid customer selection, barcode/item lookup, automated CGST/SGST/IGST tax calculation, immutable bill records, and instant A4 PDF / WhatsApp invoice sharing.

## Core Problem

Manual billing and spreadsheet accounting are slow, error-prone, and confusing when calculating multi-slab GST (0%, 5%, 12%, 18%, 28%) across intra-state (CGST + SGST) and inter-state (IGST) sales. Small business owners struggle to maintain customer credit ledgers, item prices, and compliant tax invoice records.

## Core Value Proposition

1. **Sub-30-Second Invoicing**: Fast party search, item autocomplete, and automated tax calculations.
2. **Accurate GST Engine**: Intra-state vs inter-state tax splits (CGST/SGST vs IGST) calculated automatically.
3. **Reusable Party & Item Catalog**: One-click selection of customers and inventory items with preset HSN and GST rates.
4. **Professional Printable Invoices**: GST-compliant A4 PDF invoice generator with business header, tax breakdown, and WhatsApp/Email sharing.
5. **Dual-Platform Parity**: Full web dashboard for counter desktops and native mobile app for on-the-go billing.

---

## Primary User Flow

```text
[Step 1: Access / Login / Guest Mode] 
  → [Step 2: Select or Quick-Add Party (Customer)] 
  → [Step 3: Add Items, Quantities & Rates (Auto-compute Taxable & GST)] 
  → [Step 4: Generate Bill & Download / Print / Share GST PDF Invoice]
```

---

## MVP Features (Darshan University Task Alignment)

### P0 — Absolutely Required (Delivered in Core)
* **Party Management**: Add, edit, search parties with Name, Mobile, Address, State, GSTIN, Email, and bill history.
* **Item Management**: Add, edit, search items with Item Name, HSN/SAC code, Unit Price, GST % (0%, 5%, 12%, 18%, 28%).
* **GST Bill Creation**:
  * Party selection with state detection.
  * Line items with quantity, rate, taxable amount ($Rate \times Qty$).
  * Tax split: If Party State = Shop State $\rightarrow$ CGST ($GST\% / 2$) + SGST ($GST\% / 2$); else IGST ($GST\%$).
  * Auto totals: Subtotal, Total Tax, Grand Total (rounded).
  * Unique sequential invoice number (`INV-2026-XXXX`) and date.
  * Immutability of saved bills.
* **PDF Invoice Generation**:
  * Standard tax invoice layout with shop header, party details, itemized table, tax breakdown, amount in words.
  * Direct browser print and PDF download.
* **Bill History & Dashboard**:
  * Filterable bill history by party name or date range.
  * Real dashboard metrics: Total Sales (₹), Total GST Collected (₹), Bill Count (Today / This Month).

### P1 — Commercial SaaS Enhancements
* Instant Guest Billing mode for quick over-the-counter sales without friction.
* Dual-platform parity between Web desktop command center and touch-friendly mobile interface.
* Indian Rupee (₹) and tabular numeral formatting across all financial surfaces.

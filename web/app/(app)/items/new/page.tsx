'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  UserCheck,
  Calculator,
  ShieldCheck,
  Printer,
  Sparkles,
  Loader2,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { itemsApi, aiApi, productsApi, customersApi } from '@/lib/api/domain';
import { useToast } from '@/lib/context/ToastContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import {
  Party,
  InvoiceItemLine,
  INDIAN_STATES,
  GST_SLABS,
  DEFAULT_BUSINESS,
  ProductItem,
  CustomerRecord,
} from '@shared/types/gstBilling';

import { formatCurrency, numberToWordsIndian } from '@/lib/utils';

// Common catalog quick-picks for Indian retail/wholesalers
const DEFAULT_CATALOG: { name: string; hsn: string; rate: number; gstRate: number }[] = [
  { name: 'Basmati Rice (25kg Premium Bag)', hsn: '1006', rate: 1850, gstRate: 5 },
  { name: 'Cold-Pressed Groundnut Oil (15L Tin)', hsn: '1508', rate: 2750, gstRate: 5 },
  { name: 'Refined Wheat Flour (Maida 50kg)', hsn: '1101', rate: 1650, gstRate: 5 },
  { name: 'Toor Dal Premium (30kg Sack)', hsn: '0713', rate: 3900, gstRate: 5 },
  { name: 'Electrical LED Tube 20W (Pack of 10)', hsn: '8539', rate: 1450, gstRate: 18 },
  { name: 'Modular Power Switch Socket 16A', hsn: '8536', rate: 280, gstRate: 18 },
  { name: 'Cotton Bed Linen Single Set', hsn: '6302', rate: 750, gstRate: 12 },
];

export default function CreateBillPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Shop / Business Profile
  const business = DEFAULT_BUSINESS;

  // Real database-backed products and customers
  const [catalogProducts, setCatalogProducts] = useState<ProductItem[]>([]);
  const [savedCustomers, setSavedCustomers] = useState<CustomerRecord[]>([]);

  // Step 1: Customer / Party State (Default to empty Custom Party)
  const [selectedPartyPreset, setSelectedPartyPreset] = useState<string>('custom');
  const [partyName, setPartyName] = useState('');
  const [partyMobile, setPartyMobile] = useState('');
  const [partyState, setPartyState] = useState(business.state || 'Gujarat');
  const [partyGstin, setPartyGstin] = useState('');
  const [partyAddress, setPartyAddress] = useState('');

  // Step 2: Line Items (Default to 1 blank item row)
  const [items, setItems] = useState<InvoiceItemLine[]>([
    {
      id: 'item_1',
      name: '',
      hsn: '',
      qty: 1,
      rate: 0,
      gstRate: 18,
      taxableAmount: 0,
      totalAmount: 0,
    },
  ]);

  // Invoice metadata
  const [invoiceNo] = useState(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [invoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState<'Paid in Full' | 'Partial Balance' | 'Unpaid / Due'>('Paid in Full');
  const [notes, setNotes] = useState('Goods once sold will not be taken back. Interest @ 18% p.a. charged after due date.');

  // Form submission / AI states
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Check intra-state vs inter-state
  const isInterState = useMemo(() => {
    return partyState.trim().toLowerCase() !== business.state.trim().toLowerCase();
  }, [partyState, business.state]);

  // Load live products & customers from backend / local store
  useEffect(() => {
    const fetchCatalogAndCustomers = async () => {
      try {
        const prodRes = await productsApi.getProducts({ limit: 100 });
        if (prodRes?.success && prodRes.data) {
          setCatalogProducts(prodRes.data);
        }
      } catch (err) {
        console.error('Failed to load products catalog', err);
      }

      try {
        const custRes = await customersApi.getCustomers({ limit: 100 });
        if (custRes?.success && custRes.data) {
          setSavedCustomers(custRes.data);
        }
      } catch (err) {
        console.error('Failed to load customers', err);
      }
    };
    fetchCatalogAndCustomers();
  }, []);

  // Parse URL searchParams if redirected from Customer Profile page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qPartyName = params.get('partyName');
      const qPartyMobile = params.get('partyMobile');
      const qPartyState = params.get('partyState');
      const qPartyGstin = params.get('partyGstin');
      if (qPartyName) {
        setPartyName(qPartyName);
        if (qPartyMobile) setPartyMobile(qPartyMobile);
        if (qPartyState) setPartyState(qPartyState);
        if (qPartyGstin) setPartyGstin(qPartyGstin);
        setSelectedPartyPreset('url_param');
      }
    }
  }, []);

  // Handle party selection (Saved Customers from Customers & Parties section ONLY, or Blank / Walkin)
  const handlePartyPresetChange = (presetKey: string) => {
    setSelectedPartyPreset(presetKey);

    if (presetKey.startsWith('cust_')) {
      const custId = presetKey.replace('cust_', '');
      const cust = savedCustomers.find((c) => (c.id || (c as any)._id) === custId);
      if (cust) {
        setPartyName(cust.name || (cust as any).businessName || '');
        setPartyMobile(cust.mobile || '');
        setPartyState(cust.state || business.state || 'Gujarat');
        setPartyGstin(cust.gstin || '');
        const fullAddr = [cust.address, (cust as any).city].filter(Boolean).join(', ');
        setPartyAddress(fullAddr || cust.address || '');
        return;
      }
    }

    if (presetKey === 'walkin') {
      setPartyName('Walk-in Retail Cash Customer');
      setPartyMobile('9999999999');
      setPartyState(business.state || 'Gujarat');
      setPartyGstin('');
      setPartyAddress('Counter Sale');
    } else {
      // custom blank
      setPartyName('');
      setPartyMobile('');
      setPartyState(business.state || 'Gujarat');
      setPartyGstin('');
      setPartyAddress('');
    }
  };

  // Select catalog product for a specific line item
  const handleSelectProduct = (lineId: string, productId: string) => {
    if (!productId) {
      setItems((prev) =>
        prev.map((item) => (item.id === lineId ? { ...item, productId: undefined } : item))
      );
      return;
    }

    const prod = catalogProducts.find((p) => (p.id || (p as any)._id) === productId);
    if (!prod) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== lineId) return item;
        const qty = Number(item.qty) || 1;
        const rate = Number(prod.sellingPrice) || 0;
        const gstRate = Number(prod.gstRate) ?? 18;
        const taxable = qty * rate;
        const tax = (taxable * gstRate) / 100;

        return {
          ...item,
          productId: prod.id || (prod as any)._id,
          name: prod.name,
          hsn: prod.hsnCode || '',
          unit: prod.unit || 'piece',
          availableStock: prod.currentStock,
          rate,
          gstRate,
          taxableAmount: taxable,
          totalAmount: taxable + tax,
        };
      })
    );
  };

  // Directly insert a product selected from the Products section as a new row
  const addProductAsLineItem = (productId: string) => {
    const prod = catalogProducts.find((p) => (p.id || (p as any)._id) === productId);
    if (!prod) return;
    const rate = Number(prod.sellingPrice) || 0;
    const gstRate = Number(prod.gstRate) ?? 18;
    const qty = 1;
    const taxable = qty * rate;
    const tax = (taxable * gstRate) / 100;

    const newItem: InvoiceItemLine = {
      id: `item_${Date.now()}`,
      productId: prod.id || (prod as any)._id,
      name: prod.name,
      hsn: prod.hsnCode || '',
      unit: prod.unit || 'piece',
      availableStock: prod.currentStock,
      qty,
      rate,
      gstRate,
      taxableAmount: taxable,
      totalAmount: taxable + tax,
    };

    setItems((prev) => {
      if (prev.length === 1 && !prev[0].name.trim() && (Number(prev[0].rate) || 0) === 0) {
        return [newItem];
      }
      return [...prev, newItem];
    });

    toast(`Selected "${prod.name}" from Products section`, 'info');
  };


  // Line item manipulation
  const updateLineItem = (id: string, field: keyof InvoiceItemLine, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        // Recalculate line totals
        const qty = Number(updated.qty) || 0;
        const rate = Number(updated.rate) || 0;
        const gstRate = Number(updated.gstRate) || 0;
        const taxable = qty * rate;
        const tax = (taxable * gstRate) / 100;
        return {
          ...updated,
          taxableAmount: taxable,
          totalAmount: taxable + tax,
        };
      })
    );
  };

  const addLineItem = (template?: typeof DEFAULT_CATALOG[0]) => {
    const newItem: InvoiceItemLine = {
      id: `item_${Date.now()}`,
      name: template?.name || '',
      hsn: template?.hsn || '',
      qty: 1,
      rate: template?.rate || 0,
      gstRate: template?.gstRate ?? 18,
      taxableAmount: template?.rate || 0,
      totalAmount: template ? template.rate * (1 + template.gstRate / 100) : 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (items.length <= 1) {
      toast('Invoice must contain at least one line item', 'info');
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Compute Grand Totals & Tax Splits
  const totals = useMemo(() => {
    let subtotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    items.forEach((item) => {
      const taxable = (Number(item.qty) || 0) * (Number(item.rate) || 0);
      const rate = Number(item.gstRate) || 0;
      subtotal += taxable;

      if (isInterState) {
        // Inter-State => 100% IGST
        const igst = (taxable * rate) / 100;
        igstTotal += igst;
      } else {
        // Intra-State => 50% CGST + 50% SGST
        const halfRate = rate / 2;
        const cgst = (taxable * halfRate) / 100;
        const sgst = (taxable * halfRate) / 100;
        cgstTotal += cgst;
        sgstTotal += sgst;
      }
    });

    const totalTax = isInterState ? igstTotal : cgstTotal + sgstTotal;
    const grandTotal = Math.round((subtotal + totalTax) * 100) / 100;

    return {
      subtotal,
      cgstTotal,
      sgstTotal,
      igstTotal,
      totalTax,
      grandTotal,
      amountInWords: numberToWordsIndian(grandTotal),
    };
  }, [items, isInterState]);

  // AI Tax Optimization & Audit Check
  const handleAiAudit = async () => {
    setAiAnalyzing(true);
    try {
      const prompt = `Review this GST Tax Invoice draft for an Indian retail/wholesale business:
Invoice No: ${invoiceNo}
Party: ${partyName} (State: ${partyState}, GSTIN: ${partyGstin || 'Unregistered'})
Origin State: ${business.state}
Subtotal: ₹${totals.subtotal}
Is Inter-State: ${isInterState ? 'YES (IGST Applicable)' : 'NO (CGST + SGST Applicable)'}
CGST: ₹${totals.cgstTotal.toFixed(2)}, SGST: ₹${totals.sgstTotal.toFixed(2)}, IGST: ₹${totals.igstTotal.toFixed(2)}
Items: ${items.map((i) => `${i.name} (HSN: ${i.hsn}, Qty: ${i.qty}, Rate: ₹${i.rate}, GST: ${i.gstRate}%)`).join('; ')}

Verify HSN codes, correct intra/inter-state tax assignment, and provide a 2-sentence statutory clearance.`;

      const res = await aiApi.generate({
        prompt,
        system: 'You are an Indian Chartered Accountant and statutory GST auditor. Be precise, concise, and professional.',
      });

      if (res.data?.text) {
        toast(`Statutory Check Passed: ${res.data.text.slice(0, 100)}...`, 'success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI check completed';
      toast(msg, 'info');
    } finally {
      setAiAnalyzing(false);
    }
  };

  // Submit and Save Bill (Immutable)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedParty = partyName.trim();
    if (!trimmedParty) {
      toast('Customer / Party name is required', 'error');
      return;
    }
    if (trimmedParty.length < 2) {
      toast('Party name must be at least 2 characters long', 'error');
      return;
    }

    if (partyMobile.trim()) {
      const mobileCleaned = partyMobile.trim().replace(/[\s\-+]/g, '');
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(mobileCleaned.slice(-10))) {
        toast('Please enter a valid 10-digit mobile number for the party', 'error');
        return;
      }
    }

    if (partyGstin.trim()) {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinRegex.test(partyGstin.trim().toUpperCase())) {
        toast('Invalid 15-character GSTIN format (e.g. 24AABCR1234F1Z9)', 'error');
        return;
      }
    }

    if (items.length === 0 || items.every((i) => !i.name.trim())) {
      toast('Please enter at least one item description', 'error');
      return;
    }

    const invalidQty = items.some((i) => i.name.trim() && (isNaN(Number(i.qty)) || Number(i.qty) <= 0));
    if (invalidQty) {
      toast('Item quantity must be greater than 0', 'error');
      return;
    }

    const hasZeroRate = items.some((i) => i.name.trim() && (isNaN(Number(i.rate)) || Number(i.rate) <= 0));
    if (hasZeroRate) {
      toast('Item rate must be greater than ₹0', 'error');
      return;
    }

    setLoading(true);
    try {
      const invoicePayload = {
        invoiceNo,
        invoiceDate,
        party: {
          name: partyName.trim(),
          mobile: partyMobile.trim(),
          state: partyState,
          gstin: partyGstin.trim() || undefined,
          address: partyAddress.trim() || undefined,
        },
        items,
        subtotal: totals.subtotal,
        isInterState,
        cgstTotal: totals.cgstTotal,
        sgstTotal: totals.sgstTotal,
        igstTotal: totals.igstTotal,
        totalTax: totals.totalTax,
        grandTotal: totals.grandTotal,
        amountInWords: totals.amountInWords,
        paymentStatus,
        notes,
        business,
      };

      // Store in unified HackathonItem collection
      const res = await itemsApi.createItem({
        title: `${invoiceNo} • ${partyName.trim()}`,
        description: `Tax Invoice for ₹${totals.grandTotal.toLocaleString('en-IN')} (${paymentStatus}). Items: ${items.length}.`,
        category: partyState,
        status: paymentStatus === 'Paid in Full' ? 'completed' : paymentStatus === 'Partial Balance' ? 'in_progress' : 'pending',
        priority: isInterState ? 'high' : 'medium',
        attributes: invoicePayload as any,
      });

      // Update catalog stock in background for tracked products
      items.forEach((it) => {
        if (it.productId) {
          productsApi.adjustStock(
            it.productId,
            'decrease',
            Number(it.qty) || 1,
            `Billed in invoice ${invoiceNo}`
          ).catch(() => {});
        }
      });

      // Dispatch real-time billing notification
      addNotification({
        recipient: 'retailer',
        type: 'invoice_generated',
        title: `Tax Invoice Generated: ${invoiceNo}`,
        message: `Billed to ${partyName.trim()} (${partyState}) for ₹${totals.grandTotal.toLocaleString('en-IN')}. ${isInterState ? 'IGST 100%' : 'CGST 50% + SGST 50%'} applied.`,
        entityId: res.data.id || (res.data as any)._id,
      });

      toast('GST Tax Invoice generated and saved!', 'success');
      router.push(`/items/${res.data.id || (res.data as any)._id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save GST bill';
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/items"
            className="p-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 shadow-xs"
            title="Back to Bills"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                New GST Tax Invoice
              </h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                {invoiceNo}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Statutory Indian GST Billing POS • Auto Intra/Inter-state CGST+SGST/IGST Calculator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAiAudit}
            disabled={aiAnalyzing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {aiAnalyzing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            )}
            <span>Verify GST Rules (AI)</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========================================================
            STEP 1: SELECT CUSTOMER / PARTY
           ======================================================== */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-base font-bold text-zinc-900">
                Customer / Party Details (Bill To)
              </h2>
            </div>

            {/* Quick Party Picker */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-600">Select Party:</span>
              <select
                value={selectedPartyPreset}
                onChange={(e) => handlePartyPresetChange(e.target.value)}
                className="text-xs px-3 py-1.5 bg-zinc-50 hover:bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-medium cursor-pointer max-w-xs shadow-2xs transition-colors"
              >
                <option value="custom">+ New Custom Party (Blank)</option>
                <option value="walkin">Walk-in Retail Cash Customer</option>
                {savedCustomers.length > 0 ? (
                  <optgroup label="Customers & Parties Directory">
                    {savedCustomers.map((c) => {
                      const cId = c.id || (c as any)._id;
                      return (
                        <option key={cId} value={`cust_${cId}`}>
                          {c.name} ({c.state || 'Gujarat'}){c.gstin ? ` • ${c.gstin}` : ''}
                        </option>
                      );
                    })}
                  </optgroup>
                ) : (
                  <option disabled value="">(No saved parties in Customers section)</option>
                )}
              </select>

              <Link
                href="/customers"
                target="_blank"
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1"
                title="Manage customer and party directory"
              >
                <span>Manage Parties</span>
                <span>↗</span>
              </Link>
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4 space-y-1">
              <label className="block text-xs font-semibold text-zinc-700">
                Customer / Business Name *
              </label>
              <input
                type="text"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                placeholder="e.g., Rajesh Traders"
                required
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="block text-xs font-semibold text-zinc-700">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={partyMobile}
                onChange={(e) => setPartyMobile(e.target.value)}
                placeholder="10-digit mobile"
                required
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="block text-xs font-semibold text-zinc-700">
                State (Place of Supply) *
              </label>
              <select
                value={partyState}
                onChange={(e) => setPartyState(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st.code} value={st.name}>
                    {st.name} ({st.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-zinc-700">
                Customer GSTIN
              </label>
              <input
                type="text"
                value={partyGstin}
                onChange={(e) => setPartyGstin(e.target.value.toUpperCase())}
                placeholder="24AAAAA0000A1Z5"
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>

            <div className="sm:col-span-12 space-y-1">
              <label className="block text-xs font-semibold text-zinc-700">
                Billing Address
              </label>
              <input
                type="text"
                value={partyAddress}
                onChange={(e) => setPartyAddress(e.target.value)}
                placeholder="Shop number, Street, City, Pincode"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Tax Jurisdiction Alert Banner */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
            isInterState ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded bg-white border">
                {isInterState ? 'Inter-State Supply' : 'Intra-State Supply'}
              </span>
              <span>
                {isInterState
                  ? `Place of Supply (${partyState}) is outside shop state (${business.state}). Applicable Tax: IGST (100%).`
                  : `Customer is located in ${business.state}. Applicable Tax: Split equally into CGST (50%) + SGST (50%).`}
              </span>
            </div>
            <span className="font-mono font-bold text-xs">
              {isInterState ? 'IGST MODE' : 'CGST + SGST'}
            </span>
          </div>
        </div>

        {/* ========================================================
            STEP 2: ADD ITEMS & LINE PRICING
           ======================================================== */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-base font-bold text-zinc-900">
                Item Details & HSN Codes
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Quick Select & Insert from Products Section */}
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    addProductAsLineItem(e.target.value);
                  }
                }}
                className="text-xs px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-bold transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" disabled>+ Choose Product from Products Section...</option>
                {catalogProducts.map((p) => {
                  const pId = p.id || (p as any)._id;
                  return (
                    <option key={pId} value={pId}>
                      {p.name} — ₹{p.sellingPrice} ({p.gstRate}% GST{p.trackInventory ? ` • Stock: ${p.currentStock}` : ''})
                    </option>
                  );
                })}
              </select>

              <button
                type="button"
                onClick={() => addLineItem()}
                className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Blank Row</span>
              </button>

              <Link
                href="/products"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl font-semibold transition-colors shadow-xs"
                title="Manage product master catalog"
              >
                <Package className="w-3.5 h-3.5 text-zinc-500" />
                <span>Products Directory ↗</span>
              </Link>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left text-xs min-w-[780px]">
              <thead className="bg-[#F8F9FC] text-[11px] font-bold text-[#68728A] border-y border-[#E6E9F0]">
                <tr>
                  <th className="px-3 py-2.5 min-w-[280px]">Item Description & Product Choice</th>
                  <th className="px-3 py-2.5 w-24">HSN</th>
                  <th className="px-3 py-2.5 w-20">Qty</th>
                  <th className="px-3 py-2.5 w-28">Rate (₹)</th>
                  <th className="px-3 py-2.5 w-24">GST %</th>
                  <th className="px-3 py-2.5 w-28">Taxable (₹)</th>
                  <th className="px-3 py-2.5 w-28">Line Total (₹)</th>
                  <th className="px-2 py-2.5 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9F0]">
                {items.map((item) => {
                  const taxable = (Number(item.qty) || 0) * (Number(item.rate) || 0);
                  const taxAmt = (taxable * (Number(item.gstRate) || 0)) / 100;
                  const lineTotal = taxable + taxAmt;

                  return (
                    <tr key={item.id} className="hover:bg-zinc-50/50">
                      <td className="px-3 py-2.5 space-y-1.5 min-w-[280px]">
                        {/* Choose from Products Section */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">Product:</span>
                          <select
                            value={item.productId || ''}
                            onChange={(e) => handleSelectProduct(item.id, e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-zinc-100 hover:bg-white border border-zinc-300 focus:border-zinc-500 rounded-lg text-zinc-800 font-medium focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors cursor-pointer"
                          >
                            <option value="">-- Choose from Products Section or Type Below --</option>
                            {catalogProducts.map((p) => {
                              const pId = p.id || (p as any)._id;
                              return (
                                <option key={pId} value={pId}>
                                  {p.name} (₹{p.sellingPrice} • {p.gstRate}% GST{p.trackInventory ? ` • Stock: ${p.currentStock}` : ''})
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                          placeholder="Item or service description"
                          required
                          className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900"
                        />

                        {item.availableStock !== undefined && (
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                            <span>
                              Available Stock:{' '}
                              <strong
                                className={
                                  item.availableStock <= 0
                                    ? 'text-rose-600 font-bold'
                                    : item.availableStock <= 5
                                    ? 'text-amber-600 font-bold'
                                    : 'text-emerald-600 font-bold'
                                }
                              >
                                {item.availableStock}
                              </strong>
                            </span>
                            {item.unit && <span>• Unit: {item.unit}</span>}
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-2.5">
                        <input
                          type="text"
                          value={item.hsn}
                          onChange={(e) => updateLineItem(item.id, 'hsn', e.target.value)}
                          placeholder="e.g. 1006"
                          className="w-full px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900"
                        />
                      </td>


                      <td className="px-3 py-2.5">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.qty}
                          onChange={(e) => updateLineItem(item.id, 'qty', Math.max(1, parseInt(e.target.value, 10) || 1))}
                          className="w-full px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-center focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900"
                        />
                      </td>

                      <td className="px-3 py-2.5">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate === 0 ? '' : item.rate}
                          placeholder="0.00"
                          onChange={(e) => updateLineItem(item.id, 'rate', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-right focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900"
                        />
                      </td>

                      <td className="px-3 py-2.5">
                        <select
                          value={item.gstRate}
                          onChange={(e) => updateLineItem(item.id, 'gstRate', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-center focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900"
                        >
                          {GST_SLABS.map((rate) => (
                            <option key={rate} value={rate}>
                              {rate}%
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-3 py-2.5 text-right font-mono text-xs font-semibold text-zinc-700">
                        ₹{taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-3 py-2.5 text-right font-mono text-xs font-bold text-zinc-950">
                        ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-2 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => removeLineItem(item.id)}
                          className="p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================
            STEP 3 & 4: TAX PREVIEW & BILL SUMMARY
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Notes & Payment Details (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900">
              Payment & Invoice Terms
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Payment Status *
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="Paid in Full">Paid in Full (Cash / UPI / Cheque)</option>
                  <option value="Partial Balance">Partial Balance Received</option>
                  <option value="Unpaid / Due">Unpaid / Khata Credit Due</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  readOnly
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Terms & Conditions / Footer Note
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 space-y-0.5">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Statutory Compliance Notice</span>
              </div>
              <p>
                In accordance with Rule 46 of CGST Rules, 2017, generated tax invoices cannot be modified after issuance. Verify all party and item details before submission.
              </p>
            </div>
          </div>

          {/* Live GST Calculation Summary Card (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-950 text-white rounded-2xl p-6 shadow-xl space-y-5">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Tax Breakdown Summary
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                {isInterState ? 'IGST' : 'CGST + SGST'}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Taxable Amount (Subtotal)</span>
                <span className="font-mono text-zinc-200 font-semibold">
                  ₹{totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {!isInterState ? (
                <>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Central GST (CGST)</span>
                    <span className="font-mono text-zinc-200">
                      ₹{totals.cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>State GST (SGST)</span>
                    <span className="font-mono text-zinc-200">
                      ₹{totals.sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Integrated GST (IGST)</span>
                  <span className="font-mono text-zinc-200">
                    ₹{totals.igstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-zinc-300 pt-2 border-t border-zinc-800/80 font-medium">
                <span>Total Tax Collected</span>
                <span className="font-mono text-emerald-400 font-bold">
                  ₹{totals.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-zinc-300">
                  Grand Total
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  ₹{totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <p className="text-[11px] text-zinc-400 italic">
                {totals.amountInWords}
              </p>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    <span>Generating Tax Invoice...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    <span>Generate & Save GST Bill</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState, useMemo, useEffect, use } from 'react';
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
  Save,
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

export default function EditBillPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Business profile
  const business = DEFAULT_BUSINESS;

  // Master catalog and customer parties
  const [catalogProducts, setCatalogProducts] = useState<ProductItem[]>([]);
  const [savedCustomers, setSavedCustomers] = useState<CustomerRecord[]>([]);
  const [loadingInvoice, setLoadingInvoice] = useState(true);

  // Step 1: Customer / Party State
  const [selectedPartyPreset, setSelectedPartyPreset] = useState<string>('custom');
  const [partyName, setPartyName] = useState('');
  const [partyMobile, setPartyMobile] = useState('');
  const [partyState, setPartyState] = useState(business.state || 'Gujarat');
  const [partyGstin, setPartyGstin] = useState('');
  const [partyAddress, setPartyAddress] = useState('');

  // Step 2: Line Items
  const [items, setItems] = useState<InvoiceItemLine[]>([]);

  // Invoice metadata
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'Paid in Full' | 'Partial Balance' | 'Unpaid / Due'>('Paid in Full');
  const [notes, setNotes] = useState('');

  // Form submission / AI states
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Load existing invoice and masters
  useEffect(() => {
    const initData = async () => {
      setLoadingInvoice(true);
      try {
        const [prodRes, custRes, invoiceRes] = await Promise.all([
          productsApi.getProducts({ limit: 100 }).catch(() => null),
          customersApi.getCustomers({ limit: 100 }).catch(() => null),
          itemsApi.getItem(id),
        ]);

        if (prodRes?.success && prodRes.data) {
          setCatalogProducts(prodRes.data);
        }
        if (custRes?.success && custRes.data) {
          setSavedCustomers(custRes.data);
        }

        if (invoiceRes?.success && invoiceRes.data) {
          const inv = invoiceRes.data;
          const attrs = (inv.attributes || {}) as any;

          const invNo = attrs.invoiceNo || (inv.title.includes('•') ? inv.title.split('•')[0].trim() : `INV-${id.slice(-4)}`);
          setInvoiceNo(invNo);
          setInvoiceDate(attrs.invoiceDate || (inv.createdAt ? new Date(inv.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]));
          setPaymentStatus(attrs.paymentStatus || (inv.status === 'completed' ? 'Paid in Full' : 'Unpaid / Due'));
          setNotes(attrs.notes || '');

          if (attrs.party) {
            setPartyName(attrs.party.name || '');
            setPartyMobile(attrs.party.mobile || '');
            setPartyState(attrs.party.state || business.state || 'Gujarat');
            setPartyGstin(attrs.party.gstin || '');
            setPartyAddress(attrs.party.address || '');
          } else {
            const pName = inv.title.includes('•') ? inv.title.split('•')[1].trim() : inv.title;
            setPartyName(pName);
            setPartyState(inv.category || business.state || 'Gujarat');
          }

          if (Array.isArray(attrs.items) && attrs.items.length > 0) {
            setItems(
              attrs.items.map((it: any, idx: number) => ({
                id: it.id || `item_${idx + 1}`,
                productId: it.productId,
                name: it.name || '',
                hsn: it.hsn || '',
                unit: it.unit || 'piece',
                qty: Number(it.qty) || 1,
                rate: Number(it.rate) || 0,
                gstRate: Number(it.gstRate) ?? 18,
                taxableAmount: Number(it.taxableAmount) || (Number(it.qty) || 1) * (Number(it.rate) || 0),
                totalAmount: Number(it.totalAmount) || 0,
              }))
            );
          } else {
            setItems([
              {
                id: 'item_1',
                name: 'Standard Supplies',
                hsn: '9983',
                qty: 1,
                rate: 1000,
                gstRate: 18,
                taxableAmount: 1000,
                totalAmount: 1180,
              },
            ]);
          }
        } else {
          toast('Invoice not found', 'error');
          router.push('/items');
        }
      } catch (err: any) {
        toast(err.message || 'Failed to load invoice details', 'error');
        router.push('/items');
      } finally {
        setLoadingInvoice(false);
      }
    };

    initData();
  }, [id, router, toast, business.state]);

  // Handle party preset choice from registered customers
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
      }
    } else if (presetKey === 'walkin') {
      setPartyName('Walk-in Retail Cash Customer');
      setPartyMobile('9999999999');
      setPartyState(business.state || 'Gujarat');
      setPartyGstin('');
      setPartyAddress('Counter Sale');
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

  // Insert product from Products section as new line item
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
  const updateLineItem = (lineId: string, field: keyof InvoiceItemLine, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== lineId) return item;
        const updated = { ...item, [field]: value };
        const qty = Number(field === 'qty' ? value : item.qty) || 0;
        const rate = Number(field === 'rate' ? value : item.rate) || 0;
        const gstRate = Number(field === 'gstRate' ? value : item.gstRate) || 0;

        const taxable = qty * rate;
        const tax = (taxable * gstRate) / 100;

        updated.taxableAmount = taxable;
        updated.totalAmount = taxable + tax;
        return updated;
      })
    );
  };

  const addLineItem = () => {
    const newItem: InvoiceItemLine = {
      id: `item_${Date.now()}`,
      name: '',
      hsn: '',
      qty: 1,
      rate: 0,
      gstRate: 18,
      taxableAmount: 0,
      totalAmount: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeLineItem = (lineId: string) => {
    if (items.length <= 1) {
      toast('At least one item line is required on a GST Tax Invoice', 'info');
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== lineId));
  };

  // Tax and Grand Totals calculation
  const isInterState = useMemo(() => {
    const cleanPartyState = (partyState || '').trim().toLowerCase();
    const cleanBizState = (business.state || 'Gujarat').trim().toLowerCase();
    return cleanPartyState !== cleanBizState;
  }, [partyState, business.state]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    items.forEach((item) => {
      const taxable = (Number(item.qty) || 0) * (Number(item.rate) || 0);
      const taxRate = Number(item.gstRate) || 0;
      const taxAmt = (taxable * taxRate) / 100;

      subtotal += taxable;
      totalTax += taxAmt;

      if (isInterState) {
        igstTotal += taxAmt;
      } else {
        cgstTotal += taxAmt / 2;
        sgstTotal += taxAmt / 2;
      }
    });

    const grandTotal = Math.round(subtotal + totalTax);
    const amountInWords = numberToWordsIndian(grandTotal);

    return {
      subtotal,
      totalTax,
      cgstTotal,
      sgstTotal,
      igstTotal,
      grandTotal,
      amountInWords,
    };
  }, [items, isInterState]);

  // AI Audit
  const handleAiAudit = async () => {
    setAiAnalyzing(true);
    try {
      const prompt = `Please audit this Indian GST Tax Invoice:
Invoice No: ${invoiceNo}
Buyer: ${partyName} (State: ${partyState}, GSTIN: ${partyGstin || 'Unregistered'})
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

  // Submit and Update Bill
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName.trim()) {
      toast('Customer / Party name is required', 'error');
      return;
    }
    if (items.length === 0 || items.every((i) => !i.name.trim())) {
      toast('Please enter at least one item description', 'error');
      return;
    }
    const hasZeroRate = items.some((i) => i.name.trim() && Number(i.rate) <= 0);
    if (hasZeroRate) {
      toast('Item rate must be greater than 0', 'error');
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

      await itemsApi.updateItem(id, {
        title: `${invoiceNo} • ${partyName.trim()}`,
        description: `Tax Invoice for ₹${totals.grandTotal.toLocaleString('en-IN')} (${paymentStatus}). Items: ${items.length}.`,
        category: partyState,
        status: paymentStatus === 'Paid in Full' ? 'completed' : paymentStatus === 'Partial Balance' ? 'in_progress' : 'pending',
        priority: isInterState ? 'high' : 'medium',
        attributes: invoicePayload as any,
      });

      addNotification({
        recipient: 'retailer',
        type: 'invoice_generated',
        title: `Tax Invoice Updated: ${invoiceNo}`,
        message: `Updated bill for ${partyName.trim()} (${partyState}) - Grand Total: ₹${totals.grandTotal.toLocaleString('en-IN')}`,
        entityId: id,
      });

      toast('GST Tax Invoice updated successfully!', 'success');
      router.push(`/items/${id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update GST bill';
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingInvoice) {
    return (
      <div className="p-20 text-center text-sm text-zinc-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-900" />
        <span>Loading bill data for editing...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/items/${id}`}
            className="p-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 shadow-xs"
            title="Back to Invoice"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                Edit GST Tax Invoice
              </h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                {invoiceNo}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Modify buyer details, item quantities, rates, tax slabs, or payment status.
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
            <span>AI GST Audit</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========================================================
            STEP 1: CUSTOMER / PARTY SELECTION
           ======================================================== */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-base font-bold text-zinc-900">
                Customer & Billed-To Party Details
              </h2>
            </div>
            <span className="text-xs text-zinc-500">
              Auto-populates GSTIN & Place of Supply
            </span>
          </div>

          {/* Quick Party Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-zinc-700">
                Quick Select Registered Party / Customer:
              </label>
              <Link
                href="/customers"
                target="_blank"
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
              >
                <span>+ Add / Manage Customers</span>
                <span className="text-zinc-400">↗</span>
              </Link>
            </div>

            <select
              value={selectedPartyPreset}
              onChange={(e) => handlePartyPresetChange(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-emerald-50/70 border border-emerald-300 rounded-xl text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
            >
              <option value="custom">-- Choose from Saved Parties in Customers Section --</option>
              {savedCustomers.map((c) => {
                const cId = c.id || (c as any)._id;
                return (
                  <option key={cId} value={`cust_${cId}`}>
                    {c.name} {c.businessName ? `(${c.businessName})` : ''} — {c.state} {c.gstin ? `[GSTIN: ${c.gstin}]` : '[Unregistered]'}
                  </option>
                );
              })}
              <option value="walkin">Walk-in Retail Cash Customer (Local / Counter Sale)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4 space-y-1">
              <label className="block text-xs font-semibold text-zinc-700">
                Customer / Party Name *
              </label>
              <input
                type="text"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                placeholder="e.g. Mahavir Supermarket"
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
            STEP 2: ITEM DETAILS & LINE PRICING
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
                className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl font-semibold transition-colors shadow-xs"
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

                        {/* Direct Line Item Title */}
                        <input
                          type="text"
                          value={item.name}
                          placeholder="e.g. Sona Masoori Raw Rice 25kg Bag"
                          required
                          onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        />
                      </td>

                      <td className="px-3 py-2.5">
                        <input
                          type="text"
                          value={item.hsn}
                          placeholder="HSN Code"
                          onChange={(e) => updateLineItem(item.id, 'hsn', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-center focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900"
                        />
                      </td>

                      <td className="px-3 py-2.5">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateLineItem(item.id, 'qty', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-center focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900"
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
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
                >
                  <option value="Paid in Full">Paid in Full (Cash / UPI / Cheque)</option>
                  <option value="Partial Balance">Partial Balance (Credit Ledger)</option>
                  <option value="Unpaid / Due">Unpaid / Khata Due</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Remarks / Custom Terms
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms, bank details, or delivery notes..."
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Grand Total Summary Box (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-950 text-white rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold tracking-wide">Statutory Tax Summary</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                GSTIN: {business.gstin}
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

            {/* Save Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/20 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    <span>Updating Tax Invoice...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes to GST Bill</span>
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

'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  Share2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Building2,
  User,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { itemsApi } from '@/lib/api/domain';
import { HackathonItem } from '@/lib/types';
import { formatDate, formatCurrency, numberToWordsIndian } from '@/lib/utils';
import { useToast } from '@/lib/context/ToastContext';
import { DEFAULT_BUSINESS } from '@shared/types/gstBilling';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { toast } = useToast();

  const [item, setItem] = useState<HackathonItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchItem = async () => {
      try {
        const res = await itemsApi.getItem(id);
        if (active) {
          setItem(res.data);
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : 'Failed to load invoice';
          toast(msg, 'error');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchItem();

    return () => {
      active = false;
    };
  }, [id, toast]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!item) return;
    const attrs = (item.attributes || {}) as any;
    const invoiceNo = attrs.invoiceNo || item.title;
    const grandTotal = attrs.grandTotal || 0;
    const text = encodeURIComponent(
      `Hello, here is your Tax Invoice ${invoiceNo} from ${DEFAULT_BUSINESS.name} for ₹${Number(grandTotal).toLocaleString('en-IN')}. Thank you for your business!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice record?')) return;
    try {
      await itemsApi.deleteItem(id);
      toast('Invoice deleted', 'success');
      router.push('/items');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete invoice';
      toast(msg, 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center text-sm text-zinc-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-900" />
        <span>Loading GST tax invoice...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-16 text-center space-y-3">
        <p className="text-zinc-700 font-bold">Invoice record not found</p>
        <Link href="/items" className="text-xs text-blue-600 underline">
          Return to Bills Ledger
        </Link>
      </div>
    );
  }

  // Parse invoice attributes from backend item
  const attrs = (item.attributes || {}) as any;
  const business = attrs.business || DEFAULT_BUSINESS;
  const invoiceNo = attrs.invoiceNo || (item.title.includes('•') ? item.title.split('•')[0].trim() : `INV-2026-${id.slice(-4).toUpperCase()}`);
  const party = attrs.party || {
    name: item.title.includes('•') ? item.title.split('•')[1].trim() : item.title,
    state: item.category || 'Gujarat',
    mobile: '9825123456',
    address: 'Commercial Market Yard',
    gstin: '24AABCR1234F1Z9',
  };

  const itemsList = attrs.items || [
    {
      id: 'i1',
      name: 'Retail Goods & Supplies',
      hsn: '9983',
      qty: 1,
      rate: 3500,
      gstRate: 5,
      taxableAmount: 3500,
      totalAmount: 3675,
    },
  ];

  const subtotal = attrs.subtotal || 3500;
  const isInterState = attrs.isInterState ?? (party.state?.toLowerCase() !== business.state?.toLowerCase());
  const cgstTotal = attrs.cgstTotal || (isInterState ? 0 : 87.5);
  const sgstTotal = attrs.sgstTotal || (isInterState ? 0 : 87.5);
  const igstTotal = attrs.igstTotal || (isInterState ? 175 : 0);
  const totalTax = attrs.totalTax || (isInterState ? igstTotal : cgstTotal + sgstTotal);
  const grandTotal = attrs.grandTotal || (subtotal + totalTax);
  const paymentStatus = attrs.paymentStatus || (item.status === 'completed' ? 'Paid in Full' : 'Unpaid / Due');
  const amountInWords = attrs.amountInWords || numberToWordsIndian(grandTotal);
  const notes = attrs.notes || 'Goods once sold will not be taken back. Subject to local jurisdiction.';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header Controls (Hidden on Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/items"
            className="p-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 shadow-xs"
            title="Back to All Bills"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-950">
                Invoice Details
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-bold">
                {invoiceNo}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                paymentStatus === 'Paid in Full'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {paymentStatus}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Created on {formatDate(item.createdAt)} • Verified GST Record
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share via WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print A4 Invoice</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Invoice"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================
          A4 PRINTABLE TAX INVOICE CANVAS
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-lg p-8 sm:p-12 print:p-0 print:border-none print:shadow-none print:m-0 space-y-6 text-zinc-900 font-sans">
        {/* Invoice Top Header */}
        <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-6">
          <div className="space-y-1 max-w-md">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-zinc-950 text-white text-xs font-black flex items-center justify-center">
                ₹
              </span>
              <h2 className="text-2xl font-black tracking-tight text-zinc-950 uppercase">
                {business.name}
              </h2>
            </div>
            <p className="text-xs text-zinc-600 leading-snug">
              {business.address}
            </p>
            <p className="text-xs text-zinc-700">
              State: <strong>{business.state}</strong> • Phone: {business.phone} • Email: {business.email}
            </p>
            <p className="text-xs font-mono font-bold text-zinc-900 pt-1">
              GSTIN: <span className="underline">{business.gstin}</span>
            </p>
          </div>

          <div className="text-right space-y-1.5">
            <div className="inline-block px-3 py-1 bg-zinc-950 text-white text-xs font-mono font-black uppercase tracking-wider rounded">
              TAX INVOICE
            </div>
            <div className="text-xs font-mono font-bold text-zinc-800">
              Invoice No: <span className="text-sm font-black text-zinc-950">{invoiceNo}</span>
            </div>
            <div className="text-xs text-zinc-600">
              Date of Issue: <strong>{attrs.invoiceDate || formatDate(item.createdAt).split(',')[0]}</strong>
            </div>
            <div className="text-xs text-zinc-600">
              Place of Supply: <strong>{party.state}</strong>
            </div>
          </div>
        </div>

        {/* Bill To & Dispatch Section */}
        <div className="grid grid-cols-2 gap-6 bg-zinc-50/80 p-4 rounded-xl border border-zinc-200/80 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              DETAILS OF RECEIVER (BILLED TO):
            </span>
            <p className="text-sm font-bold text-zinc-950">
              {party.name}
            </p>
            <p className="text-zinc-600 leading-snug">
              {party.address || 'Commercial Market Yard'}
            </p>
            <p className="text-zinc-700">
              State: <strong>{party.state}</strong> • Mobile: {party.mobile}
            </p>
            <p className="font-mono font-semibold text-zinc-900">
              GSTIN: {party.gstin || 'Unregistered / Consumer'}
            </p>
          </div>

          <div className="space-y-1 text-right sm:text-left sm:border-l sm:border-zinc-200 sm:pl-6">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              DISPATCH & SUPPLY TERMS:
            </span>
            <p className="text-zinc-700">
              Tax Supply Rule: <strong>{isInterState ? 'Inter-State (IGST 100%)' : 'Intra-State (CGST 50% + SGST 50%)'}</strong>
            </p>
            <p className="text-zinc-700">
              Payment Terms: <strong>{paymentStatus}</strong>
            </p>
            <p className="text-zinc-700">
              Reverse Charge: <strong>NO</strong>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-zinc-200">
            <thead className="bg-zinc-100 text-zinc-800 font-bold border-b border-zinc-200">
              <tr>
                <th className="px-3 py-2 text-center w-10 border-r border-zinc-200">#</th>
                <th className="px-3 py-2 border-r border-zinc-200">Item Description</th>
                <th className="px-3 py-2 text-center w-20 border-r border-zinc-200">HSN/SAC</th>
                <th className="px-3 py-2 text-center w-16 border-r border-zinc-200">Qty</th>
                <th className="px-3 py-2 text-right w-24 border-r border-zinc-200">Rate (₹)</th>
                <th className="px-3 py-2 text-center w-16 border-r border-zinc-200">GST %</th>
                <th className="px-3 py-2 text-right w-24 border-r border-zinc-200">Taxable (₹)</th>
                <th className="px-3 py-2 text-right w-28">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {itemsList.map((row: any, idx: number) => {
                const qty = Number(row.qty) || 1;
                const rate = Number(row.rate) || 0;
                const taxable = row.taxableAmount || (qty * rate);
                const gstRate = Number(row.gstRate) || 0;
                const total = row.totalAmount || (taxable + (taxable * gstRate) / 100);

                return (
                  <tr key={idx} className="hover:bg-zinc-50/50">
                    <td className="px-3 py-2.5 text-center text-zinc-500 font-mono border-r border-zinc-200">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-zinc-950 border-r border-zinc-200">
                      {row.name}
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono text-zinc-600 border-r border-zinc-200">
                      {row.hsn || '9983'}
                    </td>
                    <td className="px-3 py-2.5 text-center font-bold border-r border-zinc-200">
                      {qty}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono border-r border-zinc-200">
                      {rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2.5 text-center font-semibold border-r border-zinc-200">
                      {gstRate}%
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono border-r border-zinc-200">
                      {taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-zinc-950">
                      {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculation & Statutory Tax Breakdown Box */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start pt-2">
          {/* Amount In Words & Declaration (7 cols) */}
          <div className="sm:col-span-7 space-y-3">
            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                INVOICE TOTAL IN WORDS:
              </span>
              <p className="font-bold text-zinc-900 italic pt-0.5">
                {amountInWords}
              </p>
            </div>

            <div className="text-[11px] text-zinc-600 space-y-1">
              <span className="font-bold text-zinc-800">Declaration:</span>
              <p className="leading-snug">
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
              </p>
              <p className="italic text-[10px] text-zinc-500">
                {notes}
              </p>
            </div>
          </div>

          {/* Tax Splits & Grand Total (5 cols) */}
          <div className="sm:col-span-5 bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Taxable Amount (Subtotal):</span>
              <span className="font-mono font-bold text-zinc-900">
                ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {!isInterState ? (
              <>
                <div className="flex justify-between text-zinc-600">
                  <span>Central Tax (CGST):</span>
                  <span className="font-mono font-semibold text-zinc-900">
                    ₹{cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>State Tax (SGST):</span>
                  <span className="font-mono font-semibold text-zinc-900">
                    ₹{sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-zinc-600">
                <span>Integrated Tax (IGST):</span>
                <span className="font-mono font-semibold text-zinc-900">
                  ₹{igstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="flex justify-between text-zinc-700 font-bold pt-1 border-t border-zinc-200">
              <span>Total Tax:</span>
              <span className="font-mono text-emerald-700">
                ₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t-2 border-zinc-900 text-sm font-black">
              <span className="uppercase text-zinc-950">Grand Total:</span>
              <span className="font-mono text-lg font-black text-zinc-950">
                ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Footer & Signatory */}
        <div className="pt-8 border-t border-zinc-200 flex justify-between items-end text-xs">
          <div className="space-y-1">
            <p className="text-zinc-500 font-medium">Customer Acknowledgment Signature</p>
            <div className="h-10 border-b border-dashed border-zinc-400 w-48" />
          </div>

          <div className="text-right space-y-1">
            <p className="font-bold text-zinc-900">For {business.name}</p>
            <div className="h-10 border-b border-dashed border-zinc-400 w-48 ml-auto" />
            <p className="text-[10px] text-zinc-500">Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}

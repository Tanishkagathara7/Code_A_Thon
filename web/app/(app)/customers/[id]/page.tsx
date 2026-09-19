'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  FileText,
  Plus,
  RefreshCw,
  ExternalLink,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Edit2,
} from 'lucide-react';
import { customersApi } from '@/lib/api/domain';
import { CustomerProfileData } from '@/lib/types';
import { useToast } from '@/lib/context/ToastContext';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { toast } = useToast();

  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCustomer = async () => {
    setLoading(true);
    try {
      const res = await customersApi.getCustomer(id);
      if (res.success && res.data) {
        setProfile(res.data);
      } else {
        toast('Customer not found', 'error');
      }
    } catch (err: any) {
      toast(err.message || 'Failed to load customer profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="p-20 text-center text-zinc-400 flex flex-col items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-zinc-700" />
        <span className="text-xs">Loading customer khata ledger & invoice history...</span>
      </div>
    );
  }

  if (!profile || !profile.customer) {
    return (
      <div className="p-16 text-center space-y-3">
        <p className="text-sm font-bold text-zinc-700">Customer record not found</p>
        <Link
          href="/customers"
          className="inline-flex items-center gap-1 text-xs text-indigo-600 font-bold hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Customers
        </Link>
      </div>
    );
  }

  const { customer, stats, invoices } = profile;

  return (
    <div className="space-y-6 pb-16">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Customers Directory</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
              {customer.name}
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
              {customer.customerType === 'business' ? 'B2B Wholesale' : 'Retail B2C'}
            </span>
          </div>
          {customer.businessName && (
            <p className="text-xs text-zinc-500 font-medium mt-0.5">{customer.businessName}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/items/new?partyName=${encodeURIComponent(customer.name)}&partyMobile=${encodeURIComponent(customer.mobile)}&partyState=${encodeURIComponent(customer.state)}&partyGstin=${encodeURIComponent(customer.gstin || '')}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice for Party</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Total Invoices</p>
          <p className="text-xl font-black text-zinc-900 mt-1">{stats.totalInvoices}</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Historical generated bills</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Total Billed</p>
          <p className="text-xl font-black text-indigo-600 mt-1">₹{Number(stats.totalBilled).toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Cumulative lifetime trade</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Total GST Contributed</p>
          <p className="text-xl font-black text-emerald-600 mt-1">₹{Number(stats.totalTax).toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">CGST, SGST & IGST</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Pending Balance</p>
          <p className={`text-xl font-black mt-1 ${stats.pendingBalance > 0 ? 'text-amber-600' : 'text-zinc-900'}`}>
            ₹{Number(stats.pendingBalance).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Credit / Khata balance due</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information Card */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4 lg:col-span-1">
          <h2 className="font-extrabold text-zinc-900 text-sm tracking-tight border-b border-zinc-100 pb-3">
            Party Statutory Details
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-zinc-400 text-[11px] block">GSTIN Number</span>
              {customer.gstin ? (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 rounded-md bg-zinc-50 border border-zinc-200 font-mono font-bold text-zinc-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{customer.gstin}</span>
                </div>
              ) : (
                <span className="font-medium text-zinc-500">Unregistered Party</span>
              )}
            </div>

            <div>
              <span className="text-zinc-400 text-[11px] block">Phone / Mobile</span>
              <p className="font-mono font-semibold text-zinc-800 mt-0.5">{customer.mobile}</p>
            </div>

            {customer.email && (
              <div>
                <span className="text-zinc-400 text-[11px] block">Email</span>
                <p className="font-medium text-zinc-800 mt-0.5">{customer.email}</p>
              </div>
            )}

            <div>
              <span className="text-zinc-400 text-[11px] block">Place of Supply (State)</span>
              <p className="font-bold text-zinc-900 mt-0.5">
                {customer.state} {customer.stateCode ? `(Code: ${customer.stateCode})` : ''}
              </p>
            </div>

            {customer.address && (
              <div>
                <span className="text-zinc-400 text-[11px] block">Full Address</span>
                <p className="text-zinc-700 mt-0.5 leading-relaxed">
                  {customer.address}
                  {customer.city ? `, ${customer.city}` : ''}
                  {customer.pincode ? ` - ${customer.pincode}` : ''}
                </p>
              </div>
            )}

            {customer.notes && (
              <div className="pt-2 border-t border-zinc-100">
                <span className="text-zinc-400 text-[11px] block">Remarks / Notes</span>
                <p className="text-zinc-600 italic mt-0.5">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Invoice History Table */}
        <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h2 className="font-extrabold text-zinc-900 text-sm tracking-tight">
                Party Billing History
              </h2>
              <p className="text-[11px] text-zinc-400">All tax invoices issued to {customer.name}</p>
            </div>
            <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              {invoices.length} {invoices.length === 1 ? 'Bill' : 'Bills'}
            </span>
          </div>

          {invoices.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400">
              <FileText className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
              <p>No past invoices recorded for this party yet.</p>
              <Link
                href={`/items/new?partyName=${encodeURIComponent(customer.name)}&partyMobile=${encodeURIComponent(customer.mobile)}&partyState=${encodeURIComponent(customer.state)}&partyGstin=${encodeURIComponent(customer.gstin || '')}`}
                className="inline-block mt-3 px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-bold text-xs"
              >
                Create First Bill
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Invoices Card List */}
              <div className="block md:hidden divide-y divide-zinc-100">
                {invoices.map((inv) => (
                  <div key={inv.id} className="py-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-zinc-900">{inv.invoiceNo}</span>
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${
                            inv.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : inv.status === 'in_progress'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {inv.paymentStatus}
                        </span>
                      </div>
                      <span className="font-extrabold text-xs text-zinc-900">
                        ₹{Number(inv.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>
                        {new Date(inv.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-[10px] font-medium text-zinc-400">
                        {inv.isInterState ? 'IGST' : 'CGST+SGST'}
                      </span>
                    </div>

                    <div className="pt-1 flex items-center justify-end gap-2">
                      <Link
                        href={`/items/${inv.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </Link>
                      <Link
                        href={`/items/${inv.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-indigo-600 font-bold text-xs transition-colors border border-zinc-200"
                      >
                        <span>View Invoice</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Invoices Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-zinc-100 min-w-[650px]">
                  <thead>
                    <tr className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider pb-2">
                      <th className="pb-2 font-semibold">Invoice No</th>
                      <th className="pb-2 font-semibold">Date</th>
                      <th className="pb-2 font-semibold">Tax Type</th>
                      <th className="pb-2 font-semibold">Status</th>
                      <th className="pb-2 text-right font-semibold">Grand Total</th>
                      <th className="pb-2 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 font-bold font-mono text-zinc-900">
                          {inv.invoiceNo}
                        </td>
                        <td className="py-3 text-zinc-500">
                          {new Date(inv.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                            {inv.isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST+SGST)'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              inv.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : inv.status === 'in_progress'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {inv.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 text-right font-extrabold text-zinc-900">
                          ₹{Number(inv.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/items/${inv.id}/edit`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition-colors"
                              title="Edit Bill"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                              <span>Edit</span>
                            </Link>
                            <Link
                              href={`/items/${inv.id}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                            >
                              <span>View PDF</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

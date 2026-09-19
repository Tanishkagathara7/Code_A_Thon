'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  FileText,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';
import { customersApi } from '@/lib/api/domain';
import { CustomerRecord, INDIAN_STATES } from '@/lib/types';
import { useToast } from '@/lib/context/ToastContext';

export default function CustomersPage() {
  const { toast } = useToast();

  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    mobile: string;
    email: string;
    customerType: 'individual' | 'business';
    gstin: string;
    businessName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    notes: string;
  }>({
    name: '',
    mobile: '',
    email: '',
    customerType: 'business',
    gstin: '',
    businessName: '',
    address: '',
    city: '',
    state: 'Gujarat',
    pincode: '',
    notes: '',
  });

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customersApi.getCustomers({
        search: search.trim() || undefined,
        customerType: selectedType !== 'all' ? selectedType : undefined,
        state: selectedState !== 'all' ? selectedState : undefined,
      });
      if (res.success) {
        setCustomers(res.data || []);
      }
    } catch (err: any) {
      toast(err.message || 'Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, selectedType, selectedState, toast]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      mobile: '',
      email: '',
      customerType: 'business',
      gstin: '',
      businessName: '',
      address: '',
      city: '',
      state: 'Gujarat',
      pincode: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CustomerRecord) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      mobile: c.mobile,
      email: c.email || '',
      customerType: c.customerType || 'business',
      gstin: c.gstin || '',
      businessName: c.businessName || '',
      address: c.address || '',
      city: c.city || '',
      state: c.state || 'Gujarat',
      pincode: c.pincode || '',
      notes: c.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast('Customer / Party name is required', 'error');
      return;
    }
    if (!formData.mobile.trim()) {
      toast('Contact mobile number is required', 'error');
      return;
    }

    if (formData.gstin.trim()) {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinRegex.test(formData.gstin.trim().toUpperCase())) {
        toast('Invalid 15-character GSTIN format (e.g. 24AABCR1234F1Z9)', 'error');
        return;
      }
    }

    try {
      const stateObj = INDIAN_STATES.find((s) => s.name.toLowerCase() === formData.state.toLowerCase());
      const payload = {
        ...formData,
        stateCode: stateObj ? stateObj.code : undefined,
        gstin: formData.gstin.trim().toUpperCase() || undefined,
      };

      if (!editingCustomer) {
        await customersApi.createCustomer(payload);
        toast('Customer party added successfully', 'success');
      } else {
        const custId = editingCustomer.id || editingCustomer._id || '';
        await customersApi.updateCustomer(custId, payload);
        toast('Customer party updated successfully', 'success');
      }

      setIsModalOpen(false);
      loadCustomers();
    } catch (err: any) {
      toast(err.message || 'Failed to save customer', 'error');
    }
  };

  const handleDeleteCustomer = async (c: CustomerRecord) => {
    if (!confirm(`Are you sure you want to remove "${c.name}"? Past invoices will remain preserved.`)) return;
    try {
      const custId = c.id || c._id || '';
      await customersApi.deleteCustomer(custId);
      toast('Customer record deleted', 'success');
      loadCustomers();
    } catch (err: any) {
      toast(err.message || 'Failed to delete customer', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <span>Parties</span>
            <span>/</span>
            <span className="font-semibold text-zinc-900">Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
            Customer Directory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Manage buyer parties, verified GSTINs, state place-of-supply mappings, and historical bill ledgers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCustomers}
            className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition-colors"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or GSTIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Customer Types</option>
            <option value="business">Business (B2B)</option>
            <option value="individual">Individual / Retail</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Operating States</option>
            {INDIAN_STATES.map((s) => (
              <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer Directory Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-400 bg-white rounded-2xl border border-zinc-100">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-zinc-400" />
          <span>Loading customer records...</span>
        </div>
      ) : customers.length === 0 ? (
        <div className="py-20 text-center text-zinc-400 bg-white rounded-2xl border border-zinc-100">
          <Users className="w-10 h-10 mx-auto mb-2 text-zinc-300" />
          <p className="font-bold text-zinc-700 text-sm">No customers found</p>
          <p className="text-xs text-zinc-400 mt-1">Add your frequent retail or wholesale buyers to auto-fill them during billing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => {
            const custId = c.id || c._id;
            return (
              <div
                key={custId}
                className="p-5 rounded-2xl bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-zinc-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Type badge & Actions */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                      {c.customerType === 'business' ? (
                        <>
                          <Building2 className="w-3 h-3 text-indigo-600" />
                          B2B Business
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 text-emerald-600" />
                          Retail Individual
                        </>
                      )}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(c)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Customer Identity */}
                  <Link href={`/customers/${custId}`} className="block group-hover:text-indigo-600 transition-colors">
                    <h3 className="font-extrabold text-zinc-900 text-base leading-tight">
                      {c.name}
                    </h3>
                    {c.businessName && (
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">{c.businessName}</p>
                    )}
                  </Link>

                  {/* GSTIN Tag */}
                  <div className="mt-3">
                    {c.gstin ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-200 font-mono text-xs font-semibold text-zinc-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{c.gstin}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-zinc-400 font-medium">Unregistered Buyer (B2C)</span>
                    )}
                  </div>

                  {/* Contact Details */}
                  <div className="mt-4 space-y-1.5 text-xs text-zinc-600 border-t border-zinc-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-mono">{c.mobile}</span>
                    </div>

                    {c.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">
                        {c.city ? `${c.city}, ` : ''}{c.state}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">Place of Supply: <b>{c.state}</b></span>
                  <Link
                    href={`/customers/${custId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD / EDIT CUSTOMER */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-zinc-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-950 text-base sm:text-lg tracking-tight">
                    {editingCustomer ? 'Edit Customer Party' : 'Add New Customer Party'}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Maintain GSTIN, contact details, and state place-of-supply.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveCustomer} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Section 1: Basic Identity */}
              <div className="bg-zinc-50/60 rounded-xl p-4 border border-zinc-200/70 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-black flex items-center justify-center">1</span>
                  <span className="text-xs font-bold text-zinc-900 tracking-wide uppercase">Party Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Party / Contact Person Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar or Rajesh Traders"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Mobile Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9825123456"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. rajesh@traders.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Statutory GST Profile */}
              <div className="bg-zinc-50/60 rounded-xl p-4 border border-zinc-200/70 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-black flex items-center justify-center">2</span>
                  <span className="text-xs font-bold text-zinc-900 tracking-wide uppercase">GST & Business Profile</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Customer Category</label>
                    <select
                      value={formData.customerType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerType: e.target.value as 'business' | 'individual',
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs font-medium cursor-pointer"
                    >
                      <option value="business">Registered Business (B2B)</option>
                      <option value="individual">Retail Customer (B2C)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      GSTIN (15-character statutory)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="e.g. 24AABCR1234F1Z9"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono uppercase shadow-xs font-bold text-emerald-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Business / Trade Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Commercial Trading Private Limited"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Billing Address & Location */}
              <div className="bg-zinc-50/60 rounded-xl p-4 border border-zinc-200/70 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-black flex items-center justify-center">3</span>
                  <span className="text-xs font-bold text-zinc-900 tracking-wide uppercase">Address & Place of Supply</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Billing Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Shop 12, APMC Market Yard, Ring Road"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajkot"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Operating State (Place of Supply) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs font-medium cursor-pointer"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Postal Code (PIN)</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 360003"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Notes / Ledger Remarks</label>
                    <input
                      type="text"
                      placeholder="e.g. 15-day credit limit approved"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white transition-all shadow-sm cursor-pointer"
                >
                  {editingCustomer ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

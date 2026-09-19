import mongoose from 'mongoose';
import { Customer, ICustomer } from '../models/Customer';
import { HackathonItem } from '../models/HackathonItem';

export interface CustomerListOptions {
  page?: number;
  limit?: number;
  search?: string;
  customerType?: string;
  state?: string;
  sort?: string;
}

export class CustomerService {
  static async create(data: Partial<ICustomer>, userId: string): Promise<ICustomer> {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);

    if (data.mobile) {
      const cleanedMobile = String(data.mobile).trim().replace(/[\s\-+]/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
        throw new Error('Valid 10-digit Indian mobile number (e.g. 9825123456) is required');
      }
      data.mobile = cleanedMobile;
    }

    // Optional GSTIN format validation
    if (data.gstin && data.gstin.trim()) {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      const cleaned = data.gstin.trim().toUpperCase();
      if (!gstinRegex.test(cleaned)) {
        throw new Error('Invalid GSTIN format. Expected 15-character statutory format (e.g. 24AABCT1357Q1ZP)');
      }
      data.gstin = cleaned;
    }

    const customer = new Customer({
      ...data,
      owner: ownerObjectId,
    });

    await customer.save();
    return customer;
  }

  static async getAll(userId: string, options: CustomerListOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      customerType,
      state,
      sort = 'name_asc',
    } = options;

    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    const query: any = { owner: ownerObjectId };

    if (search && search.trim()) {
      const sanitized = search.trim();
      query.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { mobile: { $regex: sanitized, $options: 'i' } },
        { gstin: { $regex: sanitized, $options: 'i' } },
        { businessName: { $regex: sanitized, $options: 'i' } },
        { city: { $regex: sanitized, $options: 'i' } },
      ];
    }

    if (customerType && customerType.trim()) {
      query.customerType = customerType.trim();
    }

    if (state && state.trim()) {
      query.state = state.trim();
    }

    let sortObj: any = { name: 1 };
    if (sort === 'name_desc') sortObj = { name: -1 };
    else if (sort === 'createdAt_desc') sortObj = { createdAt: -1 };
    else if (sort === 'createdAt_asc') sortObj = { createdAt: 1 };

    const total = await Customer.countDocuments(query);
    const skip = (page - 1) * limit;
    const customers = await Customer.find(query).sort(sortObj).skip(skip).limit(limit).lean();

    return {
      customers: customers.map((c: any) => ({ ...c, id: c._id.toString() })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  static async getById(id: string, userId: string): Promise<any> {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    const customer = await Customer.findOne({ _id: id, owner: ownerObjectId }).lean();
    if (!customer) return null;

    // Find all invoices associated with this customer
    // Match either by customer's phone, name, or customer ID stored in attributes
    const invoices = await HackathonItem.find({
      owner: ownerObjectId,
      $or: [
        { 'attributes.party.mobile': customer.mobile },
        { 'attributes.party.name': { $regex: `^${customer.name}$`, $options: 'i' } },
        { 'attributes.party.id': id },
        { 'attributes.party.customerId': id },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    let totalBilled = 0;
    let totalTax = 0;
    let pendingBalance = 0;

    invoices.forEach((inv: any) => {
      const grandTotal = Number(inv.attributes?.grandTotal) || 0;
      const tax = Number(inv.attributes?.totalTax) || 0;
      totalBilled += grandTotal;
      totalTax += tax;

      if (inv.status === 'pending' || inv.attributes?.paymentStatus === 'Unpaid / Due') {
        pendingBalance += grandTotal;
      } else if (inv.status === 'in_progress' || inv.attributes?.paymentStatus === 'Partial Balance') {
        pendingBalance += grandTotal / 2; // Approximate if not specified
      }
    });

    return {
      customer: { ...customer, id: customer._id.toString() },
      stats: {
        totalInvoices: invoices.length,
        totalBilled: Math.round(totalBilled * 100) / 100,
        totalTax: Math.round(totalTax * 100) / 100,
        pendingBalance: Math.round(pendingBalance * 100) / 100,
      },
      invoices: invoices.map((inv: any) => ({
        id: inv._id.toString(),
        invoiceNo: inv.attributes?.invoiceNo || inv.title,
        title: inv.title,
        date: inv.attributes?.invoiceDate || inv.createdAt,
        status: inv.status,
        paymentStatus: inv.attributes?.paymentStatus || 'Paid',
        grandTotal: inv.attributes?.grandTotal || 0,
        itemsCount: inv.attributes?.items?.length || 0,
        isInterState: inv.attributes?.isInterState || false,
      })),
    };
  }

  static async update(id: string, userId: string, data: Partial<ICustomer>): Promise<ICustomer | null> {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);

    if (data.mobile !== undefined) {
      const cleanedMobile = String(data.mobile).trim().replace(/[\s\-+]/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
        throw new Error('Valid 10-digit Indian mobile number (e.g. 9825123456) is required');
      }
      data.mobile = cleanedMobile;
    }

    if (data.gstin && data.gstin.trim()) {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      const cleaned = data.gstin.trim().toUpperCase();
      if (!gstinRegex.test(cleaned)) {
        throw new Error('Invalid GSTIN format. Expected 15-character statutory format (e.g. 24AABCT1357Q1ZP)');
      }
      data.gstin = cleaned;
    }

    const { owner, ...cleanData } = data as any;
    return Customer.findOneAndUpdate(
      { _id: id, owner: ownerObjectId },
      { $set: cleanData },
      { new: true, runValidators: true }
    );
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    const result = await Customer.deleteOne({ _id: id, owner: ownerObjectId });
    return result.deletedCount > 0;
  }
}

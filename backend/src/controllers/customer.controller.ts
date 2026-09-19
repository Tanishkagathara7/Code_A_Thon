import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { CustomerService } from '../services/customer.service';

export class CustomerController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { name, mobile, state, email, gstin } = req.body || {};
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ success: false, error: 'Customer name is required (minimum 2 characters)' });
      }
      if (!mobile || typeof mobile !== 'string') {
        return res.status(400).json({ success: false, error: 'Mobile number is required' });
      }
      const cleanedMobile = mobile.replace(/[\s\-+]/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
        return res.status(400).json({ success: false, error: 'Valid 10-digit Indian mobile number (e.g. 9825123456) is required' });
      }
      if (!state || typeof state !== 'string' || !state.trim()) {
        return res.status(400).json({ success: false, error: 'State is required for GST determination' });
      }
      if (email && typeof email === 'string' && email.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          return res.status(400).json({ success: false, error: 'Valid email address is required' });
        }
      }
      if (gstin && typeof gstin === 'string' && gstin.trim()) {
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin.trim().toUpperCase())) {
          return res.status(400).json({ success: false, error: 'Invalid 15-character GSTIN format' });
        }
      }

      const customer = await CustomerService.create(req.body, userId);
      return res.status(201).json({ success: true, data: customer });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message || 'Failed to create customer' });
    }
  }

  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const search = req.query.search ? String(req.query.search) : undefined;
      const customerType = req.query.customerType ? String(req.query.customerType) : undefined;
      const state = req.query.state ? String(req.query.state) : undefined;
      const sort = req.query.sort ? String(req.query.sort) : undefined;

      const result = await CustomerService.getAll(userId, {
        page,
        limit,
        search,
        customerType,
        state,
        sort,
      });

      return res.status(200).json({
        success: true,
        data: result.customers,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Failed to fetch customers' });
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const data = await CustomerService.getById(req.params.id, userId);
      if (!data) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Failed to fetch customer profile' });
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { name, mobile, email, gstin } = req.body || {};
      if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
        return res.status(400).json({ success: false, error: 'Customer name must be at least 2 characters' });
      }
      if (mobile !== undefined) {
        if (typeof mobile !== 'string') {
          return res.status(400).json({ success: false, error: 'Mobile number must be a string' });
        }
        const cleanedMobile = mobile.replace(/[\s\-+]/g, '');
        if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
          return res.status(400).json({ success: false, error: 'Valid 10-digit Indian mobile number (e.g. 9825123456) is required' });
        }
      }
      if (email && typeof email === 'string' && email.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          return res.status(400).json({ success: false, error: 'Valid email address is required' });
        }
      }
      if (gstin && typeof gstin === 'string' && gstin.trim()) {
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin.trim().toUpperCase())) {
          return res.status(400).json({ success: false, error: 'Invalid 15-character GSTIN format' });
        }
      }

      const updated = await CustomerService.update(req.params.id, userId, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message || 'Failed to update customer' });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const success = await CustomerService.delete(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }

      return res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Failed to delete customer' });
    }
  }
}

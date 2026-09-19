import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { ProductService } from '../services/product.service';

export class ProductController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { name, sellingPrice, purchasePrice, hsnCode, gstRate, openingStock, minStockAlert } = req.body || {};
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ success: false, error: 'Product name is required (minimum 2 characters)' });
      }
      if (sellingPrice === undefined || isNaN(Number(sellingPrice)) || Number(sellingPrice) <= 0) {
        return res.status(400).json({ success: false, error: 'Valid selling price greater than 0 is required' });
      }
      if (purchasePrice !== undefined && (isNaN(Number(purchasePrice)) || Number(purchasePrice) < 0)) {
        return res.status(400).json({ success: false, error: 'Purchase price cannot be negative' });
      }
      if (openingStock !== undefined && (isNaN(Number(openingStock)) || Number(openingStock) < 0)) {
        return res.status(400).json({ success: false, error: 'Opening stock cannot be negative' });
      }
      if (minStockAlert !== undefined && (isNaN(Number(minStockAlert)) || Number(minStockAlert) < 0)) {
        return res.status(400).json({ success: false, error: 'Minimum stock alert quantity cannot be negative' });
      }
      if (hsnCode && typeof hsnCode === 'string' && hsnCode.trim()) {
        if (!/^[0-9]{2,8}$/.test(hsnCode.trim())) {
          return res.status(400).json({ success: false, error: 'HSN/SAC code must be between 2 and 8 digits' });
        }
      }
      if (gstRate !== undefined) {
        const validGstRates = [0, 5, 12, 18, 28];
        if (!validGstRates.includes(Number(gstRate))) {
          return res.status(400).json({ success: false, error: 'GST rate must be one of: 0, 5, 12, 18, 28' });
        }
      }

      const product = await ProductService.create(req.body, userId);
      return res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message || 'Failed to create product' });
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
      const category = req.query.category ? String(req.query.category) : undefined;
      const gstRate = req.query.gstRate !== undefined ? Number(req.query.gstRate) : undefined;
      const stockStatus = req.query.stockStatus as any;
      const sort = req.query.sort ? String(req.query.sort) : undefined;

      const result = await ProductService.getAll(userId, {
        page,
        limit,
        search,
        category,
        gstRate,
        stockStatus,
        sort,
      });

      return res.status(200).json({
        success: true,
        data: result.products,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Failed to fetch products' });
    }
  }

  static async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const summary = await ProductService.getSummary(userId);
      return res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Failed to fetch summary' });
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const product = await ProductService.getById(req.params.id, userId);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      const stockHistory = await ProductService.getStockHistory(product._id.toString(), userId);

      return res.status(200).json({
        success: true,
        data: {
          ...product.toObject(),
          stockHistory,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Failed to fetch product' });
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { name, sellingPrice, purchasePrice, hsnCode, gstRate, minStockAlert } = req.body || {};
      if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
        return res.status(400).json({ success: false, error: 'Product name must be at least 2 characters' });
      }
      if (sellingPrice !== undefined && (isNaN(Number(sellingPrice)) || Number(sellingPrice) <= 0)) {
        return res.status(400).json({ success: false, error: 'Valid selling price greater than 0 is required' });
      }
      if (purchasePrice !== undefined && (isNaN(Number(purchasePrice)) || Number(purchasePrice) < 0)) {
        return res.status(400).json({ success: false, error: 'Purchase price cannot be negative' });
      }
      if (minStockAlert !== undefined && (isNaN(Number(minStockAlert)) || Number(minStockAlert) < 0)) {
        return res.status(400).json({ success: false, error: 'Minimum stock alert quantity cannot be negative' });
      }
      if (hsnCode && typeof hsnCode === 'string' && hsnCode.trim()) {
        if (!/^[0-9]{2,8}$/.test(hsnCode.trim())) {
          return res.status(400).json({ success: false, error: 'HSN/SAC code must be between 2 and 8 digits' });
        }
      }
      if (gstRate !== undefined) {
        const validGstRates = [0, 5, 12, 18, 28];
        if (!validGstRates.includes(Number(gstRate))) {
          return res.status(400).json({ success: false, error: 'GST rate must be one of: 0, 5, 12, 18, 28' });
        }
      }

      const updated = await ProductService.update(req.params.id, userId, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message || 'Failed to update product' });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const success = await ProductService.delete(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Failed to delete product' });
    }
  }

  static async adjustStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { operation, quantity, reason } = req.body || {};
      if (!['increase', 'decrease'].includes(operation)) {
        return res.status(400).json({ success: false, error: 'Operation must be either increase or decrease' });
      }
      if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
        return res.status(400).json({ success: false, error: 'Quantity must be a positive number' });
      }

      const result = await ProductService.adjustStock(
        req.params.id,
        userId,
        operation,
        Number(quantity),
        reason
      );

      return res.status(200).json({
        success: true,
        data: result.product,
        history: result.history,
        message: `Stock successfully ${operation === 'increase' ? 'increased' : 'decreased'} by ${quantity}`,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message || 'Failed to adjust stock' });
    }
  }

  static async getStockHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const history = await ProductService.getStockHistory(req.params.id, userId);
      return res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message || 'Failed to fetch stock history' });
    }
  }
}

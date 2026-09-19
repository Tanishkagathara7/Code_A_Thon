import mongoose from 'mongoose';
import { Product, IProduct } from '../models/Product';
import { StockHistory } from '../models/StockHistory';

export interface ProductListOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  gstRate?: number;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  sort?: string;
}

export class ProductService {
  static async create(data: Partial<IProduct>, userId: string): Promise<IProduct> {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    const openingStock = Number(data.openingStock) || 0;
    const currentStock = data.currentStock !== undefined ? Number(data.currentStock) : openingStock;

    const product = new Product({
      ...data,
      owner: ownerObjectId,
      openingStock,
      currentStock,
    });

    await product.save();

    // If initial stock was provided, create an initial stock history log
    if (currentStock > 0) {
      await StockHistory.create({
        product: product._id,
        owner: ownerObjectId,
        operationType: 'initial',
        previousQuantity: 0,
        quantityDelta: currentStock,
        newQuantity: currentStock,
        reason: 'Opening stock initialization',
      });
    }

    return product;
  }

  static async getAll(userId: string, options: ProductListOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      gstRate,
      stockStatus,
      sort = 'createdAt_desc',
    } = options;

    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    const query: any = { owner: ownerObjectId };

    if (search && search.trim()) {
      const sanitized = search.trim();
      query.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { sku: { $regex: sanitized, $options: 'i' } },
        { hsnCode: { $regex: sanitized, $options: 'i' } },
        { category: { $regex: sanitized, $options: 'i' } },
      ];
    }

    if (category && category.trim()) {
      query.category = category.trim();
    }

    if (gstRate !== undefined && !isNaN(gstRate)) {
      query.gstRate = Number(gstRate);
    }

    // Sort mapping
    let sortObj: any = { createdAt: -1 };
    if (sort === 'createdAt_asc') sortObj = { createdAt: 1 };
    else if (sort === 'name_asc') sortObj = { name: 1 };
    else if (sort === 'name_desc') sortObj = { name: -1 };
    else if (sort === 'price_asc') sortObj = { sellingPrice: 1 };
    else if (sort === 'price_desc') sortObj = { sellingPrice: -1 };
    else if (sort === 'stock_asc') sortObj = { currentStock: 1 };
    else if (sort === 'stock_desc') sortObj = { currentStock: -1 };

    let products = await Product.find(query).sort(sortObj).lean();

    // Client/Virtual status filtering if requested
    if (stockStatus) {
      products = products.filter((p: any) => {
        if (!p.trackInventory) return stockStatus === 'in_stock';
        if (p.currentStock <= 0) return stockStatus === 'out_of_stock';
        if (p.currentStock <= (p.minStockAlert || 5)) return stockStatus === 'low_stock';
        return stockStatus === 'in_stock';
      });
    }

    const total = products.length;
    const skip = (page - 1) * limit;
    const paginated = products.slice(skip, skip + limit);

    // Compute status field for each item
    const withVirtuals = paginated.map((p: any) => {
      let computedStatus = 'in_stock';
      if (p.trackInventory) {
        if (p.currentStock <= 0) computedStatus = 'out_of_stock';
        else if (p.currentStock <= (p.minStockAlert || 5)) computedStatus = 'low_stock';
      }
      return {
        ...p,
        id: p._id.toString(),
        stockStatus: computedStatus,
      };
    });

    return {
      products: withVirtuals,
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

  static async getSummary(userId: string) {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    const products = await Product.find({ owner: ownerObjectId }).lean();

    let totalProducts = products.length;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalInventoryValue = 0;

    products.forEach((p: any) => {
      const stock = Number(p.currentStock) || 0;
      const price = Number(p.purchasePrice || p.sellingPrice) || 0;
      totalInventoryValue += stock * price;

      if (p.trackInventory) {
        if (stock <= 0) {
          outOfStockCount++;
        } else if (stock <= (p.minStockAlert || 5)) {
          lowStockCount++;
        }
      }
    });

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
    };
  }

  static async getById(id: string, userId: string): Promise<IProduct | null> {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    return Product.findOne({ _id: id, owner: ownerObjectId });
  }

  static async update(id: string, userId: string, data: Partial<IProduct>): Promise<IProduct | null> {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    // Disallow arbitrary direct currentStock mutations via update (must use adjustStock)
    const { currentStock, openingStock, owner, ...cleanData } = data as any;

    const product = await Product.findOneAndUpdate(
      { _id: id, owner: ownerObjectId },
      { $set: cleanData },
      { new: true, runValidators: true }
    );

    return product;
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    const result = await Product.deleteOne({ _id: id, owner: ownerObjectId });
    return result.deletedCount > 0;
  }

  static async adjustStock(
    id: string,
    userId: string,
    operation: 'increase' | 'decrease',
    quantity: number,
    reason: string
  ): Promise<{ product: IProduct; history: any }> {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    const qty = Math.abs(Number(quantity));

    if (isNaN(qty) || qty <= 0) {
      throw new Error('Adjustment quantity must be a positive number');
    }

    const product = await Product.findOne({ _id: id, owner: ownerObjectId });
    if (!product) {
      throw new Error('Product not found');
    }

    const previousQuantity = product.currentStock;
    const delta = operation === 'increase' ? qty : -qty;
    const newQuantity = previousQuantity + delta;

    if (newQuantity < 0) {
      throw new Error(`Insufficient stock. Current stock is ${previousQuantity}, cannot decrease by ${qty}`);
    }

    product.currentStock = newQuantity;
    await product.save();

    const history = await StockHistory.create({
      product: product._id,
      owner: ownerObjectId,
      operationType: operation === 'increase' ? 'manual_increase' : 'manual_decrease',
      previousQuantity,
      quantityDelta: delta,
      newQuantity,
      reason: reason || (operation === 'increase' ? 'Manual stock increase' : 'Manual stock reduction'),
    });

    return { product, history };
  }

  static async getStockHistory(productId: string, userId: string) {
    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    return StockHistory.find({ product: productId, owner: ownerObjectId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
  }
}

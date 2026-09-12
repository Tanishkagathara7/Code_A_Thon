import { HackathonItem, IHackathonItem, HackathonItemStatus } from '../models/HackathonItem';
import mongoose from 'mongoose';

export interface CreateItemInput {
  title: string;
  description?: string;
  status?: HackathonItemStatus;
  category?: string;
}

export interface UpdateItemInput {
  title?: string;
  description?: string;
  status?: HackathonItemStatus;
  category?: string;
}

export interface GetItemsOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedItemsResponse {
  items: IHackathonItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class HackathonItemService {
  /**
   * Create a new item owned by the authenticated user.
   */
  static async create(input: CreateItemInput, userId: string): Promise<IHackathonItem> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const item = new HackathonItem({
      title: input.title,
      description: input.description,
      status: input.status || 'pending',
      category: input.category,
      owner: new mongoose.Types.ObjectId(userId),
    });

    return await item.save();
  }

  /**
   * Get all items belonging to the authenticated user with pagination and optional search filter.
   */
  static async getAll(userId: string, options: GetItemsOptions = {}): Promise<PaginatedItemsResponse> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const page = Math.max(1, Number(options.page) || 1);
    const rawLimit = Number(options.limit) || 20;
    const limit = Math.min(100, Math.max(1, rawLimit));
    const skip = (page - 1) * limit;

    // Strict filter enforcing user ownership
    const filter: any = {
      owner: new mongoose.Types.ObjectId(userId),
    };

    // Safe search filter preparation (regex match on title or description)
    if (options.search && options.search.trim() !== '') {
      const sanitizedSearch = options.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: sanitizedSearch, $options: 'i' } },
        { description: { $regex: sanitizedSearch, $options: 'i' } },
        { category: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      HackathonItem.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      HackathonItem.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a specific item by ID, ensuring it belongs to the authenticated user.
   */
  static async getById(itemId: string, userId: string): Promise<IHackathonItem> {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      const err = new Error('Item not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const item = await HackathonItem.findOne({
      _id: itemId,
      owner: new mongoose.Types.ObjectId(userId),
    }).exec();

    if (!item) {
      const err = new Error('Item not found');
      (err as any).statusCode = 404;
      throw err;
    }

    return item;
  }

  /**
   * Update an item by ID, ensuring it belongs to the authenticated user.
   */
  static async update(itemId: string, userId: string, updateData: UpdateItemInput): Promise<IHackathonItem> {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      const err = new Error('Item not found');
      (err as any).statusCode = 404;
      throw err;
    }

    // Prepare update object with only defined fields
    const updatePayload: any = {};
    if (updateData.title !== undefined) updatePayload.title = updateData.title;
    if (updateData.description !== undefined) updatePayload.description = updateData.description;
    if (updateData.status !== undefined) updatePayload.status = updateData.status;
    if (updateData.category !== undefined) updatePayload.category = updateData.category;

    const item = await HackathonItem.findOneAndUpdate(
      {
        _id: itemId,
        owner: new mongoose.Types.ObjectId(userId),
      },
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).exec();

    if (!item) {
      const err = new Error('Item not found');
      (err as any).statusCode = 404;
      throw err;
    }

    return item;
  }

  /**
   * Delete an item by ID, ensuring it belongs to the authenticated user.
   */
  static async delete(itemId: string, userId: string): Promise<{ id: string }> {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      const err = new Error('Item not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const item = await HackathonItem.findOneAndDelete({
      _id: itemId,
      owner: new mongoose.Types.ObjectId(userId),
    }).exec();

    if (!item) {
      const err = new Error('Item not found');
      (err as any).statusCode = 404;
      throw err;
    }

    return { id: itemId };
  }
}

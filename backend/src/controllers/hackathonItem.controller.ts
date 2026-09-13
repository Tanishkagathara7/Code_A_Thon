import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { HackathonItemService } from '../services/hackathonItem.service';
import { NotificationService } from '../services/notification.service';

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_SORTS = ['createdAt_desc', 'createdAt_asc', 'title_asc', 'title_desc'];

export class HackathonItemController {
  /**
   * POST /api/items
   * Create a new item for the authenticated user.
   */
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized. User session missing.' });
      }

      const { title, description, status, category } = req.body || {};

      // Input Validation
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ success: false, error: 'Title is required and must be a non-empty string.' });
      }

      if (title.length > 100) {
        return res.status(400).json({ success: false, error: 'Title cannot exceed 100 characters.' });
      }

      if (description !== undefined && description !== null) {
        if (typeof description !== 'string') {
          return res.status(400).json({ success: false, error: 'Description must be a string.' });
        }
        if (description.length > 1000) {
          return res.status(400).json({ success: false, error: 'Description cannot exceed 1000 characters.' });
        }
      }

      if (status !== undefined && status !== null) {
        if (!VALID_STATUSES.includes(status)) {
          return res.status(400).json({
            success: false,
            error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
          });
        }
      }

      if (category !== undefined && category !== null) {
        if (typeof category !== 'string') {
          return res.status(400).json({ success: false, error: 'Category must be a string.' });
        }
        if (category.length > 50) {
          return res.status(400).json({ success: false, error: 'Category cannot exceed 50 characters.' });
        }
      }

      const newItem = await HackathonItemService.create(
        { title, description, status, category },
        userId
      );

      // Trigger non-blocking notification for item creation
      try {
        await NotificationService.createNotification({
          recipient: userId,
          type: 'ITEM_CREATED',
          title: process.env.NOTIF_ITEM_CREATED_TITLE || 'Item created',
          message: process.env.NOTIF_ITEM_CREATED_MSG || 'Your item was created successfully.',
          data: { entityId: newItem._id.toString(), entityType: 'item' },
        });
      } catch (notifError) {
        console.error('Failed to create notification for item creation:', notifError);
      }

      return res.status(201).json({
        success: true,
        data: newItem,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Failed to create item',
      });
    }
  }

  /**
   * GET /api/items
   * Retrieve all items owned by the authenticated user with search, filter, sort, and pagination.
   */
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized. User session missing.' });
      }

      const rawPage = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const rawLimit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      if (isNaN(rawPage) || rawPage < 1) {
        return res.status(400).json({ success: false, error: 'Invalid page parameter. Must be a positive integer.' });
      }

      if (isNaN(rawLimit) || rawLimit < 1) {
        return res.status(400).json({ success: false, error: 'Invalid limit parameter. Must be a positive integer.' });
      }

      const search = req.query.search ? String(req.query.search).trim() : undefined;
      if (search !== undefined && search.length > 100) {
        return res.status(400).json({ success: false, error: 'Search query cannot exceed 100 characters.' });
      }

      const status = req.query.status ? String(req.query.status).trim() : undefined;
      if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        });
      }

      const category = req.query.category ? String(req.query.category).trim() : undefined;
      if (category !== undefined && category.length > 50) {
        return res.status(400).json({ success: false, error: 'Category cannot exceed 50 characters.' });
      }

      const sort = req.query.sort ? String(req.query.sort).trim() : undefined;
      if (sort !== undefined && !VALID_SORTS.includes(sort)) {
        return res.status(400).json({
          success: false,
          error: `Invalid sort option. Must be one of: ${VALID_SORTS.join(', ')}`,
        });
      }

      const result = await HackathonItemService.getAll(userId, {
        page: rawPage,
        limit: rawLimit,
        search,
        status,
        category,
        sort,
      });

      return res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Failed to retrieve items',
      });
    }
  }

  /**
   * GET /api/items/:id
   * Retrieve a single item owned by the authenticated user.
   */
  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized. User session missing.' });
      }

      const id = req.params.id as string;
      const item = await HackathonItemService.getById(id, userId);

      return res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 404).json({
        success: false,
        error: error.message || 'Item not found',
      });
    }
  }

  /**
   * PUT /api/items/:id
   * Update an existing item owned by the authenticated user.
   */
  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized. User session missing.' });
      }

      const id = req.params.id as string;
      const { title, description, status, category } = req.body || {};

      // Input Validation on update
      if (title !== undefined) {
        if (typeof title !== 'string' || title.trim() === '') {
          return res.status(400).json({ success: false, error: 'Title cannot be empty.' });
        }
        if (title.length > 100) {
          return res.status(400).json({ success: false, error: 'Title cannot exceed 100 characters.' });
        }
      }

      if (description !== undefined && description !== null) {
        if (typeof description !== 'string') {
          return res.status(400).json({ success: false, error: 'Description must be a string.' });
        }
        if (description.length > 1000) {
          return res.status(400).json({ success: false, error: 'Description cannot exceed 1000 characters.' });
        }
      }

      if (status !== undefined && status !== null) {
        if (!VALID_STATUSES.includes(status)) {
          return res.status(400).json({
            success: false,
            error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
          });
        }
      }

      if (category !== undefined && category !== null) {
        if (typeof category !== 'string') {
          return res.status(400).json({ success: false, error: 'Category must be a string.' });
        }
        if (category.length > 50) {
          return res.status(400).json({ success: false, error: 'Category cannot exceed 50 characters.' });
        }
      }

      // Fetch existing item status before update if status is provided to detect completion transition
      let previousStatus: string | undefined = undefined;
      if (status !== undefined) {
        try {
          const existingItem = await HackathonItemService.getById(id, userId);
          previousStatus = existingItem.status;
        } catch {
          // If item doesn't exist, HackathonItemService.update below will throw proper 404 error
        }
      }

      const updatedItem = await HackathonItemService.update(id, userId, {
        title,
        description,
        status,
        category,
      });

      // Trigger non-blocking notification only if status transitioned to 'completed'
      if (status === 'completed' && previousStatus !== 'completed') {
        try {
          await NotificationService.createNotification({
            recipient: userId,
            type: 'ITEM_COMPLETED',
            title: process.env.NOTIF_ITEM_COMPLETED_TITLE || 'Item completed',
            message: process.env.NOTIF_ITEM_COMPLETED_MSG || 'Your item has been marked as completed.',
            data: { entityId: updatedItem._id.toString(), entityType: 'item' },
          });
        } catch (notifError) {
          console.error('Failed to create notification for item completion:', notifError);
        }
      }

      return res.status(200).json({
        success: true,
        data: updatedItem,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 404).json({
        success: false,
        error: error.message || 'Item not found or update failed',
      });
    }
  }

  /**
   * DELETE /api/items/:id
   * Delete an item owned by the authenticated user.
   */
  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized. User session missing.' });
      }

      const id = req.params.id as string;
      const result = await HackathonItemService.delete(id, userId);

      return res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 404).json({
        success: false,
        error: error.message || 'Item not found or delete failed',
      });
    }
  }
}

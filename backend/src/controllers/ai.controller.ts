import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { defaultAIService, AIError } from '../services/ai';
import { NotificationService } from '../services/notification.service';

export class AIController {
  /**
   * POST /api/ai/generate
   * Protected AI generation endpoint.
   */
  static async generate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized. Authentication token required to access AI services.',
        });
      }

      const { prompt, system, model, temperature, maxTokens } = req.body || {};

      if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Prompt is required and must be a non-empty string.',
        });
      }

      const aiResponse = await defaultAIService.generate({
        prompt,
        system,
        model,
        temperature,
        maxTokens,
      });

      // Trigger non-blocking notification for AI completion
      try {
        await NotificationService.createNotification({
          recipient: userId,
          type: 'AI_COMPLETED',
          title: 'AI Task Completed',
          message: 'Your AI request was processed successfully.',
          data: { entityType: 'ai' },
        });
      } catch (notifError) {
        console.error('Failed to create notification for AI completion:', notifError);
      }

      return res.status(200).json({
        success: true,
        data: aiResponse,
      });
    } catch (error: any) {
      if (error instanceof AIError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.code,
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message || 'An internal server error occurred while processing AI request.',
      });
    }
  }
}

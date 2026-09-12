import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
  static async syncUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.syncOAuthUser(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async githubAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.exchangeGitHubCode(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async emailAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.emailAuthenticate(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.forgotPassword(req.body.email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.resetPassword(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Invalid or expired access token.' });
      }
      const result = await AuthService.getUserProfile(req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

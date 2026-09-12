import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth, authLimiter, otpLimiter } from '../middleware/auth';

const router = Router();

// OAuth / User sync endpoint
router.post('/sync', AuthController.syncUser);

// GitHub OAuth Code Exchange & Sync Endpoint
router.post('/github', AuthController.githubAuth);

// Email login / signup endpoint
router.post('/email', authLimiter, AuthController.emailAuth);

// Request Password Reset (generates 6-digit OTP code)
router.post('/forgot-password', otpLimiter, AuthController.forgotPassword);

// Verify Code and Reset Password
router.post('/reset-password', otpLimiter, AuthController.resetPassword);

// Protected route to retrieve current user profile using Bearer token
router.get('/me', requireAuth, AuthController.getMe);

export default router;

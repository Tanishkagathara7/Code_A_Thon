import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';

import { connectDatabase } from './config/database';
import { generalLimiter, requireAuth, authLimiter, otpLimiter, AuthenticatedRequest } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import hackathonItemRoutes from './routes/hackathonItem.routes';

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Re-export middleware & types for backward compatibility
export { requireAuth, generalLimiter, authLimiter, otpLimiter, AuthenticatedRequest };

// Validate critical environment variables
if (!process.env.MONGODB_URI) {
  console.error('❌ FATAL CONFIGURATION ERROR: MONGODB_URI environment variable is missing on server.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing on server.');
  process.exit(1);
}

// Connect to MongoDB Atlas
connectDatabase();

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Apply general rate limiter to all API routes
app.use('/api/', generalLimiter);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', hackathonItemRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 MindBloom Backend API running on http://localhost:${PORT}`);
});

export default app;

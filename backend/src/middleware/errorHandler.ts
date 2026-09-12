import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`❌ [ERROR] ${req.method} ${req.url}:`, err.message || err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.status || err.statusCode || 500);
  const isProduction = process.env.NODE_ENV === 'production';

  let safeMessage = err.message || 'Internal server error';
  if (isProduction && statusCode === 500) {
    safeMessage = 'An internal server error occurred. Please try again later.';
  }

  res.status(statusCode).json({
    error: safeMessage,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

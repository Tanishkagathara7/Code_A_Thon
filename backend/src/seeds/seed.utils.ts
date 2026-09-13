import dotenv from 'dotenv';
import path from 'path';

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface SafetyCheckResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validates whether database seeding is allowed in the current environment context.
 * Strict protection against accidentally wiping production data.
 */
export function checkSeedSafety(): SafetyCheckResult {
  const env = process.env.NODE_ENV || 'development';
  const seedAllowed = process.env.SEED_ALLOWED === 'true';

  if (env === 'production' && !seedAllowed) {
    return {
      allowed: false,
      reason: '🚫 SEED REFUSED: NODE_ENV is set to "production" and SEED_ALLOWED is not "true". Refusing to seed production database.',
    };
  }

  return { allowed: true };
}

/**
 * Helper to compute a Date object `days` in the past from now.
 */
export function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Log helper for seed events
 */
export function logSeed(msg: string): void {
  console.log(`[SEED] ${msg}`);
}

/**
 * Centralized SEO & Site Configuration for APP
 * Provides canonical URL generation, metadata defaults, and Search Console verification.
 */

export const SITE_CONFIG = {
  name: 'GST Billing',
  fullName: 'GST Billing — Bill Smarter, Grow Faster',
  shortDescription:
    'Modern GST Billing & Invoicing System with real-time cross-platform synchronization across Web and Mobile.',
  fullDescription:
    'GST Billing is a high-speed, compliant invoicing and tax management system. Generate GST-compliant invoices, track payments, monitor sales analytics, and manage client accounts with real-time sync across web and mobile clients.',
  defaultKeywords: [
    'GST Billing',
    'invoicing system',
    'tax invoice',
    'GST compliance',
    'cross-platform billing',
    'Next.js 16',
    'React Native Expo',
    'real-time synchronization',
    'business accounting',
    'inventory and billing',
  ],
  author: 'GST Billing Engineering Team',
  twitterHandle: '@GSTBilling',
  themeColor: '#FAFAFA',
};

/**
 * Resolves the authoritative base URL for production, staging, and local environments.
 * Prioritizes NEXT_PUBLIC_SITE_URL, then VERCEL_URL, and falls back to a clean default production URL.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, '')}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`;
  }
  // Authoritative production domain for metadata, canonicals, and structured data
  return 'https://code-a-thon-one.vercel.app';
}

/**
 * Returns a canonical URL for a specific route path.
 */
export function getCanonicalUrl(path: string = ''): string {
  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath === '/' ? '' : normalizedPath}`;
}

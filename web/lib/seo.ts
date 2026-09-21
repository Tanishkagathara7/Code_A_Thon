/**
 * Centralized SEO & Site Configuration for APP
 * Provides canonical URL generation, metadata defaults, and Search Console verification.
 */

export const SITE_CONFIG = {
  name: 'VyaaparGST',
  fullName: 'VyaaparGST — Bill Smarter, Grow Faster',
  shortDescription:
    'Modern GST Billing & Invoicing System with real-time cross-platform synchronization across Web and Mobile.',
  fullDescription:
    'VyaaparGST is a high-speed, compliant invoicing and tax management system. Generate GST-compliant invoices, track payments, monitor sales analytics, and manage client accounts with real-time sync across web and mobile clients.',
  defaultKeywords: [
    'VyaaparGST',
    'GST Billing software',
    'retail billing software',
    'GST invoice generator',
    'tax invoice',
    'CGST SGST IGST calculator',
    'A4 tax invoice printer',
    'GST compliance India',
    'cross-platform billing',
    'party khata ledger',
    'Next.js 16',
    'business accounting',
    'inventory and billing',
  ],
  author: 'VyaaparGST Engineering Team',
  twitterHandle: '@VyaaparGST',
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

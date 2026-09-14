/**
 * Centralized SEO & Site Configuration for APP
 * Provides canonical URL generation, metadata defaults, and Search Console verification.
 */

export const SITE_CONFIG = {
  name: 'APP',
  fullName: 'APP — Real-Time Cross-Platform Intelligence & Operations',
  shortDescription:
    'Synchronized cross-platform operational intelligence and developer workspace powered by Next.js 16, React Native Expo, and Express.',
  fullDescription:
    'APP is an agile cross-platform operational intelligence workspace. Coordinate data pipelines, monitor real-time parity between desktop and native mobile clients, and execute AI-assisted workflows with zero architectural drift.',
  defaultKeywords: [
    'operational intelligence',
    'cross-platform development',
    'Next.js 16',
    'React Native Expo',
    'real-time synchronization',
    'developer workspace',
    'Mongoose schemas',
    'AI copilot',
    'JWT authentication',
    'engineering operations',
  ],
  author: 'APP Engineering Team',
  twitterHandle: '@APPEngine',
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

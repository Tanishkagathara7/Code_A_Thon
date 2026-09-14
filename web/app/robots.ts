import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

/**
 * Native Next.js 16 Robots.txt Generator
 * Grants legitimate search engines access to public indexable landing and auth pages,
 * while strictly disallowing private operational views, API calls, and OAuth handshakes.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/signup'],
        disallow: [
          '/dashboard',
          '/items',
          '/items/*',
          '/ai-assistant',
          '/files',
          '/notifications',
          '/auth/callback',
          '/auth/callback/*',
          '/forgot-password',
          '/api/',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

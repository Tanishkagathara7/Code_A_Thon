import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

/**
 * Native Next.js 16 XML Sitemap Generator
 * Automatically maps all public, indexable endpoints.
 * Explicitly excludes private app workspaces, auth callback, and password recovery pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const currentDate = new Date();

  return [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}

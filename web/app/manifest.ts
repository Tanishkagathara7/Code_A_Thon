import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

/**
 * Web App Manifest for PWA & Search Engine Entity Richness
 * Provides metadata for mobile bookmarking, Android/Chrome installability, and discoverability.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.fullName,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.shortDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF7',
    theme_color: '#0A0A0A',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

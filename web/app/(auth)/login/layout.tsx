import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Sign In — Access Your Billing Workspace',
  description:
    'Log in to your VyaaparGST account to manage customers, inventory items, generate GST tax invoices, and track retail sales.',
  alternates: {
    canonical: `${getSiteUrl()}/login`,
  },
  openGraph: {
    title: 'Sign In — VyaaparGST',
    description:
      'Access your VyaaparGST billing workspace, customer khata ledger, and instant A4 invoice printer.',
    url: `${getSiteUrl()}/login`,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

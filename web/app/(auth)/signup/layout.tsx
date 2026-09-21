import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Sign Up — Free GST Invoicing & Billing Software',
  description:
    'Create your VyaaparGST account to generate compliant Indian GST invoices in 30 seconds. Free retail billing with automated CGST/SGST/IGST tax calculation.',
  alternates: {
    canonical: `${getSiteUrl()}/signup`,
  },
  openGraph: {
    title: 'Create Account — VyaaparGST Billing Suite',
    description:
      'Start billing smarter with VyaaparGST. Effortless GST invoicing, customer party khata, and printable A4 invoices.',
    url: `${getSiteUrl()}/signup`,
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}

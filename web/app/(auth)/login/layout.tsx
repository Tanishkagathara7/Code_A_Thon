import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Sign In to Workspace',
  description:
    'Log in to APP. Access synchronized real-time cross-platform operations across Next.js and React Native.',
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: `Sign In | ${SITE_CONFIG.name}`,
    description: 'Log in to access your synchronized operational intelligence workspace.',
    url: '/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

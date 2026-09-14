import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Create an Account — Launch Workspace',
  description:
    'Join APP. Deploy high-velocity, synchronized cross-platform intelligence across desktop and native mobile apps.',
  alternates: {
    canonical: '/signup',
  },
  openGraph: {
    title: `Create Account | ${SITE_CONFIG.name}`,
    description: 'Create an account to deploy synchronized operational workflows.',
    url: '/signup',
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

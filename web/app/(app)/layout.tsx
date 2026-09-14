import { Metadata } from 'next';
import WorkspaceShell from '@/components/layout/WorkspaceShell';

/**
 * Global Metadata for Authenticated Workspace Pages
 * Strictly prevents Google and external crawlers from indexing private operational data,
 * items, files, AI prompt traces, and user notifications.
 */
export const metadata: Metadata = {
  title: 'Workspace',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}

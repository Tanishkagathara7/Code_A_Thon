import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import { ToastProvider } from '@/lib/context/ToastContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'APP — Real-Time Cross-Platform Intelligence & Operations',
  description: 'Synchronized cross-platform productivity and operational intelligence workspace powered by AI, Next.js, React Native, and Express.',
  keywords: ['operational intelligence', 'nextjs', 'react native', 'cross-platform', 'ai assistant'],
  openGraph: {
    title: 'APP — Cross-Platform Engineering & Operations',
    description: 'One synchronized platform across mobile and web.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#FAFAF7] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white min-h-screen">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

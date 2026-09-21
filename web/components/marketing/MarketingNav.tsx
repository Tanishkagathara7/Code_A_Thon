'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { domainConfig } from '@/lib/domain.config';
import { scrollTo } from '@/lib/animations/lenis';

export const MarketingNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/#product', hash: '#product', label: 'Dashboard' },
    { href: '/#workflow', hash: '#workflow', label: 'Workflow' },
    { href: '/#tax-engine', hash: '#tax-engine', label: 'GST Split' },
    { href: '/#invoice-showcase', hash: '#invoice-showcase', label: 'A4 Invoice' },
    { href: '/#faq', hash: '#faq', label: 'FAQ' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string, href: string) => {
    if (pathname === '/') {
      e.preventDefault();
      const targetEl = document.querySelector(hash);
      if (targetEl) {
        scrollTo(targetEl as HTMLElement, { offset: -80 });
        window.history.pushState(null, '', hash);
      } else {
        router.push(href);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 py-4 flex justify-center">
      <div
        className={`w-full max-w-6xl transition-all duration-300 rounded-2xl flex items-center justify-between px-4 sm:px-6 py-2.5 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/[0.04] border border-zinc-200/90'
            : 'bg-white/90 backdrop-blur-xl border border-zinc-200/80 shadow-xs'
        }`}
      >
        {/* Brand identity: Sleek, high-precision */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl overflow-hidden shadow-md shadow-zinc-950/10 border border-zinc-200/90 group-hover:scale-105 transition-transform flex items-center justify-center bg-white p-0.5 shrink-0">
            <Image
              src="/icon.png"
              alt="VyaaparGST — Modern GST Billing & Invoicing Platform"
              width={44}
              height={44}
              className="object-contain w-full h-full scale-110"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-zinc-950 text-lg">
              {domainConfig.brand.name}
            </span>
          </div>
        </Link>

        {/* Desktop Links with Animated Hover Pill */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-zinc-600">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.hash, item.href)}
              className="relative px-3.5 py-1.5 rounded-full text-zinc-600 hover:text-zinc-950 transition-colors duration-200 group overflow-hidden"
            >
              {/* Subtle animated background fill on hover */}
              <span className="absolute inset-0 bg-zinc-900/[0.06] rounded-full scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 ease-out pointer-events-none" />
              {/* Bottom active indicator dot/line */}
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-blue-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out pointer-events-none" />
              <span className="relative z-10 transition-transform duration-150 group-hover:-translate-y-[0.5px] inline-block font-medium">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/login"
            className="relative px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-950 rounded-full transition-colors duration-200 group overflow-hidden"
          >
            <span className="absolute inset-0 bg-zinc-900/[0.06] rounded-full scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 ease-out pointer-events-none" />
            <span className="relative z-10 font-semibold">Sign In</span>
          </Link>
          <Link
            href="/signup"
            className="btn-primary px-4 py-2 text-xs font-semibold tracking-wide"
          >
            <span>Start Billing</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-70" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100/70 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 bg-white/95 backdrop-blur-xl rounded-2xl p-5 flex flex-col gap-3 z-50 border border-zinc-200/90 shadow-2xl shadow-zinc-950/15">
          <nav className="flex flex-col gap-1 text-sm font-medium text-zinc-800">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, item.hash, item.href);
                }}
                className="py-2.5 px-3 rounded-xl hover:bg-zinc-100 hover:text-zinc-950 transition-colors font-semibold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary text-center py-2.5 text-xs font-semibold"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary text-center py-2.5 text-xs font-semibold"
            >
              Launch Workspace →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

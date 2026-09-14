'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export const MarketingNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-zinc-950/20 group-hover:scale-105 transition-transform">
            A
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-zinc-900 text-base">
              APP
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-zinc-600">
          <a
            href="#product"
            className="px-3.5 py-1.5 rounded-lg hover:text-zinc-900 hover:bg-zinc-100/70 transition-all"
          >
            Product
          </a>
          <a
            href="#platform"
            className="px-3.5 py-1.5 rounded-lg hover:text-zinc-900 hover:bg-zinc-100/70 transition-all"
          >
            Two Clients
          </a>
          <a
            href="#workflow"
            className="px-3.5 py-1.5 rounded-lg hover:text-zinc-900 hover:bg-zinc-100/70 transition-all"
          >
            Workflow
          </a>
          <a
            href="#architecture"
            className="px-3.5 py-1.5 rounded-lg hover:text-zinc-900 hover:bg-zinc-100/70 transition-all"
          >
            Architecture
          </a>
          <a
            href="#heritage"
            className="px-3.5 py-1.5 rounded-lg hover:text-zinc-900 hover:bg-zinc-100/70 transition-all"
          >
            Heritage
          </a>
          <a
            href="#faq"
            className="px-3.5 py-1.5 rounded-lg hover:text-zinc-900 hover:bg-zinc-100/70 transition-all"
          >
            FAQ
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/login"
            className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 px-3.5 py-2 rounded-lg hover:bg-zinc-100/70 transition-all"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="btn-primary px-4 py-2 text-xs font-semibold tracking-wide"
          >
            <span>Launch Workspace</span>
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
            <a
              href="#product"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-zinc-100 hover:text-zinc-950 transition-colors font-semibold"
            >
              Product
            </a>
            <a
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-zinc-100/70 hover:text-zinc-950 transition-colors"
            >
              Two Clients
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-zinc-100/70 hover:text-zinc-950 transition-colors"
            >
              Workflow
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-zinc-100/70 hover:text-zinc-950 transition-colors"
            >
              Architecture
            </a>
            <a
              href="#heritage"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-zinc-100/70 hover:text-zinc-950 transition-colors"
            >
              Heritage
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-zinc-100/70 hover:text-zinc-950 transition-colors"
            >
              FAQ
            </a>
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

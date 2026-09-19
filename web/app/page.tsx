'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Monitor,
  Smartphone,
  Calculator,
  Printer,
  ShoppingBag,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { Highlight } from '@/components/marketing/Highlight';
import { InteractiveDemonstrator } from '@/components/marketing/InteractiveDemonstrator';
import { GstCalculationEngine } from '@/components/marketing/GstCalculationEngine';
import { AuthenticInvoiceShowcase } from '@/components/marketing/AuthenticInvoiceShowcase';
import { ArchitectureDiagram } from '@/components/marketing/ArchitectureDiagram';
import { InteractiveHeroDashboard } from '@/components/marketing/InteractiveHeroDashboard';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { SmoothScrollProvider } from '@/components/marketing/SmoothScrollProvider';
import { scrollTo } from '@/lib/animations/lenis';
import { createHeroEntranceTimeline } from '@/lib/animations/hero';
import { initScrollStory } from '@/lib/animations/scroll';
import { initHeroTypographyAnimation } from '@/lib/animations/heroTypography';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_CONFIG, getSiteUrl } from '@/lib/seo';
import { domainConfig } from '@/lib/domain.config';
import { EditorialBackgroundSystem } from '@/components/background/EditorialBackgroundSystem';
import { LoadingScreen } from '@/components/loading/LoadingScreen';
import { useLoading } from '@/lib/context/LoadingContext';
import { TiltCard } from '@/components/ui/TiltCard';

export default function MarketingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const siteUrl = getSiteUrl();

  const jsonLdSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      alternateName: SITE_CONFIG.fullName,
      url: siteUrl,
      description: SITE_CONFIG.shortDescription,
      inLanguage: 'en-US',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      description: SITE_CONFIG.shortDescription,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_CONFIG.name,
      operatingSystem: 'Web, iOS, Android',
      applicationCategory: 'BusinessApplication, FinancialApplication',
      description: SITE_CONFIG.fullDescription,
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'INR',
      },
      featureList: [
        'Deterministic GST calculation with CGST/SGST 50:50 split and 100% IGST routing',
        'Customer party master with GSTIN and state code verification',
        'Reusable item catalog with HSN codes and GST slab picker',
        'Sequential invoice numbering and finalized bill immutability',
        'Standard A4 printable tax invoice format with amount in words',
        'Real-time synchronization between Next.js Web POS and React Native Expo Mobile',
      ],
      author: {
        '@type': 'Organization',
        name: SITE_CONFIG.author,
      },
    },
  ];

  const { isLoading } = useLoading();
  const heroCtxRef = useRef<gsap.Context | null>(null);
  const typoAnimRef = useRef<{ cleanup: () => void } | null>(null);
  const scrollCtxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (heroCtxRef.current) {
      heroCtxRef.current.revert();
      heroCtxRef.current = null;
    }
    if (typoAnimRef.current) {
      typoAnimRef.current.cleanup();
      typoAnimRef.current = null;
    }
    if (scrollCtxRef.current) {
      scrollCtxRef.current.revert();
      scrollCtxRef.current = null;
    }

    heroCtxRef.current = createHeroEntranceTimeline(rootRef.current);
    typoAnimRef.current = initHeroTypographyAnimation(rootRef.current);
    scrollCtxRef.current = initScrollStory(rootRef.current);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      heroCtxRef.current?.revert();
      heroCtxRef.current = null;
      typoAnimRef.current?.cleanup();
      typoAnimRef.current = null;
      scrollCtxRef.current?.revert();
      scrollCtxRef.current = null;
    };
  }, [isLoading]);

  return (
    <SmoothScrollProvider>
      <LoadingScreen />

      <div
        ref={rootRef}
        className="min-h-screen text-zinc-900 selection:bg-zinc-900 selection:text-white relative isolate overflow-clip font-sans bg-[#FBF9F4]"
      >
        <EditorialBackgroundSystem />
        <JsonLd data={jsonLdSchemas} />
        <MarketingNav />

        {/* ========================================================
            01. HERO SECTION: EDITORIAL HEADLINE & VALUE PROPOSITION
           ======================================================== */}
        <section className="hero-section relative min-h-screen flex flex-col justify-center items-center pt-24 sm:pt-28 pb-14 sm:pb-20 px-4 sm:px-6 overflow-hidden border-b border-black/[0.06]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-emerald-500/5 via-blue-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

          <div className="max-w-5xl mx-auto relative z-10 space-y-8 hero-text-container text-center flex flex-col items-center">
            {/* Display Headline */}
            <div className="hero-headline-wrapper space-y-1.5 sm:space-y-3 max-w-4xl lg:max-w-5xl cursor-default select-none mx-auto py-1">
              <h1 className="text-5xl sm:text-7xl lg:text-[5.25rem] xl:text-[5.75rem] font-extrabold tracking-tight leading-[1.10] sm:leading-[1.07] text-center text-[#1E1B4B]">
                {/* Line 1: Effortless GST */}
                <div className="hero-headline-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 opacity-0">
                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="effortless"
                    data-text-color="#FFFFFF"
                    data-base-color="#0A0A0A"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#10B981' }}
                    />
                    <span className="word-text relative z-10 text-[#0A0A0A] font-extrabold tracking-tight">
                      Effortless
                    </span>
                  </span>

                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="gst"
                    data-text-color="#FFFFFF"
                    data-base-color="#0A0A0A"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#2563EB' }}
                    />
                    <span className="word-text relative z-10 text-[#0A0A0A] font-extrabold tracking-tight">
                      GST
                    </span>
                  </span>
                </div>

                {/* Line 2: Invoicing for */}
                <div className="hero-headline-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-0.5 opacity-0">
                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="invoicing"
                    data-text-color="#FFFFFF"
                    data-base-color="#0A0A0A"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#F59E0B' }}
                    />
                    <span className="word-text relative z-10 text-[#0A0A0A] font-extrabold tracking-tight">
                      Invoicing
                    </span>
                  </span>

                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="for"
                    data-text-color="#FFFFFF"
                    data-base-color="#0A0A0A"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#6366F1' }}
                    />
                    <span className="word-text relative z-10 text-[#0A0A0A] font-extrabold tracking-tight">
                      for
                    </span>
                  </span>
                </div>

                {/* Line 3: Indian Retailers. */}
                <div className="hero-headline-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-0.5 opacity-0">
                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="indian"
                    data-text-color="#FFFFFF"
                    data-base-color="#0A0A0A"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#EC4899' }}
                    />
                    <span className="word-text relative z-10 text-[#0A0A0A] font-extrabold tracking-tight">
                      Indian
                    </span>
                  </span>

                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="retailers"
                    data-text-color="#FFFFFF"
                    data-base-color="#0A0A0A"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#10B981' }}
                    />
                    <span className="word-text relative z-10 text-[#0A0A0A] font-extrabold tracking-tight">
                      Retailers.
                    </span>
                  </span>
                </div>
              </h1>
            </div>

            {/* Clear Value Proposition */}
            <div className="max-w-2xl mx-auto space-y-6 pt-1">
              <p className="hero-copy text-base sm:text-lg text-zinc-600 leading-relaxed font-normal text-center" style={{ opacity: 0 }}>
                Generate GST-compliant tax invoices in 30 seconds. Automatic CGST, SGST, and IGST tax splits, reusable party ledgers, item catalogs with HSN codes, and instant A4 PDF export.
              </p>

              <div className="hero-cta flex flex-wrap items-center justify-center gap-3.5" style={{ opacity: 0 }}>
                <Link
                  href="/items/new"
                  className="btn-primary px-7 py-3.5 text-xs font-semibold tracking-wide shadow-md shadow-zinc-950/10 inline-flex items-center"
                >
                  <span>Launch Billing Desk</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5 opacity-80" />
                </Link>
                <Link
                  href="#workflow"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('workflow');
                    if (el) {
                      scrollTo(el, { offset: -80 });
                      window.history.pushState(null, '', '#workflow');
                    }
                  }}
                  className="btn-secondary px-6 py-3.5 text-xs font-semibold cursor-pointer shadow-sm hover:shadow inline-flex items-center border border-zinc-300/90 bg-white/95 hover:bg-zinc-50"
                >
                  <span>How Billing Works</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5 opacity-60" />
                </Link>
              </div>

              {/* Quick Feature Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Intra/Inter-State Tax Split
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Standard A4 Printable PDF
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  100% Web Browser Ready
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            01. PRODUCT DASHBOARD SHOWCASE
           ======================================================== */}
        <section id="product" className="product-stage-section relative pt-6 sm:pt-10 pb-8 sm:pb-12 px-4 sm:px-6 border-b border-black/[0.06] scroll-mt-20">
          <div className="max-w-6xl mx-auto relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {'// 01. INTERACTIVE GST DASHBOARD & SALES LEDGER'}
              </span>
              <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                Live Simulation • Click buttons to test
              </span>
            </div>
            <div className="hero-product-stage">
              <InteractiveHeroDashboard />
            </div>
          </div>
        </section>

        {/* ========================================================
            02. COMPLETE 4-STEP BILLING WORKFLOW
           ======================================================== */}
        <section id="workflow" className="section-workflow relative z-10 py-16 sm:py-20 px-4 sm:px-6 border-b border-black/[0.06] scroll-mt-20">
          <div className="max-w-6xl mx-auto space-y-8 relative z-10">
            <div className="workflow-header max-w-2xl space-y-2">
              <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                {'// 02. END-TO-END BILLING WORKFLOW'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
                How an Invoice is Generated in 30 Seconds
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Step through the four essential phases of modern GST retail invoicing: from selecting customer tax residency to instantaneous A4 print and WhatsApp dispatch.
              </p>
            </div>

            <InteractiveDemonstrator />
          </div>
        </section>

        {/* ========================================================
            03. STATUTORY TAX CALCULATION ENGINE
           ======================================================== */}
        <section id="tax-engine" className="py-16 sm:py-20 px-4 sm:px-6 border-b border-black/[0.06] scroll-mt-20">
          <div className="max-w-6xl mx-auto space-y-8">
            <GstCalculationEngine />
          </div>
        </section>

        {/* ========================================================
            04. AUTHENTIC A4 TAX INVOICE SHOWCASE
           ======================================================== */}
        <section id="invoice-showcase" className="py-16 sm:py-20 px-4 sm:px-6 border-b border-black/[0.06] scroll-mt-20">
          <div className="max-w-6xl mx-auto space-y-8">
            <AuthenticInvoiceShowcase />
          </div>
        </section>

        {/* ========================================================
            05. REAL ASSET: CODE-A-THON HERITAGE
           ======================================================== */}
        <section id="heritage" className="codeathon-section py-16 sm:py-20 px-4 sm:px-6 border-b border-black/[0.06] scroll-mt-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="codeathon-copy-col lg:col-span-5 space-y-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-semibold shadow-sm w-fit">
                <Code2 className="w-4 h-4 text-amber-600" />
                <span>CODE-A-THON HERITAGE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                Born Under Hackathon Pressure.
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                VyaaparGST was engineered to solve a concrete real-world challenge: empowering small retail businesses to escape spreadsheet errors and manual bill preparation with an automated, compliant web billing system.
              </p>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                Built with strict TypeScript domain contracts, deterministic tax math, and instant browser-based A4 tax invoice generation.
              </p>
              <div className="space-y-3 font-mono text-xs font-semibold text-zinc-800 pt-1">
                <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-black/[0.06] flex items-center justify-between">
                  <span>STATUTORY GST FORMULA</span>
                  <span className="bg-zinc-900 text-white px-2.5 py-0.5 rounded text-xs">100% VERIFIED</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-black/[0.06] flex items-center justify-between">
                  <span>WEB CLIENT RUNTIME</span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs">NEXT.JS 16 READY</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 relative">
              <TiltCard maxTilt={14} perspective={1200} className="w-full">
                <div className="codeathon-visual-frame bento-card p-4 sm:p-6 shadow-xl bg-white/90 backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
                  <div className="relative aspect-square max-h-[380px] mx-auto w-full rounded-2xl bg-zinc-50/70 p-4 overflow-hidden border border-black/[0.06] flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="GST Billing System Logo and Brand Mark"
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      className="object-contain p-2"
                      priority
                    />
                  </div>
                  <div className="pt-4 flex items-center justify-between text-zinc-800 text-xs font-medium">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      Official Architecture Artifact
                    </span>
                    <span className="text-zinc-500 font-mono text-xs">Next.js Web Operations Core</span>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* ========================================================
            07. CREATOR & ARCHITECT: TANISH
           ======================================================== */}
        <section className="tanish-section py-16 sm:py-20 px-4 sm:px-6 border-b border-black/[0.06]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 relative order-2 lg:order-1 flex justify-center">
              <TiltCard maxTilt={18} perspective={1000} className="max-w-xs w-full">
                <div className="tanish-portrait-frame bento-card p-3 shadow-xl bg-white/90 backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-zinc-100 border border-black/[0.06]">
                    <Image
                      src="/tanish.jpg"
                      alt="Tanish - Creator & Architect"
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <div className="font-bold text-zinc-900 text-lg">Tanish</div>
                    <div className="text-xs text-zinc-500 font-medium mt-0.5">
                      Lead Architect & Engineer
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>

            <div className="tanish-copy-col lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {'// 07. ENGINEERING CONTEXT'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                Engineered with Discipline.{' '}
                <Highlight variant="green">Delivered for Speed.</Highlight>
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed italic font-normal">
                &ldquo;Real-world billing systems cannot afford mathematical drift or confusing tax configurations. VyaaparGST guarantees deterministic GST calculation, compliant A4 invoicing, and zero lag in any web browser.&rdquo;
              </p>
              <div className="flex items-center gap-4 pt-2 text-xs font-medium">
                <div className="p-3.5 rounded-xl bg-white/85 border border-black/[0.06] shadow-sm backdrop-blur-sm">
                  <span className="text-zinc-400 block text-xs font-mono">REPOSITORY</span>
                  <span className="text-zinc-900 font-semibold">Tanishkagathara7</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/85 border border-black/[0.06] shadow-sm backdrop-blur-sm">
                  <span className="text-zinc-400 block text-xs font-mono">APPLICATION</span>
                  <span className="text-zinc-900 font-semibold">VyaaparGST Suite</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            08. FREQUENTLY ASKED QUESTIONS
           ======================================================== */}
        <section id="faq" className="section-faq py-16 sm:py-20 px-4 sm:px-6 border-b border-black/[0.06] scroll-mt-20">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="faq-header text-left space-y-2">
              <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                {'// 08. FREQUENTLY ASKED QUESTIONS'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
                GST Billing & Compliance FAQ
              </h2>
              <p className="text-sm text-zinc-600">
                Straight answers about tax splits, invoice numbering, printing, and cross-platform synchronization.
              </p>
            </div>

            <FAQAccordion />
          </div>
        </section>

        {/* ========================================================
            09. FINAL CALL TO ACTION
           ======================================================== */}
        <section className="section-cta py-16 sm:py-20 px-4 sm:px-6 border-b border-black/[0.06] relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-left relative z-10 space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
              <span className="cta-headline-line block overflow-hidden">
                Ready to bill faster?
              </span>
              <span className="cta-headline-line block overflow-hidden mt-1">
                Create your first <Highlight variant="blue">GST invoice today.</Highlight>
              </span>
            </h2>

            <p className="cta-subhead max-w-xl text-base text-zinc-600 leading-relaxed font-normal">
              Launch the desktop billing counter directly or sign in to access your customer khata ledger and past invoices.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/items/new"
                className="cta-button btn-primary px-8 py-4 text-xs font-semibold tracking-wide shadow-md shadow-zinc-950/10 hover:shadow-lg transition-all inline-flex items-center"
              >
                <span>Create First GST Bill</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/login"
                className="cta-button btn-secondary px-8 py-4 text-xs font-semibold shadow-xs hover:shadow transition-all inline-flex items-center"
              >
                <span>Sign In to Store</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5 opacity-60" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            10. TECHNICAL FOOTER
           ======================================================== */}
        <MarketingFooter />
      </div>
    </SmoothScrollProvider>
  );
}

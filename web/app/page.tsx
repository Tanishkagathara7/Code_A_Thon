'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  Terminal,
  Smartphone,
  Monitor,
  CheckCircle2,
  Database,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { Highlight } from '@/components/marketing/Highlight';
import { InteractiveDemonstrator } from '@/components/marketing/InteractiveDemonstrator';
import { ArchitectureDiagram } from '@/components/marketing/ArchitectureDiagram';
import { HeroProductShowcase } from '@/components/marketing/HeroProductShowcase';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { SmoothScrollProvider } from '@/components/marketing/SmoothScrollProvider';
import { createHeroEntranceTimeline } from '@/lib/animations/hero';
import { initScrollStory } from '@/lib/animations/scroll';
import { initHeroTypographyAnimation } from '@/lib/animations/heroTypography';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_CONFIG, getSiteUrl } from '@/lib/seo';

export default function MarketingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const siteUrl = getSiteUrl();

  // Valid Schema.org structured data declarations
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
      applicationCategory: 'BusinessApplication, DeveloperApplication',
      description: SITE_CONFIG.fullDescription,
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      featureList: [
        'Real-time state synchronization between Next.js and React Native',
        'OpenRouter AI Gateway task synthesis and categorization',
        'Cryptographic JWT Bearer token authentication and SecureStore integration',
        'Offline-first mobile agility with React Native Expo SDK 57',
        'High-density operational dashboard and domain items CRUD pipeline',
      ],
      author: {
        '@type': 'Organization',
        name: SITE_CONFIG.author,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is state synchronized between Next.js and React Native?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Both clients consume a unified Node.js / Express REST API backed by MongoDB Atlas. Authentication is maintained via cryptographically verified JWT tokens (stored in secure browser storage for web, and expo-secure-store for native mobile). Cache invalidation triggers immediate re-fetches for consistent operational metrics across both platforms.',
          },
        },
        {
          '@type': 'Question',
          name: 'What AI gateway capabilities are natively integrated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The shared backend incorporates OpenRouter AI Gateway integration. It executes structured entity summarization, priority classification, and action plan generation across your operations items with strict rate-limiting and token usage tracking.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can this architecture pivot to new hackathon problem statements?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The core data model is designed around extensible domain entities, automated file storage (via Multer), notification routing, and dynamic analytics. New domain attributes can be mapped in the shared contracts without altering the base cross-platform plumbing.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the mobile application support native offline-first workflows?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The React Native Expo mobile client utilizes Reanimated 4.5.1 gesture handling, persistent secure credentials, local caching, and automated network detection to provide seamless mobile agility in spotty network environments.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the web application production-ready and accessible?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The web client is built on Next.js App Router with strict WCAG AA contrast ratios, keyboard navigation, full semantic HTML5 elements, and dynamic client-side rendering with motion fallbacks for users preferring reduced motion.',
          },
        },
      ],
    },
  ];

  useEffect(() => {
    const heroCtx = createHeroEntranceTimeline(rootRef.current);
    const scrollCtx = initScrollStory(rootRef.current);
    const typoAnim = initHeroTypographyAnimation(rootRef.current);

    return () => {
      heroCtx?.revert();
      scrollCtx?.revert();
      typoAnim?.cleanup();
    };
  }, []);

  return (
    <SmoothScrollProvider>
      <div
        ref={rootRef}
        className="min-h-screen text-zinc-900 selection:bg-zinc-900 selection:text-white relative font-sans bg-[#FAFAFA]"
      >
        {/* Schema.org Structured Data */}
        <JsonLd data={jsonLdSchemas} />

        <MarketingNav />

        {/* ========================================================
            01. HERO SECTION: BENTO COMPOSITION & EDITORIAL TYPOGRAPHY
           ======================================================== */}
        <section className="hero-section relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 overflow-hidden border-b border-black/[0.06]">
          {/* Subtle architectural dot grid */}
          <div className="absolute inset-0 tech-dots opacity-[0.25] pointer-events-none -z-10" />

          {/* Subtle ambient lighting accent */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/5 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

          <div className="max-w-5xl mx-auto relative z-10 space-y-8 hero-text-container text-center flex flex-col items-center">
            {/* Editorial Display Headline — Unified Color with Kinetic Multi-Color Animated Transitions */}
            <div className="hero-headline-wrapper space-y-2 sm:space-y-4 max-w-5xl cursor-default select-none mx-auto py-2">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.08] sm:leading-[1.06] text-center text-[#1E1B4B]">
                {/* Line 1: Precision Operations */}
                <div className="hero-headline-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3.5">
                  {/* Precision */}
                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="precision"
                    data-text-color="#FFFFFF"
                    data-base-color="#1E1B4B"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#2563EB' }}
                    />
                    <span className="word-text relative z-10 text-[#1E1B4B] font-extrabold tracking-tight">
                      Precision
                    </span>
                  </span>

                  {/* Operations */}
                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="operations"
                    data-text-color="#FFFFFF"
                    data-base-color="#1E1B4B"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#EC4899' }}
                    />
                    <span className="word-text relative z-10 text-[#1E1B4B] font-extrabold tracking-tight">
                      Operations
                    </span>
                  </span>
                </div>

                {/* Line 2: on Desktop */}
                <div className="hero-headline-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 mt-0.5 sm:mt-1">
                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="on-1"
                    data-text-color="#FFFFFF"
                    data-base-color="#1E1B4B"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#10B981' }}
                    />
                    <span className="word-text relative z-10 text-[#1E1B4B] font-extrabold tracking-tight">
                      on
                    </span>
                  </span>

                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="desktop"
                    data-text-color="#FFFFFF"
                    data-base-color="#1E1B4B"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#F59E0B' }}
                    />
                    <span className="word-text relative z-10 text-[#1E1B4B] font-extrabold tracking-tight">
                      Desktop
                    </span>
                  </span>
                </div>

                {/* Line 3: Native Velocity on Mobile. */}
                <div className="hero-headline-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 mt-0.5 sm:mt-1">
                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="native"
                    data-text-color="#FFFFFF"
                    data-base-color="#1E1B4B"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#6366F1' }}
                    />
                    <span className="word-text relative z-10 text-[#1E1B4B] font-extrabold tracking-tight">
                      Native
                    </span>
                  </span>

                  {/* Velocity */}
                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="velocity"
                    data-text-color="#FFFFFF"
                    data-base-color="#1E1B4B"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#8B5CF6' }}
                    />
                    <span className="word-text relative z-10 text-[#1E1B4B] font-extrabold tracking-tight">
                      Velocity
                    </span>
                  </span>

                  {/* on */}
                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="on-2"
                    data-text-color="#FFFFFF"
                    data-base-color="#1E1B4B"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#06B6D4' }}
                    />
                    <span className="word-text relative z-10 text-[#1E1B4B] font-extrabold tracking-tight">
                      on
                    </span>
                  </span>

                  {/* Mobile. */}
                  <span
                    className="hero-anim-word relative inline-block px-1.5 sm:px-2 py-0.5 rounded-xl sm:rounded-2xl"
                    data-word="mobile"
                    data-text-color="#FFFFFF"
                    data-base-color="#1E1B4B"
                  >
                    <span
                      className="word-highlight-bg absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
                      style={{ backgroundColor: '#10B981' }}
                    />
                    <span className="word-text relative z-10 text-[#1E1B4B] font-extrabold tracking-tight">
                      Mobile.
                    </span>
                  </span>
                </div>
              </h1>
            </div>

            {/* Value Proposition & CTAs (Centered, Balanced Rhythm) */}
            <div className="max-w-2xl mx-auto space-y-6 pt-1">
              <p className="hero-copy text-base sm:text-lg text-zinc-600 leading-relaxed font-normal text-center">
                Authoritative central engine powering high-density desktop operations and native mobile execution. Zero schema drift, instant biometric tokens, and continuous cryptographic state verification.
              </p>

              <div className="hero-cta flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href="/signup"
                  className="btn-primary px-7 py-3.5 text-xs font-semibold tracking-wide shadow-md shadow-zinc-950/10"
                >
                  <span>Launch Web Workspace</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="btn-secondary px-6 py-3.5 text-xs font-semibold cursor-pointer shadow-sm hover:shadow"
                  aria-label="View interactive product preview"
                >
                  <span>View Product</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5 opacity-60" />
                </button>
              </div>
            </div>

            {/* Technical Verification Strip (Centered Pills) */}
            <div className="hero-metadata flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-mono font-medium text-zinc-600">
              <span className="glass-pill px-3 py-1 rounded-full border border-black/[0.06] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ZERO-DRIFT JWT AUTH
              </span>
              <span className="glass-pill px-3 py-1 rounded-full border border-black/[0.06] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> NEXT.JS 14 APP ROUTER
              </span>
              <span className="glass-pill px-3 py-1 rounded-full border border-black/[0.06] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> EXPO SDK 57 MOBILE
              </span>
              <span className="glass-pill px-3 py-1 rounded-full border border-black/[0.06] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> OPENROUTER AI GATEWAY
              </span>
            </div>

            {/* Product Stage Preview */}
            <div className="hero-product-stage">
              <HeroProductShowcase
                isPreviewOpen={isPreviewOpen}
                onOpenPreview={() => setIsPreviewOpen(true)}
                onClosePreview={() => setIsPreviewOpen(false)}
              />
            </div>
          </div>
        </section>

        {/* ========================================================
            02. EDITORIAL STATEMENT: CINEMATIC CONTRAST
           ======================================================== */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 bg-white border-b border-black/[0.06]">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-600">
              // 02. ARCHITECTURAL PHILOSOPHY
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 leading-tight">
              BUILT FOR HIGH VELOCITY.{' '}
              <br />
              ENGINEERED FOR{' '}
              <Highlight variant="green">ZERO DRIFT.</Highlight>
            </h2>
            <p className="text-base sm:text-xl text-zinc-600 leading-relaxed max-w-3xl font-normal">
              We rejected the compromise of single-codebase wrappers. Desktop operations demand data density, keyboard efficiency, and batch processing. Mobile operations demand biometric gestures and zero-latency caching. APP gives both clients direct access to an authoritative central engine.
            </p>
          </div>
        </section>

        {/* ========================================================
            03. PRODUCT EXPERIENCE: BENTO GRID CLIENT PARITY
           ======================================================== */}
        <section id="product" className="py-24 sm:py-32 px-4 sm:px-6 bg-zinc-50/70 border-b border-black/[0.06]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="max-w-3xl space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
                // 03. CLIENT PURPOSE & PARITY
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
                TWO DEDICATED CLIENTS. ONE CORE API.
              </h2>
            </div>

            {/* Asymmetric 2-Column Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Desktop Client Bento Card */}
              <div className="lg:col-span-6 bento-card p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-sm">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    Next.js 14 Desktop Center
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Designed for heavy operational density. Filter hundreds of domain items, manage multi-megabyte file uploads via Multer, run batch updates, and inspect full telemetry dashboards.
                  </p>
                </div>
                <div className="pt-6 border-t border-black/[0.06] space-y-2.5 text-xs font-medium text-zinc-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Next.js App Router + React 19 Hydration</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Reactive AuthContext & Token Interception</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Accessible Keyboard Navigation & Modals</span>
                  </div>
                </div>
              </div>

              {/* Mobile Client Bento Card */}
              <div className="lg:col-span-6 bento-card p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-sm">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    React Native Expo Mobile
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Built for gesture-native speed on iOS and Android. Incorporates biometric authorization, fluid Reanimated 4.5.1 interactions, secure persistent credential storage, and instant cache updates.
                  </p>
                </div>
                <div className="pt-6 border-t border-black/[0.06] space-y-2.5 text-xs font-medium text-zinc-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Expo Router v57 File System Navigation</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>expo-secure-store Cryptographic Credentials</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Offline-First State & Network Recovery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            04. SYNCHRONIZATION CORRIDOR: CINEMATIC DEPTH
           ======================================================== */}
        <section id="platform" className="sync-section py-24 sm:py-32 px-4 sm:px-6 bg-white border-b border-black/[0.06]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-left max-w-3xl space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
                // 04. SYNCHRONIZATION CORRIDOR
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
                ONE BACKEND. TWO CLIENTS. ZERO DRIFT.
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Watch desktop state changes synchronize with mobile native clients in under 35ms through atomic Mongoose mutations.
              </p>
            </div>

            {/* Visual Docking Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center max-w-5xl">
              {/* Desktop Dispatch Preview */}
              <div className="sync-desktop-card md:col-span-7 bento-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 text-xs font-semibold text-zinc-800">
                  <span>CLIENT A: DESKTOP DISPATCH</span>
                  <span className="font-mono text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">Port 3000</span>
                </div>
                <div className="space-y-2 font-mono text-xs text-zinc-900 bg-zinc-50 p-4 rounded-xl border border-black/[0.06]">
                  <div className="text-zinc-500">// Dispatching item state change</div>
                  <div className="font-semibold">mutateItem(&apos;66f1...&apos;, &#123; status: &apos;resolved&apos; &#125;)</div>
                  <div className="text-emerald-600 font-semibold">✓ Express REST confirmed: HTTP 200 OK</div>
                </div>
              </div>

              {/* Mobile Sync Preview */}
              <div className="sync-mobile-card md:col-span-5 bento-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 text-xs font-semibold text-zinc-800">
                  <span>CLIENT B: MOBILE SYNC</span>
                  <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">Expo 57</span>
                </div>
                <div className="space-y-2 font-mono text-xs text-zinc-900 bg-zinc-50 p-4 rounded-xl border border-black/[0.06]">
                  <div className="text-zinc-500">// Revalidated via cache invalidation</div>
                  <div className="font-semibold">onItemCacheInvalidate(&apos;66f1...&apos;)</div>
                  <div className="text-emerald-600 font-semibold">✓ Native list updated in &lt; 35ms</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            05. OPERATIONAL WORKFLOW: INTERACTIVE BENTO DEMO
           ======================================================== */}
        <section id="workflow" className="py-24 sm:py-32 px-4 sm:px-6 bg-zinc-50/70 border-b border-black/[0.06]">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="max-w-2xl space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
                // 05. INTERACTIVE WORKFLOW
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
                END-TO-END EXECUTION WITH REAL PAYLOADS
              </h2>
            </div>

            <InteractiveDemonstrator />
          </div>
        </section>

        {/* ========================================================
            06. REAL ASSET: CODE-A-THON HERITAGE
           ======================================================== */}
        <section id="heritage" className="codeathon-section py-24 sm:py-32 px-4 sm:px-6 bg-white border-b border-black/[0.06]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-semibold shadow-sm">
                <Code2 className="w-4 h-4 text-amber-600" />
                <span>CODE-A-THON HERITAGE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                BORN UNDER HACKATHON PRESSURE.
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                APP was conceived and built to solve a concrete engineering challenge: how to architect a production-ready, cross-platform system at breakneck speed without introducing architectural drift or sacrificing mobile security.
              </p>
              <div className="space-y-3 font-mono text-xs font-semibold text-zinc-800">
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/[0.06] flex items-center justify-between">
                  <span>ARCHITECTURAL PARITY</span>
                  <span className="bg-zinc-900 text-white px-2.5 py-0.5 rounded text-[11px]">100% VERIFIED</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/[0.06] flex items-center justify-between">
                  <span>MOBILE RUNTIME</span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">EXPO 57 SAFE</span>
                </div>
              </div>
            </div>

            {/* Real Code-A-Thon Asset Frame */}
            <div className="lg:col-span-7 relative">
              <div className="codeathon-visual-frame bento-card p-4 sm:p-6 shadow-xl">
                <div className="relative aspect-[2083/755] w-full rounded-xl bg-zinc-50 p-2 overflow-hidden border border-black/[0.06]">
                  <Image
                    src="/code.png"
                    alt="APP multi-platform engineering architecture diagram illustrating Next.js, React Native Expo, and Express REST integration"
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-contain p-2"
                    priority
                  />
                </div>
                <div className="pt-4 flex items-center justify-between text-zinc-800 text-xs font-medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    Official Architecture Artifact
                  </span>
                  <span className="text-zinc-500 font-mono text-[11px]">Next.js + Expo Shared Core</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            07. REAL ASSET: TANISH (CREATOR & ARCHITECT)
           ======================================================== */}
        <section className="tanish-section py-24 sm:py-32 px-4 sm:px-6 bg-zinc-50/70 border-b border-black/[0.06]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Real Tanish portrait in sleek frame */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="tanish-portrait-frame bento-card p-3 max-w-xs mx-auto shadow-xl">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-zinc-100 border border-black/[0.06]">
                  <Image
                    src="/tanish.jpg"
                    alt="Tanish - Creator & Architect"
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <div className="font-bold text-zinc-900 text-lg">Tanish</div>
                  <div className="text-xs text-zinc-500 font-medium mt-0.5">
                    Lead Architect & Engineer
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">
                // 07. ENGINEERING CONTEXT
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                ENGINEERED WITH DISCIPLINE.{' '}
                <Highlight variant="green">DELIVERED FOR SPEED.</Highlight>
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed italic font-normal">
                &ldquo;A great cross-platform product is not a single codebase stretched across two form factors. It is an authoritative backend and shared data contract powering two unapologetically native client experiences.&rdquo;
              </p>
              <div className="flex items-center gap-4 pt-2 text-xs font-medium">
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-sm">
                  <span className="text-zinc-400 block text-[10px] font-mono">REPOSITORY</span>
                  <span className="text-zinc-900 font-semibold">Tanishkagathara7</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-sm">
                  <span className="text-zinc-400 block text-[10px] font-mono">APPLICATION</span>
                  <span className="text-zinc-900 font-semibold">APP Multi-Platform Core</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            08. TECHNICAL ARCHITECTURE: TOPOLOGY BENTO
           ======================================================== */}
        <section id="architecture" className="py-24 sm:py-32 px-4 sm:px-6 bg-white border-b border-black/[0.06]">
          <div className="max-w-6xl mx-auto space-y-8">
            <ArchitectureDiagram />
          </div>
        </section>

        {/* ========================================================
            09. FAQ SECTION: BENTO ACCORDION
           ======================================================== */}
        <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 bg-zinc-50/70 border-b border-black/[0.06]">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-left space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
                // 09. FREQUENTLY ASKED QUESTIONS
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
                TECHNICAL FAQ
              </h2>
            </div>

            <FAQAccordion />
          </div>
        </section>

        {/* ========================================================
            10. FINAL CTA: CINEMATIC BENTO FINALE
           ======================================================== */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 bg-white border-b border-black/[0.06] relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-left relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DEPLOYMENT READY</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 leading-tight">
              BUILT ONCE. <br />
              DESIGNED FOR <Highlight variant="blue">EVERYWHERE.</Highlight>
            </h2>

            <p className="max-w-xl text-base text-zinc-600 leading-relaxed font-normal">
              Launch the Next.js desktop operations center or connect via native mobile credentials to experience synchronized real-time workflows.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/signup"
                className="btn-primary px-8 py-4 text-xs font-semibold tracking-wide"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/login"
                className="btn-secondary px-8 py-4 text-xs font-semibold"
              >
                <span>Sign in to Account</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            11. TECHNICAL FOOTER
           ======================================================== */}
        <footer className="bg-zinc-50 py-12 px-4 sm:px-6 text-zinc-700 text-xs font-medium border-t border-black/[0.06]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <span className="font-semibold text-zinc-900">APP Multi-Platform Architecture</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/login" className="hover:text-zinc-950 transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="hover:text-zinc-950 transition-colors">
                Register
              </Link>
              <a href="#product" className="hover:text-zinc-950 transition-colors">
                Product
              </a>
              <a href="#architecture" className="hover:text-zinc-950 transition-colors">
                Architecture
              </a>
              <a href="#faq" className="hover:text-zinc-950 transition-colors">
                FAQ
              </a>
            </div>

            <div className="text-zinc-400 font-mono text-[11px]">
              © {new Date().getFullYear()} APP Engine • All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
}

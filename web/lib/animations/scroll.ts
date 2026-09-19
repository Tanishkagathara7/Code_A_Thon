'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION, isReducedMotion, isMobileDevice } from './motionSystem';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * initScrollStory
 * Orchestrates scroll-driven storytelling across all 11 sections of the landing page:
 * - 01 & 01.5: Hero Parallax & Product Tablet Elevation
 * - 02: Architectural Philosophy (Line reveal + Highlight wipe)
 * - 03: Client Purpose & Parity (Staggered bento card entrance with micro-offsets)
 * - 04: Synchronization Corridor (Bilateral docking of Desktop & Mobile cards)
 * - 05: Operational Workflow Demo (Interactive panel entrance & telemetry scan)
 * - 06: Hackathon Heritage (Masked diagram reveal with restrained scale transition)
 * - 07: Creator / Engineer (Editorial framed portrait reveal + quote reveal)
 * - 08: Central Engine Topology (Bento node stagger + SVG line progressive draw)
 * - 09: Technical FAQ (Clean accordion container entrance)
 * - 10: Final CTA (Masked headline entrance + button stagger)
 */
export const initScrollStory = (rootContainer: HTMLElement | null) => {
  if (!rootContainer || typeof window === 'undefined') return null;
  if (isReducedMotion()) return null;

  const ctx = gsap.context(() => {
    const isMobile = isMobileDevice();

    // =========================================================================
    // 01 & 01.5 HERO & PRODUCT STAGE SCROLL DEPTH
    // =========================================================================
    if (!isMobile) {
      const heroText = document.querySelector('.hero-text-container');
      if (heroText) {
        gsap.to(heroText, {
          y: -50,
          opacity: 0.88,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom 20%',
            scrub: 1,
          },
        });
      }

      const productHeader = document.querySelector('.product-header');
      if (productHeader) {
        gsap.fromTo(
          productHeader,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: MOTION.ease.smooth,
            scrollTrigger: {
              trigger: '.product-stage-section',
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      const tabletBody = document.querySelector('.tablet-3d-body');
      if (tabletBody) {
        gsap.fromTo(
          tabletBody,
          {
            y: 20,
            scale: 0.985,
          },
          {
            y: -25,
            scale: 1,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: '.product-stage-section',
              start: 'top 85%',
              end: 'bottom 40%',
              scrub: 1.2,
            },
          }
        );
      }
    }

    // =========================================================================
    // 02. ARCHITECTURAL PHILOSOPHY (SECTION A)
    // =========================================================================
    const sec02 = document.querySelector('.section-philosophy');
    if (sec02) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec02,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      const eyebrow = sec02.querySelector('.philosophy-eyebrow');
      const lines = sec02.querySelectorAll('.philosophy-heading-line');
      const highlight = sec02.querySelector('.philosophy-highlight');
      const body = sec02.querySelector('.philosophy-body');

      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: MOTION.ease.snappy }
        );
      }
      if (lines.length > 0) {
        tl.fromTo(
          lines,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.75,
            ease: MOTION.ease.smooth,
          },
          eyebrow ? '-=0.2' : '0'
        );
      }
      if (highlight) {
        tl.fromTo(
          highlight,
          { scale: 0.95, opacity: 0.8 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' },
          '-=0.3'
        );
      }
      if (body) {
        tl.fromTo(
          body,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, ease: MOTION.ease.smooth },
          '-=0.35'
        );
      }
    }

    // =========================================================================
    // 03. CLIENT PURPOSE & PARITY (SECTION B)
    // =========================================================================
    const sec03 = document.querySelector('.section-parity');
    if (sec03) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec03,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });

      const header = sec03.querySelector('.parity-header');
      const cards = sec03.querySelectorAll('.parity-card');

      if (header) {
        tl.fromTo(
          header,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: MOTION.ease.smooth }
        );
      }
      if (cards.length > 0) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 35, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.14,
            duration: 0.7,
            ease: MOTION.ease.smooth,
          },
          header ? '-=0.25' : '0'
        );
      }
    }

    // =========================================================================
    // 04. SYNCHRONIZATION CORRIDOR (SECTION C)
    // Bilateral docking cards entering smoothly from opposing sides
    // =========================================================================
    const sec04 = document.querySelector('.sync-section');
    if (sec04) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec04,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      const syncHeader = sec04.querySelector('.sync-header');
      if (syncHeader) {
        tl.fromTo(
          syncHeader,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: MOTION.ease.smooth }
        );
      }

      const desktopCard = document.querySelector('.sync-desktop-card');
      if (desktopCard) {
        tl.fromTo(
          desktopCard,
          { x: isMobile ? 0 : -35, y: isMobile ? 25 : 0, opacity: 0 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: MOTION.ease.smooth,
          },
          '-=0.2'
        );
      }
      const mobileCard = document.querySelector('.sync-mobile-card');
      if (mobileCard) {
        tl.fromTo(
          mobileCard,
          { x: isMobile ? 0 : 35, y: isMobile ? 25 : 0, opacity: 0 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: MOTION.ease.smooth,
          },
          '-=0.55'
        );
      }
    }

    // =========================================================================
    // 05. INTERACTIVE WORKFLOW (SECTION D)
    // =========================================================================
    const sec05 = document.querySelector('.section-workflow');
    if (sec05) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec05,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      const wfHeader = sec05.querySelector('.workflow-header');
      const wfContainer = sec05.querySelector('.workflow-container');

      if (wfHeader) {
        tl.fromTo(
          wfHeader,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: MOTION.ease.smooth }
        );
      }
      if (wfContainer) {
        tl.fromTo(
          wfContainer,
          { opacity: 0, y: 30, scale: 0.99 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: MOTION.ease.smooth,
          },
          wfHeader ? '-=0.2' : '0'
        );
      }
    }

    // =========================================================================
    // 06. REAL ASSET: CODE-A-THON HERITAGE (SECTION E)
    // Masked reveal of the official architecture diagram
    // =========================================================================
    const sec06 = document.querySelector('.codeathon-section');
    if (sec06) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec06,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });

      const copyCol = sec06.querySelector('.codeathon-copy-col');
      if (copyCol) {
        tl.fromTo(
          copyCol,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.65, ease: MOTION.ease.smooth }
        );
      }
      const codeVisual = document.querySelector('.codeathon-visual-frame');
      if (codeVisual) {
        tl.fromTo(
          codeVisual,
          { opacity: 0, y: 30, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: MOTION.ease.smooth,
          },
          copyCol ? '-=0.4' : '0'
        );
      }
    }

    // =========================================================================
    // 07. REAL ASSET: TANISH CREATOR & ARCHITECT (SECTION F)
    // Editorial masked portrait entrance
    // =========================================================================
    const sec07 = document.querySelector('.tanish-section');
    if (sec07) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec07,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });

      const tanishPortrait = document.querySelector('.tanish-portrait-frame');
      if (tanishPortrait) {
        tl.fromTo(
          tanishPortrait,
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: MOTION.ease.smooth }
        );
      }
      const tanishCopy = sec07.querySelector('.tanish-copy-col');
      if (tanishCopy) {
        tl.fromTo(
          tanishCopy,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.65, ease: MOTION.ease.smooth },
          '-=0.45'
        );
      }
    }

    // =========================================================================
    // 08. CENTRAL ENGINE & TOPOLOGY BUS (SECTION G)
    // =========================================================================
    const sec08 = document.querySelector('.section-topology');
    if (sec08) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec08,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      const topHeader = sec08.querySelector('.topology-header');
      const nodeBtns = sec08.querySelectorAll('.topology-node-btn');
      const detailCard = sec08.querySelector('.topology-detail-card');

      if (topHeader) {
        tl.fromTo(
          topHeader,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: MOTION.ease.smooth }
        );
      }
      if (nodeBtns.length > 0) {
        tl.fromTo(
          nodeBtns,
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: MOTION.ease.smooth,
          },
          topHeader ? '-=0.2' : '0'
        );
      }
      if (detailCard) {
        tl.fromTo(
          detailCard,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: MOTION.ease.smooth },
          '-=0.25'
        );
      }
    }

    // =========================================================================
    // 09. TECHNICAL FAQ (SECTION H)
    // =========================================================================
    const sec09 = document.querySelector('.section-faq');
    if (sec09) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec09,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      const faqHeader = sec09.querySelector('.faq-header');
      const faqItems = sec09.querySelectorAll('.faq-accordion-item');

      if (faqHeader) {
        tl.fromTo(
          faqHeader,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: MOTION.ease.smooth }
        );
      }
      if (faqItems.length > 0) {
        tl.fromTo(
          faqItems,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.5,
            ease: MOTION.ease.smooth,
          },
          faqHeader ? '-=0.2' : '0'
        );
      }
    }

    // =========================================================================
    // 10. FINAL CTA (SECTION I)
    // =========================================================================
    const sec10 = document.querySelector('.section-cta');
    if (sec10) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec10,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      const ctaBadge = sec10.querySelector('.cta-badge');
      const ctaLines = sec10.querySelectorAll('.cta-headline-line');
      const ctaSub = sec10.querySelector('.cta-subhead');
      const ctaBtns = sec10.querySelectorAll('.cta-button');

      if (ctaBadge) {
        tl.fromTo(
          ctaBadge,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: MOTION.ease.snappy }
        );
      }
      if (ctaLines.length > 0) {
        tl.fromTo(
          ctaLines,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: MOTION.ease.smooth,
          },
          ctaBadge ? '-=0.2' : '0'
        );
      }
      if (ctaSub) {
        tl.fromTo(
          ctaSub,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: MOTION.ease.smooth },
          '-=0.3'
        );
      }
      if (ctaBtns.length > 0) {
        tl.fromTo(
          ctaBtns,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: MOTION.ease.smooth,
          },
          '-=0.25'
        );
      }
    }
  }, rootContainer);

  return ctx;
};

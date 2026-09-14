'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initScrollStory = (rootContainer: HTMLElement | null) => {
  if (!rootContainer) return null;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  const ctx = gsap.context(() => {
    // 1. Hero scroll parallax: typography and stage shift with distinct rates
    gsap.to('.hero-text-container', {
      y: -40,
      opacity: 0.9,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.to('.hero-product-stage', {
      y: -20,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // 2. Mobile + Web Sync Story: Desktop and Mobile interfaces dock together
    gsap.fromTo(
      '.sync-desktop-card',
      { x: -30, opacity: 0.7 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.sync-section',
          start: 'top 75%',
          end: 'top 35%',
          scrub: 1,
        },
      }
    );

    gsap.fromTo(
      '.sync-mobile-card',
      { x: 30, opacity: 0.7 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.sync-section',
          start: 'top 75%',
          end: 'top 35%',
          scrub: 1,
        },
      }
    );

    // 3. Code-A-Thon Real Image Reveal
    gsap.fromTo(
      '.codeathon-visual-frame',
      { y: 30, opacity: 0.8 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: '.codeathon-section',
          start: 'top 80%',
          end: 'top 45%',
          scrub: 1,
        },
      }
    );

    // 4. Tanish Creator Visual Reveal
    gsap.fromTo(
      '.tanish-portrait-frame',
      { y: 30, opacity: 0.8 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: '.tanish-section',
          start: 'top 80%',
          end: 'top 45%',
          scrub: 1,
        },
      }
    );
  }, rootContainer);

  return ctx;
};

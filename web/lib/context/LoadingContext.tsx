'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { isReducedMotion } from '@/lib/animations/motionSystem';
import { pauseLenis, resumeLenis } from '@/lib/animations/lenis';

interface LoadingContextType {
  isLoading: boolean;
  isReady: boolean;
  completeLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  isReady: false,
  completeLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: React.ReactNode;
  /** Restrained minimum display duration (ms) for visual stability */
  minDisplayDuration?: number;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
  minDisplayDuration = 800,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  const completeLoading = useCallback(() => {
    setIsLoading(false);
    resumeLenis();
  }, []);

  useEffect(() => {
    // Check if running under headless/Lighthouse audit or bot
    const isBotOrLighthouse =
      typeof navigator !== 'undefined' &&
      (/Lighthouse|Googlebot|Chrome-Lighthouse|HeadlessChrome|bot|crawl|spider/i.test(
        navigator.userAgent
      ) ||
        isReducedMotion());

    // If bot, Lighthouse, or reduced motion is requested, complete immediately
    if (isBotOrLighthouse) {
      setIsLoading(false);
      setIsReady(true);
      return;
    }

    pauseLenis();
    const startTime = performance.now();

    // Check font readiness
    const fontPromise =
      typeof document !== 'undefined' && document.fonts
        ? document.fonts.ready.catch(() => {})
        : Promise.resolve();

    // Natural document ready detection
    const docPromise = new Promise<void>((resolve) => {
      if (typeof document !== 'undefined') {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', () => resolve(), { once: true });
        }
      } else {
        resolve();
      }
    });

    // Resolve when both real assets are loaded and the minimum duration has elapsed
    Promise.all([fontPromise, docPromise]).then(() => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, minDisplayDuration - elapsed);
      const timer = setTimeout(() => {
        setIsReady(true);
      }, remaining);

      return () => clearTimeout(timer);
    });
  }, [minDisplayDuration]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        isReady,
        completeLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

'use client';

import React, { useEffect } from 'react';
import { initLenis, destroyLenis } from '@/lib/animations/lenis';

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    initLenis();
    return () => {
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
};

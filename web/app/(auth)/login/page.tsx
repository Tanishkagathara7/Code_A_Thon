'use client';

import React from 'react';
import { UnifiedAuthView } from '@/components/auth/UnifiedAuthView';

export default function LoginPage() {
  return <UnifiedAuthView initialMode="signin" />;
}

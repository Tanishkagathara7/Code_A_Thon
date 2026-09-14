'use client';

import React from 'react';
import { UnifiedAuthView } from '@/components/auth/UnifiedAuthView';

export default function SignupPage() {
  return <UnifiedAuthView initialMode="signup" />;
}

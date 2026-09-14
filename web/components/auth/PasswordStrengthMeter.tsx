'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password?: string;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password = '',
  className = '',
}) => {
  if (!password) return null;

  const checks = [
    { label: '6+ characters', valid: password.length >= 6 },
    { label: 'Contains number', valid: /\d/.test(password) },
    { label: 'Lowercase & uppercase', valid: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'Special symbol', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.valid).length;

  const strengthColor =
    score <= 1
      ? 'bg-rose-500'
      : score === 2
      ? 'bg-amber-500'
      : score === 3
      ? 'bg-blue-600'
      : 'bg-emerald-600';

  const strengthLabel =
    score <= 1
      ? 'Weak'
      : score === 2
      ? 'Fair'
      : score === 3
      ? 'Good'
      : 'Strong';

  return (
    <div className={`space-y-2 mt-2 pt-1.5 transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-zinc-500">Security Strength</span>
        <span
          className={`font-semibold ${
            score <= 1
              ? 'text-rose-600'
              : score === 2
              ? 'text-amber-600'
              : score === 3
              ? 'text-blue-600'
              : 'text-emerald-600'
          }`}
        >
          {strengthLabel}
        </span>
      </div>

      {/* Segmented meter bar */}
      <div className="grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index < score ? strengthColor : 'bg-zinc-200'
            }`}
          />
        ))}
      </div>

      {/* Criteria micro-badges */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[10px] text-zinc-500">
        {checks.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1 font-mono">
            {item.valid ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            )}
            <span className={item.valid ? 'text-zinc-700 font-medium' : 'text-zinc-400'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

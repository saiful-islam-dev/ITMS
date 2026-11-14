'use client';

import React, { useMemo } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export function evaluatePasswordStrength(password: string): {
  score: number;
  label: string;
  labelColor: string;
  barColors: [string, string, string, string];
} {
  if (!password) {
    return {
      score: 0,
      label: '',
      labelColor: 'text-slate-400',
      barColors: ['bg-slate-200', 'bg-slate-200', 'bg-slate-200', 'bg-slate-200'],
    };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return {
      score: 1,
      label: 'Too Weak',
      labelColor: 'text-rose-500',
      barColors: ['bg-rose-500', 'bg-slate-200', 'bg-slate-200', 'bg-slate-200'],
    };
  } else if (score === 2) {
    return {
      score: 2,
      label: 'Fair',
      labelColor: 'text-amber-500',
      barColors: ['bg-amber-500', 'bg-amber-500', 'bg-slate-200', 'bg-slate-200'],
    };
  } else if (score === 3) {
    return {
      score: 3,
      label: 'Good',
      labelColor: 'text-blue-500',
      barColors: ['bg-blue-500', 'bg-blue-500', 'bg-blue-500', 'bg-slate-200'],
    };
  } else {
    return {
      score: 4,
      label: 'Strong',
      labelColor: 'text-emerald-600',
      barColors: ['bg-emerald-500', 'bg-emerald-500', 'bg-emerald-500', 'bg-emerald-500'],
    };
  }
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { label, labelColor, barColors } = useMemo(
    () => evaluatePasswordStrength(password),
    [password]
  );

  return (
    <div className="mt-2" data-purpose="password-meter">
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        <div className={`rounded-full transition-colors duration-300 ${barColors[0]}`} />
        <div className={`rounded-full transition-colors duration-300 ${barColors[1]}`} />
        <div className={`rounded-full transition-colors duration-300 ${barColors[2]}`} />
        <div className={`rounded-full transition-colors duration-300 ${barColors[3]}`} />
      </div>
      <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
        <span>12+ characters, with number and symbol.</span>
        {label && <span className={`font-semibold ${labelColor}`}>{label}</span>}
      </p>
    </div>
  );
};


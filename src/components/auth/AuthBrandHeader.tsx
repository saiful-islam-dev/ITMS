'use client';

import React from 'react';

interface AuthBrandHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export const AuthBrandHeader: React.FC<AuthBrandHeaderProps> = ({
  title,
  subtitle,
  badge = 'v2.4 Enterprise',
}) => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
      {/* ITMS Brand Logo Badge */}
      <div className="inline-flex items-center justify-center p-2.5 bg-[#4f46e5] rounded-xl shadow-md shadow-indigo-600/20 mb-3 text-white">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* System Identity Badge */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">ITMS</h1>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-[#4f46e5] border border-indigo-100">
          {badge}
        </span>
        <span className="text-xs font-medium text-slate-400">• Apex Garments</span>
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
        {subtitle}
      </p>
    </div>
  );
};


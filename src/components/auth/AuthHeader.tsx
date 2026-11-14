'use client';

import React from 'react';
import Link from 'next/link';

interface AuthHeaderProps {
  rightElement?: React.ReactNode;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ rightElement }) => {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between z-10">
      <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
          All Systems Operational
        </span>
        <span className="text-slate-300">|</span>
        <span className="inline-flex items-center text-slate-500">
          <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          14ms Latency
        </span>
      </div>

      {rightElement ? (
        rightElement
      ) : (
        <a
          href="#helpdesk"
          className="text-xs text-slate-500 hover:text-[#4f46e5] transition-colors flex items-center gap-1 font-medium"
        >
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          Apex Internal IT Helpdesk
        </a>
      )}
    </header>
  );
};


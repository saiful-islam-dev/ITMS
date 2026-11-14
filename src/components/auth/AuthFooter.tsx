'use client';

import React from 'react';

export const AuthFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/70 backdrop-blur-xs py-4 px-6 z-10" data-purpose="enterprise-footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        {/* Left: Copyright and Version */}
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-700">Apex Garments IT Operations</span>
          <span className="text-slate-300">•</span>
          <span>ITMS Build 2.4.120-LTS</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400">Factory Hub: Gazipur & HQ</span>
        </div>

        {/* Right: Security Standards */}
        <div className="flex items-center space-x-4 text-[11px]">
          <span className="inline-flex items-center text-slate-600">
            <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                fillRule="evenodd"
              />
            </svg>
            ISO 27001 Certified
          </span>
          <a className="hover:text-slate-800 transition-colors" href="#privacy">
            Privacy Policy
          </a>
          <a className="hover:text-slate-800 transition-colors" href="#terms">
            Acceptable Use Policy
          </a>
          <a className="text-[#4f46e5] hover:text-[#4338ca] font-medium" href="#status">
            System Telemetry
          </a>
        </div>
      </div>
    </footer>
  );
};


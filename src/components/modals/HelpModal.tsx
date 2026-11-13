'use client';

import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative bg-white border border-[#cbd5e1] rounded-2xl w-full max-w-lg shadow-level-3 p-5 z-10 animate-in fade-in zoom-in-95 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#3525cd]" />
            <h3 className="font-bold text-sm text-[#131b2e]">
              ITMS Enterprise v2.4 — Architecture Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#777587] hover:text-[#131b2e] rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#464555] leading-relaxed max-h-[60vh] overflow-y-auto">
          <div>
            <h4 className="font-bold text-[#131b2e]">Apex Garments Operations Network</h4>
            <p className="mt-1">
              Apex Garments ITMS monitors 4 mission-critical campuses across Dhaka, Gazipur, and Savar connected through an enterprise FortiGate SD-WAN mesh running BGP autonomous routing with automatic LTE/Starlink satellite failover.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#131b2e]">Keyboard Shortcuts</h4>
            <ul className="mt-1 space-y-1 font-mono text-[11px]">
              <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded border">⌘K</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border">Ctrl+K</kbd> : Global Search tickets, serials, employees</li>
              <li><kbd className="px-1.5 py-0.5 bg-slate-100 rounded border">Esc</kbd> : Dismiss active modal / drawer</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#131b2e]">Design System Compliance</h4>
            <p className="mt-1">
              Built to the strict specifications of <code className="text-[#3525cd]">DESIGN.md</code> and <code className="text-[#3525cd]">IMPLEMENTATION_PLAN.md</code>: zero-pill discipline, 8px spatial grid, high-density tabular typography, and low-contrast elevation.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#f1f5f9]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#4f46e5] text-white rounded-lg text-xs font-semibold hover:bg-[#3730a3] cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};


'use client';

import React from 'react';
import { PhoneCall, X } from 'lucide-react';

interface HotlineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HotlineModal: React.FC<HotlineModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative bg-white border border-[#cbd5e1] rounded-2xl w-full max-w-md shadow-level-3 p-5 z-10 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2 text-[#9f1239]">
            <PhoneCall className="w-5 h-5 text-[#e11d48]" />
            <h3 className="font-bold text-sm text-[#131b2e]">
              Shift Supervisor Emergency Hotline
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#777587] hover:text-[#131b2e] rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs">
          <p className="text-[#464555]">
            Direct patched line to on-duty plant managers and central IT operations command:
          </p>

          <div className="p-3 bg-[#fff1f2] border border-[#fecdd3] rounded-xl space-y-1">
            <div className="font-semibold text-[#9f1239]">
              Factory Building B (Chemical Wash Plant Lead)
            </div>
            <div className="font-mono text-sm font-bold text-[#131b2e]">
              +880 1912-774023 (Rafiqul Islam)
            </div>
            <div className="text-[10px] text-[#777587]">
              VLAN 40 & IP65 Enclosures Specialist
            </div>
          </div>

          <div className="p-3 bg-[#f8f9fe] border border-[#e2e8f0] rounded-xl space-y-1">
            <div className="font-semibold text-[#131b2e]">
              Central IT Operations Lead / Super Admin
            </div>
            <div className="font-mono text-sm font-bold text-[#3525cd]">
              +880 1711-049821 (Tariq Rahman)
            </div>
            <div className="text-[10px] text-[#777587]">
              SD-WAN Core & Escalation Commander
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Close Hotline
          </button>
        </div>
      </div>
    </div>
  );
};


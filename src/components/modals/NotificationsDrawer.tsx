'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, X } from 'lucide-react';
import { Facility } from '../../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
  onOpenThermals: (facility: Facility) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  facilities,
  onOpenThermals,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative bg-white border border-[#cbd5e1] rounded-2xl w-full max-w-md shadow-level-3 p-5 z-10 animate-in fade-in zoom-in-95 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#e11d48]" />
            <h3 className="font-bold text-sm text-[#131b2e]">
              Active Operational Notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#777587] hover:text-[#131b2e] rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
          <div className="p-3 bg-[#fff1f2] border border-[#fecdd3] rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-[#9f1239]">
              <span>Environmental Alert: Moisture & Heat</span>
              <span className="text-[10px] font-mono">11:20 AM</span>
            </div>
            <p className="text-[#9f1239]/90">
              Condensation detected in rack WASH-IDF-SEC3 at Factory Building B. Jitter on VLAN 40 reached 7.4ms.
            </p>
            <button
              onClick={() => {
                onClose();
                const fac = facilities.find((f) => f.id === 'loc-fct-02');
                if (fac) onOpenThermals(fac);
              }}
              className="mt-1 text-[11px] font-semibold text-[#e11d48] underline hover:no-underline cursor-pointer"
            >
              View Thermals & Sensor Status →
            </button>
          </div>

          <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-[#92400e]">
              <span>Hardware Incident: Zebra Printhead Failure</span>
              <span className="text-[10px] font-mono">12:05 PM</span>
            </div>
            <p className="text-[#92400e]/90">
              Zebra ZT410 printhead burnt out on Sewing Line 8 at Factory Building A.
            </p>
            <button
              onClick={() => {
                onClose();
                router.push('/tickets');
              }}
              className="mt-1 text-[11px] font-semibold text-[#b45309] underline hover:no-underline cursor-pointer"
            >
              View Ticket TICK-8844 →
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#f1f5f9]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Dismiss All
          </button>
        </div>
      </div>
    </div>
  );
};


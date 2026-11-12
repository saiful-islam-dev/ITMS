import React from 'react';
import { FacilityStatus } from '../../types';

interface StatusBadgeProps {
  status: FacilityStatus | 'info' | 'active' | 'offline' | 'resolved';
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  pulse = false,
  size = 'md'
}) => {
  let bgClass = 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]';
  let dotClass = 'bg-[#10b981]';
  let defaultLabel = 'Operational';

  switch (status) {
    case 'healthy':
    case 'active':
    case 'resolved':
      bgClass = 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]';
      dotClass = 'bg-[#10b981]';
      defaultLabel = 'Healthy';
      break;
    case 'operational':
      bgClass = 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]';
      dotClass = 'bg-[#10b981]';
      defaultLabel = 'Operational';
      break;
    case 'warning':
    case 'maintenance':
      bgClass = 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]';
      dotClass = 'bg-[#f59e0b]';
      defaultLabel = status === 'maintenance' ? 'Maintenance' : 'Warning';
      break;
    case 'critical':
    case 'offline':
      bgClass = 'bg-[#fff1f2] text-[#9f1239] border-[#fecdd3]';
      dotClass = 'bg-[#e11d48]';
      defaultLabel = 'Critical';
      break;
    case 'info':
      bgClass = 'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]';
      dotClass = 'bg-[#0284c7]';
      defaultLabel = 'Info';
      break;
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${bgClass} ${paddingClass} tabular-nums transition-colors`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotClass}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotClass}`} />
      </span>
      <span>{label || defaultLabel}</span>
    </span>
  );
};


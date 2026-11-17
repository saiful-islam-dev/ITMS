import React from 'react';
import { FacilityStatus } from '../../types';

export type ExtendedStatus =
  | FacilityStatus
  | 'info'
  | 'active'
  | 'offline'
  | 'resolved'
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'todo'
  | 'in_progress'
  | 'review'
  | 'done'
  | 'blocked'
  | 'suspended'
  | 'pending_invite';

interface StatusBadgeProps {
  status: ExtendedStatus;
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  pulse = false,
  size = 'md',
  className = ''
}) => {
  let bgClass = 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]';
  let dotClass = 'bg-[#10b981]';
  let defaultLabel = 'Operational';

  switch (status) {
    case 'healthy':
    case 'active':
    case 'resolved':
    case 'done':
      bgClass = 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]';
      dotClass = 'bg-[#10b981]';
      defaultLabel = status === 'done' ? 'Done' : 'Healthy';
      break;
    case 'operational':
      bgClass = 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]';
      dotClass = 'bg-[#10b981]';
      defaultLabel = 'Operational';
      break;
    case 'in_progress':
      bgClass = 'bg-[#eaedff] text-[#3525cd] border-[#c7c3fe]';
      dotClass = 'bg-[#4f46e5]';
      defaultLabel = 'In Progress';
      break;
    case 'warning':
    case 'maintenance':
    case 'review':
    case 'pending_invite':
      bgClass = 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]';
      dotClass = 'bg-[#f59e0b]';
      defaultLabel =
        status === 'maintenance'
          ? 'Maintenance'
          : status === 'review'
          ? 'In Review'
          : status === 'pending_invite'
          ? 'Pending Invite'
          : 'Warning';
      break;
    case 'high':
      bgClass = 'bg-[#fff7ed] text-[#c2410c] border-[#ffedd5]';
      dotClass = 'bg-[#ea580c]';
      defaultLabel = 'High';
      break;
    case 'critical':
    case 'offline':
    case 'blocked':
    case 'suspended':
      bgClass = 'bg-[#fff1f2] text-[#9f1239] border-[#fecdd3]';
      dotClass = 'bg-[#e11d48]';
      defaultLabel =
        status === 'blocked' ? 'Blocked' : status === 'suspended' ? 'Suspended' : 'Critical';
      break;
    case 'info':
    case 'medium':
      bgClass = 'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]';
      dotClass = 'bg-[#0284c7]';
      defaultLabel = status === 'medium' ? 'Medium' : 'Info';
      break;
    case 'low':
    case 'todo':
      bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
      dotClass = 'bg-slate-400';
      defaultLabel = status === 'todo' ? 'To Do' : 'Low';
      break;
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${bgClass} ${paddingClass} tabular-nums transition-colors ${className}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
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

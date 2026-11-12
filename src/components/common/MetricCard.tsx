import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  secondaryValue: string;
  subtext: string;
  tag?: string;
  tagVariant?: 'default' | 'success' | 'warning' | 'error';
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  actionText?: string;
  onAction?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  secondaryValue,
  subtext,
  tag,
  tagVariant = 'default',
  icon: Icon,
  iconBg = 'bg-[#eaedff]',
  iconColor = 'text-[#3525cd]',
  actionText,
  onAction
}) => {
  let tagStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  if (tagVariant === 'success') {
    tagStyle = 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]';
  } else if (tagVariant === 'warning') {
    tagStyle = 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]';
  } else if (tagVariant === 'error') {
    tagStyle = 'bg-[#fff1f2] text-[#9f1239] border-[#fecdd3]';
  }

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-level-1 hover:border-[#c7c4d8] transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold tracking-wider text-[#464555] uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#131b2e] tracking-tight tabular-nums">
              {value}
            </span>
          </div>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBg} ${iconColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
        <div className="truncate">
          <span className="font-medium text-[#131b2e]">{secondaryValue}</span>
          <span className="text-[#777587] ml-1.5 font-normal">· {subtext}</span>
        </div>
        {tag && (
          <span
            className={`shrink-0 ml-2 px-2 py-0.5 text-[10px] font-semibold border rounded-full ${tagStyle}`}
          >
            {tag}
          </span>
        )}
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 text-left text-[11px] font-medium text-[#4f46e5] hover:text-[#3730a3] transition-colors"
        >
          {actionText} →
        </button>
      )}
    </div>
  );
};


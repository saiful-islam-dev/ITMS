'use client';

import React from 'react';

export type TimeRangePreset = '7D' | '30D' | '90D' | 'Q1/Q2' | 'YTD' | 'Custom';

export interface TimeFilterPillsProps {
  presets?: TimeRangePreset[];
  activePreset: TimeRangePreset;
  onSelectPreset: (preset: TimeRangePreset) => void;
  dateRangeLabel?: string;
  className?: string;
}

export const TimeFilterPills: React.FC<TimeFilterPillsProps> = ({
  presets = ['7D', '30D', 'Q1/Q2', 'YTD'],
  activePreset,
  onSelectPreset,
  dateRangeLabel,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg text-on-surface-variant font-label-compact text-label-compact">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onSelectPreset(preset)}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activePreset === preset
                ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      {dateRangeLabel && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low rounded-lg text-on-surface font-code-mono text-label-compact">
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">calendar_today</span>
          <span>{dateRangeLabel}</span>
        </div>
      )}
    </div>
  );
};

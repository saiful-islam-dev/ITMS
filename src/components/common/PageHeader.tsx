'use client';

import React from 'react';

export interface PageHeaderAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: PageHeaderAction[];
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  actions,
  children,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 ${className}`}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-space-xs flex-wrap">
          {icon && <span className="shrink-0">{icon}</span>}
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            {title}
          </h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {subtitle && (
          <p className="font-body-dense text-body-dense text-on-surface-variant">
            {subtitle}
          </p>
        )}
      </div>

      {(actions || children) && (
        <div className="flex items-center gap-space-xs self-start lg:self-auto shrink-0 flex-wrap">
          {actions?.map((act, idx) => {
            const isPrimary = act.variant === 'primary';
            const isDanger = act.variant === 'danger';

            let btnStyle =
              'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border border-outline-variant/40';
            if (isPrimary) {
              btnStyle = 'bg-primary-container text-on-primary hover:bg-primary shadow-sm';
            } else if (isDanger) {
              btnStyle = 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={act.onClick}
                disabled={act.disabled}
                className={`inline-flex items-center gap-1.5 px-space-sm py-1.5 font-body-dense-medium text-body-dense-medium rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 ${btnStyle}`}
              >
                {act.icon}
                <span>{act.label}</span>
              </button>
            );
          })}
          {children}
        </div>
      )}
    </div>
  );
};

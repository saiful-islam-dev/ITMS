'use client';

import React from 'react';
import { LucideIcon, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  const renderIcon = () => {
    if (!icon) return <Search className="w-8 h-8 text-on-surface-variant/40" />;
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="w-8 h-8 text-on-surface-variant/40" />;
    }
    return icon;
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="p-3 bg-surface-container-low rounded-2xl mb-3">
        {renderIcon()}
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{title}</h3>
      {description && (
        <p className="font-caption text-caption text-on-surface-variant max-w-sm mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-container text-on-primary hover:bg-primary font-body-dense-medium text-body-dense rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

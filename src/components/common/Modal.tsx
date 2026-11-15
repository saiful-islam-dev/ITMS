'use client';

import React, { useEffect, useRef } from 'react';
import { X, LucideIcon } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: LucideIcon | React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  children: React.ReactNode;
  customHeader?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl'
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  maxWidth = 'md',
  children,
  customHeader,
  headerRight,
  className = '',
  hideHeader = false
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="w-5 h-5" />;
    }
    return icon;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className={`relative bg-surface-container-lowest border border-outline-variant/50 rounded-2xl w-full ${maxWidthMap[maxWidth]} shadow-level-3 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 ${className}`}
      >
        {/* Header */}
        {!hideHeader &&
          (customHeader || (
            <div className="p-5 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low shrink-0">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="p-2 bg-primary-container text-on-primary rounded-lg shadow-sm shrink-0">
                    {renderIcon()}
                  </div>
                )}
                <div>
                  {typeof title === 'string' ? (
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
                  ) : (
                    title
                  )}
                  {subtitle && (
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {headerRight}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

        {/* Content Body */}
        {children}
      </div>
    </div>
  );
};

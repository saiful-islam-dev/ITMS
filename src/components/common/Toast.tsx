'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastState } from '../../hooks/useToast';

interface ToastProps {
  toast: ToastState | string | null;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose, className = '' }) => {
  if (!toast) return null;

  const message = typeof toast === 'string' ? toast : toast.message;
  const type = typeof toast === 'string' ? 'success' : toast.type || 'success';

  let icon = <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />;
  let borderClass = 'border-primary/30';

  if (type === 'error') {
    icon = <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
    borderClass = 'border-rose-300';
  } else if (type === 'warning') {
    icon = <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
    borderClass = 'border-amber-300';
  } else if (type === 'info') {
    icon = <Info className="w-4 h-4 text-sky-600 shrink-0" />;
    borderClass = 'border-sky-300';
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-18 right-8 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-surface-container-lowest border ${borderClass} shadow-level-3 rounded-xl animate-in slide-in-from-top duration-200 ${className}`}
    >
      {icon}
      <span className="font-body-dense-medium text-body-dense text-on-surface">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-1 p-0.5 text-on-surface-variant hover:text-on-surface rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

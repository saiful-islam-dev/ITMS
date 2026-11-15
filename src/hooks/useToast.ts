'use client';

import { useState, useCallback } from 'react';

export interface ToastState {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  id?: string;
}

export function useToast(defaultDuration = 3200) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastState['type'] = 'success', duration = defaultDuration) => {
      setToast({ message, type, id: String(Date.now()) });
      setTimeout(() => {
        setToast((current) => (current?.message === message ? null : current));
      }, duration);
    },
    [defaultDuration]
  );

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    toastMessage: toast?.message || null,
    showToast,
    clearToast
  };
}

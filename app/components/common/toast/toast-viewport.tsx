'use client';

import { useToastStore } from '@/lib/stores/toast-store';
import { useEffect } from 'react';
import styles from './toast.module.scss';

const AUTO_DISMISS_MS = 4500;

export const ToastViewport = () => {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) => window.setTimeout(() => dismiss(t.id), AUTO_DISMISS_MS));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.viewport} role='region' aria-live='polite' aria-label='Notifications'>
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.kind]}`} role='status'>
          <span className={styles.message}>{t.message}</span>
          <button
            type='button'
            className={styles.close}
            aria-label='Dismiss notification'
            onClick={() => dismiss(t.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

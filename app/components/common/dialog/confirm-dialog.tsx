'use client';

import { useConfirmStore } from '@/lib/stores/confirm-store';
import { useEffect, useRef } from 'react';
import styles from './confirm-dialog.module.scss';

export const ConfirmDialogHost = () => {
  const pending = useConfirmStore((s) => s.pending);
  const resolve = useConfirmStore((s) => s.resolve);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!pending) return;
    confirmBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resolve(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pending, resolve]);

  if (!pending) return null;

  const {
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    destructive = false,
  } = pending;

  return (
    <div
      className={styles.overlay}
      role='dialog'
      aria-modal='true'
      aria-labelledby='confirm-title'
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) resolve(false);
      }}
    >
      <div className={styles.panel}>
        <h2 id='confirm-title' className={styles.title}>
          {title}
        </h2>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.actions}>
          <button type='button' className={styles.btn} onClick={() => resolve(false)}>
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type='button'
            className={`${styles.btn} ${destructive ? styles.btnDestructive : styles.btnPrimary}`}
            onClick={() => resolve(true)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

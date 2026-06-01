'use client';

import { useConfirmStore } from '@/lib/stores/confirm-store';
import { useEffect, useRef } from 'react';
import styles from './confirm-dialog.module.scss';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const ConfirmDialogHost = () => {
  const pending = useConfirmStore((s) => s.pending);
  const resolve = useConfirmStore((s) => s.resolve);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!pending) return;

    // Remember the trigger so we can restore focus when the dialog closes.
    const previouslyFocused = document.activeElement as HTMLElement | null;
    confirmBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        resolve(false);
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      // Restore focus to whatever opened the dialog, if it's still mounted.
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
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
      <div className={styles.panel} ref={panelRef}>
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

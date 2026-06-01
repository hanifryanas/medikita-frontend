'use client';

import { type RefObject, useEffect } from 'react';

export const useDismiss = (
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onDismiss: () => void
) => {
  useEffect(() => {
    if (!isOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onDismiss();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, isOpen, onDismiss]);
};

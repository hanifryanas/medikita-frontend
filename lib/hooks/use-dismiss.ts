'use client';

import { type Dispatch, type RefObject, type SetStateAction, useEffect } from 'react';

type Dismisser = (() => void) | Dispatch<SetStateAction<boolean>>;

export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onDismiss: () => void
): void;
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
): void;
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  handler: Dismisser
): void {
  useEffect(() => {
    if (!isOpen) return;
    // Both `() => void` and `Dispatch<SetStateAction<boolean>>` accept being
    // invoked with a `false` argument at runtime — JS ignores extra args, and
    // for a setter `false` is the desired next value.
    const close = () => (handler as (v: false) => void)(false);
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, isOpen, handler]);
}

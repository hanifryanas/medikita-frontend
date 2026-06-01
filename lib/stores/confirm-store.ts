'use client';

import { create } from 'zustand';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

interface PendingConfirm extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

interface ConfirmStore {
  pending: PendingConfirm | null;
  ask: (options: ConfirmOptions) => Promise<boolean>;
  resolve: (value: boolean) => void;
}

export const useConfirmStore = create<ConfirmStore>()((set, get) => ({
  pending: null,
  ask: (options) =>
    new Promise<boolean>((resolve) => {
      // If a previous prompt is still open, decline it before opening a new one.
      get().pending?.resolve(false);
      set({ pending: { ...options, resolve } });
    }),
  resolve: (value) => {
    const current = get().pending;
    if (!current) return;
    set({ pending: null });
    current.resolve(value);
  },
}));

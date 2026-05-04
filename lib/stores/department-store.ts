'use client';

import { create } from 'zustand';

export interface Department {
  id: string;
  name: string;
}

export interface DepartmentStore {
  items: Department[];
  loaded: boolean;
  loading: boolean;
  error?: string;
  setItems: (items: Department[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

const initialState = {
  items: [] as Department[],
  loaded: false,
  loading: false,
  error: undefined as string | undefined,
};

export const useDepartmentStore = create<DepartmentStore>()((set) => ({
  ...initialState,

  setItems: (items) => set({ items, loaded: true, loading: false, error: undefined }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  reset: () => set(initialState),
}));

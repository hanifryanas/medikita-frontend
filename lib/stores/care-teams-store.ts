'use client';

import { create } from 'zustand';
import { Day } from '../types/common';

export type CareRole = 'doctor' | 'nurse';
export type CareTeamsRoleFilter = 'all' | CareRole;
export type CareTeamsSearchMode = 'name' | 'days' | 'department';

export interface CareTeamsStore {
  query: string;
  roleFilter: CareTeamsRoleFilter;
  searchMode: CareTeamsSearchMode;
  selectedDays: Day[];
  selectedDepts: string[];

  setQuery: (q: string) => void;
  setRoleFilter: (f: CareTeamsRoleFilter) => void;
  setSearchMode: (m: CareTeamsSearchMode) => void;
  toggleDay: (d: Day) => void;
  toggleDept: (d: string) => void;
  clearDays: () => void;
  clearDepts: () => void;
  reset: () => void;
}

const initialState = {
  query: '',
  roleFilter: 'all' as CareTeamsRoleFilter,
  searchMode: 'name' as CareTeamsSearchMode,
  selectedDays: [] as Day[],
  selectedDepts: [] as string[],
};

export const useCareTeamsStore = create<CareTeamsStore>()((set) => ({
  ...initialState,

  setQuery: (query) => set({ query }),
  setRoleFilter: (roleFilter) => set({ roleFilter }),
  setSearchMode: (searchMode) =>
    set({ searchMode, query: '', selectedDays: [], selectedDepts: [] }),

  toggleDay: (d) =>
    set((s) => ({
      selectedDays: s.selectedDays.includes(d)
        ? s.selectedDays.filter((x) => x !== d)
        : [...s.selectedDays, d],
    })),

  toggleDept: (d) =>
    set((s) => ({
      selectedDepts: s.selectedDepts.includes(d)
        ? s.selectedDepts.filter((x) => x !== d)
        : [...s.selectedDepts, d],
    })),

  clearDays: () => set({ selectedDays: [] }),
  clearDepts: () => set({ selectedDepts: [] }),

  reset: () => set(initialState),
}));

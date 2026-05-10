'use client';

import { create } from 'zustand';

export type CareRole = 'doctor' | 'nurse';
export type CareTeamsRoleFilter = 'all' | CareRole;
export type CareTeamsSearchMode = 'name' | 'days' | 'department';
export type DayShort = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface CareTeamsStore {
  query: string;
  roleFilter: CareTeamsRoleFilter;
  searchMode: CareTeamsSearchMode;
  selectedDays: DayShort[];
  selectedDepts: string[];

  setQuery: (q: string) => void;
  setRoleFilter: (f: CareTeamsRoleFilter) => void;
  setSearchMode: (m: CareTeamsSearchMode) => void;
  toggleDay: (d: DayShort) => void;
  toggleDept: (d: string) => void;
  clearDays: () => void;
  clearDepts: () => void;
  reset: () => void;
}

const initialState = {
  query: '',
  roleFilter: 'all' as CareTeamsRoleFilter,
  searchMode: 'name' as CareTeamsSearchMode,
  selectedDays: [] as DayShort[],
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

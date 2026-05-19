'use client';

import { create } from 'zustand';
import { CareTeam } from '../types/care-teams';
import { Day } from '../types/common';

export type CareTeamsRoleFilter = 'all' | CareTeam['role'];
export type CareTeamsSearchMode = 'name' | 'days' | 'department';

export interface CareTeamsStore {
  query: string;
  roleFilter: CareTeamsRoleFilter;
  searchMode: CareTeamsSearchMode;
  selectedDays: Day[];
  selectedDepartments: string[];

  setQuery: (q: string) => void;
  setRoleFilter: (f: CareTeamsRoleFilter) => void;
  setSearchMode: (m: CareTeamsSearchMode) => void;
  toggleDay: (d: Day) => void;
  toggleDepartment: (d: string) => void;
  clearDays: () => void;
  clearDepartments: () => void;
  reset: () => void;
}

const initialState = {
  query: '',
  roleFilter: 'all' as CareTeamsRoleFilter,
  searchMode: 'name' as CareTeamsSearchMode,
  selectedDays: [] as Day[],
  selectedDepartments: [] as string[],
};

export const useCareTeamsStore = create<CareTeamsStore>()((set) => ({
  ...initialState,

  setQuery: (query) => set({ query }),
  setRoleFilter: (roleFilter) => set({ roleFilter }),
  setSearchMode: (searchMode) =>
    set({ searchMode, query: '', selectedDays: [], selectedDepartments: [] }),

  toggleDay: (d) =>
    set((s) => ({
      selectedDays: s.selectedDays.includes(d)
        ? s.selectedDays.filter((x) => x !== d)
        : [...s.selectedDays, d],
    })),

  toggleDepartment: (d) =>
    set((s) => ({
      selectedDepartments: s.selectedDepartments.includes(d)
        ? s.selectedDepartments.filter((x) => x !== d)
        : [...s.selectedDepartments, d],
    })),

  clearDays: () => set({ selectedDays: [] }),
  clearDepartments: () => set({ selectedDepartments: [] }),

  reset: () => set(initialState),
}));

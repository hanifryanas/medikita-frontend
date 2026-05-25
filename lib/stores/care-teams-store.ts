'use client';

import { create } from 'zustand';
import { CareTeam } from '../types/care-teams';
import { Day } from '../types/common';

export type CareTeamsRoleFilter = 'all' | CareTeam['role'];
export type CareTeamsSearchMode = 'name' | 'department' | 'days';

export interface CareTeamsStore {
  // ─── Data ────────────────────────────────────────────
  careTeamMap: Map<string, CareTeam>;
  isLoaded: boolean;
  isLoading: boolean;

  // ─── Filter state ────────────────────────────────────
  query: string;
  roleFilter: CareTeamsRoleFilter;
  searchMode: CareTeamsSearchMode;
  selectedDays: Day[];
  selectedDepartments: string[];

  // ─── Data actions ────────────────────────────────────
  setIsLoading: (isLoading: boolean) => void;
  setCareTeams: (careTeams: CareTeam[]) => void;
  getCareTeamById: (id: string) => CareTeam | undefined;
  getCareTeams: () => CareTeam[];

  // ─── Filter actions ──────────────────────────────────
  setQuery: (q: string) => void;
  setRoleFilter: (f: CareTeamsRoleFilter) => void;
  setSearchMode: (m: CareTeamsSearchMode) => void;
  toggleDay: (d: Day) => void;
  toggleDepartment: (d: string) => void;
  clearDays: () => void;
  clearDepartments: () => void;
  clearFilters: () => void;

  // ─── Lifecycle ───────────────────────────────────────
  reset: () => void;
}

const initialFilterState = {
  query: '',
  roleFilter: 'all' as CareTeamsRoleFilter,
  searchMode: 'name' as CareTeamsSearchMode,
  selectedDepartments: [] as string[],
  selectedDays: [] as Day[],
};

const initialState = {
  careTeamMap: new Map<string, CareTeam>(),
  isLoaded: false,
  isLoading: false,
  ...initialFilterState,
};

export const useCareTeamsStore = create<CareTeamsStore>()((set, get) => ({
  ...initialState,

  setIsLoading: (isLoading) => set({ isLoading }),

  setCareTeams: (careTeams) =>
    set({
      careTeamMap: new Map(careTeams.map((c) => [c.careTeamId, c])),
      isLoaded: true,
      isLoading: false,
    }),

  getCareTeamById: (id) => get().careTeamMap.get(id),
  getCareTeams: () => Array.from(get().careTeamMap.values()),

  setQuery: (query) => set({ query }),
  setRoleFilter: (roleFilter) => set({ roleFilter }),
  setSearchMode: (searchMode) => set({ searchMode }),

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
  clearFilters: () => set(initialFilterState),

  reset: () => set(initialState),
}));

'use client';

import { create } from 'zustand';
import { nextApi } from '../api/next';
import { CareTeam } from '../types/care-teams';
import { Day } from '../types/common';
import { sanitizeDoctorResultToCareTeam, sanitizeNurseResultToCareTeam } from '../utils/sanitizers';

export type CareTeamsRoleFilter = 'all' | CareTeam['role'];
export type CareTeamsSearchMode = 'name' | 'department' | 'days';

export interface CareTeamsStore {
  // ─── Data ────────────────────────────────────────────
  careTeamMap: Map<string, CareTeam>;
  isLoaded: boolean;
  isLoading: boolean;
  loadError: string | null;
  lastFetchedAt: number | null;

  // ─── Filter state ────────────────────────────────────
  query: string;
  roleFilter: CareTeamsRoleFilter;
  searchMode: CareTeamsSearchMode;
  selectedDays: Day[];
  selectedDepartments: string[];

  // ─── Data actions ────────────────────────────────────
  fetchCareTeams: () => Promise<void>;
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

interface InternalState {
  _loadId: number;
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
  loadError: null,
  lastFetchedAt: null,
  _loadId: 0,
  ...initialFilterState,
};

export const useCareTeamsStore = create<CareTeamsStore & InternalState>()((set, get) => ({
  ...initialState,

  fetchCareTeams: async () => {
    const loadId = get()._loadId + 1;
    set({ _loadId: loadId, isLoading: true, loadError: null });
    try {
      const [doctors, nurses] = await Promise.all([
        nextApi.doctors.getDoctors(),
        nextApi.nurses.getNurses(),
      ]);
      // Drop stale response: another fetch (or reset) started after this one.
      if (get()._loadId !== loadId) return;

      const careTeams = [
        ...doctors.map(sanitizeDoctorResultToCareTeam),
        ...nurses.map(sanitizeNurseResultToCareTeam),
      ];
      set({
        careTeamMap: new Map(careTeams.map((c) => [c.careTeamId, c])),
        isLoaded: true,
        isLoading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (err) {
      if (get()._loadId !== loadId) return;
      set({
        isLoading: false,
        loadError: err instanceof Error ? err.message : 'Failed to load care teams.',
      });
    }
  },

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

  reset: () => set((s) => ({ ...initialState, _loadId: s._loadId + 1 })),
}));

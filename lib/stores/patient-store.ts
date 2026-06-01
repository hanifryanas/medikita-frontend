'use client';

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { nextApi } from '../api/next';
import type { Patient } from '../types/patients';
import { UserRelationship } from '../types/users';

/**
 * Patient ordering invariant: `ordinal` is a per-user index used to render
 * the patient list in a deterministic order. **Ordinal 0 is reserved for
 * the Self patient** (`relationship === UserRelationship.Self`); non-self
 * patients always have `ordinal >= 1`. The reorder API
 * (`reorderMyPatients`) always sends the Self patientId first to preserve
 * this invariant, and `getOtherPatients` filters Self out before sorting.
 * Keep this contract in sync between this store, `useReorderPatients`, and
 * the backend.
 */
export interface PatientStore {
  patientMap: Map<string, Patient>;
  isLoaded: boolean;
  isLoading: boolean;
  loadError: string | null;
  lastFetchedAt: number | null;

  setPatients: (patients: Patient[]) => void;
  upsertPatient: (patient: Patient) => void;
  removePatient: (patientId: string) => void;
  fetchPatients: (accessToken: string) => Promise<void>;

  getPatients: () => Patient[];
  getSelfPatient: () => Patient | null;
  getOtherPatients: () => Patient[];
  hasSelfPatient: () => boolean;

  reset: () => void;
}

interface InternalState {
  _loadId: number;
}

const initialState = {
  patientMap: new Map<string, Patient>(),
  isLoaded: false,
  isLoading: false,
  loadError: null,
  lastFetchedAt: null,
  _loadId: 0,
};

export const usePatientStore = create<PatientStore & InternalState>()((set, get) => ({
  ...initialState,

  setPatients: (patients) =>
    set({
      patientMap: new Map(patients.map((p) => [p.patientId, p])),
      isLoaded: true,
      isLoading: false,
      loadError: null,
    }),

  upsertPatient: (patient) =>
    set((s) => {
      const next = new Map(s.patientMap);
      next.set(patient.patientId, patient);
      return { patientMap: next };
    }),

  removePatient: (patientId) =>
    set((s) => {
      if (!s.patientMap.has(patientId)) return s;
      const next = new Map(s.patientMap);
      next.delete(patientId);
      return { patientMap: next };
    }),

  fetchPatients: async (accessToken) => {
    const loadId = get()._loadId + 1;
    set({ _loadId: loadId, isLoading: true, loadError: null });
    try {
      const patients = await nextApi.patients.getMyPatients(accessToken);
      if (get()._loadId !== loadId) return;
      set({
        patientMap: new Map(patients.map((p) => [p.patientId, p])),
        isLoaded: true,
        isLoading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (err) {
      if (get()._loadId !== loadId) return;
      set({
        isLoading: false,
        loadError: err instanceof Error ? err.message : 'Failed to load patients.',
      });
    }
  },

  getPatients: () => Array.from(get().patientMap.values()),
  getSelfPatient: () =>
    Array.from(get().patientMap.values()).find((p) => p.relationship === UserRelationship.Self) ??
    null,
  getOtherPatients: () =>
    Array.from(get().patientMap.values())
      .filter((p) => p.relationship !== UserRelationship.Self)
      .sort((a, b) => (a.ordinal ?? 0) - (b.ordinal ?? 0)),
  hasSelfPatient: () =>
    Array.from(get().patientMap.values()).some((p) => p.relationship === UserRelationship.Self),

  reset: () => set((s) => ({ ...initialState, _loadId: s._loadId + 1 })),
}));

/* -------------------------------------------------------------------------
 * Reactive selectors
 *
 * These hooks subscribe the calling component to the slice of the store
 * they read, so the consumer doesn't need to remember to also call
 * `usePatientStore(...)` to opt into reactivity. Prefer these in render
 * over `stores.patient.getSelfPatient()` etc. (which are non-reactive
 * snapshots intended for event handlers / effects).
 * ------------------------------------------------------------------------- */

const pickSelfPatient = (s: PatientStore): Patient | null => {
  for (const p of s.patientMap.values()) {
    if (p.relationship === UserRelationship.Self) return p;
  }
  return null;
};

const pickOtherPatients = (s: PatientStore): Patient[] =>
  Array.from(s.patientMap.values())
    .filter((p) => p.relationship !== UserRelationship.Self)
    .sort((a, b) => (a.ordinal ?? 0) - (b.ordinal ?? 0));

// `pickSelfPatient` returns a stable map entry → default Object.is is fine.
export const useSelfPatient = () => usePatientStore(pickSelfPatient);
// `pickOtherPatients` builds a fresh array each call → must use shallow
// equality so a re-render doesn't tear `useSyncExternalStore`.
export const useOtherPatients = () => usePatientStore(useShallow(pickOtherPatients));
export const useHasSelfPatient = () =>
  usePatientStore((s) => {
    for (const p of s.patientMap.values()) {
      if (p.relationship === UserRelationship.Self) return true;
    }
    return false;
  });

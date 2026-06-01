'use client';

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { nextApi } from '../api/next';
import type { Patient, PatientInsurance } from '../types/patients';
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
  /**
   * Insurances are kept in a sibling map keyed by patientId so consumers
   * can subscribe to a single patient's insurance list without re-rendering
   * on unrelated patient mutations. Hydrated from `patient.insurances` at
   * ingest time (fetch / upsert) and mutated directly by the insurance CRUD
   * actions below.
   */
  insuranceMap: Map<string, PatientInsurance[]>;
  isLoaded: boolean;
  isLoading: boolean;
  loadError: string | null;
  lastFetchedAt: number | null;

  setPatients: (patients: Patient[]) => void;
  upsertPatient: (patient: Patient) => void;
  removePatient: (patientId: string) => void;
  fetchPatients: (accessToken: string) => Promise<void>;

  addPatientInsurance: (patientId: string, insurance: PatientInsurance) => void;
  removePatientInsurance: (patientId: string, patientInsuranceId: number) => void;

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
  insuranceMap: new Map<string, PatientInsurance[]>(),
  isLoaded: false,
  isLoading: false,
  loadError: null,
  lastFetchedAt: null,
  _loadId: 0,
};

const bucketInsurances = (patients: Patient[]): Map<string, PatientInsurance[]> => {
  const next = new Map<string, PatientInsurance[]>();
  patients.forEach((p) => {
    if (p.insurances) next.set(p.patientId, p.insurances);
  });
  return next;
};

export const usePatientStore = create<PatientStore & InternalState>()((set, get) => ({
  ...initialState,

  setPatients: (patients) =>
    set({
      patientMap: new Map(patients.map((p) => [p.patientId, p])),
      insuranceMap: bucketInsurances(patients),
      isLoaded: true,
      isLoading: false,
      loadError: null,
    }),

  upsertPatient: (patient) =>
    set((s) => {
      const nextPatients = new Map(s.patientMap);
      nextPatients.set(patient.patientId, patient);
      // Only refresh insurance bucket when the incoming payload carries one,
      // so callers that only patched scalar fields don't clobber prior data.
      const nextInsurances =
        patient.insurances !== undefined
          ? (() => {
              const m = new Map(s.insuranceMap);
              m.set(patient.patientId, patient.insurances ?? []);
              return m;
            })()
          : s.insuranceMap;
      return { patientMap: nextPatients, insuranceMap: nextInsurances };
    }),

  removePatient: (patientId) =>
    set((s) => {
      if (!s.patientMap.has(patientId)) return s;
      const nextPatients = new Map(s.patientMap);
      nextPatients.delete(patientId);
      const nextInsurances = new Map(s.insuranceMap);
      nextInsurances.delete(patientId);
      return { patientMap: nextPatients, insuranceMap: nextInsurances };
    }),

  fetchPatients: async (accessToken) => {
    const loadId = get()._loadId + 1;
    set({ _loadId: loadId, isLoading: true, loadError: null });
    try {
      const patients = await nextApi.patients.getMyPatients(accessToken);
      if (get()._loadId !== loadId) return;
      set({
        patientMap: new Map(patients.map((p) => [p.patientId, p])),
        insuranceMap: bucketInsurances(patients),
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

  addPatientInsurance: (patientId, insurance) =>
    set((s) => {
      const list = s.insuranceMap.get(patientId) ?? [];
      // Guard against double-submits accidentally inserting duplicates.
      if (list.some((i) => i.patientInsuranceId === insurance.patientInsuranceId)) return s;
      const next = new Map(s.insuranceMap);
      next.set(patientId, [...list, insurance]);
      return { insuranceMap: next };
    }),

  removePatientInsurance: (patientId, patientInsuranceId) =>
    set((s) => {
      const list = s.insuranceMap.get(patientId);
      if (!list) return s;
      const nextList = list.filter((i) => i.patientInsuranceId !== patientInsuranceId);
      const next = new Map(s.insuranceMap);
      next.set(patientId, nextList);
      return { insuranceMap: next };
    }),

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

// Returns a stable map entry (the array reference is only swapped when the
// insurance list for *this* patient mutates), so default Object.is is fine.
export const usePatientInsurances = (patientId: string): PatientInsurance[] =>
  usePatientStore((s) => s.insuranceMap.get(patientId) ?? EMPTY_INSURANCES);

const EMPTY_INSURANCES: PatientInsurance[] = [];

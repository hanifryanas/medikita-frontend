'use client';

import { create } from 'zustand';
import type { Patient } from '../types/patients';
import { UserRelationship } from '../types/users';

export interface PatientStore {
  patientMap: Map<string, Patient>;
  isLoaded: boolean;
  isLoading: boolean;
  loadError: string | null;

  setIsLoading: (isLoading: boolean) => void;
  setLoadError: (error: string | null) => void;
  setPatients: (patients: Patient[]) => void;
  upsertPatient: (patient: Patient) => void;
  removePatient: (patientId: string) => void;

  getPatients: () => Patient[];
  getSelfPatient: () => Patient | null;
  getOtherPatients: () => Patient[];

  reset: () => void;
}

const initialState = {
  patientMap: new Map<string, Patient>(),
  isLoaded: false,
  isLoading: false,
  loadError: null,
};

export const usePatientStore = create<PatientStore>()((set, get) => ({
  ...initialState,

  setIsLoading: (isLoading) => set({ isLoading }),
  setLoadError: (loadError) => set({ loadError }),

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

  getPatients: () => Array.from(get().patientMap.values()),
  getSelfPatient: () =>
    Array.from(get().patientMap.values()).find((p) => p.relationship === UserRelationship.Self) ??
    null,
  getOtherPatients: () =>
    Array.from(get().patientMap.values())
      .filter((p) => p.relationship !== UserRelationship.Self)
      .sort((a, b) => (a.ordinal ?? 0) - (b.ordinal ?? 0)),

  reset: () => set(initialState),
}));

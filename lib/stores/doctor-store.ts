'use client';

import { create } from 'zustand';
import type { Doctor } from '../types/doctors';

export interface DoctorStore {
  doctors: Doctor[];
  doctorMap: Map<string, Doctor>;
  isLoaded: boolean;
  isLoading: boolean;
  reset: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setDoctors: (doctors: Doctor[]) => void;
  getDoctorById: (doctorId: string) => Doctor | undefined;
}

const initialState = {
  doctors: [] as Doctor[],
  doctorMap: new Map<string, Doctor>(),
  isLoaded: false,
  isLoading: false,
};

export const useDoctorStore = create<DoctorStore>()((set, get) => ({
  ...initialState,

  reset: () => set(initialState),

  setIsLoading: (isLoading) => set({ isLoading }),

  setDoctors: (doctors) => {
    const doctorMap = new Map<string, Doctor>();
    doctors.forEach((doctor) => doctorMap.set(doctor.doctorId, doctor));
    set({ doctors, doctorMap, isLoaded: true, isLoading: false });
  },

  getDoctorById: (doctorId) => get().doctorMap.get(doctorId),
}));

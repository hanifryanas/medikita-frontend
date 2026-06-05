'use client';

import { create } from 'zustand';
import { nextApi } from '../api/next';
import type { CreateAppointmentPayload } from '../types/appointment';

export interface AppointmentStore {
  isBooking: boolean;
  bookError: string | null;
  lastBookedId: string | null;

  createAppointment: (payload: CreateAppointmentPayload) => Promise<string>;
  clearBookError: () => void;
  reset: () => void;
}

const initialState = {
  isBooking: false,
  bookError: null,
  lastBookedId: null,
};

export const useAppointmentStore = create<AppointmentStore>()((set) => ({
  ...initialState,

  createAppointment: async (payload) => {
    set({ isBooking: true, bookError: null });
    try {
      const appointmentId = await nextApi.appointments.createAppointment(payload);
      set({ isBooking: false, lastBookedId: appointmentId });
      return appointmentId;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to book appointment.';
      set({ isBooking: false, bookError: message });
      throw err;
    }
  },

  clearBookError: () => set({ bookError: null }),
  reset: () => set({ ...initialState }),
}));

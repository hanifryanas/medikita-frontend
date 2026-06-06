'use client';

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { nextApi } from '../api/next';
import type { Appointment, CreateAppointmentPayload } from '../types/appointment';

export interface AppointmentStore {
  appointmentMap: Map<string, Appointment>;
  isLoaded: boolean;
  isLoading: boolean;
  loadError: string | null;
  lastFetchedAt: number | null;

  isBooking: boolean;
  bookError: string | null;
  lastBookedId: string | null;

  setAppointments: (appointments: Appointment[]) => void;
  upsertAppointment: (appointment: Appointment) => void;
  removeAppointment: (appointmentId: string) => void;
  fetchAppointments: () => Promise<void>;

  createAppointment: (payload: CreateAppointmentPayload) => Promise<string>;

  getAppointments: () => Appointment[];

  clearBookError: () => void;
  reset: () => void;
}

interface InternalState {
  _loadId: number;
}

const initialState = {
  appointmentMap: new Map<string, Appointment>(),
  isLoaded: false,
  isLoading: false,
  loadError: null,
  lastFetchedAt: null,
  isBooking: false,
  bookError: null,
  lastBookedId: null,
  _loadId: 0,
};

export const useAppointmentStore = create<AppointmentStore & InternalState>()((set, get) => ({
  ...initialState,

  setAppointments: (appointments) =>
    set({
      appointmentMap: new Map(appointments.map((a) => [a.appointmentId, a])),
      isLoaded: true,
      isLoading: false,
      loadError: null,
    }),

  upsertAppointment: (appointment) =>
    set((s) => {
      const next = new Map(s.appointmentMap);
      next.set(appointment.appointmentId, appointment);
      return { appointmentMap: next };
    }),

  removeAppointment: (appointmentId) =>
    set((s) => {
      if (!s.appointmentMap.has(appointmentId)) return s;
      const next = new Map(s.appointmentMap);
      next.delete(appointmentId);
      return { appointmentMap: next };
    }),

  fetchAppointments: async () => {
    const loadId = get()._loadId + 1;
    set({ _loadId: loadId, isLoading: true, loadError: null });
    try {
      const appointments = await nextApi.appointments.getMyAppointments();
      if (get()._loadId !== loadId) return;
      set({
        appointmentMap: new Map(appointments.map((a) => [a.appointmentId, a])),
        isLoaded: true,
        isLoading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (err) {
      if (get()._loadId !== loadId) return;
      set({
        isLoading: false,
        loadError: err instanceof Error ? err.message : 'Failed to load appointments.',
      });
    }
  },

  createAppointment: async (payload) => {
    set({ isBooking: true, bookError: null });
    try {
      const appointmentId = await nextApi.appointments.createAppointment(payload);
      set({ isBooking: false, lastBookedId: appointmentId });
      void get().fetchAppointments();
      return appointmentId;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to book appointment.';
      set({ isBooking: false, bookError: message });
      throw err;
    }
  },

  getAppointments: () => Array.from(get().appointmentMap.values()),

  clearBookError: () => set({ bookError: null }),
  reset: () => set((s) => ({ ...initialState, _loadId: s._loadId + 1 })),
}));

const pickAppointments = (s: AppointmentStore): Appointment[] =>
  Array.from(s.appointmentMap.values()).sort((a, b) => {
    const dateCmp = b.date.localeCompare(a.date);
    return dateCmp !== 0 ? dateCmp : b.timeSlot.localeCompare(a.timeSlot);
  });

export const useAppointments = () => useAppointmentStore(useShallow(pickAppointments));

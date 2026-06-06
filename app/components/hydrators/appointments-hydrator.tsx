'use client';

import { useAppointmentStore } from '@/lib/stores/appointment-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { AuthStatus } from '@/lib/types/auth';
import { minutesToMilliseconds } from 'date-fns';
import { useEffect } from 'react';

const STALE_AFTER_MS = minutesToMilliseconds(5);

export const AppointmentsHydrator = () => {
  const status = useAuthStore((s) => s.status);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (status !== AuthStatus.Authenticated || !accessToken) {
      useAppointmentStore.getState().reset();
      return;
    }

    const { isLoaded, isLoading, fetchAppointments } = useAppointmentStore.getState();
    if (!isLoaded && !isLoading) void fetchAppointments();

    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      const state = useAppointmentStore.getState();
      if (state.isLoading) return;
      const stale =
        state.lastFetchedAt === null || Date.now() - state.lastFetchedAt > STALE_AFTER_MS;
      if (stale) void state.fetchAppointments();
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [status, accessToken]);

  return null;
};

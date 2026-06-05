'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { usePatientStore } from '@/lib/stores/patient-store';
import { AuthStatus } from '@/lib/types/auth';
import { minutesToMilliseconds } from 'date-fns';
import { useEffect } from 'react';

const STALE_AFTER_MS = minutesToMilliseconds(10);

export const PatientHydrator = () => {
  const status = useAuthStore((s) => s.status);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (status !== AuthStatus.Authenticated || !accessToken) {
      usePatientStore.getState().reset();
      return;
    }

    const { isLoaded, isLoading, fetchPatients } = usePatientStore.getState();
    if (!isLoaded && !isLoading) void fetchPatients();

    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      const state = usePatientStore.getState();
      if (state.isLoading) return;
      const stale =
        state.lastFetchedAt === null || Date.now() - state.lastFetchedAt > STALE_AFTER_MS;
      if (stale) void state.fetchPatients();
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [status, accessToken]);

  return null;
};

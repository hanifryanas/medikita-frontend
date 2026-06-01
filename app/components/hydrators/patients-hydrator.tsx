'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { usePatientStore } from '@/lib/stores/patient-store';
import { AuthStatus } from '@/lib/types/auth';
import { useEffect } from 'react';

export const PatientsHydrator = () => {
  const status = useAuthStore((s) => s.status);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (status !== AuthStatus.Authenticated || !accessToken) {
      usePatientStore.getState().reset();
      return;
    }

    const { isLoaded, isLoading, fetchPatients } = usePatientStore.getState();
    if (isLoaded || isLoading) return;

    void fetchPatients(accessToken);
  }, [status, accessToken]);

  return null;
};

'use client';

import { nextApi } from '@/lib/api';
import { useDoctorStore } from '@/lib/stores';
import { useEffect } from 'react';

export const DoctorHydrator = () => {
  useEffect(() => {
    (async () => {
      const { isLoaded, isLoading, setDoctors, setIsLoading, reset } = useDoctorStore.getState();
      if (isLoaded || isLoading) return;

      setIsLoading(true);
      try {
        const doctors = await nextApi.doctors.getDoctors();
        setDoctors(doctors);
      } catch {
        reset();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return null;
};

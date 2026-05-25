'use client';

import { nextApi } from '@/lib/api';
import { stores } from '@/lib/stores';
import { sanitizeDoctorResultToCareTeam } from '@/lib/utils/sanitizers';
import { useEffect } from 'react';

export const CareTeamHydrator = () => {
  useEffect(() => {
    (async () => {
      const { isLoaded, isLoading, setCareTeams, setIsLoading, reset } = stores.careTeams;
      if (isLoaded || isLoading) return;

      setIsLoading(true);
      try {
        const doctors = await nextApi.doctors.getDoctors();
        setCareTeams(doctors.map(sanitizeDoctorResultToCareTeam));
      } catch {
        reset();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return null;
};

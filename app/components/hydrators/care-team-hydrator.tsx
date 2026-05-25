'use client';

import { nextApi } from '@/lib/api';
import { stores } from '@/lib/stores';
import {
  sanitizeDoctorResultToCareTeam,
  sanitizeNurseResultToCareTeam,
} from '@/lib/utils/sanitizers';
import { useEffect } from 'react';

export const CareTeamHydrator = () => {
  useEffect(() => {
    (async () => {
      const { isLoaded, isLoading, setCareTeams, setIsLoading, reset } = stores.careTeams;
      if (isLoaded || isLoading) return;

      setIsLoading(true);
      try {
        const [doctors, nurses] = await Promise.all([
          nextApi.doctors.getDoctors(),
          nextApi.nurses.getNurses(),
        ]);
        setCareTeams([
          ...doctors.map(sanitizeDoctorResultToCareTeam),
          ...nurses.map(sanitizeNurseResultToCareTeam),
        ]);
      } catch {
        reset();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return null;
};

'use client';

import { nextApi } from '@/lib/api';
import { CareTeamRole, DetailedCareTeam } from '@/lib/types/care-teams';
import { EmployeeRole } from '@/lib/types/employees';
import {
  sanitizeDoctorResultToDetailedCareTeam,
  sanitizeNurseResultToDetailedCareTeam,
} from '@/lib/utils/sanitizers';
import { useEffect, useState } from 'react';

export interface UseCareTeamResult {
  careTeam: DetailedCareTeam | undefined;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | undefined;
}

export function useCareTeam(
  role: CareTeamRole | undefined,
  id: string | undefined
): UseCareTeamResult {
  const [careTeam, setCareTeam] = useState<DetailedCareTeam | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!role || !id) {
      setCareTeam(undefined);
      setIsLoaded(false);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setIsLoaded(false);
    setError(undefined);

    (async () => {
      try {
        const detailed =
          role === EmployeeRole.Doctor
            ? sanitizeDoctorResultToDetailedCareTeam(await nextApi.doctors.getDoctorById(id))
            : sanitizeNurseResultToDetailedCareTeam(await nextApi.nurses.getNurseById(id));

        if (cancelled) return;
        setCareTeam(detailed);
      } catch (err) {
        if (cancelled) return;
        setCareTeam(undefined);
        setError(err instanceof Error ? err.message : 'Failed to load care team.');
      } finally {
        if (cancelled) return;
        setIsLoading(false);
        setIsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [role, id]);

  return { careTeam, isLoading, isLoaded, error };
}

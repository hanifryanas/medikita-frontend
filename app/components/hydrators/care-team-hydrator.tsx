'use client';

import { stores } from '@/lib/stores';
import { useEffect } from 'react';

export const CareTeamHydrator = () => {
  useEffect(() => {
    const { isLoaded, isLoading, fetchCareTeams } = stores.careTeams;
    if (!isLoaded && !isLoading) void fetchCareTeams();
  }, []);

  return null;
};

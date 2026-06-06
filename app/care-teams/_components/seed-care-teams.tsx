'use client';

import { useCareTeamsStore } from '@/lib/stores/care-teams-store';
import type { CareTeam } from '@/lib/types/care-teams';
import { useEffect, useRef } from 'react';

/**
 * Seeds the care-teams Zustand store with server-fetched data so the existing
 * `useCareTeams()` filter pipeline has data on first paint and the global
 * CareTeamHydrator's effect skips its own fetch.
 *
 * Runs in a layout/effect rather than during render to avoid triggering
 * setState in other subscribers while React is rendering.
 */
export const SeedCareTeams = ({ careTeams }: { careTeams: CareTeam[] }) => {
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    const state = useCareTeamsStore.getState();
    // Don't clobber a more recent client-side load.
    if (state.isLoaded && state.careTeamMap.size > 0) return;

    useCareTeamsStore.setState({
      careTeamMap: new Map(careTeams.map((c) => [c.careTeamId, c])),
      isLoaded: true,
      isLoading: false,
      loadError: null,
      lastFetchedAt: Date.now(),
    });
  }, [careTeams]);

  return null;
};

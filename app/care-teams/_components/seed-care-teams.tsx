'use client';

import { useCareTeamsStore } from '@/lib/stores/care-teams-store';
import type { CareTeam } from '@/lib/types/care-teams';
import { useState } from 'react';

/**
 * Seeds the care-teams Zustand store with server-fetched data during render
 * so the existing `useCareTeams()` filter pipeline has data on first paint
 * and the global CareTeamHydrator's effect skips its own fetch.
 *
 * Render-phase seeding (via useState initialiser) runs before any useEffect,
 * which is what we need to beat the global hydrator.
 */
export const SeedCareTeams = ({ careTeams }: { careTeams: CareTeam[] }) => {
  useState(() => {
    useCareTeamsStore.setState({
      careTeamMap: new Map(careTeams.map((c) => [c.careTeamId, c])),
      isLoaded: true,
      isLoading: false,
      loadError: null,
      lastFetchedAt: Date.now(),
    });
    return true;
  });
  return null;
};

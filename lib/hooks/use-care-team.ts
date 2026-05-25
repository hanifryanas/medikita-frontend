'use client';

import { useStores } from '../stores';
import { CareTeam, CareTeamRole } from '../types/care-teams';

export function useCareTeam(
  role: CareTeamRole | undefined,
  id: string | undefined
): CareTeam | undefined {
  const {
    careTeamsStore: { getCareTeamById },
  } = useStores();

  if (!role || !id) return undefined;

  const careTeam = getCareTeamById(id);
  if (!careTeam || careTeam.role !== role) return undefined;
  return careTeam;
}

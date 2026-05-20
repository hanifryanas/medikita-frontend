'use client';

import { useStores } from '../stores';
import { CareTeam, CareTeamRole } from '../types/care-teams';
import { EmployeeRole } from '../types/employees';
import { sanitizeDoctorToCareTeam } from '../utils/sanitizers';

export function useCareTeam(
  role: CareTeamRole | undefined,
  id: string | undefined
): CareTeam | undefined {
  const {
    doctorStore: { getDoctorById },
  } = useStores();

  if (!role || !id) return undefined;

  if (role === EmployeeRole.Doctor) {
    const doctor = getDoctorById(id);
    return doctor ? sanitizeDoctorToCareTeam(doctor) : undefined;
  }

  return undefined;
}

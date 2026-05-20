import { EmployeeRole } from '../employees';

export type CareTeamRoleSegment = 'doctors' | 'nurses';

export type CareTeamRole = EmployeeRole.Doctor | EmployeeRole.Nurse;

const SEGMENT_TO_ROLE: Record<CareTeamRoleSegment, CareTeamRole> = {
  doctors: EmployeeRole.Doctor,
  nurses: EmployeeRole.Nurse,
};

const ROLE_TO_SEGMENT: Record<CareTeamRole, CareTeamRoleSegment> = {
  [EmployeeRole.Doctor]: 'doctors',
  [EmployeeRole.Nurse]: 'nurses',
};

export const isCareTeamRoleSegment = (value: string): value is CareTeamRoleSegment =>
  value === 'doctors' || value === 'nurses';

export const segmentToCareTeamRole = (segment: CareTeamRoleSegment): CareTeamRole =>
  SEGMENT_TO_ROLE[segment];

export const careTeamRoleToSegment = (role: CareTeamRole): CareTeamRoleSegment =>
  ROLE_TO_SEGMENT[role];

export const buildCareTeamLink = (role: EmployeeRole, id: string): string | undefined => {
  if (role === EmployeeRole.Doctor || role === EmployeeRole.Nurse) {
    return `/care-teams/${ROLE_TO_SEGMENT[role]}/${id}`;
  }
  return undefined;
};

import { NurseResult } from '@/lib/api/next/nurses/types/nurse-result';
import { CareTeam } from '@/lib/types/care-teams';
import { EmployeeRole } from '@/lib/types/employees';

export const sanitizeNurseResultToCareTeam = (nurse: NurseResult): CareTeam => {
  return {
    careTeamId: nurse.nurseId,
    role: EmployeeRole.Nurse,
    departmentTypeCode: nurse.employee?.departmentTypeCode ?? '',
    fullName: nurse.employee?.fullName ?? nurse.employee?.displayName ?? nurse.fullName ?? 'Nurse',
    displayName: nurse.fullName ?? nurse.employee?.displayName ?? 'Nurse',
    photoUrl: nurse.employee?.photoUrl,
    title: nurse.title,
    jobTitle: nurse.jobTitle,
    scheduleDays: nurse.scheduleDays ?? [],
  };
};

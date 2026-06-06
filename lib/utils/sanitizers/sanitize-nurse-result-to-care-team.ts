import { NurseResult } from '@/lib/api/next/nurses/types/nurse-result';
import { CareTeam } from '@/lib/types/care-teams';
import { EmployeeRole } from '@/lib/types/employees';
import type { DepartmentLookupEntry } from './sanitize-doctor-result-to-care-team';

export const sanitizeNurseResultToCareTeam = (
  nurse: NurseResult,
  departmentByCode?: ReadonlyMap<string, DepartmentLookupEntry>
): CareTeam => {
  const departmentTypeCode = nurse.employee?.departmentTypeCode ?? '';
  const department = departmentByCode?.get(departmentTypeCode);
  return {
    careTeamId: nurse.nurseId,
    role: EmployeeRole.Nurse,
    departmentTypeCode,
    departmentName: department?.displayName,
    departmentIconName: department?.iconName,
    fullName: nurse.employee?.fullName ?? nurse.employee?.displayName ?? nurse.fullName ?? 'Nurse',
    displayName: nurse.fullName ?? nurse.employee?.displayName ?? 'Nurse',
    photoUrl: nurse.employee?.photoUrl,
    title: nurse.title,
    jobTitle: nurse.jobTitle,
    scheduleDays: nurse.scheduleDays ?? [],
  };
};

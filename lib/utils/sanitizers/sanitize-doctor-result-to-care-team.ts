import { DoctorResult } from '@/lib/api/next/doctors/types/doctor-result';
import { CareTeam } from '@/lib/types/care-teams';
import { EmployeeRole } from '@/lib/types/employees';

export interface DepartmentLookupEntry {
  displayName: string;
  iconName?: string;
}

export const sanitizeDoctorResultToCareTeam = (
  doctor: DoctorResult,
  departmentByCode?: ReadonlyMap<string, DepartmentLookupEntry>
): CareTeam => {
  const departmentTypeCode = doctor.employee?.departmentTypeCode ?? '';
  const department = departmentByCode?.get(departmentTypeCode);
  return {
    careTeamId: doctor.doctorId,
    role: EmployeeRole.Doctor,
    departmentTypeCode,
    departmentName: department?.displayName,
    departmentIconName: department?.iconName,
    fullName: doctor.employee?.fullName ?? doctor.employee?.displayName ?? doctor.fullName ?? 'Doctor',
    displayName: doctor.fullName ?? doctor.employee?.displayName ?? 'Doctor',
    photoUrl: doctor.employee?.photoUrl,
    title: doctor.title,
    jobTitle: doctor.jobTitle,
    scheduleDays: doctor.scheduleDays ?? [],
  };
};

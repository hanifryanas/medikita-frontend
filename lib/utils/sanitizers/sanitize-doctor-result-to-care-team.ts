import { DoctorResult } from '@/lib/api/next/doctors/types/doctor-result';
import { CareTeam } from '@/lib/types/care-teams';
import { EmployeeRole } from '@/lib/types/employees';

export const sanitizeDoctorResultToCareTeam = (doctor: DoctorResult): CareTeam => {
  return {
    careTeamId: doctor.doctorId,
    role: EmployeeRole.Doctor,
    departmentTypeCode: doctor.employee?.departmentTypeCode ?? '',
    fullName: doctor.employee?.fullName ?? doctor.employee?.displayName ?? doctor.fullName ?? 'Doctor',
    displayName: doctor.fullName ?? doctor.employee?.displayName ?? 'Doctor',
    photoUrl: doctor.employee?.photoUrl,
    title: doctor.title,
    jobTitle: doctor.jobTitle,
    scheduleDays: doctor.scheduleDays ?? [],
  };
};

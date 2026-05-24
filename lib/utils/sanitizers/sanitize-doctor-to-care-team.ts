import { CareTeam } from '@/lib/types/care-teams';
import { Doctor } from '@/lib/types/doctors';
import { EmployeeRole } from '@/lib/types/employees';

export const sanitizeDoctorToCareTeam = (doctor: Doctor): CareTeam => {
  return {
    careTeamId: doctor.doctorId,
    role: EmployeeRole.Doctor,
    departmentTypeCode: doctor.employee?.departmentTypeCode ?? '',
    fullName: doctor.fullName,
    displayName: doctor.fullName ?? doctor.employee?.displayName ?? 'Doctor',
    photoUrl: doctor.photoUrl ?? doctor.employee?.photoUrl,
    title: doctor.title,
    jobTitle: doctor.jobTitle,
    scheduleDays: doctor.scheduleDays ?? [],
  };
};

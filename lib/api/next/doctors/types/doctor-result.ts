import { Day, Schedule } from '@/lib/types/common';

export interface DoctorResult {
  doctorId: string;
  employee: {
    employeeId: string;
    user: {
      userId: string;
      firstName: string;
      lastName: string;
    };
    photoUrl?: string;
    startDate: string;
    fullName: string;
    displayName: string;
    departmentTypeCode: string;
    employmentDuration: string;
  };
  fullName: string;
  title?: string;
  jobTitle?: string;
  scheduleDays?: Day[];
  schedules?: Schedule[];
}

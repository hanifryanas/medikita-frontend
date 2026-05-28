import { Day } from '@/lib/types/common';

export interface DoctorScheduleResult {
  doctorScheduleId: number;
  day: Day;
  doctor: { doctorId: string };
  date?: string;
  timeSlots: string[];
  bookedTimeSlots: string[];
}

export interface DoctorScheduleQuery {
  doctorId?: string;
  departmentId?: number;
  startDate?: string;
  endDate?: string;
}

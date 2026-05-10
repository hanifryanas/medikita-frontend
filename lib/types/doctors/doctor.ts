import type { Appointment } from '../appointment';
import type { Employee } from '../employees';
import type { DoctorSchedule } from './doctor-schedule';

export interface Doctor {
  doctorId: string;
  employee?: Employee;
  title?: string;
  jobTitle?: string;
  schedules?: DoctorSchedule[];
  appointments?: Appointment[];
  isAvailable?: boolean;
}

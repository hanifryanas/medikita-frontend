import type { Appointment } from '../appointment';
import type { Employee } from '../employees';
import type { DoctorSchedule } from './doctor-schedule';

export interface Doctor {
  doctorId: string;
  employee?: Employee;
  /** Indonesian specialist title abbreviation (e.g. 'Sp.JP', 'Sp.OG', 'Sp.A'). */
  title?: string;
  /** Plain-language job title (e.g. 'Cardiologist', 'Pediatrician'). */
  jobTitle?: string;
  schedules?: DoctorSchedule[];
  appointments?: Appointment[];
  isAvailable?: boolean;
}

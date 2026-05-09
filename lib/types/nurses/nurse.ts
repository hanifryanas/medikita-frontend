import type { Appointment } from '../appointment';
import type { Employee } from '../employees';
import type { NurseSchedule } from './nurse-schedule';

export interface Nurse {
  nurseId: string;
  employee?: Employee;
  title?: string;
  schedules?: NurseSchedule[];
  appointments?: Appointment[];
  isAvailable?: boolean;
}

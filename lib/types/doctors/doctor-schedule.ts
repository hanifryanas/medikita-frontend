import { Day } from '../common';
import type { Doctor } from './doctor';

export interface DoctorSchedule {
  doctorScheduleId: number;
  doctor?: Doctor;
  day: Day;
  /** HH:MM */
  startTime: string;
  /** HH:MM */
  endTime: string;
}

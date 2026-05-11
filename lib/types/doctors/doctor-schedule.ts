import { Day } from '../common';
import type { Doctor } from './doctor';

export interface DoctorSchedule {
  doctorScheduleId: number;
  doctorId: Doctor['doctorId'];
  day: Day;
  startTime: string;
  endTime: string;
}

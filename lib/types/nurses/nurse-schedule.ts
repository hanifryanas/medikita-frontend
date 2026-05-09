import { Day } from '../common';
import type { Nurse } from './nurse';

export interface NurseSchedule {
  nurseScheduleId: number;
  nurse?: Nurse;
  day: Day;
  /** HH:MM */
  startTime: string;
  /** HH:MM */
  endTime: string;
}

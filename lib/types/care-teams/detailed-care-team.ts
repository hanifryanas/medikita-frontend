import { Schedule } from '../common';
import { CareTeam } from './care-team';

export interface DetailedCareTeam extends Omit<CareTeam, 'scheduleDays'> {
  employmentDuration: string;
  schedules: Schedule[];
  age?: number;
  patientCount?: number;
}

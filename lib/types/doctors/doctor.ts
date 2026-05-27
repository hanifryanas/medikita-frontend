import { CareTeam } from '../care-teams';
import { Schedule } from '../common';

export interface Doctor extends Omit<CareTeam, 'careTeamId' | 'role' | 'scheduleDays'> {
  doctorId: string;
  age?: number;
  patientCount?: number;
  schedules: Schedule[];
}

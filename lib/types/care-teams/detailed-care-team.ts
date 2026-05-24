import { CareTeam } from './care-team';

export interface DetailedCareTeam extends Omit<CareTeam, 'scheduleDays'> {
  age: number;
  employmentDuration: string;
  patientCount: number;
}

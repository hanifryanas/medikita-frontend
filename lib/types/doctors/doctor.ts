import { CareTeam } from '../care-teams';
import type { Employee } from '../employees';

export interface Doctor extends Omit<CareTeam, 'careTeamId' | 'role' | 'departmentTypeCode'> {
  doctorId: string;
  employee?: Employee;
}

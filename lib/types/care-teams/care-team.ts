import { Day } from '../common';
import { EmployeeRole } from '../employees';

export interface CareTeam {
  careTeamId: string;
  role: EmployeeRole.Doctor | EmployeeRole.Nurse;
  departmentTypeCode: string;
  departmentName?: string;
  departmentIconName?: string;
  fullName: string;
  displayName: string;
  photoUrl?: string;
  title?: string;
  jobTitle?: string;
  scheduleDays?: Day[];
}

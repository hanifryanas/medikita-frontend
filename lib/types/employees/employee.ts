import type { Department } from '../departments';
import type { Doctor } from '../doctors';
import type { Nurse } from '../nurses';
import type { User } from '../users';
import { EmployeeRole } from './employee-role';

export interface Employee {
  employeeId: string;
  user: User;
  fullName: string;
  displayName: string;
  role: EmployeeRole;
  department?: Department;
  doctor?: Doctor;
  nurse?: Nurse;
  photoUrl?: string;
  jobTitle?: string;
  employmentDuration: string;
  departmentTypeCode: string;
}

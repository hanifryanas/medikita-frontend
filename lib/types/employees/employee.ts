import type { Department } from '../departments';
import type { Doctor } from '../doctors';
import type { Nurse } from '../nurses';
import type { User } from '../users';

export interface Employee {
  employeeId: string;
  user: User;
  fullName: string;
  nurse?: Nurse;
  doctor?: Doctor;
  photoUrl?: string;
  jobTitle?: string;
  startDate: string;
  retirementDate?: string;
  employmentDuration: string;
  departmentId: number;
  department: Department;
}

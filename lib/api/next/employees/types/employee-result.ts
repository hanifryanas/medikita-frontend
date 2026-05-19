import { Doctor } from '@/lib/types/doctors';
import { Nurse } from '@/lib/types/nurses';
import { User } from '@/lib/types/users';

export interface EmployeeResult {
  employeeId: string;
  user: User;
  fullName: string;
  displayName: string;
  nurse?: Nurse;
  doctor?: Doctor;
  photoUrl?: string;
  jobTitle?: string;
  featuredOrdinal?: number;
  startDate: string;
  retirementDate?: string;
  employmentDuration: string;
}

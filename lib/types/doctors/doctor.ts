import { Day } from '../common';
import type { Employee } from '../employees';

export interface Doctor {
  doctorId: string;
  fullName: string;
  employee?: Employee;
  title?: string;
  jobTitle?: string;
  scheduleDays?: Day[];
  isAvailable?: boolean;
}

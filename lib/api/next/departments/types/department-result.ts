import { Department } from '@/lib/types/departments';
import { EmployeeResult } from '../../employees/types';

export interface DepartmentResult extends Omit<Department, 'employees'> {
  employees?: EmployeeResult[];
}

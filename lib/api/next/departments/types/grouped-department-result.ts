import { FeaturedDepartment } from '@/lib/types/departments/featured-department';
import { EmployeeResult } from '../../employees/types';
import { DepartmentResult } from './department-result';

export interface FeaturedDepartmentResult extends Omit<FeaturedDepartment, 'employees'> {
  employees?: EmployeeResult[];
}

export interface GroupedDepartmentResult {
  departments: DepartmentResult[];
  featuredDepartments: FeaturedDepartmentResult[];
}

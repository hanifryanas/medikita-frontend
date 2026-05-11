import { FeaturedDepartment } from '@/lib/types/departments/featured-department';
import { DepartmentResult } from './department-result';

export interface GroupedDepartmentResult {
  departments: DepartmentResult[];
  featuredDepartments: FeaturedDepartment[];
}

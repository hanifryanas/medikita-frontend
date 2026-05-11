import { Department } from '@/lib/types/departments';
import { FeaturedDepartment } from '@/lib/types/departments/featured-department';
import { sanitizeDepartmentEmployeeResult } from '../../employees/sanitizers';
import { GroupedDepartmentResult } from '../types';

export const sanitizeGroupedDepartmentResult = (
  groupedDepartment: GroupedDepartmentResult
): {
  departments: Department[];
  featuredDepartments: FeaturedDepartment[];
} => {
  const departments = groupedDepartment.departments.map((dept) => ({
    ...dept,
    employees:
      dept.employees?.map((emp) => sanitizeDepartmentEmployeeResult(dept.typeCode, emp)) || [],
  }));

  const featuredDepartments = groupedDepartment.featuredDepartments;

  return { departments, featuredDepartments };
};

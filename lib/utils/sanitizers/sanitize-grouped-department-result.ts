import { GroupedDepartmentResult } from '@/lib/api/next/departments/types';
import { Department } from '@/lib/types/departments';
import { FeaturedDepartment } from '@/lib/types/departments/featured-department';
import { sanitizeEmployeeResultToDepartmentEmployee } from './sanitize-employee-result-to-department-employee';

export const sanitizeGroupedDepartmentResult = (
  groupedDepartment: GroupedDepartmentResult
): {
  departments: Department[];
  featuredDepartments: FeaturedDepartment[];
} => {
  const departments = groupedDepartment.departments.map((dept) => ({
    ...dept,
    employees:
      dept.employees?.map((emp) =>
        sanitizeEmployeeResultToDepartmentEmployee(dept.typeCode, emp)
      ) || [],
  }));

  const featuredDepartments = groupedDepartment.featuredDepartments.map((dept) => ({
    ...dept,
    employees:
      dept.employees?.map((emp) =>
        sanitizeEmployeeResultToDepartmentEmployee(dept.typeCode, emp)
      ) || [],
  }));

  return { departments, featuredDepartments };
};

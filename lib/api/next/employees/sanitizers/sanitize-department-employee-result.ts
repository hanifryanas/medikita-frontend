import { EmployeeRole } from '@/lib/types/employees';
import { DepartmentEmployee } from '@/lib/types/employees/department-employee';
import type { EmployeeResult } from '../types';

export const sanitizeDepartmentEmployeeResult = (
  departmentTypeCode: string,
  employee: EmployeeResult
): DepartmentEmployee => ({
  employeeId: employee.employeeId,
  fullName: employee.fullName,
  role: employee.doctor
    ? EmployeeRole.Doctor
    : employee.nurse
      ? EmployeeRole.Nurse
      : EmployeeRole.Staff,
  photoUrl: employee.photoUrl,
  jobTitle: employee.jobTitle,
  employmentDuration: employee.employmentDuration,
  departmentTypeCode,
});

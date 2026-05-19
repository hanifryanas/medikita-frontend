import type { EmployeeResult } from '@/lib/api/next/employees/types';
import { DepartmentEmployee, EmployeeRole } from '@/lib/types/employees';

export const sanitizeEmployeeResultToDepartmentEmployee = (
  departmentTypeCode: string,
  employee: EmployeeResult
): DepartmentEmployee => ({
  employeeId: employee.employeeId,
  fullName: employee.fullName,
  displayName: employee.displayName,
  role: employee.doctor
    ? EmployeeRole.Doctor
    : employee.nurse
      ? EmployeeRole.Nurse
      : EmployeeRole.Staff,
  photoUrl: employee.photoUrl,
  jobTitle: employee.doctor?.jobTitle || employee.jobTitle,
  employmentDuration: employee.employmentDuration,
  departmentTypeCode,
});

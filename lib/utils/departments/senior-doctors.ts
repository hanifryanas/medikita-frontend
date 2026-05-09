import type { Department } from '@/lib/types/departments';
import type { Employee } from '@/lib/types/employees';

/**
 * Returns the most senior doctor-employees within a department, sorted by
 * earliest `startDate` (oldest tenure first). Non-doctor employees and
 * employees missing a `startDate` are skipped.
 */
export const getSeniorDoctorEmployees = (department: Department, limit = 3): Employee[] => {
  const employees = department.employees ?? [];
  return employees
    .filter((e) => Boolean(e.doctor) && Boolean(e.startDate))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, limit);
};

import { DepartmentEmployee } from '../employees/department-employee';
import { DepartmentContent } from './department-content';

export interface Department {
  departmentId: number;
  typeCode: string;
  displayName: string;
  iconName?: string;
  description?: string;
  content?: DepartmentContent;
  isClinical: boolean;
  isClinic: boolean;
  employees?: DepartmentEmployee[];
}

import type { Employee } from '../employees';
import { DepartmentContent } from './department-content';

export interface Department {
  departmentId: number;
  typeCode: string;
  displayName: string;
  iconName?: string;
  description?: string;
  content?: DepartmentContent;
  featuredOrdinal?: number;
  isClinical: boolean;
  isClinic: boolean;
  isActive: boolean;
  employees?: Employee[];
}

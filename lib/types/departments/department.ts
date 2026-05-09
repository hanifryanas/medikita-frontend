import type { Employee } from '../employees';

export interface Department {
  departmentId: number;
  typeCode: string;
  displayName: string;
  description?: string;
  featuredOrdinal?: number;
  isClinical: boolean;
  isClinic: boolean;
  isActive: boolean;
  employees?: Employee[];
}

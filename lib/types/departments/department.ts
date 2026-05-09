import type { Employee } from '../employees';

export interface Department {
  departmentId: number;
  typeCode: string;
  displayName: string;
  /** Lucide icon name in kebab-case, e.g. 'heart-pulse', 'baby'. */
  iconName?: string;
  description?: string;
  featuredOrdinal?: number;
  isClinical: boolean;
  isClinic: boolean;
  isActive: boolean;
  employees?: Employee[];
}

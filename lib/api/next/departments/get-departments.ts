import { nextFetch } from '@/lib/api/next/fetch';
import { Department } from '@/lib/types/departments';
import { FeaturedDepartment } from '@/lib/types/departments/featured-department';
import { sanitizeGroupedDepartmentResult } from '@/lib/utils/sanitizers';
import type { GroupedDepartmentResult } from './types';

export const getDepartments = async (): Promise<{
  departments: Department[];
  featuredDepartments: FeaturedDepartment[];
}> => {
  const groupedDepartmentResult = await nextFetch<GroupedDepartmentResult>('/api/departments', {
    method: 'GET',
    isPublic: true,
    errorMessage: 'Failed to fetch departments.',
  });

  return sanitizeGroupedDepartmentResult(groupedDepartmentResult) as {
    departments: Department[];
    featuredDepartments: FeaturedDepartment[];
  };
};

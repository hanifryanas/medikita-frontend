import { Department } from '@/lib/types/departments';
import { FeaturedDepartment } from '@/lib/types/departments/featured-department';
import { sanitizeGroupedDepartmentResult } from '@/lib/utils/sanitizers';

export const getDepartments = async (): Promise<{
  departments: Department[];
  featuredDepartments: FeaturedDepartment[];
}> => {
  const res = await fetch('/api/departments', { method: 'GET' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch departments.' }));
    throw new Error(err?.message ?? 'Failed to fetch departments.');
  }

  return sanitizeGroupedDepartmentResult(await res.json()) as {
    departments: Department[];
    featuredDepartments: FeaturedDepartment[];
  };
};

import { DepartmentResult } from './types';

export const getDepartments = async (): Promise<DepartmentResult> => {
  const res = await fetch('/api/departments', { method: 'GET' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch departments.' }));
    throw new Error(err?.message ?? 'Failed to fetch departments.');
  }

  return (await res.json()) as DepartmentResult;
};

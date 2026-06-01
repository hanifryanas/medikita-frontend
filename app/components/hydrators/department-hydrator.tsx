'use client';

import { stores } from '@/lib/stores';
import { useEffect } from 'react';

export const DepartmentHydrator = () => {
  useEffect(() => {
    const { isLoaded, isLoading, fetchDepartments } = stores.department;
    if (!isLoaded && !isLoading) void fetchDepartments();
  }, []);

  return null;
};

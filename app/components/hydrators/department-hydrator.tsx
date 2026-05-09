'use client';

import { nextApi } from '@/lib/api';
import { useDepartmentStore } from '@/lib/stores';
import { useEffect } from 'react';

export const DepartmentHydrator = () => {
  useEffect(() => {
    (async () => {
      const { isLoaded, isLoading, setDepartments, setFeaturedDepartments, setIsLoading, reset } =
        useDepartmentStore.getState();
      if (isLoaded || isLoading) return;

      setIsLoading(true);
      try {
        const { departments, featuredDepartments } = await nextApi.departments.getDepartments();
        setDepartments(departments);
        setFeaturedDepartments(featuredDepartments);
      } catch {
        reset();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return null;
};

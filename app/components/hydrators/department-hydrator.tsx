'use client';

import { nextApi } from '@/lib/api';
import { useDepartmentStore } from '@/lib/stores';
import { useEffect } from 'react';

export const DepartmentHydrator = () => {
  useEffect(() => {
    (async () => {
      const { isLoaded, isLoading, setDepartments, setFeaturedDepartments, setLoading, reset } =
        useDepartmentStore.getState();
      if (isLoaded || isLoading) return;

      setLoading(true);
      try {
        const { departments, featuredDepartments } = await nextApi.departments.getDepartments();
        setDepartments(departments);
        setFeaturedDepartments(featuredDepartments);
      } catch {
        reset();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return null;
};

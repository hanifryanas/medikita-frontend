'use client';

import { useDepartmentStore } from '@/lib/stores';
import type { Department } from '@/lib/types/departments';
import { useEffect } from 'react';

// TODO: replace with real API call when backend endpoint is available.
const MOCK_DEPARTMENTS: Department[] = [
  {
    departmentId: 1,
    typeCode: 'cardiology',
    displayName: 'Heart Center',
    featuredOrdinal: 1,
    isClinical: true,
    isClinic: true,
    isActive: true,
  },
  {
    departmentId: 2,
    typeCode: 'pediatrics',
    displayName: 'Children Care',
    featuredOrdinal: 2,
    isClinical: true,
    isClinic: true,
    isActive: true,
  },
  {
    departmentId: 3,
    typeCode: 'dermatology',
    displayName: 'Skin & Aesthetics',
    featuredOrdinal: 3,
    isClinical: true,
    isClinic: true,
    isActive: true,
  },
  {
    departmentId: 4,
    typeCode: 'er',
    displayName: 'ER',
    isClinical: true,
    isClinic: false,
    isActive: true,
  },
  {
    departmentId: 5,
    typeCode: 'neuroscience',
    displayName: 'Neuroscience',
    isClinical: true,
    isClinic: true,
    isActive: true,
  },
  {
    departmentId: 6,
    typeCode: 'operatingtheatre',
    displayName: 'Operating Theatre',
    isClinical: true,
    isClinic: false,
    isActive: true,
  },
];

export const DepartmentHydrator = () => {
  useEffect(() => {
    (async () => {
      const { loaded, loading, setDepartments, setLoading, setError } =
        useDepartmentStore.getState();
      if (loaded || loading) return;

      setLoading(true);
      try {
        // Simulate async fetch — swap for real API call later.
        const data = await Promise.resolve(MOCK_DEPARTMENTS);
        setDepartments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load departments');
      }
    })();
  }, []);

  return null;
};

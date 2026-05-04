'use client';

import { type Department, useDepartmentStore } from '@/lib/stores';
import { useEffect } from 'react';

// TODO: replace with real API call when backend endpoint is available.
const MOCK_DEPARTMENTS: Department[] = [
  { id: '1', name: 'Heart Center' },
  { id: '2', name: 'Children Care' },
  { id: '3', name: 'Skin & Aesthetics' },
  { id: '4', name: 'ER' },
  { id: '5', name: 'Neuroscience' },
  { id: '6', name: 'Operating Theatre' },
];

export const DepartmentHydrator = () => {
  useEffect(() => {
    (async () => {
      const { loaded, loading, setItems, setLoading, setError } = useDepartmentStore.getState();
      if (loaded || loading) return;

      setLoading(true);
      try {
        // Simulate async fetch — swap for real API call later.
        const data = await Promise.resolve(MOCK_DEPARTMENTS);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load departments');
      }
    })();
  }, []);

  return null;
};

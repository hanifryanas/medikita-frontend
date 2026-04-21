'use client';

import { nextApi } from '@/lib/api/next';
import { useEffect } from 'react';

export const AuthHydrator = () => {
  useEffect(() => {
    nextApi.auth.hydrate();
  }, []);

  return null;
};

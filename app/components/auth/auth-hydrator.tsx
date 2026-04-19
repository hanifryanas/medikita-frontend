'use client';

import { useEffect } from 'react';
import { nextApi } from '@/lib/api/next';

export const AuthHydrator = () => {
  useEffect(() => {
    nextApi.auth.hydrate();
  }, []);

  return null;
};

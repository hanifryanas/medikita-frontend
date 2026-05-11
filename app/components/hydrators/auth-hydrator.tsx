'use client';

import { nextApi } from '@/lib/api/next';
import { stores } from '@/lib/stores';
import { AuthStatus } from '@/lib/types/auth';
import { useEffect } from 'react';

export const AuthHydrator = () => {
  useEffect(() => {
    (async () => {
      const { status, signin, reset } = stores.auth;
      if (status === AuthStatus.Authenticated) return;

      try {
        const data = await nextApi.auth.hydrate();
        if (data) signin(data.user, data.accessToken);
        else reset();
      } catch {
        reset();
      }
    })();
  }, []);

  return null;
};

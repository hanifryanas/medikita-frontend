'use client';

import { nextApi } from '@/lib/api/next';
import { AuthStatus, useAuthStore } from '@/lib/stores';
import { useEffect } from 'react';

export const AuthHydrator = () => {
  useEffect(() => {
    (async () => {
      const { status, signin, reset } = useAuthStore.getState();
      if (status === AuthStatus.Authenticated) return;

      const data = await nextApi.auth.hydrate();
      if (data) signin(data.user, data.accessToken);
      else reset();
    })();
  }, []);

  return null;
};

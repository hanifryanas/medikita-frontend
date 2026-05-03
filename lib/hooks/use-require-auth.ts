'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthStatus, useAuthStore } from '../stores';

export const useRequireAuth = (redirectPath = '/signin') => {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status !== AuthStatus.Unauthenticated) return;

    const next = typeof window !== 'undefined' ? window.location.pathname : '';
    const target = next ? `${redirectPath}?next=${encodeURIComponent(next)}` : redirectPath;
    router.replace(target);
  }, [status, router, redirectPath]);

  return status;
};

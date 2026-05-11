'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useStores } from '../stores';
import { AuthStatus } from '../types/auth';

export const useRequireAuth = (redirectPath = '/signin') => {
  const router = useRouter();
  const {
    authStore: { status },
  } = useStores();

  useEffect(() => {
    if (status !== AuthStatus.Unauthenticated) return;

    const next = typeof window !== 'undefined' ? window.location.pathname : '';
    const target = next ? `${redirectPath}?next=${encodeURIComponent(next)}` : redirectPath;
    router.replace(target);
  }, [status, router, redirectPath]);

  return status;
};

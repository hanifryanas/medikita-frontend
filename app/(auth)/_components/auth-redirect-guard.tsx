'use client';

import { useStores } from '@/lib/stores';
import { AuthStatus } from '@/lib/types/auth';
import { isSafeRedirectPath } from '@/lib/utils/checkers';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

interface AuthRedirectGuardProps {
  children: ReactNode;
}

export const AuthRedirectGuard = ({ children }: AuthRedirectGuardProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    authStore: { status },
  } = useStores();

  useEffect(() => {
    if (status !== AuthStatus.Authenticated) return;
    const nextParam = searchParams.get('next');
    const safeNext = isSafeRedirectPath(nextParam) ? nextParam : null;
    router.replace(safeNext ?? '/');
  }, [status, searchParams, router]);

  return <>{children}</>;
};

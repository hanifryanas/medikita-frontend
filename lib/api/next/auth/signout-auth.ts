import { nextFetch } from '@/lib/api/next/fetch';

export const signoutAuth = (): Promise<void> =>
  nextFetch<void>('/api/auth/signout', {
    method: 'POST',
    isPublic: true,
    errorMessage: 'Sign out failed.',
  });

import { nextFetch } from '@/lib/api/next/fetch';
import { SignupPayload } from '@/lib/types/auth/signup-payload';

export const signupAuth = (payload: SignupPayload): Promise<void> =>
  nextFetch<void>('/api/auth/signup', {
    method: 'POST',
    body: payload,
    isPublic: true,
    errorMessage: 'Sign up failed.',
  });

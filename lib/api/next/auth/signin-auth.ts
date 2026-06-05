import { nextFetch } from '@/lib/api/next/fetch';
import { SigninPayload } from '@/lib/types/auth/signin-payload';
import { SigninResult } from './types';

export const signinAuth = (payload: SigninPayload): Promise<SigninResult> =>
  nextFetch<SigninResult>('/api/auth/signin', {
    method: 'POST',
    body: payload,
    isPublic: true,
    errorMessage: 'Sign in failed.',
  });

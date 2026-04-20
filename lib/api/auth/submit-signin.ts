import { SigninPayload } from '@/lib/types/auth/signin-payload';
import { User } from '@/lib/types/users';

export interface SigninResult {
  accessToken: string;
  user: User;
}

export const submitSignin = async (payload: SigninPayload): Promise<SigninResult> => {
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Sign in failed.' }));
    throw new Error(err?.message ?? 'Sign in failed.');
  }

  return res.json() as Promise<SigninResult>;
};

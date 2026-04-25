import { SigninPayload } from '@/lib/types/auth/signin-payload';
import { User } from '@/lib/types/users';

export interface SigninResult {
  accessToken: string;
  user: User;
}

export const signinAuth = async (payload: SigninPayload): Promise<SigninResult> => {
  let res: Response;

  try {
    res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw err;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Sign in failed.' }));
    throw new Error(err?.message ?? 'Sign in failed.');
  }

  return (await res.json()) as SigninResult;
};

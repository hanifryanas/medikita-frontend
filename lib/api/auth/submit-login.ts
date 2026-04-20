import { LoginPayload } from '@/lib/types/auth/login-payload';
import { User } from '@/lib/types/users';

export interface LoginResult {
  accessToken: string;
  user: User;
}

export const submitLogin = async (payload: LoginPayload): Promise<LoginResult> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Login failed.' }));
    throw new Error(err?.message ?? 'Login failed.');
  }

  return res.json() as Promise<LoginResult>;
};

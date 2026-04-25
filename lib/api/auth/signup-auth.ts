import { SignupPayload } from '@/lib/types/auth/signup-payload';

export const signupAuth = async (payload: SignupPayload): Promise<void> => {
  let res: Response;

  try {
    res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw err;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Sign up failed.' }));
    throw new Error(err?.message ?? 'Sign up failed.');
  }
};

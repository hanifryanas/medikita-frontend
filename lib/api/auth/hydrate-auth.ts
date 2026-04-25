import { SigninResult } from './signin-auth';

export type HydrateResult = SigninResult;

export const hydrateAuth = async (): Promise<HydrateResult | null> => {
  let res: Response;

  try {
    res = await fetch('/api/auth/refresh', { method: 'POST' });
  } catch (err) {
    throw err;
  }

  if (!res.ok) return null;

  return (await res.json()) as HydrateResult;
};

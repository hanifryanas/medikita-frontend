import { HydrateResult } from './types';

export const hydrateAuth = async (): Promise<HydrateResult | null> => {
  const res = await fetch('/api/auth/refresh', { method: 'POST' });

  if (!res.ok) return null;

  return (await res.json()) as HydrateResult;
};

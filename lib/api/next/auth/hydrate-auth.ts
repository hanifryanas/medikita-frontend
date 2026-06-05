import { HydrateResult } from './types';

// Refresh runs before sign-in is known, so we keep a raw fetch here and
// swallow non-2xx by returning null (the auth hydrator treats that as
// “not signed in”). Using nextFetch would throw instead.
export const hydrateAuth = async (): Promise<HydrateResult | null> => {
  const res = await fetch('/api/auth/refresh', { method: 'POST' });
  if (!res.ok) return null;
  return (await res.json()) as HydrateResult;
};

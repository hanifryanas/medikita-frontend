import { NurseResult } from './types/nurse-result';

export const getNurses = async (): Promise<NurseResult[]> => {
  const res = await fetch('/api/nurses', { method: 'GET' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch nurses.' }));
    throw new Error(err?.message ?? 'Failed to fetch nurses.');
  }

  return (await res.json()).nurses as NurseResult[];
};

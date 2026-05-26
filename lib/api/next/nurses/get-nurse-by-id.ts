import { NurseResult } from './types/nurse-result';

export const getNurseById = async (id: string): Promise<NurseResult> => {
  const res = await fetch(`/api/nurses/${id}`, { method: 'GET' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch nurse.' }));
    throw new Error(err?.message ?? 'Failed to fetch nurse.');
  }

  return (await res.json()).nurse as NurseResult;
};

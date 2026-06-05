import { nextFetch } from '@/lib/api/next/fetch';
import { NurseResult } from './types/nurse-result';

export const getNurseById = async (id: string): Promise<NurseResult> => {
  const { nurse } = await nextFetch<{ nurse: NurseResult }>(`/api/nurses/${id}`, {
    method: 'GET',
    isPublic: true,
    errorMessage: 'Failed to fetch nurse.',
  });
  return nurse;
};

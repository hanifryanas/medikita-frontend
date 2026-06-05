import { nextFetch } from '@/lib/api/next/fetch';
import { NurseResult } from './types/nurse-result';

export const getNurses = async (): Promise<NurseResult[]> => {
  const { nurses } = await nextFetch<{ nurses: NurseResult[] }>('/api/nurses', {
    method: 'GET',
    isPublic: true,
    errorMessage: 'Failed to fetch nurses.',
  });
  return nurses;
};

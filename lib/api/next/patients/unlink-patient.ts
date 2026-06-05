import { nextFetch } from '@/lib/api/next/fetch';

export const unlinkPatient = (patientId: string): Promise<void> =>
  nextFetch<void>(`/api/patients/me/link/${patientId}`, {
    method: 'DELETE',
    errorMessage: 'Failed to remove patient.',
  });

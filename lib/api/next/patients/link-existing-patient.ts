import { nextFetch } from '@/lib/api/next/fetch';

export const linkExistingPatient = async (patientId: string): Promise<string> => {
  const res = await nextFetch<{ patientId: string }>('/api/patients/me/link', {
    method: 'POST',
    body: { patientId },
    errorMessage: 'Failed to link patient.',
  });
  return res.patientId;
};

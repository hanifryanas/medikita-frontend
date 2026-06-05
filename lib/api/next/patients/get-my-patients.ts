import { nextFetch } from '@/lib/api/next/fetch';
import type { Patient } from '@/lib/types/patients';

export const getMyPatients = async (): Promise<Patient[]> => {
  const { patients } = await nextFetch<{ patients: Patient[] }>('/api/patients/me', {
    method: 'GET',
    errorMessage: 'Failed to fetch patients.',
  });
  return patients;
};

import { nextFetch } from '@/lib/api/next/fetch';
import type { CreatePatientPayload } from '@/lib/types/patients';

export const createPatient = async (payload: CreatePatientPayload): Promise<string> => {
  const { patientId } = await nextFetch<{ patientId: string }>('/api/patients/me', {
    method: 'POST',
    body: payload,
    errorMessage: 'Failed to create patient.',
  });
  return patientId;
};

import { nextFetch } from '@/lib/api/next/fetch';
import type { CreatePatientPayload } from '@/lib/types/patients';

interface UpdatePatientArgs {
  patientId: string;
  payload: Partial<CreatePatientPayload>;
}

export const updatePatient = ({ patientId, payload }: UpdatePatientArgs): Promise<void> =>
  nextFetch<void>(`/api/patients/${patientId}`, {
    method: 'PATCH',
    body: payload,
    errorMessage: 'Failed to update patient.',
  });

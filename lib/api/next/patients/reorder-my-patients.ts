import { nextFetch } from '@/lib/api/next/fetch';

export const reorderMyPatients = (patientIds: string[]): Promise<void> =>
  nextFetch<void>('/api/patients/me/order', {
    method: 'PATCH',
    body: {
      items: patientIds.map((patientId, index) => ({ patientId, ordinal: index + 1 })),
    },
    errorMessage: 'Failed to update patient order.',
  });

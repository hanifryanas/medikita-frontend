import type { CreatePatientPayload } from '@/lib/types/patients';

interface UpdatePatientArgs {
  accessToken: string;
  patientId: string;
  payload: Partial<CreatePatientPayload>;
}

export const updatePatient = async ({
  accessToken,
  patientId,
  payload,
}: UpdatePatientArgs): Promise<void> => {
  const res = await fetch(`/api/patients/${patientId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to update patient.' }));
    throw new Error(err?.message ?? 'Failed to update patient.');
  }
};

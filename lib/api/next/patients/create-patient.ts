import type { CreatePatientPayload, Patient } from '@/lib/types/patients';

interface CreatePatientArgs {
  payload: CreatePatientPayload;
  accessToken: string;
}

export const createPatient = async ({
  payload,
  accessToken,
}: CreatePatientArgs): Promise<Patient> => {
  const res = await fetch('/api/patients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to create patient.' }));
    throw new Error(err?.message ?? 'Failed to create patient.');
  }

  return (await res.json()).patient as Patient;
};

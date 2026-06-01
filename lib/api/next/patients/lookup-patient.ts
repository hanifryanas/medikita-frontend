import type { Patient } from '@/lib/types/patients';

export type PatientLookupType = 'mrn' | 'identityNumber';

interface LookupPatientArgs {
  accessToken: string;
  type: PatientLookupType;
  value: string;
  dateOfBirth: string;
}

export const lookupPatient = async ({
  accessToken,
  type,
  value,
  dateOfBirth,
}: LookupPatientArgs): Promise<Patient> => {
  const res = await fetch('/api/patients/lookup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ type, value, dateOfBirth }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Patient not found.' }));
    throw new Error(err?.message ?? 'Patient not found.');
  }

  return (await res.json()) as Patient;
};

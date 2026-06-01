import type { PatientInsurance, PatientInsurancePayload } from '@/lib/types/patients';

interface CreatePatientInsuranceArgs {
  accessToken: string;
  patientId: string;
  payload: PatientInsurancePayload;
}

export const createPatientInsurance = async ({
  accessToken,
  patientId,
  payload,
}: CreatePatientInsuranceArgs): Promise<PatientInsurance> => {
  const res = await fetch(`/api/patients/${patientId}/insurances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to add insurance.' }));
    throw new Error(err?.message ?? 'Failed to add insurance.');
  }

  return (await res.json()) as PatientInsurance;
};

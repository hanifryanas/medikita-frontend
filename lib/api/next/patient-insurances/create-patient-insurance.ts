import { nextFetch } from '@/lib/api/next/fetch';
import type { PatientInsurance, PatientInsurancePayload } from '@/lib/types/patients';

interface CreatePatientInsuranceArgs {
  patientId: string;
  payload: PatientInsurancePayload;
}

export const createPatientInsurance = ({
  patientId,
  payload,
}: CreatePatientInsuranceArgs): Promise<PatientInsurance> =>
  nextFetch<PatientInsurance>(`/api/patients/${patientId}/insurances`, {
    method: 'POST',
    body: payload,
    errorMessage: 'Failed to add insurance.',
  });

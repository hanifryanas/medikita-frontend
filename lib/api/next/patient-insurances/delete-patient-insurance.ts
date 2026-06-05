import { nextFetch } from '@/lib/api/next/fetch';

interface DeletePatientInsuranceArgs {
  patientId: string;
  patientInsuranceId: number;
}

export const deletePatientInsurance = ({
  patientId,
  patientInsuranceId,
}: DeletePatientInsuranceArgs): Promise<void> =>
  nextFetch<void>(`/api/patients/${patientId}/insurances/${patientInsuranceId}`, {
    method: 'DELETE',
    errorMessage: 'Failed to remove insurance.',
  });

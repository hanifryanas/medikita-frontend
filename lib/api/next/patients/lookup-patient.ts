import { nextFetch } from '@/lib/api/next/fetch';
import type { Patient } from '@/lib/types/patients';

export type PatientLookupType = 'mrn' | 'identityNumber';

interface LookupPatientArgs {
  type: PatientLookupType;
  value: string;
  dateOfBirth: string;
}

export const lookupPatient = (args: LookupPatientArgs): Promise<Patient> =>
  nextFetch<Patient>('/api/patients/lookup', {
    method: 'POST',
    body: args,
    errorMessage: 'Patient not found.',
  });

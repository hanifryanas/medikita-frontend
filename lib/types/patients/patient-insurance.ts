import { InsuranceProviderType } from './insurance-provider.enum';
import type { Patient } from './patient';

export interface PatientInsurance {
  patientInsuranceId: number;
  patient?: Patient;
  insuranceProvider: InsuranceProviderType;
  policyNumber: string;
}

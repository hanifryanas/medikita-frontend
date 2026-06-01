import { InsuranceProviderType } from './insurance-provider.enum';

export interface PatientInsurancePayload {
  insuranceProvider: InsuranceProviderType;
  policyNumber: string;
}

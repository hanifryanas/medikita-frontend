import type { Appointment } from '../appointment';
import type { UserGenderType, UserPatient, UserRelationship } from '../users';
import type { PatientInsurance } from './patient-insurance';

export interface Patient {
  patientId: string;
  medicalRecordNumber: string;
  identityNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: UserGenderType;
  dateOfBirth: string;
  address?: string;
  age: number;
  userPatients?: UserPatient[];
  insurances?: PatientInsurance[];
  appointments?: Appointment[];
  /** Present when serialized via the 'patient-for-user' group. */
  relationship?: UserRelationship;
  /** Present when serialized via the 'patient-for-user' group. */
  ordinal?: number;
}

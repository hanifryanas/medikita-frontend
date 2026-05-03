import type { UserGenderType } from '../users';

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
}

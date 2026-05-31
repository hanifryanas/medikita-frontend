import type { UserGenderType, UserRelationship } from '../users';

export interface CreatePatientPayload {
  userId: string;
  relationship: UserRelationship;
  identityNumber: string;
  firstName: string;
  lastName: string;
  gender: UserGenderType;
  phoneNumber: string;
  dateOfBirth: string;
  address?: string;
}

export interface CreatePatientFormPayload {
  relationship: UserRelationship;
  identityNumber: string;
  firstName: string;
  lastName: string;
  gender: UserGenderType;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
}

import type { UserGenderType, UserRelationship } from '../users';

export interface CreatePatientPayload {
  relationship: UserRelationship;
  identityNumber: string;
  firstName: string;
  lastName?: string;
  gender: UserGenderType;
  phoneNumber: string;
  dateOfBirth: string;
  address?: string;
}

export type CreatePatientFormPayload = Required<CreatePatientPayload>;

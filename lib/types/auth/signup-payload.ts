import type { UserGenderType } from '../users';

export interface SignupPayload {
  identityNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  gender: UserGenderType;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  password: string;
  photoUrl?: string;
}

export interface SignupFormPayload extends SignupPayload {
  confirmPassword: string;
  terms: boolean;
}

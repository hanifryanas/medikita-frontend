export interface SignupPayload {
  identityNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  password: string;
  photoUrl?: string;
}

export interface SignupFormPayload extends SignupPayload {
  confirmPassword: string;
  terms: boolean;
}

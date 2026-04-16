export interface SignupPayload {
  identityNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
}

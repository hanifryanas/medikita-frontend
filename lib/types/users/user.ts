export interface User {
  userId: string;
  identityNumber: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  address: string;
  age: number;
}

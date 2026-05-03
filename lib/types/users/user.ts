import { Employee } from '../employees';
import { UserGenderType } from './user-gender.enum';
import { UserRole } from './user-role.enum';

export interface User {
  userId: string;
  identityNumber: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: UserGenderType;
  dateOfBirth: string;
  address?: string;
  age: number;
  isEmployee?: boolean;
  role?: UserRole;
  employee?: Employee;
}

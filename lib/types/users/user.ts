import type { Employee } from '../employees';
import { UserGenderType } from './user-gender.enum';
import type { UserPatient } from './user-patient';

export interface User {
  userId: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  gender: UserGenderType;
  dateOfBirth: string;
  age: number;
  photoUrl?: string;
  employee?: Employee;
  userPatients?: UserPatient[];
}

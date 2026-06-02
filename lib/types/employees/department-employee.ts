import { Doctor } from '../doctors';
import { Nurse } from '../nurses';
import { Employee } from './employee';

export type DepartmentEmployee = Omit<Employee, 'user' | 'department' | 'doctor' | 'nurse'> & {
  doctor?: Pick<Doctor, 'doctorId'>;
  nurse?: Pick<Nurse, 'nurseId'>;
};

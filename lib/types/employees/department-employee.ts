import { Employee } from './employee';

export type DepartmentEmployee = Omit<Employee, 'user' | 'department' | 'doctor' | 'nurse'>;

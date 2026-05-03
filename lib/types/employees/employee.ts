import { EmployeePosition } from './employee-position.enum';

export interface Employee {
  employeeId: string;
  position: EmployeePosition;
  department: string;
}

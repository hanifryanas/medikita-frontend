import { User } from './user';
import { UserRole } from './user-role.enum';

export interface AccountUser extends User {
  identityNumber: string;
  phoneNumber: string;
  address?: string;
  isEmployee: boolean;
  role: UserRole;
}

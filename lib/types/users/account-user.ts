import { User } from './user';
import { UserRole } from './user-role.enum';

export interface AccountUser extends User {
  isEmployee: boolean;
  role: UserRole;
}

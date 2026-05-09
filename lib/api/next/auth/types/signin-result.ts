import { AccountUser } from '@/lib/types/users';

export interface SigninResult {
  accessToken: string;
  user: AccountUser;
}

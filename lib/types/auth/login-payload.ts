export interface LoginPayload {
  email?: string;
  username?: string;
  phoneNumber?: string;
  password: string;
  isRemember: boolean;
}

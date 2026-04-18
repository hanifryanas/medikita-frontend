import { apiClient } from '../apis';
import type { AuthResponse, LoginPayload, SignupPayload } from '../types/auth';

export const authService = {
  login: (payload: LoginPayload) => apiClient.post<AuthResponse>('/auth/login', payload),

  signup: (payload: SignupPayload) => apiClient.post<AuthResponse>('/auth/signup', payload),
};

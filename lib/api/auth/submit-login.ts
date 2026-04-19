import { useAuthStore } from '@/lib/stores';
import { LoginPayload } from '@/lib/types/auth/login-payload';
import { User } from '@/lib/types/users';
import { validateLogin } from '@/lib/validations/auth/validate-login';

export const submitLogin = async (
  payload: LoginPayload
): Promise<{ success: true } | { success: false; errors: Record<string, string> }> => {
  const result = validateLogin(payload);

  if (Object.keys(result.errors).length) {
    return { success: false, errors: result.errors };
  }

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Login failed.' }));
    return { success: false, errors: { identifier: err?.message ?? 'Login failed.' } };
  }

  const data: { accessToken: string; user: User } = await res.json();

  useAuthStore.getState().login(data.user, data.accessToken);

  return { success: true };
};

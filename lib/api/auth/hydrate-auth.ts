import { AuthStatus, useAuthStore } from '@/lib/stores';
import { User } from '@/lib/types/users';

export const hydrateAuth = async (): Promise<void> => {
  const { status, login, reset } = useAuthStore.getState();

  if (status === AuthStatus.Authenticated) return;

  try {
    const res = await fetch('/api/auth/refresh', { method: 'POST' });

    if (!res.ok) {
      reset();
      return;
    }

    const data: { accessToken: string; user: User } = await res.json();
    login(data.user, data.accessToken);
  } catch {
    reset();
  }
};

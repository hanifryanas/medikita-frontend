import { useAuthStore } from '@/lib/stores';

export const logoutAuth = async (): Promise<void> => {
  await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
  useAuthStore.getState().logout();
};

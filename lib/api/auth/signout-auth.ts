export const signoutAuth = async (): Promise<void> => {
  await fetch('/api/auth/signout', { method: 'POST' }).catch(() => null);
};

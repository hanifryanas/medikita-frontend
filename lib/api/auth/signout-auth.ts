export const signoutAuth = async (): Promise<void> => {
  const res = await fetch('/api/auth/signout', { method: 'POST' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Sign out failed.' }));
    throw new Error(err?.message ?? 'Sign out failed.');
  }
};

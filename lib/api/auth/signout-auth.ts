export const signoutAuth = async (): Promise<void> => {
  try {
    await fetch('/api/auth/signout', { method: 'POST' });
  } catch (err) {
    throw err;
  }
};

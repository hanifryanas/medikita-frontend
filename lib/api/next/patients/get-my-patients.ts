import type { Patient } from '@/lib/types/patients';

export const getMyPatients = async (accessToken: string): Promise<Patient[]> => {
  const res = await fetch('/api/patients/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch patients.' }));
    throw new Error(err?.message ?? 'Failed to fetch patients.');
  }

  return (await res.json()).patients as Patient[];
};

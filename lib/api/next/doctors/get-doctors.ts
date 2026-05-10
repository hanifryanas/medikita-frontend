import { Doctor } from '@/lib/types/doctors';

export const getDoctors = async (): Promise<Doctor[]> => {
  const res = await fetch('/api/doctors', { method: 'GET' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch doctors.' }));
    throw new Error(err?.message ?? 'Failed to fetch doctors.');
  }

  return (await res.json()).doctors as Doctor[];
};

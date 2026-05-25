import { DoctorResult } from './types/doctor-result';

export const getDoctors = async (): Promise<DoctorResult[]> => {
  const res = await fetch('/api/doctors', { method: 'GET' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch doctors.' }));
    throw new Error(err?.message ?? 'Failed to fetch doctors.');
  }

  return (await res.json()).doctors as DoctorResult[];
};

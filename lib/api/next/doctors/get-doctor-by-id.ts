import { DoctorResult } from './types/doctor-result';

export const getDoctorById = async (id: string): Promise<DoctorResult> => {
  const res = await fetch(`/api/doctors/${id}`, { method: 'GET' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch doctor.' }));
    throw new Error(err?.message ?? 'Failed to fetch doctor.');
  }

  return (await res.json()).doctor as DoctorResult;
};

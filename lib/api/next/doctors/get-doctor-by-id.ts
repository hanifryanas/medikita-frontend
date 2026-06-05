import { nextFetch } from '@/lib/api/next/fetch';
import { DoctorResult } from './types/doctor-result';

export const getDoctorById = async (id: string): Promise<DoctorResult> => {
  const { doctor } = await nextFetch<{ doctor: DoctorResult }>(`/api/doctors/${id}`, {
    method: 'GET',
    isPublic: true,
    errorMessage: 'Failed to fetch doctor.',
  });
  return doctor;
};

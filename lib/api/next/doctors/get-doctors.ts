import { nextFetch } from '@/lib/api/next/fetch';
import { DoctorResult } from './types/doctor-result';

export const getDoctors = async (): Promise<DoctorResult[]> => {
  const { doctors } = await nextFetch<{ doctors: DoctorResult[] }>('/api/doctors', {
    method: 'GET',
    isPublic: true,
    errorMessage: 'Failed to fetch doctors.',
  });
  return doctors;
};

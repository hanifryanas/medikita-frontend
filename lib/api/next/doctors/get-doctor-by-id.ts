import { nextFetch } from '@/lib/api/next/fetch';
import { DetailDoctorResult } from './types/detail-doctor-result';

export const getDoctorById = async (id: string): Promise<DetailDoctorResult> => {
  const { doctor } = await nextFetch<{ doctor: DetailDoctorResult }>(`/api/doctors/${id}`, {
    method: 'GET',
    isPublic: true,
    errorMessage: 'Failed to fetch doctor.',
  });
  return doctor;
};

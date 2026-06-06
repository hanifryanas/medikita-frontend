import { nextFetch } from '@/lib/api/next/fetch';
import type { Appointment } from '@/lib/types/appointment';

export const getMyAppointments = async (): Promise<Appointment[]> => {
  const { appointments } = await nextFetch<{ appointments: Appointment[] }>(
    '/api/appointments/me',
    {
      method: 'GET',
      errorMessage: 'Failed to fetch appointments.',
    }
  );
  return appointments;
};

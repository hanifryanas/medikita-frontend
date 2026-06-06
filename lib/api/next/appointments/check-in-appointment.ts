import { nextFetch } from '@/lib/api/next/fetch';
import type { Appointment } from '@/lib/types/appointment';

export const checkInAppointment = async (appointmentId: string): Promise<Appointment> => {
  const { appointment } = await nextFetch<{ appointment: Appointment }>(
    `/api/appointments/${appointmentId}/check-in`,
    {
      method: 'PATCH',
      errorMessage: 'Failed to check in.',
    }
  );
  return appointment;
};

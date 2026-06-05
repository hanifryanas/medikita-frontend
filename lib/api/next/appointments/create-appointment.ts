import { nextFetch } from '@/lib/api/next/fetch';
import type { CreateAppointmentPayload } from '@/lib/types/appointment';

export const createAppointment = async (payload: CreateAppointmentPayload): Promise<string> => {
  const { appointmentId } = await nextFetch<{ appointmentId: string }>('/api/appointments', {
    method: 'POST',
    body: payload,
    errorMessage: 'Failed to book appointment.',
  });

  return appointmentId;
};

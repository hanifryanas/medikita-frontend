import { nextFetch } from '@/lib/api/next/fetch';
import type { Appointment } from '@/lib/types/appointment';

export const getPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  const { appointments } = await nextFetch<{ appointments: Appointment[] }>(
    `/api/appointments/patients/${patientId}`,
    {
      method: 'GET',
      errorMessage: 'Failed to fetch patient appointments.',
    }
  );
  return appointments;
};

'use client';

import { useCareTeamsStore } from '@/lib/stores/care-teams-store';
import type { Appointment } from '@/lib/types/appointment';
import { formatFullName, formatTimeSlot } from '@/lib/utils/formatters';
import { useRouter } from 'next/navigation';
import { DateBlock } from './date-block';
import { SummaryRow } from './summary-row';

interface AppointmentRowProps {
  appointment: Appointment;
}

export const AppointmentRow = ({ appointment }: AppointmentRowProps) => {
  const router = useRouter();
  const careTeam = useCareTeamsStore((s) => s.careTeamMap.get(appointment.doctor.doctorId));
  const start = new Date(`${appointment.date}T${appointment.timeSlot}`);
  const doctorName = careTeam?.displayName ?? appointment.doctor.displayName ?? 'Doctor';
  const patientName = formatFullName(appointment.patient);

  return (
    <SummaryRow
      leading={<DateBlock date={start} />}
      title={doctorName}
      metaItems={[formatTimeSlot(appointment.timeSlot), patientName]}
      badge={{ label: 'Upcoming', tone: 'accent' }}
      onClick={() => router.push(`/appointments/${appointment.appointmentId}`)}
    />
  );
};

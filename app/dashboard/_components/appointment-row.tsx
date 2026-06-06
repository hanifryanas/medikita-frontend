'use client';

import { useCareTeamsStore } from '@/lib/stores/care-teams-store';
import type { Appointment } from '@/lib/types/appointment';
import { DateBlock } from './date-block';
import { SummaryRow } from './summary-row';

const formatTimeSlot = (timeSlot: string) => timeSlot.slice(0, 5);

interface AppointmentRowProps {
  appointment: Appointment;
}

export const AppointmentRow = ({ appointment }: AppointmentRowProps) => {
  const careTeam = useCareTeamsStore((s) => s.careTeamMap.get(appointment.doctor.doctorId));
  const start = new Date(`${appointment.date}T${appointment.timeSlot}`);
  const doctorName = careTeam?.displayName ?? appointment.doctor.displayName ?? 'Doctor';
  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim();

  return (
    <SummaryRow
      leading={<DateBlock date={start} />}
      title={doctorName}
      metaItems={[formatTimeSlot(appointment.timeSlot), patientName]}
      badge={{ label: 'Upcoming', tone: 'accent' }}
    />
  );
};

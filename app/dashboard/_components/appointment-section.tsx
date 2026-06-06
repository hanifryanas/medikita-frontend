'use client';

import { useAppointments } from '@/lib/stores/appointment-store';
import { Status } from '@/lib/types/common';
import { isBefore } from 'date-fns';
import { useMemo } from 'react';
import { AppointmentRow } from './appointment-row';
import { DashboardSection } from './dashboard-section';

const MAX_ROWS = 3;

export const AppointmentSection = () => {
  const appointments = useAppointments();

  const upcoming = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(
        (a) =>
          a.status === Status.Incompleted && !isBefore(new Date(`${a.date}T${a.timeSlot}`), now)
      )
      .sort((a, b) => a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot))
      .slice(0, MAX_ROWS);
  }, [appointments]);

  return (
    <DashboardSection
      title='Upcoming appointments'
      actionLabel='View all'
      actionHref='/appointments'
    >
      {upcoming.length === 0 ? (
        <p style={{ margin: 0, padding: '0.5rem 0', color: 'var(--text-muted)' }}>
          You have no upcoming appointments.
        </p>
      ) : (
        upcoming.map((a) => <AppointmentRow key={a.appointmentId} appointment={a} />)
      )}
    </DashboardSection>
  );
};

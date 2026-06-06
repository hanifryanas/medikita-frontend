'use client';

import { useCareTeamsStore } from '@/lib/stores/care-teams-store';
import type { Appointment } from '@/lib/types/appointment';
import { Status } from '@/lib/types/common';
import { formatDate } from '@/lib/utils/formatters';
import { useRouter } from 'next/navigation';
import styles from './appointment-card.module.scss';

const STATUS_LABEL: Record<Status, string> = {
  [Status.Incompleted]: 'Upcoming',
  [Status.Completed]: 'Completed',
  [Status.Cancelled]: 'Cancelled',
};

const STATUS_CLASS: Record<Status, string> = {
  [Status.Incompleted]: styles.statusIncompleted,
  [Status.Completed]: styles.statusCompleted,
  [Status.Cancelled]: styles.statusCancelled,
};

const formatTimeSlot = (timeSlot: string) => timeSlot.slice(0, 5);

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const router = useRouter();
  const careTeam = useCareTeamsStore((s) => s.careTeamMap.get(appointment.doctor.doctorId));

  const start = new Date(`${appointment.date}T${appointment.timeSlot}`);
  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim();
  const doctorName = careTeam?.displayName ?? appointment.doctor.displayName ?? 'Doctor';
  const doctorSubtitle = careTeam?.jobTitle;

  const handleOpen = () => router.push(`/appointments/${appointment.appointmentId}`);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <article
      className={`${styles.card} ${styles.cardClickable}`}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
    >
      <div className={styles.dateBlock} aria-label={formatDate(start, 'EEEE, d MMMM yyyy')}>
        <span className={styles.dateWeekday} aria-hidden>
          {formatDate(start, 'EEE')}
        </span>
        <span className={styles.dateDay} aria-hidden>
          {formatDate(start, 'd')}
        </span>
        <span className={styles.dateMonth} aria-hidden>
          {formatDate(start, 'MMM yyyy')}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.bodyHeading}>
          <h3 className={styles.doctorName}>{doctorName}</h3>
          {doctorSubtitle && <span className={styles.doctorSubtitle}>{doctorSubtitle}</span>}
        </div>
        <div className={styles.metaRow}>
          <span>{formatTimeSlot(appointment.timeSlot)}</span>
          <span className={styles.metaSeparator} aria-hidden>
            ·
          </span>
          <span>Patient: {patientName}</span>
          {appointment.room && (
            <>
              <span className={styles.metaSeparator} aria-hidden>
                ·
              </span>
              <span>Room {appointment.room}</span>
            </>
          )}
        </div>
        {appointment.concern && <p className={styles.concern}>{appointment.concern}</p>}
      </div>

      <span className={`${styles.statusPill} ${STATUS_CLASS[appointment.status]}`}>
        {STATUS_LABEL[appointment.status]}
      </span>
    </article>
  );
};

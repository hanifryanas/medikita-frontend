import type { Appointment } from '@/lib/types/appointment';
import { formatDate } from '@/lib/utils/formatters';
import styles from './visit-details-section.module.scss';

const formatTimeSlot = (timeSlot: string) => timeSlot.slice(0, 5);

interface VisitDetailsSectionProps {
  appointment: Appointment;
}

export const VisitDetailsSection = ({ appointment }: VisitDetailsSectionProps) => {
  const start = new Date(`${appointment.date}T${appointment.timeSlot}`);
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Visit details</h2>
      <dl className={styles.detailList}>
        <dt>Date</dt>
        <dd>{formatDate(start, 'EEEE, d MMMM yyyy')}</dd>
        <dt>Time</dt>
        <dd>{formatTimeSlot(appointment.timeSlot)}</dd>
        {appointment.room && (
          <>
            <dt>Room</dt>
            <dd>{appointment.room}</dd>
          </>
        )}
        <dt>Concern</dt>
        <dd>{appointment.concern || '—'}</dd>
        {appointment.diagnosis && (
          <>
            <dt>Diagnosis</dt>
            <dd>{appointment.diagnosis}</dd>
          </>
        )}
        {appointment.notes && (
          <>
            <dt>Notes</dt>
            <dd>
              <p className={styles.note}>{appointment.notes}</p>
            </dd>
          </>
        )}
      </dl>
    </section>
  );
};

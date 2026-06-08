'use client';

import { AppointmentCard } from '@/app/appointments/_components';
import { nextApi } from '@/lib/api/next';
import type { Appointment } from '@/lib/types/appointment';
import { AuthStatus } from '@/lib/types/auth';
import { useEffect, useMemo, useState } from 'react';
import styles from './patient-appointments-section.module.scss';

interface PatientAppointmentsSectionProps {
  patientId: string;
  authStatus: AuthStatus;
}

export const PatientAppointmentsSection = ({
  patientId,
  authStatus,
}: PatientAppointmentsSectionProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId || authStatus !== AuthStatus.Authenticated) return;
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    nextApi.appointments
      .getPatientAppointments(patientId)
      .then((rows) => {
        if (cancelled) return;
        setAppointments(rows);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load appointments.');
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [patientId, authStatus]);

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort((a, b) => {
        const d = b.date.localeCompare(a.date);
        return d !== 0 ? d : b.timeSlot.localeCompare(a.timeSlot);
      }),
    [appointments]
  );

  return (
    <section className={styles.card}>
      <div className={styles.sectionHead}>
        <h2 className={styles.cardTitle}>Appointments</h2>
        {sortedAppointments.length > 0 && (
          <span className={styles.countBadge}>{sortedAppointments.length}</span>
        )}
      </div>

      {loadError ? (
        <div className={styles.errorBox}>{loadError}</div>
      ) : isLoading ? (
        <div className={styles.message}>Loading appointments…</div>
      ) : sortedAppointments.length === 0 ? (
        <div className={styles.message}>No appointments yet for this patient.</div>
      ) : (
        <div className={styles.appointmentList}>
          {sortedAppointments.map((a) => (
            <AppointmentCard key={a.appointmentId} appointment={a} />
          ))}
        </div>
      )}
    </section>
  );
};

'use client';

import { AccountShell } from '@/app/components/layout';
import { useRequireAuth } from '@/lib/hooks';
import { useAppointmentStore, useAppointments } from '@/lib/stores/appointment-store';
import { AuthStatus } from '@/lib/types/auth';
import { AppointmentCard } from './_components';
import styles from './page.module.scss';

export default function AppointmentsPage() {
  const status = useRequireAuth();
  const appointments = useAppointments();
  const isLoading = useAppointmentStore((s) => s.isLoading);
  const isLoaded = useAppointmentStore((s) => s.isLoaded);
  const loadError = useAppointmentStore((s) => s.loadError);

  if (status !== AuthStatus.Authenticated) return null;

  return (
    <AccountShell>
      <header className={styles.header}>
        <h1 className={styles.heading}>Appointments</h1>
        <p className={styles.subtitle}>View and manage appointments.</p>
      </header>

      {loadError ? (
        <div className={styles.error}>{loadError}</div>
      ) : !isLoaded && isLoading ? (
        <div className={styles.loading}>Loading appointments…</div>
      ) : appointments.length === 0 ? (
        <div className={styles.empty}>No appointments yet.</div>
      ) : (
        <div className={styles.list}>
          {appointments.map((a) => (
            <AppointmentCard key={a.appointmentId} appointment={a} />
          ))}
        </div>
      )}
    </AccountShell>
  );
}

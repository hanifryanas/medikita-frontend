'use client';

import { AccountShell } from '@/app/components/layout';
import { useRequireAuth } from '@/lib/hooks';
import { useAppointments } from '@/lib/stores/appointment-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useOtherPatients, useSelfPatient } from '@/lib/stores/patient-store';
import { AuthStatus } from '@/lib/types/auth';
import { Status } from '@/lib/types/common';
import { formatDate } from '@/lib/utils/formatters';
import { isBefore } from 'date-fns';
import { CalendarCheck, CalendarClock, Users } from 'lucide-react';
import { useMemo } from 'react';
import { AppointmentSection, PatientSection, QuickActions, StatTile } from './_components';
import styles from './page.module.scss';

export default function DashboardPage() {
  const status = useRequireAuth();
  const currentUser = useAuthStore((s) => s.currentUser);
  const appointments = useAppointments();
  const selfPatient = useSelfPatient();
  const otherPatients = useOtherPatients();

  const { upcomingCount, completedCount } = useMemo(() => {
    const now = new Date();
    let upcoming = 0;
    let completed = 0;
    for (const a of appointments) {
      if (a.status === Status.Completed) {
        completed += 1;
      } else if (
        a.status === Status.Incompleted &&
        !isBefore(new Date(`${a.date}T${a.timeSlot}`), now)
      ) {
        upcoming += 1;
      }
    }
    return { upcomingCount: upcoming, completedCount: completed };
  }, [appointments]);

  if (status !== AuthStatus.Authenticated) {
    return null;
  }

  const patientCount = (selfPatient ? 1 : 0) + otherPatients.length;
  const firstName = currentUser?.firstName ?? 'there';
  const today = formatDate(new Date(), 'EEEE, d MMMM yyyy');

  return (
    <AccountShell>
      <div className={styles.page}>
        <header className={styles.hero}>
          <h1 className={styles.heading}>Welcome back, {firstName}</h1>
          <p className={styles.subtitle}>{today}</p>
        </header>

        <div className={styles.stats}>
          <StatTile
            label='Upcoming'
            value={upcomingCount}
            hint='Scheduled appointments'
            icon={<CalendarClock size={16} aria-hidden />}
          />
          <StatTile
            label='Completed'
            value={completedCount}
            hint='Past visits'
            icon={<CalendarCheck size={16} aria-hidden />}
          />
          <StatTile
            label='Patients'
            value={patientCount}
            hint={selfPatient ? 'Including you' : 'Linked to your account'}
            icon={<Users size={16} aria-hidden />}
          />
        </div>

        <p className={styles.sectionLabel}>Overview</p>
        <div className={styles.overview}>
          <AppointmentSection />
          <PatientSection />
        </div>

        <p className={styles.sectionLabel}>Quick actions</p>
        <QuickActions />
      </div>
    </AccountShell>
  );
}

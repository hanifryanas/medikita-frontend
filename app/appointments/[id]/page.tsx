'use client';

import { AccountShell } from '@/app/components/layout';
import { useRequireAuth } from '@/lib/hooks';
import { useAppointment, useAppointmentStore } from '@/lib/stores/appointment-store';
import { useCareTeamsStore } from '@/lib/stores/care-teams-store';
import { AuthStatus } from '@/lib/types/auth';
import { Status } from '@/lib/types/common';
import { formatDate, formatTimeSlot, STATUS_LABEL } from '@/lib/utils/formatters';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckInPanel, PeopleSection, VisitDetailsSection } from './_components';
import styles from './page.module.scss';

const STATUS_CLASS: Record<Status, string> = {
  [Status.Incompleted]: styles.statusIncompleted,
  [Status.Completed]: styles.statusCompleted,
  [Status.Cancelled]: styles.statusCancelled,
};

export default function AppointmentDetailPage() {
  const authStatus = useRequireAuth();
  const params = useParams<{ id: string }>();
  const appointmentId = params?.id;
  const appointment = useAppointment(appointmentId);
  const isLoaded = useAppointmentStore((s) => s.isLoaded);
  const isLoading = useAppointmentStore((s) => s.isLoading);
  const careTeam = useCareTeamsStore((s) =>
    appointment ? s.careTeamMap.get(appointment.doctor.doctorId) : undefined
  );

  if (authStatus !== AuthStatus.Authenticated) return null;

  const backLink = (
    <Link href='/appointments' className={styles.backLink}>
      <ChevronLeft size={16} aria-hidden />
      Back to appointments
    </Link>
  );

  if (!isLoaded && isLoading) {
    return (
      <AccountShell>
        <div className={styles.page}>
          {backLink}
          <div className={styles.message}>Loading appointmentâ€¦</div>
        </div>
      </AccountShell>
    );
  }

  if (!appointment) {
    return (
      <AccountShell>
        <div className={styles.page}>
          {backLink}
          <div className={styles.message}>Appointment not found.</div>
        </div>
      </AccountShell>
    );
  }

  const start = new Date(`${appointment.date}T${appointment.timeSlot}`);
  const doctorName = careTeam?.displayName ?? appointment.doctor.displayName ?? 'Doctor';

  return (
    <AccountShell>
      <div className={styles.page}>
        {backLink}

        <header className={styles.header}>
          <div>
            <h1 className={styles.heading}>{formatDate(start, 'EEEE, d MMMM yyyy')}</h1>
            <p className={styles.subtitle}>
              {formatTimeSlot(appointment.timeSlot)} Â· with {doctorName}
            </p>
          </div>
          <span className={`${styles.statusPill} ${STATUS_CLASS[appointment.status]}`}>
            {STATUS_LABEL[appointment.status]}
          </span>
        </header>

        <CheckInPanel appointment={appointment} />

        <div className={styles.grid}>
          <VisitDetailsSection appointment={appointment} />
          <PeopleSection appointment={appointment} doctorCareTeam={careTeam} />
        </div>
      </div>
    </AccountShell>
  );
}

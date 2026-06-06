'use client';

import { Avatar } from '@/app/components/common';
import { AccountShell } from '@/app/components/layout';
import { useRequireAuth } from '@/lib/hooks';
import { useAppointment, useAppointmentStore } from '@/lib/stores/appointment-store';
import { useCareTeamsStore } from '@/lib/stores/care-teams-store';
import { AuthStatus } from '@/lib/types/auth';
import { Status } from '@/lib/types/common';
import { formatDate } from '@/lib/utils/formatters';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckInPanel } from './_components';
import styles from './page.module.scss';

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
          <div className={styles.message}>Loading appointment…</div>
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
  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim();
  const doctorName = careTeam?.displayName ?? appointment.doctor.displayName ?? 'Doctor';
  const doctorSubtitle = careTeam?.jobTitle;

  return (
    <AccountShell>
      <div className={styles.page}>
        {backLink}

        <header className={styles.header}>
          <div>
            <h1 className={styles.heading}>{formatDate(start, 'EEEE, d MMMM yyyy')}</h1>
            <p className={styles.subtitle}>
              {formatTimeSlot(appointment.timeSlot)} · with {doctorName}
            </p>
          </div>
          <span className={`${styles.statusPill} ${STATUS_CLASS[appointment.status]}`}>
            {STATUS_LABEL[appointment.status]}
          </span>
        </header>

        <CheckInPanel appointment={appointment} />

        <div className={styles.grid}>
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

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>People</h2>

            <div className={styles.partyRow}>
              <Avatar
                name={{
                  firstName: appointment.patient.firstName,
                  lastName: appointment.patient.lastName,
                  fallback: '?',
                }}
                size={44}
              />
              <div className={styles.partyInfo}>
                <h3 className={styles.partyName}>{patientName}</h3>
                <span className={styles.partyMeta}>
                  Patient · MRN {appointment.patient.medicalRecordNumber}
                </span>
              </div>
            </div>

            <div className={styles.partyRow}>
              <Avatar
                name={{
                  fullName: doctorName,
                  fallback: 'D',
                }}
                photoUrl={careTeam?.photoUrl}
                size={44}
              />
              <div className={styles.partyInfo}>
                <h3 className={styles.partyName}>{doctorName}</h3>
                <span className={styles.partyMeta}>
                  Doctor{doctorSubtitle ? ` · ${doctorSubtitle}` : ''}
                </span>
              </div>
            </div>

            {appointment.nurses?.map((nurse) => {
              const nurseName = nurse.employee?.fullName ?? 'Nurse';
              return (
                <div key={nurse.nurseId} className={styles.partyRow}>
                  <Avatar
                    name={{ fullName: nurseName, fallback: 'N' }}
                    photoUrl={nurse.employee?.photoUrl}
                    size={44}
                  />
                  <div className={styles.partyInfo}>
                    <h3 className={styles.partyName}>{nurseName}</h3>
                    <span className={styles.partyMeta}>Nurse</span>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </AccountShell>
  );
}

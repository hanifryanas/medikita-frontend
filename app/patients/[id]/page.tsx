'use client';

import { AppointmentCard } from '@/app/appointments/_components';
import { Avatar } from '@/app/components/common';
import { AccountShell } from '@/app/components/layout';
import { nextApi } from '@/lib/api/next';
import { useRequireAuth } from '@/lib/hooks';
import { useStores } from '@/lib/stores';
import { usePatient, usePatientStore } from '@/lib/stores/patient-store';
import type { Appointment } from '@/lib/types/appointment';
import { AuthStatus } from '@/lib/types/auth';
import { UserRelationship } from '@/lib/types/users';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PatientInsuranceSection } from '../_components';
import styles from './page.module.scss';

const RELATIONSHIP_LABELS: Record<UserRelationship, string> = {
  [UserRelationship.Self]: 'Self',
  [UserRelationship.Spouse]: 'Spouse',
  [UserRelationship.Child]: 'Child',
  [UserRelationship.Parent]: 'Parent',
  [UserRelationship.Sibling]: 'Sibling',
  [UserRelationship.Other]: 'Other',
};

export default function PatientDetailPage() {
  const authStatus = useRequireAuth();
  const params = useParams<{ id: string }>();
  const patientId = params?.id;
  const {
    authStore: { accessToken },
  } = useStores();
  const patient = usePatient(patientId);
  const isPatientLoaded = usePatientStore((s) => s.isLoaded);

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

  if (authStatus !== AuthStatus.Authenticated) return null;

  const backLink = (
    <Link href='/patients' className={styles.backLink}>
      <ChevronLeft size={16} aria-hidden />
      Back to patients
    </Link>
  );

  if (!isPatientLoaded) {
    return (
      <AccountShell>
        <div className={styles.page}>
          {backLink}
          <div className={styles.message}>Loading patient…</div>
        </div>
      </AccountShell>
    );
  }

  if (!patient) {
    return (
      <AccountShell>
        <div className={styles.page}>
          {backLink}
          <div className={styles.message}>Patient not found.</div>
        </div>
      </AccountShell>
    );
  }

  const fullName = `${patient.firstName} ${patient.lastName}`.trim();
  const relationship = patient.relationship ?? UserRelationship.Other;
  const isSelf = relationship === UserRelationship.Self;

  const sortedAppointments = [...appointments].sort((a, b) => {
    const d = b.date.localeCompare(a.date);
    return d !== 0 ? d : b.timeSlot.localeCompare(a.timeSlot);
  });

  return (
    <AccountShell>
      <div className={styles.page}>
        {backLink}

        <header className={styles.header}>
          <Avatar
            name={{ firstName: patient.firstName, lastName: patient.lastName, fallback: '?' }}
            size={64}
          />
          <div className={styles.headerText}>
            <div className={styles.headerHeading}>
              <h1 className={styles.heading}>{fullName}</h1>
              <span
                className={`${styles.relationshipBadge} ${isSelf ? styles.relationshipSelf : ''}`}
              >
                {RELATIONSHIP_LABELS[relationship]}
              </span>
            </div>
            <p className={styles.subtitle}>
              <span>MRN {patient.medicalRecordNumber}</span>
              <span aria-hidden>·</span>
              <span>{patient.age} yrs</span>
              <span aria-hidden>·</span>
              <span>{patient.gender === 'male' ? 'Male' : 'Female'}</span>
            </p>
          </div>
        </header>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Profile</h2>
            <dl className={styles.detailList}>
              <dt>Phone</dt>
              <dd>{patient.phoneNumber}</dd>
              <dt>Date of birth</dt>
              <dd>{patient.dateOfBirth}</dd>
              {patient.address && (
                <>
                  <dt>Address</dt>
                  <dd>{patient.address}</dd>
                </>
              )}
              {patient.identityNumber && (
                <>
                  <dt>Identity #</dt>
                  <dd>{patient.identityNumber}</dd>
                </>
              )}
            </dl>
          </section>

          <PatientInsuranceSection patientId={patient.patientId} accessToken={accessToken} />
        </div>

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
      </div>
    </AccountShell>
  );
}

'use client';

import { Avatar } from '@/app/components/common';
import { AccountShell } from '@/app/components/layout';
import { useRequireAuth } from '@/lib/hooks';
import { useStores } from '@/lib/stores';
import { usePatient, usePatientStore } from '@/lib/stores/patient-store';
import { AuthStatus } from '@/lib/types/auth';
import { UserRelationship } from '@/lib/types/users';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PatientInsuranceSection } from '../_components';
import { PatientAppointmentsSection, PatientProfileCard } from './_components';
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
          <div className={styles.message}>Loading patientâ€¦</div>
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
              <span aria-hidden>Â·</span>
              <span>{patient.age} yrs</span>
              <span aria-hidden>Â·</span>
              <span>{patient.gender === 'male' ? 'Male' : 'Female'}</span>
            </p>
          </div>
        </header>

        <div className={styles.grid}>
          <PatientProfileCard patient={patient} />
          <PatientInsuranceSection patientId={patient.patientId} accessToken={accessToken} />
        </div>

        <PatientAppointmentsSection patientId={patient.patientId} authStatus={authStatus} />
      </div>
    </AccountShell>
  );
}

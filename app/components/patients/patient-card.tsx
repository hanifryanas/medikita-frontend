'use client';

import { Avatar } from '@/app/components/common';
import type { Patient } from '@/lib/types/patients';
import { UserRelationship } from '@/lib/types/users';
import styles from './patient-card.module.scss';

const RELATIONSHIP_LABELS: Record<UserRelationship, string> = {
  [UserRelationship.Self]: 'Self',
  [UserRelationship.Spouse]: 'Spouse',
  [UserRelationship.Child]: 'Child',
  [UserRelationship.Parent]: 'Parent',
  [UserRelationship.Sibling]: 'Sibling',
  [UserRelationship.Other]: 'Other',
};

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard = ({ patient }: PatientCardProps) => {
  const fullName = `${patient.firstName} ${patient.lastName}`.trim();
  const relationship = patient.relationship ?? UserRelationship.Other;
  const isSelf = relationship === UserRelationship.Self;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <Avatar
          name={{ firstName: patient.firstName, lastName: patient.lastName, fallback: '?' }}
          size={52}
        />
        <div className={styles.identity}>
          <h2 className={styles.name}>{fullName}</h2>
          <p className={styles.meta}>
            <span>MRN {patient.medicalRecordNumber}</span>
            <span aria-hidden>•</span>
            <span>{patient.age} yrs</span>
            <span aria-hidden>•</span>
            <span>{patient.gender === 'male' ? 'Male' : 'Female'}</span>
          </p>
        </div>
        <span className={`${styles.relationshipBadge} ${isSelf ? styles.relationshipSelf : ''}`}>
          {RELATIONSHIP_LABELS[relationship]}
        </span>
      </div>

      <dl className={styles.details}>
        <div>
          <dt>Phone</dt>
          <dd>{patient.phoneNumber}</dd>
        </div>
        <div>
          <dt>Date of birth</dt>
          <dd>{patient.dateOfBirth}</dd>
        </div>
        {patient.address && (
          <div className={styles.detailFull}>
            <dt>Address</dt>
            <dd>{patient.address}</dd>
          </div>
        )}
      </dl>
    </article>
  );
};

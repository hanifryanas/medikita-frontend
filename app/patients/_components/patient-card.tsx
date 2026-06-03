'use client';

import { Avatar, CardMenu, type CardMenuItem } from '@/app/components/common';
import type { Patient } from '@/lib/types/patients';
import { UserRelationship } from '@/lib/types/users';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';
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
  reorderControls?: {
    canMoveUp: boolean;
    canMoveDown: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
  };
  menuItems?: CardMenuItem[];
  /**
   * Optional footer slot rendered below the patient details. Used by the
   * patients page to mount `<PatientInsuranceSection />`; kept as a slot so
   * `PatientCard` stays reusable in non-authenticated previews (e.g. the
   * link-existing-patient lookup result) where insurance editing must not
   * be exposed.
   */
  footer?: ReactNode;
}

export const PatientCard = ({ patient, reorderControls, menuItems, footer }: PatientCardProps) => {
  const fullName = `${patient.firstName} ${patient.lastName}`.trim();
  const relationship = patient.relationship ?? UserRelationship.Other;
  const isSelf = relationship === UserRelationship.Self;

  return (
    <article className={`${styles.card} ${reorderControls ? styles.cardReorder : ''}`}>
      {reorderControls && (
        <div className={styles.reorderRail} aria-label='Reorder controls'>
          <button
            type='button'
            className={styles.reorderBtn}
            onClick={reorderControls.onMoveUp}
            disabled={!reorderControls.canMoveUp}
            aria-label={`Move ${fullName} up`}
          >
            <ChevronUp size={16} aria-hidden='true' />
          </button>
          <button
            type='button'
            className={styles.reorderBtn}
            onClick={reorderControls.onMoveDown}
            disabled={!reorderControls.canMoveDown}
            aria-label={`Move ${fullName} down`}
          >
            <ChevronDown size={16} aria-hidden='true' />
          </button>
        </div>
      )}
      <div className={styles.body}>
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
          {menuItems && menuItems.length > 0 && (
            <CardMenu items={menuItems} ariaLabel={`Actions for ${fullName}`} />
          )}
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
              <dd className={styles.addressValue} title={patient.address}>
                {patient.address}
              </dd>
            </div>
          )}
        </dl>
        {footer}
      </div>
    </article>
  );
};

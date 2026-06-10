'use client';

import { Avatar, CardMenu, type CardMenuItem } from '@/app/components/common';
import type { Patient } from '@/lib/types/patients';
import { UserRelationship } from '@/lib/types/users';
import { formatFullName, USER_RELATIONSHIP_LABEL } from '@/lib/utils/formatters';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import styles from './patient-card.module.scss';

interface PatientCardProps {
  patient: Patient;
  reorderControls?: {
    canMoveUp: boolean;
    canMoveDown: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
  };
  menuItems?: CardMenuItem[];
  footer?: ReactNode;
}

export const PatientCard = ({ patient, reorderControls, menuItems, footer }: PatientCardProps) => {
  const router = useRouter();
  const fullName = formatFullName(patient);
  const relationship = patient.relationship ?? UserRelationship.Other;
  const isSelf = relationship === UserRelationship.Self;
  const isClickable = !reorderControls;

  const handleOpen = () => router.push(`/patients/${patient.patientId}`);

  const isInteractiveTarget = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    !!target.closest('button, a, input, select, textarea, [data-no-card-nav]');

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!isClickable) return;
    if (isInteractiveTarget(e.target)) return;
    handleOpen();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!isClickable) return;
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <article
      className={`${styles.card} ${reorderControls ? styles.cardReorder : ''} ${
        isClickable ? styles.cardClickable : ''
      }`}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `Open ${fullName} details` : undefined}
    >
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
            {USER_RELATIONSHIP_LABEL[relationship]}
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
        {footer && <div data-no-card-nav>{footer}</div>}
      </div>
    </article>
  );
};

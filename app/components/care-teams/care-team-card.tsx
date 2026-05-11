'use client';

import type { Doctor } from '@/lib/types/doctors';
import { formatDay, getUserInitial } from '@/lib/utils/formatters';
import styles from './care-team-card.module.scss';

interface CareTeamCardProps {
  doctor: Doctor;
  className?: string;
}

export const CareTeamCard = ({ doctor, className }: CareTeamCardProps) => {
  const name = doctor.fullName;
  const departmentName = doctor.employee?.departmentTypeCode ?? '—';
  const days = doctor.scheduleDays ?? [];

  const rootClass = [styles.card, className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <div className={styles.cardHeader}>
        <span className={styles.avatar} aria-hidden>
          {getUserInitial({ fullName: name, fallback: '?' })}
        </span>
        <div>
          <h2 className={styles.cardName}>{name}</h2>
          <p className={styles.cardRole}>{doctor.jobTitle ?? 'Doctor'}</p>
        </div>
      </div>
      <span className={`${styles.roleBadge} ${styles.roleBadgeDoctor}`}>doctor</span>
      <div className={styles.cardMeta}>
        <span>
          Department: <strong>{departmentName}</strong>
        </span>
      </div>
      <div className={styles.dayTags} aria-label='Scheduled days'>
        {days.map((day) => (
          <span key={day} className={styles.dayTag}>
            {formatDay(day)}
          </span>
        ))}
      </div>
    </div>
  );
};

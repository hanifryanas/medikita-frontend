'use client';

import { Day } from '@/lib/types/common';
import type { Doctor } from '@/lib/types/doctors';
import { getUserInitial } from '@/lib/utils/formatters';
import styles from './care-team-card.module.scss';

const DAY_SHORT: Record<Day, string> = {
  [Day.Monday]: 'Mon',
  [Day.Tuesday]: 'Tue',
  [Day.Wednesday]: 'Wed',
  [Day.Thursday]: 'Thu',
  [Day.Friday]: 'Fri',
  [Day.Saturday]: 'Sat',
  [Day.Sunday]: 'Sun',
};

const getDoctorName = (d: Doctor) => {
  const employee = d.employee;
  const fullName =
    employee?.fullName ||
    [employee?.user?.firstName, employee?.user?.lastName].filter(Boolean).join(' ') ||
    'Unknown';
  return d.title ? `${d.title} ${fullName}` : fullName;
};

interface CareTeamCardProps {
  doctor: Doctor;
  className?: string;
}

export const CareTeamCard = ({ doctor, className }: CareTeamCardProps) => {
  const name = getDoctorName(doctor);
  const cleanName = name.replace(/^(Dr\.?|dr\.?)\s+/, '');
  const [first, second] = cleanName.split(' ');
  const departmentName = doctor.employee?.department?.displayName ?? '—';
  const days = doctor.scheduleDays ?? [];

  const rootClass = [styles.card, className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <div className={styles.cardHeader}>
        <span className={styles.avatar} aria-hidden>
          {getUserInitial(first, second, '?')}
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
            {DAY_SHORT[day]}
          </span>
        ))}
      </div>
    </div>
  );
};

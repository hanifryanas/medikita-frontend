'use client';

import { Avatar } from '@/app/components/common';
import { useStores } from '@/lib/stores';
import { CareTeam } from '@/lib/types/care-teams';
import { formatDay } from '@/lib/utils/formatters';
import styles from './care-team-card.module.scss';

interface CareTeamCardProps {
  careTeam: CareTeam;
  className?: string;
}

export const CareTeamCard = ({ careTeam, className }: CareTeamCardProps) => {
  const {
    departmentStore: { getDepartmentByTypeCode },
  } = useStores();

  const name = careTeam.displayName;
  const departmentName = getDepartmentByTypeCode(careTeam.departmentTypeCode)?.displayName ?? '—';
  const days = careTeam.schedules?.map((s) => s.day) ?? [];

  const rootClass = [styles.card, className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <div className={styles.cardHeader}>
        <Avatar
          photoUrl={careTeam.photoUrl}
          name={{ fullName: name, fallback: '?' }}
          size={56}
          className={styles.avatar}
        />
        <div>
          <h2 className={styles.cardName}>{name}</h2>
          <p className={styles.cardRole}>{careTeam.jobTitle ?? 'Doctor'}</p>
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

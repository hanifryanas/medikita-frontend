'use client';

import { Avatar } from '@/app/components/common';
import { useStores } from '@/lib/stores';
import { CareTeam, careTeamRoleToSegment } from '@/lib/types/care-teams';
import { EmployeeRole } from '@/lib/types/employees';
import { formatDay } from '@/lib/utils/formatters';
import Link from 'next/link';
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
  const days = careTeam.scheduleDays ?? [];

  const rootClass = [styles.card, className].filter(Boolean).join(' ');
  const href = `/care-teams/${careTeamRoleToSegment(careTeam.role)}/${careTeam.careTeamId}`;

  return (
    <Link href={href} className={rootClass}>
      <div className={styles.cardHeader}>
        <Avatar
          photoUrl={careTeam.photoUrl}
          name={{ fullName: name, fallback: '?' }}
          size={56}
          className={styles.avatar}
        />
        <div>
          <h2 className={styles.cardName}>{name}</h2>
          <p className={styles.cardRole}>{careTeam.jobTitle ?? careTeam.role}</p>
        </div>
      </div>
      <span
        className={`${styles.roleBadge} ${
          careTeam.role === EmployeeRole.Nurse ? styles.roleBadgeNurse : styles.roleBadgeDoctor
        }`}
      >
        {careTeam.role}
      </span>
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
    </Link>
  );
};

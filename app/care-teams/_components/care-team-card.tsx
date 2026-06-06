'use client';

import { Avatar } from '@/app/components/common';
import { DepartmentIcon } from '@/app/components/departments';
import { useStores } from '@/lib/stores';
import { CareTeam, careTeamRoleToSegment } from '@/lib/types/care-teams';
import { EmployeeRole } from '@/lib/types/employees';
import { joinClassNames } from '@/lib/utils/class-names';
import { formatDay } from '@/lib/utils/formatters';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';
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
  // Prefer values baked in server-side; fall back to the client store once it hydrates.
  const storeDepartment = getDepartmentByTypeCode(careTeam.departmentTypeCode);
  const departmentName = careTeam.departmentName ?? storeDepartment?.displayName;
  const departmentIconName = careTeam.departmentIconName ?? storeDepartment?.iconName;
  const days = careTeam.scheduleDays ?? [];

  const rootClass = joinClassNames(styles.card, className);
  const href = `/care-teams/${careTeamRoleToSegment(careTeam.role)}/${careTeam.careTeamId}`;

  return (
    <Link href={href} className={rootClass}>
      <div className={styles.cardHeader}>
        <ViewTransition name={`care-team-avatar-${careTeam.careTeamId}`}>
          <Avatar
            photoUrl={careTeam.photoUrl}
            name={{ fullName: name, fallback: '?' }}
            size={56}
            className={styles.avatar}
          />
        </ViewTransition>
        <div className={styles.identity}>
          <ViewTransition name={`care-team-name-${careTeam.careTeamId}`}>
            <h2 className={styles.cardName}>{name}</h2>
          </ViewTransition>
          <p className={styles.cardRole}>{careTeam.jobTitle ?? careTeam.role}</p>
        </div>
      </div>

      <div className={styles.roleRow}>
        <span
          className={`${styles.roleBadge} ${
            careTeam.role === EmployeeRole.Nurse ? styles.roleBadgeNurse : styles.roleBadgeDoctor
          }`}
        >
          {careTeam.role}
        </span>
      </div>

      {departmentName && (
        <div className={styles.departmentRow}>
          <span className={styles.departmentChip} title={departmentName}>
            <span className={styles.departmentChipIcon} aria-hidden>
              <DepartmentIcon name={departmentIconName} size={12} strokeWidth={2} />
            </span>
            <span className={styles.departmentChipText}>{departmentName}</span>
          </span>
        </div>
      )}

      {days.length > 0 && (
        <div className={styles.schedule}>
          <span className={styles.scheduleLabel}>
            <CalendarDays size={12} aria-hidden />
            Available
          </span>
          <div className={styles.dayTags} aria-label='Scheduled days'>
            {days.map((day) => (
              <span key={day} className={styles.dayTag}>
                {formatDay(day)}
              </span>
            ))}
          </div>
        </div>
      )}
    </Link>
  );
};

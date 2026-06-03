'use client';

import { Avatar } from '@/app/components/common';
import type { DetailedCareTeam } from '@/lib/types/care-teams';
import type { Department } from '@/lib/types/departments';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';
import styles from '../page.module.scss';

interface ProfileCardProps {
  careTeam: DetailedCareTeam;
  roleLabel: string;
  department?: Department;
}

export const ProfileCard = ({ careTeam, roleLabel, department }: ProfileCardProps) => (
  <section className={styles.profileCard} aria-label='Care team information'>
    <div className={styles.profileGlow} aria-hidden />
    <div className={styles.profilePhoto}>
      <Avatar
        photoUrl={careTeam.photoUrl}
        name={{ fullName: careTeam.displayName, fallback: '?' }}
        size={240}
        className={styles.profileAvatar}
        imageClassName={styles.profileAvatarImage}
        initialClassName={styles.profileAvatarInitial}
      />
    </div>

    <div className={styles.profileBody}>
      <span className={styles.eyebrow}>
        <Stethoscope size={12} />
        {roleLabel}
      </span>
      <h1 className={styles.profileName}>{careTeam.displayName}</h1>
      {careTeam.jobTitle && <p className={styles.profileJob}>{careTeam.jobTitle}</p>}

      <dl className={styles.profileStats}>
        {careTeam.employmentDuration && (
          <div className={styles.statItem}>
            <dt className={styles.statLabel}>Experience</dt>
            <dd className={styles.statValue}>{careTeam.employmentDuration}</dd>
          </div>
        )}
        {department && (
          <div className={styles.statItem}>
            <dt className={styles.statLabel}>Department</dt>
            <dd className={styles.statValue}>
              <Link href={`/specialties/${department.typeCode}`} className={styles.statLink}>
                {department.displayName}
              </Link>
            </dd>
          </div>
        )}
      </dl>
    </div>
  </section>
);

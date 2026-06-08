'use client';

import { Avatar } from '@/app/components/common';
import type { DetailedCareTeam } from '@/lib/types/care-teams';
import type { Department } from '@/lib/types/departments';
import { BriefcaseMedical, CalendarClock, Stethoscope, UserRound, Users } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';
import styles from './profile-card.module.scss';

interface ProfileCardProps {
  careTeam: DetailedCareTeam;
  roleLabel: string;
  department?: Department;
}

export const ProfileCard = ({ careTeam, roleLabel, department }: ProfileCardProps) => (
  <section className={styles.profileCard} aria-label='Care team information'>
    <div className={styles.profileGlow} aria-hidden />
    <div className={styles.profilePhoto}>
      <ViewTransition name={`care-team-avatar-${careTeam.careTeamId}`}>
        <Avatar
          photoUrl={careTeam.photoUrl}
          name={{ fullName: careTeam.displayName, fallback: '?' }}
          size={240}
          className={styles.profileAvatar}
          imageClassName={styles.profileAvatarImage}
          initialClassName={styles.profileAvatarInitial}
        />
      </ViewTransition>
    </div>

    <div className={styles.profileBody}>
      <span className={styles.eyebrow}>
        <Stethoscope size={12} />
        {roleLabel}
      </span>
      <ViewTransition name={`care-team-name-${careTeam.careTeamId}`}>
        <h1 className={styles.profileName}>{careTeam.displayName}</h1>
      </ViewTransition>
      {careTeam.jobTitle && <p className={styles.profileJob}>{careTeam.jobTitle}</p>}

      <dl className={styles.profileStats}>
        {careTeam.employmentDuration && (
          <div className={styles.statItem}>
            <span className={styles.statIcon} aria-hidden>
              <CalendarClock size={16} />
            </span>
            <div className={styles.statBody}>
              <dt className={styles.statLabel}>Experience</dt>
              <dd className={styles.statValue}>{careTeam.employmentDuration}</dd>
            </div>
          </div>
        )}
        {typeof careTeam.age === 'number' && (
          <div className={styles.statItem}>
            <span className={styles.statIcon} aria-hidden>
              <UserRound size={16} />
            </span>
            <div className={styles.statBody}>
              <dt className={styles.statLabel}>Age</dt>
              <dd className={styles.statValue}>{careTeam.age} year(s)</dd>
            </div>
          </div>
        )}
        {typeof careTeam.patientCount === 'number' && (
          <div className={styles.statItem}>
            <span className={styles.statIcon} aria-hidden>
              <Users size={16} />
            </span>
            <div className={styles.statBody}>
              <dt className={styles.statLabel}>Patients</dt>
              <dd className={styles.statValue}>{careTeam.patientCount}</dd>
            </div>
          </div>
        )}
        {department && (
          <div className={styles.statItem}>
            <span className={styles.statIcon} aria-hidden>
              <BriefcaseMedical size={16} />
            </span>
            <div className={styles.statBody}>
              <dt className={styles.statLabel}>Department</dt>
              <dd className={styles.statValue}>
                <Link href={`/specialties/${department.typeCode}`} className={styles.statLink}>
                  {department.displayName}
                </Link>
              </dd>
            </div>
          </div>
        )}
      </dl>
    </div>
  </section>
);

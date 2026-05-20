'use client';

import { Avatar } from '@/app/components/common';
import { PublicNav } from '@/app/components/navigation';
import { useCareTeam } from '@/lib/hooks';
import { useStores } from '@/lib/stores';
import { isCareTeamRoleSegment, segmentToCareTeamRole } from '@/lib/types/care-teams';
import { EmployeeRole } from '@/lib/types/employees';
import { formatDay } from '@/lib/utils/formatters';
import { CalendarClock, CalendarPlus, ChevronLeft, Clock3, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.scss';

const trimSeconds = (time: string) => time.slice(0, 5);

export default function CareTeamDetailPage() {
  const params = useParams<{ role: string; id: string }>();
  const roleSegment = params?.role;
  const id = params?.id;

  const role =
    roleSegment && isCareTeamRoleSegment(roleSegment)
      ? segmentToCareTeamRole(roleSegment)
      : undefined;

  const careTeam = useCareTeam(role, id);
  const {
    doctorStore: { isLoading, isLoaded },
    departmentStore: { getDepartmentByTypeCode },
  } = useStores();

  const department = careTeam ? getDepartmentByTypeCode(careTeam.departmentTypeCode) : undefined;
  const roleLabel = role === EmployeeRole.Nurse ? 'Nurse' : 'Doctor';

  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.content}>
        <Link href='/care-teams' className={styles.back}>
          <ChevronLeft size={16} />
          Back to care teams
        </Link>

        {!role && (
          <div className={styles.empty}>
            Unknown role &ldquo;{roleSegment}&rdquo;. Expected &ldquo;doctors&rdquo; or
            &ldquo;nurses&rdquo;.
          </div>
        )}

        {role && isLoading && !isLoaded && <div className={styles.empty}>Loading…</div>}

        {role && isLoaded && !careTeam && (
          <div className={styles.empty}>
            We couldn&apos;t find a {roleLabel.toLowerCase()} for &ldquo;{id}&rdquo;.
          </div>
        )}

        {careTeam && (
          <div className={styles.layout}>
            {/* ─── LEFT: profile card ─────────────────────────────── */}
            <aside className={styles.profileCard}>
              <div className={styles.profileGlow} aria-hidden />
              <div className={styles.profilePhoto}>
                <Avatar
                  photoUrl={careTeam.photoUrl}
                  name={{ fullName: careTeam.displayName, fallback: '?' }}
                  size={280}
                  className={styles.profileAvatar}
                  imageClassName={styles.profileAvatarImage}
                  initialClassName={styles.profileAvatarInitial}
                />
              </div>

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
                      <Link
                        href={`/specialties/${department.typeCode}`}
                        className={styles.statLink}
                      >
                        {department.displayName}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            </aside>

            {/* ─── RIGHT: schedule card ───────────────────────────── */}
            <section className={styles.scheduleCard} aria-labelledby='schedule-title'>
              <div className={styles.sectionHead}>
                <CalendarClock size={18} className={styles.sectionIcon} />
                <div>
                  <h2 id='schedule-title' className={styles.sectionTitle}>
                    Weekly schedule
                  </h2>
                  <p className={styles.sectionSubtitle}>Pick a slot below to book directly.</p>
                </div>
              </div>

              {careTeam.schedules.length === 0 ? (
                <p className={styles.empty}>No schedule available.</p>
              ) : (
                <ol className={styles.scheduleList}>
                  {careTeam.schedules.map((s) => {
                    const disabled = Boolean(s.isDisabled);
                    return (
                      <li
                        key={`${s.day}-${s.startTime}`}
                        className={`${styles.scheduleItem} ${disabled ? styles.scheduleItemDisabled : ''}`}
                      >
                        <div className={styles.scheduleInfo}>
                          <span className={styles.scheduleDayName}>{formatDay(s.day)}</span>
                          <span className={styles.scheduleTimeBlock}>
                            <Clock3 size={13} className={styles.scheduleTimeIcon} />
                            {trimSeconds(s.startTime)} – {trimSeconds(s.endTime)}
                          </span>
                        </div>

                        {disabled ? (
                          <button
                            type='button'
                            className={`${styles.bookCta} ${styles.bookCtaDisabled}`}
                            disabled
                            aria-label='This slot is fully booked'
                          >
                            Fully booked
                          </button>
                        ) : (
                          <Link
                            href={`/appointments?careTeam=${careTeam.careTeamId}&day=${s.day}`}
                            className={styles.bookCta}
                          >
                            <CalendarPlus size={14} />
                            Book Appointment
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

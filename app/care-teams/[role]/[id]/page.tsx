'use client';

import { Avatar } from '@/app/components/common';
import { PublicNav } from '@/app/components/navigation';
import { useCareTeam, useCareTeamSchedule } from '@/lib/hooks';
import { useStores } from '@/lib/stores';
import { useOtherPatients, useSelfPatient } from '@/lib/stores/patient-store';
import { AuthStatus } from '@/lib/types/auth';
import { isCareTeamRoleSegment, segmentToCareTeamRole } from '@/lib/types/care-teams';
import { EmployeeRole } from '@/lib/types/employees';
import {
  dayOfMonthFormat,
  formatDate,
  weekdayLongFormat,
  weekdayShortFormat,
} from '@/lib/utils/formatters';
import { CalendarPlus, ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PatientPickerDialog } from './_components';
import styles from './page.module.scss';

const trimSeconds = (time: string) => time.slice(0, 5);

export default function CareTeamDetailPage() {
  const router = useRouter();
  const params = useParams<{ role: string; id: string }>();
  const roleSegment = params?.role;
  const id = params?.id;

  const role =
    roleSegment && isCareTeamRoleSegment(roleSegment)
      ? segmentToCareTeamRole(roleSegment)
      : undefined;

  const { careTeam, isLoading, isLoaded } = useCareTeam(role, id);
  const {
    departmentStore: { getDepartmentByTypeCode },
    authStore: { status: authStatus },
    patientStore: { isLoading: isPatientsLoading },
  } = useStores();
  const selfPatient = useSelfPatient();
  const otherPatients = useOtherPatients();
  const patients = useMemo(
    () => (selfPatient ? [selfPatient, ...otherPatients] : otherPatients),
    [selfPatient, otherPatients]
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const department = careTeam ? getDepartmentByTypeCode(careTeam.departmentTypeCode) : undefined;
  const roleLabel = role === EmployeeRole.Nurse ? 'Nurse' : 'Doctor';
  const isDoctor = role === EmployeeRole.Doctor;

  const {
    today,
    stripStart,
    dates,
    shiftStrip,
    scheduleByDayIndex,
    hasSchedule,
    selectedDateKey,
    setSelectedDateKey,
    selectedDate,
    selectedSchedule,
    selectedTime,
    setSelectedTime,
    slots,
    bookedSlots,
    monthLabel,
    canBook,
  } = useCareTeamSchedule(careTeam, role);

  const buildBookingHref = (patientId: string, concern: string | null) => {
    if (!careTeam || !selectedDate || !selectedTime) return '#';
    const params = new URLSearchParams({
      careTeam: careTeam.careTeamId,
      date: formatDate(selectedDate),
      time: selectedTime,
      patient: patientId,
    });
    if (concern) params.set('concern', concern);
    return `/appointments?${params.toString()}`;
  };

  const handleBookingClick = () => {
    if (!canBook) return;
    if (authStatus !== AuthStatus.Authenticated) {
      const next = `${window.location.pathname}${window.location.search}`;
      router.push(`/signin?next=${encodeURIComponent(next)}`);
      return;
    }
    setIsPickerOpen(true);
  };

  const handlePatientConfirm = (patientId: string, concern: string | null) => {
    setIsPickerOpen(false);
    router.push(buildBookingHref(patientId, concern));
  };

  return (
    <div className={styles.page}>
      <PublicNav />
      <main className={styles.content}>
        <Link
          href='/care-teams'
          className={styles.back}
          onClick={(e) => {
            if (window.history.length > 1) {
              e.preventDefault();
              router.back();
            }
          }}
        >
          <ChevronLeft size={16} />
          Back
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
          <>
            {/* ─── Section 1: care-team information ───────────── */}
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
              </div>
            </section>

            {/* ─── Section 2: appointment picker ──────────────── */}
            <section className={styles.scheduleCard} aria-labelledby='schedule-title'>
              <header className={styles.scheduleHead}>
                <h2 id='schedule-title' className={styles.sectionTitle}>
                  Schedule of Availability
                </h2>
                <div className={styles.monthNav}>
                  <button
                    type='button'
                    className={styles.monthNavBtn}
                    onClick={() => shiftStrip(-7)}
                    disabled={stripStart.getTime() <= today.getTime()}
                    aria-label='Previous week'
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className={styles.monthLabel}>{monthLabel}</span>
                  <button
                    type='button'
                    className={styles.monthNavBtn}
                    onClick={() => shiftStrip(7)}
                    aria-label='Next week'
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </header>

              {!hasSchedule ? (
                <p className={styles.empty}>No schedule available.</p>
              ) : (
                <>
                  <div className={styles.dateStrip} role='radiogroup' aria-label='Available dates'>
                    {dates.map((d) => {
                      const isAvailable = scheduleByDayIndex.has(d.getDay());
                      const isSelected = selectedDateKey === d.toISOString();
                      const isToday = d.getTime() === today.getTime();
                      return (
                        <button
                          key={d.toISOString()}
                          type='button'
                          role='radio'
                          aria-checked={isSelected}
                          disabled={!isAvailable}
                          onClick={() => setSelectedDateKey(d.toISOString())}
                          className={[
                            styles.datePill,
                            isSelected && styles.datePillSelected,
                            !isAvailable && styles.datePillDisabled,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <span className={styles.datePillDay}>
                            {formatDate(d, weekdayShortFormat)}
                          </span>
                          <span className={styles.datePillNumber}>
                            {formatDate(d, dayOfMonthFormat)}
                          </span>
                          {isToday && <span className={styles.todayDot} aria-hidden />}
                        </button>
                      );
                    })}
                  </div>

                  {selectedSchedule ? (
                    isDoctor ? (
                      <>
                        <div
                          className={styles.slotsRow}
                          role='radiogroup'
                          aria-label='Available times'
                        >
                          {slots.length === 0 ? (
                            <span className={styles.slotsEmpty}>
                              Window: {trimSeconds(selectedSchedule.startTime)} –{' '}
                              {trimSeconds(selectedSchedule.endTime)}
                            </span>
                          ) : (
                            slots.map((t) => {
                              const isSelected = selectedTime === t;
                              const isBooked = bookedSlots.has(t);
                              return (
                                <button
                                  key={t}
                                  type='button'
                                  role='radio'
                                  aria-checked={isSelected}
                                  disabled={isBooked}
                                  aria-label={isBooked ? `${t} (booked)` : t}
                                  onClick={() => !isBooked && setSelectedTime(t)}
                                  className={[
                                    styles.slotPill,
                                    isSelected && !isBooked && styles.slotPillSelected,
                                    isBooked && styles.slotPillDisabled,
                                  ]
                                    .filter(Boolean)
                                    .join(' ')}
                                >
                                  {t}
                                </button>
                              );
                            })
                          )}
                        </div>

                        <button
                          type='button'
                          disabled={!canBook}
                          aria-disabled={!canBook}
                          onClick={handleBookingClick}
                          className={`${styles.bookCta} ${!canBook ? styles.bookCtaDisabled : ''}`}
                        >
                          <CalendarPlus size={16} />
                          Book Appointment
                        </button>
                      </>
                    ) : null
                  ) : (
                    <p className={styles.slotsEmpty}>
                      {selectedDate
                        ? `${roleLabel} not available on ${formatDate(selectedDate, weekdayLongFormat)}.`
                        : 'No available days in this week.'}
                    </p>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </main>

      <PatientPickerDialog
        open={isPickerOpen}
        patients={patients}
        isLoading={isPatientsLoading}
        onClose={() => setIsPickerOpen(false)}
        onConfirm={handlePatientConfirm}
      />
    </div>
  );
}

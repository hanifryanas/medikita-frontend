'use client';

import { Avatar } from '@/app/components/common';
import { PublicNav } from '@/app/components/navigation';
import { useCareTeam } from '@/lib/hooks';
import { useStores } from '@/lib/stores';
import { isCareTeamRoleSegment, segmentToCareTeamRole } from '@/lib/types/care-teams';
import { Day, Schedule } from '@/lib/types/common';
import { EmployeeRole } from '@/lib/types/employees';
import { format } from 'date-fns';
import { CalendarPlus, ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import styles from './page.module.scss';

// ─── Helpers ─────────────────────────────────────────────
const DAY_INDEX: Record<Day, number> = {
  [Day.Sunday]: 0,
  [Day.Monday]: 1,
  [Day.Tuesday]: 2,
  [Day.Wednesday]: 3,
  [Day.Thursday]: 4,
  [Day.Friday]: 5,
  [Day.Saturday]: 6,
};

const INDEX_TO_DAY: Day[] = [
  Day.Sunday,
  Day.Monday,
  Day.Tuesday,
  Day.Wednesday,
  Day.Thursday,
  Day.Friday,
  Day.Saturday,
];

const trimSeconds = (time: string) => time.slice(0, 5);

/** Build hourly slots between start (inclusive) and end (exclusive). */
const buildSlots = (start: string, end: string): string[] => {
  const [sH, sM] = start.split(':').map(Number);
  const [eH] = end.split(':').map(Number);
  const slots: string[] = [];
  let h = sH;
  while (h < eH) {
    slots.push(`${String(h).padStart(2, '0')}:${String(sM ?? 0).padStart(2, '0')}`);
    h += 1;
  }
  return slots;
};

const buildDateStrip = (from: Date, length = 7): Date[] =>
  Array.from({ length }, (_, i) => {
    const d = new Date(from);
    d.setDate(from.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

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

  // ─── Date strip state (7 days starting from `stripStart`) ───────
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [stripStart, setStripStart] = useState<Date>(today);
  const dates = useMemo(() => buildDateStrip(stripStart), [stripStart]);

  // Map weekday-index → enabled schedule
  const scheduleByDayIndex = useMemo(() => {
    const map = new Map<number, Schedule>();
    for (const s of careTeam?.schedules ?? []) {
      if (!s.isDisabled) map.set(DAY_INDEX[s.day], s);
    }
    return map;
  }, [careTeam]);

  // First available date in the current strip, or `null` if none
  const firstAvailableDate = useMemo(
    () => dates.find((d) => scheduleByDayIndex.has(d.getDay())) ?? null,
    [dates, scheduleByDayIndex]
  );

  // ─── Selection state with derived-default reset pattern ─────────
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(
    firstAvailableDate ? firstAvailableDate.toISOString() : null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Reset selected date when strip changes and current selection isn't in range
  const stripKey = `${stripStart.toISOString()}|${careTeam?.careTeamId ?? ''}`;
  const [lastStripKey, setLastStripKey] = useState(stripKey);
  if (lastStripKey !== stripKey) {
    setLastStripKey(stripKey);
    const fallback = firstAvailableDate ? firstAvailableDate.toISOString() : null;
    setSelectedDateKey(fallback);
    setSelectedTime(null);
  }

  const selectedDate = useMemo(
    () => (selectedDateKey ? new Date(selectedDateKey) : null),
    [selectedDateKey]
  );
  const selectedSchedule = selectedDate ? scheduleByDayIndex.get(selectedDate.getDay()) : undefined;
  const slots = useMemo(
    () =>
      selectedSchedule ? buildSlots(selectedSchedule.startTime, selectedSchedule.endTime) : [],
    [selectedSchedule]
  );

  // Reset selected time when slots change and current pick no longer valid
  const slotsKey = slots.join(',');
  const [lastSlotsKey, setLastSlotsKey] = useState(slotsKey);
  if (lastSlotsKey !== slotsKey) {
    setLastSlotsKey(slotsKey);
    setSelectedTime(slots[0] ?? null);
  }

  const monthLabel = useMemo(() => {
    const ref = selectedDate ?? dates[0];
    return format(ref, 'MMMM yyyy');
  }, [selectedDate, dates]);

  const canBook = Boolean(selectedDate && selectedSchedule && selectedTime);
  const bookingHref =
    canBook && careTeam && selectedDate && selectedTime
      ? `/appointments?careTeam=${careTeam.careTeamId}&date=${format(selectedDate, 'yyyy-MM-dd')}&time=${selectedTime}`
      : '#';

  const shiftStrip = (deltaDays: number) => {
    const next = new Date(stripStart);
    next.setDate(stripStart.getDate() + deltaDays);
    if (next < today) return; // don't go before today
    setStripStart(next);
  };

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

              {careTeam.schedules.length === 0 ? (
                <p className={styles.empty}>No schedule available.</p>
              ) : (
                <>
                  <div className={styles.dateStrip} role='radiogroup' aria-label='Available dates'>
                    {dates.map((d) => {
                      const idx = d.getDay();
                      const isAvailable = scheduleByDayIndex.has(idx);
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
                          <span className={styles.datePillDay}>{format(d, 'EEE')}</span>
                          <span className={styles.datePillNumber}>{format(d, 'd')}</span>
                          {isToday && <span className={styles.todayDot} aria-hidden />}
                        </button>
                      );
                    })}
                  </div>

                  {selectedSchedule ? (
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
                            return (
                              <button
                                key={t}
                                type='button'
                                role='radio'
                                aria-checked={isSelected}
                                onClick={() => setSelectedTime(t)}
                                className={`${styles.slotPill} ${isSelected ? styles.slotPillSelected : ''}`}
                              >
                                {t}
                              </button>
                            );
                          })
                        )}
                      </div>

                      <Link
                        href={bookingHref}
                        aria-disabled={!canBook}
                        tabIndex={canBook ? 0 : -1}
                        className={`${styles.bookCta} ${!canBook ? styles.bookCtaDisabled : ''}`}
                        onClick={(e) => {
                          if (!canBook) e.preventDefault();
                        }}
                      >
                        <CalendarPlus size={16} />
                        Book Appointment
                      </Link>
                    </>
                  ) : (
                    <p className={styles.slotsEmpty}>
                      {selectedDate
                        ? `${roleLabel} not available on ${format(selectedDate, 'EEEE')}.`
                        : 'No available days in this week.'}
                    </p>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

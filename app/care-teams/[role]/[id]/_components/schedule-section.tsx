'use client';

import type { UseCareTeamScheduleResult } from '@/lib/hooks/use-care-team-schedule';
import { joinClassNames } from '@/lib/utils/class-names';
import {
  dayOfMonthFormat,
  formatDate,
  weekdayLongFormat,
  weekdayShortFormat,
} from '@/lib/utils/formatters';
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../page.module.scss';

const trimSeconds = (time: string) => time.slice(0, 5);

interface ScheduleSectionProps {
  schedule: UseCareTeamScheduleResult;
  roleLabel: string;
  isDoctor: boolean;
  onBook: () => void;
}

export const ScheduleSection = ({
  schedule,
  roleLabel,
  isDoctor,
  onBook,
}: ScheduleSectionProps) => {
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
  } = schedule;

  return (
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
                  className={joinClassNames(
                    styles.datePill,
                    isSelected && styles.datePillSelected,
                    !isAvailable && styles.datePillDisabled
                  )}
                >
                  <span className={styles.datePillDay}>{formatDate(d, weekdayShortFormat)}</span>
                  <span className={styles.datePillNumber}>{formatDate(d, dayOfMonthFormat)}</span>
                  {isToday && <span className={styles.todayDot} aria-hidden />}
                </button>
              );
            })}
          </div>

          {!selectedSchedule ? (
            <p className={styles.slotsEmpty}>
              {selectedDate
                ? `${roleLabel} not available on ${formatDate(selectedDate, weekdayLongFormat)}.`
                : 'No available days in this week.'}
            </p>
          ) : isDoctor ? (
            <>
              <div className={styles.slotsRow} role='radiogroup' aria-label='Available times'>
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
                        className={joinClassNames(
                          styles.slotPill,
                          isSelected && !isBooked && styles.slotPillSelected,
                          isBooked && styles.slotPillDisabled
                        )}
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
                onClick={onBook}
                className={joinClassNames(styles.bookCta, !canBook && styles.bookCtaDisabled)}
              >
                <CalendarPlus size={16} />
                Book Appointment
              </button>
            </>
          ) : null}
        </>
      )}
    </section>
  );
};
